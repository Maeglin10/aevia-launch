"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, Scale, BookOpen, Briefcase, Shield,
  Users, Award, FileText, MessageSquare, ChevronRight
} from "lucide-react";

const C = {
  bg: "#f7f8fa",
  bgDark: "#0a1628",
  bgCard: "#ffffff",
  bgGold: "rgba(184,149,42,0.08)",
  text: "#0a1628",
  textLight: "#ffffff",
  textMuted: "#5a6478",
  textDim: "#9aa3b2",
  accent: "#b8952a",
  accentHover: "#d4aa30",
  accentLight: "rgba(184,149,42,0.12)",
  navy: "#0a1628",
  navyLight: "#142238",
  border: "rgba(10,22,40,0.08)",
  borderDark: "rgba(255,255,255,0.1)",
  borderGold: "rgba(184,149,42,0.3)",
  white: "#ffffff",
};

const navLinks = [
  { label: "Practice Areas", href: "#practice" },
  { label: "Attorneys", href: "#attorneys" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Consultation", href: "#consultation" },
  { label: "FAQ", href: "#faq" },
];

const practiceAreas = [
  { icon: Briefcase, title: "Corporate Law", desc: "Entity formation, governance, shareholder agreements, and ongoing corporate counsel for businesses at every stage." },
  { icon: Scale, title: "Mergers & Acquisitions", desc: "Buy-side and sell-side M&A, due diligence, deal structuring, and post-merger integration support." },
  { icon: Shield, title: "Intellectual Property", desc: "Patent strategy, trademark registration, licensing, and IP portfolio management for technology and creative enterprises." },
  { icon: BookOpen, title: "Commercial Litigation", desc: "Business disputes, contract enforcement, shareholder conflicts, and complex commercial arbitration." },
  { icon: Users, title: "Employment Law", desc: "Employment contracts, executive compensation, non-compete agreements, and workplace compliance programs." },
  { icon: FileText, title: "Tax & Structuring", desc: "Corporate tax planning, transaction structuring, international tax strategy, and regulatory compliance." },
];

const attorneys = [
  {
    name: "Édouard Dumont",
    title: "Founding Partner",
    bar: "Paris Bar, 1998",
    education: "Sciences Po Paris, Harvard Law LLM",
    focus: "M&A, Corporate Governance",
    bio: "Édouard founded the firm after 12 years at a Magic Circle firm. He has led over 140 M&A transactions across France, Germany, and the United States, with aggregate deal values exceeding €4.2 billion.",
    matters: "140+ transactions",
    value: "€4.2B+",
    languages: "French, English, German",
  },
  {
    name: "Claire Vernet",
    title: "Partner",
    bar: "Paris Bar, 2004",
    education: "Université Paris I, NYU School of Law LLM",
    focus: "Intellectual Property, Technology",
    bio: "Claire leads the firm's IP and technology practice. She has represented leading French tech companies, media groups, and multinational corporations in patent disputes, licensing negotiations, and technology acquisitions.",
    matters: "80+ IP mandates",
    value: "€800M+",
    languages: "French, English",
  },
  {
    name: "Marc-Antoine Lebrun",
    title: "Partner",
    bar: "Paris Bar, 2007",
    education: "Université Paris II, Columbia Law LLM",
    focus: "Commercial Litigation, Arbitration",
    bio: "Marc-Antoine is one of Paris's leading commercial litigators, with an exceptional record in ICC arbitration and French commercial court proceedings. He handles the firm's most complex adversarial matters.",
    matters: "200+ cases",
    value: "€1.1B+",
    languages: "French, English, Spanish",
  },
];

const caseResults = [
  { value: "€4.2B+", label: "M&A Deal Value Advised" },
  { value: "97%", label: "Favorable Outcomes" },
  { value: "28", label: "Years in Practice" },
  { value: "340+", label: "Corporate Clients" },
];

const testimonials = [
  {
    name: "Jean-Baptiste Moreau",
    title: "CEO, Lumière Technologies",
    rating: 5,
    text: "Dumont & Associates guided us through a complex €220M acquisition in under three months. Their M&A team anticipated every issue before it became a problem. Exceptional.",
    matter: "Cross-border Acquisition",
  },
  {
    name: "Sophie Andreani",
    title: "General Counsel, Meridian Group",
    rating: 5,
    text: "Claire Vernet's IP work for us has been transformative. She rebuilt our entire patent strategy, negotiated three major licensing deals, and helped us avoid a catastrophic dispute. Outstanding.",
    matter: "IP Strategy & Licensing",
  },
  {
    name: "François-Xavier Blanchard",
    title: "Founder, Atelier Capital",
    rating: 5,
    text: "When we needed litigation counsel in an urgent shareholder dispute, Marc-Antoine had a strategy within 48 hours. We prevailed completely. I trust this firm with everything.",
    matter: "Shareholder Litigation",
  },
];

const consultationTiers = [
  {
    name: "Initial Consultation",
    price: "Free",
    duration: "45 min",
    desc: "A complimentary introductory meeting to understand your matter and assess how we can assist you.",
    includes: ["Matter overview", "Team introduction", "Preliminary assessment", "Fee structure discussion"],
    cta: "Schedule Free Meeting",
    featured: false,
  },
  {
    name: "Standard Mandate",
    price: "€450/hr",
    duration: "Hourly",
    desc: "Full legal counsel on defined matters — corporate, IP, employment, litigation, and advisory work.",
    includes: ["Dedicated partner", "Associate support team", "Document review", "Regular reporting", "Strategic advice"],
    cta: "Engage Counsel",
    featured: false,
  },
  {
    name: "General Counsel Retainer",
    price: "€8,500/mo",
    duration: "Monthly",
    desc: "Embedded legal partnership for businesses that need ongoing sophisticated counsel without building an in-house team.",
    includes: ["Unlimited consultations", "Designated partner", "Proactive legal review", "Contract review SLA 48h", "Board-level advisory", "Priority access"],
    cta: "Start Retainer",
    featured: true,
  },
];

const faqs = [
  {
    q: "Is our conversation confidential from the first contact?",
    a: "Yes. Attorney-client privilege attaches from your first substantive communication with our firm, even prior to a formal engagement. Everything you share is fully protected.",
  },
  {
    q: "How are your fees structured?",
    a: "We offer hourly billing, fixed fees for defined projects, and monthly retainer arrangements. We provide transparent fee estimates before beginning any matter and invoice monthly with detailed breakdowns.",
  },
  {
    q: "Do you represent individuals or only corporations?",
    a: "Our primary focus is business law — corporations, private equity, founders, and executive-level individuals on commercial matters. We do not practice criminal law or family law.",
  },
  {
    q: "What is your typical response time?",
    a: "We commit to responding to all client communications within 24 business hours. Retainer clients have direct mobile access to their partner and can expect same-day responses for urgent matters.",
  },
  {
    q: "Do you work on international matters?",
    a: "Yes. We advise on cross-border transactions, international arbitration, and EU regulatory matters. We maintain a network of correspondent firms in 22 countries for local counsel when required.",
  },
  {
    q: "How do I get started?",
    a: "Contact us by phone, email, or the contact form below to schedule a complimentary 45-minute consultation. We will assess your matter, identify the right team, and propose an engagement structure.",
  },
];

function ScaleSVG({ scrollProgress }: { scrollProgress: any }) {
  const rotate = useTransform(scrollProgress, [0, 0.3, 0.6], [0, -6, 4]);
  const springRotate = useSpring(rotate, { stiffness: 60, damping: 20 });

  return (
    <motion.div style={{ rotate: springRotate, transformOrigin: "50% 20%" }}>
      <svg viewBox="0 0 280 320" style={{ width: "100%", maxWidth: 280 }} fill="none">
        {/* Beam */}
        <line x1="140" y1="40" x2="140" y2="240" stroke={C.accent} strokeWidth="2" opacity="0.6" />
        {/* Crossbar */}
        <line x1="40" y1="100" x2="240" y2="100" stroke={C.accent} strokeWidth="2.5" />
        {/* Top orb */}
        <circle cx="140" cy="40" r="10" fill={C.accent} opacity="0.9" />
        {/* Left pan chain */}
        <line x1="60" y1="100" x2="60" y2="150" stroke={C.accent} strokeWidth="1.5" opacity="0.7" strokeDasharray="3 3" />
        <line x1="40" y1="100" x2="80" y2="100" stroke={C.accent} strokeWidth="2" />
        {/* Left pan */}
        <ellipse cx="60" cy="165" rx="38" ry="10" fill="none" stroke={C.accent} strokeWidth="1.5" opacity="0.8" />
        {/* Right pan chain */}
        <line x1="220" y1="100" x2="220" y2="160" stroke={C.accent} strokeWidth="1.5" opacity="0.7" strokeDasharray="3 3" />
        <line x1="200" y1="100" x2="240" y2="100" stroke={C.accent} strokeWidth="2" />
        {/* Right pan — slightly lower to show tilt */}
        <ellipse cx="220" cy="175" rx="38" ry="10" fill="none" stroke={C.accent} strokeWidth="1.5" opacity="0.8" />
        {/* Base */}
        <rect x="120" y="238" width="40" height="8" rx="2" fill={C.accent} opacity="0.6" />
        <rect x="100" y="246" width="80" height="6" rx="2" fill={C.accent} opacity="0.4" />
        {/* Decorative rings */}
        <circle cx="140" cy="100" r="6" fill={C.accent} opacity="0.7" />
      </svg>
    </motion.div>
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
      background: scrolled ? "rgba(10,22,40,0.98)" : C.navy,
      borderBottom: `1px solid ${C.borderDark}`,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <Link href="#" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={18} color={C.accent} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>Dumont & Associates</div>
              <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.slice(0, 4).map((l) => (
            <Link key={l.href} href={l.href}
              style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >{l.label}</Link>
          ))}
          <button onClick={() => document.getElementById("consultation")?.scrollIntoView({behavior:"smooth"})}
            style={{ background: C.accent, color: C.white, padding: "10px 26px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Free Consultation</Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 50%, rgba(184,149,42,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(184,149,42,0.04) 0%, transparent 40%)`, pointerEvents: "none" }} />

      {/* Top gold line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "100px 32px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        {/* Left: headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 600 }}>Corporate & Business Law — Paris</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 700, color: C.white, lineHeight: 1.1, margin: "0 0 28px" }}
          >
            Exceptional<br />
            <span style={{ color: C.accent }}>Counsel</span> for<br />
            Exceptional<br />Businesses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, marginBottom: 48 }}
          >
            Dumont & Associates is a boutique Parisian law firm specialising in corporate law, M&A, IP, and commercial litigation. We partner with founders, boards, and executives who demand the highest standard of legal counsel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16 }}
          >
            <button onClick={() => document.getElementById("consultation")?.scrollIntoView({behavior:"smooth"})}
              style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Free Consultation <ArrowRight size={15} /></Link>
            <button onClick={() => document.getElementById("practice")?.scrollIntoView({behavior:"smooth"})}
              style={{ border: `1px solid rgba(255,255,255,0.2)`, color: "rgba(255,255,255,0.7)", padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >Practice Areas</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ display: "flex", gap: 48, marginTop: 64, paddingTop: 40, borderTop: `1px solid rgba(255,255,255,0.08)` }}
          >
            {caseResults.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Scale SVG */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: 280, opacity: 0.85 }}>
            <ScaleSVG scrollProgress={scrollYProgress} />
          </div>
          <div style={{ marginTop: 32, padding: "24px 32px", border: `1px solid ${C.borderGold}`, background: "rgba(184,149,42,0.06)", textAlign: "center" as const }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, color: C.accent, marginBottom: 6 }}>"Excellence. Discretion. Results."</div>
            <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>28 years in business law</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PracticeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="practice" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>What We Do</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: "0 0 16px", fontWeight: 700 }}>Practice Areas</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 520 }}>We advise on the full spectrum of business and corporate law, from day-one formation through complex litigation and international transactions.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border }}>
          {practiceAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ background: C.bgCard, padding: 40, position: "relative", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bgGold; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bgCard; }}
            >
              <div style={{ width: 48, height: 48, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.borderGold}` }}>
                <area.icon size={22} color={C.accent} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.navy, margin: "0 0 12px", fontWeight: 700 }}>{area.title}</h3>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{area.desc}</p>
              <div style={{ position: "absolute", bottom: 28, right: 28 }}>
                <ChevronRight size={16} color={C.accent} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttorneysSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="attorneys" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Our Team</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>The Partners</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>Three partners. Combined track record exceeding €6 billion in advised transactions and 500+ cases.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {attorneys.map((atty, i) => (
            <motion.div
              key={atty.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.18 }}
              style={{ background: C.navyLight, padding: 40, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ width: 72, height: 72, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: C.accent, fontWeight: 700 }}>{atty.name.charAt(0)}</span>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 4px", fontWeight: 700 }}>{atty.name}</h3>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", letterSpacing: "0.06em" }}>{atty.title}</p>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>{atty.focus}</p>

              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 28 }}>{atty.bio}</p>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 20 }}>
                {[
                  { label: "Admitted", val: atty.bar },
                  { label: "Education", val: atty.education },
                  { label: "Languages", val: atty.languages },
                  { label: "Track Record", val: atty.matters },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.accent, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{item.val}</span>
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

function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" ref={ref} style={{ background: C.bg, padding: "80px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: C.navy, padding: "64px 80px", display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64, alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{ width: 3, height: 60, background: C.accent, marginBottom: 24 }} />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, margin: 0, fontWeight: 700 }}>Results That Matter</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}
          >
            {caseResults.map((s) => (
              <div key={s.label} style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bg, padding: "80px 32px 120px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Client Testimonials</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: C.navy, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{t.name}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textMuted, margin: "0 0 8px" }}>{t.title}</p>
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderGold}`, padding: "3px 8px" }}>{t.matter}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="consultation" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Engage Our Firm</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>Fee Structures</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>Transparent pricing. No hidden fees. Full clarity before we begin.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {consultationTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: tier.featured ? C.accent : C.navyLight, padding: 48, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px" }}>Recommended</div>
              )}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.accent, letterSpacing: "0.14em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 10px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: tier.featured ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 32, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Check size={14} color={tier.featured ? C.white : C.accent} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                style={{ display: "block", textAlign: "center" as const, background: tier.featured ? C.white : "transparent", color: tier.featured ? C.accent : C.white, border: tier.featured ? "none" : `1px solid rgba(255,255,255,0.2)`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700 }}
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
    <section id="faq" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Frequently Asked</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.navy, margin: 0, fontWeight: 700 }}>Common Questions</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: C.navy, fontWeight: 600 }}>{faq.q}</span>
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
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, paddingBottom: 26, margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.borderDark}`, padding: "80px 32px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scale size={18} color={C.accent} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.white }}>Dumont & Associates</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Boutique law firm specialising in corporate, M&A, IP, and commercial litigation. Paris, France.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={C.accent} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>contact@dumont-avocats.fr</span>
            </div>
          </div>

          {[
            { title: "Practice", links: ["Corporate Law", "M&A", "Intellectual Property", "Litigation", "Employment", "Tax"] },
            { title: "Firm", links: ["About Us", "Partners", "Careers", "Publications", "Press"] },
            { title: "Contact", links: ["Schedule Consultation", "Client Portal", "Privacy Policy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <Link href="#"
                      style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            {[
              { Icon: MapPin, text: "12 Avenue Montaigne, Paris 8e" },
              { Icon: Phone, text: "+33 1 47 23 00 00" },
              { Icon: Clock, text: "Mon–Fri, 9h–19h" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={13} color={C.accent} />
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 Dumont & Associates. All rights reserved. Paris Bar Association.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LawFirmTemplate() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <PracticeSection />
      <AttorneysSection />
      <ResultsSection />
      <TestimonialsSection />
      <ConsultationSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
