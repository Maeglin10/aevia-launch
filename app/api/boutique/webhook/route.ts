import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromBlob, saveSessionToBlob } from "@/lib/sessions";
import { enregistrerCommande, type Commande, type LigneCommande } from "@/lib/boutique/commandes";
import { prixEnCents } from "@/app/api/boutique/checkout/route";

export const runtime = "nodejs";

/*
  L'arrivée d'un paiement de boutique cliente (webhook Stripe Connect).

  La signature est vérifiée avec le secret DÉDIÉ à cet endpoint
  (BOUTIQUE_STRIPE_WEBHOOK_SECRET) : celui du webhook « ventes Aevia » ne
  doit jamais valider ici, et réciproquement.

  On enregistre la commande, on décrémente le stock, puis on prévient le
  marchand — chaque étape est indépendante : un email qui échoue ne perd pas
  la commande.
*/
export async function POST(req: NextRequest) {
  const secret = process.env.BOUTIQUE_STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    return NextResponse.json({ error: "non configuré" }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "signature absente" }, { status: 400 });
  let evenement: Stripe.Event;
  try {
    evenement = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "signature invalide" }, { status: 400 });
  }

  if (evenement.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const checkout = evenement.data.object as Stripe.Checkout.Session;
  const sessionId = checkout.metadata?.aevia_session_id;
  if (!sessionId) return NextResponse.json({ received: true });

  const session = await getSessionFromBlob(sessionId);
  if (!session) return NextResponse.json({ received: true });
  const produits = session.businessProfile?.products ?? [];

  let brut: { i: number; q: number }[] = [];
  try {
    brut = JSON.parse(checkout.metadata?.lignes ?? "[]");
  } catch {}
  const lignes: LigneCommande[] = brut
    .filter((l) => produits[l.i])
    .map((l) => ({
      produitIndex: l.i,
      nom: produits[l.i].name,
      prixCents: prixEnCents(produits[l.i].price) ?? 0,
      quantite: l.q,
    }));

  const commande: Commande = {
    id: checkout.id.replace(/^cs_(live_|test_)?/, "cmd_"),
    sessionId,
    lignes,
    totalCents: checkout.amount_total ?? lignes.reduce((t, l) => t + l.prixCents * l.quantite, 0),
    devise: checkout.currency ?? "eur",
    emailAcheteur: checkout.customer_details?.email ?? undefined,
    nomAcheteur: checkout.customer_details?.name ?? undefined,
    adresseLivraison: checkout.collected_information?.shipping_details ?? undefined,
    stripeCheckoutSessionId: checkout.id,
    stripePaymentIntentId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : undefined,
    creeLe: new Date().toISOString(),
    statut: "payee",
  };
  await enregistrerCommande(commande);

  // Stock : décrément best-effort — la vente prime sur le compteur.
  try {
    let touche = false;
    for (const l of lignes) {
      const p = produits[l.produitIndex];
      if (p && typeof p.stock === "number") {
        p.stock = Math.max(0, p.stock - l.quantite);
        touche = true;
      }
    }
    if (touche) await saveSessionToBlob(sessionId, session);
  } catch {}

  // Prévenir le marchand, si un service d'email est configuré.
  try {
    const cle = process.env.RESEND_API_KEY;
    const emailMarchand = session.formData?.email;
    if (cle && emailMarchand) {
      const detail = lignes.map((l) => `- ${l.quantite} × ${l.nom} — ${(l.prixCents / 100).toFixed(2)} €`).join("\n");
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.BOUTIQUE_EMAIL_FROM ?? "Aevia Launch <onboarding@resend.dev>",
          to: emailMarchand,
          subject: `Nouvelle commande — ${((checkout.amount_total ?? 0) / 100).toFixed(2)} €`,
          text: `Vous avez une nouvelle commande sur votre site.\n\n${detail}\n\nTotal : ${((checkout.amount_total ?? 0) / 100).toFixed(2)} €\nAcheteur : ${commande.nomAcheteur ?? "?"} <${commande.emailAcheteur ?? "?"}>\n\nLe paiement est arrivé directement sur votre compte Stripe.`,
        }),
      });
    }
  } catch {}

  return NextResponse.json({ received: true });
}
