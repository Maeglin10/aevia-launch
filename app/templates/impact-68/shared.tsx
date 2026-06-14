"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

export const C = {
  bg: "#111111",
  bgAlt: "#181818",
  bgCard: "#1a1a1a",
  text: "#f0ece4",
  textMuted: "#8a8680",
  accent: "#FF5C1A",
  accentDark: "#cc4410",
  accentLight: "#ff7a42",
  border: "#2a2a2a",
  borderLight: "#333333",
  white: "#ffffff",
  charcoal: "#232323",
  orange: "#FF5C1A",
  orangeGlow: "rgba(255, 92, 26, 0.15)",
};

export const PROJECTS = [
  {
    id: 1,
    client: "Meridian Spirits",
    category: "Brand Identity",
    year: "2024",
    deliverables: ["Logo System", "Packaging", "Brand Guide"],
    desc: "Complete identity overhaul for a luxury spirits house entering European markets. Dark, confident, built to age.",
    color: "#c9a14a",
    tags: ["Luxury", "Packaging", "Identity"],
    result: "+340% shelf recognition",
  },
  {
    id: 2,
    client: "Folia Architecture",
    category: "Visual Identity",
    year: "2024",
    deliverables: ["Wordmark", "Collateral", "Digital Suite"],
    desc: "Minimal system for a Paris-based architecture firm. Geometry as language — every element earns its place.",
    color: "#6bcfb2",
    tags: ["Architecture", "Minimal", "Print"],
    result: "7 international awards",
  },
  {
    id: 3,
    client: "Ovoid Cosmetics",
    category: "Art Direction",
    year: "2023",
    deliverables: ["Campaign", "Motion", "Retail"],
    desc: "Art direction for the launch of Ovoid's clean beauty line. Sensory, scientific, unmistakably feminine.",
    color: "#e8b4c8",
    tags: ["Beauty", "Campaign", "Motion"],
    result: "€2.1M launch revenue",
  },
  {
    id: 4,
    client: "Celsius Energy",
    category: "Brand Strategy",
    year: "2023",
    deliverables: ["Strategy", "Identity", "B2B Deck"],
    desc: "Strategic rebrand for a cleantech startup pre-Series B. Built trust, signaled ambition, closed the round.",
    color: "#4ab4f5",
    tags: ["Tech", "B2B", "Strategy"],
    result: "Series B: €18M closed",
  },
  {
    id: 5,
    client: "Maison Vernier",
    category: "Brand Identity",
    year: "2023",
    deliverables: ["Heritage Mark", "Print", "Retail"],
    desc: "Repositioning a 3rd-generation French maison as a modern luxury atelier without losing its heritage roots.",
    color: "#c4a882",
    tags: ["Heritage", "Luxury", "French"],
    result: "Featured in Wallpaper*",
  },
  {
    id: 6,
    client: "Hyper Protocol",
    category: "Digital Identity",
    year: "2022",
    deliverables: ["Brand System", "Web", "Motion"],
    desc: "Full digital identity for a Web3 infrastructure protocol. Technical precision meets cultural fluency.",
    color: "#9d7cf5",
    tags: ["Web3", "Digital", "Motion"],
    result: "$40M raise, 80K users",
  },
];

