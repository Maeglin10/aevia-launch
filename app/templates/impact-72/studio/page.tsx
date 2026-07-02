"use client";
// @ts-nocheck

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, PRESS, TextReveal } from "../shared";

export default function StudioPage() {
  return (
    <div style={{ background: C.bgCard, color: C.text, minHeight: "100vh", padding: "7rem 3rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* History / Intro */}
        <div style={{ marginBottom: "6rem" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
            L'HISTOIRE DU STUDIO
          </div>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "2rem", lineHeight: 1.15, paddingBottom: "0.15em" }}>
            Maison Fondée en 2001
          </TextReveal>
          <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "2rem" }}>
            Fondée à Paris au début du millénaire, Stack Unit s'est construite sur une conviction simple : le grand cinéma nécessite un accompagnement sans compromis. D'abord spécialisés dans les courts-métrages d'auteur, nous avons élargi notre champ d'action aux documentaires engagés et aux longs-métrages de fiction distribués à l'international.
          </p>
          <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8 }}>
            Aujourd'hui agréés par le CNC et membres actifs du SPI (Syndicat des Producteurs Indépendants), nous continuons de défendre une liberté artistique absolue pour chacun de nos créateurs associés.
          </p>
        </div>

        {/* Press */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "4rem" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "3rem" }}>
            LA PRESSE PARLE DE NOUS
          </div>
          {PRESS.map((p, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={p.outlet}
                ref={ref}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ display: "grid", gridTemplateColumns: "8rem 1fr", gap: "3rem", padding: "2rem 0", borderBottom: i < PRESS.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}
              >
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: C.textMuted }}>
                  {p.outlet}
                </div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontStyle: "italic", color: C.text, lineHeight: 1.5 }}>
                  "{p.quote}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
