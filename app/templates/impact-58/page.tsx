"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, DistortedTitle } from "./shared";

export default function SkewOSHome() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem", paddingTop: "8rem", position: "relative" }}>
        {/* Floating label */}
        <div style={{ position: "absolute", top: "2rem", right: "3rem" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", color: C.textDim }}>
            MOTION DESIGN STUDIO · PARIS
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "flex-end" }} className="grid grid-cols-1 md:grid-cols-2">
          <DistortedTitle />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ maxWidth: "300px", paddingBottom: "1rem" }}
          >
            <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "2rem" }}>
              Studio de motion design & réalisation. Nous créons des films de marque, des expériences visuelles et des installations qui perturbent l'attention.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link
                href="/templates/impact-58/work"
                style={{
                  background: C.violet,
                  color: C.text,
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.3s",
                  display: "inline-block"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.violetLight}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.violet}
              >
                SEE WORK →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Awards quick bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", gap: "3rem" }}
        >
          {[
            { n: "3×", label: "Cannes Lions Gold" },
            { n: "1×", label: "D&AD Black Pencil" },
            { n: "80+", label: "Brand films livrés" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: C.violet }}>{stat.n}</div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.textDim }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
