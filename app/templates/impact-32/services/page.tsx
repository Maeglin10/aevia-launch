"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Calendar } from "lucide-react";
import { C, FONT, SectionBadge, FULL_SERVICES } from "../shared";

export default function ServicesPage() {
  return (
    <div style={{ padding: "80px 80px 120px", fontFamily: FONT, background: C.bg, minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionBadge label="Tous nos services" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Soins complets pour chaque animal</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>De la consultation de routine à la chirurgie spécialisée — notre plateau technique est au service de vos compagnons.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, maxWidth: 1200, margin: "0 auto 64px" }}>
        {FULL_SERVICES.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 20, padding: "36px 32px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: C.accentLight, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              <span style={{ background: C.bgSection, color: C.accent, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, border: `1px solid ${C.border}` }}>{s.price}</span>
            </div>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 20 }}>{s.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {s.details.map((d) => (
                <li key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.text }}>
                  <CheckCircle size={14} color={C.accent} /> {d}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
          <motion.button type="button"
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 40px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 10 }}
            whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Calendar size={18} /> Prendre rendez-vous
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
