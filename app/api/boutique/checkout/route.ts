import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromBlob } from "@/lib/sessions";

export const runtime = "nodejs";

/*
  Le paiement d'une boutique cliente.

  Le navigateur n'envoie que des index et des quantités : les noms et les prix
  sont RELUS depuis la session côté serveur. Un client malveillant qui rejoue
  la requête avec « prix: 1 centime » n'a donc aucun levier — le prix vient du
  catalogue du marchand, jamais du panier.

  L'argent va au compte Stripe Connect du marchand (stripeAccount), pas au
  compte plateforme : Aevia n'encaisse rien pour le compte d'autrui.
*/

/** « 89 », « 89,90 € », « 1 250.00 » → centimes ; null si pas un prix ferme. */
export function prixEnCents(brut: string | undefined): number | null {
  if (!brut) return null;
  const nettoye = brut.replace(/[€$\s]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(nettoye)) return null;
  return Math.round(parseFloat(nettoye) * 100);
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Paiement non configuré" }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const corps = (await req.json().catch(() => null)) as {
    sessionId?: string;
    lignes?: { produitIndex?: number; quantite?: number }[];
  } | null;
  const sessionId = corps?.sessionId;
  const lignes = corps?.lignes;
  if (!sessionId || !Array.isArray(lignes) || lignes.length === 0 || lignes.length > 50) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const session = await getSessionFromBlob(sessionId);
  if (!session) return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
  const compte = session.businessProfile?.commerce?.stripeAccountId;
  if (!compte) return NextResponse.json({ error: "Cette boutique n'accepte pas encore le paiement en ligne" }, { status: 409 });
  const produits = session.businessProfile?.products ?? [];

  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const l of lignes) {
    const idx = l.produitIndex;
    const qte = l.quantite;
    if (typeof idx !== "number" || typeof qte !== "number" || qte < 1 || qte > 99) {
      return NextResponse.json({ error: "Ligne invalide" }, { status: 400 });
    }
    const p = produits[idx];
    const cents = prixEnCents(p?.price);
    if (!p || cents === null) {
      return NextResponse.json({ error: "Produit sans prix ferme" }, { status: 400 });
    }
    if (typeof p.stock === "number" && p.stock < qte) {
      return NextResponse.json({ error: `Stock insuffisant pour ${p.name}` }, { status: 409 });
    }
    items.push({
      quantity: qte,
      price_data: {
        currency: "eur",
        unit_amount: cents,
        product_data: { name: p.name, ...(p.description ? { description: p.description.slice(0, 300) } : {}) },
      },
    });
  }

  const frais = session.businessProfile?.commerce?.fraisLivraisonCents;
  if (typeof frais === "number" && frais > 0) {
    items.push({
      quantity: 1,
      price_data: { currency: "eur", unit_amount: frais, product_data: { name: "Livraison" } },
    });
  }

  const origine = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "https://aevia-launch.vercel.app";
  const retour = `${origine}/templates/${session.formData?.template ?? ""}?session=${sessionId}`;

  const checkout = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      locale: "fr",
      line_items: items,
      shipping_address_collection: { allowed_countries: ["FR", "BE", "CH", "LU", "MC"] },
      metadata: {
        aevia_session_id: sessionId,
        lignes: JSON.stringify(lignes.map((l) => ({ i: l.produitIndex, q: l.quantite }))),
      },
      success_url: `${retour}&achat=merci`,
      cancel_url: retour,
    },
    { stripeAccount: compte },
  );

  return NextResponse.json({ url: checkout.url });
}
