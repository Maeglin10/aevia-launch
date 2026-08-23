"use client";
// @ts-nocheck
/*
  impact-44 / merch — « La sélection ». L'ex-boutique de maillots devient la
  sélection d'objets du studio. Câblée clientProducts (noms et prix du
  client) quand le wizard en fournit.
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SELECTION, AMBIANCES } from "../shared";
import { clientProducts, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function SelectionPage() {
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

  const OBJETS = resolveList(
    clientProducts(sessionData)?.map((p: any, i: number) => ({
      ...SELECTION[i % SELECTION.length],
      name: p.name,
      ...(p.price ? { price: String(p.price).replace(/\s*€\s*$/, "") } : {}),
    })),
    SELECTION,
  );

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "60px 40px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          <span style={{ color: C.sableFixe }}>05</span> / La sélection
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "selection-page.titre") ?? (<>
          Les objets<br /><span style={{ color: C.sable }}>que le studio défend.</span>
        </>)}</h1>
        <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 560, marginBottom: 64 }}>{/* TEXTE_SECTION */ clientText(sessionData, "selection-page.texte") ?? (<>
          Céramistes, verriers, tisserands : des pièces choisies chez les artisans avec qui le studio travaille — disponibles en boutique, réservables par téléphone.
        </>)}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: 24 }}>
          {OBJETS.map((m: any, i: number) => {
            const amb = AMBIANCES[i % AMBIANCES.length];
            return (
              <div key={i} style={{ border: `1px solid ${C.line}`, background: C.gray, display: "flex", flexDirection: "column" }}>
                {/* L'objet, dessiné : silhouette sur fond de matière. */}
                <div aria-hidden style={{ aspectRatio: "1/1", position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${C.grayAlt} 0%, #232329 100%)` }}>
                  <div style={{ position: "absolute", left: "50%", bottom: "18%", transform: "translateX(-50%)", width: "38%", height: "44%", background: `linear-gradient(180deg, ${amb.teinte} 0%, ${amb.fonce} 100%)`, borderRadius: i % 2 ? "50% 50% 8% 8% / 62% 62% 8% 8%" : "8px" }} />
                  <div style={{ position: "absolute", left: "50%", bottom: "12%", transform: "translateX(-50%)", width: "52%", height: 8, background: "rgba(0,0,0,0.35)", borderRadius: "50%", filter: "blur(4px)" }} />
                  {m.hot && (
                    <span style={{ position: "absolute", top: 14, left: 14, padding: "6px 12px", background: C.sable, color: C.bg, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 800 }}>
                      {m.tag}
                    </span>
                  )}
                </div>
                <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {!m.hot && <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 8 }}>{m.tag}</div>}
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{m.name}</h3>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
                    <span className="i44-titre" style={{ fontSize: 20, fontWeight: 800, color: C.sableFixe }}>{m.price} €</span>
                    <Link href="/templates/impact-44/recruit" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMid, textDecoration: "none", fontWeight: 700 }}>
                      Réserver →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
