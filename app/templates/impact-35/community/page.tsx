"use client";
// @ts-nocheck
/*
  impact-35 / community — « L'équipe ». Les associés et leur façon de
  travailler ensemble. Câblée clientTeam (noms et rôles du client).
*/

import React, { useEffect, useState } from "react";
import { C, SERIF, SANS, EQUIPE, SectionReveal, TitreSection } from "../shared";
import { clientTeam, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const METHODE = [
  {
    n: "01",
    titre: "Un associé référent",
    texte: "Votre dossier a un visage : la même personne le connaît, le porte et vous répond — pas un standard.",
  },
  {
    n: "02",
    titre: "La réunion des trois métiers",
    texte: "Avocat, expert-comptable et conseil patrimonial s'assoient à la même table quand votre dossier le mérite. Vous n'êtes pas le messager entre eux.",
  },
  {
    n: "03",
    titre: "L'écrit qui reste",
    texte: "Chaque échange important est suivi d'une note écrite : ce qui a été décidé, ce qu'il reste à faire, qui le fait.",
  },
];

export default function EquipePage() {
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
    <div style={{ background: C.bg, color: C.text, minHeight: "60dvh", padding: "clamp(48px,7vh,90px) 5% clamp(80px,10vh,130px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <SectionReveal>
          <TitreSection surtitre="L'équipe">{/* TEXTE_SECTION */ clientText(sessionData, "equipe-page.titre") ?? (<>
            Des métiers différents, <em style={{ color: C.navy }}>une même table.</em>
          </>)}</TitreSection>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px,100%), 1fr))", gap: 22, marginBottom: 84 }}>
          {MEMBRES.map((m: any, i: number) => (
            <SectionReveal key={i} delay={i * 0.07}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Portrait sobre : initiales — jamais de photo inventée. */}
                <div aria-hidden style={{ width: 58, height: 58, borderRadius: "50%", background: C.navyDark, color: "#fff", fontFamily: SERIF, fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {m.nom.replace(/^Me\s+/i, "").split(/\s+/).map((p: string) => p[0]).slice(0, 2).join("")}
                </div>
                <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 6px" }}>{m.nom}</h2>
                <div style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 10 }}>{m.role}</div>
                <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.7, color: C.textMuted, fontWeight: 300, margin: 0 }}>{m.detail}</p>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <TitreSection surtitre="La méthode">Comment le cabinet <em style={{ color: C.navy }}>travaille.</em></TitreSection>
        </SectionReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: 22 }}>
          {METHODE.map((e, i) => (
            <SectionReveal key={e.n} delay={i * 0.07}>
              <div style={{ borderTop: `2px solid ${C.navy}`, background: C.white, border: `1px solid ${C.border}`, borderTopColor: C.navyFixe, borderTopWidth: 2, borderRadius: 4, padding: "30px 28px", height: "100%" }}>
                <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: C.or, opacity: 0.6, marginBottom: 14 }}>{e.n}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, margin: "0 0 10px" }}>{e.titre}</h3>
                <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: C.textMuted, fontWeight: 300, margin: 0 }}>{e.texte}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
