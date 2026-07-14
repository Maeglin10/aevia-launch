"use client";

import React from "react";
import { C, TextReveal } from "../shared";

export default function PhilosophyPage() {
  return (
    <div style={{ background: C.charcoal, color: C.white, minHeight: "100dvh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 16,
              }}
            >
              Our Philosophy
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.white,
                lineHeight: 1.1,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              The art of doing nothing
            </h1>
          </TextReveal>
        </div>

        <div>
          {[
            {
              title: "Slow by design",
              body: "We cap daily arrivals at thirty guests. This is not a volume business. It is a precision one. Your experience of silence depends on us maintaining it. We encourage analog hours — phones are kept securely in lockers.",
            },
            {
              title: "Honest ingredients",
              body: "Every botanical in our treatments is certified organic and sourced within 200km. Our water comes from a granite spring at 1,400m in the Chartreuse Massif. We don't compromise on materials or source shortcuts.",
            },
            {
              title: "Trained hands",
              body: "Our therapists complete 800 hours of training before their first independent session. Then they continue — weekly workshops, eastern medicine apprenticeships, and annual somatic research reviews.",
            },
            {
              title: "Seasonal awareness",
              body: "We change our treatment oils, botanical teas, and integration snacks according to the solar seasons. Aligning physical recovery with natural seasonal cycles is at the heart of our practice.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              style={{
                paddingBottom: 48,
                marginBottom: 48,
                borderBottom: i < 3 ? `1px solid rgba(255,255,255,0.08)` : "none",
              }}
            >
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: 26,
                  color: C.gold,
                  marginBottom: 16,
                  fontWeight: 400,
                }}
              >
                {item.title}
              </h2>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 16,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
