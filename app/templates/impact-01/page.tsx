"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
  animate,
} from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Monitor,
  Palette,
  Code2,
  Layers,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────── */
const T = {
  bg: "#0a0a0a",
  text: "#f0f0f0",
  muted: "#666666",
  dimmed: "#333333",
  accent: "#0066ff",
  accentDim: "rgba(0,102,255,0.15)",
  accentBorder: "rgba(0,102,255,0.3)",
  border: "rgba(240,240,240,0.06)",
  surface: "rgba(240,240,240,0.03)",
  surfaceHover: "rgba(240,240,240,0.06)",
  overlay: "rgba(10,10,10,0.85)",
};

const FONT_HEADING = "'Syne', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <Monitor size={28} />,
    title: "Web Design",
    desc: "Bespoke interfaces crafted with pixel-perfect precision and strategic UX thinking that converts visitors into customers.",
    tag: "UI/UX",
  },
  {
    icon: <Code2 size={28} />,
    title: "Development",
    desc: "High-performance applications built on modern stacks with seamless integrations and bulletproof reliability.",
    tag: "Engineering",
  },
  {
    icon: <Palette size={28} />,
    title: "Branding",
    desc: "Distinctive visual identities that resonate deeply with your target audience and stand apart from competitors.",
    tag: "Identity",
  },
  {
    icon: <Layers size={28} />,
    title: "Strategy",
    desc: "Data-driven growth strategies that compound over time, converting visitors into loyal brand advocates.",
    tag: "Growth",
  },
  {
    icon: <Monitor size={28} />,
    title: "Motion Design",
    desc: "Cinematic animations and micro-interactions that elevate perception and make every touchpoint memorable.",
    tag: "Animation",
  },
  {
    icon: <Code2 size={28} />,
    title: "Performance",
    desc: "Core Web Vitals optimization, CDN architecture, and infrastructure tuning for sub-second load times globally.",
    tag: "Speed",
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "Aether Labs",
    category: "Web Ecosystem",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Noir Studio",
    category: "Brand Identity",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Prisme Finance",
    category: "Fintech App",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Lumina Health",
    category: "Healthcare Portal",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Onyx Records",
    category: "E-commerce",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Solaris AI",
    category: "SaaS Platform",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1200&auto=format&fit=crop",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    desc: "We immerse ourselves in your business, your users, and your competitive landscape. Deep research drives every decision we make.",
    detail:
      "Stakeholder interviews, user research, competitor analysis, technical audit.",
  },
  {
    number: "02",
    title: "Design",
    desc: "From wireframes to high-fidelity prototypes, we craft interfaces that are both beautiful and functionally precise.",
    detail: "UX architecture, visual design, design systems, interactive prototypes.",
  },
  {
    number: "03",
    title: "Build",
    desc: "Our engineers translate designs into production-grade code. Clean, performant, and built to scale under real-world load.",
    detail: "Next.js, React, Node.js, Prisma, PostgreSQL, Redis, CI/CD pipelines.",
  },
  {
    number: "04",
    title: "Launch",
    desc: "Rigorous QA, performance audits, and a staged rollout ensure a flawless launch that makes the right first impression.",
    detail: "Load testing, Lighthouse audits, staging environments, go-live support.",
  },
];

const STATS_DATA = [
  { target: 147, suffix: "+", label: "Clients Worldwide" },
  { target: 312, suffix: "+", label: "Projects Delivered" },
  { target: 8, suffix: "", label: "Years of Craft" },
  { target: 98, suffix: "%", label: "Client Satisfaction" },
];

/* ─────────────────────────────────────────────────────────────
   GOOGLE FONTS INJECTION
   ───────────────────────────────────────────────────────────── */
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────
   CLIP-PATH HEADING REVEAL (IntersectionObserver)
   ───────────────────────────────────────────────────────────── */
