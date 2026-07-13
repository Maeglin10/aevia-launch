"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import {
  FEATURES,
  STATS,
  Reveal,
  ParticleField,
  RotatingProduct,
  TypewriterCode,
} from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact54Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div ref={pageRef} className="text-[#e8e8ff]">
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
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

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid grid-cols-1 lg:grid-cols-2 imx-mobstack">
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
                  style={{fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: brand ?? '#00ffd1',
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
              >{c?.heroHeadline ?? <>
                Generative <br />
                Art Pipelines
              </>}</h1>
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
              >{c?.heroSubline ?? fd?.tagline ?? <>
                Consolidate your rendering stack onto a direct GPU cluster.
                Build, mutation, and deployment layered in mathematical vector spaces.
              </>}</p>
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
                style={{fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: brand ?? '#00ffd1',
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
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }} className="grid grid-cols-1 lg:grid-cols-2 imx-mobstack">
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
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  Synthesize directly from your terminal
                </>}</h2>
                <p style={{ fontSize: 15, color: "rgba(232,232,255,0.45)", lineHeight: 1.7, marginBottom: 32 }}>{c?.aboutText ?? <>
                  GraphQL and REST engines with auto-generated TypeScript declarations.
                  Construct layered primitives with pure, structured JavaScript.
                </>}</p>
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
                  style={{fontSize: "clamp(32px, 4.5vw, 56px)",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: brand ?? '#00ffd1',
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
      {/* ── 5. PRICING ── */}
      <section
        style={{
          background: "#03030d",
          padding: "120px 24px",
          borderTop: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 80, textAlign: "center" }}>
              <span style={{fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: brand ?? '#00ffd1', marginBottom: 12, display: "block" }}>
                Pricing
              </span>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontFamily: "'Syne', sans-serif", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Scale your rendering pipeline.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              {
                name: "Builder", price: "$79", period: "/mo", highlight: false,
                desc: "Perfect for indie artists and small studios.",
                features: ["50 GPU hours/month", "4K output resolution", "Atelier CLI access", "Community support", "5 active projects"],
              },
              {
                name: "Studio", price: "$299", period: "/mo", highlight: true,
                desc: "The full pipeline for professional studios.",
                features: ["Unlimited GPU hours", "8K + HDR output", "Priority inference queue", "Dedicated support channel", "Unlimited projects", "Custom LoRA fine-tuning", "API access (100k calls/mo)"],
              },
              {
                name: "Enterprise", price: "Custom", period: "", highlight: false,
                desc: "On-prem deployment and SLA guarantees.",
                features: ["On-premise deployment", "Custom SLA (99.99%)", "Dedicated GPU cluster", "SOC 2 Type II report", "SSO + SCIM provisioning", "Custom contract"],
              },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  style={{
                    background: plan.highlight ? "linear-gradient(135deg, #7c3aed, #5b21b6)" : "rgba(124,58,237,0.04)",
                    border: plan.highlight ? "none" : "1px solid rgba(124,58,237,0.15)",
                    borderRadius: 16,
                    padding: "48px 36px",
                    position: "relative",
                    boxShadow: plan.highlight ? "0 0 60px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {plan.highlight && (
                    <div style={{position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: brand ?? '#00ffd1', color: "#050510", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 16px", borderRadius: 100 }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.7)" : "rgba(232,232,255,0.45)", marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 32 }}>
                    <span style={{ fontSize: "clamp(36px, 4vw, 52px)", fontFamily: "'Syne', sans-serif", fontWeight: 800, color: plan.highlight ? "#fff" : "#00ffd1", letterSpacing: "-0.03em" }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.6)" : "rgba(232,232,255,0.4)" }}>{plan.period}</span>}
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 36 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.85)" : "rgba(232,232,255,0.6)" }}>
                        <Check style={{ width: 14, height: 14, color: plan.highlight ? "#00ffd1" : "#7c3aed", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/templates/impact-54/contact"
                    style={{
                      display: "block",
                      textAlign: "center" as const,
                      padding: "14px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                      background: plan.highlight ? "#00ffd1" : "rgba(124,58,237,0.1)",
                      color: plan.highlight ? "#050510" : "#e8e8ff",
                      border: plan.highlight ? "none" : "1px solid rgba(124,58,237,0.3)",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    {plan.name === "Enterprise" ? "Talk to Sales" : "Get Started"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section
        style={{
          background: "#050510",
          padding: "120px 24px",
          textAlign: "center" as const,
          borderTop: "1px solid rgba(124,58,237,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <span style={{fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: brand ?? '#00ffd1', marginBottom: 12, display: "block" }}>
              Start rendering
            </span>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: 24,
                background: "linear-gradient(to right, #fff, rgba(232,232,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              The GPU cluster is waiting.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(232,232,255,0.4)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px" }}>
              Deploy your first pipeline in under 5 minutes. No credit card required for the 14-day trial.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
              <Link
                href="/templates/impact-54/contact"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "16px 36px",
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 0 40px rgba(124,58,237,0.4)",
                }}
              >
                Start free trial <ArrowUpRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link
                href="/templates/impact-54/pricing"
                style={{
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#e8e8ff",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "16px 36px",
                  borderRadius: 8,
                  background: "transparent",
                }}
              >
                Compare plans
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
