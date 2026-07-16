"use client";

import React from "react";
import { Eye } from "lucide-react";
import {
  C,
  F,
  PORTFOLIO,
  Reveal,
  SectionLabel,
  GlitchHeadline,
} from "../shared";

export default function PortfolioPage() {
  return (
    <main style={{ background: C.BG, padding: "4rem 2rem 8rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel code="[MODULE: PORTFOLIO.EXE]" color={C.CYAN} />
            <GlitchHeadline
              text="SELECTED"
              outlineText="WORKS"
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
              }}
            >
              A CATALOGUE OF DEPLOYED CYBER-ENVIRONMENTS. WEB3 PLATFORMS,
              ENTERPRISE SECURITY CONSOLES, AND INTERACTIVE NEON SHARDS.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
            gap: "2.5rem",
          }}
        >
          {PORTFOLIO.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div
                style={{
                  background: C.CARD_BG,
                  border: `1px solid ${item.accent}22`,
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow: `0 8px 32px ${item.accent}05`,
                  transition: "all 0.4s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    item.accent;
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 16px 48px ${item.accent}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    `${item.accent}22`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 8px 32px ${item.accent}05`;
                }}
              >
                {/* Visual container */}
                <div
                  style={{
                    height: "220px",
                    background: item.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: `1px solid ${item.accent}22`,
                  }}
                >
                  <Eye
                    size={44}
                    style={{
                      color: item.accent,
                      filter: `drop-shadow(0 0 12px ${item.accent})`,
                      opacity: 0.8,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1.25rem",
                      fontSize: "0.52rem",
                      fontFamily: F.mono,
                      color: item.accent,
                      border: `1px solid ${item.accent}44`,
                      padding: "0.25rem 0.6rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: "2rem" }}>
                  <span
                    style={{
                      fontSize: "0.52rem",
                      fontFamily: F.mono,
                      color: "#6666aa",
                      letterSpacing: "0.2em",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.category}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      fontFamily: F.mono,
                      color: "#fff",
                      letterSpacing: "0.08em",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontFamily: F.mono,
                      color: "#9999bb",
                      lineHeight: 1.7,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
