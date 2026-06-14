"use client";

import React from "react";
import {
  C,
  F,
  Reveal,
  SectionLabel,
  GlitchHeadline,
} from "../shared";

export default function LegalPage() {
  return (
    <main style={{ background: C.BG, padding: "4rem 2rem 8rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem", textAlign: "center" }}>
            <SectionLabel code="[MODULE: LEGAL.LOG]" color={C.CYAN} />
            <GlitchHeadline
              text="LEGAL INFO"
              outlineText="MENTIONS"
              outlineColor={C.PINK}
            />
            <p
              style={{
                fontSize: "0.78rem",
                fontFamily: F.mono,
                color: "#6666aa",
                letterSpacing: "0.08em",
                lineHeight: 1.9,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              COMPLIANCE ACCORDING TO THE PROVISIONS OF LAWS AND CODES APPLICABLE
              ON FRENCH WEB NETWORKS (LCEN).
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "4rem" }}>
          <Reveal>
            <div
              style={{
                background: C.CARD_BG,
                border: `1px solid ${C.CYAN}22`,
                borderRadius: "1rem",
                padding: "2.5rem",
                height: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  fontFamily: F.mono,
                  color: "#fff",
                  letterSpacing: "0.08em",
                  marginBottom: "1.5rem",
                }}
              >
                PUBLICATION / EDITOR
              </h3>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontFamily: F.mono,
                  color: "#9999bb",
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                }}
              >
                <p style={{ marginBottom: "1rem" }}>
                  This grid is managed and edited by:
                </p>
                <p
                  style={{
                    fontWeight: 900,
                    color: C.PINK,
                    marginBottom: "1rem",
                  }}
                >
                  Valentin Milliand, micro-entrepreneur
                </p>
                <p>
                  <strong>SIREN:</strong> 852 546 225
                </p>
                <p>
                  <strong>RCS:</strong> Bourg-en-Bresse
                </p>
                <p>
                  <strong>HQ:</strong> Bourg-en-Bresse, France
                </p>
                <p>
                  <strong>Email:</strong> support@particlefield.io
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              style={{
                background: C.CARD_BG,
                border: `1px solid ${C.CYAN}22`,
                borderRadius: "1rem",
                padding: "2.5rem",
                height: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  fontFamily: F.mono,
                  color: "#fff",
                  letterSpacing: "0.08em",
                  marginBottom: "1.5rem",
                }}
              >
                HOSTING / INFRA
              </h3>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontFamily: F.mono,
                  color: "#9999bb",
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                }}
              >
                <p style={{ marginBottom: "1rem" }}>
                  <strong>Infrastructure hosted by:</strong>
                </p>
                <p
                  style={{
                    fontWeight: 900,
                    color: C.PINK,
                    marginBottom: "1rem",
                  }}
                >
                  Aevia Web Solutions
                </p>
                <p>
                  <strong>HQ:</strong> Bourg-en-Bresse, France
                </p>
                <p>
                  <strong>Publication director:</strong> Valentin Milliand
                </p>
                <p style={{ marginTop: "1.25rem" }}>
                  All signals and digital assets are protected by international
                  intellectual properties codes.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
