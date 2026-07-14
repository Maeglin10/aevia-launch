"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { C, bookingTiers } from "../shared";

export default function BookingPage() {
  const [formState, setFormState] = useState({ name: "", email: "", artist: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: C.bgAlt, minHeight: "100dvh", padding: "80px 24px 120px", fontFamily: "'Barlow', system-ui" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Book Your Session</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 20px", fontWeight: 700 }}>Pricing & Tiers</h1>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>Every session begins with a free consultation. We quote before we begin — no surprises.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 80 }}>
          {bookingTiers.map((tier) => (
            <div
              key={tier.name}
              style={{ background: C.bgCard, padding: 36, position: "relative", display: "flex", flexDirection: "column", border: `1px solid ${C.border}` }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 16, right: 16, background: C.white, color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px" }}>Popular</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: C.white, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 28, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <Check size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", width: "100%", textAlign: "center", background: tier.featured ? C.accent : "transparent", color: C.white, border: `1px solid ${C.accent}`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}
              >{tier.cta}</button>
            </div>
          ))}
        </div>

        {/* Reservation Request Form */}
        <div id="booking-form" style={{ maxWidth: 800, margin: "0 auto", background: C.bgCard, padding: 48, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, color: C.white, marginBottom: 12, fontWeight: 700 }}>Inquire for a Session</h2>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 36 }}>Please fill out the form below. Our average response time is 24–48 hours.</p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.white }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: C.white, marginBottom: 12 }}>Merci</h3>
              <p style={{ color: C.textMuted }}>Merci, nous vous répondrons sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="two-col">
                <div>
                  <label style={{ display: "block", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Name</label>
                  <input
                    required
                    value={formState.name}
                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    type="text"
                    placeholder="Jean Dupont"
                    style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.white, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
                  <input
                    required
                    value={formState.email}
                    onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    placeholder="jean@example.com"
                    style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.white, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Preferred Artist</label>
                <select
                  required
                  value={formState.artist}
                  onChange={e => setFormState(prev => ({ ...prev, artist: e.target.value }))}
                  style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted, outline: "none", cursor: "pointer" }}
                >
                  <option value="">Select Artist</option>
                  <option value="mara">Mara Voss (Fine Line)</option>
                  <option value="theo">Théo Marchais (Blackwork)</option>
                </select>
              </div>

              <div style={{ marginBottom: 36 }}>
                <label style={{ display: "block", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Describe your project</label>
                <textarea
                  required
                  value={formState.description}
                  onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  placeholder="Placement on body, approximate size in cm, style preferences, or any references..."
                  style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.white, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                style={{ width: "100%", background: C.accent, color: C.white, border: "none", padding: "18px 40px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
