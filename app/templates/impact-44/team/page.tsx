"use client";
// @ts-nocheck
/*
  impact-44 / team — « Le studio ». L'équipe et la façon de travailler.
  Câblée clientTeam (noms et rôles du client) et clientText.
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, EQUIPE } from "../shared";
import { clientTeam, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function StudioPage() {
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

  const MEMBRES = resolveList(
    clientTeam(sessionData)?.map((m: any, i: number) => ({
      ...EQUIPE[i % EQUIPE.length],
      nom: m.name,
      ...(m.role ? { role: m.role } : {}),
    })),
    EQUIPE,
  );

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "60px 40px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          <span style={{ color: C.sableFixe }}>03</span> / Le studio
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "studio-page.titre") ?? (<>
          Cinq métiers,<br /><span style={{ color: C.sable }}>une même main.</span>
        </>)}</h1>
        <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 600, marginBottom: 64 }}>{/* TEXTE_SECTION */ clientText(sessionData, "studio-page.texte") ?? (<>
          Direction artistique, plans, chantier, ébénisterie et stylisme : tout ce qu'un projet traverse est porté par une équipe qui se parle tous les jours — pas par des prestataires qui se découvrent sur votre chantier.
        </>)}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 80 }}>
          {MEMBRES.map((m: any, i: number) => (
            <div key={i} style={{ background: C.bg, padding: "34px 28px", display: "flex", flexDirection: "column", minHeight: 220 }}>
              {/* Portrait dessiné : initiales sur pastille — jamais de photo inventée. */}
              <div aria-hidden style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.sable}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, color: C.sableFixe, fontWeight: 800, letterSpacing: "0.05em" }} className="i44-titre">
                {m.nom.split(/\s+/).map((p: string) => p[0]).slice(0, 2).join("")}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{m.nom}</h3>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 12 }}>{m.role}</div>
              <p style={{ color: C.textMid, fontSize: 13.5, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{m.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.line}`, background: C.gray, padding: "clamp(28px,4vw,56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.08, marginBottom: 12 }}>
              Une visite vaut mieux<br /><span style={{ color: C.sable }}>que mille moodboards.</span>
            </h2>
            <p style={{ color: C.textMid, fontSize: 14.5, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              Le studio reçoit sur rendez-vous, du mardi au samedi — échantillons de matières en main.
            </p>
          </div>
          <Link href="/templates/impact-44/recruit" style={{ padding: "16px 38px", background: C.sable, color: C.bg, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800, whiteSpace: "nowrap" }}>
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
