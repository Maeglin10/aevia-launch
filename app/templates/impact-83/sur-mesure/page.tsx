"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, COLLECTIONS, GemStoneSVG, Reveal } from "../shared";

export default function SurMesurePage() {
  const bespoke = COLLECTIONS.find((c) => c.id === "bespoke")?.pieces || [];
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);

  const steps = [
    { num: "01", title: "Consultation Privée", desc: "Rencontre confidentielle dans notre atelier parisien ou à domicile pour définir votre vision." },
    { num: "02", title: "Sélection des Matières", desc: "Nos gemmologues GIA présentent une sélection exclusive de pierres certifiées." },
    { num: "03", title: "Esquisse & Design", desc: "Nos dessinateurs créent plusieurs propositions à la main. Aquarelles et modélisation 3D." },
    { num: "04", title: "Création en Atelier", desc: "Fabrication entièrement à la main par nos maîtres joailliers." },
  ];

  return (
    <section style={{ padding: "100px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
              Service Bespoke
            </span>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300, color: C.text, marginTop: 16, lineHeight: 1.15 }}>
              Créations <em>Sur Mesure</em>
            </h1>
          </div>
        </Reveal>

        {/* Pieces Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 30, marginBottom: 80 }}>
          {bespoke.map((piece, i) => (
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
                      <span>Pierres : {piece.stone}</span>
                      <span>Métaux : {piece.metal}</span>
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

        {/* Process */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 80 }}>
          <Reveal>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 36, fontWeight: 300, color: C.text, marginBottom: 50, textAlign: "center" }}>
              Le Processus de <em>Création</em>
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 30 }}>
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ background: C.bgAlt, padding: 30, border: `1px solid ${C.border}`, height: "100%" }}>
                  <div style={{ fontSize: 36, fontFamily: FONT_HEADING, color: C.accent, marginBottom: 20 }}>{step.num}</div>
                  <h4 style={{ fontFamily: FONT_HEADING, fontSize: 20, color: C.text, marginBottom: 12 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
