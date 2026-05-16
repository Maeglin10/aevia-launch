"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, Leaf, Sun, Snowflake, Wind, Heart,
  Gift, Briefcase, Users, Camera, MessageSquare
} from "lucide-react";

const C = {
  bg: "#fffdf8",
  bgPink: "#fce4ec",
  bgCard: "#ffffff",
  bgSage: "rgba(85,139,47,0.06)",
  text: "#2d1a1f",
  textMuted: "#7a5c62",
  textDim: "#b89ea2",
  accent: "#880e4f",
  accentLight: "rgba(136,14,79,0.1)",
  accentHover: "#6a0b3d",
  sage: "#558b2f",
  sageMid: "#689f38",
  sageLight: "rgba(85,139,47,0.12)",
  blush: "#fce4ec",
  rose: "#f48fb1",
  roseLight: "rgba(244,143,177,0.15)",
  border: "rgba(45,26,31,0.08)",
  borderAccent: "rgba(136,14,79,0.2)",
  borderSage: "rgba(85,139,47,0.2)",
  white: "#ffffff",
};

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Occasions", href: "#occasions" },
  { label: "Workshop", href: "#workshop" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Subscribe", href: "#subscribe" },
  { label: "FAQ", href: "#faq" },
];

const petalPaths = [
  { x: [0, -60, 80, -40], y: [0, 200, 480, 700], rotate: [0, 45, -30, 90], scale: [1, 0.8, 1.1, 0.7] },
  { x: [0, 80, -50, 60], y: [0, 150, 400, 680], rotate: [0, -60, 40, -80], scale: [0.8, 1.1, 0.9, 1.2] },
  { x: [0, -90, 40, -70], y: [0, 250, 500, 720], rotate: [0, 70, -20, 100], scale: [1.1, 0.7, 1, 0.8] },
  { x: [0, 50, -80, 30], y: [0, 180, 420, 660], rotate: [0, -40, 80, -60], scale: [0.9, 1.2, 0.8, 1] },
  { x: [0, -70, 90, -50], y: [0, 220, 460, 700], rotate: [0, 55, -45, 70], scale: [1.2, 0.9, 1.1, 0.8] },
  { x: [0, 100, -30, 80], y: [0, 170, 390, 650], rotate: [0, -80, 30, -100], scale: [0.85, 1, 0.9, 1.15] },
];

const petalColors = [C.accent, C.rose, "#e91e8c", C.sage, "#f06292", C.accent];

