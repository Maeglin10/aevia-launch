"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  Shield,
  Clock,
  Package,
  Truck,
  Home,
  Building2,
  Calendar,
  Users,
  MessageSquare,
  Link2,
  Users2,
  Camera,
  Bookmark,
  Code2,
  Zap,
  CheckCircle,
  BarChart2,
} from "lucide-react";

const C = {
  bg: "#ffffff",
  bgAlt: "#f1f5f9",
  text: "#1e3a5f",
  textMuted: "#64748b",
  orange: "#ea580c",
  orangeLight: "#fff7ed",
  orangeDark: "#c2410c",
  navy: "#1e3a5f",
  navyLight: "#2d5282",
  white: "#ffffff",
  border: "#e2e8f0",
  borderLight: "#f8fafc",
};

const SERVICES = [
  {
    icon: Home,
    name: "Local Moving",
    tagline: "In your city",
    desc: "Same-day and scheduled moves within 50 miles. Our local teams know every neighborhood and building regulation.",
    features: ["Trained 2-person crews", "Padded blankets & dollies", "Floor protection included", "Furniture disassembly/reassembly"],
    from: "299",
  },
  {
    icon: Truck,
    name: "Long Distance",
    tagline: "Cross-country",
    desc: "State-to-state and nationwide moves with GPS-tracked vehicles, guaranteed delivery windows, and full insurance.",
    features: ["GPS tracking en route", "Guaranteed delivery date", "Full value protection", "Climate-sensitive handling"],
    from: "1,299",
  },
  {
    icon: Building2,
    name: "Commercial Moving",
    tagline: "Business relocations",
    desc: "Office, retail, and warehouse moves planned and executed to minimize downtime. Weekend and overnight available.",
    features: ["Dedicated project manager", "IT equipment specialists", "Weekend/overnight moves", "Detailed asset tracking"],
    from: "999",
  },
  {
    icon: Package,
    name: "Storage Solutions",
    tagline: "Secure & accessible",
    desc: "Climate-controlled storage units from 25 to 1,500 sq ft. Month-to-month, no long-term commitment required.",
    features: ["Climate controlled", "24/7 CCTV monitoring", "Digital access logs", "Free first month included"],
    from: "79",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Get a Quote",
    desc: "Tell us your move details online or call. Receive a binding estimate within 2 hours — no surprise charges.",
  },
  {
    step: "02",
    title: "Book Your Date",
    desc: "Choose your preferred move date. We confirm your crew and truck assignment 48 hours in advance.",
  },
  {
    step: "03",
    title: "We Pack & Load",
    desc: "Our trained crew arrives on time, packs carefully, and loads with precision. Every item is documented.",
  },
  {
    step: "04",
    title: "Delivered & Settled",
    desc: "We deliver, unload, and place items exactly where you want them. We don't leave until you're satisfied.",
  },
];

const STATS = [
  { value: "18,400+", label: "Successful Moves" },
  { value: "47", label: "Cities Covered" },
  { value: "4.9", label: "Average Rating" },
  { value: "12", label: "Years in Business" },
];

