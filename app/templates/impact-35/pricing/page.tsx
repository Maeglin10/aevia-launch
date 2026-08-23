"use client";
// @ts-nocheck
/*
  impact-35 / pricing — « Les honoraires ». Forfaits écrits d'avance,
  câblés clientServices (noms et prix du client), et la FAQ des honoraires.
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SERIF, SANS, FORFAITS, FAQS, SectionReveal, FAQItem, TitreSection } from "../shared";
import { clientPhone, clientServices, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function HonorairesPage() {
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

  const PACKS = resolveList(
    clientServices(sessionData)?.slice(0, 3).map((s: any, i: number) => ({
      ...FORFAITS[i % FORFAITS.length],
      name: s.title,
      ...(s.price ? { price: String(s.price).replace(/\s*€.*$/, ""), period: String(s.price).includes("/") ? String(s.price).split("/")[1].trim() : undefined } : {}),
    })),
    FORFAITS,
  );

  const tel = clientPhone(sessionData) ?? fd?.phone ?? "01 42 61 08 30";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "60dvh", padding: "clamp(48px,7vh,90px) 5% clamp(80px,10vh,130px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <SectionReveal>
          <TitreSection surtitre="Honoraires" centre>{/* TEXTE_SECTION */ clientText(sessionData, "honoraires-page.titre") ?? (<>
            Aucune mission <em style={{ color: C.navy }}>sans convention écrite.</em>
          </>)}</TitreSection>
          <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.8, color: C.textMuted, fontWeight: 300, maxWidth: 640, margin: "-20px auto 60px", textAlign: "center" }}>{/* TEXTE_SECTION */ clientText(sessionData, "honoraires-page.texte") ?? (<>
            Forfait quand le périmètre est connu, taux horaire annoncé sinon — et un devis avant toute diligence facturable. Les montants ci-dessous sont les points d'entrée les plus demandés.
          </>)}</p>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: 22, alignItems: "stretch", marginBottom: 84 }}>
          {PACKS.map((p: any, i: number) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%", background: p.highlight ? C.navyDark : C.white, color: p.highlight ? "#fff" : C.text, border: `1px solid ${p.highlight ? C.navyDark : C.border}`, borderRadius: 4, padding: "36px 30px", position: "relative" }}>
                {p.highlight && (
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.or, color: "#fff", fontFamily: SANS, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, padding: "5px 14px", borderRadius: 2, whiteSpace: "nowrap" }}>Le plus choisi</span>
                )}
                <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginBottom: 14 }}>{p.name}</h2>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, marginBottom: 24 }}>
                  {p.price} €{p.period ? <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 400, opacity: 0.6 }}> / {p.period}</span> : null}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
                  {p.features.map((f: string) => (
                    <li key={f} style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.6, fontWeight: 300, display: "flex", gap: 10, color: p.highlight ? "rgba(255,255,255,0.9)" : C.textMuted }}>
                      <span aria-hidden style={{ color: C.or }}>—</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={telHref} style={{ fontFamily: SANS, display: "block", textAlign: "center", padding: "15px 20px", background: p.highlight ? C.or : "transparent", border: `1px solid ${p.highlight ? C.or : C.navy}`, color: p.highlight ? "#fff" : C.navyFixe, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2 }}>
                  {p.cta}
                </a>
              </div>
            </SectionReveal>
          ))}
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionReveal>
            <TitreSection surtitre="Les questions qu'on nous pose" centre>Transparence, <em style={{ color: C.navy }}>mode d'emploi.</em></TitreSection>
          </SectionReveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {FAQS.map((f, i) => (
              <FAQItem key={i} faq={f} delay={i * 0.05} />
            ))}
          </div>
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <Link href="/templates/impact-35/services" style={{ fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.navyFixe, textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${C.navy}`, paddingBottom: 6 }}>
              Parcourir les expertises →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
