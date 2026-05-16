"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  Package,
  Leaf,
  Flame,
  Globe,
  Clock,
  Zap,
  MessageSquare,
  Link2,
  Camera,
  Bookmark,
  Users2,
  TrendingUp,
  Award,
  RefreshCw,
} from "lucide-react";

const C = {
  bg: "#fdf8f3",
  bgAlt: "#f7f0e6",
  text: "#1a0a00",
  textMuted: "#7a5c3a",
  espresso: "#1a0a00",
  caramel: "#c4813a",
  caramelLight: "#f5ddb8",
  cream: "#fdf8f3",
  sand: "#e8d5b7",
  white: "#ffffff",
  border: "#e2cba8",
  borderLight: "#f0e4cc",
};

const ORIGINS = [
  {
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    process: "Washed",
    altitude: "1,800-2,200m",
    flavor: ["Jasmine", "Bergamot", "Stone fruit", "Bright acidity"],
    roast: "Light",
    price: "19",
    region: "Africa",
    description:
      "A floral, tea-like cup from the birthplace of coffee. Hand-picked from small family farms in the Gedeo Zone.",
  },
  {
    name: "Colombian Huila Natural",
    origin: "Colombia",
    process: "Natural",
    altitude: "1,600-1,900m",
    flavor: ["Dark cherry", "Chocolate", "Brown sugar", "Full body"],
    roast: "Medium",
    price: "17",
    region: "Latin America",
    description:
      "Rich and fruit-forward from Colombia's most celebrated region. Sun-dried for 25 days on raised beds.",
  },
  {
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    process: "Wet-Hulled",
    altitude: "1,200-1,500m",
    flavor: ["Earthy", "Cedar", "Dark chocolate", "Low acidity"],
    roast: "Dark",
    price: "16",
    region: "Asia-Pacific",
    description:
      "A unique wet-hulled processing gives this Sumatran coffee its distinctively earthy, full-bodied character.",
  },
  {
    name: "Guatemala Antigua",
    origin: "Guatemala",
    process: "Washed",
    altitude: "1,500-1,700m",
    flavor: ["Toffee", "Caramel", "Mild citrus", "Medium body"],
    roast: "Medium",
    price: "15",
    region: "Latin America",
    description:
      "Volcanic soil and consistent climate produce a balanced, approachable cup with classic Central American character.",
  },
];

const PROCESS_STEPS = [
  {
    icon: Leaf,
    step: "01",
    title: "Source",
    desc: "We visit farms annually. Every lot is traceable to the specific producer and harvest. No middlemen.",
  },
  {
    icon: Package,
    step: "02",
    title: "Select",
    desc: "Green coffee is cupped blind by our team. Less than 8% of samples we receive make it to roasting.",
  },
  {
    icon: Flame,
    step: "03",
    title: "Roast",
    desc: "Small-batch roasting on our Loring S35. Every profile is developed over months and documented precisely.",
  },
  {
    icon: Clock,
    step: "04",
    title: "Rest",
    desc: "All coffee rests 5-14 days after roasting before shipping — peak degassing for optimal extraction.",
  },
  {
    icon: Package,
    step: "05",
    title: "Pack",
    desc: "Nitrogen-flushed valve bags preserve freshness. Shipped within 48h of packing.",
  },
  {
    icon: Zap,
    step: "06",
    title: "Brew",
    desc: "Every bag includes QR-linked brew guides for that specific lot and roast level.",
  },
];

const SUBSCRIPTIONS = [
  {
    name: "Weekly",
    price: "24",
    period: "per delivery",
    freq: "Every 7 days",
    size: "250g",
    features: [
      "Rotating single origins",
      "Curated by our head roaster",
      "Tasting notes included",
      "Free shipping",
      "Skip or pause anytime",
    ],
    highlight: false,
  },
  {
    name: "Bi-Weekly",
    price: "44",
    period: "per delivery",
    freq: "Every 14 days",
    size: "2 x 250g",
    features: [
      "2 coffees each delivery",
      "1 single origin + 1 blend",
      "Brew guide + video",
      "Free shipping",
      "8% subscriber discount",
      "Early access to new lots",
    ],
    highlight: true,
  },
  {
    name: "Monthly",
    price: "79",
    period: "per delivery",
    freq: "Every 30 days",
    size: "4 x 250g",
    features: [
      "Full Origin Box (4 coffees)",
      "One from each growing region",
      "Detailed origin stories",
      "Free expedited shipping",
      "15% subscriber discount",
      "Exclusive reserve access",
      "Quarterly tasting call",
    ],
    highlight: false,
  },
];

