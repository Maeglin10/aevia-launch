"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  T,
  Reveal,
  AnimatedCounter,
  IntegrationMarquee,
  DashboardMockup,
  StickyFeatureSection,
  STATS,
  TESTIMONIALS,
} from "./shared";

export default function NexusPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7], [0, 1, 0.6]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.15], [0.96, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 120,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{ y: textY, position: "relative", zIndex: 10 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Reveal delay={0.05}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: T.accentLight,
                  border: `1px solid ${T.accent}30`,
                  borderRadius: 100,
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.accent,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.accent,
                    fontFamily: T.bodyFont,
                  }}
                >
                  Trusted by 50,000+ teams worldwide
                </span>
              </div>
            </Reveal>
          </div>

          <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
            <Reveal delay={0.1}>
              <h1
                style={{
                  fontSize: "clamp(38px, 6vw, 68px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: T.text,
                  fontFamily: T.headingFont,
                  lineHeight: 1.2,
                  paddingBottom: "12px",
                  marginBottom: 16,
                }}
              >
                The platform to build <br />
                <span className="text-indigo-600">your next great idea</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                style={{
                  fontSize: "clamp(15px, 1.8vw, 19px)",
                  lineHeight: 1.55,
                  color: T.muted,
                  fontFamily: T.bodyFont,
                  fontWeight: 450,
                  maxWidth: 600,
                  margin: "0 auto 40px",
                }}
              >
                Nexus gives your team deep analytics, pipeline connections, and
                enterprise-grade security in a single, unified workflow.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  marginBottom: 80,
                }}
              >
                <Link
                  href="/templates/impact-51/contact"
                  style={{
                    background: T.text,
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 10,
                    padding: "14px 28px",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: T.bodyFont,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Start free trial
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
                <Link
                  href="/templates/impact-51/pricing"
                  style={{
                    background: "transparent",
                    color: T.text,
                    textDecoration: "none",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "14px 28px",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: T.bodyFont,
                  }}
                >
                  View pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </motion.div>

        {/* Parallax Mockup */}
        <div style={{ width: "100%", maxWidth: 1040, padding: "0 20px", position: "relative", zIndex: 5 }}>
          <motion.div
            style={{
              y: mockupY,
              opacity: mockupOpacity,
              scale: mockupScale,
            }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ── INTEGRATION MARQUEE ────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "60px 0", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", marginBottom: 32 }}>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textAlign: "center",
              fontFamily: T.bodyFont,
            }}
          >
            Connected to your entire software ecosystem
          </h3>
        </div>
        <IntegrationMarquee />
      </section>

      {/* ── STICKY FEATURES ────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff" }}>
        <StickyFeatureSection />
      </section>

      {/* ── STATS SECTION ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "#fafafa",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: "100px 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 40,
            }}
          >
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 700,
                      color: T.text,
                      fontFamily: T.headingFont,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <AnimatedCounter
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.text,
                      fontFamily: T.bodyFont,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      fontFamily: T.bodyFont,
                    }}
                  >
                    {stat.sub}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section style={{ background: "#ffffff", padding: "120px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: T.bodyFont,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Testimonials
              </span>
              <h2
                style={{
                  fontSize: "clamp(26px, 3.2vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: T.text,
                  fontFamily: T.headingFont,
                }}
              >
                What builders are saying
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            {TESTIMONIALS.map((testi, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    background: "#fafafa",
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "36px 30px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "between",
                    height: "100%",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      color: T.text,
                      lineHeight: 1.6,
                      fontFamily: T.bodyFont,
                      fontWeight: 450,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    "{testi.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: testi.avatar,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: T.bodyFont,
                      }}
                    >
                      {testi.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                          fontFamily: T.bodyFont,
                        }}
                      >
                        {testi.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.muted,
                          fontFamily: T.bodyFont,
                        }}
                      >
                        {testi.title}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────────────── */}
      <section
        style={{
          background: T.text,
          padding: "100px 24px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Reveal>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontFamily: T.headingFont,
                marginBottom: 20,
              }}
            >
              Ready to accelerate?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                fontFamily: T.bodyFont,
                marginBottom: 40,
                lineHeight: 1.5,
              }}
            >
              Get started with Nexus today. Sign up for our 14-day free trial or talk to sales for volume pricing.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              {!submitted ? (
                <form
                  onSubmit={handleSubscribe}
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    maxWidth: 480,
                    width: "100%",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    style={{
                      flex: 1,
                      minWidth: 220,
                      padding: "13px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      fontSize: 14,
                      fontFamily: T.bodyFont,
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: T.accent,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "13px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: T.bodyFont,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Mail style={{ width: 15, height: 15 }} />
                    Get started
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: 12,
                    padding: "14px 24px",
                    fontSize: 15,
                    color: T.green,
                    fontWeight: 600,
                    fontFamily: T.bodyFont,
                  }}
                >
                  <Check style={{ width: 18, height: 18 }} />
                  You're in — check your inbox!
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
