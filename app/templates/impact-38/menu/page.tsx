"use client";

import React from "react";
import { C, MENU_SECTIONS, SectionReveal, PageHeader } from "../shared";

export default function MenuPage() {
  return (
    <div>
      <PageHeader
        title="Menu Café"
        subtitle="Tout ce que nous servons est préparé avec nos propres cafés de spécialité, fraîchement torréfiés. Notre grain du jour change chaque semaine."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {MENU_SECTIONS.map((section, si) => (
            <SectionReveal key={section.title} delay={si * 0.08}>
              <div style={{ marginBottom: 56 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <span style={{ fontSize: 28 }}>{section.icon}</span>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.espresso, margin: 0 }}>
                    {section.title}
                  </h2>
                </div>
                <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {section.items.map((item, ii) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 28px",
                        borderBottom: ii < section.items.length - 1 ? `1px solid ${C.borderLight}` : "none",
                        gap: 20,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 300, lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.caramel, flexShrink: 0 }}>
                        {item.price} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}

          <SectionReveal delay={0.3}>
            <div style={{ background: C.bgAlt, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>🫘</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>
                Cafés à emporter
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, maxWidth: 420, margin: "0 auto", fontWeight: 300 }}>
                Tous nos cafés sont disponibles en sac à emporter. Nos torréfactions ont lieu le mardi et vendredi matin — venez chercher votre café quelques heures après la torréfaction.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
