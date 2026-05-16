"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  Wifi,
  Coffee,
  Printer,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Star,
  Check,
  Zap,
  Monitor,
  Lock,
  Clock,
  MessageSquare,
  Link2,
  Users2,
  Camera,
  Building2,
  Layers,
} from "lucide-react";

const C = {
  bg: "#f8f8f6",
  bgAlt: "#f0f0ec",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#84cc16",
  accentDark: "#65a30d",
  accentLight: "#f0fdf4",
  white: "#ffffff",
  border: "#e2e8f0",
  slate: "#1e293b",
  slateMid: "#334155",
};

const PLANS = [
  {
    name: "Day Pass",
    price: "29",
    period: "per day",
    features: [
      "Hot desk access",
      "High-speed WiFi",
      "Unlimited coffee & tea",
      "Printing (20 pages)",
      "Lounge access",
      "Mail handling",
    ],
    cta: "Book a Day",
    highlight: false,
  },
  {
    name: "Flex Monthly",
    price: "249",
    period: "per month",
    features: [
      "10 days/month hot desk",
      "Dedicated locker",
      "Meeting room credits (4h)",
      "Unlimited beverages",
      "Printing (100 pages)",
      "Business address",
      "Community events",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Dedicated Desk",
    price: "549",
    period: "per month",
    features: [
      "Your own desk 24/7",
      "Ergonomic chair & storage",
      "Meeting room credits (10h)",
      "Unlimited beverages",
      "Unlimited printing",
      "Business address",
      "Priority support",
      "Guest passes (2/month)",
    ],
    cta: "Reserve Desk",
    highlight: false,
  },
  {
    name: "Private Office",
    price: "1,299",
    period: "per month",
    features: [
      "Private lockable office",
      "2-6 seats included",
      "Unlimited meeting rooms",
      "Dedicated phone line",
      "Custom branding options",
      "24/7 secure access",
      "Dedicated account manager",
      "Unlimited everything",
    ],
    cta: "Schedule Tour",
    highlight: false,
  },
];

const AMENITIES = [
  { icon: Wifi, label: "10Gbps Fiber WiFi", desc: "Dual redundant connections with private VLAN options" },
  { icon: Coffee, label: "Premium Beverages", desc: "Specialty coffee bar, teas, sparkling water on tap" },
  { icon: Printer, label: "Print & Scan", desc: "Color laser printers, A3, laminating, binding" },
  { icon: Calendar, label: "Event Space", desc: "280-seat auditorium for launches, meetups, workshops" },
  { icon: Monitor, label: "4K Displays", desc: "Meeting rooms with 75\" screens and wireless casting" },
  { icon: Lock, label: "24/7 Secure Access", desc: "Key fob entry, CCTV, and secure package reception" },
  { icon: Clock, label: "Flexible Hours", desc: "Open around the clock for dedicated members" },
  { icon: Zap, label: "EV Charging", desc: "12 charging bays in the underground parking" },
];

const SPACE_TYPES = [
  {
    name: "Hot Desk",
    icon: "HD",
    tagline: "Maximum flexibility",
    desc: "Grab any available desk in our open workspace. Perfect for freelancers and remote workers who need a productive environment without the commitment.",
    from: 29,
    perDay: true,
  },
  {
    name: "Dedicated Desk",
    icon: "DD",
    tagline: "Your own corner",
    desc: "A permanent desk that's yours to personalize. Leave your monitors, store your files, and arrive ready to work every morning.",
    from: 549,
    perDay: false,
  },
  {
    name: "Private Office",
    icon: "PO",
    tagline: "Team productivity",
    desc: "Fully enclosed offices from 2 to 20 seats. Brand the space as your own, hold confidential meetings, and scale as you grow.",
    from: 1299,
    perDay: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Lea Fontaine",
    role: "Co-Founder, Luminary SaaS",
    avatar: "LF",
    rating: 5,
    text: "We scaled from 2 to 14 people inside Nexus Hub over 18 months. The flexibility to upgrade from hot desks to a private office without moving locations was invaluable.",
  },
  {
    name: "Marcus Chen",
    role: "Independent Strategy Consultant",
    avatar: "MC",
    rating: 5,
    text: "The atmosphere alone is worth the price. I close 40% more deals when I meet clients here versus coffee shops. Nexus signals seriousness.",
  },
  {
    name: "Amara Diallo",
    role: "Head of Growth, FinPath",
    avatar: "AD",
    rating: 5,
    text: "The community here is unlike anything I've experienced. Two partnerships and one investor introduction came directly from connections I made in the lounge.",
  },
];

const FAQS = [
  {
    q: "Can I try Nexus Hub before committing to a plan?",
    a: "Absolutely. Purchase a Day Pass for 29 EUR and experience the full facility. If you join a monthly plan within 7 days, your Day Pass fee is credited toward your first month.",
  },
  {
    q: "What's included in the business address service?",
    a: "You get a prestigious city-centre address for your company registration, mail collection, scanning on request, and package reception. Includes up to 20 items per month.",
  },
  {
    q: "How does meeting room booking work?",
    a: "Members book via our app or reception. Monthly plans include credit hours. Additional hours are 15 EUR/h (small) or 35 EUR/h (boardroom). Rooms can be booked same-day if available.",
  },
  {
    q: "Is parking available?",
    a: "Yes — 60 underground spaces at 8 EUR/day or 150 EUR/month. EV charging bays are included. Secure bicycle storage and showers are available for cyclists.",
  },
  {
    q: "Can I cancel my monthly membership at any time?",
    a: "Flex Monthly plans require 30 days' notice. Dedicated Desks and Private Offices require 60 days. We don't lock you into annual contracts unless you specifically want a discount.",
  },
  {
    q: "Do you host community events?",
    a: "Yes — weekly founder breakfasts, monthly investor panels, tech talks, and wellness sessions are free for all members. We host 80+ events per year.",
  },
];

const STATS = [
  { value: "1,200+", label: "Active Members" },
  { value: "340", label: "Desks Available" },
  { value: "18,500", label: "Square Feet" },
  { value: "4.9", label: "Member Rating" },
];

// Interactive Floor Plan SVG
function FloorPlan() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const zones = [
    { id: "hotdesk", label: "Hot Desk Zone", x: 40, y: 40, w: 180, h: 120, color: C.accent },
    { id: "dedicated", label: "Dedicated Desks", x: 240, y: 40, w: 140, h: 120, color: "#3b82f6" },
    { id: "offices", label: "Private Offices", x: 400, y: 40, w: 120, h: 260, color: "#8b5cf6" },
    { id: "meeting", label: "Meeting Rooms", x: 40, y: 180, w: 180, h: 120, color: "#f59e0b" },
    { id: "lounge", label: "Members Lounge", x: 240, y: 180, w: 140, h: 120, color: "#ec4899" },
    { id: "event", label: "Event Space", x: 40, y: 320, w: 340, h: 80, color: "#14b8a6" },
  ];

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 560 430"
        style={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 16,
          background: C.bgAlt,
          border: `2px solid ${C.border}`,
          display: "block",
        }}
      >
        <rect x="20" y="20" width="520" height="400" rx="8" fill="none" stroke={C.border} strokeWidth="2" />
        {zones.map((z) => (
          <g key={z.id}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx={6}
              fill={hoveredZone === z.id ? z.color : `${z.color}22`}
              stroke={z.color}
              strokeWidth={hoveredZone === z.id ? 2.5 : 1.5}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={() => setHoveredZone(z.id)}
              onMouseLeave={() => setHoveredZone(null)}
            />
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 5}
              textAnchor="middle"
              fill={hoveredZone === z.id ? "#ffffff" : z.color}
              fontSize={11}
              fontWeight="600"
              fontFamily="'Outfit', system-ui"
              style={{ pointerEvents: "none" }}
            >
              {z.label}
            </text>
          </g>
        ))}
      </svg>

      {hoveredZone && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.slate,
            color: C.white,
            padding: "8px 20px",
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {zones.find((z) => z.id === hoveredZone)?.label} — hover to explore
        </div>
      )}
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
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.accent : C.border}`,
          borderRadius: 12,
          padding: "20px 24px",
          cursor: "pointer",
          marginBottom: 8,
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: C.slate }}>{faq.q}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function NexusHubPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div
      style={{
        fontFamily: "'Outfit', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            gap: 40,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: C.accent,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} color={C.white} />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: C.slate,
              }}
            >
              Nexus Hub
            </span>
          </Link>

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
          >
            {["Spaces", "Amenities", "Community", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: C.textMuted,
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <a
            href="#pricing"
            style={{
              background: C.accent,
              color: C.white,
              padding: "10px 24px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Book a Tour
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: C.slate,
          paddingTop: 72,
        }}
      >
        {/* Background dot grid */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroY,
            backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Green glow */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "0%",
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${C.accent}28 0%, transparent 70%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 5%",
            width: "100%",
            opacity: heroOpacity,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: `${C.accent}22`,
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 28,
                }}
              >
                <Zap size={14} color={C.accent} />
                <span
                  style={{
                    color: C.accent,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Now open — Level 3 expansion complete
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: "clamp(40px, 5vw, 66px)",
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                Work where{" "}
                <span style={{ color: C.accent }}>ambition</span>{" "}
                comes alive
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{
                  fontSize: 18,
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >
                18,500 sq ft of premium workspace in the heart of Paris. Hot desks, dedicated offices, event spaces, and a community built for growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <a
                  href="#pricing"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.accent,
                    color: C.white,
                    padding: "16px 32px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 16,
                    textDecoration: "none",
                  }}
                >
                  Day Pass — 29 EUR <ArrowRight size={18} />
                </a>
                <a
                  href="#spaces"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: C.white,
                    padding: "16px 32px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 16,
                    textDecoration: "none",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                  }}
                >
                  Explore Spaces
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 40, marginTop: 52 }}
              >
                {STATS.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: C.accent,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Floor plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 20,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Layers size={16} color={C.accent} />
                  <span
                    style={{
                      color: C.accent,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Interactive Floor Plan — Level 2
                  </span>
                </div>
                <FloorPlan />
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  Hover zones to explore spaces
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SPACE TYPES */}
      <section
        id="spaces"
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Building2 size={14} color={C.accentDark} />
                <span
                  style={{
                    color: C.accentDark,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Our Spaces
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.slate,
                  marginBottom: 16,
                }}
              >
                A space for every work style
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: C.textMuted,
                  maxWidth: 520,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                From spontaneous single days to permanent private offices — Nexus Hub scales with your needs.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {SPACE_TYPES.map((space, i) => (
              <SectionReveal key={space.name} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.10)";
                    el.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      fontSize: 16,
                      fontWeight: 800,
                      color: C.accentDark,
                    }}
                  >
                    {space.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 8,
                    }}
                  >
                    {space.tagline}
                  </div>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: C.slate,
                      marginBottom: 14,
                    }}
                  >
                    {space.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {space.desc}
                  </p>
                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 24,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 13, color: C.textMuted }}>
                        From{" "}
                      </span>
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 800,
                          color: C.slate,
                        }}
                      >
                        {space.from}
                      </span>
                      <span style={{ fontSize: 13, color: C.textMuted }}>
                        EUR/{space.perDay ? "day" : "mo"}
                      </span>
                    </div>
                    <a
                      href="#pricing"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: C.accentLight,
                        color: C.accentDark,
                        padding: "10px 18px",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      View Plans <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section
        id="amenities"
        style={{ padding: "100px 5%", background: C.slate }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                Everything you need, included
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "#94a3b8",
                  maxWidth: 520,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                No hidden fees. No add-ons. Every amenity is part of your membership from day one.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {AMENITIES.map((a, i) => (
              <SectionReveal key={a.label} delay={i * 0.08}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 16,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = `${C.accent}18`;
                    el.style.borderColor = `${C.accent}50`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.05)";
                    el.style.borderColor = "rgba(255,255,255,0.09)";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: `${C.accent}20`,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a.icon size={22} color={C.accent} />
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: C.white,
                    }}
                  >
                    {a.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      lineHeight: 1.6,
                    }}
                  >
                    {a.desc}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section
        style={{
          padding: "80px 5%",
          background: C.accent,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {STATS.map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(36px, 4vw, 52px)",
                    fontWeight: 900,
                    color: C.white,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "#dcfce7",
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="community"
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Users2 size={14} color={C.accentDark} />
                <span
                  style={{
                    color: C.accentDark,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Member Stories
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.slate,
                  marginBottom: 16,
                }}
              >
                Trusted by 1,200+ members
              </h2>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={C.accent}
                        color={C.accent}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.75,
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: C.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.accentDark,
                        flexShrink: 0,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.slate,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 13, color: C.textMuted }}
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

      {/* PRICING */}
      <section
        id="pricing"
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.slate,
                  marginBottom: 16,
                }}
              >
                Simple, transparent pricing
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted }}>
                No setup fees. No long-term contracts required. Cancel with 30 days notice.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {PLANS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div
                  style={{
                    background: plan.highlight ? C.slate : C.white,
                    borderRadius: 20,
                    padding: 32,
                    border: plan.highlight
                      ? `2px solid ${C.accent}`
                      : `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  {plan.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: C.accent,
                        color: C.white,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: 30,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Most Popular
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: plan.highlight ? C.white : C.slate,
                      marginBottom: 8,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div style={{ marginBottom: 24 }}>
                    <span
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        color: plan.highlight ? C.accent : C.slate,
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: plan.highlight ? "#94a3b8" : C.textMuted,
                        marginLeft: 4,
                      }}
                    >
                      EUR/{plan.period}
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
                    {plan.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: plan.highlight
                              ? `${C.accent}30`
                              : C.accentLight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check size={11} color={C.accent} />
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            color: plan.highlight ? "#cbd5e1" : C.text,
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
                      background: plan.highlight ? C.accent : C.accentLight,
                      color: plan.highlight ? C.white : C.accentDark,
                      padding: "14px 24px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: "none",
                    }}
                  >
                    {plan.cta}
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
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 800,
                  color: C.slate,
                  marginBottom: 12,
                }}
              >
                Frequently asked questions
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted }}>
                Can't find what you need? Reach us at hello@nexushub.co
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.slate, padding: "80px 5% 40px" }}>
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
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: C.accent,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={20} color={C.white} />
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: C.white,
                  }}
                >
                  Nexus Hub
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  maxWidth: 280,
                }}
              >
                18,500 sq ft of premium workspace where ambitious founders, remote workers, and growing teams get their best work done.
              </p>
              <div
                style={{ display: "flex", gap: 12, marginTop: 20 }}
              >
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} color="#94a3b8" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Spaces",
                links: [
                  "Hot Desks",
                  "Dedicated Desks",
                  "Private Offices",
                  "Meeting Rooms",
                  "Event Space",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Community",
                  "Blog",
                  "Careers",
                  "Press",
                ],
              },
              {
                title: "Contact",
                links: [
                  "hello@nexushub.co",
                  "+33 1 23 45 67 89",
                  "12 Rue de la Paix",
                  "Paris 75001",
                  "Open 24/7",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
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
                        fontSize: 14,
                        color: "#94a3b8",
                        textDecoration: "none",
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
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "#475569" }}>
              2025 Nexus Hub. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      fontSize: 13,
                      color: "#475569",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
