"use client";

import React from "react";
import Link from "next/link";
import {
  C,
  SERIF,
  SANS,
  CAVE_BOTTLES,
  SectionReveal,
  PageHeader,
} from "../shared";

export default function CavePage() {
  return (
    <section style={{ padding: "140px 5% 100px", background: C.bgAlt, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <PageHeader
          kicker="La Cave à Emporter"
          title="Nos bouteilles d'exception"
          sub="Au-delà du bar, notre cave réunit 280 références à emporter. Les flacons ci-dessous, sélectionnés par notre sommelière, sont disponibles à la réservation en boutique."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {CAVE_BOTTLES.map((b, i) => (
            <SectionReveal key={b.name} delay={i * 0.08}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 4,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      background: C.goldLight,
                      color: C.gold,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 2,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {b.region}
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.textMuted,
                    }}
                  >
                    {b.year}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.burgundy,
                    marginBottom: 4,
                  }}
                >
                  {b.name}
                </h3>
                <div
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    fontStyle: "italic",
                    marginBottom: 16,
                  }}
                >
                  {b.appellation}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    flex: 1,
                    marginBottom: 24,
                  }}
                >
                  {b.note}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 18,
                  }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                    }}
                  >
                    {b.price} €
                  </div>
                  <Link href="/templates/impact-37/contact" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        background: C.burgundy,
                        color: C.cream,
                        padding: "10px 20px",
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontFamily: SANS,
                      }}
                    >
                      Réserver en boutique
                    </button>
                  </Link>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <p
            style={{
              marginTop: 48,
              textAlign: "center",
              fontSize: 13,
              color: C.textMuted,
              maxWidth: 560,
              margin: "48px auto 0",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            Retrait sur place uniquement. Pour découvrir l'intégralité des 280
            références ou organiser une dégustation privée, contactez notre équipe.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