export const SERVICES = [
  {
    title: "Brand Identity",
    desc: "Wordmarks, symbol systems, color architecture, and type hierarchies that telegraph exactly who you are before a single word is read.",
    deliverables: ["Logo & Symbol", "Typography", "Color System", "Usage Guidelines"],
    price: "From €8,400",
  },
  {
    title: "Art Direction",
    desc: "Campaign concepts, visual worlds, and creative direction for shoots, launches, and brand campaigns that live long after the brief.",
    deliverables: ["Creative Concept", "Shoot Direction", "Post-Production", "Asset Library"],
    price: "From €12,000",
  },
  {
    title: "Brand Strategy",
    desc: "Positioning, naming, narrative, and competitive architecture. We find the single idea your brand should own — then build everything from it.",
    deliverables: ["Market Analysis", "Positioning", "Naming", "Brand Story"],
    price: "From €6,800",
  },
  {
    title: "Digital Expression",
    desc: "Motion identity, web design systems, social template libraries, and digital touchpoints engineered for the screens your audience lives on.",
    deliverables: ["Motion Identity", "Web Design", "Social Templates", "Digital Guidelines"],
    price: "From €9,200",
  },
];

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "We spend the first week inside your world — stakeholder interviews, competitive landscape, audience archetypes, business objectives. We listen more than we speak.",
    duration: "1 week",
  },
  {
    num: "02",
    title: "Strategic Foundation",
    desc: "Positioning territory, naming (if needed), brand pillars, and the core narrative. Everything downstream traces back to this document.",
    duration: "1–2 weeks",
  },
  {
    num: "03",
    title: "Visual Development",
    desc: "Three creative directions, each fully resolved. No half-baked moodboards — real systems you can evaluate in context.",
    duration: "2–3 weeks",
  },
  {
    num: "04",
    title: "Refinement",
    desc: "One chosen direction, refined through two rounds of structured feedback. Precision over iteration — we move forward, not in circles.",
    duration: "1–2 weeks",
  },
  {
    num: "05",
    title: "Delivery",
    desc: "Comprehensive brand guidelines, all master files, asset libraries, and a handover session. Everything you need to carry the brand forward.",
    duration: "3–5 days",
  },
];

export const TESTIMONIALS = [
  {
    name: "Camille Fontaine",
    role: "CEO, Meridian Spirits",
    initials: "CF",
    text: "Orbit didn't just design a logo — they built us a world. Every touchpoint now feels intentional. Distributors stop us at every trade show to ask who did it.",
    rating: 5,
    company: "Meridian Spirits",
  },
  {
    name: "Thomas Reinholt",
    role: "Founder, Celsius Energy",
    initials: "TR",
    text: "The rebrand was the catalyst for our Series B. Investors told us directly — the identity signaled we were serious. That's the ROI of great brand work.",
    rating: 5,
    company: "Celsius Energy",
  },
  {
    name: "Marie-Sophie Leclercq",
    role: "Creative Director, Folia Architecture",
    initials: "ML",
    text: "Working with a branding studio on our own identity was daunting. Orbit earned our trust by challenging our assumptions — the result is sharper than anything we imagined.",
    rating: 5,
    company: "Folia Architecture",
  },
  {
    name: "Jin Park",
    role: "CMO, Ovoid Cosmetics",
    initials: "JP",
    text: "The campaign art direction was exactly what the launch needed. Sensory without being gratuitous, premium without being cold. Our sell-through in month one broke projections by 40%.",
    rating: 5,
    company: "Ovoid Cosmetics",
  },
];

export const STATS = [
  { value: 94, suffix: "", prefix: "", label: "Brand Projects Delivered", sub: "Across 12 countries" },
  { value: 340, suffix: "%", prefix: "+", label: "Average Recognition Lift", sub: "Measured 6 months post-launch" },
  { value: 18, suffix: "M", prefix: "€", label: "Client Capital Raised", sub: "Post-rebrand, last 24 months" },
  { value: 3.2, suffix: "x", prefix: "", label: "Revenue Multiple", sub: "Average client growth YoY" },
];

export const TEAM = [
  {
    name: "Léa Marchetti",
    role: "Founder & Creative Director",
    bio: "15 years building brands across Paris, Berlin, and New York. Former CD at Bureau de Style. Led identity programs for 3 Fortune 500s before founding Orbit.",
    initials: "LM",
  },
  {
    name: "Hugo Ravier",
    role: "Head of Strategy",
    bio: "Brand strategist with a background in semiotics and behavioral economics. Previously at Wolff Olins London. Believes every great identity starts with an uncomfortable truth.",
    initials: "HR",
  },
  {
    name: "Sana Yoshida",
    role: "Senior Art Director",
    bio: "Typography obsessive, systems thinker, former Pentagram. Sana turns strategic clarity into visual precision — nothing is arbitrary, everything resonates.",
    initials: "SY",
  },
  {
    name: "Marcus Webb",
    role: "Motion & Digital Lead",
    bio: "Bridges static brand into living systems — motion identity, interactive web, digital touchpoints. Worked with Nike Digital and Spotify Creative Labs.",
    initials: "MW",
  },
];

