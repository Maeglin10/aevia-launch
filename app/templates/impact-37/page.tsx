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
  Mail,
  Clock,
  Calendar,
  MessageSquare,
  Link2,
  Camera,
  Bookmark,
  Users2,
  Wine,
  Grape,
  Globe,
  Award,
} from "lucide-react";

const C = {
  bg: "#fdf6ec",
  bgAlt: "#f9efe0",
  text: "#2d1a0e",
  textMuted: "#7a5c40",
  burgundy: "#4a0e2e",
  burgundyDark: "#35091f",
  burgundyLight: "#6b1a45",
  gold: "#c9a84c",
  goldLight: "#f5e9c6",
  rose: "#e8a5b0",
  roseLight: "#fdf0f2",
  cream: "#fdf6ec",
  border: "#e8d4b8",
  white: "#ffffff",
};

const WINE_REGIONS = [
  {
    region: "Bordeaux",
    flag: "FR",
    description: "Left Bank Cabernet-forward blends with profound structure and cellaring potential.",
    selections: [
      { name: "Chateau Margaux 2018", grape: "Cab. Sauvignon", price: "42", glass: true },
      { name: "Pomerol Petite Reserve", grape: "Merlot", price: "28", glass: true },
      { name: "Saint-Emilion Grand Cru", grape: "Merlot Blend", price: "22", glass: true },
    ],
  },
  {
    region: "Burgundy",
    flag: "FR",
    description: "Pinot Noir and Chardonnay from the Cote d'Or — the spiritual heart of French wine.",
    selections: [
      { name: "Gevrey-Chambertin 1er Cru", grape: "Pinot Noir", price: "38", glass: true },
      { name: "Meursault Blanc", grape: "Chardonnay", price: "26", glass: true },
      { name: "Pommard Villages", grape: "Pinot Noir", price: "19", glass: true },
    ],
  },
  {
    region: "Tuscany",
    flag: "IT",
    description: "Sangiovese-based wines from Chianti Classico and Brunello — earthy, bold, expressive.",
    selections: [
      { name: "Brunello di Montalcino", grape: "Sangiovese", price: "48", glass: true },
      { name: "Chianti Classico Riserva", grape: "Sangiovese", price: "24", glass: true },
      { name: "Bolgheri Sassicaia 2019", grape: "Cab. Blend", price: "55", glass: true },
    ],
  },
  {
    region: "Rioja & Natural",
    flag: "ES",
    description: "Tempranillo from Spain's Rioja alongside our curated natural wine selection.",
    selections: [
      { name: "La Rioja Alta Gran Reserva", grape: "Tempranillo", price: "32", glass: true },
      { name: "Envinate Migan", grape: "Listan Negro", price: "18", glass: true },
      { name: "Gut Oggau Josephine", grape: "Natural Blend", price: "22", glass: true },
    ],
  },
];

const EVENTS = [
  {
    date: "15 Jun",
    title: "Bordeaux Grands Crus Evening",
    desc: "6 wines including two 2016 first growths, guided by Maison Bourgeois.",
    spots: 14,
    price: "145",
    sold: false,
  },
  {
    date: "22 Jun",
    title: "Natural Wine Discovery Night",
    desc: "Low-intervention wines from small producers in France, Spain, and Georgia.",
    spots: 0,
    price: "85",
    sold: true,
  },
  {
    date: "6 Jul",
    title: "Champagne & Food Pairing",
    desc: "Grower Champagnes paired with fine fromage and charcuterie by Chef Dupont.",
    spots: 8,
    price: "120",
    sold: false,
  },
  {
    date: "20 Jul",
    title: "Burgundy Masterclass",
    desc: "Vertical tasting of Gevrey-Chambertin across three vintages with Marie-Helene Fabre MW.",
    spots: 12,
    price: "180",
    sold: false,
  },
];

