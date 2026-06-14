"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STATS, TEAM, C } from "../shared";

export default function StudioPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${C.border}`, padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {STATS.map((stat, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: "2.5rem 2rem",
                  borderRight: `1px solid ${C.border}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700, color: C.accent, letterSpacing: "-0.02em" }}>
                  {stat.n}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.textMuted, marginTop: "0.4rem" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / THE TEAM
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: "1.15", paddingBottom: "0.5rem" }}>
              Qui Sommes-Nous
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2px", background: C.border }}>
            {TEAM.map((member, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={member.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ background: C.bg, padding: "2.5rem 2rem" }}
                >
                  <div style={{ width: "48px", height: "48px", background: i % 2 === 0 ? C.accent : C.accentAlt, marginBottom: "1.5rem" }} />
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.25rem" }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textMuted, marginBottom: "1rem" }}>
                    {member.role}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {member.specialty.split(" · ").map((s) => (
                      <span key={s} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", padding: "0.25rem 0.5rem", border: `1px solid ${C.border}`, color: C.textDim }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
