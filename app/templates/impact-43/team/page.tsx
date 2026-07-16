"use client";

import React from "react";
import { C, TEAM, TherapistCard, TextReveal } from "../shared";

export default function TeamPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100dvh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.sage,
                marginBottom: 16,
              }}
            >
              The Practitioners
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.charcoal,
                lineHeight: 1.1,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Hands you can trust
            </h1>
          </TextReveal>
          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "#6b7265",
              maxWidth: 600,
              lineHeight: 1.8,
              fontWeight: 300,
              margin: "24px auto 0",
            }}
          >
            Our guides and therapists bring decades of collective experience in somatic bodywork, water therapy, and traditional medicine. Each practitioner is dedicated to holding a safe space for your integration.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 48,
          }}
        >
          {TEAM.map((therapist, i) => (
            <TherapistCard key={therapist.name} therapist={therapist} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
