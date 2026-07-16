"use client";

import React from "react";
import { Check } from "lucide-react";
import { PRICING, Reveal } from "../shared";

export default function PricingPage() {
  return (
    <main style={{ background: "#050510", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80, maxWidth: 600, margin: "0 auto 80px" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#00ffd1",
                marginBottom: 12,
                display: "block",
              }}
            >
              Subscription Plans
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                lineHeight: 1.25,
                paddingBottom: "8px",
                letterSpacing: "-0.03em",
                color: "#e8e8ff",
                marginBottom: 12,
              }}
            >
              Predictable, usage-based rates
            </h1>
            <p style={{ fontSize: 16, color: "rgba(232,232,255,0.45)", lineHeight: 1.6 }}>
              Scale from solo experimentation to enterprise GPU clusters. Zero hidden fees.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 32, alignItems: "stretch" }}>
          {PRICING.map((plan, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div
                style={{
                  background: plan.accent ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.04)",
                  border: plan.accent ? "1px solid #7c3aed" : "1px solid rgba(124,58,237,0.15)",
                  borderRadius: 16,
                  padding: "48px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "between",
                  height: "100%",
                  boxShadow: plan.accent ? "0 0 40px rgba(124,58,237,0.2)" : "none",
                  position: "relative",
                }}
              >
                {plan.accent && (
                  <span style={{ position: "absolute", top: 0, right: 36, transform: "translateY(-50%)", background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 12px", borderRadius: 100 }}>
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 8 }}>
                    {plan.tier}
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 44, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: "rgba(232,232,255,0.4)" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(232,232,255,0.45)", lineHeight: 1.5, marginBottom: 32 }}>
                    {plan.desc}
                  </p>

                  <hr style={{ border: "none", borderTop: "1px solid rgba(124,58,237,0.12)", marginBottom: 32 }} />

                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                    {plan.features.map((feat) => (
                      <li key={feat} style={{ display: "flex", alignItems: "start", gap: 12, fontSize: 13, color: "rgba(232,232,255,0.7)" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <Check style={{ width: 10, height: 10, color: "#00ffd1" }} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "auto",
                    background: plan.accent ? "#7c3aed" : "rgba(124,58,237,0.08)",
                    border: plan.accent ? "none" : "1px solid rgba(124,58,237,0.3)",
                    color: "#fff",
                  }}
                >
                  Start Rendering
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
