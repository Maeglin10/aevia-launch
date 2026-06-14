"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import {
  BarChart3,
  Plug,
  Shield,
  Users,
  Check,
  Zap,
  Lock,
  TrendingUp,
  Activity,
} from "lucide-react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
export const T = {
  bg: "#ffffff",
  text: "#0f0f0f",
  muted: "#6b7280",
  subtle: "#f4f4f5",
  border: "#e4e4e7",
  accent: "#6366f1",
  accentDark: "#4f46e5",
  accentLight: "#eef2ff",
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  headingFont: "'Syne', 'Inter', system-ui, sans-serif",
  bodyFont: "'Inter', system-ui, -apple-system, sans-serif",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
`;

export function FontInjector() {
  useEffect(() => {
    const id = "syne-font-inject";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── NAV LINKS ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Product", href: "/templates/impact-51" },
  { label: "About", href: "/templates/impact-51/about" },
  { label: "Pricing", href: "/templates/impact-51/pricing" },
  { label: "Blog", href: "/templates/impact-51/blog" },
  { label: "Contact", href: "/templates/impact-51/contact" },
  { label: "Legal", href: "/templates/impact-51/legal" },
] as const;

// ─── REVEAL ───────────────────────────────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  y = 28,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!inView || hasStarted.current) return;
    hasStarted.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      if (ref.current) {
        const formatted =
          decimals > 0
            ? current.toFixed(decimals)
            : Math.floor(current).toLocaleString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, suffix, prefix, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

// ─── INTEGRATION MARQUEE ──────────────────────────────────────────────────────
export const INTEGRATIONS = [
  { name: "Stripe", color: "#6772e5", bg: "#f0f0ff" },
  { name: "Slack", color: "#4a154b", bg: "#fff0fb" },
  { name: "GitHub", color: "#24292e", bg: "#f6f8fa" },
  { name: "Notion", color: "#000000", bg: "#f7f7f5" },
  { name: "Figma", color: "#f24e1e", bg: "#fff4f0" },
  { name: "Linear", color: "#5e6ad2", bg: "#f0f1ff" },
  { name: "Zapier", color: "#ff4a00", bg: "#fff3ee" },
  { name: "HubSpot", color: "#ff7a59", bg: "#fff5f2" },
  { name: "Salesforce", color: "#00a1e0", bg: "#f0faff" },
  { name: "Jira", color: "#0052cc", bg: "#f0f4ff" },
  { name: "Datadog", color: "#774aa4", bg: "#f8f0ff" },
  { name: "Twilio", color: "#f22f46", bg: "#fff0f2" },
];

export function IntegrationMarquee() {
  const doubled = [...INTEGRATIONS, ...INTEGRATIONS];
  const [paused, setPaused] = useState(false);

  return (
    <div
      style={{
        overflow: "hidden",
        position: "relative",
        padding: "4px 0",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: "linear-gradient(to right, #ffffff, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: "linear-gradient(to left, #ffffff, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`marquee-track${paused ? " paused" : ""}`}>
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 10,
              background: item.bg,
              border: `1px solid ${item.color}22`,
              whiteSpace: "nowrap",
              flexShrink: 0,
              cursor: "default",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.color,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: item.color,
                fontFamily: T.bodyFont,
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ILLUSTRATIONS ────────────────────────────────────────────────────────────
export function AnalyticsIllustration({ active }: { active: boolean }) {
  const lines = [78, 62, 85, 55, 92, 70, 88];
  return (
    <div style={{ padding: 24, height: "100%" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.muted,
          fontFamily: T.bodyFont,
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Revenue Analytics
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
        {lines.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: "20%" }}
            animate={{ height: active ? `${h}%` : "20%" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
            style={{
              flex: 1,
              background: i === lines.length - 1 ? T.accent : `${T.accent}50`,
              borderRadius: "4px 4px 0 0",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        {[
          { label: "MRR", val: "$124K" },
          { label: "Growth", val: "+18%" },
        ].map(({ label, val }) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: T.accentLight,
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <div style={{ fontSize: 10, color: T.muted, fontFamily: T.bodyFont }}>
              {label}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: T.accent,
                fontFamily: T.bodyFont,
              }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntegrationsIllustration({ active }: { active: boolean }) {
  const items = ["Stripe", "Slack", "GitHub", "Notion"];
  return (
    <div style={{ padding: 24, height: "100%" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.muted,
          fontFamily: T.bodyFont,
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Connected Apps
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: active ? 1 : 0, x: active ? 0 : -12 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              background: T.subtle,
              borderRadius: 8,
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.green,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: T.text,
                fontFamily: T.bodyFont,
              }}
            >
              {name}
            </span>
            <div style={{ marginLeft: "auto" }}>
              <Check style={{ width: 13, height: 13, color: T.green }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SecurityIllustration({ active }: { active: boolean }) {
  return (
    <div style={{ padding: 24, height: "100%" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.muted,
          fontFamily: T.bodyFont,
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Security Center
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          paddingTop: 8,
        }}
      >
        <motion.div
          animate={{ scale: active ? [1, 1.06, 1] : 1 }}
          transition={{
            duration: 1.2,
            repeat: active ? Infinity : 0,
            repeatDelay: 1.5,
          }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: active ? `${T.accent}15` : T.subtle,
            border: `2px solid ${active ? T.accent : T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.4s ease",
          }}
        >
          <Lock
            style={{ width: 30, height: 30, color: active ? T.accent : T.muted }}
          />
        </motion.div>
        <div style={{ display: "flex", gap: 8 }}>
          {["SOC 2", "GDPR", "HIPAA"].map((badge) => (
            <div
              key={badge}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                background: active ? `${T.accent}12` : T.subtle,
                border: `1px solid ${active ? T.accent : T.border}`,
                fontSize: 10,
                fontWeight: 600,
                color: active ? T.accent : T.muted,
                fontFamily: T.bodyFont,
                transition: "all 0.4s ease",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 12,
            color: active ? T.green : T.muted,
            fontFamily: T.bodyFont,
            fontWeight: 500,
            transition: "color 0.4s ease",
          }}
        >
          {active ? "All systems secure" : "Checking systems..."}
        </div>
      </div>
    </div>
  );
}

