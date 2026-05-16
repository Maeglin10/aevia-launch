"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, TrendingUp, Shield, PieChart, FileText,
  Users, Award, BarChart3, MessageSquare, ChevronRight
} from "lucide-react";

const C = {
  bg: "#f8f6f0",
  bgDark: "#1a1a1a",
  bgCard: "#ffffff",
  bgCardDark: "#242424",
  bgNavy: "#1e3a5f",
  text: "#1a1a1a",
  textLight: "#ffffff",
  textMuted: "#6b6359",
  textDim: "#a09890",
  accent: "#c9a84c",
  accentHover: "#d9b85c",
  accentLight: "rgba(201,168,76,0.12)",
  accentBorder: "rgba(201,168,76,0.3)",
  navy: "#1e3a5f",
  navyLight: "#2a4f7c",
  ivory: "#f8f6f0",
  border: "rgba(26,26,26,0.08)",
  borderDark: "rgba(255,255,255,0.08)",
  borderGold: "rgba(201,168,76,0.25)",
  white: "#ffffff",
};

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Advisors", href: "#advisors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Packages", href: "#packages" },
  { label: "FAQ", href: "#faq" },
];

const services = [
  {
    icon: TrendingUp,
    title: "Wealth Planning",
    desc: "Comprehensive financial roadmaps aligned with your life goals — retirement, generational wealth transfer, philanthropy, and financial independence.",
  },
  {
    icon: PieChart,
    title: "Portfolio Management",
    desc: "Discretionary and advisory portfolio management across equities, fixed income, alternatives, and private markets. Fully customised to your risk profile.",
  },
  {
    icon: FileText,
    title: "Tax Optimisation",
    desc: "Strategic tax planning working alongside your accountant — year-end harvesting, gifting strategies, trust structures, and cross-border tax efficiency.",
  },
  {
    icon: Shield,
    title: "Estate Planning",
    desc: "Preserving and transferring wealth across generations. We coordinate with estate attorneys to structure trusts, gifting programs, and family governance.",
  },
];

const philosophy = [
  {
    num: "01",
    title: "Fiduciary First",
    desc: "We are legally and ethically obligated to act in your best interest at all times. We are fee-only and independent — never commission-driven.",
  },
  {
    num: "02",
    title: "Evidence-Based Investing",
    desc: "Our investment approach is grounded in decades of academic research, not market speculation or timing. We build portfolios that endure.",
  },
  {
    num: "03",
    title: "Holistic Integration",
    desc: "Wealth management isn't just about investments. We integrate tax, estate, insurance, and cash flow into one coherent strategy.",
  },
  {
    num: "04",
    title: "Radical Transparency",
    desc: "You will always know exactly what you pay, what you own, and why. No hidden fees, no conflicts of interest, no surprises.",
  },
];

const advisors = [
  {
    name: "Charles Whitmore",
    title: "Founding Partner & CIO",
    credentials: "CFA, CFP — 22 years",
    education: "Wharton School, University of Pennsylvania",
    focus: "Ultra-high-net-worth families, multi-generational planning",
    bio: "Charles founded Meridian Capital after managing over €2B at two private banks. He leads investment strategy and oversees the firm's most complex client relationships, including several multi-generational family offices.",
    aum: "€1.2B managed",
    clients: "42 families",
  },
  {
    name: "Helena Marchand",
    title: "Partner — Wealth Strategy",
    credentials: "CFP, CPA — 16 years",
    education: "Sciences Po Paris, London Business School",
    focus: "Retirement planning, tax optimisation, international clients",
    bio: "Helena specialises in cross-border wealth management for clients with assets in multiple jurisdictions. Her integrated approach to tax and financial planning has saved clients millions in unnecessary tax exposure.",
    aum: "€640M managed",
    clients: "58 clients",
  },
];

const aumStats = [
  { value: "€1.9B", label: "Assets Under Management" },
  { value: "22", label: "Years Independent" },
  { value: "100", label: "Client Families" },
  { value: "0.85%", label: "Average Annual Fee" },
];

