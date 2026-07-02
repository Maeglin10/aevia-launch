"use client";
// @ts-nocheck

import React from "react";
import { motion } from "framer-motion";
import { C, FILMS, TextReveal, StackedCards } from "../shared";

export default function FilmsPage() {
  return (
    <div style={{ background: C.bgCard, color: C.text, minHeight: "100vh", padding: "7rem 3rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
              FILMOGRAPHIE RÉCENTE
            </div>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "1.5rem", lineHeight: 1.15, paddingBottom: "0.15em" }}>
              Nos Films
            </TextReveal>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "3rem" }}>
              Chaque film est une collaboration profonde avec ses auteurs. Stack Unit ne produit pas — elle co-crée.
            </p>

            {/* Film list */}
            {FILMS.map((film, i) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.85rem 0",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: film.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.text }}>
                    {film.title}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: C.textMuted }}>
                    {film.director} · {film.year}
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: film.color, padding: "0.2rem 0.5rem", border: `1px solid ${film.color}30` }}>
                  {film.type}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stacked cards */}
          <div>
            <StackedCards films={FILMS} />
          </div>
        </div>
      </div>
    </div>
  );
}
