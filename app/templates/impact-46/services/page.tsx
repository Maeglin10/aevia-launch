"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { C, PageHero, serviceDetails } from "../shared";

export default function Services() {
  return (
    <div>
      <PageHero
        eyebrow="Nos domaines d'intervention"
        title="Services & expertises"
        subtitle="Nous conseillons sur l'ensemble du spectre du droit des affaires, de la constitution d'une société aux contentieux et transactions internationales les plus complexes."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 1, background: C.border }}>
            {serviceDetails.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                style={{ background: C.bgCard, padding: 44 }}
              >
                <div style={{ width: 48, height: 48, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.borderGold}` }}>
                  <area.icon size={22} color={C.accent} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.navy, margin: "0 0 12px", fontWeight: 700 }}>{area.title}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: "0 0 22px" }}>{area.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {area.points.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <Check size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.55 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div style={{ background: C.navy, padding: "56px clamp(32px, 6vw, 72px)", marginTop: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, color: C.white, margin: "0 0 10px", fontWeight: 700 }}>Un dossier à confier ?</h2>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 480 }}>Premier rendez-vous de 45 minutes offert pour évaluer votre situation et identifier la bonne équipe.</p>
            </div>
            <Link href="/templates/impact-46/contact" style={{ textDecoration: "none" }}>
              <button
                style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Nous contacter <ArrowRight size={15} /></button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
