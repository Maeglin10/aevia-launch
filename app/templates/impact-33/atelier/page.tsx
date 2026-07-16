"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Users, Calendar, CheckCircle } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT_HEADING, FONT_BODY, WORKSHOPS } from "../shared";

export default function AtelierPage() {
  return (
    <section style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Ateliers
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          L'art de la boulangerie artisanale
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 620, margin: "0 auto 0", lineHeight: 1.7 }}>
          Venez apprendre l'art de la boulangerie artisanale dans notre fournil. Des ateliers conçus par Camille pour transmettre 37 ans de passion et de savoir-faire.
        </p>
      </motion.div>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ maxWidth: 1000, margin: "40px auto 72px", borderRadius: 24, overflow: "hidden", position: "relative" }}
      >
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&fit=crop"
          alt="Atelier boulangerie"
          loading="lazy"
          style={{ width: "100%", height: 320, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(92,51,23,0.75) 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", top: "50%", left: 48, transform: "translateY(-50%)" }}>
          <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(18px, 2.5vw, 30px)", color: C.white, fontStyle: "italic", maxWidth: 400, lineHeight: 1.4 }}>
            "Faire son pain, c'est retrouver quelque chose d'essentiel — le lien entre la terre, les mains et la table."
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12, fontSize: 14 }}>— Camille Girard, boulangère</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32, maxWidth: 1060, margin: "0 auto 60px" }}>
        {WORKSHOPS.map((ws, i) => (
          <motion.div
            key={ws.title}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 22, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column" }}
          >
            <div style={{ background: C.bgSection, padding: "32px 28px 24px", borderBottom: `1px solid ${C.border}` }}>
              <TemplateIcon emoji={ws.emoji} size={44} />
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginTop: 16, marginBottom: 8 }}>{ws.title}</h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} color={C.accent} /> {ws.duration}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={13} color={C.accent} /> {ws.spots}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={13} color={C.accent} /> {ws.schedule}
                </span>
              </div>
            </div>
            <div style={{ padding: "24px 28px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 20 }}>{ws.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  {ws.includes.map((inc) => (
                    <div key={inc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <CheckCircle size={14} color={C.accent} />
                      <span style={{ fontSize: 13, color: C.text }}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 20 }}>{ws.price}</span>
                <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
                  <motion.button
                    type="button"
                    style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY }}
                    whileHover={{ background: C.accentDark, scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    S'inscrire
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", background: C.bgSection, borderRadius: 20, padding: "36px 40px", border: `1px solid ${C.border}`, textAlign: "center" }}>
        <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>Groupes & événements d'entreprise</h3>
        <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
          Vous souhaitez organiser un atelier pour votre équipe ou un événement privé ? Nous concevons des formules sur mesure pour 10 à 30 personnes, en dehors des heures d'ouverture.
        </p>
        <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Nous contacter pour un devis
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
