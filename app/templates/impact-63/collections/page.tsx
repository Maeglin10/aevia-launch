"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { C, COLLECTIONS, SectionLabel, PageWrapper } from "../shared";

export default function CollectionsPage() {
  const [filter, setFilter] = useState<"All" | "Classic" | "Sport" | "Complications">("All");
  const [active, setActive] = useState(0);

  const filtered = filter === "All" ? COLLECTIONS : COLLECTIONS.filter((c) => c.category === filter);
  const selected = filtered[active] ?? filtered[0];

  useEffect(() => { setActive(0); }, [filter]);

  return (
    <PageWrapper>
      {/* Hero banner */}
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Catalogue Complet</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.1em", marginBottom: "1rem" }}>
          Nos Collections<br /><em style={{ color: C.gold }}>2026</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75 }}>
          Six expressions de l'excellence horlogère genevoise. De l'entrée de gamme au grand complication, chaque pièce est signée d'un seul maître-horloger.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ padding: "0 clamp(2rem, 6vw, 6rem)", background: C.bg, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 0 }}>
        {(["All", "Classic", "Sport", "Complications"] as const).map((f) => (
          <motion.button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              background: "none",
              border: "none",
              padding: "1.1rem 1.75rem",
              fontFamily: "'Cormorant SC', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: f === filter ? C.gold : C.textMuted,
              cursor: "pointer",
              position: "relative",
            }}
            whileHover={{ color: C.text }}
          >
            {f === "All" ? "Toutes" : f}
            {f === filter && (
              <motion.div layoutId="col-filter" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: C.gold }} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ padding: "4rem clamp(2rem, 6vw, 6rem) 6rem", maxWidth: "1300px", margin: "0 auto" }}>
        {/* Tab row */}
        <div style={{ display: "flex", gap: 0, marginBottom: "3rem", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          {filtered.map((col, i) => (
            <motion.button
              key={col.id}
              type="button"
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                padding: "0.9rem 1.75rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: i === active ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                whiteSpace: "nowrap",
              }}
              whileHover={{ color: C.text }}
            >
              {col.name}
              {i === active && (
                <motion.div layoutId="col-tab" style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}
            >
              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: C.bgCard, border: `1px solid ${C.border}` }}>
                <img
                  src={selected.image}
                  alt={selected.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 50%, ${C.bg}cc)` }} />
                <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim }}>RÉFÉRENCE</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.gold, letterSpacing: "0.1em" }}>{selected.ref}</div>
                </div>
              </div>

              {/* Details */}
              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.5rem" }}>{selected.category}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300, color: C.text, marginBottom: "1.25rem" }}>{selected.name}</h2>
                <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2rem", maxWidth: "45ch" }}>{selected.desc}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, marginBottom: "2rem" }}>
                  {[
                    { label: "Mouvement", val: selected.movement },
                    { label: "Boîtier", val: selected.case },
                    { label: "Étanchéité", val: selected.water },
                  ].map((spec) => (
                    <div key={spec.label}>
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.52rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>{spec.label}</div>
                      <div style={{ fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.4 }}>{spec.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.52rem", letterSpacing: "0.2em", color: C.textDim }}>PRIX PUBLIC</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.gold }}>{selected.price}</div>
                  </div>
                  <Link href="/templates/impact-63/atelier" style={{ textDecoration: "none" }}>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: C.gold,
                        color: C.bg,
                        border: "none",
                        padding: "0.8rem 1.75rem",
                        fontFamily: "'Cormorant SC', serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                    >
                      DEMANDER UNE CONSULTATION
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All cards mini-grid */}
        <div style={{ marginTop: "5rem", paddingTop: "4rem", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>TOUTES LES RÉFÉRENCES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {filtered.map((col, i) => (
              <motion.button
                key={col.id}
                type="button"
                onClick={() => setActive(i)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: i === active ? C.bgCard : C.bgSection,
                  border: `1px solid ${i === active ? C.goldDim : C.border}`,
                  padding: "1.5rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.5rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>{col.ref}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: i === active ? C.gold : C.text, marginBottom: "0.5rem" }}>{col.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: C.goldDim }}>{col.price}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
