"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { TemplateIcon } from '@/components/TemplateIcon';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

// ─── Design tokens ───────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg:        "#0a0b0d",
  surface:   "#0f1114",
  card:      "#131619",
  border:    "#1e2328",
  borderHi:  "#2a3038",
  accent: '#00ff88',
  accentDim: "#00cc6a",
  accentGlow:"rgba(0,255,136,0.12)",
  red:       "#ff4040",
  amber:     "#ffaa00",
  text:      "#e8edf3",
  muted:     "#4a5568",
  subdued:   "#2d3748",
  font:      "'Space Grotesk', sans-serif",
  fontMono:  "'JetBrains Mono', monospace",
};

// ─── Module-level data ────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { sym: "BTC/USD", price: "67,240.50", change: "+2.14%", up: true },
  { sym: "ETH/USD", price: "3,521.88",  change: "+1.73%", up: true },
  { sym: "AAPL",    price: "189.34",    change: "-0.42%", up: false },
  { sym: "TSLA",    price: "248.76",    change: "+3.91%", up: true },
  { sym: "SOL/USD", price: "172.44",    change: "+5.22%", up: true },
  { sym: "MSFT",    price: "414.10",    change: "+0.87%", up: true },
  { sym: "NVDA",    price: "875.60",    change: "-1.18%", up: false },
  { sym: "BNB/USD", price: "568.22",    change: "+0.99%", up: true },
];

const MARKET_CARDS = [
  { sym: "BTC", name: "Bitcoin",  price: "67,240.50", change: "+2.14%", vol: "$42.1B", cap: "$1.32T", up: true,  sparkline: "M0,30 C8,28 16,12 24,18 S40,8 48,5 S64,14 72,10 S84,6 96,2" },
  { sym: "ETH", name: "Ethereum", price: "3,521.88",  change: "+1.73%", vol: "$18.4B", cap: "$423B",  up: true,  sparkline: "M0,28 C8,32 16,20 24,22 S40,15 48,18 S64,10 72,8 S84,4 96,2" },
  { sym: "SOL", name: "Solana",   price: "172.44",    change: "+5.22%", vol: "$6.8B",  cap: "$78B",   up: true,  sparkline: "M0,35 C8,30 16,18 24,24 S40,12 48,6 S64,8 72,4 S84,2 96,1" },
  { sym: "ADA", name: "Cardano",  price: "0.4821",    change: "-0.88%", vol: "$0.9B",  cap: "$17B",   up: false, sparkline: "M0,15 C8,18 16,26 24,22 S40,30 48,35 S64,28 72,38 S84,40 96,44" },
  { sym: "DOT", name: "Polkadot", price: "8.142",     change: "-1.24%", vol: "$0.4B",  cap: "$11B",   up: false, sparkline: "M0,10 C8,14 16,22 24,18 S40,28 48,32 S64,38 72,42 S84,44 96,48" },
  { sym: "LINK", name: "Chainlink",price: "18.52",    change: "+4.07%", vol: "$1.1B",  cap: "$11B",   up: true,  sparkline: "M0,40 C8,34 16,20 24,28 S40,14 48,8 S64,12 72,6 S84,3 96,0" },
];

