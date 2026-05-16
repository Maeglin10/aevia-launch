"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  Users,
  TrendingUp,
  Award,
  Briefcase,
  Target,
  BarChart2,
  Globe,
  Shield,
  Phone,
  Mail,
  MessageSquare,
  GitBranch,
  Link2,
  Users2,
  Code2,
  Bookmark,
  Building2,
  Zap,
  CheckCircle,
} from "lucide-react";

const C = {
  bg: "#f0f6ff",
  bgAlt: "#ffffff",
  text: "#0f1f3d",
  textMuted: "#4b6a9b",
  accent: "#2563eb",
  accentLight: "#dbeafe",
  accentDark: "#1d4ed8",
  navy: "#0f1f3d",
  white: "#ffffff",
  border: "#dde7f5",
  borderLight: "#eef4ff",
};

const SERVICES = [
  {
    icon: Target,
    name: "Executive Search",
    desc: "C-suite and senior leadership placement across all industries. We access passive candidates that traditional recruiters miss.",
    details: [
      "Board-level placements",
      "C-suite recruitment",
      "VP & Director roles",
      "Confidential searches",
      "60-day placement guarantee",
    ],
  },
  {
    icon: Users,
    name: "Recruitment Process Outsourcing",
    desc: "Full-cycle RPO solutions for high-volume hiring. We become your embedded talent acquisition team.",
    details: [
      "End-to-end recruitment",
      "Employer branding",
      "ATS implementation",
      "Workforce planning",
      "Dedicated recruiters",
    ],
  },
  {
    icon: BarChart2,
    name: "HR Consulting",
    desc: "Strategic HR advisory for fast-growing companies. Org design, compensation benchmarking, and people strategy.",
    details: [
      "Org design & restructuring",
      "Compensation benchmarking",
      "Performance frameworks",
      "DEI strategy",
      "HR tech stack advisory",
    ],
  },
];

const SECTORS = [
  "Technology & SaaS",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Private Equity",
  "Manufacturing",
  "Professional Services",
  "Retail & Consumer",
  "Energy & Cleantech",
  "Media & Entertainment",
  "Real Estate",
  "Legal",
  "Non-Profit",
];

const CASE_STUDIES = [
  {
    company: "NovaTech Capital",
    sector: "Fintech",
    challenge: "Needed a CTO and 3 VP-level engineers within 90 days ahead of a Series B close.",
    outcome: "All 4 roles filled in 67 days. Two candidates sourced from passive talent — not on the open market.",
    metric: "67 days",
    metricLabel: "to full placement",
  },
  {
    company: "Meridian Health Group",
    sector: "Healthcare",
    challenge: "Scaling from 80 to 300 employees across 6 new clinic locations. Needed an embedded RPO partner.",
    outcome: "Delivered 220 quality hires over 14 months. Reduced cost-per-hire by 34% vs. previous agency model.",
    metric: "34%",
    metricLabel: "cost-per-hire reduction",
  },
  {
    company: "Veritas Partners",
    sector: "Private Equity",
    challenge: "Post-acquisition HR integration across 3 portfolio companies with conflicting culture and comp structures.",
    outcome: "Unified HR framework deployed in 90 days. Retention improved by 28% in year one post-integration.",
    metric: "28%",
    metricLabel: "retention improvement",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Beckmann",
    role: "CPO, Elevate Commerce",
    avatar: "SB",
    text: "Apex found our VP of Engineering in 5 weeks — a role we'd been trying to fill for 6 months internally. The quality of candidates was exceptional.",
    rating: 5,
  },
  {
    name: "David Osei",
    role: "CEO, Groundwork AI",
    avatar: "DO",
    text: "What separates Apex is their network. They brought us candidates who weren't looking — including our now-COO who came from a competitor.",
    rating: 5,
  },
  {
    name: "Priya Malhotra",
    role: "Head of People, CloudBridge",
    avatar: "PM",
    text: "Their HR consulting work was transformational. We went from reactive people ops to a proper talent strategy in under 3 months.",
    rating: 5,
  },
];