export const FAQS = [
  {
    q: "How long does a full brand identity project take?",
    a: "A complete brand identity — from discovery through delivery — typically takes 6 to 10 weeks. This includes strategic foundation, three creative directions, two refinement rounds, and full asset delivery. Timeline accelerates with responsive client feedback.",
  },
  {
    q: "Do you work with early-stage startups or only established companies?",
    a: "Both. We've built brands for pre-launch startups (some before they had a product) and for 50-year-old companies that needed to modernize without losing their heritage. Budget matters more than stage — brand work below €6,000 is difficult to do properly.",
  },
  {
    q: "What makes Orbit different from a freelancer or a large agency?",
    a: "Freelancers give you execution without strategy. Large agencies bill you for overhead and junior teams. Orbit is senior-led on every project — the four people in our studio are the four people on your account. No handoffs, no account managers, direct creative access.",
  },
  {
    q: "Do you offer retainer arrangements after project delivery?",
    a: "Yes. About 60% of our clients move to a monthly creative retainer post-delivery for ongoing art direction, campaign assets, and brand governance. Rates start at €2,200/month with a minimum 3-month commitment.",
  },
  {
    q: "Can we own all files and assets after delivery?",
    a: "Absolutely. Full IP transfer is standard on all projects. You receive source files in all formats (AI, EPS, SVG, PDF, PNG) with no usage restrictions. The brand is yours.",
  },
  {
    q: "How do you handle confidential work during the NDA period?",
    a: "We sign NDAs as standard at project kickoff. Work-in-progress is shared via encrypted client portal. No work appears in our portfolio until you've publicly launched, or agreed to early showcase.",
  },
];

export function OrbitText({ radius = 140, text = "ORBIT STUDIO · BRAND IDENTITY · PARIS · " }) {
  const chars = text.split("");
  const angleStep = 360 / chars.length;

  return (
    <motion.svg
      viewBox="-180 -180 360 360"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
    >
      {chars.map((char, i) => {
        const angle = (i * angleStep * Math.PI) / 180;
        const x = radius * Math.sin(angle);
        const y = -radius * Math.cos(angle);
        const rotation = i * angleStep;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${rotation}, ${x}, ${y})`}
            style={{
              fontSize: "11px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fill: C.accent,
              opacity: 0.9,
            }}
          >
            {char}
          </text>
        );
      })}
      <circle
        cx="0"
        cy="0"
        r="4"
        fill={C.accent}
        opacity={0.6}
      />
    </motion.svg>
  );
}

export function OrbitCenter() {
  return (
    <div
      style={{
        position: "relative",
        width: "340px",
        height: "340px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <OrbitText />
      {/* Inner static ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1px solid ${C.border}`,
          pointerEvents: "none",
        }}
      />
      {/* Core logo */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: C.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `2px solid ${C.white}`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: C.white,
              }}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: C.textMuted,
            textTransform: "uppercase",
          }}
        >
          ORBIT
        </div>
      </div>
    </div>
  );
}

export function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export function ProjectCard({ project, index, onClick }: { project: typeof PROJECTS[0]; index: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0, 0, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: "relative",
        background: hovered ? C.bgCard : "transparent",
        border: `1px solid ${hovered ? C.borderLight : C.border}`,
        borderRadius: "4px",
        padding: "36px",
        cursor: "pointer",
        transition: "background 0.3s, border-color 0.3s",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: project.color,
          transformOrigin: "top",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: C.textMuted,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {project.category} · {project.year}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(20px, 2vw, 26px)",
              fontWeight: 700,
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            {project.client}
          </div>
        </div>
        <motion.div
          animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `1px solid ${hovered ? C.accent : C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? C.accent : C.textMuted,
            transition: "border-color 0.3s, color 0.3s",
          }}
        >
          <ArrowRight size={16} />
        </motion.div>
      </div>

      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "14px",
          lineHeight: 1.7,
          color: C.textMuted,
          marginBottom: "28px",
        }}
      >
        {project.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
        {project.deliverables.map((d) => (
          <span
            key={d}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: project.color,
              background: `${project.color}18`,
              padding: "4px 10px",
              borderRadius: "2px",
              border: `1px solid ${project.color}30`,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: C.textMuted,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <TrendingUp size={14} style={{ color: C.accent }} />
        {project.result}
      </div>
    </motion.div>
  );
}
