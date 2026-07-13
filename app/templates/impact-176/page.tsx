"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { TemplateIcon } from '@/components/TemplateIcon';

// ─── Design tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg:        "#0f172a",
  surface:   "#131f35",
  card:      "#1a2744",
  cardAlt:   "#162036",
  border:    "#1e3052",
  borderHi:  "#2d4a7a",
  accent:    "#6366f1",
  accentHi:  "#818cf8",
  accentGlow:"rgba(99,102,241,0.12)",
  accentSoft:"rgba(99,102,241,0.08)",
  green:     "#22c55e",
  amber:     "#f59e0b",
  rose:      "#f43f5e",
  text:      "#e2e8f0",
  muted:     "#64748b",
  subdued:   "#334155",
  font:      "'Plus Jakarta Sans', sans-serif",
  fontMono:  "'IBM Plex Mono', monospace",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⚡",
    title: "Real-time dashboards",
    desc: "Data refreshed every 5 seconds. 40+ visualization types. Drag-and-drop widget builder — no SQL required.",
    badge: "< 5s latency",
    color: C.accent,
  },
  {
    icon: "🤖",
    title: "AI-powered alerts",
    desc: "Configurable threshold alerts with anomaly detection. Slack, email, and webhook delivery. Get warned before the incident.",
    badge: "99.7% accuracy",
    color: "#22c55e",
  },
  {
    icon: "📊",
    title: "Automated reports",
    desc: "Weekly and monthly delivery in PDF or HTML. White-label ready. Multi-recipient without requiring accounts.",
    badge: "White-label",
    color: "#f59e0b",
  },
  {
    icon: "🔌",
    title: "200+ integrations",
    desc: "Native connectors for GA4, Stripe, HubSpot, Salesforce, Postgres, BigQuery. REST SDK for everything else.",
    badge: "200+ sources",
    color: "#8b5cf6",
  },
  {
    icon: "🎯",
    title: "Advanced segmentation",
    desc: "Cohorts, funnels, retention analysis, heatmaps. Deep behavioral analytics without writing a single line of code.",
    badge: "No-code",
    color: "#06b6d4",
  },
  {
    icon: "🔒",
    title: "Team access & roles",
    desc: "Workspaces, granular permissions, SAML SSO. Complete audit log. SOC 2 Type II certified infrastructure.",
    badge: "SOC 2 Type II",
    color: "#f43f5e",
  },
];

const INTEGRATIONS = [
  "Stripe", "HubSpot", "Salesforce", "Google Analytics", "PostgreSQL",
  "BigQuery", "Slack", "Notion", "Intercom", "Shopify", "Segment", "Mixpanel",
];

const TESTIMONIALS = [
  {
    quote:
      "We replaced 4 tools with Metric. Fewer reporting meetings, more decisions based on real data. Our whole ops team lives in this dashboard now.",
    name: "Camille Roux",
    role: "Head of Growth",
    company: "B2B scale-up, 110 people",
    metric: "4 tools replaced",
    avatar: "CR",
  },
  {
    quote:
      "Metric's AI alerts detected a tracking bug 48 hours before we noticed it. That alone saved us 2 weeks of clean data we would have lost forever.",
    name: "Théo Marchand",
    role: "Analytics Lead",
    company: "E-commerce, €4M revenue",
    metric: "2 weeks data saved",
    avatar: "TM",
  },
  {
    quote:
      "The Stripe → Metric integration gave me real-time MRR and churn visibility I'd been trying to build for 6 months. Setup took 12 minutes.",
    name: "Sarah K.",
    role: "Founder & CEO",
    company: "SaaS Fintech startup",
    metric: "12min setup",
    avatar: "SK",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "€79",
    period: "/month",
    note: "Up to 3 users",
    features: [
      "10 data sources",
      "Unlimited dashboards",
      "Basic alerts",
      "7 days of history",
      "Email support",
    ],
    highlight: false,
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "€299",
    period: "/month",
    note: "Up to 15 users",
    features: [
      "Unlimited sources",
      "AI-powered alerts",
      "Automated reports",
      "90 days of history",
      "Premium integrations",
      "Priority support",
    ],
    highlight: true,
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    note: "Unlimited users",
    features: [
      "Everything in Growth",
      "99.9% SLA",
      "SAML SSO",
      "EU data residency",
      "Dedicated onboarding",
      "Account manager",
    ],
    highlight: false,
    cta: "Contact sales",
  },
];

