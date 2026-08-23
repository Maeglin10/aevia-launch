"use client";
// @ts-nocheck
/*
  impact-44 / bracket — « Les réalisations ». L'ex-arbre de tournoi devient
  la liste des lieux livrés. Câblée clientWorks (titres, types, images) et
  bp.beforeAfter quand le client en a fourni.
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, REALISATIONS, AMBIANCES } from "../shared";
import { clientText, clientWorks } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function RealisationsPage() {
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

  const LIEUX = /* REALISATIONS */ resolveList(
    clientWorks(sessionData)?.map((o: any, i: number) => ({
      ...REALISATIONS[i % REALISATIONS.length],
      nom: o.title,
      ...(o.detail ? { type: o.detail } : {}),
      ...(o.imageUrl ? { image: o.imageUrl } : {}),
    })),
    REALISATIONS,
  );

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "60px 40px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          <span style={{ color: C.sableFixe }}>04</span> / Réalisations
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "realisations-page.titre") ?? (<>
          Des lieux livrés,<br /><span style={{ color: C.sable }}>pas des promesses.</span>
        </>)}</h1>
        <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 560, marginBottom: 64 }}>
          Chaque projet est visité, mesuré, dessiné puis tenu — dans les délais écrits sur le devis. En voici quelques-uns.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%), 1fr))", gap: 24 }}>
          {LIEUX.map((l: any, i: number) => {
            const amb = AMBIANCES[i % AMBIANCES.length];
            return (
              <div key={i} style={{ border: `1px solid ${C.line}`, background: C.gray, display: "flex", flexDirection: "column" }}>
                {l.image ? (
                  <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    <img src={l.image} alt={l.nom} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ) : (
                  /* Repli dessiné : la pièce en aplats, teintée par ambiance. */
                  <div aria-hidden style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: `linear-gradient(165deg, ${amb.teinte} 0%, ${amb.fonce} 100%)` }}>
                    <div style={{ position: "absolute", left: "10%", bottom: 0, width: "34%", height: "52%", background: "rgba(16,16,18,0.35)", borderRadius: "6px 6px 0 0" }} />
                    <div style={{ position: "absolute", right: "14%", bottom: 0, width: "14%", height: "72%", background: "rgba(16,16,18,0.25)" }} />
                    <div style={{ position: "absolute", left: "52%", top: "16%", width: 40, height: 40, borderRadius: "50%", background: "rgba(242,237,228,0.7)", boxShadow: "0 0 46px rgba(242,237,228,0.45)" }} />
                  </div>
                )}
                <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: 21, fontWeight: 800, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 10 }}>{l.nom}</h3>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 16 }}>{l.type}</div>
                  <div style={{ marginTop: "auto", borderTop: `1px solid ${C.line}`, paddingTop: 14, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textDim, fontWeight: 700 }}>
                    {l.duree}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 72, textAlign: "center" }}>
          <Link href="/templates/impact-44/recruit" style={{ display: "inline-block", padding: "18px 48px", background: C.sable, color: C.bg, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800 }}>
            Le vôtre, maintenant ?
          </Link>
        </div>
      </div>
    </div>
  );
}
