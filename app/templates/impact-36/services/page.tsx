"use client"

import React, { useState } from "react"
import { Check, Target, Users, BarChart2, Briefcase, ArrowRight, UserCheck, Paperclip } from "lucide-react"
import { C, SERVICES, SectionReveal } from "../shared"

export default function ServicesPage() {
  const [formType, setFormType] = useState<"client" | "candidate">("client")
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      setSubmitted(true)
    }
  }

  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100vh" }}>
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
              <Briefcase size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>What We Do</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>
              Our Services
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              From single executive searches to full HR transformation — we work at the intersection of talent strategy and business outcomes.
            </p>
          </div>
        </SectionReveal>

        {/* Detailed services lists */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 80 }}>
          {SERVICES.map((service, i) => (
            <SectionReveal key={service.name} delay={i * 0.05}>
              <div
                id={service.name.toLowerCase().includes("executive") ? "executive" : service.name.toLowerCase().includes("outsourcing") ? "rpo" : "consulting"}
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: 48,
                  border: `1px solid ${C.border}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 48,
                  scrollMarginTop: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                    }}
                  >
                    <service.icon size={26} color={C.accent} />
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.navy, marginBottom: 16 }}>{service.name}</h2>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{service.desc}</p>
                </div>

                <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 48 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                    Core Deliverables
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {service.details.map((d) => (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={16} color={C.accent} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Contact Form Section */}
        <SectionReveal delay={0.1}>
          <div
            id="contact-form"
            style={{
              maxWidth: 700,
              margin: "0 auto",
              background: C.white,
              border: `1.5px solid ${C.accent}`,
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 10px 40px rgba(37,99,235,0.05)",
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, margin: 0 }}>
                    Get in touch with Apex
                  </h2>
                  <p style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>
                    Select your path below to connect with our talent advisors.
                  </p>
                </div>

                {/* Form type toggle tabs */}
                <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, marginBottom: 28 }}>
                  <button
                    type="button"
                    onClick={() => setFormType("client")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: formType === "client" ? C.white : "transparent",
                      color: formType === "client" ? C.accent : C.textMuted,
                      transition: "all 0.2s",
                    }}
                  >
                    I'm looking to Hire
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("candidate")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: formType === "candidate" ? C.white : "transparent",
                      color: formType === "candidate" ? C.accent : C.textMuted,
                      transition: "all 0.2s",
                    }}
                  >
                    I'm a Candidate
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sarah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {formType === "client" ? (
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: NovaTech Capital"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>Upload CV / Resume</label>
                      <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "20px", textAlign: "center", cursor: "pointer", background: C.bg }}>
                        <Paperclip size={24} color={C.accent} style={{ margin: "0 auto 8px" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>Click to upload (PDF or Word, max 5MB)</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: "block", marginBottom: 6 }}>
                      {formType === "client" ? "Describe your hiring needs" : "Tell us about your background"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={formType === "client" ? "We need a VP of Engineering..." : "I'm a senior product leader with 10 years of experience..."}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.white,
                      padding: "16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    Submit request <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ width: 64, height: 64, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <UserCheck size={28} color={C.accent} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Merci</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: 460, margin: "0 auto 24px" }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
                >
                  Make another submission
                </button>
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
