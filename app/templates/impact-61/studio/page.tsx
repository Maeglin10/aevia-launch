"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, TEAM, AWARDS, TextReveal, SpotlightCard } from "../shared";

export default function StudioPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh" }}>
      {/* ── Philosophy/Bio ── */}
      <section style={{ padding: "6rem 3rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "3rem" }}>
            Le Studio
          </TextReveal>
          <p style={{ fontSize: "1.2rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "70ch", marginBottom: "2rem" }}>
            Depuis 2001, Segment conçoit des espaces qui privilégient le vide, la lumière et la rigueur géométrique. Nous croyons que l'architecture d'excellence ne doit pas crier, mais plutôt s'intégrer harmonieusement à son environnement en créant des silences spatiaux et matériels.
          </p>
        </div>
      </section>

      {/* ── Distinctions ── */}
      <section style={{ padding: "6rem 3rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              Distinctions
            </TextReveal>
          </div>
          {AWARDS.map((award, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "grid", gridTemplateColumns: "6rem 1fr auto", gap: "3rem", padding: "1.75rem 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}
              >
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.gold, fontWeight: 600 }}>
                  {award.year}
                </div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 500, color: C.text }}>
                  {award.title}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textDim, textAlign: "right" }}>
                  {award.project}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ padding: "6rem 3rem", background: C.bgOff }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              L'Équipe
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
            {TEAM.map((member, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <SpotlightCard key={member.name} style={{ background: C.bg }}>
                  <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    style={{ padding: "3rem 2.5rem" }}
                  >
                    <div style={{ width: "60px", height: "60px", background: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
                      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.textLight }}>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.3rem" }}>
                      {member.name}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textMuted, marginBottom: "0.75rem" }}>
                      {member.role}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textDim, padding: "0.3rem 0.65rem", border: `1px solid ${C.border}`, display: "inline-block" }}>
                      {member.credential}
                    </div>
                  </motion.div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
