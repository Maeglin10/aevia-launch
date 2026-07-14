"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { C, FONT_HEADING, FONT_BODY, CLASSES } from "../shared";

export default function CoursPage() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 80px 120px", background: C.bgSection, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Planning
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Nos cours de la semaine
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Des cours pour tous les niveaux, du lundi au dimanche. Réservez votre place en ligne.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
        {CLASSES.map((c, i) => (
          <motion.div
            key={`${c.day}-${c.time}`}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 16, padding: "28px 30px", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{c.day}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: FONT_HEADING }}>{c.time}</div>
              </div>
              <div style={{ background: C.accentLight, borderRadius: 12, padding: "8px 10px" }}>{c.icon}</div>
            </div>
            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 21, fontWeight: 700, color: C.text, marginBottom: 6 }}>{c.name}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, background: c.level === "Débutant" ? C.sageLight : c.level === "Avancé" ? C.accentLight : C.bgLight, color: c.level === "Débutant" ? C.sage : c.level === "Avancé" ? C.accent : C.textMuted, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                  {c.level}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted }}>avec {c.teacher}</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <span style={{ fontSize: 14, color: c.spots <= 3 ? C.accent : C.textMuted, fontWeight: c.spots <= 3 ? 700 : 400 }}>
                {c.spots <= 3 ? `Seulement ${c.spots} places restantes` : `${c.spots} places disponibles`}
              </span>
              <Link href="/templates/impact-31/pricing" style={{ textDecoration: "none" }}>
                <motion.button
                  style={{ background: C.accent, color: C.white, border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}
                  whileHover={{ background: C.accentDark, scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Réserver
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
