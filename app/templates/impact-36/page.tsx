// @ts-nocheck
"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Star, Target, Briefcase, Award, Globe, CheckCircle } from "lucide-react"
import {
  C,
  SERVICES,
  SECTORS,
  CASE_STUDIES,
  TESTIMONIALS,
  STATS,
  SectionReveal,
  Counter,
  MatchScore,
} from "./shared"


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Home() {
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
    <div>
      {/* HERO */}
      <section
        style={{
          background: C.navy,
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 40,
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "30%",
            width: 700,
            height: 700,
            background: `radial-gradient(circle, ${C.accent}25 0%, transparent 60%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 5%",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: `${C.accent}22`,
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 28,
                }}
              >
                <Award size={14} color="#60a5fa" />
                <span
                  style={{color: brand ?? '#60a5fa',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  2,400+ executive placements since 2007
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: "clamp(38px, 4.5vw, 60px)",
                  fontWeight: 900,
                  color: C.white,
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >{c?.heroHeadline ?? <>
                The people who{" "}
                <span
                  style={{
                    color: C.accent,
                    background: `linear-gradient(135deg, ${C.accent}, #60a5fa)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  build
                </span>{" "}
                category leaders
              </>}</motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{
                  fontSize: 18,
                  color: "#93c5fd",
                  lineHeight: 1.75,
                  marginBottom: 40,
                  maxWidth: 460,
                }}
              >{c?.heroSubline ?? fd?.tagline ?? <>
                Apex Talent places C-suite leaders and senior executives for companies that refuse to compromise on talent. Executive search, RPO, and HR consulting.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.accent,
                      color: C.white,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Hire Executive Talent <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      color: C.white,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 16,
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    I'm a Candidate
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Candidate match score visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: `${C.accent}30`,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Target size={24} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>
                      Candidate Match Report
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                      VP of Engineering — NovaTech Capital
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      background: "#22c55e22",
                      border: "1px solid #22c55e44",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#4ade80",
                    }}
                  >
                    SHORTLISTED
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <MatchScore score={97} label="Technical Expertise" />
                  <MatchScore score={93} label="Leadership Experience" />
                  <MatchScore score={89} label="Culture Alignment" />
                  <MatchScore score={95} label="Compensation Fit" />
                  <MatchScore score={91} label="Industry Background" />
                </div>

                <div
                  style={{
                    background: `${C.accent}15`,
                    border: `1px solid ${C.accent}30`,
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#93c5fd", fontSize: 14, fontWeight: 600 }}>
                    Overall Match Score
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: C.accent }}>
                    93%
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <CheckCircle size={16} color="#4ade80" />
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>
                    Passive candidate — not actively searching
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SUMMARY */}
      <section id="services" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Briefcase size={14} color={C.accentDark} />
                <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>
                  What We Do
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                Three ways we deliver results
              </>}</h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{c?.aboutText ?? <>
                From single executive searches to full HR transformation — we work at the intersection of talent strategy and business outcomes.
              </>}</p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {SERVICES.map((service, i) => (
              <SectionReveal key={service.name} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <service.icon size={26} color={C.accent} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 12 }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 24, flex: 1 }}>
                    {service.desc}
                  </p>
                  <Link href="/templates/impact-36/services" style={{ textDecoration: "none" }}>
                    <button
                      type="button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: C.accent,
                        fontWeight: 700,
                        fontSize: 14,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Learn more <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section id="results" style={{ padding: "100px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.white, marginBottom: 16 }}>
                18 years of measurable results
              </h2>
              <p style={{ fontSize: 17, color: "#93c5fd", maxWidth: 480, margin: "0 auto" }}>
                Numbers that define our commitment to quality over volume.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {STATS.map((s, i) => (
              <Counter key={s.label} end={s.end} suffix={s.suffix} label={s.label} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES HIGHLIGHTS */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>
                Success stories
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {CASE_STUDIES.map((cs, i) => (
              <SectionReveal key={cs.company} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    height: "100%",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        background: C.accentLight,
                        color: C.accent,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 10,
                      }}
                    >
                      {cs.sector}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{cs.company}</h3>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Challenge
                    </div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{cs.challenge}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Outcome
                    </div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{cs.outcome}</p>
                  </div>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 20,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 32, fontWeight: 900, color: C.accent }}>{cs.metric}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{cs.metricLabel}</div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/templates/impact-36/results" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all case studies
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.white, marginBottom: 12 }}>
                What our clients say
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: `${C.accent}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#60a5fa",
                        flexShrink: 0,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS LINK PREVIEW */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <SectionReveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: C.navy, marginBottom: 16 }}>
              Industries we serve
            </h2>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>
              Deep networks in 12 sectors, built over 18 years of specialized placement.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {SECTORS.slice(0, 4).map((sector) => (
                <div
                  key={sector}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.navy,
                  }}
                >
                  {sector}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <Link href="/templates/impact-36/sectors" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "14px 28px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Explore all industries
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
