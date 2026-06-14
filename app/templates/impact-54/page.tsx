"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  FEATURES,
  STATS,
  Reveal,
  ParticleField,
  RotatingProduct,
  TypewriterCode,
} from "./shared";

export default function Impact54Page() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={pageRef} className="text-[#e8e8ff]">
      {/* ── 1. PARTICLE FIELD HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(124,58,237,0.1) 0%, #050510 70%)",
        }}
      >
        <ParticleField />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <Reveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  marginBottom: 32,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#00ffd1",
                  }}
                >
                  Atelier v2.4 Release
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                style={{
                  fontSize: "clamp(38px, 5vw, 68px)",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  paddingBottom: "8px",
                  letterSpacing: "-0.03em",
                  marginBottom: 16,
                  background: "linear-gradient(to right, #fff, rgba(232,232,255,0.7))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Generative <br />
                Art Pipelines
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(232,232,255,0.5)",
                  lineHeight: 1.6,
                  maxWidth: 480,
                  marginBottom: 40,
                }}
              >
                Consolidate your rendering stack onto a direct GPU cluster.
                Build, mutation, and deployment layered in mathematical vector spaces.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div style={{ display: "flex", gap: 16 }}>
                <Link
                  href="/templates/impact-54/contact"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "14px 28px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                  }}
                >
                  Start rendering
                  <ArrowUpRight style={{ width: 15, height: 15 }} />
                </Link>
                <Link
                  href="/templates/impact-54/pricing"
                  style={{
                    border: "1px solid rgba(124,58,237,0.3)",
                    color: "#e8e8ff",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "14px 28px",
                    borderRadius: 8,
                  }}
                >
                  View pricing
                </Link>
              </div>
            </Reveal>
          </div>

          <div>
            <RotatingProduct scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </section>

      {/* ── 2. FEATURE CARDS ── */}
      <section
        style={{
          background: "#050510",
          padding: "120px 24px",
          borderTop: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 80, maxWidth: 560 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#00ffd1",
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Product Capability
              </span>
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Engineered for vector performance
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div
                    style={{
                      background: "rgba(124,58,237,0.04)",
                      border: "1px solid rgba(124,58,237,0.15)",
                      borderRadius: 16,
                      padding: 40,
                      height: "100%",
                      position: "relative",
                      transition: "border-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = feat.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.15)";
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: `${feat.color}15`,
                        border: `1px solid ${feat.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 28,
                      }}
                    >
                      <Icon style={{ width: 20, height: 20, color: feat.color }} />
                    </div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(232,232,255,0.45)", lineHeight: 1.6 }}>
                      {feat.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. TYPEWRITER CODE REVEAL ── */}
      <section
        style={{
          background: "#03030d",
          padding: "120px 24px",
          borderTop: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }} className="grid grid-cols-1 lg:grid-cols-2">
          <TypewriterCode />
          <div>
            <Reveal>
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#7c3aed",
                    marginBottom: 12,
                    display: "block",
                  }}
                >
                  Programmable Pipelines
                </span>
                <h2
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    marginBottom: 24,
                  }}
                >
                  Synthesize directly from your terminal
                </h2>
                <p style={{ fontSize: 15, color: "rgba(232,232,255,0.45)", lineHeight: 1.7, marginBottom: 32 }}>
                  GraphQL and REST engines with auto-generated TypeScript declarations.
                  Construct layered primitives with pure, structured JavaScript.
                </p>
                <Link
                  href="/templates/impact-54/contact"
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    color: "#e8e8ff",
                    textDecoration: "none",
                    fontWeight: 650,
                    fontSize: 13,
                    padding: "12px 24px",
                    borderRadius: 8,
                  }}
                >
                  Read the API Docs
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. STATS ── */}
      <section
        style={{
          background: "#050510",
          padding: "100px 24px",
          borderTop: "1px solid rgba(124,58,237,0.12)",
          borderBottom: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }} className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 56px)",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "#00ffd1",
                    marginBottom: 8,
                    textShadow: "0 0 20px rgba(0,255,209,0.3)",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(232,232,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
