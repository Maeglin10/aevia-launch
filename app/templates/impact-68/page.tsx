"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Zap,
  Eye,
  Layers,
  PenTool,
  Globe,
  MessageSquare,
  Link2,
  Camera,
  Users2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

const C = {
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

// ─── Data ──────────────────────────────────────────────────────────────────

const PROJECTS = [
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

const SERVICES = [
  {
    icon: PenTool,
    title: "Brand Identity",
    desc: "Wordmarks, symbol systems, color architecture, and type hierarchies that telegraph exactly who you are before a single word is read.",
    deliverables: ["Logo & Symbol", "Typography", "Color System", "Usage Guidelines"],
    price: "From €8,400",
  },
  {
    icon: Eye,
    title: "Art Direction",
    desc: "Campaign concepts, visual worlds, and creative direction for shoots, launches, and brand campaigns that live long after the brief.",
    deliverables: ["Creative Concept", "Shoot Direction", "Post-Production", "Asset Library"],
    price: "From €12,000",
  },
  {
    icon: Layers,
    title: "Brand Strategy",
    desc: "Positioning, naming, narrative, and competitive architecture. We find the single idea your brand should own — then build everything from it.",
    deliverables: ["Market Analysis", "Positioning", "Naming", "Brand Story"],
    price: "From €6,800",
  },
  {
    icon: Globe,
    title: "Digital Expression",
    desc: "Motion identity, web design systems, social template libraries, and digital touchpoints engineered for the screens your audience lives on.",
    deliverables: ["Motion Identity", "Web Design", "Social Templates", "Digital Guidelines"],
    price: "From €9,200",
  },
];

const PROCESS_STEPS = [
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

const TESTIMONIALS = [
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

const STATS = [
  { value: "94", suffix: "", prefix: "", label: "Brand Projects Delivered", sub: "Across 12 countries" },
  { value: "340", suffix: "%", prefix: "+", label: "Average Recognition Lift", sub: "Measured 6 months post-launch" },
  { value: "18", suffix: "M", prefix: "€", label: "Client Capital Raised", sub: "Post-rebrand, last 24 months" },
  { value: "3.2", suffix: "x", prefix: "", label: "Revenue Multiple", sub: "Average client growth YoY" },
];

const TEAM = [
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

const FAQS = [
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

// ─── Rotating SVG Orbit Component (Signature Element) ───────────────────────

function OrbitText({ radius = 140, text = "ORBIT STUDIO · BRAND IDENTITY · PARIS · " }) {
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

function OrbitCenter() {
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

// ─── Counter component ───────────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
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

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
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
      style={{
        position: "relative",
        background: hovered ? C.bgCard : "transparent",
        border: `1px solid ${hovered ? C.borderLight : C.border}`,
        borderRadius: "4px",
        padding: "36px",
        cursor: "pointer",
        transition: "background 0.3s, border-color 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Accent stripe */}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Impact68Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const orbitScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.08]);

  const filters = ["All", "Identity", "Luxury", "Tech", "Campaign"];

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) =>
          p.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()))
        );

  return (
    <div
      ref={containerRef}
      style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.accent}; color: ${C.white}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(17, 17, 17, 0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `2px solid ${C.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: C.accent,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            Orbit<span style={{ color: C.accent }}>.</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: "36px",
            alignItems: "center",
          }}
        >
          {["Work", "Services", "Studio", "Process"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                color: C.textMuted,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              {item}
            </a>
          ))}
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.white,
              background: C.accent,
              padding: "10px 22px",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.accentDark;
              (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.accent;
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Start a Project
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.text,
            padding: "4px",
          }}
        >
          <div style={{ width: "22px", height: "2px", background: C.text, marginBottom: "5px" }} />
          <div style={{ width: "22px", height: "2px", background: C.text, marginBottom: "5px" }} />
          <div style={{ width: "14px", height: "2px", background: C.accent }} />
        </button>
      </motion.nav>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 40px 80px",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${C.border} 1px, transparent 1px),
              linear-gradient(90deg, ${C.border} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        {/* Noise overlay */}
        <svg style={{ position: "absolute", inset: 0, opacity: 0 }}>
          <filter id="noise68">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise68)" opacity="0.04" />
        </svg>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          transition={{ type: "spring" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "80px",
              alignItems: "center",
              maxWidth: "1300px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* Left — headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: C.accent,
                  textTransform: "uppercase",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    background: C.accent,
                  }}
                />
                Branding Studio · Paris
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(52px, 7vw, 96px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: C.text,
                  marginBottom: "32px",
                }}
              >
                Brands that
                <br />
                <span style={{ color: C.accent }}>shift</span>
                <br />
                perception.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(15px, 1.4vw, 18px)",
                  lineHeight: 1.7,
                  color: C.textMuted,
                  maxWidth: "480px",
                  marginBottom: "48px",
                }}
              >
                We build identity systems for ambitious companies — from seed-stage startups to century-old maisons. Strategy, visual identity, and art direction that makes the right people stop scrolling.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
              >
                <button onClick={() => document.getElementById("work")?.scrollIntoView({behavior:"smooth"})}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: C.white,
                    background: C.accent,
                    padding: "16px 32px",
                    textDecoration: "none",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "transform 0.15s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
                    (e.currentTarget as HTMLElement).style.background = C.accentDark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.background = C.accent;
                  }}
                >
                  View Our Work
                  <ArrowRight size={16} />
                </a>
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: C.textMuted,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  Get in touch
                  <ArrowRight size={14} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                style={{
                  marginTop: "64px",
                  paddingTop: "32px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  gap: "40px",
                }}
              >
                {["94 projects", "12 countries", "Est. 2015"].map((tag) => (
                  <div
                    key={tag}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: C.textMuted,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Orbit signature element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0, 0, 1] }}
              style={{ scale: orbitScale }}
            >
              <OrbitCenter />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} style={{ color: C.textMuted }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
          }}
        >
          {STATS.map((stat, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  padding: "40px",
                  borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(36px, 4vw, 54px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: C.text,
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {stat.prefix}
                  <AnimatedCounter value={parseFloat(stat.value)} />
                  {stat.suffix}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "4px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "12px",
                    color: C.textMuted,
                  }}
                >
                  {stat.sub}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── WORK ────────────────────────────────────────────────────────── */}
      <section id="work" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "60px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: C.accent,
                textTransform: "uppercase",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
              Selected Work
            </motion.div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: C.text,
                  lineHeight: 1.05,
                }}
              >
                94 projects.
                <br />
                <span style={{ color: C.textMuted }}>6 shown here.</span>
              </motion.h2>

              {/* Filters */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      padding: "8px 16px",
                      borderRadius: "2px",
                      border: `1px solid ${activeFilter === f ? C.accent : C.border}`,
                      background: activeFilter === f ? C.accent : "transparent",
                      color: activeFilter === f ? C.white : C.textMuted,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2px",
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────── */}
      <section
        id="services"
        style={{
          padding: "120px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            What We Do
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "64px",
              lineHeight: 1.05,
            }}
          >
            Four disciplines.
            <br />
            <span style={{ color: C.textMuted }}>One obsession.</span>
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px" }}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const isActive = activeService === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setActiveService(isActive ? null : i)}
                  style={{
                    padding: "48px",
                    background: isActive ? C.bgCard : "transparent",
                    border: `1px solid ${isActive ? C.accent : C.border}`,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "4px",
                        background: isActive ? C.accent : C.border,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.3s",
                      }}
                    >
                      <Icon size={22} style={{ color: isActive ? C.white : C.textMuted }} />
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isActive ? C.accent : C.textMuted,
                        letterSpacing: "0.05em",
                        transition: "color 0.3s",
                      }}
                    >
                      {svc.price}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: C.text,
                      marginBottom: "16px",
                    }}
                  >
                    {svc.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: C.textMuted,
                      marginBottom: "24px",
                    }}
                  >
                    {svc.desc}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ paddingTop: "16px", borderTop: `1px solid ${C.border}` }}>
                          {svc.deliverables.map((d) => (
                            <div
                              key={d}
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "13px",
                                color: C.textMuted,
                                padding: "8px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <Check size={14} style={{ color: C.accent, flexShrink: 0 }} />
                              {d}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─────────────────────────────────────────────────────── */}
      <section id="process" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            How We Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "80px",
              lineHeight: 1.05,
            }}
          >
            A process built for
            <br />
            <span style={{ color: C.accent }}>honest work.</span>
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderTop: `1px solid ${C.border}` }}>
            {PROCESS_STEPS.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{
                    padding: "48px",
                    borderBottom: `1px solid ${C.border}`,
                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: C.textMuted,
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: C.accent, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                      {step.num}
                    </span>
                    <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: C.textMuted }}>
                      {step.duration}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: C.text,
                      marginBottom: "16px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: C.textMuted,
                    }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            Client Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "64px",
              lineHeight: 1.05,
            }}
          >
            Words from
            <br />
            <span style={{ color: C.textMuted }}>the people we built for.</span>
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px" }}>
            {TESTIMONIALS.map((t, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    padding: "48px",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} size={14} fill={C.accent} style={{ color: C.accent }} />
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.8,
                      color: C.text,
                      marginBottom: "32px",
                      fontStyle: "italic",
                    }}
                  >
                    "{t.text}"
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: C.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: C.white,
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: C.text,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "12px",
                          color: C.textMuted,
                        }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STUDIO / TEAM ───────────────────────────────────────────────── */}
      <section id="studio" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            The Studio
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "24px",
              lineHeight: 1.05,
            }}
          >
            Four people.
            <br />
            <span style={{ color: C.textMuted }}>Senior on every project.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
              lineHeight: 1.7,
              color: C.textMuted,
              maxWidth: "560px",
              marginBottom: "72px",
            }}
          >
            Orbit is intentionally small. We take 4 projects per quarter — never more. Every client gets every senior person in the room. That's the model and we won't change it.
          </motion.p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {TEAM.map((member, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    padding: "36px",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: `${C.accent}22`,
                      border: `1px solid ${C.accent}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: C.accent,
                      marginBottom: "20px",
                    }}
                  >
                    {member.initials}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    {member.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      color: C.accent,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      marginBottom: "16px",
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: C.textMuted,
                    }}
                  >
                    {member.bio}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            Common Questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              marginBottom: "60px",
              lineHeight: 1.05,
            }}
          >
            Before you reach out.
          </motion.h2>

          <div>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "24px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "16px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: activeFaq === i ? C.accent : C.text,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `1px solid ${activeFaq === i ? C.accent : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: activeFaq === i ? C.accent : C.textMuted,
                      flexShrink: 0,
                      transition: "border-color 0.2s, color 0.2s",
                      fontSize: "18px",
                      fontWeight: 300,
                    }}
                  >
                    +
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "15px",
                          lineHeight: 1.8,
                          color: C.textMuted,
                          paddingBottom: "24px",
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / CONTACT ───────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          padding: "160px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
            Start a Project
            <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: C.text,
              marginBottom: "32px",
            }}
          >
            Ready to build
            <br />
            <span style={{ color: C.accent }}>something real?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: C.textMuted,
              marginBottom: "48px",
            }}
          >
            We're selective about new projects. Tell us what you're building and we'll respond within 48 hours with an honest assessment of how we can help — or who else might.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="mailto:hello@orbitstudio.fr"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: C.white,
                background: C.accent,
                padding: "18px 40px",
                textDecoration: "none",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.15s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
                (e.currentTarget as HTMLElement).style.background = C.accentDark;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.background = C.accent;
              }}
            >
              <Mail size={16} />
              hello@orbitstudio.fr
            </a>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                color: C.textMuted,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={14} />
              Responding within 48h
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "60px 40px",
          background: C.bgAlt,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: "60px",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: `2px solid ${C.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.accent }} />
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: C.text,
                }}
              >
                Orbit<span style={{ color: C.accent }}>.</span>
              </span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.7, maxWidth: "240px" }}>
              Brand identity studio. Paris, France. Est. 2015. Senior-led, intentionally small.
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
              {[MessageSquare, Camera, Link2].map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "4px",
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                    color: C.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.accent;
                    (e.currentTarget as HTMLElement).style.color = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLElement).style.color = C.textMuted;
                  }}
                >
                  <Icon size={15} />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Services",
              links: ["Brand Identity", "Art Direction", "Brand Strategy", "Digital Expression"],
            },
            {
              title: "Studio",
              links: ["About Orbit", "Our Process", "Case Studies", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: C.textMuted,
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {col.title}
              </div>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: C.textMuted,
                    textDecoration: "none",
                    marginBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "48px auto 0",
            paddingTop: "24px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: C.textMuted }}>
            © 2024 Orbit Studio. All rights reserved.
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: C.textMuted }}>
            Paris · hello@orbitstudio.fr · +33 1 42 86 55 22
          </p>
        </div>
      </footer>
    </div>
  );
}
