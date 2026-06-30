// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

export const STREAMS = [
  {
    id: 1,
    title: "NEON_NIGHTS // 4K 60FPS // CHILL BEATS",
    streamer: "AURA_VOID",
    viewers: "12.4K",
    tags: ["Music", "Chill", "Coding"],
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    status: "LIVE",
  },
  {
    id: 2,
    title: "BUILDING THE FUTURE // Q_PAY INTEGRATION",
    streamer: "DEV_X",
    viewers: "4.2K",
    tags: ["Tech", "Finance", "Web3"],
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    status: "LIVE",
  },
  {
    id: 3,
    title: "CYBERPUNK 2077 // PATH TRACING MAX",
    streamer: "GLITCH_ONE",
    viewers: "28.1K",
    tags: ["Gaming", "4K", "NVIDIA"],
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
    status: "LIVE",
  },
  {
    id: 4,
    title: "MORNING BREATH // ZEN_SPACE RITUAL",
    streamer: "MAYA_ZEN",
    viewers: "850",
    tags: ["Wellness", "Yoga", "Mindful"],
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    status: "LIVE",
  },
];

export const CHAT_LOGS = [
  {
    user: "ZEN_MASTER",
    msg: "LFG! The quality is insane today.",
    color: "#3b82f6",
  },
  {
    user: "DEV_GOD",
    msg: "Are you using the new QuantumPay API?",
    color: "#10b981",
  },
  { user: "CYBER_PUNK", msg: "Wait, is this really 8K?", color: "#ec4899" },
  {
    user: "AURA_FAN",
    msg: "Subbing for the 12th month straight! 💜",
    color: "#8b5cf6",
  },
];

export const CREATORS = [
  {
    name: "AURA_VOID",
    sub: "1.2M",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  },
  {
    name: "GLITCH_ONE",
    sub: "2.4M",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "MAYA_ZEN",
    sub: "850K",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

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
    [x, y]
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
