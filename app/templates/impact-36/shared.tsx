"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Target,
  Users,
  BarChart2,
  ChevronDown,
  Globe,
  Award,
  CheckCircle,
} from "lucide-react"

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
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
}

export const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

// ─── Datasets ─────────────────────────────────────────────────────────────────
export const SERVICES = [
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
    href: "/templates/impact-36/services#executive",
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
    href: "/templates/impact-36/services#rpo",
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
    href: "/templates/impact-36/services#consulting",
  },
]

export const SECTORS = [
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
]

export const CASE_STUDIES = [
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
]

export const TESTIMONIALS = [
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
]

export const STATS = [
  { end: 2400, suffix: "+", label: "Placements Made" },
  { end: 340, suffix: "+", label: "Enterprise Clients" },
  { end: 94, suffix: "%", label: "Retention at 12 Months" },
  { end: 18, suffix: " yrs", label: "Industry Experience" },
]

export const FAQS = [
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
]

// ─── Visual & Helper Components ────────────────────────────────────────────────
export function Counter({
  end,
  suffix,
  label,
  delay,
}: {
  end: number
  suffix: string
  label: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

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
          fontFamily: FONT,
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
  )
}

export function FAQItem({
  faq,
  delay,
}: {
  faq: { q: string; a: string }
  delay: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

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
          <span style={{ fontWeight: 600, fontSize: 16, color: C.navy }}>{faq.q}</span>
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
  )
}

export function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export function MatchScore({ score, label }: { score: number; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
  )
}