function FallingPetal({ index }: { index: number }) {
  const path = petalPaths[index];
  const color = petalColors[index];
  const delay = index * 0.6;
  const startX = 10 + (index / petalPaths.length) * 80;

  return (
    <motion.div
      style={{ position: "absolute", top: "-40px", left: `${startX}%`, pointerEvents: "none", zIndex: 1 }}
      animate={{
        x: path.x,
        y: path.y,
        rotate: path.rotate,
        scale: path.scale,
        opacity: [0, 1, 1, 0.7, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 40 50" style={{ width: 28, height: 34 }} fill={color} opacity={0.7}>
        <path d="M20 2 C28 2, 38 15, 38 28 C38 42, 28 48, 20 48 C12 48, 2 42, 2 28 C2 15, 12 2, 20 2 Z" />
        <path d="M20 8 C20 8, 20 40, 20 48" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
      </svg>
    </motion.div>
  );
}

const seasons = [
  {
    id: "spring",
    label: "Spring",
    icon: Leaf,
    accent: C.sage,
    desc: "Tulips, peonies, ranunculus, and cherry blossom — the season of fresh beginnings.",
    arrangements: [
      { name: "Jardin de Printemps", price: "€65", desc: "Peonies, tulipes, and garden roses in blush and cream." },
      { name: "Blossom Drift", price: "€85", desc: "Cherry blossom stems with delicate sweet peas and freesia." },
      { name: "Green Awakening", price: "€55", desc: "Eucalyptus, ferns, and seasonal greens with white blooms." },
    ],
  },
  {
    id: "summer",
    label: "Summer",
    icon: Sun,
    accent: "#f57f17",
    desc: "Sunflowers, dahlias, lavender, and lush garden roses at their peak.",
    arrangements: [
      { name: "Soleil de Provence", price: "€70", desc: "Sunflowers, lavender, and golden dahlias in warm abundance." },
      { name: "Rose Vif", price: "€95", desc: "Garden roses in deep coral and orange with jasmine vine." },
      { name: "Tropical Luxe", price: "€120", desc: "Birds of paradise, proteas, and tropical foliage statement piece." },
    ],
  },
  {
    id: "fall",
    label: "Autumn",
    icon: Wind,
    accent: "#bf360c",
    desc: "Dahlias, chrysanthemums, dried botanicals, and warm seasonal textures.",
    arrangements: [
      { name: "Automne Doré", price: "€75", desc: "Rust dahlias, orange chrysanthemums, and dried wheat stems." },
      { name: "Dried Luxe", price: "€90", desc: "Pampas, lunaria, preserved botanicals in sculptural composition." },
      { name: "Forest Floor", price: "€60", desc: "Wild mushrooms, moss, pine branches, and seasonal berries." },
    ],
  },
  {
    id: "winter",
    label: "Winter",
    icon: Snowflake,
    accent: "#1565c0",
    desc: "White amaryllis, hellebores, pine, and the deep red of winterberries.",
    arrangements: [
      { name: "Blanc de Noël", price: "€80", desc: "White amaryllis, eucalyptus, and silver-dusted pine branches." },
      { name: "Velvet Crimson", price: "€90", desc: "Deep red roses, winterberry, and dark greenery." },
      { name: "Hiver Minimaliste", price: "€65", desc: "Single-variety hellebore and dried cotton stems in clean lines." },
    ],
  },
];

const occasions = [
  { icon: Heart, title: "Weddings", desc: "Bridal bouquets, ceremony installations, reception centrepieces, and full floral direction from initial brief to last petal on the day.", color: C.accent },
  { icon: Sun, title: "Funerals & Tribute", desc: "Respectful, beautiful arrangements for memorial services. We work directly with families and funeral homes with sensitivity and care.", color: C.textMuted },
  { icon: Gift, title: "Birthdays & Events", desc: "Statement arrangements delivered directly to the door, or a workshop where guests create their own bouquet — memorable both ways.", color: C.sage },
  { icon: Briefcase, title: "Corporate", desc: "Weekly office flowers, event installations for product launches, showrooms, and galas. Invoiced monthly, fully managed.", color: C.accent },
];

const testimonials = [
  {
    name: "Isabelle Fontaine",
    location: "Paris, 7e",
    rating: 5,
    text: "Pétales & Co did our entire wedding — 18 arrangements, 4 arches, bridal party bouquets. Every single piece was more beautiful than I imagined. They understood our vision perfectly.",
    occasion: "Wedding",
  },
  {
    name: "Laurent Brunel",
    location: "Neuilly-sur-Seine",
    rating: 5,
    text: "I have a monthly subscription for my law office lobby. The team selects seasonally and the arrangements always receive comments from clients. It has genuinely changed the feel of the space.",
    occasion: "Corporate",
  },
  {
    name: "Chloé Morin",
    location: "Paris, 16e",
    rating: 5,
    text: "We did the bouquet workshop for my sister's birthday. Eight of us, two hours, incredible instruction and a gorgeous takeaway. The best afternoon we've had together in years.",
    occasion: "Workshop",
  },
  {
    name: "Thomas Aubry",
    location: "Versailles",
    rating: 5,
    text: "Weekly delivery of the seasonal arrangement. I've been a subscriber for 14 months and they have never repeated themselves. Each week is a small surprise.",
    occasion: "Monthly Sub",
  },
];

const subscriptionTiers = [
  {
    name: "Hebdomadaire",
    price: "€48",
    duration: "per week",
    desc: "One artisan bouquet delivered each week. Seasonal selection, curated by our florists.",
    includes: ["Seasonal arrangement", "Free delivery Paris", "Kraft wrapping + ribbon", "Care card"],
    cta: "Subscribe Weekly",
    featured: false,
  },
  {
    name: "Bimensuelle",
    price: "€80",
    duration: "per month",
    desc: "Two bouquets per month — the perfect rhythm for those who love flowers but want flexibility.",
    includes: ["2 seasonal arrangements", "Free delivery Paris", "Choice of style", "Care card + seasonal note"],
    cta: "Subscribe Biweekly",
    featured: true,
  },
  {
    name: "Mensuelle",
    price: "€55",
    duration: "per month",
    desc: "One statement piece per month — larger, more dramatic, a real focal point for your home.",
    includes: ["1 large seasonal piece", "Free delivery Île-de-France", "Statement composition", "Seasonal story card"],
    cta: "Subscribe Monthly",
    featured: false,
  },
];

const faqs = [
  {
    q: "What areas do you deliver to?",
    a: "We deliver within Paris and the Île-de-France region. Paris deliveries are free for all subscriptions. Île-de-France deliveries have a €12 surcharge for one-off orders — free for monthly subscribers.",
  },
  {
    q: "Can I request specific flowers or colours?",
    a: "Absolutely. At checkout or when setting up a subscription, leave your preferences. We'll do our best to honour them subject to seasonal availability. Some flowers are simply unavailable out of season — part of what makes them special.",
  },
  {
    q: "How far in advance should I order for a wedding?",
    a: "We recommend 3–6 months for weddings. Summer dates (June–September) are extremely popular and book out 6+ months ahead. Contact us as early as possible and we'll confirm availability.",
  },
  {
    q: "Do you offer workshops?",
    a: "Yes — we run weekly public workshops at our studio (€65/person, 2 hours, includes materials and takeaway bouquet) and private group bookings for up to 12 people. Email us or book via our website.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Yes. You can pause for up to 4 weeks per year or cancel anytime with one week's notice. No penalties, no questions.",
  },
  {
    q: "Do you do same-day delivery?",
    a: "For in-stock arrangements ordered before 10h, we offer same-day delivery in Paris (€18 express fee). For custom orders or workshop bookings, advance notice is required.",
  },
];

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
      background: scrolled ? "rgba(255,253,248,0.97)" : "transparent",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="#" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                <circle cx="14" cy="14" r="5" fill={C.accent} />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.85" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                ))}
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.accent, letterSpacing: "0.02em" }}>Pétales & Co</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.sage, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>Artisan Florist</div>
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.slice(0, 4).map((l) => (
            <Link key={l.href} href={l.href}
              style={{ color: C.textMuted, fontSize: 13, letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Poppins', system-ui" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >{l.label}</Link>
          ))}
          <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})}
            style={{ background: C.accent, color: C.white, padding: "10px 24px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 600, borderRadius: 2 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Subscribe</Link>
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
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bgPink, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Falling petals */}
      {petalPaths.map((_, i) => (
        <FallingPetal key={i} index={i} />
      ))}

      {/* Soft gradient background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, rgba(244,143,177,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(136,14,79,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%", textAlign: "center" as const }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}
        >
          <Leaf size={14} color={C.sage} />
          <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.sage, fontWeight: 500 }}>Artisan Florist · Paris, France</span>
          <Leaf size={14} color={C.sage} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 700, color: C.accent, lineHeight: 0.95, margin: "0 0 28px" }}
        >
          For Every<br />
          <span style={{ color: C.text }}>Moment.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: "'Poppins', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}
        >
          Hand-crafted seasonal arrangements, botanical bouquet subscriptions, and wedding floral direction from our Parisian studio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}
        >
          <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})}
            style={{ background: C.accent, color: C.white, padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Shop Subscriptions <ArrowRight size={15} /></Link>
          <button onClick={() => document.getElementById("occasions")?.scrollIntoView({behavior:"smooth"})}
            style={{ border: `1.5px solid ${C.borderAccent}`, color: C.accent, padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 600, background: "rgba(255,255,255,0.6)" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.color = C.accent; }}
          >Browse Occasions</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" as const }}
        >
          {[
            { val: "12 ans", label: "d'expérience" },
            { val: "4,000+", label: "arrangements créés" },
            { val: "98%", label: "clients satisfaits" },
            { val: "350+", label: "mariages floraux" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.accent }}>{s.val}</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSeason, setActiveSeason] = useState("spring");
  const active = seasons.find(s => s.id === activeSeason) || seasons[0];

  return (
    <section id="collections" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Seasonal Collections</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>Nature's Calendar</h2>
        </motion.div>

        {/* Season tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 48 }}>
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: activeSeason === s.id ? C.accent : "transparent", color: activeSeason === s.id ? C.white : C.textMuted, border: activeSeason === s.id ? "none" : `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Poppins', system-ui", fontSize: 13, fontWeight: activeSeason === s.id ? 600 : 400, letterSpacing: "0.04em", transition: "all 0.2s" }}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, marginBottom: 40, maxWidth: 560 }}>{active.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {active.arrangements.map((arr, i) => (
                <motion.div
                  key={arr.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "0 0 32px", overflow: "hidden", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.transition = "all 0.2s"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 200, background: `linear-gradient(135deg, ${C.blush}, rgba(244,143,177,0.4))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Camera size={36} color={C.borderAccent} />
                  </div>
                  <div style={{ padding: "0 24px" }}>
                    <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: C.text, margin: "0 0 8px", fontWeight: 700 }}>{arr.name}</h3>
                    <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 16px" }}>{arr.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.accent, fontWeight: 700 }}>{arr.price}</span>
                      <Link href="#" style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>Order <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function OccasionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="occasions" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Occasions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Flowers for Every Chapter</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>From the most joyful celebration to the most tender farewell — we're here for every occasion that matters.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, display: "flex", gap: 24, alignItems: "flex-start", border: `1px solid ${C.border}` }}
            >
              <div style={{ width: 56, height: 56, background: `rgba(136,14,79,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%" }}>
                <occ.icon size={24} color={C.accent} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.text, margin: "0 0 10px", fontWeight: 700 }}>{occ.title}</h3>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: "0 0 20px" }}>{occ.desc}</p>
                <Link href="#" style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="workshop" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ background: `linear-gradient(135deg, ${C.sageLight}, ${C.roseLight})`, height: 480, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.borderSage}` }}
        >
          <div style={{ textAlign: "center" as const, padding: 40 }}>
            <Leaf size={48} color={C.sage} style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.sage, fontStyle: "italic" }}>Our Parisian Studio</p>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.textMuted, marginTop: 8 }}>18 Rue du Marché, Paris 11e</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.sage }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.sage }}>Our Story</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: C.text, margin: "0 0 24px", fontWeight: 700 }}>Made by Hand,<br />With Intention.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 24 }}>Pétales & Co was born from a simple belief: flowers shouldn't be an afterthought. Founded in 2014 by florist Amélie Rousseau, our studio in the 11th arrondissement has become a gathering place for people who care about natural beauty.</p>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 40 }}>We work with small French growers wherever possible, choose seasonal flowers over imported blooms, and make every arrangement by hand — from a single stem to a wedding arch.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            {[
              { val: "€65", label: "Workshop from" },
              { val: "2h", label: "Session length" },
              { val: "12", label: "Max per group" },
              { val: "Weekly", label: "Public sessions" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "20px 24px", background: C.bgPink, border: `1px solid ${C.borderAccent}` }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 24, color: C.accent, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="#"
            style={{ background: C.sage, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.sageMid)}
            onMouseLeave={e => (e.currentTarget.style.background = C.sage)}
          >Book a Workshop <ArrowRight size={15} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bgPink, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Testimonials</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}` }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: C.text, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.text, margin: "0 0 2px", fontWeight: 600 }}>{t.name}</p>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textDim, margin: 0 }}>{t.location}</p>
                </div>
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderAccent}`, padding: "3px 8px" }}>{t.occasion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscribeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="subscribe" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Bouquet Subscriptions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Always Fresh. Never Repeated.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Seasonal bouquets, curated by hand, delivered to your door on schedule. Pause or cancel anytime.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {subscriptionTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: tier.featured ? C.accent : C.bgCard, padding: 40, border: tier.featured ? "none" : `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Poppins', system-ui", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px" }}>Best Value</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 36, color: tier.featured ? C.white : C.accent, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.85)" : C.textMuted, lineHeight: 1.65, marginBottom: 28, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check size={14} color={tier.featured ? C.white : C.sage} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: tier.featured ? "rgba(255,255,255,0.9)" : C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="#"
                style={{ display: "block", textAlign: "center" as const, background: tier.featured ? C.white : C.accent, color: tier.featured ? C.accent : C.white, padding: "14px 24px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700 }}
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
    <section id="faq" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.text, margin: 0, fontWeight: 700 }}>Questions & Answers</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.borderAccent}`, background: openIdx === i ? "rgba(255,255,255,0.6)" : "transparent" }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, color: C.text, fontWeight: 600 }}>{faq.q}</span>
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
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, padding: "0 24px 24px", margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.text, padding: "80px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                <circle cx="14" cy="14" r="5" fill={C.accent} />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.7" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                ))}
              </svg>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white }}>Pétales & Co</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.rose, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Artisan Florist</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Hand-crafted floral arrangements, seasonal subscriptions, and wedding floral direction. Paris, France.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={C.rose} />
              <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>@petalesandco</span>
            </div>
          </div>

          {[
            { title: "Shop", links: ["Spring Collection", "Summer Blooms", "Autumn Harvest", "Winter Whites", "Gift Cards"] },
            { title: "Services", links: ["Weddings", "Corporate", "Workshops", "Subscriptions", "Same-day Delivery"] },
            { title: "Studio", links: ["Our Story", "Press", "FAQ", "Contact", "Visit Us"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.rose, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <Link href="#"
                      style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const }}>
            {[
              { Icon: MapPin, text: "18 Rue du Marché, Paris 11e" },
              { Icon: Phone, text: "+33 1 43 00 00 00" },
              { Icon: Clock, text: "Mar–Sam, 9h–19h" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={13} color={C.rose} />
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 Pétales & Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function FloristTemplate() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <OccasionsSection />
      <WorkshopSection />
      <TestimonialsSection />
      <SubscribeSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
