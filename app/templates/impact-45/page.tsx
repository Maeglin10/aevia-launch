"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, Calendar, Scissors, Award, MessageSquare
} from "lucide-react";

const C = {
  bg: "#0a0a0a",
  bgAlt: "#111111",
  bgCard: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  textDim: "#606060",
  accent: "#991b1b",
  accentHover: "#b91c1c",
  accentLight: "rgba(153,27,27,0.15)",
  gray: "#404040",
  grayLight: "#2a2a2a",
  border: "rgba(255,255,255,0.08)",
  borderAccent: "rgba(153,27,27,0.4)",
  white: "#ffffff",
};

const navLinks = [
  { label: "Artists", href: "#artists" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Styles", href: "#styles" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Booking", href: "#booking" },
  { label: "FAQ", href: "#faq" },
];

const artists = [
  {
    name: "Mara Voss",
    role: "Fine Line Specialist",
    experience: "9 years",
    bio: "Mara's fine line work is architectural in its precision. She brings a jeweler's eye to every piece — botanical details, portraiture, and geometric compositions that last a lifetime.",
    styles: ["Fine Line", "Botanical", "Portraiture", "Minimalist"],
    bookingLead: "6–8 weeks",
    startingAt: "€200",
    instagram: "@maravoss.ink",
  },
  {
    name: "Théo Marchais",
    role: "Blackwork & Dark Art",
    experience: "12 years",
    bio: "Théo works in bold darkness — heavy blackwork, neo-tribal, dark illustrative sleeves. His compositions are monumental and his black saturation unmatched in Paris.",
    styles: ["Blackwork", "Neo-Tribal", "Dark Illustrative", "Sleeve Work"],
    bookingLead: "10–14 weeks",
    startingAt: "€300",
    instagram: "@theo.noir",
  },
];

const portfolioItems = [
  { id: 1, title: "Botanical Fine Line", artist: "Mara Voss", style: "Fine Line", size: "tall" },
  { id: 2, title: "Geometric Sleeve", artist: "Théo Marchais", style: "Blackwork", size: "wide" },
  { id: 3, title: "Portrait Study", artist: "Mara Voss", style: "Portraiture", size: "square" },
  { id: 4, title: "Dark Tribal", artist: "Théo Marchais", style: "Neo-Tribal", size: "square" },
  { id: 5, title: "Floral Minimalist", artist: "Mara Voss", style: "Minimalist", size: "tall" },
  { id: 6, title: "Full Chest Piece", artist: "Théo Marchais", style: "Blackwork", size: "wide" },
  { id: 7, title: "Script & Ornament", artist: "Mara Voss", style: "Fine Line", size: "square" },
  { id: 8, title: "Serpent & Dagger", artist: "Théo Marchais", style: "Dark Illustrative", size: "square" },
];

const styleGuide = [
  {
    name: "Fine Line",
    artist: "Mara Voss",
    desc: "Ultra-thin single-needle linework with extraordinary precision. Perfect for delicate botanicals, fine portraiture, and minimalist compositions.",
    traits: ["Single needle", "High detail", "Minimal healing", "Feminine or unisex"],
    icon: "✦",
  },
  {
    name: "Blackwork",
    artist: "Théo Marchais",
    desc: "Bold, saturated black work with architectural impact. Includes neo-tribal, black fill, and heavy illustrative styles built to last decades.",
    traits: ["Bold statement", "Decades of staying power", "Large format", "Masculine edge"],
    icon: "◼",
  },
  {
    name: "Watercolor",
    artist: "Mara Voss",
    desc: "Ink washes and loose color transitions that mimic watercolor painting on skin. Abstract, artistic, and deeply personal.",
    traits: ["Painterly", "Abstract", "Color-driven", "Unique every time"],
    icon: "◈",
  },
];

const testimonials = [
  {
    name: "Camille R.",
    location: "Paris, 11e",
    rating: 5,
    text: "Mara did a full forearm botanical piece for me. The line quality is unreal — three years later it still looks fresh. The studio is the cleanest I've ever been in, and the process was completely stress-free.",
    style: "Fine Line Botanical",
  },
  {
    name: "Antoine D.",
    location: "Lyon",
    rating: 5,
    text: "Théo designed my sleeve over two sessions. He took my vague ideas and created something I genuinely love waking up to every day. Worth every euro and every week of the wait.",
    style: "Blackwork Sleeve",
  },
  {
    name: "Léa M.",
    location: "Paris, 3e",
    rating: 5,
    text: "I was nervous for my first tattoo and the team made the entire experience remarkable. The design consultation alone felt like working with a fine artist. Noir Ink is a cut above.",
    style: "Minimalist Fine Line",
  },
  {
    name: "Marc T.",
    location: "Bordeaux",
    rating: 5,
    text: "Traveled from Bordeaux specifically for Théo's blackwork. The chest piece he created is the most important piece of art I own — and I wear it everywhere.",
    style: "Full Chest Blackwork",
  },
];

const bookingTiers = [
  {
    name: "Consultation",
    price: "Free",
    duration: "30 min",
    desc: "Meet your artist, discuss your vision, review reference images, and get a custom quote.",
    includes: ["Artist Q&A", "Custom design brief", "Size & placement advice", "Pricing estimate"],
    cta: "Book Free Consult",
    featured: false,
  },
  {
    name: "Small Piece",
    price: "€200",
    duration: "2–4 hours",
    desc: "Standalone pieces up to 10cm. Perfect for fine line florals, scripts, geometric shapes, and minimalist icons.",
    includes: ["Custom design", "2–4 hour session", "Aftercare kit", "Touch-up included"],
    cta: "Book Session",
    featured: false,
  },
  {
    name: "Large Piece",
    price: "€600",
    duration: "Full day",
    desc: "Complex single pieces — ribcage, thigh, back panel, chest. Full day session with breaks.",
    includes: ["Custom design", "Full day (7 hrs)", "Stencil preview", "Aftercare kit", "Touch-up included"],
    cta: "Book Session",
    featured: true,
  },
  {
    name: "Sleeve / Project",
    price: "Custom",
    duration: "Multi-session",
    desc: "Full or half sleeves, back pieces, and multi-session projects. Priced per session with a dedicated plan.",
    includes: ["Design brief meeting", "Session-by-session planning", "Priority booking", "All aftercare", "Lifetime touch-ups"],
    cta: "Start Project",
    featured: false,
  },
];

const faqs = [
  {
    q: "How do I care for my tattoo?",
    a: "We provide a full aftercare kit and written instructions. The basics: keep it clean, apply unscented moisturizer 3x daily, avoid sun and swimming for 3 weeks, don't pick or scratch. We're available by message for questions during healing.",
  },
  {
    q: "How long does healing take?",
    a: "Surface healing takes 2–3 weeks. Full dermal healing is 3–6 months. Fine line work may require a touch-up at the 3-month mark — included in your booking price.",
  },
  {
    q: "Can I bring my own design?",
    a: "Yes, and we love when clients bring references. Our artists will always adapt, refine, and optimize your idea for the skin. We don't do exact reproductions of another artist's work.",
  },
  {
    q: "Is there a minimum age requirement?",
    a: "Yes — 18 years old, strictly. We require valid ID at the door. No exceptions.",
  },
  {
    q: "What's the deposit policy?",
    a: "A 30% non-refundable deposit is required to hold your appointment. It applies toward your total. Cancellations within 48 hours forfeit the deposit.",
  },
  {
    q: "Does it hurt?",
    a: "Discomfort varies by placement. Ribs, inner arm, and feet are more sensitive. Outer arm, thigh, and calf are typically well-tolerated. Our artists work at a sustainable pace and take breaks as needed.",
  },
];

const stats = [
  { value: "2,400+", label: "Pieces Completed" },
  { value: "12", label: "Years in Paris" },
  { value: "98%", label: "Client Return Rate" },
  { value: "4.9", label: "Average Rating" },
];

function NeedleAnimation() {
  const pathLength = useMotionValue(0);
  const smoothLength = useSpring(pathLength, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const controls = animate(pathLength, 1, {
      duration: 3,
      delay: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    });
    return controls.stop;
  }, [pathLength]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg
        viewBox="0 0 600 800"
        style={{ width: "100%", height: "100%", opacity: 0.22 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 80 700 C 100 600, 200 500, 180 380 C 160 260, 300 200, 320 100 C 340 20, 400 40, 450 80 C 500 120, 520 180, 500 240 C 480 300, 420 310, 400 380 C 380 450, 440 490, 460 560 C 480 630, 440 700, 400 740"
          stroke={C.accent}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: smoothLength }}
        />
        <motion.path
          d="M 200 750 C 220 680, 280 620, 300 540 C 320 460, 260 400, 280 320 C 300 240, 380 220, 360 140"
          stroke={C.accent}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 8"
          style={{ pathLength: smoothLength, opacity: 0.5 }}
        />
        <motion.path
          d="M 350 760 C 340 690, 380 640, 360 560 C 340 480, 280 460, 300 380 C 320 300, 400 280, 380 200 C 360 130, 300 110, 320 50"
          stroke={C.gray}
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: smoothLength, opacity: 0.3 }}
        />
      </svg>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,10,10,0.97)" : "transparent",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="#" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.white, fontSize: 16, fontFamily: "'Cinzel', serif", fontWeight: 700 }}>N</span>
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.12em" }}>NOIR INK</span>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {navLinks.slice(0, 5).map((l) => (
            <Link key={l.href} href={l.href}
              style={{ color: C.textMuted, fontSize: 13, letterSpacing: "0.08em", textDecoration: "none", fontFamily: "'Barlow', system-ui", textTransform: "uppercase" as const, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >{l.label}</Link>
          ))}
          <button onClick={() => document.getElementById("booking")?.scrollIntoView({behavior:"smooth"})}
            style={{ background: C.accent, color: C.white, padding: "10px 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Book Now</Link>
        </div>
      </div>

      {open && (
        <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "20px 24px" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", color: C.textMuted, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontSize: 14, borderBottom: `1px solid ${C.border}` }}
            >{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <NeedleAnimation />

      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 600 }}>Paris — Studio de Tatouage Premium</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 700, color: C.white, lineHeight: 0.95, margin: "0 0 32px", letterSpacing: "-0.02em" }}
          >
            INK<br />
            <span style={{ color: C.accent }}>WORTH</span><br />
            WEARING
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Barlow', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}
          >
            Noir Ink is Paris's premier fine line and blackwork studio. Two artists. Twelve years. Thousands of pieces built to outlast a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}
          >
            <button onClick={() => document.getElementById("booking")?.scrollIntoView({behavior:"smooth"})}
              style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Book Consultation <ArrowRight size={16} /></Link>
            <button onClick={() => document.getElementById("portfolio")?.scrollIntoView({behavior:"smooth"})}
              style={{ border: `1px solid ${C.border}`, color: C.textMuted, padding: "16px 36px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
            >View Portfolio</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ display: "flex", gap: 40, marginTop: 72, paddingTop: 40, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" as const }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: C.white }}>{s.value}</div>
                <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8 }}
      >
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
        <ChevronDown size={14} color={C.accent} />
      </motion.div>
    </section>
  );
}

function ArtistsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="artists" ref={ref} style={{ background: C.bgAlt, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 80 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>The Artists</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Two Masters.<br />One Studio.</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {artists.map((artist, i) => (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              style={{ background: C.bgCard, padding: 48, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: i === 1 ? C.accent : C.gray }} />
              <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "'Cinzel', serif", fontSize: 80, color: "rgba(255,255,255,0.03)", fontWeight: 700, lineHeight: 1 }}>
                {i === 0 ? "I" : "II"}
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{ width: 64, height: 64, background: i === 0 ? C.accentLight : C.grayLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${i === 0 ? C.borderAccent : C.border}` }}>
                  <Scissors size={24} color={i === 0 ? C.accent : C.textMuted} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: C.white, margin: "0 0 4px", fontWeight: 700 }}>{artist.name}</h3>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.accent, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{artist.role}</p>
                </div>
              </div>

              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>{artist.bio}</p>

              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 12 }}>Specialties</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                  {artist.styles.map((s) => (
                    <span key={s} style={{ border: `1px solid ${C.border}`, color: C.textMuted, padding: "4px 12px", fontSize: 12, fontFamily: "'Barlow', system-ui", letterSpacing: "0.04em" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                {[
                  { label: "Experience", val: artist.experience },
                  { label: "Lead Time", val: artist.bookingLead },
                  { label: "Starting At", val: artist.startingAt },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, fontWeight: 700 }}>{item.val}</div>
                    <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="portfolio" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Portfolio</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Selected Work</h2>
        </motion.div>

        <div style={{ columns: "3 280px", gap: 8 }}>
          {portfolioItems.map((item, i) => {
            const heights: Record<string, number> = { tall: 420, wide: 280, square: 320 };
            const h = heights[item.size];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ position: "relative", height: h, marginBottom: 8, breakInside: "avoid", overflow: "hidden", cursor: "pointer", background: i % 2 === 0 ? C.bgCard : C.grayLight, display: "block" }}
              >
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.grayLight}, ${C.bgCard})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scissors size={32} color={C.border} />
                </div>

                <motion.div
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.88)", display: "flex", flexDirection: "column" as const, justifyContent: "flex-end", padding: 24 }}
                >
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>{item.style}</p>
                  <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, margin: "0 0 6px", fontWeight: 700 }}>{item.title}</h4>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textMuted, margin: 0 }}>by {item.artist}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StylesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="styles" ref={ref} style={{ background: C.bgAlt, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Style Guide</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Our Disciplines</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {styleGuide.map((style, i) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              style={{ background: C.bgCard, padding: 40 }}
            >
              <div style={{ fontSize: 48, marginBottom: 24, color: C.accent, fontFamily: "monospace" }}>{style.icon}</div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{style.name}</h3>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.accent, margin: "0 0 20px", letterSpacing: "0.06em" }}>with {style.artist}</p>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 28 }}>{style.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {style.traits.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 4, height: 4, background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted }}>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Client Voices</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Worn with Pride</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40 }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 24 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.text, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: C.white, margin: "0 0 4px", fontWeight: 600 }}>{t.name}</p>
                  <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textDim, margin: 0 }}>{t.location}</p>
                </div>
                <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderAccent}`, padding: "4px 10px" }}>{t.style}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="booking" ref={ref} style={{ background: C.bgAlt, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Book Your Session</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 20px", fontWeight: 700 }}>Pricing & Tiers</h2>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>Every session begins with a free consultation. We quote before we begin — no surprises.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {bookingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ background: tier.featured ? C.accent : C.bgCard, padding: 36, position: "relative", display: "flex", flexDirection: "column" as const }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 16, right: 16, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Barlow', system-ui", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 8px" }}>Popular</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: tier.featured ? "rgba(255,255,255,0.7)" : C.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: C.white, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.8)" : C.textMuted, lineHeight: 1.6, marginBottom: 28, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <Check size={14} color={tier.featured ? C.white : C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: tier.featured ? "rgba(255,255,255,0.9)" : C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                style={{ display: "block", textAlign: "center" as const, background: tier.featured ? C.white : "transparent", color: tier.featured ? C.accent : C.white, border: tier.featured ? "none" : `1px solid ${C.border}`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Barlow', system-ui", fontWeight: 700 }}
              >{tier.cta}</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 56px)", color: C.white, margin: 0, fontWeight: 700 }}>Questions & Answers</h2>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
              >
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.white, fontWeight: 600 }}>{faq.q}</span>
                <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} color={C.accent} />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIdx === i ? "auto" : 0, opacity: openIdx === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, paddingBottom: 24, margin: 0 }}>{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "80px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: C.white, fontSize: 16, fontFamily: "'Cinzel', serif", fontWeight: 700 }}>N</span>
              </div>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.12em" }}>NOIR INK</span>
            </div>
            <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Fine line and blackwork tattoo studio. Paris, France. By appointment only.</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <MessageSquare size={18} color={C.textDim} />
              <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textDim }}>@noir.ink.paris</span>
            </div>
          </div>

          {[
            { title: "Studio", links: ["About Us", "Artists", "Portfolio", "Press"] },
            { title: "Services", links: ["Fine Line", "Blackwork", "Watercolor", "Sleeve Projects"] },
            { title: "Visit", links: ["Book Online", "Gift Cards", "FAQ", "Aftercare"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.white, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <Link href="#"
                      style={{ fontFamily: "'Barlow', system-ui", fontSize: 14, color: C.textMuted, textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                    >{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            {[
              { Icon: MapPin, text: "18 Rue Oberkampf, Paris 11e" },
              { Icon: Phone, text: "+33 1 42 00 00 00" },
              { Icon: Clock, text: "Tue–Sat, 10h–20h" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} color={C.accent} />
                <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textMuted }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 13, color: C.textDim, margin: 0 }}>© 2026 Noir Ink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function TattooTemplate() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <ArtistsSection />
      <PortfolioSection />
      <StylesSection />
      <TestimonialsSection />
      <BookingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