function ClipRevealHeading({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          clipPath: revealed
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
          transition: `clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          transform: revealed ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FADE-UP REVEAL (generic)
   ───────────────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD (case study card)
   ───────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / (rect.width / 2);
      const relY = (e.clientY - centerY) / (rect.height / 2);
      rotateY.set(relX * 10);
      rotateX.set(-relY * 10);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        perspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────────────────────── */
function Counter({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, count]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: "clamp(3rem, 6vw, 5rem)",
          lineHeight: 1,
          color: T.text,
          letterSpacing: "-0.02em",
        }}
      >
        {displayValue}
        <span style={{ color: T.accent }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: T.muted,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV LINK
   ───────────────────────────────────────────────────────────── */
function NavLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: FONT_BODY,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: hovered ? T.text : T.muted,
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "4px 0",
        transition: "color 0.25s ease",
      }}
    >
      {label}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 1,
          width: hovered ? "100%" : 0,
          background: T.accent,
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function ImpactAgencyTemplate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  /* ── Hero parallax ── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 900], [0, 270]); // 0.3x
  const heroTextY = useTransform(scrollY, [0, 900], [0, 0]);  // 1x (natural)
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  /* ── Scroll progress bar ── */
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* ── Process sticky section ── */
  const processContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: processContainerRef,
    offset: ["start start", "end end"],
  });
  const activeStep = useTransform(processProgress, [0, 1], [0, 3.99]);

  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const unsubscribe = activeStep.on("change", (v) => {
      setCurrentStep(Math.min(3, Math.floor(v)));
    });
    return unsubscribe;
  }, [activeStep]);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const NAV_ITEMS = ["About", "Services", "Process", "Stats", "Work", "Contact"];

  /* ─────────────────────────────────── */
  return (
    <div
      ref={pageRef}
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: FONT_BODY,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <FontLoader />

      {/* ── Scroll progress bar ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: progressWidth,
          height: 2,
          background: T.accent,
          zIndex: 200,
          transformOrigin: "left",
        }}
      />

      {/* ══════════════════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          padding: "28px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Frosted backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.7)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.02em",
            color: T.text,
            textDecoration: "none",
          }}
        >
          IMPACT<span style={{ color: T.accent }}>.</span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
          className="nav-desktop"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item}
              label={item}
              onClick={() => scrollTo(item.toLowerCase())}
            />
          ))}
          <button
            onClick={() => scrollTo("contact")}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: T.text,
              background: T.accent,
              border: "none",
              borderRadius: 100,
              padding: "10px 24px",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            Let&apos;s Talk
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: "relative",
            zIndex: 1,
            background: "none",
            border: "none",
            color: T.text,
            cursor: "pointer",
            display: "none",
          }}
          className="nav-mobile-toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(10,10,10,0.96)",
              backdropFilter: "blur(32px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(item.toLowerCase())}
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: T.text,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          HERO — scroll-parallax background + text reveal
          ══════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "110vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Parallax background layer — moves at 0.3x scroll speed */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-20%",
            y: heroBgY,
            zIndex: 0,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"
            alt="Hero background"
            fill
            priority
            style={{ objectFit: "cover", opacity: 0.06 }}
          />
        </motion.div>

        {/* Electric blue radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(0,102,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(240,240,240,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,240,0.4) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            pointerEvents: "none",
          }}
        />

        {/* Foreground text — moves at natural 1x (stays in place) */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            y: heroTextY,
            opacity: heroOpacity,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 20px",
              borderRadius: 100,
              border: `1px solid ${T.accentBorder}`,
              background: T.accentDim,
              marginBottom: 40,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.accent,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: T.accent,
              }}
            >
              Premium Digital Agency
            </span>
          </motion.div>

          {/* Headline — slides up from bottom on load */}
          <div style={{ overflow: "hidden", marginBottom: 12 }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.55,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(3.6rem, 9vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                margin: 0,
                color: T.text,
              }}
            >
              We build the
            </motion.h1>
          </div>

          <div style={{ overflow: "hidden", marginBottom: 32 }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.72,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(3.6rem, 9vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                margin: 0,
                color: T.accent,
              }}
            >
              internet&apos;s best.
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.9 }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              lineHeight: 1.7,
              color: T.muted,
              maxWidth: 600,
              margin: "0 auto 56px",
            }}
          >
            Full-service creative studio crafting immersive digital experiences,
            brand identities, and high-performance products for ambitious brands.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              onClick={() => scrollTo("work")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                background: T.text,
                color: T.bg,
                border: "none",
                borderRadius: 100,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.accent;
                e.currentTarget.style.color = T.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.text;
                e.currentTarget.style.color = T.bg;
              }}
            >
              View Work <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("services")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                background: "transparent",
                color: T.text,
                border: `1px solid ${T.border}`,
                borderRadius: 100,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                cursor: "pointer",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.accent;
                e.currentTarget.style.color = T.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.text;
              }}
            >
              Our Services
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: T.dimmed,
              fontWeight: 600,
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronDown size={16} color={T.dimmed} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT
          ══════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: "140px 48px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <FadeUp>
          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              We don&apos;t just
              <br />
              <span style={{ color: T.accent }}>build websites.</span>
              <br />
              We build empires.
            </h2>
          </ClipRevealHeading>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: T.muted,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Founded in 2018, IMPACT studio is a collective of designers,
              engineers, and strategists obsessed with excellence. We partner
              with ambitious brands — from seed-stage startups to Fortune 500
              companies — delivering work that consistently outperforms.
            </p>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: T.dimmed,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Every pixel is intentional. Every interaction is engineered.
              Every line of code is written to last. We combine aesthetic
              excellence with measurable business impact because beautiful
              work that doesn&apos;t convert is just decoration.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 12,
              }}
            >
              {["Strategic Thinking", "Pixel Perfection", "Clean Code", "Fast Delivery"].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: T.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        color: T.text,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES — 3D tilt cards with scroll stagger
          ══════════════════════════════════════════════════ */}
      <section
        id="services"
        style={{
          padding: "120px 48px",
          background: "rgba(240,240,240,0.015)",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ marginBottom: 72 }}>
            <FadeUp>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: T.accent,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                What we do
              </span>
            </FadeUp>
            <ClipRevealHeading>
              <h2
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  margin: 0,
                  color: T.text,
                }}
              >
                Services built
                <br />
                <span style={{ color: T.dimmed }}>for impact.</span>
              </h2>
            </ClipRevealHeading>
          </div>

          {/* 3D cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {SERVICES.map((service, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <TiltCard>
                  <ServiceCard service={service} />
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROCESS — sticky scroll sequence
          ══════════════════════════════════════════════════ */}
      <section
        id="process"
        style={{
          padding: "120px 0 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px",
            marginBottom: 72,
          }}
        >
          <FadeUp>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: T.accent,
                display: "block",
                marginBottom: 20,
              }}
            >
              How we work
            </span>
          </FadeUp>
          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
                color: T.text,
              }}
            >
              Our process,
              <br />
              <span style={{ color: T.dimmed }}>step by step.</span>
            </h2>
          </ClipRevealHeading>
        </div>

        {/* Sticky scroll container — 400vh so user scrolls through 4 steps */}
        <div
          ref={processContainerRef}
          style={{ position: "relative", height: "400vh" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                width: "100%",
                padding: "0 48px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 80,
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              {/* Step indicators */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStepIndicator
                    key={i}
                    step={step}
                    index={i}
                    active={currentStep === i}
                    past={currentStep > i}
                  />
                ))}
              </div>

              {/* Step detail — animated panel */}
              <div style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      padding: 48,
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 24,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Blue accent corner */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        background: T.accent,
                        borderRadius: "24px 0 0 24px",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: "5rem",
                        color: T.accentDim,
                        lineHeight: 1,
                        marginBottom: 16,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {PROCESS_STEPS[currentStep].number}
                    </div>
                    <h3
                      style={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: "2rem",
                        letterSpacing: "-0.02em",
                        margin: "0 0 20px",
                        color: T.text,
                      }}
                    >
                      {PROCESS_STEPS[currentStep].title}
                    </h3>
                    <p
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "1.05rem",
                        lineHeight: 1.72,
                        color: T.muted,
                        margin: "0 0 24px",
                        fontWeight: 300,
                      }}
                    >
                      {PROCESS_STEPS[currentStep].desc}
                    </p>
                    <div
                      style={{
                        padding: "14px 18px",
                        background: T.accentDim,
                        border: `1px solid ${T.accentBorder}`,
                        borderRadius: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: "0.78rem",
                          color: T.accent,
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {PROCESS_STEPS[currentStep].detail}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — animated counters
          ══════════════════════════════════════════════════ */}
      <section
        id="stats"
        style={{
          padding: "140px 48px",
          borderTop: `1px solid ${T.border}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
            textAlign: "center",
          }}
        >
          {STATS_DATA.map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <Counter
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
              />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WORK GRID — 3D tilt image cards
          ══════════════════════════════════════════════════ */}
      <section
        id="work"
        style={{
          padding: "120px 48px",
          borderTop: `1px solid ${T.border}`,
          background: "rgba(240,240,240,0.015)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
              gap: 24,
            }}
          >
            <div>
              <FadeUp>
                <span
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    color: T.accent,
                    display: "block",
                    marginBottom: 20,
                  }}
                >
                  Selected work
                </span>
              </FadeUp>
              <ClipRevealHeading>
                <h2
                  style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.95,
                    margin: 0,
                    color: T.text,
                  }}
                >
                  Recent
                  <br />
                  <span style={{ color: T.dimmed }}>projects.</span>
                </h2>
              </ClipRevealHeading>
            </div>
            <FadeUp>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: T.accent,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                All Projects <ArrowRight size={14} />
              </button>
            </FadeUp>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {PROJECTS.map((project, i) => (
              <FadeUp key={project.id} delay={i * 0.07}>
                <TiltCard>
                  <WorkCard project={project} />
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          padding: "140px 48px",
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: T.accent,
                display: "block",
                marginBottom: 28,
              }}
            >
              Get in touch
            </span>
          </FadeUp>

          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                margin: "0 0 32px",
                color: T.text,
              }}
            >
              Ready to build
              <br />
              something great?
            </h2>
          </ClipRevealHeading>

          <FadeUp delay={0.15}>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: T.muted,
                fontWeight: 300,
                maxWidth: 560,
                margin: "0 auto 56px",
              }}
            >
              We work with a select number of clients each quarter. If you have
              a project in mind, let&apos;s talk before spots fill.
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 80,
              }}
            >
              <a
                href="mailto:hello@impact.studio"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  background: T.accent,
                  color: T.text,
                  border: "none",
                  borderRadius: 100,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Mail size={16} /> hello@impact.studio
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  background: "transparent",
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  borderRadius: 100,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = T.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = T.border)
                }
              >
                Schedule a Call
              </a>
            </div>
          </FadeUp>

          {/* Contact info row */}
          <FadeUp delay={0.3}>
            <div
              style={{
                display: "flex",
                gap: 48,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: <Mail size={14} />, value: "hello@impact.studio" },
                { icon: <Phone size={14} />, value: "+33 1 42 86 00 00" },
                { icon: <MapPin size={14} />, value: "Paris, France" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: T.dimmed,
                    fontFamily: FONT_BODY,
                    fontSize: "0.82rem",
                    fontWeight: 400,
                  }}
                >
                  {item.icon}
                  {item.value}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: "48px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            color: T.text,
          }}
        >
          IMPACT<span style={{ color: T.accent }}>.</span>
        </span>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.75rem",
            color: T.dimmed,
            fontWeight: 400,
          }}
        >
          &copy; 2026 IMPACT Studio. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Cookies"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.75rem",
                color: T.dimmed,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.dimmed)}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>

      {/* ── Responsive overrides via style tag ── */}
      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (max-width: 768px) {
          section[id="about"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          section[id="stats"] > div {
            grid-template-columns: 1fr 1fr !important;
          }
          section[id="services"] > div > div:last-child,
          section[id="work"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          section[id="process"] > div:last-child > div > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SERVICE CARD (extracted — used inside TiltCard)
   ───────────────────────────────────────────────────────────── */
function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[0];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "40px 36px",
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.accentBorder : T.border}`,
        borderRadius: 20,
        cursor: "pointer",
        transition:
          "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        boxShadow: hovered
          ? "0 32px 80px rgba(0,102,255,0.08)"
          : "none",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient shimmer on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${T.accent}, transparent)`
            : "transparent",
          transition: "background 0.4s ease",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: hovered ? T.accent : T.accentDim,
            border: `1px solid ${hovered ? T.accent : T.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.text,
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          {service.icon}
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.62rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: T.dimmed,
            border: `1px solid ${T.border}`,
            borderRadius: 100,
            padding: "4px 12px",
          }}
        >
          {service.tag}
        </span>
      </div>
      <h3
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-0.02em",
          margin: "0 0 14px",
          color: hovered ? T.accent : T.text,
          transition: "color 0.3s ease",
        }}
      >
        {service.title}
      </h3>
      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: T.muted,
          margin: "0 0 24px",
          fontWeight: 300,
        }}
      >
        {service.desc}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_BODY,
          fontSize: "0.78rem",
          fontWeight: 600,
          color: T.accent,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        Learn more <ArrowUpRight size={14} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WORK CARD (extracted — used inside TiltCard)
   ───────────────────────────────────────────────────────────── */
function WorkCard({ project }: { project: (typeof PROJECTS)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", borderRadius: 20, overflow: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: T.dimmed,
          overflow: "hidden",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          style={{
            objectFit: "cover",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.68rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: T.accent,
              background: T.accentDim,
              border: `1px solid ${T.accentBorder}`,
              padding: "6px 14px",
              borderRadius: 100,
            }}
          >
            {project.category}
          </span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={16} color={T.bg} />
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "20px 4px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.02em",
              margin: "0 0 4px",
              color: hovered ? T.accent : T.text,
              transition: "color 0.3s ease",
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.78rem",
              color: T.muted,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {project.category}
          </p>
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.75rem",
            color: T.dimmed,
            fontWeight: 400,
          }}
        >
          {project.year}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROCESS STEP INDICATOR
   ───────────────────────────────────────────────────────────── */
function ProcessStepIndicator({
  step,
  index,
  active,
  past,
}: {
  step: (typeof PROCESS_STEPS)[0];
  index: number;
  active: boolean;
  past: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "24px 0",
        borderBottom: `1px solid ${T.border}`,
        transition: "opacity 0.4s ease",
        opacity: past ? 0.35 : 1,
      }}
    >
      {/* Step number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: active ? T.accent : past ? T.dimmed : "transparent",
            border: `2px solid ${active ? T.accent : past ? T.dimmed : T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.4s ease, border-color 0.4s ease",
            flexShrink: 0,
          }}
        >
          {past ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.5 7L6 10.5L11.5 3.5"
                stroke={T.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "0.7rem",
                color: active ? T.text : T.muted,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "-0.02em",
            color: active ? T.text : T.muted,
            transition: "color 0.4s ease",
          }}
        >
          {step.title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.8rem",
            color: T.dimmed,
            marginTop: 2,
            maxWidth: 340,
            fontWeight: 300,
            lineHeight: 1.5,
            display: active ? "block" : "none",
          }}
        >
          {step.desc}
        </div>
      </div>

      {active && (
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight size={20} color={T.accent} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