const REVIEWS = [
  {
    name: "James Okafor",
    role: "Home Barista",
    avatar: "JO",
    rating: 5,
    text: "The Ethiopian Yirgacheffe changed how I think about coffee. I've tried beans from every major subscription — Origin Roast is in another category.",
  },
  {
    name: "Sophie Lindqvist",
    role: "Cafe Owner, Stockholm",
    avatar: "SL",
    rating: 5,
    text: "We switched our cafe's house blend to Origin Roast six months ago. Customer feedback on our espresso has improved measurably. The consistency is remarkable.",
  },
  {
    name: "Tariq Hassan",
    role: "Monthly Subscriber",
    avatar: "TH",
    rating: 5,
    text: "The monthly box is a coffee education. Each arrival I learn something new — about the farm, the process, the roast. It's made me genuinely knowledgeable.",
  },
];

const FAQS = [
  {
    q: "How fresh is the coffee when it arrives?",
    a: "We roast to order. Your coffee is roasted within 48 hours of your order, rested 5-14 days (depending on process), then shipped. Most subscribers receive coffee 7-10 days off-roast — ideal for espresso and filter.",
  },
  {
    q: "What grind options are available?",
    a: "Whole bean, coarse filter (French press/cold brew), medium filter (pour over/drip), fine filter (Aeropress), and espresso. We recommend whole bean for peak freshness.",
  },
  {
    q: "Can I skip or pause my subscription?",
    a: "Yes — skip up to 4 consecutive deliveries per year, or pause for up to 3 months. Manage everything from your account dashboard or email us.",
  },
  {
    q: "Do you offer decaffeinated options?",
    a: "Yes. We carry a Swiss Water Process decaf single origin, rotated seasonally. All subscription plans can include decaf as one of your selections.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship to 22 countries across Europe and North America. International orders include expedited shipping to ensure freshness. DHL tracked, typically 3-5 days.",
  },
  {
    q: "What is your sourcing philosophy?",
    a: "Direct trade where possible — we visit producers annually and pay above Fair Trade minimums. All partners are paid before harvest via crop financing. Full transparency on every bag.",
  },
];

const STATS = [
  { value: "47", label: "Farm Partners" },
  { value: "18", label: "Countries Sourced" },
  { value: "32k+", label: "Bags Roasted" },
  { value: "4.9", label: "Avg. Rating" },
];

// Rotating coffee bean SVG
function CoffeeBeanSVG() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ width: 180, height: 180, margin: "0 auto" }}
    >
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <ellipse
          cx="50"
          cy="50"
          rx="32"
          ry="44"
          fill={C.caramel}
          opacity="0.9"
          transform="rotate(-20 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="42"
          fill="none"
          stroke={C.espresso}
          strokeWidth="1.5"
          opacity="0.4"
          transform="rotate(-20 50 50)"
        />
        {/* Center crease */}
        <path
          d="M35,30 Q50,50 65,70"
          fill="none"
          stroke={C.espresso}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
          transform="rotate(-20 50 50)"
        />
        {/* Shine */}
        <ellipse
          cx="40"
          cy="38"
          rx="8"
          ry="5"
          fill="white"
          opacity="0.12"
          transform="rotate(-20 50 50)"
        />
      </svg>
    </motion.div>
  );
}

