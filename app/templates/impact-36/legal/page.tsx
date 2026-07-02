"use client"

import React from "react"
import { Shield, Mail, FileText } from "lucide-react"
import { C, SectionReveal } from "../shared"

export default function LegalPage() {
  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Title */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: C.navy, marginBottom: 16 }}>
              Legal Notice & Privacy Policy
            </h1>
            <p style={{ fontSize: 16, color: C.textMuted }}>
              Apex Talent is a showcase template operated by Aevia WS.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Editor Info */}
          <SectionReveal delay={0.05}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <FileText size={20} color={C.accent} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>1. Editor & Publisher</h3>
              </div>
              <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
                <p>
                  This showcase demonstration is published and operated by <strong>Aevia WS</strong>, represented by Valentin Milliand.
                </p>
                <ul style={{ paddingLeft: 20, marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <li><strong>Legal Representative:</strong> Valentin Milliand</li>
                  <li><strong>Status:</strong> Auto-entrepreneur (Aevia WS)</li>
                  <li><strong>Registration Number (SIREN):</strong> 852 546 225</li>
                  <li><strong>RCS Registration:</strong> RCS Bourg-en-Bresse</li>
                  <li>
                    <strong>Physical Address:</strong> Communautary address provided upon request.
                  </li>
                  <li>
                    <strong>Contact Email:</strong>{" "}
                    <a href="mailto:valentinmilliand@aevia.services" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>
                      valentinmilliand@aevia.services
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </SectionReveal>

          {/* Hosting */}
          <SectionReveal delay={0.1}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Shield size={20} color={C.accent} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>2. Hosting Services</h3>
              </div>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                This site is hosted by <strong>Vercel Inc.</strong>, located at 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                They can be contacted on their official website (vercel.com).
              </p>
            </div>
          </SectionReveal>

          {/* Intellectual Property & Data */}
          <SectionReveal delay={0.15}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Shield size={20} color={C.accent} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>3. Intellectual Property & GDPR</h3>
              </div>
              <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 12 }}>
                <p>
                  All visual designs, logos, text elements, and match score metrics in the Apex Talent template are properties of Aevia WS.
                  Any copy or replication without explicit written authorization is prohibited.
                </p>
                <p>
                  <strong>Personal Data:</strong> Any mock job descriptions, company profiles, resumes, or email addresses uploaded or filled out on this showcase website are processed strictly to simulate recruitment workflows. No data is stored permanently or sold to third parties.
                </p>
                <p>
                  You may contact Aevia WS at <a href="mailto:valentinmilliand@aevia.services" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>valentinmilliand@aevia.services</a> to request details rectifications or full profile removal.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  )
}