const FAQS = [
  {
    q: "Is your data stored in Europe?",
    a: "Yes — 100% EU infrastructure (AWS Paris + Frankfurt). GDPR-native, DPA available, ISO 27001 certified.",
  },
  {
    q: "Do you offer a free trial?",
    a: "14 days free on the Growth plan, no credit card required. Data is deleted at the end if you don't convert.",
  },
  {
    q: "How does onboarding work?",
    a: "A 15-minute connection wizard for standard integrations. For complex setups, a solutions engineer accompanies you (included in Enterprise).",
  },
  {
    q: "Can I import historical data?",
    a: "Yes — CSV import, direct BigQuery/Redshift connection, or via our REST API. Configurable retention up to 2 years.",
  },
  {
    q: "Is there a public API?",
    a: "Yes — full REST API documented at docs.metric.io. Webhooks, JavaScript and Python SDKs available.",
  },
];

const LIVE_METRICS = [
  { label: "New users", val: "2,847", change: "+12.4%", up: true },
  { label: "MRR", val: "€48,290", change: "+8.1%", up: true },
  { label: "Churn rate", val: "1.8%", change: "-0.3%", up: true },
  { label: "NPS Score", val: "67", change: "+4", up: true },
];

const STATS = [
  { val: "4,200+", label: "Active teams" },
  { val: "2B+",    label: "Events tracked/month" },
  { val: "99.95%", label: "Uptime SLA" },
  { val: "< 5s",   label: "Data latency" },
];