const PRICING_CARDS = [
  {
    name: "Studio / 1-Bed",
    price: "299",
    suffix: "from",
    period: "local move",
    features: [
      "2-person crew",
      "Up to 4 hours",
      "Truck included",
      "Basic protection plan",
      "Floor runners",
    ],
    highlight: false,
  },
  {
    name: "2-3 Bedroom",
    price: "549",
    suffix: "from",
    period: "local move",
    features: [
      "3-person crew",
      "Up to 7 hours",
      "Large truck included",
      "Full protection plan",
      "Furniture disassembly",
      "Floor & wall protection",
      "Wardrobe boxes (3)",
    ],
    highlight: true,
  },
  {
    name: "4+ Bedroom",
    price: "899",
    suffix: "from",
    period: "local move",
    features: [
      "4-person crew",
      "Full-day move",
      "26ft truck included",
      "Premium protection",
      "Full packing service",
      "White-glove handling",
      "Dedicated coordinator",
      "Complimentary storage (30 days)",
    ],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Rachel Torres",
    role: "Homeowner, Chicago",
    avatar: "RT",
    rating: 5,
    text: "Swift Move handled our 4-bedroom house move in 6 hours flat. Zero damage, incredibly professional crew. I've used 4 movers over the years — Swift is the only call I'll make going forward.",
  },
  {
    name: "David Park",
    role: "Operations Director, NovaCo",
    avatar: "DP",
    rating: 5,
    text: "They moved our entire 80-person office over a weekend. Monday morning, everything was set up and labeled correctly. Zero operational disruption. Genuinely impressive execution.",
  },
  {
    name: "Monica Alves",
    role: "Renter, Austin TX",
    avatar: "MA",
    rating: 5,
    text: "I was moving cross-country solo and nervous about entrusting my belongings. Swift gave me GPS updates throughout and delivered 2 days early. Couldn't ask for more.",
  },
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "For local moves, 1-2 weeks is ideal. For long-distance or commercial moves, 3-4 weeks. We can sometimes accommodate last-minute local moves with 48-72 hours notice depending on availability.",
  },
  {
    q: "Is my furniture insured during the move?",
    a: "All moves include basic Released Value Protection at no charge (60 cents per pound per article). We strongly recommend upgrading to Full Value Protection, which covers repair or replacement at current market value. Ask your coordinator for pricing.",
  },
  {
    q: "Do you provide packing materials?",
    a: "Yes. We sell boxes, tape, bubble wrap, and specialty materials at cost. Full and partial packing services are also available. Wardrobe boxes and TV boxes are included on 2-3BR and larger packages.",
  },
  {
    q: "What items can't you move?",
    a: "Hazardous materials (paint, gasoline, propane), plants (cross-state), and animals. We recommend moving jewelry, cash, and important documents personally. Our team will advise you during the estimate.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 7 days before your move date. 3-7 days notice: 10% cancellation fee. Less than 72 hours: 25% fee. We understand plans change — contact us as early as possible.",
  },
  {
    q: "Do you offer storage if my new place isn't ready?",
    a: "Yes — we can store your belongings in our secure, climate-controlled facility. The first 30 days are complimentary for 4-bedroom+ local moves. Monthly rates start at 79 USD/month for a standard unit.",
  },
];

// Animated truck SVG
function TruckSVG({ truckX }: { truckX: any }) {
  return (
    <motion.div
      style={{
        x: truckX,
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <svg viewBox="0 0 200 80" style={{ width: 220, height: 88 }}>
        {/* Truck body */}
        <rect x="60" y="10" width="130" height="50" rx="4" fill={C.orange} />
        {/* Cab */}
        <rect x="10" y="20" width="55" height="40" rx="4" fill={C.orangeDark} />
        {/* Windshield */}
        <rect x="15" y="24" width="42" height="22" rx="2" fill="#93c5fd" opacity="0.7" />
        {/* Wheels */}
        <circle cx="35" cy="62" r="12" fill={C.navy} />
        <circle cx="35" cy="62" r="6" fill="#94a3b8" />
        <circle cx="155" cy="62" r="12" fill={C.navy} />
        <circle cx="155" cy="62" r="6" fill="#94a3b8" />
        <circle cx="135" cy="62" r="12" fill={C.navy} />
        <circle cx="135" cy="62" r="6" fill="#94a3b8" />
        {/* Road line */}
        <line x1="0" y1="74" x2="200" y2="74" stroke={C.border} strokeWidth="2" />
        {/* Swift Move text */}
        <text x="125" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="'Manrope', system-ui">
          SWIFT MOVE
        </text>
      </svg>
    </motion.div>
  );
}

// Step timeline
function StepTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Timeline line */}
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 2, background: C.border }} />
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{ position: "absolute", top: 28, left: 0, height: 2, background: C.orange }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }}
            style={{ textAlign: "center", padding: "0 16px" }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1, fontFamily: "'Manrope', system-ui", fontWeight: 800, fontSize: 16, color: C.white }}>
              {step.step}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ background: C.bg, border: `1px solid ${open ? C.orange : C.border}`, borderRadius: 12, padding: "20px 24px", cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>
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
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay }} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Manrope', system-ui", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: C.white }}>{stat.value}</div>
      <div style={{ fontSize: 15, color: "#93c5fd", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
    </motion.div>
  );
}