const PORTFOLIO_DATA = [
  { label: "Jan", val: 48 }, { label: "Feb", val: 55 }, { label: "Mar", val: 42 },
  { label: "Apr", val: 70 }, { label: "May", val: 65 }, { label: "Jun", val: 88 },
  { label: "Jul", val: 78 }, { label: "Aug", val: 95 }, { label: "Sep", val: 82 },
  { label: "Oct", val: 110 },{ label: "Nov", val: 98 }, { label: "Dec", val: 128 },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Sub-millisecond execution",
    desc: "Co-located servers in NYSE, NASDAQ, and CME data centers. Your orders arrive before the competition blinks.",
    badge: "< 0.3ms",
  },
  {
    icon: "🤖",
    title: "Algorithmic strategies",
    desc: "Deploy pre-built quant strategies or write your own in Python. Backtesting engine with 20 years of tick data.",
    badge: "200+ strategies",
  },
  {
    icon: "📊",
    title: "Level II order book",
    desc: "Real-time depth-of-market data across all major exchanges. See exactly where the liquidity sits.",
    badge: "Real-time",
  },
  {
    icon: "🛡️",
    title: "Risk controls",
    desc: "Per-position limits, daily drawdown kills, volatility circuit breakers. Sleep while the system runs.",
    badge: "Auto-halt",
  },
  {
    icon: "🔗",
    title: "Multi-broker routing",
    desc: "Route to 40+ brokers simultaneously for best-price execution. Smart order routing included.",
    badge: "40+ brokers",
  },
  {
    icon: "📡",
    title: "Real-time alerts",
    desc: "SMS, Telegram, Discord, email. Conditional triggers on price, volume, volatility, or custom signals.",
    badge: "Multi-channel",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Prop Trader — 8yr experience",
    quote: "Trade OS replaced my entire Bloomberg Terminal setup. The Level II data alone is worth 10x the subscription. I'm running 12 concurrent strategies with zero downtime.",
    pnl: "+$2.4M YTD",
    avatar: "MC",
  },
  {
    name: "Sarah Kowalski",
    role: "Quant Analyst, HFT Fund",
    quote: "The backtesting engine is institutional-grade. We tested 5 years of intraday tick data in 4 seconds. Execution latency is genuinely sub-millisecond — I ran the benchmarks myself.",
    pnl: "+312% 2yr",
    avatar: "SK",
  },
  {
    name: "Alex Okonkwo",
    role: "Retail Trader → Full-time",
    quote: "I went from losing $8K/month to profitably running 3 automated strategies. The risk controls saved me twice from blowing up my account during flash crashes.",
    pnl: "+$180K YTD",
    avatar: "AO",
  },
];

const PLANS = [
  {
    name: "Retail",
    price: "$79",
    period: "/month",
    features: [
      "Up to 5 simultaneous strategies",
      "Real-time quotes — 15 exchanges",
      "Backtesting (2yr data)",
      "SMS + email alerts",
      "Mobile app",
      "Community forum access",
    ],
    highlight: false,
    cta: "Start free trial",
  },
  {
    name: "Pro Trader",
    price: "$299",
    period: "/month",
    features: [
      "Unlimited strategies",
      "Level II order book",
      "Backtesting (20yr tick data)",
      "Sub-5ms execution",
      "40+ broker routing",
      "API access + webhooks",
      "Priority support",
      "Risk dashboard",
    ],
    highlight: true,
    cta: "Start free trial",
  },
  {
    name: "Institutional",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Co-location access",
      "Sub-millisecond SLA",
      "Dedicated infrastructure",
      "Custom integrations",
      "24/7 concierge support",
      "Compliance reporting",
      "FIX protocol access",
    ],
    highlight: false,
    cta: "Contact sales",
  },
];

const STATS = [
  { val: "$2.8T", label: "Volume processed/year" },
  { val: "0.28ms", label: "Avg execution latency" },
  { val: "99.99%", label: "Platform uptime" },
  { val: "48K+", label: "Active traders" },
];

const NAV_LINKS = ["Markets", "Strategies", "Pricing", "Docs", "Traders"];

// ─── Utility: inject Google Fonts ─────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "trade-os-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    `;
    document.head.appendChild(style);
  }, []);
}