const MEMBERSHIP_TIERS = [
  {
    name: "Cave",
    price: "89",
    period: "per month",
    tagline: "For the curious",
    features: [
      "2 complimentary glasses/month",
      "10% off all bottles & events",
      "Monthly tasting notes newsletter",
      "Early access to events",
      "Member welcome kit",
    ],
    highlight: false,
    color: C.gold,
  },
  {
    name: "Sommelier",
    price: "189",
    period: "per month",
    tagline: "For the devoted",
    features: [
      "1 curated bottle/month to keep",
      "4 complimentary glasses/month",
      "15% off all purchases",
      "Priority event reservation",
      "Quarterly sommelier consultation",
      "Cellar storage (12 bottles)",
      "Birthday bottle gift",
    ],
    highlight: true,
    color: C.burgundy,
  },
  {
    name: "Grand Cru",
    price: "390",
    period: "per month",
    tagline: "For the connoisseur",
    features: [
      "3 curated prestige bottles/month",
      "Unlimited complimentary pours",
      "Private dining reservation priority",
      "Annual en primeur allocation",
      "Dedicated sommelier on-call",
      "Unlimited cellar storage",
      "Exclusive members-only events",
      "Airport lounge wine gift kit",
    ],
    highlight: false,
    color: C.gold,
  },
];

const TESTIMONIALS = [
  {
    name: "Helene Beaumont",
    role: "Grand Cru Member",
    avatar: "HB",
    text: "Clos du Soir is where I celebrate everything that matters. The sommelier team's knowledge and warmth make every visit feel like coming home — only with better wine.",
    rating: 5,
  },
  {
    name: "Antoine Mercier",
    role: "Cave Member",
    avatar: "AM",
    text: "I joined knowing nothing about wine. Twelve months later I'm cellaring bottles with confidence. The education is embedded in every experience here.",
    rating: 5,
  },
  {
    name: "Isabella Conti",
    role: "Sommelier Member",
    avatar: "IC",
    text: "The monthly bottle curation is extraordinary. They sourced a Barolo I'd been searching for three years — delivered to my home with handwritten tasting notes.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Do I need wine knowledge to visit or join?",
    a: "Absolutely not. Clos du Soir welcomes everyone from curious newcomers to seasoned collectors. Our team adapts to your level — we speak wine, not jargon.",
  },
  {
    q: "Can I purchase bottles to take home?",
    a: "Yes. Our retail cellar carries 280+ references. Members receive 10-15% discount. We offer professional packing for travel and can arrange delivery within France.",
  },
  {
    q: "How does cellar storage work for Sommelier and Grand Cru members?",
    a: "We maintain a climate-controlled cellar at 12-14°C with 70% humidity. Bottles are tracked digitally. You can access or add to your collection any time we're open.",
  },
  {
    q: "Are private events possible?",
    a: "Yes — we host private tastings for groups of 8-40, corporate events, and intimate dinners. Our sommelier team creates bespoke programs. Contact us for availability.",
  },
  {
    q: "What food is served?",
    a: "Our kitchen offers curated cheese and charcuterie boards, seasonal small plates designed to complement the evening's wines, and special menus for tasting events.",
  },
  {
    q: "How do I pause or cancel my membership?",
    a: "Memberships can be paused once per year for up to 2 months. Cancellation requires 30 days notice. We process everything seamlessly — no penalties.",
  },
];