const STATS = [
  { end: 2400, suffix: "+", label: "Placements Made" },
  { end: 340, suffix: "+", label: "Enterprise Clients" },
  { end: 94, suffix: "%", label: "Retention at 12 Months" },
  { end: 18, suffix: " yrs", label: "Industry Experience" },
];

const FAQS = [
  {
    q: "What is your typical time-to-fill for executive roles?",
    a: "For director and VP-level roles, our average is 38 days from kickoff to signed offer. C-suite and board searches typically run 60-90 days depending on confidentiality requirements and market conditions.",
  },
  {
    q: "Do you work on retained or contingency basis?",
    a: "Executive Search is retained. RPO engagements are monthly fee-based. We do not work on contingency for senior roles — it creates incentive misalignment and lower candidate quality.",
  },
  {
    q: "What industries do you specialize in?",
    a: "We maintain deep networks across 12 sectors. Technology, Financial Services, Healthcare, and Private Equity represent our highest placement volume, but we operate across all major industries.",
  },
  {
    q: "What is your placement guarantee?",
    a: "All retained executive searches include a 6-month replacement guarantee at no additional fee. If a placed candidate departs within 6 months for any reason, we restart the search.",
  },
  {
    q: "Can you help with international searches?",
    a: "Yes. We operate globally through a network of affiliate partners in 28 countries. Roles in North America, Europe, and APAC are handled by our in-house team.",
  },
  {
    q: "How do you source passive candidates?",
    a: "Through 18 years of relationship-building, proprietary research methodologies, alumni networks, and our database of 180,000+ executive profiles. We do not rely solely on job boards.",
  },
];

