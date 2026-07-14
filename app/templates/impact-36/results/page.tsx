"use client"

import React from "react"
import { Award, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { C, CASE_STUDIES, SectionReveal } from "../shared"

export default function ResultsPage() {
  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Title */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Award size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Our Results</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>
              Case Studies & Success
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Real metrics from real company partnerships. Here is how we build leaders.
            </p>
          </div>
        </SectionReveal>

        {/* Detailed Case Studies */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 64 }}>
          {CASE_STUDIES.map((cs, i) => (
            <SectionReveal key={cs.company} delay={i * 0.05}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: 48,
                  border: `1px solid ${C.border}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 48,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      background: C.accentLight,
                      color: C.accent,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 14,
                    }}
                  >
                    {cs.sector}
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 20 }}>{cs.company}</h2>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
                    <div style={{ fontSize: 48, fontWeight: 950, color: C.accent, lineHeight: 1 }}>{cs.metric}</div>
                    <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 600, lineHeight: 1.3 }}>{cs.metricLabel}</div>
                  </div>
                </div>

                <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 48, display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      The Challenge
                    </h4>
                    <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, margin: 0 }}>{cs.challenge}</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      The Outcome & Impact
                    </h4>
                    <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, margin: 0 }}>{cs.outcome}</p>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* CTA */}
        <SectionReveal delay={0.2}>
          <div
            style={{
              background: C.navy,
              borderRadius: 24,
              padding: "48px 56px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 16 }}>
              Ready to write your own success story?
            </h2>
            <p style={{ fontSize: 16, color: "#93c5fd", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Get in touch with our executive search team to secure high-caliber leaders today.
            </p>
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  color: C.white,
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Hire Apex Talent <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
