"use client";

import React, { useState } from "react";
import { ArrowRight, Gem } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, COLLECTIONS, GemStoneSVG, Reveal } from "../shared";

export default function CollectionsPage() {
  const [activeCollection, setActiveCollection] = useState("high-jewelry");
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);

  const currentCollection = COLLECTIONS.find((c) => c.id === activeCollection) || COLLECTIONS[0];

  return (
    <section style={{ padding: "100px 24px", background: C.bg }} id="collections">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
              Créations Uniques
            </span>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300, color: C.text, marginTop: 16, lineHeight: 1.15 }}>
              Haute <em>Joaillerie</em>
            </h1>
          </div>
        </Reveal>

        {/* Tab Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 30, marginBottom: 60 }}>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCollection(c.id)}
              style={{
                background: "transparent",
                border: "none",
                color: activeCollection === c.id ? C.accent : C.textMuted,
                fontFamily: FONT_LABEL,
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "10px 20px",
                borderBottom: activeCollection === c.id ? `2px solid ${C.accent}` : "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Pieces Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 30 }}>
          {currentCollection.pieces.map((piece, i) => (
            <Reveal key={piece.name} delay={i * 0.1}>
              <div
                onMouseEnter={() => setHoveredPiece(i)}
                onMouseLeave={() => setHoveredPiece(null)}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: 40,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border 0.3s",
                }}
              >
                {/* Background gem decoration */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    bottom: -20,
                    opacity: hoveredPiece === i ? 0.12 : 0.03,
                    transition: "opacity 0.4s",
                    pointerEvents: "none",
                  }}
                >
                  <GemStoneSVG type={piece.gem} size={180} animated={false} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                    <span style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.25em", color: C.accent, textTransform: "uppercase" }}>
                      {piece.subtitle}
                    </span>
                    {piece.limited && (
                      <span style={{ fontFamily: FONT_LABEL, fontSize: 8, letterSpacing: "0.1em", color: C.white, background: C.ruby, padding: "2px 8px" }}>
                        UNIQUE
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 300, color: C.text, marginBottom: 12 }}>
                    {piece.name}
                  </h3>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.6, marginBottom: 30 }}>
                    {piece.desc}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "between", fontSize: 13, color: C.textMuted, fontFamily: FONT_LABEL }}>
                      <span>Matière : {piece.metal}</span>
                      <span>Gemme : {piece.stone}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, color: C.accent, fontFamily: FONT_HEADING }}>
                      {piece.price}
                    </span>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: C.text,
                        fontFamily: FONT_LABEL,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      DÉTAILS <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