// Wine bottle SVG with scroll-driven fill
function WineBottleSVG({ fillProgress }: { fillProgress: any }) {
  const fillY = useTransform(fillProgress, [0, 1], ["100%", "0%"]);

  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 320,
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 80 220"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* Clip path for bottle shape */}
        <defs>
          <clipPath id="bottleClip">
            <path d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z" />
          </clipPath>
        </defs>

        {/* Bottle outline */}
        <path
          d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Bottle neck cork */}
        <rect x="30" y="4" width="20" height="10" rx="3" fill={C.gold} opacity="0.7" />

        {/* Animated fill */}
        <motion.rect
          x="0"
          width="80"
          height="220"
          fill={`${C.burgundy}cc`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

        {/* Wine shimmer */}
        <motion.rect
          x="0"
          width="80"
          height="4"
          fill={`${C.rose}80`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

        {/* Label area */}
        <rect
          x="20"
          y="110"
          width="40"
          height="55"
          rx="4"
          fill={C.goldLight}
          opacity="0.9"
        />
        <text
          x="40"
          y="132"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill={C.burgundy}
          fontFamily="'Cormorant Garamond', Georgia, serif"
        >
          CLOS
        </text>
        <text
          x="40"
          y="144"
          textAnchor="middle"
          fontSize="5"
          fill={C.textMuted}
          fontFamily="Georgia, serif"
        >
          DU SOIR
        </text>
        <line
          x1="24"
          y1="150"
          x2="56"
          y2="150"
          stroke={C.gold}
          strokeWidth="0.5"
        />
        <text
          x="40"
          y="160"
          textAnchor="middle"
          fontSize="5"
          fill={C.textMuted}
          fontFamily="Georgia, serif"
        >
          PARIS
        </text>
      </svg>
    </div>
  );
}

function FAQItem({
  faq,
  delay,
}: {
  faq: { q: string; a: string };
  delay: number;
}) {
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
          border: `1px solid ${open ? C.gold : C.border}`,
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
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: 17,
              color: C.burgundy,
            }}
          >
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <ChevronDown size={18} color={C.gold} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 14,
              fontFamily: "'Lato', system-ui",
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
  );
}

function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
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

