"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT_HEADING, FONT_BODY, TEACHERS } from "../shared";

export default function ProfesseursPage() {
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
          Nos professeurs
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Des guides inspirants
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Découvrez notre équipe de professionnels certifiés pour vous accompagner dans votre pratique.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
        {TEACHERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 24, padding: "40px 36px", textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 26, fontWeight: 700, color: C.white, fontFamily: FONT_HEADING, letterSpacing: 1 }}>
              {t.initials}
            </div>
            <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 6 }}>{t.name}</h3>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.color, marginBottom: 16 }}>{t.role}</div>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>{t.bio}</p>
            <div style={{ display: "inline-block", background: C.bgLight, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: C.textMuted }}>
              {t.exp}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
