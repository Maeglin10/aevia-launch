"use client";

import React from "react";
import { Check } from "lucide-react";
import { T, PLANS, Reveal } from "../shared";

export default function PricingPage() {
  return (
    <main style={{ background: "#ffffff", paddingTop: 140, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80, maxWidth: 640, margin: "0 auto 80px" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
                display: "block",
              }}
            >
              Pricing Plans
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.25,
                paddingBottom: "8px",
                marginBottom: 12,
              }}
            >
              Simple, transparent pricing
            </h1>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                fontFamily: T.bodyFont,
                lineHeight: 1.5,
              }}
            >
              Choose the plan that's right for you. Try any plan free for 14 days — no credit card required.
            </p>
          </div>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 32,
            alignItems: "stretch",
            marginBottom: 80,
          }}
        >
          {PLANS.map((plan, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div
                style={{
                  background: plan.popular ? T.accent : "#fff",
                  border: plan.popular ? "none" : `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "48px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "between",
                  height: "100%",
                  boxShadow: plan.popular
                    ? `0 20px 48px ${T.accent}25`
                    : "0 4px 20px rgba(0,0,0,0.03)",
                  position: "relative",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#000",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 100,
                      letterSpacing: "0.05em",
                      fontFamily: T.bodyFont,
                      textTransform: "uppercase",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: plan.popular ? "#fff" : T.text,
                      fontFamily: T.headingFont,
                      marginBottom: 8,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: plan.popular ? "#fff" : T.text,
                        fontFamily: T.headingFont,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: plan.popular ? "rgba(255,255,255,0.7)" : T.muted,
                      fontFamily: T.bodyFont,
                      marginBottom: 32,
                    }}
                  >
                    {plan.per}
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: `1px solid ${
                        plan.popular ? "rgba(255,255,255,0.15)" : T.border
                      }`,
                      marginBottom: 32,
                    }}
                  />

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px" }}>
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          fontSize: 14,
                          color: plan.popular ? "rgba(255,255,255,0.9)" : "#374151",
                          fontFamily: T.bodyFont,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            background: plan.popular
                              ? "rgba(255,255,255,0.2)"
                              : T.accentLight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <Check
                            style={{
                              width: 12,
                              height: 12,
                              color: plan.popular ? "#fff" : T.accent,
                            }}
                          />
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
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: T.bodyFont,
                    marginTop: "auto",
                    ...(plan.popular
                      ? {
                          background: "#fff",
                          color: T.accent,
                          border: "none",
                        }
                      : {
                          background: T.subtle,
                          color: T.text,
                          border: `1px solid ${T.border}`,
                        }),
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
