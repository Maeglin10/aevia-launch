"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { C, FONT, SectionBadge, TEAM_DATA } from "../shared";

export default function EquipePage() {
  return (
    <div style={{ padding: "80px 80px 120px", fontFamily: FONT, background: C.bg, minHeight: "100dvh" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionBadge label="Notre équipe" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Des vétérinaires passionnés</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>Une équipe pluridisciplinaire unie par l'amour des animaux et l'exigence des meilleurs soins.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto 64px" }}>
        {TEAM_DATA.map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 24, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ height: 240, overflow: "hidden", position: "relative" }}>
              <img src={`https://images.unsplash.com/${doc.photo}?w=800&q=80&fit=crop`} alt={doc.name} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${doc.color}cc 100%)` }} />
              <div style={{ position: "absolute", bottom: 16, left: 20, color: C.white, fontWeight: 800, fontSize: 20 }}>{doc.name}</div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: doc.color, marginBottom: 10 }}>{doc.role}</div>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 18 }}>{doc.specialty}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{doc.exp} d'expérience</span>
                <span style={{ background: C.bgSection, color: C.textMuted, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}` }}>Disponible sur RDV</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.accentLight} 0%, ${C.bg} 100%)`, borderRadius: 24, padding: "48px", textAlign: "center", maxWidth: 700, margin: "0 auto", border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 12px" }}>Rejoignez notre équipe</h3>
        <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 24 }}>Nous recrutons des vétérinaires passionnés et des auxiliaires spécialisés. Envoyez votre candidature spontanée.</p>
        <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
          <motion.button type="button"
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Nous contacter
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