const CHART_POINTS = [22, 38, 28, 52, 44, 68, 55, 80, 72, 91, 84, 100];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── useFonts ─────────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "metric-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
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
  glowColor = C.accent,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  glowColor?: string;
}) {
  const [sp, setSp] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSp({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSp((s) => ({ ...s, active: false }));
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: sp.active
          ? `radial-gradient(circle at ${sp.x}% ${sp.y}%, ${glowColor}18 0%, ${C.card} 65%)`
          : C.card,
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── Integration marquee ──────────────────────────────────────────────────────
function MarqueeStrip() {
  const doubled = [...INTEGRATIONS, ...INTEGRATIONS];
  return (
    <div
      style={{
        overflow: "hidden",
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontMono,
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 48,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.accent,
                opacity: 0.5,
                display: "inline-block",
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Animated counting number ─────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (ts: number) => {
      if (start === 0) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Dashboard mockup SVG chart ───────────────────────────────────────────────
function DashboardMockup() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const maxPt = Math.max(...CHART_POINTS);
  const width = 480;
  const height = 120;

  const pts = CHART_POINTS.map((v, i) => ({
    x: (i / (CHART_POINTS.length - 1)) * width,
    y: height - (v / maxPt) * height * 0.88 - height * 0.06,
  }));

  const pathD = pts
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div
      ref={ref}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: `0 32px 80px rgba(99,102,241,0.08)`,
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: C.surface,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {["#e5534b", "#e3b341", "#3fb950"].map((c) => (
          <div
            key={c}
            style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: 18,
            background: C.border,
            borderRadius: 4,
            marginLeft: 12,
            maxWidth: 200,
          }}
        />
      </div>

      {/* Metric cards row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 0,
          padding: "20px 20px 0",
          gap: 10,
        }}
      >
        {LIVE_METRICS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1 }}
            style={{
              background: C.cardAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 14px",
            }}
          >
            <div
              style={{
                fontFamily: C.fontMono,
                fontSize: 9,
                color: C.muted,
                letterSpacing: "0.12em",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontFamily: C.fontMono,
                fontSize: 16,
                fontWeight: 700,
                color: C.text,
                letterSpacing: "-0.3px",
                marginBottom: 4,
              }}
            >
              {m.val}
            </div>
            <div
              style={{
                fontFamily: C.fontMono,
                fontSize: 10,
                color: m.up ? C.green : C.rose,
              }}
            >
              {m.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          margin: "14px 20px 20px",
          background: C.cardAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "16px 16px 12px",
        }}
      >
        <div
          style={{
            fontFamily: C.fontMono,
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.12em",
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Active users — 12 months
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", overflow: "visible" }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {inView && (
            <>
              <motion.path
                d={`${pathD} L${pts[pts.length-1].x},${height} L0,${height} Z`}
                fill="url(#dashGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              />
              <motion.path
                d={pathD}
                fill="none"
                stroke={C.accent}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </>
          )}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          {MONTHS.map((m) => (
            <span
              key={m}
              style={{
                fontFamily: C.fontMono,
                fontSize: 8,
                color: C.subdued,
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  item,
  index,
}: {
  item: (typeof FEATURES)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08 }}
    >
      <SpotlightCard
        glowColor={item.color}
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          height: "100%",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${item.color}18`,
            border: `1px solid ${item.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <TemplateIcon emoji={item.icon} size={22} color={item.color} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
              fontFamily: C.font,
            }}
          >
            {item.title}
          </h3>
          <div
            style={{
              fontFamily: C.fontMono,
              fontSize: 9,
              color: item.color,
              background: `${item.color}15`,
              border: `1px solid ${item.color}30`,
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              flexShrink: 0,
              letterSpacing: "0.08em",
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "36px 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: C.accent,
          lineHeight: 1,
          marginBottom: 16,
          fontFamily: C.font,
          fontWeight: 900,
        }}
      >
        "
      </div>
      <p
        style={{
          fontSize: 15,
          color: "rgba(226,232,240,0.75)",
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
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}60, ${C.accentHi}30)`,
            border: `1px solid ${C.accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: C.fontMono,
            fontSize: 12,
            fontWeight: 700,
            color: C.accentHi,
          }}
        >
          {item.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.text,
              marginBottom: 2,
            }}
          >
            {item.name}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            {item.role} · {item.company}
          </div>
        </div>
        <div
          style={{
            background: C.accentGlow,
            border: `1px solid ${C.accent}30`,
            borderRadius: 8,
            padding: "4px 10px",
            fontFamily: C.fontMono,
            fontSize: 11,
            color: C.accentHi,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {item.metric}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      style={{
        background: plan.highlight ? "#14163f" : C.card,
        border: `1.5px solid ${plan.highlight ? C.accent : C.border}`,
        borderRadius: 20,
        padding: "40px 32px",
        position: "relative",
        boxShadow: plan.highlight
          ? `0 0 60px ${C.accent}12, 0 24px 48px rgba(0,0,0,0.3)`
          : "none",
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
            color: "#fff",
            fontFamily: C.fontMono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            padding: "4px 18px",
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
          color: plan.highlight ? C.accentHi : C.muted,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {plan.name}
      </div>

      <div
        style={{
          fontFamily: C.fontMono,
          fontSize: 12,
          color: C.muted,
          marginBottom: 20,
        }}
      >
        {plan.note}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: C.fontMono,
            fontSize: 52,
            fontWeight: 700,
            color: C.text,
            letterSpacing: "-2px",
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
          margin: "24px 0",
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
            <span
              style={{
                color: plan.highlight ? "rgba(226,232,240,0.9)" : C.muted,
              }}
            >
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
          color: plan.highlight ? "#fff" : C.accent,
          border: plan.highlight ? "none" : `1.5px solid ${C.borderHi}`,
          borderRadius: 10,
          fontFamily: C.font,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          letterSpacing: "0.01em",
        }}
      >
        {plan.cta}
      </MagneticButton>
    </motion.div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({
  item,
  index,
  openIndex,
  setOpen,
}: {
  item: (typeof FAQS)[0];
  index: number;
  openIndex: number | null;
  setOpen: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <button
        onClick={() => setOpen(isOpen ? null : index)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 0",
          background: "none",
          border: "none",
          color: C.text,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: C.font,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600 }}>{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 22,
            color: C.accent,
            minWidth: 22,
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                paddingBottom: 22,
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.8,
              }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact176Page() {
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const NAV_LINKS = ["Features", "Integrations", "Pricing", "FAQ"];

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: C.font,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: progressWidth,
          height: 2,
          background: `linear-gradient(90deg, ${C.accent}, ${C.accentHi})`,
          zIndex: 1001,
        }}
      />

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
          background: scrolled ? "rgba(15,23,42,0.97)" : "transparent",
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
            gap: 8,
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
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentHi})`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: C.text,
                  letterSpacing: "-0.3px",
                }}
              >{fd?.businessName ?? "Metric"}</span>
            </>
          )}
        </div>

        {/* Desktop links */}
        <div className="sky-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              style={{
                background: "none",
                border: "none",
                fontFamily: C.font,
                fontSize: 14,
                color: C.muted,
                cursor: "pointer",
                fontWeight: 500,
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {link}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("pricing")}
            style={{
              padding: "9px 22px",
              background: "transparent",
              color: C.accent,
              border: `1.5px solid ${C.accent}`,
              borderRadius: 8,
              fontFamily: C.font,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Free trial
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollTo("pricing")}
            style={{
              padding: "9px 22px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: C.font,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Get started
          </MagneticButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sky-mobile-burger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
          aria-label="Toggle menu"
        >
          <div style={{ width: 22, height: 2, background: C.text, marginBottom: 5 }} />
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
                  fontFamily: C.font,
                  fontSize: 16,
                  color: C.text,
                  cursor: "pointer",
                  textAlign: "left",
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
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "100px 48px 80px",
          gap: 80,
        }}
      >
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.accentGlow,
              border: `1px solid ${C.accent}30`,
              borderRadius: 100,
              padding: "6px 18px",
              marginBottom: 36,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 7,
                height: 7,
                background: C.green,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                color: C.accentHi,
                letterSpacing: "0.1em",
              }}
            >
              Real-time data · 99.95% uptime SLA
            </span>
          </motion.div>

          <TextReveal style={{ marginBottom: 8 }}>
            <h1
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                color: C.text,
              }}
            >{c?.heroHeadline ?? <>
              Your data.
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.1} style={{ marginBottom: 8 }}>
            <h1
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                color: C.accent,
              }}
            >
              Your decisions.
            </h1>
          </TextReveal>
          <TextReveal delay={0.2} style={{ marginBottom: 36 }}>
            <h1
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                color: C.text,
              }}
            >
              Your advantage.
            </h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: 18,
              color: C.muted,
              lineHeight: 1.8,
              marginBottom: 48,
              maxWidth: 460,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Metric turns raw data into actionable insights.
            Dashboards, alerts, and automated reports — all in one platform built for serious teams.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => scrollTo("pricing")}
              style={{
                padding: "16px 36px",
                background: C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: C.font,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 0 32px ${C.accent}25`,
              }}
            >
              14 days free →
            </MagneticButton>
            <MagneticButton
              style={{
                padding: "16px 36px",
                background: "transparent",
                color: C.muted,
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontFamily: C.font,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              View demo
            </MagneticButton>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              display: "flex",
              gap: 24,
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            {["SOC 2 Type II", "GDPR", "No credit card"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: C.fontMono,
                  fontSize: 11,
                  color: C.muted,
                }}
              >
                <span style={{ color: C.green }}>✓</span> {t}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <DashboardMockup />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
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
                fontWeight: 900,
                letterSpacing: "-2.5px",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Everything your team needs.
            </h2>
          </TextReveal>
          <p style={{ fontSize: 18, color: C.muted }}>
            Analytics, alerts, reports. All-in-one. No compromises.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ── INTEGRATIONS MARQUEE ── */}
      <section id="integrations">
        <div
          style={{
            textAlign: "center",
            padding: "60px 48px 36px",
          }}
        >
          <TextReveal>
            <h2
              style={{
                fontSize: "clamp(28px, 3vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                color: C.text,
                marginBottom: 12,
              }}
            >
              Connect everything you use.
            </h2>
          </TextReveal>
          <p style={{ fontSize: 16, color: C.muted }}>
            200+ native integrations. REST SDK for the rest.
          </p>
        </div>
        <MarqueeStrip />
      </section>

      {/* ── ANALYTICS PREVIEW ── */}
      <section
        style={{
          padding: "100px 48px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}
          >
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
              alt="Analytics dashboard"
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${C.accent}20, transparent)`,
                pointerEvents: "none",
              }}
            />
            {/* Floating metric badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                background: "rgba(15,23,42,0.95)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "14px 18px",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 9,
                  color: C.muted,
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                CONVERSION RATE
              </div>
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.green,
                }}
              >
                +8.4%
              </div>
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 2,
                }}
              >
                vs last 30 days
              </div>
            </motion.div>
          </motion.div>

          {/* Right: text */}
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
              — Analytics Preview
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
                Decisions that{" "}
                <span style={{ color: C.accent }}>actually move</span>{" "}
                the needle.
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
              Stop guessing. Metric surfaces the insights that matter — right when
              you need them. Automated anomaly detection, trend forecasting, and
              cohort analysis in a single view.
            </>}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                {
                  title: "Funnel analysis",
                  desc: "Identify where users drop off and fix the leaks.",
                  color: C.accent,
                },
                {
                  title: "Cohort retention",
                  desc: "Track how different segments perform over time.",
                  color: C.green,
                },
                {
                  title: "Revenue attribution",
                  desc: "Know exactly which channels drive real revenue.",
                  color: C.amber,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}30`,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: C.fontMono,
                      fontSize: 12,
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: C.text,
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="testimonials"
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
                fontSize: "clamp(36px, 4vw, 60px)",
                fontWeight: 900,
                letterSpacing: "-2.5px",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Teams who chose Metric.
            </h2>
          </TextReveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((item, index) => (
            <TestimonialCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
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
                  fontSize: "clamp(36px, 4vw, 64px)",
                  fontWeight: 900,
                  letterSpacing: "-2.5px",
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                Simple, predictable pricing.
              </h2>
            </TextReveal>
            <p style={{ fontSize: 18, color: C.muted }}>
              14 days free on all plans. No credit card required.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 20,
              alignItems: "center",
            }}
          >
            {PLANS.map((plan, index) => (
              <PlanCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "100px 48px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <TextReveal>
            <h2
              style={{
                fontSize: "clamp(32px, 3.5vw, 52px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                color: C.text,
              }}
            >
              Frequently asked questions
            </h2>
          </TextReveal>
        </div>

        {FAQS.map((item, index) => (
          <FaqItem
            key={index}
            item={item}
            index={index}
            openIndex={openFaq}
            setOpen={setOpenFaq}
          />
        ))}
      </section>

      {/* ── CTA ── */}
      <section id="contact"
        style={{
          background: `linear-gradient(135deg, #111827 0%, #0f172a 100%)`,
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
            background: `radial-gradient(ellipse, ${C.accent}10 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <TextReveal style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: "clamp(44px, 5.5vw, 80px)",
              fontWeight: 900,
              letterSpacing: "-3px",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            Your data is waiting for you.
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
            maxWidth: 480,
            margin: "0 auto 56px",
            lineHeight: 1.7,
          }}
        >
          14 days free. No credit card. Results from day one.
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
            onClick={() => scrollTo("pricing")}
            style={{
              padding: "20px 56px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontFamily: C.font,
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 0 40px ${C.accent}20`,
            }}
          >
            Start for free →
          </MagneticButton>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: C.bg,
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
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentHi})`,
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: C.accent,
                }}
              >{fd?.businessName ?? "Metric"}</span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.8,
                maxWidth: 280,
              }}
            >
              Real-time analytics for data-driven teams. Make better decisions, faster.
            </p>
          </div>

          {[
            { title: "Product", links: ["Features", "Integrations", "Changelog", "Status"] },
            { title: "Company", links: ["About", "Blog", "Press", "Careers"] },
            { title: "Support", links: ["Documentation", "API Reference", "Contact", "Security"] },
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
                    fontSize: 14,
                    color: C.muted,
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
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
            © 2026 Metric Analytics · All rights reserved · GDPR · Privacy Policy
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.green,
              }}
            />
            <span
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                color: C.muted,
              }}
            >
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
