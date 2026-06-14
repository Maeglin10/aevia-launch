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

export default function LegalPage() {
  return (
    <main style={{ background: C.black, padding: "6rem 2.5rem 8rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem", textAlign: "center" }}>
            <SectionLabel>LEGAL TERMS</SectionLabel>
            <SectionHeading>MENTIONS</SectionHeading>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.8,
                maxWidth: "500px",
                margin: "2rem auto 0",
              }}
            >
              COMPLIANCE STATEMENTS AND DIRECTORIES RELATIVE TO ONLINE FRENCH NETWORK INFRASTRUCTURE (LCEN).
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "4rem" }} className="grid grid-cols-1 md:grid-cols-2">
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.dim}`,
                padding: "2.5rem",
                height: "100%",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  fontFamily: FONT_SYNE,
                  color: C.white,
                  letterSpacing: "0.05em",
                  marginBottom: "1.5rem",
                }}
              >
                PUBLICATION / EDITOR
              </h3>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontFamily: FONT_MONO,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                }}
              >
                <p style={{ marginBottom: "1rem" }}>
                  This grid is managed and edited by:
                </p>
                <p
                  style={{
                    fontWeight: 900,
                    color: C.red,
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
                  <strong>Siège social:</strong> Bourg-en-Bresse, France
                </p>
                <p>
                  <strong>Email:</strong> support@meshwarp.studio
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              style={{
                border: `1px solid ${C.dim}`,
                padding: "2.5rem",
                height: "100%",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  fontFamily: FONT_SYNE,
                  color: C.white,
                  letterSpacing: "0.05em",
                  marginBottom: "1.5rem",
                }}
              >
                HOSTING INFRA
              </h3>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontFamily: FONT_MONO,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                }}
              >
                <p style={{ marginBottom: "1rem" }}>
                  <strong>Infrastructure hosted by:</strong>
                </p>
                <p
                  style={{
                    fontWeight: 900,
                    color: C.red,
                    marginBottom: "1rem",
                  }}
                >
                  Aevia Web Solutions
                </p>
                <p>
                  <strong>Siège social:</strong> Bourg-en-Bresse, France
                </p>
                <p>
                  <strong>Directeur de la publication:</strong> Valentin Milliand
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