export function CollaborationIllustration({ active }: { active: boolean }) {
  const avatars = [
    { initials: "AL", color: "#6366f1" },
    { initials: "MR", color: "#ec4899" },
    { initials: "JK", color: "#f97316" },
    { initials: "SW", color: "#22c55e" },
  ];
  const messages = [
    { text: "Ship it! Looks great 🚀", from: "AL" },
    { text: "Tests pass, ready to merge", from: "MR" },
  ];
  return (
    <div style={{ padding: 24, height: "100%" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.muted,
          fontFamily: T.bodyFont,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Team Activity
      </div>
      <div style={{ display: "flex", gap: -6, marginBottom: 14 }}>
        {avatars.map((a, i) => (
          <motion.div
            key={a.initials}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: active ? 1 : 0.5, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: a.color,
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              fontFamily: T.bodyFont,
              marginLeft: i > 0 ? -8 : 0,
            }}
          >
            {a.initials}
          </motion.div>
        ))}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: T.subtle,
            border: `2px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: T.muted,
            fontFamily: T.bodyFont,
            marginLeft: -8,
          }}
        >
          +12
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={msg.from}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            style={{
              padding: "8px 12px",
              background: T.subtle,
              borderRadius: 10,
              borderBottomLeftRadius: 3,
              fontSize: 12,
              color: T.text,
              fontFamily: T.bodyFont,
            }}
          >
            <span style={{ fontWeight: 600, color: T.accent }}>
              {msg.from} ·{" "}
            </span>
            {msg.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FeatureIllustration({
  featureKey,
  active,
}: {
  featureKey: string;
  active: boolean;
}) {
  if (featureKey === "analytics")
    return <AnalyticsIllustration active={active} />;
  if (featureKey === "integrations")
    return <IntegrationsIllustration active={active} />;
  if (featureKey === "security")
    return <SecurityIllustration active={active} />;
  if (featureKey === "collaboration")
    return <CollaborationIllustration active={active} />;
  return null;
}

// ─── DASHBOARD MOCKUP ─────────────────────────────────────────────────────────
export function DashboardMockup() {
  const bars = [68, 82, 54, 91, 73, 88, 61, 95, 79, 85, 70, 93];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          background: "#fafafa",
          borderBottom: `1px solid ${T.border}`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#fc5b57", "#fdbe2b", "#27c840"].map((c) => (
            <div
              key={c}
              style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#f4f4f5",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              padding: "3px 16px",
              fontSize: 11,
              color: T.muted,
              fontFamily: T.bodyFont,
              fontWeight: 500,
            }}
          >
            app.nexus.io/dashboard
          </div>
        </div>
      </div>

      <div style={{ display: "flex", height: 340 }}>
        <div
          style={{
            width: 176,
            borderRight: `1px solid ${T.border}`,
            padding: "16px 0",
            background: "#fafafa",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "0 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.text,
                fontFamily: T.bodyFont,
              }}
            >
              Nexus
            </span>
          </div>

          {[
            { label: "Overview", icon: BarChart3, active: true },
            { label: "Analytics", icon: TrendingUp, active: false },
            { label: "Activity", icon: Activity, active: false },
            { label: "Security", icon: Lock, active: false },
            { label: "Team", icon: Users, active: false },
          ].map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              style={{
                padding: "7px 14px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: active ? T.accentLight : "transparent",
                borderRight: active ? `2px solid ${T.accent}` : "2px solid transparent",
                marginRight: active ? -1 : 0,
                cursor: "pointer",
              }}
            >
              <Icon
                style={{
                  width: 14,
                  height: 14,
                  color: active ? T.accent : T.muted,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: active ? T.accent : T.muted,
                  fontWeight: active ? 600 : 400,
                  fontFamily: T.bodyFont,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: 16, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              { label: "MRR", value: "$124.8K", delta: "+18.2%", up: true },
              { label: "DAU", value: "47,291", delta: "+9.4%", up: true },
              { label: "Churn", value: "1.2%", delta: "-0.3%", up: false },
            ].map(({ label, value, delta, up }) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: T.muted,
                    fontFamily: T.bodyFont,
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: T.text,
                    fontFamily: T.bodyFont,
                    marginBottom: 2,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: up ? T.green : T.red,
                    fontFamily: T.bodyFont,
                  }}
                >
                  {delta}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: T.muted,
                fontFamily: T.bodyFont,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Revenue — 12m
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                height: 90,
              }}
            >
              {bars.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${h}%`,
                      borderRadius: "3px 3px 0 0",
                      background: i === 11 ? T.accent : `${T.accent}40`,
                      transition: "height 0.3s ease",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 7,
                      color: T.muted,
                      fontFamily: T.bodyFont,
                    }}
                  >
                    {months[i].slice(0, 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
export const STATS = [
  {
    prefix: "$",
    target: 124800,
    suffix: "",
    label: "Monthly Recurring Revenue",
    sub: "median customer",
  },
  {
    prefix: "",
    target: 47291,
    suffix: "+",
    label: "Daily Active Users",
    sub: "across all customers",
  },
  {
    prefix: "",
    target: 99.98,
    suffix: "%",
    label: "Uptime SLA",
    sub: "last 12 months",
    decimals: 2,
  },
  {
    prefix: "",
    target: 2400000,
    suffix: "+",
    label: "API Calls / Day",
    sub: "peak throughput",
  },
];

export const PLANS = [
  {
    name: "Starter",
    price: "$0",
    per: "forever free",
    features: [
      "Up to 3 team members",
      "5 projects",
      "Basic analytics",
      "Community support",
      "1,000 API calls/day",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Growth",
    price: "$49",
    per: "per month, billed annually",
    features: [
      "Up to 25 team members",
      "Unlimited projects",
      "Full analytics suite",
      "200+ integrations",
      "Priority support",
      "100,000 API calls/day",
      "SSO & SAML",
    ],
    cta: "Start 14-day trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "volume pricing",
    features: [
      "Unlimited team members",
      "Dedicated infrastructure",
      "Custom SLA",
      "Audit logs",
      "HIPAA compliance",
      "Dedicated CSM",
      "On-prem option",
    ],
    cta: "Talk to sales",
    popular: false,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "We cut our analytics infrastructure cost by 60% and our team finally has a single source of truth. Nexus paid for itself in the first month.",
    name: "Sofia Andersson",
    title: "VP Engineering, Forma",
    avatar: "#6366f1",
    rating: 5,
  },
  {
    quote:
      "The integrations ecosystem is unreal. We were up and running with Stripe, Slack, and GitHub in under 20 minutes. Zero configuration headaches.",
    name: "Marcus Reyes",
    title: "CTO, Orbit Labs",
    avatar: "#0ea5e9",
    rating: 5,
  },
  {
    quote:
      "SOC 2 compliance used to be a 6-month project. With Nexus it was table stakes on day one. Our enterprise sales cycle dropped from 90 days to 30.",
    name: "Lena Fischer",
    title: "Head of Product, Meridian",
    avatar: "#22c55e",
    rating: 5,
  },
];

export const FEATURES = [
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Deep insights, zero guesswork",
    desc: "Real-time dashboards that surface what matters. Track MRR, churn, DAU, and custom events with sub-second latency across your entire customer base.",
    color: "#6366f1",
  },
  {
    key: "integrations",
    label: "Integrations",
    icon: Plug,
    title: "Connect every tool you love",
    desc: "One-click integrations with Stripe, Slack, GitHub, Notion and 200+ more. Your workflow, automated — no custom code required.",
    color: "#0ea5e9",
  },
  {
    key: "security",
    label: "Security",
    icon: Shield,
    title: "Enterprise-grade by default",
    desc: "SOC 2 Type II, GDPR, and HIPAA compliant out of the box. SSO, RBAC, audit logs, and end-to-end encryption — no bolt-ons.",
    color: "#22c55e",
  },
  {
    key: "collaboration",
    label: "Collaboration",
    icon: Users,
    title: "Your team, in perfect sync",
    desc: "Real-time presence, comment threads, review workflows, and granular permissions. Built for teams that move fast without breaking things.",
    color: "#f97316",
  },
];

export function StickyFeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        FEATURES.length - 1,
        Math.floor(v * FEATURES.length)
      );
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const activeFeature = FEATURES[activeIndex];

  return (
    <div ref={containerRef} style={{ height: `${FEATURES.length * 100}vh`, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 40px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: feature selector */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
              }}
            >
              Core Features
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.1,
                marginBottom: 40,
              }}
            >
              Everything you need to grow
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                const isActive = activeIndex === i;
                return (
                  <motion.div
                    key={f.key}
                    animate={{
                      scale: isActive ? 1.0 : 0.97,
                      background: isActive ? T.accentLight : T.subtle,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{
                      borderRadius: 14,
                      padding: "18px 20px",
                      border: `1px solid ${isActive ? `${T.accent}30` : T.border}`,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: isActive ? `${f.color}18` : "#fff",
                          border: `1px solid ${isActive ? f.color + "30" : T.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.35s ease",
                        }}
                      >
                        <Icon
                          style={{
                            width: 18,
                            height: 18,
                            color: isActive ? f.color : T.muted,
                            transition: "color 0.35s ease",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: isActive ? T.text : T.muted,
                            fontFamily: T.bodyFont,
                            marginBottom: 4,
                            transition: "color 0.35s ease",
                          }}
                        >
                          {f.title}
                        </div>
                        <motion.div
                          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: T.muted,
                              lineHeight: 1.6,
                              fontFamily: T.bodyFont,
                            }}
                          >
                            {f.desc}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: illustration */}
          <div>
            <motion.div
              key={activeFeature.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                background: "#fafafa",
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                minHeight: 280,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.03), 0 16px 48px ${activeFeature.color}15, 0 4px 12px rgba(0,0,0,0.06)`,
                overflow: "hidden",
              }}
            >
              <FeatureIllustration featureKey={activeFeature.key} active={true} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
