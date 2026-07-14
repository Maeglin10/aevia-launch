"use client"

import React from "react"
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { C, SECTORS, SectionReveal } from "../shared"

const SECTORS_DETAIL = [
  {
    name: "Technology & SaaS",
    desc: "Placing software leaders, VP of engineering, product management leads and scale-up executives.",
    placements: "840+ Placements",
  },
  {
    name: "Financial Services",
    desc: "Executive recruitment for asset managers, fintech startups, investment banks and capital firms.",
    placements: "410+ Placements",
  },
  {
    name: "Healthcare & Life Sciences",
    desc: "Talent acquisition for private clinics, biotech leaders, digital health developers and medical experts.",
    placements: "320+ Placements",
  },
  {
    name: "Private Equity",
    desc: "Post-acquisition leadership teams, operating partners and portfolio CEOs/CFOs.",
    placements: "280+ Placements",
  },
  {
    name: "Manufacturing",
    desc: "Supply chain executives, factory directors, logistics managers and industry operations leaders.",
    placements: "160+ Placements",
  },
  {
    name: "Professional Services",
    desc: "Recruiting partners, directors, practice leads and strategy consultants.",
    placements: "140+ Placements",
  },
  {
    name: "Retail & Consumer",
    desc: "E-commerce directors, retail managers, CMOs and brand management executives.",
    placements: "110+ Placements",
  },
  {
    name: "Energy & Cleantech",
    desc: "Renewable energy executives, ESG managers and smart grid engineers.",
    placements: "80+ Placements",
  },
  {
    name: "Media & Entertainment",
    desc: "Content production directors, streaming platform executives and digital publishers.",
    placements: "70+ Placements",
  },
  {
    name: "Real Estate",
    desc: "Property developers, commercial real estate directors and property managers.",
    placements: "60+ Placements",
  },
  {
    name: "Legal",
    desc: "General counsel, partners for international firms and compliance directors.",
    placements: "50+ Placements",
  },
  {
    name: "Non-Profit",
    desc: "Executive directors, board members and fundraising campaign leads.",
    placements: "40+ Placements",
  },
]

export default function SectorsPage() {
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
              <Globe size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Industries We Serve</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>
              Our Industry Sectors
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Deep networks in 12 sectors, built over 18 years of specialized placement.
            </p>
          </div>
        </SectionReveal>

        {/* Sectors Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 64 }}>
          {SECTORS_DETAIL.map((sector, i) => (
            <SectionReveal key={sector.name} delay={i * 0.05}>
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                }}
                className="group hover:bg-blue-50 hover:border-blue-300"
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Globe size={18} color={C.accent} style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>{sector.name}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: 0, marginBottom: 20 }}>
                    {sector.desc}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <CheckCircle2 size={14} color={C.accent} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{sector.placements}</span>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* CTA */}
        <SectionReveal delay={0.25}>
          <div
            style={{
              background: C.navy,
              borderRadius: 24,
              padding: "48px 56px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 16 }}>
              Looking for a partner in your industry?
            </h2>
            <p style={{ fontSize: 16, color: "#93c5fd", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Our recruiters have deep hands-on expertise in these industries and can find high-quality candidates immediately.
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
                Start a Search <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
