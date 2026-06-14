"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { C, TEAM, TESTIMONIALS } from "../shared";

export default function StudioPage() {
  return (
    <div style={{ background: C.bg, minHeight: "80vh" }}>
      {/* ─── STUDIO / TEAM ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            The Studio
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "24px",
              lineHeight: 1.05,
              textAlign: "left",
            }}
          >
            Four people.
            <br />
            <span style={{ color: C.textMuted }}>Senior on every project.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
              lineHeight: 1.7,
              color: C.textMuted,
              maxWidth: "560px",
              marginBottom: "72px",
              textAlign: "left",
            }}
          >
            Orbit is intentionally small. We take 4 projects per quarter — never more. Every client gets every senior person in the room. That's the model and we won't change it.
          </motion.p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="grid-hero-68">
            {TEAM.map((member, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    padding: "36px",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: `${C.accent}22`,
                      border: `1px solid ${C.accent}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: C.accent,
                      marginBottom: "20px",
                    }}
                  >
                    {member.initials}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    {member.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      color: C.accent,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      marginBottom: "16px",
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: C.textMuted,
                    }}
                  >
                    {member.bio}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            Client Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "64px",
              lineHeight: 1.05,
              textAlign: "left",
            }}
          >
            Words from
            <br />
            <span style={{ color: C.textMuted }}>the people we built for.</span>
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }} className="grid-hero-68">
            {TESTIMONIALS.map((t, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    padding: "48px",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    position: "relative",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} size={14} fill={C.accent} style={{ color: C.accent }} />
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.8,
                      color: C.text,
                      marginBottom: "32px",
                      fontStyle: "italic",
                    }}
                  >
                    "{t.text}"
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: C.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: C.white,
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: C.text,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "12px",
                          color: C.textMuted,
                        }}
                      >
                        {t.role}
                      </div>
                    </div>
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
