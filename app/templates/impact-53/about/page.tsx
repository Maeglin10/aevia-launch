"use client";

import React from "react";
import {
  C,
  FONT_SYNE,
  FONT_MONO,
  Reveal,
  SectionLabel,
  SectionHeading,
} from "../shared";

export default function AboutPage() {
  return (
    <main style={{ background: C.black, padding: "6rem 2.5rem 8rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>ABOUT US</SectionLabel>
            <SectionHeading>THE STUDIO</SectionHeading>
            <p
              style={{
                fontFamily: FONT_SYNE,
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                color: C.white,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                marginTop: "3rem",
                marginBottom: "2rem",
              }}
            >
              MESH·WARP IS A CREATIVE COMMAND CENTER.
            </p>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
                maxWidth: "680px",
              }}
            >
              We don't do decoration. We build high-contrast digital identities, web structures, and visual logics. Our team is structured for speed, conceptual depth, and high-fidelity output.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "6rem" }} className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h3 style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "1.25rem", color: C.white, marginBottom: "1rem" }}>
                Artistic Direction
              </h3>
              <p style={{ fontFamily: FONT_MONO, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Typographic systems, grid alignments, visual concepts. We believe in visual clarity, contrasting colors, and conceptual rigor.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "1.25rem", color: C.white, marginBottom: "1rem" }}>
                Digital Experiences
              </h3>
              <p style={{ fontFamily: FONT_MONO, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Websites built using clean pipelines, smooth motion engines, and latency-free interactive states.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
