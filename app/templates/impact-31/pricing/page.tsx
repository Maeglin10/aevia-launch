"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, PLANS } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PricingPage() {
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Abonnements
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Investissez dans votre bien-être
        </h1>
        <p style={{ color: C.textMuted, fontSize: 16 }}>Premier cours d'essai toujours gratuit — Sans engagement</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32, maxWidth: 1050, margin: "0 auto", alignItems: "start" }}>
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{
              background: p.highlight ? C.text : C.bgSection,
              borderRadius: 24,
              padding: "44px 38px",
              border: p.highlight ? "none" : `1.5px solid ${C.border}`,
              boxShadow: p.highlight ? C.shadowLg : C.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {p.highlight && (
              <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, #e07c62)` }} />
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
                  Populaire
                </div>
              </>
            )}
            <h3 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: p.highlight ? C.white : C.text, marginBottom: 10 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 28, lineHeight: 1.55 }}>{p.desc}</p>
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 48, fontWeight: 700, color: p.highlight ? C.white : C.text }}>€{p.price}</span>
              <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>{p.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: 14 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={p.highlight ? C.accent : C.sage} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button
              style={{
                width: "100%",
                background: p.highlight ? C.accent : "transparent",
                color: p.highlight ? C.white : C.text,
                border: p.highlight ? "none" : `1.5px solid ${C.border}`,
                borderRadius: 25,
                padding: "14px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT_BODY,
              }}
              whileHover={{ background: p.highlight ? C.accentDark : C.accentLight, borderColor: C.accent, color: p.highlight ? C.white : C.accent, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
