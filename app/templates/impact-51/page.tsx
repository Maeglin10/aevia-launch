"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Plug,
  Shield,
  Users,
  Check,
  Star,
  ArrowRight,
  Zap,
  Mail,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
  TrendingUp,
  Activity,
  Lock,
  MessageSquare,
} from "lucide-react";

// ─── FONT INJECTION ───────────────────────────────────────────────────────────

function FontInjector() {
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

// ─── TOKENS ───────────────────────────────────────────────────────────────────

const T = {
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

// ─── REVEAL ───────────────────────────────────────────────────────────────────

function Reveal({
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

function AnimatedCounter({
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
        const formatted = decimals > 0
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

const INTEGRATIONS = [
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

function IntegrationMarquee() {
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
      {/* fade edges */}
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

// ─── PRODUCT DASHBOARD MOCKUP ─────────────────────────────────────────────────

function DashboardMockup() {
  const bars = [68, 82, 54, 91, 73, 88, 61, 95, 79, 85, 70, 93];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
      {/* Window chrome */}
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
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
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
        {/* Sidebar */}
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

        {/* Main content */}
        <div style={{ flex: 1, padding: 16, overflow: "hidden" }}>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
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
                <div style={{ fontSize: 10, color: T.muted, fontFamily: T.bodyFont, marginBottom: 3 }}>
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

          {/* Bar chart */}
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
                      background:
                        i === 11
                          ? T.accent
                          : `${T.accent}40`,
                      transition: "height 0.3s ease",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 7,
                      color: T.muted,
                      fontFamily: T.bodyFont,
                      transform: "none",
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

// ─── FEATURE ILLUSTRATIONS ────────────────────────────────────────────────────

function AnalyticsIllustration({ active }: { active: boolean }) {
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
            <div style={{ fontSize: 10, color: T.muted, fontFamily: T.bodyFont }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.accent, fontFamily: T.bodyFont }}>
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsIllustration({ active }: { active: boolean }) {
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
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: T.bodyFont }}>
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

function SecurityIllustration({ active }: { active: boolean }) {
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
          transition={{ duration: 1.2, repeat: active ? Infinity : 0, repeatDelay: 1.5 }}
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
          <Lock style={{ width: 30, height: 30, color: active ? T.accent : T.muted }} />
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

function CollaborationIllustration({ active }: { active: boolean }) {
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
            <span style={{ fontWeight: 600, color: T.accent }}>{msg.from} · </span>
            {msg.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── STICKY FEATURE SEQUENCE ──────────────────────────────────────────────────

const FEATURES = [
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

function FeatureIllustration({
  featureKey,
  active,
}: {
  featureKey: string;
  active: boolean;
}) {
  if (featureKey === "analytics") return <AnalyticsIllustration active={active} />;
  if (featureKey === "integrations") return <IntegrationsIllustration active={active} />;
  if (featureKey === "security") return <SecurityIllustration active={active} />;
  if (featureKey === "collaboration") return <CollaborationIllustration active={active} />;
  return null;
}

function StickyFeatureSection() {
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

// ─── PRICING CARD WITH SPRING TILT ────────────────────────────────────────────

function PricingCard({
  plan,
  popular,
}: {
  plan: {
    name: string;
    price: string;
    per: string;
    features: string[];
    cta: string;
  };
  popular: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const translateY = useSpring(0, { stiffness: 300, damping: 25 });
  const shadowScale = useSpring(1, { stiffness: 300, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rotateX.set(-dy * 2.5);
      rotateY.set(dx * 2.5);
    },
    [rotateX, rotateY]
  );

  const handleMouseEnter = useCallback(() => {
    translateY.set(-8);
    shadowScale.set(1.4);
  }, [translateY, shadowScale]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    translateY.set(0);
    shadowScale.set(1);
  }, [rotateX, rotateY, translateY, shadowScale]);

  return (
    <div style={{ perspective: 1000, position: "relative" }}>
      {popular && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            background: T.accent,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 16px",
            borderRadius: 100,
            letterSpacing: "0.06em",
            fontFamily: T.bodyFont,
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          translateY,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pulsing glow for popular */}
        {popular && (
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0 2px ${T.accent}40`,
                `0 0 0 6px ${T.accent}18`,
                `0 0 0 2px ${T.accent}40`,
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 18,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        <div
          style={{
            background: popular ? T.accent : "#fff",
            border: popular ? "none" : `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "32px 28px",
            position: "relative",
            zIndex: 1,
            boxShadow: popular
              ? `0 8px 32px ${T.accent}30`
              : "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: popular ? "rgba(255,255,255,0.75)" : T.muted,
              fontFamily: T.bodyFont,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {plan.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: popular ? "#fff" : T.text,
                fontFamily: T.headingFont,
                letterSpacing: "-0.04em",
              }}
            >
              {plan.price}
            </span>
          </div>

          <div
            style={{
              fontSize: 13,
              color: popular ? "rgba(255,255,255,0.6)" : T.muted,
              fontFamily: T.bodyFont,
              marginBottom: 28,
            }}
          >
            {plan.per}
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {plan.features.map((feat) => (
              <li
                key={feat}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  color: popular ? "rgba(255,255,255,0.85)" : "#374151",
                  fontFamily: T.bodyFont,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: popular ? "rgba(255,255,255,0.2)" : T.accentLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <Check
                    style={{
                      width: 10,
                      height: 10,
                      color: popular ? "#fff" : T.accent,
                    }}
                  />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: T.bodyFont,
              transition: "opacity 0.2s",
              ...(popular
                ? {
                    background: "#fff",
                    color: T.accent,
                    border: "none",
                  }
                : {
                    background: T.subtle,
                    color: T.text,
                    border: `1px solid ${T.border}`,
                  }),
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {plan.cta}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────

const STATS = [
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

// ─── PLANS ────────────────────────────────────────────────────────────────────

const PLANS = [
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

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: 60,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
        <span
          style={{
            fontFamily: T.headingFont,
            fontWeight: 700,
            fontSize: 17,
            color: T.text,
            letterSpacing: "-0.02em",
          }}
        >
          Nexus
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {["Product", "Integrations", "Pricing", "Docs"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: T.muted,
              textDecoration: "none",
              fontFamily: T.bodyFont,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = T.text)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = T.muted)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a
          href="#"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: T.muted,
            textDecoration: "none",
            fontFamily: T.bodyFont,
          }}
        >
          Sign in
        </a>
        <button
          style={{
            background: T.text,
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: T.bodyFont,
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = T.text;
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Start free trial
        </button>
      </div>
    </motion.nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7], [0, 1, 0.6]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.15], [0.96, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div
      ref={heroRef}
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ y: textY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Reveal delay={0.05}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: T.accentLight,
                border: `1px solid ${T.accent}30`,
                borderRadius: 100,
                padding: "6px 14px",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.accent,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.accent,
                  fontFamily: T.bodyFont,
                }}
              >
                Trusted by 50,000+ teams worldwide
              </span>
            </div>
          </Reveal>
        </div>

        {/* Headline */}
        <div style={{ textAlign: "center", padding: "0 40px", maxWidth: 880, margin: "0 auto" }}>
          <Reveal delay={0.12}>
            <h1
              style={{
                fontSize: "clamp(42px, 6vw, 80px)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                marginBottom: 24,
              }}
            >
              The platform that makes{" "}
              <span
                style={{
                  color: T.accent,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                SaaS scale
              </span>{" "}
              feel inevitable.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: T.muted,
                lineHeight: 1.65,
                maxWidth: 580,
                margin: "0 auto 36px",
                fontFamily: T.bodyFont,
                fontWeight: 400,
              }}
            >
              Analytics, integrations, security, and collaboration — unified in one product. Ship faster, grow smarter, sleep better.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <button
                style={{
                  background: T.text,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.bodyFont,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "transform 0.15s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.background = T.text;
                }}
              >
                Start for free
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                style={{
                  background: "transparent",
                  color: T.text,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.bodyFont,
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#a1a1aa";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = T.border;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                View demo
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.34}>
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                fontFamily: T.bodyFont,
              }}
            >
              No credit card required · Free 14-day trial · Cancel anytime
            </p>
          </Reveal>
        </div>
      </motion.div>

      {/* Dashboard mockup — scroll-driven reveal */}
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          padding: "48px 40px 0",
          overflow: "visible",
        }}
      >
        <motion.div
          style={{
            y: mockupY,
            opacity: mockupOpacity,
            scale: mockupScale,
          }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function NexusPremiumSaaS() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: T.bodyFont,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <FontInjector />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          flexWrap: "wrap",
          background: T.subtle,
        }}
      >
        {[
          "Y Combinator",
          "Sequoia-backed",
          "Forbes Cloud 100",
          "4.9 ★ on G2",
          "SOC 2 Certified",
        ].map((item) => (
          <span
            key={item}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.muted,
              fontFamily: T.bodyFont,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px 80px",
        }}
      >
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
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
              By the numbers
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: T.text,
                fontFamily: T.headingFont,
              }}
            >
              Numbers that speak for themselves
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div
                style={{
                  padding: "40px 32px",
                  background: "#fff",
                  borderRight: i < STATS.length - 1 ? `1px solid ${T.border}` : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(36px, 4vw, 52px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: T.text,
                    fontFamily: T.headingFont,
                    marginBottom: 8,
                  }}
                >
                  <AnimatedCounter
                    target={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.text,
                    fontFamily: T.bodyFont,
                    marginBottom: 4,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    fontFamily: T.bodyFont,
                  }}
                >
                  {stat.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES STICKY SEQUENCE ─────────────────────────────────────── */}
      <div id="product">
        <StickyFeatureSection />
      </div>

      {/* ── INTEGRATIONS MARQUEE ─────────────────────────────────────────── */}
      <section
        id="integrations"
        style={{
          padding: "100px 0 80px",
          background: T.subtle,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48, padding: "0 40px" }}>
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
              Integrations
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: T.text,
                fontFamily: T.headingFont,
                marginBottom: 12,
              }}
            >
              Connects with every tool in your stack
            </h2>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                fontFamily: T.bodyFont,
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              200+ one-click integrations. Native webhooks. GraphQL and REST APIs. Works everywhere you already work.
            </p>
          </div>
        </Reveal>

        <div style={{ padding: "8px 0" }}>
          <IntegrationMarquee />
        </div>

        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: T.accent,
                textDecoration: "none",
                fontFamily: T.bodyFont,
              }}
            >
              Browse all integrations
              <ChevronRight style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px 80px",
        }}
      >
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
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
              Pricing
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: T.text,
                fontFamily: T.headingFont,
                marginBottom: 14,
              }}
            >
              Start free. Scale when you're ready.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                fontFamily: T.bodyFont,
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              No hidden fees. Cancel anytime. Switch plans in one click.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            alignItems: "start",
          }}
        >
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <PricingCard plan={plan} popular={plan.popular} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontSize: 13,
              color: T.muted,
              fontFamily: T.bodyFont,
            }}
          >
            All plans include SSL, DDoS protection, and daily backups.{" "}
            <a
              href="#"
              style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}
            >
              Compare full features →
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: T.subtle,
          borderTop: `1px solid ${T.border}`,
          padding: "100px 0 80px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
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
                Testimonials
              </div>
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: T.text,
                  fontFamily: T.headingFont,
                }}
              >
                Loved by engineering teams
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        style={{ width: 14, height: 14, fill: "#facc15", color: "#facc15" }}
                      />
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      color: "#374151",
                      lineHeight: 1.7,
                      fontFamily: T.bodyFont,
                      flex: 1,
                    }}
                  >
                    "{t.quote}"
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: t.avatar,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: T.bodyFont,
                      }}
                    >
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.text,
                          fontFamily: T.bodyFont,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: T.muted,
                          fontFamily: T.bodyFont,
                        }}
                      >
                        {t.title}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px 80px",
        }}
      >
        <Reveal>
          <div
            style={{
              background: T.text,
              borderRadius: 24,
              padding: "80px 64px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background texture dots */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(${T.accent}25 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            />

            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: `${T.accent}25`,
                  border: `1px solid ${T.accent}40`,
                  borderRadius: 100,
                  padding: "6px 14px",
                  marginBottom: 24,
                }}
              >
                <Zap style={{ width: 12, height: 12, color: T.accent }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.accent,
                    fontFamily: T.bodyFont,
                  }}
                >
                  Free forever plan available
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  fontFamily: T.headingFont,
                  marginBottom: 16,
                  lineHeight: 1.1,
                }}
              >
                Start building today.
                <br />
                Your first week is on us.
              </h2>

              <p
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: 420,
                  margin: "0 auto 40px",
                  lineHeight: 1.65,
                  fontFamily: T.bodyFont,
                }}
              >
                Join 50,000+ teams shipping faster with Nexus. No credit card, no commitment.
              </p>

              {!submitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSubmitted(true);
                  }}
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    maxWidth: 480,
                    margin: "0 auto",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    style={{
                      flex: 1,
                      minWidth: 220,
                      padding: "13px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      fontSize: 14,
                      fontFamily: T.bodyFont,
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: T.accent,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "13px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: T.bodyFont,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      whiteSpace: "nowrap",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = T.accentDark)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = T.accent)
                    }
                  >
                    <Mail style={{ width: 15, height: 15 }} />
                    Get started
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: 12,
                    padding: "14px 24px",
                    fontSize: 15,
                    color: T.green,
                    fontWeight: 600,
                    fontFamily: T.bodyFont,
                  }}
                >
                  <Check style={{ width: 18, height: 18 }} />
                  You're in — we'll be in touch shortly!
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${T.border}`,
          background: "#fafafa",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 40px 32px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr repeat(3, 1fr)",
              gap: 40,
              marginBottom: 48,
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
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
                    fontFamily: T.headingFont,
                    fontWeight: 700,
                    fontSize: 16,
                    color: T.text,
                  }}
                >
                  Nexus
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: T.muted,
                  lineHeight: 1.65,
                  maxWidth: 220,
                  fontFamily: T.bodyFont,
                  marginBottom: 20,
                }}
              >
                The SaaS platform that grows with your team. Analytics, integrations, security — unified.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#fff",
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.muted,
                      textDecoration: "none",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#a1a1aa";
                      el.style.color = T.text;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = T.border;
                      el.style.color = T.muted;
                    }}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Changelog", "Roadmap"],
              },
              {
                title: "Resources",
                links: ["Docs", "API Reference", "Blog", "Community", "Status"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Privacy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: T.bodyFont,
                    marginBottom: 16,
                  }}
                >
                  {col.title}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{
                          fontSize: 13,
                          color: T.muted,
                          textDecoration: "none",
                          fontFamily: T.bodyFont,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = T.text)
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color = T.muted)
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div
            style={{
              borderTop: `1px solid ${T.border}`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.muted,
                fontFamily: T.bodyFont,
              }}
            >
              © 2026 Nexus, Inc. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    textDecoration: "none",
                    fontFamily: T.bodyFont,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = T.text)
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = T.muted)
                  }
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
