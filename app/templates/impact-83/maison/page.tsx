"use client";

import React, { useState } from "react";
import { Shield, Clock, Users } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, STATS, TEAM, FAQ, Reveal, Counter } from "../shared";

export default function MaisonPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section style={{ padding: "100px 24px", background: C.bg }} id="maison">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 30, marginBottom: 100 }}>
          {STATS.map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, fontFamily: FONT_HEADING, color: C.accent, marginBottom: 10 }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 11, fontFamily: FONT_LABEL, color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Story */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 60, marginBottom: 100, alignItems: "center" }}>
          <Reveal>
            <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
              Manufacture Historique
            </span>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 44, fontWeight: 300, color: C.text, marginTop: 16, lineHeight: 1.15 }}>
              L&apos;Excellence depuis <em>1887</em>
            </h2>
            <p style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.8, marginTop: 20 }}>
              Fondée à Paris à la fin du XIXe siècle, la maison Aurelius Heritage a traversé les époques en préservant le geste artisanal pur. Nos pièces combinent les techniques de sertissage traditionnelles françaises et les complications horlogères les plus rigoureuses de l&apos;arc jurassien suisse.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, padding: 40 }}>
              <Shield size={36} color={C.accent} style={{ marginBottom: 20 }} />
              <h4 style={{ fontFamily: FONT_HEADING, fontSize: 20, color: C.text, marginBottom: 12 }}>Certification GIA</h4>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>
                Chaque diamant au-delà de 0.5 carat est accompagné d&apos;un certificat du Gemological Institute of America (GIA), garantissant l&apos;origine éthique (Kamberley Process) et les critères 4C les plus élevés du marché.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 100 }}>
          <Reveal>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 36, fontWeight: 300, color: C.text, marginBottom: 50, textAlign: "center" }}>
              Le Conseil de la <em>Maison</em>
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: 30 }}>
            {TEAM.map((member, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 30, height: "100%" }}>
                  <h4 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.text, marginBottom: 4 }}>{member.name}</h4>
                  <div style={{ fontSize: 11, fontFamily: FONT_LABEL, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>{member.role}</div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{member.bio}</p>
                  <div style={{ fontSize: 12, color: C.accent, fontFamily: FONT_LABEL }}>Expérience : {member.exp}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <Reveal>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 36, fontWeight: 300, color: C.text, marginBottom: 50, textAlign: "center" }}>
              Questions <em>Fréquentes</em>
            </h2>
          </Reveal>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {FAQ.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div style={{ borderBottom: `1px solid ${C.border}`, padding: "24px 0" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: C.text,
                      fontFamily: FONT_HEADING,
                      fontSize: 20,
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ color: C.accent }}>{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <div style={{ marginTop: 16, fontSize: 16, color: C.textMuted, lineHeight: 1.6 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