// Animated counter component
function Counter({
  end,
  suffix,
  label,
  delay,
}: {
  end: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontSize: "clamp(40px, 4vw, 56px)",
          fontWeight: 900,
          color: C.white,
          fontFamily: "'Plus Jakarta Sans', system-ui",
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#93c5fd",
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function FAQItem({
  faq,
  delay,
}: {
  faq: { q: string; a: string };
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.accent : C.border}`,
          borderRadius: 12,
          padding: "20px 24px",
          cursor: "pointer",
          marginBottom: 8,
          transition: "border-color 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{ fontWeight: 600, fontSize: 16, color: C.navy }}
          >
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 14,
              fontSize: 15,
              color: C.textMuted,
              lineHeight: 1.75,
            }}
          >
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Candidate match score visual
function MatchScore({ score, label }: { score: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          fontWeight: 600,
          color: C.navy,
        }}
      >
        <span>{label}</span>
        <span style={{ color: C.accent }}>{score}%</span>
      </div>
      <div
        style={{
          height: 6,
          background: C.border,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.accent}, #60a5fa)`,
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}

export default function ApexTalentPage() {
  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.navy,
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            gap: 40,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: C.accent,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={20} color={C.white} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: C.white,
              }}
            >
              Apex Talent
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
          >
            {["Services", "Sectors", "Results", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#93c5fd",
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: C.white,
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              I'm a Candidate
            </a>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              style={{
                background: C.accent,
                color: C.white,
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Hire Talent
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: C.navy,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 72,
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
            padding: "80px 5%",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
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
                  style={{
                    color: "#60a5fa",
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
                  fontSize: "clamp(38px, 5vw, 62px)",
                  fontWeight: 900,
                  color: C.white,
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
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
              </motion.h1>

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
              >
                Apex Talent places C-suite leaders and senior executives for companies that refuse to compromise on talent. Executive search, RPO, and HR consulting.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
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
                    textDecoration: "none",
                  }}
                >
                  Hire Executive Talent <ArrowRight size={18} />
                </a>
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
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
                    textDecoration: "none",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                  }}
                >
                  I'm a Candidate
                </a>
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
                    <div
                      style={{
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      Candidate Match Report
                    </div>
                    <div
                      style={{ color: "#64748b", fontSize: 13 }}
                    >
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
                  <span
                    style={{
                      color: "#93c5fd",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Overall Match Score
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: C.accent,
                    }}
                  >
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

      {/* SERVICES */}
      <section
        id="services"
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
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
                <span
                  style={{
                    color: C.accentDark,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  What We Do
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.navy,
                  marginBottom: 16,
                }}
              >
                Three ways we deliver results
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: C.textMuted,
                  maxWidth: 520,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                From single executive searches to full HR transformation — we work at the intersection of talent strategy and business outcomes.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
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
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow =
                      "0 20px 60px rgba(37,99,235,0.12)";
                    el.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
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
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: C.navy,
                      marginBottom: 12,
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {service.desc}
                  </p>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {service.details.map((d) => (
                      <div
                        key={d}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Check
                          size={14}
                          color={C.accent}
                          style={{ flexShrink: 0 }}
                        />
                        <span
                          style={{ fontSize: 14, color: C.text }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                    style={{
                      marginTop: 28,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: C.accent,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    Learn more <ArrowRight size={14} />
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — Animated counters */}
      <section
        id="results"
        style={{ padding: "100px 5%", background: C.navy }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                18 years of measurable results
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "#93c5fd",
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                Numbers that define our commitment to quality over volume.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 40,
            }}
          >
            {STATS.map((s, i) => (
              <Counter
                key={s.label}
                end={s.end}
                suffix={s.suffix}
                label={s.label}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.navy,
                  marginBottom: 16,
                }}
              >
                Success stories
              </h2>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {CASE_STUDIES.map((cs, i) => (
              <SectionReveal key={cs.company} delay={i * 0.12}>
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
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: C.navy,
                      }}
                    >
                      {cs.company}
                    </h3>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      Challenge
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.text,
                        lineHeight: 1.65,
                      }}
                    >
                      {cs.challenge}
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      Outcome
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.text,
                        lineHeight: 1.65,
                      }}
                    >
                      {cs.outcome}
                    </p>
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
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 900,
                        color: C.accent,
                      }}
                    >
                      {cs.metric}
                    </div>
                    <div
                      style={{ fontSize: 13, color: C.textMuted }}
                    >
                      {cs.metricLabel}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.white,
                  marginBottom: 12,
                }}
              >
                What our clients say
              </h2>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
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
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={C.accent}
                        color={C.accent}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#cbd5e1",
                      lineHeight: 1.75,
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
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
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.white,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#64748b" }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS GRID */}
      <section
        id="sectors"
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 800,
                  color: C.navy,
                  marginBottom: 12,
                }}
              >
                Industries we serve
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                Deep networks in 12 sectors, built over 18 years of specialized placement.
              </p>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {SECTORS.map((sector, i) => (
              <SectionReveal key={sector} delay={i * 0.05}>
                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = C.accentLight;
                    el.style.borderColor = `${C.accent}50`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = C.white;
                    el.style.borderColor = C.border;
                  }}
                >
                  <Globe size={14} color={C.accent} style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.navy,
                    }}
                  >
                    {sector}
                  </span>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 800,
                  color: C.navy,
                  marginBottom: 12,
                }}
              >
                Common questions
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted }}>
                Everything you need to know before starting a search.
              </p>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.navy, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 60,
              marginBottom: 60,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: C.accent,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={20} color={C.white} />
                </div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 20,
                    color: C.white,
                  }}
                >
                  Apex Talent
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.75,
                  maxWidth: 280,
                }}
              >
                Executive search and HR consulting firm. Placing senior leaders at companies that set the standard.
              </p>
              <div
                style={{ display: "flex", gap: 12, marginTop: 20 }}
              >
                {[MessageSquare, Link2, Users2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} color="#64748b" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Services",
                links: [
                  "Executive Search",
                  "RPO Solutions",
                  "HR Consulting",
                  "Board Advisory",
                  "Interim Placement",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Apex",
                  "Our Team",
                  "Case Studies",
                  "Careers",
                  "Press",
                ],
              },
              {
                title: "Contact",
                links: [
                  "info@apextalent.com",
                  "+1 212 555 0190",
                  "300 Park Avenue",
                  "New York NY 10022",
                  "Mon-Fri 8am-7pm ET",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {col.title}
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        fontSize: 14,
                        color: "#64748b",
                        textDecoration: "none",
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "#334155" }}>
              2025 Apex Talent Group. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Accessibility"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: 13,
                    color: "#334155",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