export default function ClosDuSoirPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const wineBottleFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: "'Lato', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      {/* NAVBAR — transparent over dark hero */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "transparent",
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: 26,
                color: C.gold,
                letterSpacing: "0.04em",
              }}
            >
              Clos du Soir
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
            }}
          >
            {["La Carte", "Experiences", "Membership", "Reservations"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  style={{
                    fontFamily: "'Lato', system-ui",
                    fontSize: 14,
                    fontWeight: 400,
                    color: C.goldLight,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item}
                </a>
              )
            )}
          </div>

          <a
            href="#reservation"
            style={{
              marginLeft: 32,
              background: "transparent",
              color: C.gold,
              padding: "10px 24px",
              borderRadius: 2,
              fontFamily: "'Lato', system-ui",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
              border: `1px solid ${C.gold}`,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Reserve
          </a>
        </div>
      </nav>

      {/* HERO — dark full-bleed */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: C.burgundyDark,
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${C.gold}08 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Rose glow bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "10%",
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${C.burgundyLight}40 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Gold glow right */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${C.gold}15 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 5% 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: Text */}
            <motion.div style={{ y: heroTextY, opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 28,
                }}
              >
                Paris 1er Arrondissement
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15 }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(48px, 6vw, 86px)",
                  fontWeight: 700,
                  color: C.cream,
                  lineHeight: 1.05,
                  marginBottom: 28,
                }}
              >
                Where the evening
                <br />
                <span style={{ color: C.gold, fontStyle: "italic" }}>
                  reveals itself
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  fontSize: 17,
                  color: "#c4a882",
                  lineHeight: 1.85,
                  marginBottom: 44,
                  maxWidth: 440,
                  fontWeight: 300,
                }}
              >
                A curated wine bar and sommelier experience in the heart of Paris. Intimate evenings, rare bottles, and the stories they carry.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <a
                  href="#lacarte"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.gold,
                    color: C.burgundyDark,
                    padding: "16px 32px",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore the Wine List
                </a>
                <a
                  href="#membership"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: C.gold,
                    padding: "16px 32px",
                    borderRadius: 2,
                    fontWeight: 400,
                    fontSize: 13,
                    textDecoration: "none",
                    border: `1px solid ${C.gold}60`,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Membership
                </a>
              </motion.div>
            </motion.div>

            {/* Right: Wine bottle with scroll-fill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <WineBottleSVG fillProgress={wineBottleFill} />
              <p
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  fontSize: 12,
                  color: C.gold,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                Scroll to fill
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WINE LIST BY REGION */}
      <section
        id="lacarte"
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                La Carte des Vins
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 16,
                }}
              >
                Curated from the world's finest regions
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Our 280-reference cellar is personally curated by Head Sommelier Claire Vidal MW. Updated seasonally with small-production gems.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
            }}
          >
            {WINE_REGIONS.map((region, i) => (
              <SectionReveal key={region.region} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Globe size={16} color={C.gold} />
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.burgundy,
                      }}
                    >
                      {region.region}
                    </span>
                    <span
                      style={{
                        background: C.goldLight,
                        color: C.gold,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {region.flag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    {region.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {region.selections.map((wine, j) => (
                      <div
                        key={wine.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom:
                            j < region.selections.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontSize: 15,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {wine.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.textMuted,
                              marginTop: 2,
                              fontStyle: "italic",
                            }}
                          >
                            {wine.grape}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontSize: 18,
                              fontWeight: 700,
                              color: C.burgundy,
                            }}
                          >
                            {wine.price}
                          </div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>
                            EUR / glass
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE — Sommelier story */}
      <section
        style={{ padding: "100px 5%", background: C.burgundy }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <SectionReveal>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 20,
                  }}
                >
                  L'Experience
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 700,
                    color: C.cream,
                    lineHeight: 1.15,
                    marginBottom: 24,
                  }}
                >
                  Guided by Claire Vidal,{" "}
                  <span style={{ fontStyle: "italic", color: C.rose }}>
                    Master of Wine
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: "#c4a882",
                    lineHeight: 1.9,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  Claire spent a decade as a buyer for a Michelin three-star in Lyon before dedicating herself to a single vision: a wine bar where the story of every bottle is told with care.
                </p>
                <p
                  style={{
                    fontSize: 16,
                    color: "#c4a882",
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  Each evening at Clos du Soir, she or one of her carefully trained team guides guests through the language of terroir, vintage, and winemaker intention — making every glass a conversation.
                </p>
                <div
                  style={{
                    marginTop: 36,
                    display: "flex",
                    gap: 40,
                  }}
                >
                  {[
                    { value: "280+", label: "References in cellar" },
                    { value: "12", label: "Years as MW" },
                    { value: "40+", label: "Producer relationships" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 32,
                          fontWeight: 700,
                          color: C.gold,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#c4a882",
                          marginTop: 4,
                          fontWeight: 300,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  padding: 36,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 24,
                  }}
                >
                  An Evening at Clos du Soir
                </div>
                {[
                  {
                    time: "19:00",
                    desc: "Arrival — complimentary amuse-bouche and first pour selected by the sommelier",
                  },
                  {
                    time: "19:30",
                    desc: "La Carte exploration with tableside guidance from our team",
                  },
                  {
                    time: "20:30",
                    desc: "Optional tasting flight — 3 wines from a single region with tasting notes",
                  },
                  {
                    time: "21:30",
                    desc: "The cave moment — browse our retail cellar with 15% member discount",
                  },
                  {
                    time: "22:30",
                    desc: "Last service — closing glass and sommelier recommendation for home",
                  },
                ].map((step, i) => (
                  <div
                    key={step.time}
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                      paddingBottom: 20,
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.gold,
                        flexShrink: 0,
                        width: 44,
                      }}
                    >
                      {step.time}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#c4a882",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* TASTING EVENTS */}
      <section
        id="experiences"
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 14,
                }}
              >
                Upcoming Tasting Events
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: C.textMuted,
                  maxWidth: 440,
                  margin: "0 auto",
                  fontWeight: 300,
                }}
              >
                Intimate evenings curated for curiosity. Members receive priority booking.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {EVENTS.map((ev, i) => (
              <SectionReveal key={ev.title} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 28,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    opacity: ev.sold ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: ev.sold ? C.border : C.goldLight,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: ev.sold ? C.textMuted : C.burgundy,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                        }}
                      >
                        {ev.title}
                      </h3>
                      {ev.sold && (
                        <span
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 2,
                            textTransform: "uppercase",
                          }}
                        >
                          Full
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.textMuted,
                        lineHeight: 1.65,
                        marginBottom: 14,
                        fontWeight: 300,
                      }}
                    >
                      {ev.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', Georgia, serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.burgundy,
                          }}
                        >
                          {ev.price} EUR
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: ev.spots === 0 ? "#dc2626" : C.gold,
                            fontWeight: 600,
                          }}
                        >
                          {ev.spots === 0
                            ? "No spots left"
                            : `${ev.spots} spots left`}
                        </span>
                      </div>
                      {!ev.sold && (
                        <a
                          href="#contact"
                          style={{
                            background: C.burgundy,
                            color: C.cream,
                            padding: "8px 18px",
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: "none",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Reserve
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                What our members say
              </h2>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={C.gold}
                        color={C.gold}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                      fontSize: 16,
                      color: C.text,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: C.goldLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.burgundy,
                        flexShrink: 0,
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.burgundy,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: C.textMuted }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section
        id="membership"
        style={{ padding: "100px 5%", background: C.burgundyDark }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                Adhésion
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.cream,
                  marginBottom: 16,
                }}
              >
                Become a member
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#c4a882",
                  maxWidth: 440,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Membership unlocks privileges, curated bottles, and a community of like-minded enthusiasts.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {MEMBERSHIP_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.12}>
                <div
                  style={{
                    background: tier.highlight
                      ? C.burgundy
                      : "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    padding: 36,
                    border: tier.highlight
                      ? `2px solid ${C.gold}`
                      : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: C.gold,
                        color: C.burgundyDark,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Most Popular
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: tier.color,
                      marginBottom: 6,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#c4a882",
                      fontStyle: "italic",
                      marginBottom: 20,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tier.tagline}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <span
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontSize: 44,
                        fontWeight: 700,
                        color: C.cream,
                      }}
                    >
                      {tier.price}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#c4a882",
                        marginLeft: 4,
                      }}
                    >
                      EUR/{tier.period}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 28,
                    }}
                  >
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <Check
                          size={14}
                          color={C.gold}
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "#c4a882",
                            lineHeight: 1.5,
                            fontWeight: 300,
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: tier.highlight ? C.gold : "transparent",
                      color: tier.highlight ? C.burgundyDark : C.gold,
                      padding: "14px 24px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: "none",
                      border: tier.highlight ? "none" : `1px solid ${C.gold}60`,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Join {tier.name}
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
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                Questions frequentes
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
      <footer
        style={{ background: C.burgundyDark, padding: "80px 5% 40px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 60,
              marginBottom: 60,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: C.gold,
                  marginBottom: 16,
                  letterSpacing: "0.04em",
                }}
              >
                Clos du Soir
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#7a5c40",
                  lineHeight: 1.75,
                  maxWidth: 260,
                  fontWeight: 300,
                }}
              >
                A curated wine bar in Paris. Open Tuesday through Sunday from 18h30 to 23h30.
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 12,
                }}
              >
                {[MessageSquare, Camera, Link2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={15} color="#7a5c40" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "La Carte",
                links: [
                  "Vins au Verre",
                  "Bouteilles",
                  "Vins Naturels",
                  "Accord Fromages",
                  "Evenements",
                ],
              },
              {
                title: "Membership",
                links: [
                  "Cave",
                  "Sommelier",
                  "Grand Cru",
                  "Private Events",
                  "Corporate Gifts",
                ],
              },
              {
                title: "Nous Trouver",
                links: [
                  "contact@closdusoir.fr",
                  "+33 1 42 60 80 20",
                  "18 Rue Saint-Honore",
                  "75001 Paris",
                  "Mar-Dim: 18h30-23h30",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.gold,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  {col.title}
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        fontSize: 13,
                        color: "#7a5c40",
                        textDecoration: "none",
                        fontWeight: 300,
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 13,
                color: "#4a3020",
                fontStyle: "italic",
              }}
            >
              2025 Clos du Soir. L'abus d'alcool est dangereux pour la sante.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions legales", "Confidentialite"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: 12,
                    color: "#4a3020",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
