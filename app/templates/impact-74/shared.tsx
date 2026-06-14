// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, Activity, Box, Globe } from "lucide-react";

export const THREATS = [
  {
    id: "TR-942",
    source: "Moscow, RU",
    target: "London, UK",
    type: "DDoS",
    intensity: "CRITICAL",
    timestamp: "14:22:01",
  },
  {
    id: "TR-943",
    source: "Beijing, CN",
    target: "New York, US",
    type: "Phishing",
    intensity: "HIGH",
    timestamp: "14:22:15",
  },
  {
    id: "TR-944",
    source: "Unknown",
    target: "Frankfurt, DE",
    type: "Ransomware",
    intensity: "MEDIUM",
    timestamp: "14:22:42",
  },
  {
    id: "TR-945",
    source: "Kiev, UA",
    target: "Paris, FR",
    type: "Infiltration",
    intensity: "CRITICAL",
    timestamp: "14:23:10",
  },
];

export const AUDIT_LOGS = [
  {
    event: "Kernel Integrity Check",
    status: "PASSED",
    latency: "2ms",
    node: "CORE_ALPHA",
  },
  {
    event: "Inbound traffic filtered",
    status: "SECURE",
    latency: "14ms",
    node: "EDGE_04",
  },
  {
    event: "Authentication attempt",
    status: "DENIED",
    latency: "42ms",
    node: "AUTH_GATE",
  },
  {
    event: "Database sync",
    status: "SYNCED",
    latency: "112ms",
    node: "DB_CLU_01",
  },
];

export const NODES = [
  {
    title: "Quantum Shield",
    desc: "Hardware-level encryption using quantum random number generators.",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    title: "Neural Audit",
    desc: "AI-driven behavioral analysis for zero-day threat detection.",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    title: "Air-Gap Vault",
    desc: "Physical data isolation for critical institutional assets.",
    icon: <Box className="w-4 h-4" />,
  },
  {
    title: "Edge Sentinel",
    desc: "Global CDN with integrated WAF and sub-millisecond filtering.",
    icon: <Globe className="w-4 h-4" />,
  },
];

export function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = to / 70;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setCount(to);
        clearInterval(t);
      } else {
        setCount(Math.floor(cur));
      }
    }, 16);
    return () => clearInterval(t);
  }, [isInView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function MagneticBtn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}
