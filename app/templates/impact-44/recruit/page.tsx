"use client";
// @ts-nocheck
/*
  impact-44 / recruit — « Prendre rendez-vous ». L'ex-formulaire de tryout
  devient la page de contact du studio : coordonnées du contrat, déroulé
  d'un premier rendez-vous, praticité.
*/

import React, { useEffect, useState } from "react";
import { C } from "../shared";
import {
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientPhone,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const DEROULE = [
  {
    n: "01",
    titre: "Vous appelez, on écoute",
    texte: "Dix minutes au téléphone : le lieu, vos usages, votre budget. Si le studio n'est pas le bon interlocuteur, il vous le dit.",
  },
  {
    n: "02",
    titre: "La visite",
    texte: "Une heure sur place, mètre en main. On regarde la lumière, les volumes et ce qui coince vraiment au quotidien.",
  },
  {
    n: "03",
    titre: "La proposition",
    texte: "Sous une semaine : une direction, un périmètre, un prix écrit. Vous décidez — sans relance ni pression.",
  },
];

export default function RendezVousPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const tel = clientPhone(sessionData) ?? fd?.phone ?? "04 91 33 27 84";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "bonjour@espace-studio.fr";

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "60px 40px 120px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          <span style={{ color: C.sableFixe }}>06</span> / Rendez-vous
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact-page.titre") ?? (<>
          Parlons<br /><span style={{ color: C.sable }}>de chez vous.</span>
        </>)}</h1>
        <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 560, marginBottom: 56 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact-page.texte") ?? (<>
          Pas de formulaire à quatorze champs : un appel ou un courriel suffit. Le studio répond sous deux jours ouvrés.
        </>)}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 72 }}>
          <a href={telHref} style={{ padding: "18px 42px", background: C.sable, color: C.bg, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800 }}>
            {tel}
          </a>
          <a href={`mailto:${mail}`} style={{ padding: "18px 42px", border: `1px solid ${C.line}`, color: C.white, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, wordBreak: "break-all" }}>
            {mail}
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px,100%), 1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 72 }}>
          {DEROULE.map((e) => (
            <div key={e.n} style={{ background: C.gray, padding: "34px 30px" }}>
              <div className="i44-titre" style={{ fontSize: 40, fontWeight: 800, color: C.sableFixe, opacity: 0.5, marginBottom: 18 }}>{e.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>{e.titre}</h3>
              <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{e.texte}</p>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.line}`, padding: "clamp(26px,3.5vw,44px)", display: "flex", flexWrap: "wrap", gap: "20px 48px", fontSize: 13, color: C.textMid, lineHeight: 2 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 10 }}>La boutique-atelier</div>
            <div>{clientCodePostalVille(sessionData, "13001", "Marseille")}</div>
            <div>Sur rendez-vous, du mardi au samedi</div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 10 }}>Zone d'intervention</div>
            <div>{clientCity(sessionData) ?? "Marseille"} et ses environs</div>
            <div>Déplacements au-delà : sur devis</div>
          </div>
        </div>
      </div>
    </div>
  );
}
