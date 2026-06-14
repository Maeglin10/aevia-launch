"use client";

import React from "react";
import {
  C,
  F,
  TEAM,
  Reveal,
  SectionLabel,
  GlitchHeadline,
} from "../shared";

export default function TeamPage() {
  return (
    <main style={{ background: C.BG, padding: "4rem 2rem 8rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel code="[MODULE: TEAM.EXE]" color={C.CYAN} />
            <GlitchHeadline
              text="CORE"
              outlineText="AGENTS"
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
              OPERATIVES ON THE GRID. SENIOR SYSTEM DESIGNERS, DISTRIBUTED SYSTEM
              ENGINEERS, AND SILICON STRATEGISTS READY TO SHIP.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {TEAM.map((member, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div
                style={{
                  background: C.CARD_BG,
                  border: `1px solid ${member.color}22`,
                  borderRadius: "1rem",
                  padding: "2.5rem",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: `0 8px 32px ${member.color}03`,
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    member.color;
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 16px 48px ${member.color}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    `${member.color}22`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 8px 32px ${member.color}03`;
                }}
              >
                {/* Neon tag top left */}
                <span
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    left: "1.25rem",
                    fontSize: "0.52rem",
                    fontFamily: F.mono,
                    color: member.color,
                    letterSpacing: "0.1em",
                  }}
                >
                  {member.stat}
                </span>

                {/* Avatar circle replacement */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: `2px solid ${member.color}`,
                    boxShadow: `0 0 16px ${member.color}`,
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 950,
                    fontFamily: F.mono,
                    color: member.color,
                  }}
                >
                  {member.name.split("_").map(w => w[0]).join("")}
                </div>

                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    fontFamily: F.mono,
                    color: "#fff",
                    letterSpacing: "0.08em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {member.name}
                </h3>

                <span
                  style={{
                    fontSize: "0.55rem",
                    fontFamily: F.mono,
                    color: member.color,
                    letterSpacing: "0.15em",
                    display: "block",
                    marginBottom: "1.25rem",
                  }}
                >
                  {member.role}
                </span>

                <p
                  style={{
                    fontSize: "0.68rem",
                    fontFamily: F.mono,
                    color: "#9999bb",
                    lineHeight: 1.7,
                    letterSpacing: "0.05em",
                    marginBottom: "1.5rem",
                  }}
                >
                  {member.bio}
                </p>

                <span
                  style={{
                    fontSize: "0.58rem",
                    fontFamily: F.mono,
                    color: "#6666aa",
                    letterSpacing: "0.1em",
                  }}
                >
                  {member.handle}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