// Origin world map SVG with highlighted regions
function OriginMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 800 400"
        style={{
          width: "100%",
          background: `${C.espresso}12`,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
        }}
      >
        {/* Simple continent outlines */}
        {/* Africa */}
        <path
          d="M 380 80 L 430 85 L 450 130 L 440 190 L 410 230 L 390 250 L 370 220 L 355 170 L 360 120 Z"
          fill={hovered === "Africa" ? C.caramel : `${C.caramel}30`}
          stroke={C.caramel}
          strokeWidth={hovered === "Africa" ? 2 : 1}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Africa")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Latin America */}
        <path
          d="M 200 80 L 240 85 L 255 140 L 245 200 L 220 240 L 200 220 L 185 160 L 190 110 Z"
          fill={hovered === "Latin America" ? C.caramel : `${C.caramel}30`}
          stroke={C.caramel}
          strokeWidth={hovered === "Latin America" ? 2 : 1}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Latin America")}
          onMouseLeave={() => setHovered(null)}
        />
        {/* Asia-Pacific */}
        <path
          d="M 580 80 L 660 90 L 680 150 L 650 190 L 600 180 L 570 140 L 565 100 Z"
          fill={hovered === "Asia-Pacific" ? C.caramel : `${C.caramel}30`}
          stroke={C.caramel}
          strokeWidth={hovered === "Asia-Pacific" ? 2 : 1}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Asia-Pacific")}
          onMouseLeave={() => setHovered(null)}
        />

        {/* Labels */}
        <text x="400" y="280" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Africa</text>
        <text x="218" y="270" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Latin America</text>
        <text x="625" y="215" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Asia-Pacific</text>

        {/* Hover tooltip */}
        {hovered && (
          <text x="400" y="340" textAnchor="middle" fontSize="12" fill={C.textMuted} fontFamily="'DM Sans', system-ui">
            {ORIGINS.find((o) => o.region === hovered)?.name || hovered}
          </text>
        )}

        {/* Equator line */}
        <line x1="100" y1="160" x2="700" y2="160" stroke={C.caramel} strokeWidth="0.5" strokeDasharray="6,6" opacity="0.3" />
        <text x="108" y="155" fontSize="9" fill={C.caramel} opacity="0.5" fontFamily="'DM Sans', system-ui">Equator</text>
      </svg>
      <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 10 }}>
        Hover to explore growing regions
      </p>
    </div>
  );
}