// ─── TextReveal ───────────────────────────────────────────────────────────────
function TextReveal({
  children,
  delay = 0,
  style: externalStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── MagneticButton ───────────────────────────────────────────────────────────
function MagneticButton({
  children,
  style: externalStyle,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ ...externalStyle, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

// ─── SpotlightCard ────────────────────────────────────────────────────────────
function SpotlightCard({
  children,
  style: externalStyle,
  accentColor = C.accent,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
}) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  const bg = spotlight.active
    ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${accentColor}18 0%, ${C.card} 60%)`
    : C.card;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: bg,
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── Ticker Marquee ───────────────────────────────────────────────────────────
function TickerMarquee() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        overflow: "hidden",
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontMono,
              fontSize: 12,
              paddingLeft: 40,
              paddingRight: 40,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: C.muted, letterSpacing: "0.1em" }}>{item.sym}</span>
            <span style={{ color: C.text, fontWeight: 600 }}>{item.price}</span>
            <span
              style={{
                color: item.up ? C.accent : C.red,
                fontSize: 11,
              }}
            >
              {item.change}
            </span>
            <span style={{ color: C.subdued }}>|</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Animated SVG Chart Line ──────────────────────────────────────────────────
function PortfolioChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const maxVal = Math.max(...PORTFOLIO_DATA.map((d) => d.val));
  const width = 720;
  const height = 160;
  const pts = PORTFOLIO_DATA.map((d, i) => ({
    x: (i / (PORTFOLIO_DATA.length - 1)) * width,
    y: height - (d.val / maxVal) * height * 0.9 - height * 0.05,
  }));

  const pathD = pts
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");

  const fillD =
    pathD + ` L${pts[pts.length - 1].x},${height} L0,${height} Z`;

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {inView && (
          <>
            <motion.path
              d={fillD}
              fill="url(#portGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke={C.accent}
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {pts.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={C.accent}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * i + 1.8 }}
              />
            ))}
          </>
        )}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {PORTFOLIO_DATA.map((d) => (
          <span
            key={d.label}
            style={{
              fontFamily: C.fontMono,
              fontSize: 10,
              color: C.muted,
              letterSpacing: "0.05em",
            }}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Market card ──────────────────────────────────────────────────────────────
function MarketCard({ item }: { item: (typeof MARKET_CARDS)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#161a1f" : C.card,
        border: `1px solid ${hovered ? C.borderHi : C.border}`,
        borderRadius: 16,
        padding: "24px 24px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: item.up ? C.accent : C.red,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.15em",
              marginBottom: 4,
            }}
          >
            {item.sym}
          </div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
            {item.name}
          </div>
        </div>
        <div
          style={{
            background: item.up ? `${C.accent}18` : `${C.red}18`,
            color: item.up ? C.accent : C.red,
            fontFamily: C.fontMono,
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {item.change}
        </div>
      </div>

      <div
        style={{
          fontFamily: C.fontMono,
          fontSize: 22,
          fontWeight: 700,
          color: C.text,
          letterSpacing: "-0.5px",
          marginBottom: 16,
        }}
      >
        ${item.price}
      </div>

      <svg viewBox="0 0 96 50" style={{ width: "100%", height: 40, overflow: "visible" }}>
        <defs>
          <linearGradient id={`sg-${item.sym}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={item.up ? C.accent : C.red} stopOpacity="0.2" />
            <stop offset="100%" stopColor={item.up ? C.accent : C.red} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${item.sparkline} L96,50 L0,50 Z`}
          fill={`url(#sg-${item.sym})`}
        />
        <motion.path
          d={item.sparkline}
          fill="none"
          stroke={item.up ? C.accent : C.red}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          paddingTop: 14,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 9,
              color: C.muted,
              letterSpacing: "0.12em",
              marginBottom: 2,
            }}
          >
            VOL 24H
          </div>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.text,
            }}
          >
            {item.vol}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 9,
              color: C.muted,
              letterSpacing: "0.12em",
              marginBottom: 2,
            }}
          >
            MKT CAP
          </div>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.text,
            }}
          >
            {item.cap}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ item, index }: { item: (typeof FEATURES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08 }}
    >
      <SpotlightCard
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          height: "100%",
        }}
      >
        <div
          style={{
            marginBottom: 16,
            lineHeight: 1,
          }}
        >
          <TemplateIcon emoji={item.icon} size={28} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: C.font,
              fontSize: 16,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 10,
              color: C.accent,
              background: C.accentGlow,
              border: `1px solid ${C.accent}30`,
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {item.badge}
          </div>
        </div>
        <p
          style={{
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.75,
          }}
        >
          {item.desc}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialCard({
  item,
  index,
}: {
  item: (typeof TESTIMONIALS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "36px 32px",
      }}
    >
      <div
        style={{
          fontSize: 32,
          color: C.accent,
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: 16,
          fontFamily: C.font,
        }}
      >
        "
      </div>
      <p
        style={{
          fontSize: 15,
          color: "rgba(232,237,243,0.75)",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        {item.quote}
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
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}40, ${C.accentDim}20)`,
            border: `1px solid ${C.accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: C.fontMono,
            fontSize: 12,
            fontWeight: 700,
            color: C.accent,
          }}
        >
          {item.avatar}
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.text,
            }}
          >
            {item.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.muted,
              marginTop: 2,
            }}
          >
            {item.role}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: C.fontMono,
            fontSize: 12,
            color: C.accent,
            fontWeight: 700,
          }}
        >
          {item.pnl}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, index }: { plan: (typeof PLANS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      style={{
        background: plan.highlight ? "#0f1c14" : C.card,
        border: `1.5px solid ${plan.highlight ? C.accent : C.border}`,
        borderRadius: 20,
        padding: "40px 32px",
        position: "relative",
        boxShadow: plan.highlight
          ? `0 0 60px ${C.accent}15, 0 24px 48px rgba(0,0,0,0.4)`
          : "0 8px 32px rgba(0,0,0,0.2)",
        transform: plan.highlight ? "scale(1.04)" : "none",
      }}
    >
      {plan.highlight && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.accent,
            color: C.bg,
            fontFamily: C.fontMono,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            padding: "4px 16px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          MOST POPULAR
        </div>
      )}

      <div
        style={{
          fontFamily: C.fontMono,
          fontSize: 11,
          letterSpacing: "0.2em",
          color: plan.highlight ? C.accent : C.muted,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        {plan.name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <span
          style={{
            fontFamily: C.fontMono,
            fontSize: 48,
            fontWeight: 700,
            color: C.text,
            letterSpacing: "-1px",
          }}
        >
          {plan.price}
        </span>
        {plan.period && (
          <span
            style={{
              fontFamily: C.fontMono,
              fontSize: 14,
              color: C.muted,
            }}
          >
            {plan.period}
          </span>
        )}
      </div>

      <div
        style={{
          height: 1,
          background: C.border,
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {plan.features.map((f, j) => (
          <div
            key={j}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
            }}
          >
            <span
              style={{
                color: plan.highlight ? C.accent : C.muted,
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              ✓
            </span>
            <span style={{ color: plan.highlight ? "rgba(232,237,243,0.9)" : C.muted }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      <MagneticButton
        style={{
          width: "100%",
          padding: "14px",
          background: plan.highlight ? C.accent : "transparent",
          color: plan.highlight ? C.bg : C.accent,
          border: plan.highlight ? "none" : `1.5px solid ${C.borderHi}`,
          borderRadius: 10,
          fontFamily: C.font,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
      >
        {plan.cta}
      </MagneticButton>
    </motion.div>
  );
}

// ─── HUD scan-line overlay ────────────────────────────────────────────────────
function HudScanline() {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${C.accent}40, transparent)`,
        pointerEvents: "none",
        zIndex: 999,
      }}
      animate={{ y: ["0vh", "100vh"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function Impact135Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand };
  }

  useFonts();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "25%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: C.font,
        overflowX: "hidden",
        minHeight: "100dvh",
      }}
    >
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: progressWidth,
          height: 2,
          background: C.accent,
          zIndex: 1001,
          boxShadow: `0 0 8px ${C.accent}`,
        }}
      />

      <HudScanline />

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 2,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          background: scrolled ? "rgba(10,11,13,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => scrollTo("hero")}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: C.accent,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 11 L4 7 L7 9 L10 4 L13 6 L15 3"
                    stroke={C.bg}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: C.fontMono,
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                  letterSpacing: "0.05em",
                }}
              >
                TRADE<span style={{ color: C.accent }}>OS</span>
              </span>
            </>
          )}
        </div>

        {/* Desktop links */}
        <div
          className="sky-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              style={{
                background: "none",
                border: "none",
                fontFamily: C.fontMono,
                fontSize: 12,
                color: C.muted,
                cursor: "pointer",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "color 0.2s",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {link}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("pricing")}
            style={{
              padding: "8px 22px",
              background: C.accent,
              color: C.bg,
              border: "none",
              borderRadius: 8,
              fontFamily: C.fontMono,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.1em",
            }}
          >
            GET ACCESS
          </MagneticButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sky-mobile-burger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          <div
            style={{
              width: 22,
              height: 2,
              background: C.text,
              marginBottom: 5,
            }}
          />
          <div style={{ width: 22, height: 2, background: C.text, marginBottom: 5 }} />
          <div style={{ width: 16, height: 2, background: C.accent }} />
        </button>
        <style>{`@media (max-width: 900px){.sky-desktop-nav{display:none !important}.sky-mobile-burger{display:flex !important}}`}</style>
      </nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              zIndex: 99,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: C.fontMono,
                  fontSize: 14,
                  color: C.text,
                  cursor: "pointer",
                  textAlign: "left",
                  letterSpacing: "0.1em",
                }}
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section
        id="hero"
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 48px 60px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${C.accent}10 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <motion.div style={{ y: heroY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.accentGlow,
              border: `1px solid ${C.accent}30`,
              borderRadius: 100,
              padding: "6px 18px",
              marginBottom: 40,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              style={{
                width: 7,
                height: 7,
                background: C.accent,
                borderRadius: "50%",
                display: "inline-block",
                boxShadow: `0 0 6px ${C.accent}`,
              }}
            />
            <span
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                color: C.accent,
                letterSpacing: "0.15em",
              }}
            >
              LIVE MARKET FEED · $2.8T PROCESSED/YEAR
            </span>
          </motion.div>

          {/* Headline */}
          <TextReveal style={{ marginBottom: 8 }}>
            <h1
              style={{
                fontSize: "clamp(52px, 8vw, 96px)",
                fontWeight: 800,
                letterSpacing: "-3px",
                lineHeight: 1.0,
                color: C.text,
                fontFamily: C.font,
              }}
            >{c?.heroHeadline ?? <>
              The Operating System
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.1} style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: "clamp(52px, 8vw, 96px)",
                fontWeight: 800,
                letterSpacing: "-3px",
                lineHeight: 1.0,
                color: C.accent,
                fontFamily: C.font,
              }}
            >
              for Elite Traders.
            </h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 20,
              color: C.muted,
              maxWidth: 560,
              lineHeight: 1.7,
              marginBottom: 56,
              margin: "0 auto 56px",
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Sub-millisecond execution. Bloomberg-grade data. Unlimited algorithmic strategies.
            Built for traders who play at the highest level.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <MagneticButton
              onClick={() => scrollTo("pricing")}
              style={{
                padding: "18px 44px",
                background: C.accent,
                color: C.bg,
                border: "none",
                borderRadius: 10,
                fontFamily: C.font,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 0 32px ${C.accent}30`,
              }}
            >
              Start Free Trial →
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("markets")}
              style={{
                padding: "18px 44px",
                background: "transparent",
                color: C.text,
                border: `1px solid ${C.borderHi}`,
                borderRadius: 10,
                fontFamily: C.font,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              View Live Markets
            </MagneticButton>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {["No subscription lock-in", "14-day free trial", "48K+ active traders", "SOC 2 certified"].map(
              (t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: C.fontMono,
                    fontSize: 11,
                    color: C.muted,
                    letterSpacing: "0.08em",
                  }}
                >
                  <span style={{ color: C.accent }}>✓</span> {t}
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER MARQUEE ── */}
      <TickerMarquee />

      {/* ── STATS BAND ── */}
      <section
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: "52px 40px",
                borderRight: i < 3 ? `1px solid ${C.border}` : undefined,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 44,
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: "-1px",
                  marginBottom: 8,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MARKET OVERVIEW ── */}
      <section
        id="markets"
        style={{
          padding: "100px 48px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <TextReveal style={{ marginBottom: 12 }}>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.accent,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            — Live Market Overview
          </div>
        </TextReveal>
        <TextReveal style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(36px, 4vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-2px",
              color: C.text,
            }}
          >
            Track every asset. <span style={{ color: C.accent }}>In real-time.</span>
          </h2>
        </TextReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {MARKET_CARDS.map((item) => (
            <MarketCard key={item.sym} item={item} />
          ))}
        </div>
      </section>

      {/* ── PORTFOLIO TRACKER ── */}
      <section
        id="strategies"
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "100px 48px",
        }}
      >
        <div className="imx-mobstack"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                color: C.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              — Portfolio Tracker
            </div>
            <TextReveal style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  lineHeight: 1.15,
                  color: C.text,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                Watch your wealth{" "}
                <span style={{ color: C.accent }}>compound.</span>
              </>}</h2>
            </TextReveal>
            <p
              style={{
                fontSize: 16,
                color: C.muted,
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >{c?.aboutText ?? <>
              Every position. Every trade. Every P&L metric — unified in a single
              real-time dashboard. Know exactly where you stand at all times.
            </>}</p>

            {/* Mini stats */}
            <div className="imx-mobstack"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "Total Portfolio", val: "$284,120", change: "+$32,410" },
                { label: "Today's P&L",     val: "+$4,892",  change: "+1.76%" },
                { label: "Win Rate",         val: "73.2%",    change: "30d avg" },
                { label: "Sharpe Ratio",     val: "2.41",     change: "annualized" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "20px 18px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 9,
                      color: C.muted,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 20,
                      fontWeight: 700,
                      color: item.val.startsWith("+") ? C.accent : C.text,
                      letterSpacing: "-0.5px",
                      marginBottom: 4,
                    }}
                  >
                    {item.val}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 10,
                      color: C.muted,
                    }}
                  >
                    {item.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "32px 28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: C.fontMono,
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: "0.15em",
                    marginBottom: 4,
                  }}
                >
                  PORTFOLIO GROWTH — 12 MONTHS
                </div>
                <div
                  style={{
                    fontFamily: C.fontMono,
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.accent,
                  }}
                >
                  +167.4%
                </div>
              </div>
              <div
                style={{
                  background: C.accentGlow,
                  border: `1px solid ${C.accent}30`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontFamily: C.fontMono,
                  fontSize: 11,
                  color: C.accent,
                }}
              >
                ALL TIME
              </div>
            </div>
            <PortfolioChart />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{
          padding: "100px 48px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <TextReveal>
            <h2
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-2.5px",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Institutional tools. <br />
              <span style={{ color: C.accent }}>Retail access.</span>
            </h2>
          </TextReveal>
          <p
            style={{
              fontSize: 18,
              color: C.muted,
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Everything Wall Street uses — now available for anyone serious enough to trade like a pro.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="traders"
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          padding: "100px 48px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <h2
                style={{
                  fontSize: "clamp(36px, 4vw, 60px)",
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                Traders who{" "}
                <span style={{ color: C.accent }}>actually win.</span>
              </h2>
            </TextReveal>
            <p style={{ fontSize: 18, color: C.muted }}>
              Real results from real traders — not cherry-picked demos.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((item, index) => (
              <TestimonialCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{
          padding: "100px 48px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <TextReveal>
            <h2
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-2.5px",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Transparent pricing.
              <br />
              <span style={{ color: C.accent }}>Zero hidden fees.</span>
            </h2>
          </TextReveal>
          <p style={{ fontSize: 18, color: C.muted }}>
            14-day free trial on all plans. No credit card required.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 20,
            maxWidth: 1100,
            margin: "0 auto",
            alignItems: "center",
          }}
        >
          {PLANS.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: `linear-gradient(135deg, #0c160f 0%, ${C.bg} 100%)`,
          borderTop: `1px solid ${C.border}`,
          padding: "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 400,
            background: `radial-gradient(ellipse, ${C.accent}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <TextReveal style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: "clamp(44px, 6vw, 80px)",
              fontWeight: 800,
              letterSpacing: "-3px",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            Your edge is waiting.
            <br />
            <span style={{ color: C.accent }}>Start trading smarter.</span>
          </h2>
        </TextReveal>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 20,
            color: C.muted,
            marginBottom: 56,
            maxWidth: 500,
            margin: "0 auto 56px",
            lineHeight: 1.7,
          }}
        >
          Join 48,000+ traders already running on Trade OS. 14 days free, no card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <MagneticButton
            style={{
              padding: "20px 56px",
              background: C.accent,
              color: C.bg,
              border: "none",
              borderRadius: 12,
              fontFamily: C.font,
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 0 40px ${C.accent}25`,
            }}
          >
            Start Free Trial →
          </MagneticButton>
          <MagneticButton
            style={{
              padding: "20px 56px",
              background: "transparent",
              color: C.text,
              border: `1px solid ${C.borderHi}`,
              borderRadius: 12,
              fontFamily: C.font,
              fontSize: 18,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Book a Demo
          </MagneticButton>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          padding: "60px 48px 36px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: C.accent,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 11 L4 7 L7 9 L10 4 L13 6 L15 3"
                    stroke={C.bg}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: C.fontMono,
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                }}
              >
                TRADE<span style={{ color: C.accent }}>OS</span>
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.8,
                maxWidth: 280,
              }}
            >
              The institutional-grade trading platform built for serious traders who demand
              sub-millisecond execution and professional-grade analytics.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Markets", "Strategies", "Portfolio", "Alerts", "API"] },
            { title: "Company",  links: ["About", "Blog", "Careers", "Press", "Contact"] },
            { title: "Legal",    links: ["Privacy Policy", "Terms", "Risk Disclosure", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: C.subdued,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {col.title}
              </div>
              {col.links.map((l) => (
                <div
                  key={l}
                  style={{
                    fontSize: 13,
                    color: C.muted,
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                >
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: C.fontMono,
              fontSize: 12,
              color: C.subdued,
            }}
          >
            © 2026 TradeOS Inc. · All rights reserved · SOC 2 Type II
          </span>
          <span
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.subdued,
              maxWidth: 500,
            }}
          >
            Trading involves substantial risk of loss. Past performance does not guarantee future results.
          </span>
        </div>
      </footer>
    </div>
  );
}
