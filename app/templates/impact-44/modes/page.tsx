"use client";
// @ts-nocheck
/*
  impact-44 / modes — « Les prestations ». La liste choisit, le panneau
  détaille. Câblée clientServices (titres, descriptions, prix du client).
*/

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { C, PRESTATIONS } from "../shared";
import { clientServices, clientText } from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PrestationsPage() {
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

  const OFFRES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...PRESTATIONS[i % PRESTATIONS.length],
      id: i + 1,
      tag: `Prestation ${String(i + 1).padStart(2, "0")}`,
      title: s.title,
      desc: s.desc || PRESTATIONS[i % PRESTATIONS.length].desc,
      ...(s.price ? { prix: s.price } : {}),
    })),
    PRESTATIONS,
  );

  const [active, setActive] = useState(0);
  const P = OFFRES[Math.min(active, OFFRES.length - 1)];

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "60px 40px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          <span style={{ color: C.sableFixe }}>02</span> / Prestations
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations-page.titre") ?? (<>
          Ce que le studio<br /><span style={{ color: C.sable }}>prend en charge.</span>
        </>)}</h1>
        <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 560, marginBottom: 64 }}>
          Du conseil de deux heures à la rénovation menée de bout en bout — toujours au prix écrit d'avance, jamais à la surprise.
        </p>

        <div className="i44-prest" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(28px,4vw,64px)", alignItems: "start" }}>
          {/* La liste choisit */}
          <div style={{ borderTop: `1px solid ${C.line}` }}>
            {OFFRES.map((p: any, i: number) => (
              <button
                key={p.id ?? i}
                onClick={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${C.line}`,
                  padding: "22px 6px",
                  cursor: "pointer",
                  color: i === active ? C.white : C.textMid,
                  transition: "color 0.25s",
                  minHeight: 44,
                }}
              >
                <span className="i44-titre" style={{ fontSize: "clamp(17px,2vw,24px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.01em" }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: i === active ? C.sableFixe : C.textDim, whiteSpace: "nowrap", fontWeight: 700 }}>
                  {p.prix}
                </span>
              </button>
            ))}
          </div>

          {/* Le panneau détaille */}
          <div style={{ border: `1px solid ${C.line}`, background: C.gray, padding: "clamp(26px,3.5vw,48px)", overflow: "hidden" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, transition: { duration: 0.22 } }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textDim, fontWeight: 700, marginBottom: 16 }}>{P.tag}</div>
                <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.06, marginBottom: 8 }}>{P.title}</h2>
                <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 22 }}>{P.sub}</div>
                <p style={{ color: C.textMid, fontSize: 15.5, lineHeight: 1.8, fontWeight: 300, marginBottom: 30 }}>{P.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
                  <div>
                    <div className="i44-titre" style={{ fontSize: 30, fontWeight: 800, color: C.sableFixe }}>{P.stat[0]}</div>
                    <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textDim, fontWeight: 700 }}>{P.stat[1]}</div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <Link href="/templates/impact-44/recruit" style={{ padding: "14px 30px", background: C.sable, color: C.bg, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800 }}>
                    Demander un devis
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .i44-prest { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