const testimonials = [
  {
    name: "Philippe & Nathalie D.",
    profile: "Retired entrepreneurs, Paris",
    rating: 5,
    text: "We sold our business in 2021 and needed to deploy €12M wisely. Charles spent three months understanding our lives before proposing anything. Five years on, our portfolio has outperformed our expectations and we sleep well at night.",
    result: "€12M managed since 2021",
  },
  {
    name: "Éric S.",
    profile: "Tech founder, Geneva",
    rating: 5,
    text: "Helena restructured my holding company and personal assets across three countries. The tax savings in year one more than covered five years of fees. The clarity she brought to our overall picture was invaluable.",
    result: "Multi-jurisdiction restructuring",
  },
  {
    name: "Martine & Alain F.",
    profile: "Family office, Bordeaux",
    rating: 5,
    text: "Three generations of our family are now Meridian clients. Their family governance framework helped us align on wealth principles in a way no other advisor had managed. Exceptional firm.",
    result: "Generational wealth planning",
  },
];

const packages = [
  {
    name: "Foundations",
    minAum: "€500K",
    fee: "1.0% AUM",
    desc: "Ideal for clients beginning their wealth management journey or consolidating assets for the first time.",
    includes: ["Annual financial plan", "Quarterly portfolio review", "Tax optimisation review", "Email & phone access"],
    cta: "Schedule Call",
    featured: false,
  },
  {
    name: "Private Client",
    minAum: "€2M",
    fee: "0.85% AUM",
    desc: "Our comprehensive private client service for established investors with complex financial needs.",
    includes: ["Comprehensive wealth plan", "Monthly portfolio reporting", "Tax & estate coordination", "Direct partner access", "Annual family review", "Alternative investments"],
    cta: "Start Conversation",
    featured: true,
  },
  {
    name: "Family Office",
    minAum: "€10M+",
    fee: "Custom",
    desc: "A full-service family office experience for ultra-high-net-worth families with multi-generational goals.",
    includes: ["Dedicated partner team", "Family governance framework", "Consolidated reporting", "Private market access", "Next-gen education program", "24/7 partner access", "Philanthropic advisory"],
    cta: "Speak with Charles",
    featured: false,
  },
];

const faqs = [
  {
    q: "What is a fiduciary advisor and why does it matter?",
    a: "A fiduciary is legally required to act in your best interest at all times. Many financial advisors operate under a 'suitability' standard, which only requires that recommendations be appropriate — not necessarily best for you. As an independent, fee-only RIA, we are fiduciaries with no conflicts of interest.",
  },
  {
    q: "What is your minimum investment requirement?",
    a: "Our Foundations programme begins at €500,000 in investable assets. For Private Client services, the minimum is €2M. Family Office services begin at €10M. We're happy to discuss your situation directly.",
  },
  {
    q: "How do you charge for your services?",
    a: "We charge a percentage of assets under management (AUM) — ranging from 0.85% to 1.0% annually, billed quarterly. We receive no commissions or referral fees from any third party. Our fee is fully disclosed before engagement.",
  },
  {
    q: "How are my assets held and custodied?",
    a: "Client assets are held with independent custodians — Société Générale Securities Services or Interactive Brokers, depending on your profile. Meridian Capital never holds client funds directly.",
  },
  {
    q: "How often will we meet?",
    a: "Foundations clients receive quarterly portfolio reviews plus an annual financial planning meeting. Private Clients receive monthly reporting, quarterly calls, and an annual in-person review. Family Office clients have on-demand access and at least quarterly in-person meetings.",
  },
  {
    q: "Can you work with clients outside of France?",
    a: "Yes. We advise clients in France, Switzerland, Luxembourg, Belgium, and the UK. For US persons, we operate through a referral arrangement with a registered US RIA. Please enquire about your specific jurisdiction.",
  },
];

