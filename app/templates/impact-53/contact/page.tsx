"use client";

import React, { useState } from "react";
import {
  C,
  FONT_SYNE,
  FONT_MONO,
  Reveal,
  SectionLabel,
  SectionHeading,
} from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: C.black, padding: "6rem 2.5rem 8rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "5rem", textAlign: "center" }}>
            <SectionLabel>TRANSMISSIONS</SectionLabel>
            <SectionHeading>CONTACT</SectionHeading>
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
              ESTABLISH ROUTING WITH THE CREATIVE BASE. OUTLINE YOUR SYSTEM SPECIFICATIONS AND LAUNCH TIMELINE.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              border: `1px solid ${C.dim}`,
              padding: "3rem",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: "0.62rem", color: C.red, letterSpacing: "0.2em", display: "block", marginBottom: "1rem" }}>
                  [SIGNAL ROUTED]
                </span>
                <h3 style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "1.5rem", color: C.white, marginBottom: "1rem" }}>
                  MERCI
                </h3>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.58rem", fontFamily: FONT_MONO, color: C.dim, letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                    PROJECT NAME / COMPANY
                  </label>
                  <input
                    type="text"
                    required
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: `1px solid ${C.dim}`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: FONT_MONO,
                      outline: "none",
                    }}
                    placeholder="ENTER ENTITY NAME"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.58rem", fontFamily: FONT_MONO, color: C.dim, letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                    EMAIL ROUTE
                  </label>
                  <input
                    type="email"
                    required
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: `1px solid ${C.dim}`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: FONT_MONO,
                      outline: "none",
                    }}
                    placeholder="ENTER EMAIL ADDRESS"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.58rem", fontFamily: FONT_MONO, color: C.dim, letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                    PROJECT BRIEF
                  </label>
                  <textarea
                    required
                    rows={5}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: `1px solid ${C.dim}`,
                      padding: "1rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: FONT_MONO,
                      outline: "none",
                      resize: "none",
                    }}
                    placeholder="SPECIFY TARGET REQUIREMENTS..."
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: C.white,
                    color: C.black,
                    padding: "1.2rem",
                    border: "none",
                    fontFamily: FONT_SYNE,
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.red;
                    (e.currentTarget as HTMLButtonElement).style.color = C.white;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.white;
                    (e.currentTarget as HTMLButtonElement).style.color = C.black;
                  }}
                >
                  TRANSMIT BRIEF()
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
