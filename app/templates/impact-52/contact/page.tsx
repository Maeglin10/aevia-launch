"use client";

import React, { useState } from "react";
import {
  C,
  F,
  Reveal,
  SectionLabel,
  GlitchHeadline,
} from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: C.BG, padding: "4rem 2rem 8rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem", textAlign: "center" }}>
            <SectionLabel code="[MODULE: TRANSMISSIONS.EXE]" color={C.CYAN} />
            <GlitchHeadline
              text="SEND SIGNAL"
              outlineText="CONNECT"
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
              ESTABLISH CONNECTION WITH THE CORE TEAM. SPECIFY YOUR MISSION
              AND GPU BUDGET OR PROJECT GUIDELINES BELOW.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              background: C.CARD_BG,
              border: `1px solid ${C.PINK}22`,
              borderRadius: "1.5rem",
              padding: "3rem",
              boxShadow: `0 8px 32px ${C.PINK}03`,
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <SectionLabel code="[SIGNAL: LOCKED]" color={C.CYAN} />
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    fontFamily: F.mono,
                    color: "#fff",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                  }}
                >
                  TRANSMISSION SUCCESSFUL
                </h3>
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontFamily: F.mono,
                    color: "#9999bb",
                    lineHeight: 1.8,
                    letterSpacing: "0.05em",
                  }}
                >
                  Your encrypted signal has been routed to the core node.
                  Expect response via secure channel in 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.58rem",
                      fontFamily: F.mono,
                      color: C.CYAN,
                      letterSpacing: "0.2em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    IDENTIFIER (NAME)
                  </label>
                  <input
                    type="text"
                    required
                    style={{
                      width: "100%",
                      background: C.BG,
                      border: `1px solid ${C.CYAN}33`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: F.mono,
                      outline: "none",
                    }}
                    placeholder="ENTER IDENTIFIER"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.58rem",
                      fontFamily: F.mono,
                      color: C.CYAN,
                      letterSpacing: "0.2em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    SIGNAL ROUTE (EMAIL)
                  </label>
                  <input
                    type="email"
                    required
                    style={{
                      width: "100%",
                      background: C.BG,
                      border: `1px solid ${C.CYAN}33`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: F.mono,
                      outline: "none",
                    }}
                    placeholder="ENTER ROUTE"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.58rem",
                      fontFamily: F.mono,
                      color: C.CYAN,
                      letterSpacing: "0.2em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    PAYLOAD (MESSAGE)
                  </label>
                  <textarea
                    required
                    rows={5}
                    style={{
                      width: "100%",
                      background: C.BG,
                      border: `1px solid ${C.CYAN}33`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: F.mono,
                      outline: "none",
                      resize: "none",
                    }}
                    placeholder="WRITE PAYLOAD DETAILS..."
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: C.PINK,
                    color: C.BG,
                    padding: "1.2rem",
                    border: "none",
                    fontFamily: F.mono,
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    letterSpacing: "0.25em",
                    cursor: "pointer",
                    boxShadow: `0 0 20px ${C.PINK}66`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 0 32px ${C.PINK}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 0 20px ${C.PINK}66`;
                  }}
                >
                  BROADCAST_SIGNAL()
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