// Animated growth chart SVG
function GrowthChart({ scrollProgress }: { scrollProgress: any }) {
  const pathLength = useTransform(scrollProgress, [0, 0.5], [0, 1]);
  const smoothPath = useSpring(pathLength, { stiffness: 50, damping: 25 });

  const chartPoints = "M 30 200 C 60 195, 90 185, 120 175 C 150 160, 160 155, 190 140 C 220 125, 230 130, 260 110 C 290 90, 300 95, 330 70 C 360 45, 380 50, 410 30";
  const areaPath = chartPoints + " L 410 210 L 30 210 Z";

  return (
    <svg viewBox="0 0 440 220" style={{ width: "100%", maxWidth: 440, display: "block" }} fill="none">
      {/* Grid lines */}
      {[50, 100, 150, 200].map((y) => (
        <line key={y} x1="30" y1={y} x2="410" y2={y} stroke={C.borderGold} strokeWidth="1" strokeDasharray="4 6" />
      ))}
      {/* Y-axis labels */}
      {[
        { y: 205, label: "€0" },
        { y: 155, label: "€500K" },
        { y: 105, label: "€1M" },
        { y: 55, label: "€1.5M" },
      ].map(({ y, label }) => (
        <text key={y} x="25" y={y} textAnchor="end" fontSize="8" fill={C.accent} opacity="0.6" fontFamily="Inter, system-ui">{label}</text>
      ))}
      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill="url(#goldGradient)"
        opacity={0.15}
        style={{ pathLength: smoothPath }}
      />
      {/* Main line */}
      <motion.path
        d={chartPoints}
        stroke={C.accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: smoothPath }}
      />
      {/* Gradient def */}
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Data points */}
      {[
        { cx: 30, cy: 200 }, { cx: 120, cy: 175 }, { cx: 190, cy: 140 },
        { cx: 260, cy: 110 }, { cx: 330, cy: 70 }, { cx: 410, cy: 30 },
      ].map(({ cx, cy }, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill={C.accent}
          opacity={0.9}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.2, duration: 0.3 }}
        />
      ))}
      {/* X-axis year labels */}
      {["2019", "2020", "2021", "2022", "2023", "2024"].map((yr, i) => (
        <text key={yr} x={30 + i * 76} y={218} textAnchor="middle" fontSize="8" fill={C.accent} opacity="0.6" fontFamily="Inter, system-ui">{yr}</text>
      ))}
    </svg>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(26,26,26,0.98)" : C.bgDark,
      borderBottom: `1px solid ${C.borderDark}`,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="#" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column" as const }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.white, letterSpacing: "0.06em" }}>MERIDIAN</span>
              <span style={{ fontFamily: "'Inter', system-ui", fontSize: 9, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase" as const, marginTop: -2 }}>CAPITAL</span>
            </div>
            <div style={{ width: 1, height: 30, background: C.borderGold, margin: "0 8px" }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>Independent Wealth Management</span>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.slice(0, 4).map((l) => (
            <Link key={l.href} href={l.href}
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Inter', system-ui" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >{l.label}</Link>
          ))}
          <button onClick={() => document.getElementById("packages")?.scrollIntoView({behavior:"smooth"})}
            style={{ border: `1px solid ${C.accent}`, color: C.accent, padding: "10px 26px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Inter', system-ui", fontWeight: 600 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = C.bgDark; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.accent; }}
          >Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bgDark, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 75% 50%, rgba(201,168,76,0.06) 0%, transparent 55%), radial-gradient(circle at 25% 70%, rgba(30,58,95,0.5) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent 0%, ${C.accent} 50%, transparent 100%)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "100px 32px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 500 }}>Independent · Fee-Only · Fiduciary</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(48px, 5.5vw, 80px)", fontWeight: 700, color: C.white, lineHeight: 1.05, margin: "0 0 28px" }}
          >
            Your Wealth.<br />
            <span style={{ color: C.accent }}>Managed</span><br />
            Without Conflict.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Inter', system-ui", fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 460, marginBottom: 48 }}
          >
            Meridian Capital is an independent wealth management firm advising high-net-worth families across France and Europe. We act exclusively in your interest — no commissions, no conflicts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16 }}
          >
            <button onClick={() => document.getElementById("packages")?.scrollIntoView({behavior:"smooth"})}
              style={{ background: C.accent, color: C.bgDark, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Inter', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Start a Conversation <ArrowRight size={15} /></Link>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}
              style={{ border: `1px solid rgba(255,255,255,0.15)`, color: "rgba(255,255,255,0.6)", padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Inter', system-ui" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >Our Services</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ display: "flex", gap: 40, marginTop: 64, paddingTop: 40, borderTop: `1px solid rgba(255,255,255,0.06)`, flexWrap: "wrap" as const }}
          >
            {aumStats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Chart */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          <div style={{ background: C.bgCardDark, padding: "36px 32px", border: `1px solid ${C.borderDark}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <p style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.16em", textTransform: "uppercase" as const, margin: "0 0 4px" }}>Model Portfolio — Moderate Growth</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: C.accent, margin: 0, fontWeight: 700 }}>+38.2% cumulative</p>
              </div>
              <div style={{ padding: "6px 12px", background: "rgba(201,168,76,0.12)", border: `1px solid ${C.borderGold}` }}>
                <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: C.accent }}>5Y Return</span>
              </div>
            </div>
            <GrowthChart scrollProgress={scrollYProgress} />
            <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
              {[
                { label: "Annualised", val: "+6.8%" },
                { label: "Max Drawdown", val: "-8.2%" },
                { label: "Sharpe Ratio", val: "1.42" },
              ].map((m) => (
                <div key={m.label} style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderDark}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: C.accent, fontWeight: 700 }}>{m.val}</div>
                  <div style={{ fontFamily: "'Inter', system-ui", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, letterSpacing: "0.06em" }}>{m.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Inter', system-ui", fontSize: 10, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", lineHeight: 1.5 }}>Past performance is not indicative of future results. For illustrative purposes only.</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>What We Offer</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 64px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Advisory Services</h2>
          <p style={{ fontFamily: "'Inter', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 520 }}>A complete suite of wealth management services, integrated around your goals and delivered without conflicts of interest.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, background: C.border }}>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 48 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.accentLight; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bgCard; }}
            >
              <div style={{ width: 52, height: 52, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.accentBorder}` }}>
                <s.icon size={24} color={C.accent} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, color: C.text, margin: "0 0 12px", fontWeight: 700 }}>{s.title}</h3>
              <p style={{ fontFamily: "'Inter', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="philosophy" ref={ref} style={{ background: C.bgDark, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Investment Philosophy</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 64px)", color: C.white, margin: 0, fontWeight: 700 }}>Four Principles.<br />One Purpose.</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
          {philosophy.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              style={{ background: C.bgCardDark, padding: 48, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 24, right: 32, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 80, color: "rgba(201,168,76,0.06)", fontWeight: 700, lineHeight: 1 }}>{p.num}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: C.accent, marginBottom: 16 }}>{p.num}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: C.white, margin: "0 0 16px", fontWeight: 700 }}>{p.title}</h3>
              <p style={{ fontFamily: "'Inter', system-ui", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvisorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="advisors" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Your Advisors</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 64px)", color: C.text, margin: 0, fontWeight: 700 }}>The Partnership</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {advisors.map((adv, i) => (
            <motion.div
              key={adv.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, padding: 48 }}
            >
              <div style={{ display: "flex", gap: 20, marginBottom: 28, alignItems: "flex-start" }}>
                <div style={{ width: 72, height: 72, background: C.accentLight, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, color: C.accent, fontWeight: 700 }}>{adv.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: C.text, margin: "0 0 4px", fontWeight: 700 }}>{adv.name}</h3>
                  <p style={{ fontFamily: "'Inter', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", fontWeight: 500 }}>{adv.title}</p>
                  <p style={{ fontFamily: "'Inter', system-ui", fontSize: 12, color: C.textMuted, margin: 0 }}>{adv.credentials}</p>
                </div>
              </div>

              <p style={{ fontFamily: "'Inter', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 28 }}>{adv.bio}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "AUM", val: adv.aum },
                  { label: "Clients", val: adv.clients },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "16px 20px", background: C.bg, border: `1px solid ${C.border}` }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: C.accent, fontWeight: 700 }}>{item.val}</div>
                    <div style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: C.textDim, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                {[
                  { label: "Focus", val: adv.focus },
                  { label: "Education", val: adv.education },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Inter', system-ui", fontSize: 12, color: C.accent, fontWeight: 500, minWidth: 80, flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontFamily: "'Inter', system-ui", fontSize: 12, color: C.textMuted }}>{item.val}</span>
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

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bgDark, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Client Results</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 64px)", color: C.white, margin: 0, fontWeight: 700 }}>Trusted by Families<br />Across Europe</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: C.bgCardDark, padding: 40 }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 20 }}>
                <p style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: C.white, margin: "0 0 2px", fontWeight: 500 }}>{t.name}</p>
                <p style={{ fontFamily: "'Inter', system-ui", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>{t.profile}</p>
                <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.06em", border: `1px solid ${C.borderGold}`, padding: "3px 8px" }}>{t.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="packages" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Service Tiers</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 64px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>The Right Fit<br />for Your Wealth</h2>
          <p style={{ fontFamily: "'Inter', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 460, margin: "0 auto" }}>All service tiers include full fiduciary duty, transparent fees, and direct partner access.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, background: C.border }}>
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: pkg.featured ? C.bgDark : C.bgCard, padding: 48, display: "flex", flexDirection: "column" as const, position: "relative", borderTop: pkg.featured ? `3px solid ${C.accent}` : "3px solid transparent" }}
            >
              {pkg.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.bgDark, fontSize: 10, fontFamily: "'Inter', system-ui", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px" }}>Recommended</div>
              )}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: pkg.featured ? C.accent : C.textDim, letterSpacing: "0.14em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>Min. {pkg.minAum}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, color: pkg.featured ? C.white : C.text, margin: "0 0 10px", fontWeight: 700 }}>{pkg.name}</h3>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, color: C.accent, fontWeight: 700 }}>{pkg.fee}</div>
              </div>
              <p style={{ fontFamily: "'Inter', system-ui", fontSize: 15, color: pkg.featured ? "rgba(255,255,255,0.55)" : C.textMuted, lineHeight: 1.65, marginBottom: 32, flex: 1 }}>{pkg.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
                {pkg.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Check size={14} color={C.accent} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: pkg.featured ? "rgba(255,255,255,0.6)" : C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                style={{ display: "block", textAlign: "center" as const, background: pkg.featured ? C.accent : "transparent", color: pkg.featured ? C.bgDark : C.accent, border: pkg.featured ? "none" : `1px solid ${C.accentBorder}`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Inter', system-ui", fontWeight: 700 }}
              >{pkg.cta}</Link>
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
    <section id="faq" ref={ref} style={{ background: C.bgDark, padding: "120px 32px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Inter', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 4.5vw, 60px)", color: C.white, margin: 0, fontWeight: 700 }}>Common Questions</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.borderDark}` }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, color: C.white, fontWeight: 600 }}>{faq.q}</span>
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
              <p style={{ fontFamily: "'Inter', system-ui", fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, paddingBottom: 26, margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#111111", borderTop: `1px solid ${C.borderDark}`, padding: "80px 32px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: "0.06em" }}>MERIDIAN</span>
              <span style={{ fontFamily: "'Inter', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase" as const, display: "block", marginTop: -2 }}>CAPITAL</span>
            </div>
            <p style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Independent wealth management. Fee-only. Fiduciary. Paris and Geneva.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={C.accent} />
              <span style={{ fontFamily: "'Inter', system-ui", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>contact@meridiancapital.fr</span>
            </div>
          </div>

          {[
            { title: "Services", links: ["Wealth Planning", "Portfolio Management", "Tax Optimisation", "Estate Planning"] },
            { title: "Firm", links: ["About Us", "Our Advisors", "Investment Philosophy", "Compliance", "Press"] },
            { title: "Start", links: ["Schedule Call", "Client Portal", "Legal Disclaimers", "Privacy Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <Link href="#"
                      style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 20 }}>
          <div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const, marginBottom: 12 }}>
              {[
                { Icon: MapPin, text: "40 Avenue Hoche, Paris 8e" },
                { Icon: Phone, text: "+33 1 53 00 00 00" },
                { Icon: Clock, text: "Mon–Fri, 8h30–18h30" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={13} color={C.accent} />
                  <span style={{ fontFamily: "'Inter', system-ui", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Inter', system-ui", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, maxWidth: 600, lineHeight: 1.5 }}>Meridian Capital SAS is registered with the AMF. Past performance is not indicative of future results. This page is for informational purposes only and does not constitute investment advice.</p>
          </div>
          <p style={{ fontFamily: "'Inter', system-ui", fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 Meridian Capital</p>
        </div>
      </div>
    </footer>
  );
}

export default function WealthManagementTemplate() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PhilosophySection />
      <AdvisorsSection />
      <TestimonialsSection />
      <PackagesSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
