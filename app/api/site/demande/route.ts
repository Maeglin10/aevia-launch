import { NextRequest, NextResponse } from "next/server";
import { getSessionFromBlob } from "@/lib/sessions";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

/*
  Les demandes envoyées depuis le site d'un client.

  Constat qui a motivé cette route : sur au moins 113 thèmes, le formulaire de
  contact se contentait de `setSent(true)`. Le visiteur voyait « Message
  envoyé », le client ne recevait RIEN — ni email, ni trace. Pour un site
  vitrine vendu à un artisan, c'est le pire défaut possible : on lui vend des
  demandes entrantes et on les jette.

  La demande est ici : envoyée par email au client (adresse de sa session) et
  archivée dans le stockage — pour qu'aucune ne se perde si l'email échoue.
*/

const MAX = 4000;
const limite = new Map<string, { n: number; razA: number }>();

function tropDeRequetes(ip: string): boolean {
  const t = Date.now();
  const e = limite.get(ip);
  if (!e || t > e.razA) {
    limite.set(ip, { n: 1, razA: t + 60_000 });
    return false;
  }
  e.n++;
  return e.n > 6;
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  /* x-real-ip (posé par Vercel = IP reelle du pair) plutot que le PREMIER
     x-forwarded-for, controle par le client et donc trivial a faire tourner
     pour reinitialiser le limiteur (red-team 13/09). */
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "inconnue";
  if (tropDeRequetes(ip)) {
    return NextResponse.json({ error: "Trop de demandes — réessayez dans une minute." }, { status: 429 });
  }

  const corps = (await req.json().catch(() => null)) as {
    sessionId?: string;
    nom?: string;
    email?: string;
    telephone?: string;
    message?: string;
    sujet?: string;
    /** Champ piège : rempli = robot. */
    site?: string;
  } | null;

  if (!corps?.sessionId) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  if (corps.site) return NextResponse.json({ ok: true }); // robot : on acquiesce sans rien faire

  const nom = (corps.nom ?? "").toString().slice(0, 200).trim();
  const email = (corps.email ?? "").toString().slice(0, 200).trim();
  const telephone = (corps.telephone ?? "").toString().slice(0, 60).trim();
  const message = (corps.message ?? "").toString().slice(0, MAX).trim();
  const sujet = (corps.sujet ?? "").toString().slice(0, 200).trim();

  if (!message && !telephone && !email) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }

  const session = await getSessionFromBlob(corps.sessionId);
  if (!session) return NextResponse.json({ error: "Site introuvable" }, { status: 404 });

  const destinataire = session.formData?.email;
  const nomSite = session.formData?.businessName ?? "votre site";
  const recu = {
    recuLe: new Date().toISOString(),
    sessionId: corps.sessionId,
    nom,
    email,
    telephone,
    sujet,
    message,
  };

  /* Archivage d'abord : une demande écrite ne se perd pas, même si l'email
     échoue ensuite. Suffixe aléatoire — ces demandes portent des données
     personnelles et le stockage est public par chemin. */
  let archivee = false;
  try {
    await put(`demandes/${corps.sessionId}/${Date.now()}.json`, JSON.stringify(recu), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
    archivee = true;
  } catch {
    /* on tente quand même l'email */
  }

  let envoye = false;
  const cle = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Aevia Launch <onboarding@resend.dev>";
  if (cle && destinataire) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: destinataire,
          ...(email ? { reply_to: email } : {}),
          subject: `Nouvelle demande depuis ${nomSite}${sujet ? ` — ${sujet}` : ""}`,
          html:
            `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7">` +
            `<p><strong>Nouvelle demande reçue depuis votre site.</strong></p>` +
            (nom ? `<p><strong>Nom :</strong> ${esc(nom)}</p>` : "") +
            (email ? `<p><strong>Email :</strong> ${esc(email)}</p>` : "") +
            (telephone ? `<p><strong>Téléphone :</strong> ${esc(telephone)}</p>` : "") +
            (sujet ? `<p><strong>Sujet :</strong> ${esc(sujet)}</p>` : "") +
            (message ? `<p><strong>Message :</strong><br/>${esc(message).replace(/\n/g, "<br/>")}</p>` : "") +
            `<p style="color:#71717a;font-size:12.5px">Répondez directement à cet email pour joindre la personne.</p>` +
            `</div>`,
        }),
      });
      envoye = r.ok;
    } catch {
      envoye = false;
    }
  }

  /*
    2026-09-13 — « archivé » comptait comme « remis ». Si l'email au client
    échouait (clé absente, adresse absente, Resend en panne), la demande
    finissait dans un blob que RIEN ne relisait : le visiteur croyait avoir
    écrit, le client concluait que son site ne générait aucun contact, et
    personne ne savait qu'un prospect était perdu. Une remise ratée alerte
    désormais l'administrateur, avec de quoi rejouer la remise à la main —
    même mécanisme que les alertes du webhook de paiement.
  */
  if (!envoye && cle) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: process.env.ADMIN_EMAIL ?? "v.milliand@gmail.com",
          subject: `[Launch] Demande NON remise — ${nomSite} (${corps.sessionId})`,
          html:
            `<p>Une demande de prospect n'a pas pu être remise au client.</p>` +
            `<p><strong>Site :</strong> ${esc(nomSite)} · session ${esc(corps.sessionId)}</p>` +
            `<p><strong>Destinataire prévu :</strong> ${esc(destinataire ?? "ABSENT de la session")}</p>` +
            `<p><strong>Archivée :</strong> ${archivee ? "oui (demandes/" + esc(corps.sessionId) + "/)" : "NON — contenu ci-dessous"}</p>` +
            (archivee ? "" : `<pre>${esc(JSON.stringify(recu, null, 2))}</pre>`) +
            `<p>Rejouer la remise à la main, puis répondre au prospect.</p>`,
        }),
      });
    } catch {
      /* l'alerte est un filet, pas une condition */
    }
  }

  /* On ne ment jamais au visiteur : si rien n'est parti ET rien n'est
     archivé, il doit le savoir et pouvoir téléphoner. */
  if (!envoye && !archivee) {
    return NextResponse.json({ error: "Envoi impossible pour le moment" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, envoye, archivee });
}