export default function SwiftMovePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const truckX = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", background: C.bg, color: C.text, overflowX: "hidden" }}>
      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={22} color={C.white} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: C.navy }}>Swift Move</span>
          </Link>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Services", "How It Works", "Pricing", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="tel:+18885550100" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: C.navy, textDecoration: "none" }}>
              <Phone size={15} color={C.orange} />
              (888) 555-0100
            </a>
            <a href="#quote" style={{ background: C.orange, color: C.white, padding: "10px 22px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
              Free Quote
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: C.navy, overflow: "hidden", paddingTop: 72 }}>
        {/* Background pattern */}
        <motion.div style={{
          position: "absolute", inset: 0, y: heroY,
          backgroundImage: `linear-gradient(rgba(234,88,12,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />

        {/* Orange glow */}
        <div style={{ position: "absolute", top: "0", right: "-5%", width: 600, height: 600, background: `radial-gradient(circle, ${C.orange}18 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />

        {/* Road at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `${C.navy}cc` }}>
          <div style={{ position: "absolute", top: 16, left: 0, right: 0, height: 2, background: C.border, opacity: 0.2 }} />
          <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", gap: 60, paddingLeft: 80 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 60, height: 4, background: C.orange, opacity: 0.3, borderRadius: 2 }} />
            ))}
          </div>
        </div>

        {/* Animated truck */}
        <TruckSVG truckX={truckX} />

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "60px 5% 140px", width: "100%", opacity: heroOpacity }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Left: Copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 28 }}>
                <Zap size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Rated #1 Moving Company — Chicago, Austin, Denver</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, color: C.white, lineHeight: 1.05, marginBottom: 24 }}>
                Moving made{" "}
                <span style={{ color: C.orange }}>simple</span>,<br />
                done right
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                style={{ fontSize: 18, color: "#93c5fd", lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 400 }}>
                Local and long-distance moving with trained crews, GPS-tracked trucks, and a binding quote. 18,400+ moves completed. Zero surprise charges.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href="#quote" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
                  Get Free Quote <ArrowRight size={18} />
                </a>
                <a href="tel:+18885550100" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                  <Phone size={16} /> Call Now
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 32, marginTop: 52 }}>
                {[
                  { val: "4.9★", label: "Google Rating" },
                  { val: "18K+", label: "Happy Customers" },
                  { val: "100%", label: "Licensed & Insured" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{s.val}</div>
                    <div style={{ fontSize: 13, color: "#93c5fd", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Instant quote card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <div style={{ background: C.white, borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.30)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Get a Free Quote</h3>
                <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Binding estimate in under 2 hours. No obligation.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Moving from", placeholder: "City, State" },
                    { label: "Moving to", placeholder: "City, State" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{field.label}</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                        <MapPin size={16} color={C.orange} />
                        <input placeholder={field.placeholder} style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, width: "100%", fontFamily: "'Manrope', system-ui" }} />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Home Size</label>
                    <select style={{ width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", appearance: "none", cursor: "pointer" }}>
                      <option>Studio / 1-Bedroom</option>
                      <option>2-3 Bedrooms</option>
                      <option>4+ Bedrooms</option>
                      <option>Office / Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Move Date</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                      <Calendar size={16} color={C.orange} />
                      <input type="date" style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", width: "100%" }} />
                    </div>
                  </div>

                  <button style={{ background: C.orange, color: C.white, padding: "16px 24px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Manrope', system-ui" }}>
                    Get My Free Quote <ArrowRight size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
                  <Shield size={14} color={C.textMuted} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>No spam, no obligation. Binding estimate only.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <Truck size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Our Services</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 16 }}>
                Every kind of move, covered
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                From studio apartments to corporate headquarters, we have the experience, equipment, and people for the job.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {SERVICES.map((service, i) => (
              <SectionReveal key={service.name} delay={i * 0.1}>
                <div style={{
                  background: C.bg,
                  borderRadius: 16,
                  padding: 28,
                  border: `1px solid ${C.border}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 16px 48px rgba(234,88,12,0.12)";
                    el.style.borderColor = `${C.orange}50`;
                    el.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "none";
                    el.style.borderColor = C.border;
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ width: 50, height: 50, background: C.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <service.icon size={24} color={C.orange} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                    {service.tagline}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{service.name}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{service.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                    {service.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} color={C.orange} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.text }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>From </span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{service.price}</span>
                    <span style={{ fontSize: 13, color: C.textMuted }}> USD</span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>
                How it works
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
                Four simple steps. Zero surprises. Your belongings, moved with care.
              </p>
            </div>
          </SectionReveal>

          <StepTimeline />
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                <Users2 size={14} color={C.orange} />
                <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Customer Reviews</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>
                18,400+ happy moves
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div style={{ background: C.bgAlt, borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} fill={C.orange} color={C.orange} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: C.orange, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>
                Transparent local move pricing
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
                Binding estimates only. What we quote is what you pay. Long-distance quotes are provided after a virtual walk-through.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {PRICING_CARDS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.12}>
                <div style={{
                  background: plan.highlight ? C.navy : C.white,
                  borderRadius: 16,
                  padding: 32,
                  border: plan.highlight ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: "100%",
                }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: -1, right: 20, background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Most Common
                    </div>
                  )}
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: plan.highlight ? C.white : C.navy, marginBottom: 4 }}>{plan.name}</h3>
                  <div style={{ fontSize: 12, color: plan.highlight ? "#93c5fd" : C.textMuted, marginBottom: 20 }}>{plan.period}</div>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 11, color: plan.highlight ? "#93c5fd" : C.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>{plan.suffix} </span>
                    <span style={{ fontSize: 42, fontWeight: 900, color: plan.highlight ? C.orange : C.navy }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? "#93c5fd" : C.textMuted }}> USD</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.highlight ? `${C.orange}30` : C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={11} color={C.orange} />
                        </div>
                        <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#quote" style={{ display: "block", textAlign: "center", background: plan.highlight ? C.orange : C.orangeLight, color: plan.highlight ? C.white : C.orange, padding: "14px 24px", borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
                    Get Quote
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <div style={{ marginTop: 40, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: Shield, label: "Fully Licensed & Insured" },
                { icon: Clock, label: "On-Time Guarantee" },
                { icon: CheckCircle, label: "Binding Quotes Only" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={16} color={C.orange} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{label}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>
                Moving FAQ
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted }}>
                Still have questions? Call us at (888) 555-0100 — we answer 7 days a week.
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
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck size={22} color={C.white} />
                </div>
                <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>Swift Move</span>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, maxWidth: 260 }}>
                Licensed, insured moving company serving 47 cities. Local and long-distance moves done right the first time.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.07)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#64748b" />
                  </a>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={15} color={C.orange} />
                <a href="tel:+18885550100" style={{ fontSize: 16, fontWeight: 800, color: C.white, textDecoration: "none" }}>
                  (888) 555-0100
                </a>
              </div>
            </div>
            {[
              { title: "Services", links: ["Local Moving", "Long Distance", "Commercial", "Storage", "Packing"] },
              { title: "Company", links: ["About Swift Move", "Careers", "Blog", "Reviews", "Press"] },
              { title: "Service Areas", links: ["Chicago IL", "Austin TX", "Denver CO", "Atlanta GA", "View All Cities"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {col.title}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#334155" }}>2025 Swift Move LLC. Licensed & Insured in all 50 states. USDOT #1234567.</p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Licenses"].map((item) => (
                <a key={item} href="#" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