function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.caramel : C.border}`,
          borderRadius: 10,
          padding: "20px 24px",
          cursor: "pointer",
          marginBottom: 8,
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 16, color: C.espresso }}>
            {faq.q}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={18} color={C.caramel} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontFamily: "'DM Sans', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}
          >
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function OriginRoastPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.bg, color: C.text, overflowX: "hidden" }}>
      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.espresso, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.caramel, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14 }}>☕</span>
            </div>
            <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 20, color: C.cream }}>
              Origin Roast
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Origins", "Process", "Subscribe", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontFamily: "'DM Sans', system-ui", fontSize: 14, fontWeight: 500, color: C.sand, textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>

          <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})} style={{ background: C.caramel, color: C.espresso, padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Subscribe
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: C.espresso, overflow: "hidden", paddingTop: 72 }}>
        {/* Background grain */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: heroScale,
            backgroundImage: `radial-gradient(${C.caramel}10 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Warm glow */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: `radial-gradient(circle, ${C.caramel}20 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "15%", width: 400, height: 400, background: `radial-gradient(circle, ${C.caramel}15 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 5%", width: "100%", opacity: heroOpacity }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "center" }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.caramel, marginBottom: 20 }}>
                Specialty Coffee Roastery
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(44px, 5.5vw, 76px)", fontWeight: 900, color: C.cream, lineHeight: 1.05, marginBottom: 24 }}>
                From Farm
                <br />
                <span style={{ color: C.caramel }}>to Cup.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                style={{ fontFamily: "'DM Sans', system-ui", fontSize: 18, color: C.sand, lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 300 }}>
                Small-batch specialty coffee sourced directly from 47 farm partners across 18 countries. Roasted to order and shipped at peak freshness.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.espresso, padding: "16px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                  Start Subscription <ArrowRight size={18} />
                </a>
                <button onClick={() => document.getElementById("origins")?.scrollIntoView({behavior:"smooth"})} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.cream, padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                  Explore Origins
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 40, marginTop: 52 }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.caramel }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: C.sand, marginTop: 4, fontWeight: 300 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Rotating coffee bean */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
                <CoffeeBeanSVG />
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: C.caramel }}>
                    Roasted Today
                  </div>
                  <div style={{ marginTop: 6, fontFamily: "'DM Sans', system-ui", fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>
                    Ethiopian Yirgacheffe — Lot 2024-112
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ORIGIN STORY — Roasting process */}
      <section id="process" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Our Process
              </div>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Six steps from origin to you
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                No shortcuts. Every step is deliberate. Every decision documented and traceable.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {PROCESS_STEPS.map((step, i) => (
              <SectionReveal key={step.title} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, transition: "box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(26,10,0,0.10)"; el.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.icon size={22} color={C.caramel} />
                    </div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, letterSpacing: "0.1em" }}>
                      {step.step}
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300 }}>
                    {step.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGIN MAP + COFFEE CATALOG */}
      <section id="origins" style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Current coffee catalog
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                All lots are available until sold out. New arrivals every 4-6 weeks.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ marginBottom: 60 }}>
              <OriginMap />
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {ORIGINS.map((coffee, i) => (
              <SectionReveal key={coffee.name} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "inline-block", background: C.caramelLight, color: C.caramel, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 10, letterSpacing: "0.04em" }}>
                        {coffee.region} — {coffee.origin}
                      </div>
                      <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.espresso }}>
                        {coffee.name}
                      </h3>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.caramel }}>
                        {coffee.price}
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>EUR / 250g</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>
                    {coffee.description}
                  </p>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "Process", val: coffee.process },
                      { label: "Altitude", val: coffee.altitude },
                      { label: "Roast", val: coffee.roast },
                    ].map((d) => (
                      <div key={d.label} style={{ background: C.bgAlt, borderRadius: 6, padding: "6px 12px" }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                        <div style={{ fontSize: 13, color: C.espresso, fontWeight: 600 }}>{d.val}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Flavor Notes
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {coffee.flavor.map((f) => (
                        <span key={f} style={{ background: `${C.caramel}15`, color: C.caramel, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.caramelLight, color: C.caramel, padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", alignSelf: "flex-start" }}>
                    Add to subscription <ArrowRight size={14} />
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "100px 5%", background: C.espresso }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: C.cream, marginBottom: 12 }}>
                What our subscribers say
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {REVIEWS.map((r, i) => (
              <SectionReveal key={r.name} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 32, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={15} fill={C.caramel} color={C.caramel} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, color: C.sand, lineHeight: 1.8, flex: 1, fontStyle: "italic", fontWeight: 400 }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${C.caramel}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 14, color: C.caramel, flexShrink: 0 }}>
                      {r.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 15, color: C.cream }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>{r.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PRICING */}
      <section id="subscribe" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Subscription Plans
              </div>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Never run out of great coffee
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Pause, skip, or cancel anytime. No commitment required.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {SUBSCRIPTIONS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.12}>
                <div style={{
                  background: plan.highlight ? C.espresso : C.white,
                  borderRadius: 16,
                  padding: 36,
                  border: plan.highlight ? `2px solid ${C.caramel}` : `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: "100%",
                }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: C.caramel, color: C.espresso, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Best Value
                    </div>
                  )}
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: plan.highlight ? C.cream : C.espresso, marginBottom: 4 }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 12, color: plan.highlight ? C.sand : C.textMuted, marginBottom: 6, fontWeight: 300 }}>
                    {plan.freq} — {plan.size}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 44, fontWeight: 700, color: plan.highlight ? C.caramel : C.espresso }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginLeft: 4 }}>EUR/{plan.period}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Check size={13} color={C.caramel} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.text, fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{ display: "block", textAlign: "center", background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    Start {plan.name}
                  </a>
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
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
                Questions answered
              </h2>
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
      <footer style={{ background: C.espresso, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 24, color: C.caramel, marginBottom: 16 }}>
                Origin Roast
              </div>
              <p style={{ fontSize: 14, color: "#7a5c3a", lineHeight: 1.75, maxWidth: 260, fontWeight: 300 }}>
                Specialty coffee sourced directly from farms, roasted in small batches, shipped at peak freshness.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[Camera, MessageSquare, Link2].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#7a5c3a" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Shop", links: ["All Coffees", "Subscriptions", "Gift Cards", "Brewing Equipment", "Merch"] },
              { title: "Company", links: ["Our Story", "Farm Partners", "Sustainability", "Blog", "Careers"] },
              { title: "Support", links: ["hello@originroast.com", "+1 888 555 0142", "FAQ", "Shipping Info", "Returns"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {col.title}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ fontSize: 13, color: "#7a5c3a", textDecoration: "none", fontWeight: 300 }}>{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#3d2010" }}>2025 Origin Roast Ltd. All rights reserved.</p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Accessibility"].map((item) => (
                <a key={item} href="#" style={{ fontSize: 13, color: "#3d2010", textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
