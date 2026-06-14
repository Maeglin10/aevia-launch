"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, EXHIBITIONS, TextReveal } from "../shared";

export default function ExhibitionsPage() {
  return (
    <section style={{ padding: "80px 0", background: C.bgCard, minHeight: "85vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Exhibitions</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream }}>
              <TextReveal text="Selected shows" />
            </h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "x-8" }} className="grid-hero-68">
          {EXHIBITIONS.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ display: "flex", gap: 32, padding: "28px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer" }}
              whileHover={{ x: 8 }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.moss, letterSpacing: "0.05em", minWidth: 48 }}>{ex.year}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 600, color: C.cream, letterSpacing: "-0.01em", marginBottom: 4 }}>{ex.title}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.muted }}>{ex.venue}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{ex.city}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.moss} strokeWidth="1.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
