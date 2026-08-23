"use client";
// @ts-nocheck
/*
  impact-35 / services — « Les expertises ». Le détail des six domaines,
  câblé clientServices (titres, descriptions, prix du client).
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SERIF, SANS, EXPERTISES, SectionReveal, TitreSection } from "../shared";
import { clientServices, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ExpertisesPage() {
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

  const DOMAINES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...EXPERTISES[i % EXPERTISES.length],
      title: s.title,
      desc: s.desc || EXPERTISES[i % EXPERTISES.length].desc,
      prix: s.price || undefined,
    })),
    EXPERTISES,
  );

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "60dvh", padding: "clamp(48px,7vh,90px) 5% clamp(80px,10vh,130px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <SectionReveal>
          <TitreSection surtitre="Expertises">{/* TEXTE_SECTION */ clientText(sessionData, "expertises-page.titre") ?? (<>
            Ce que le cabinet <em style={{ color: C.navy }}>prend en charge.</em>
          </>)}</TitreSection>
          <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.8, color: C.textMuted, fontWeight: 300, maxWidth: 640, margin: "-20px 0 60px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "expertises-page.texte") ?? (<>
            Un même dossier touche presque toujours au droit, au chiffre et au patrimoine. Ici, les trois se traitent dans la même réunion — pas dans trois cabinets qui s'écrivent des courriers.
          </>)}</p>
        </SectionReveal>

        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {DOMAINES.map((e: any, i: number) => (
            <SectionReveal key={i} delay={i * 0.05}>
              <div className="i35-exp" style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: "18px 28px", alignItems: "start", padding: "34px 4px", borderBottom: `1px solid ${C.border}` }}>
                <div aria-hidden style={{ width: 52, height: 52, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <e.icon style={{ width: 22, height: 22, color: C.or }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.4vw,28px)", fontWeight: 600, margin: "0 0 8px" }}>{e.title}</h2>
                  <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.8, color: C.textMuted, fontWeight: 300, margin: 0, maxWidth: 640 }}>{e.desc}</p>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.navyFixe, fontWeight: 700, whiteSpace: "nowrap", paddingTop: 6 }}>
                  {e.prix ?? "Sur devis"}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <div style={{ marginTop: 60, textAlign: "center" }}>
          <Link href="/templates/impact-35/pricing" style={{ fontFamily: SANS, display: "inline-block", padding: "16px 40px", background: C.navy, color: "#fff", fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2 }}>
            Voir les honoraires
          </Link>
        </div>
      </div>
      <style>{`@media (max-width: 700px) { .i35-exp { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
