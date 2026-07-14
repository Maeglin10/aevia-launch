"use client";

import React from "react";
import { C, styleGuide } from "../shared";

export default function StylesPage() {
  return (
    <div style={{ background: C.bgAlt, minHeight: "100dvh", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Style Guide</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Our Disciplines</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {styleGuide.map((style) => (
            <div
              key={style.name}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}` }}
            >
              <div style={{ fontSize: 48, marginBottom: 24, color: C.accent, fontFamily: "monospace" }}>{style.icon}</div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{style.name}</h3>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.accent, margin: "0 0 20px", letterSpacing: "0.06em" }}>with {style.artist}</p>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 28 }}>{style.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {style.traits.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 4, height: 4, background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
