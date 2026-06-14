"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Radio, Box, Cpu, Zap } from "lucide-react";

export const ROOMS = [
  {
    id: 1,
    name: "The Obsidian Atrium",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    area: "120m²",
    tech: "LiDAR Scan 4.0",
  },
  {
    id: 2,
    name: "Lumina Gallery",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80",
    area: "85m²",
    tech: "Neural Rendering",
  },
  {
    id: 3,
    name: "Skyline Suite",
    img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1600&q=80",
    area: "65m²",
    tech: "Digital Twin v2",
  },
  {
    id: 4,
    name: "Zenith Lounge",
    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=80",
    area: "45m²",
    tech: "360° Volumetric",
  },
];

export const SPECS = [
  { label: "Scan Precision", val: "±1mm", icon: <Radio className="w-4 h-4" /> },
  { label: "Polygon Density", val: "1.2B", icon: <Box className="w-4 h-4" /> },
  { label: "Latency Buffer", val: "<20ms", icon: <Zap className="w-4 h-4" /> },
  {
    label: "Rendering Engine",
    val: "RTX v5",
    icon: <Cpu className="w-4 h-4" />,
  },
];

export const ASSETS = [
  {
    city: "New York",
    name: "Tribeca Penthouse",
    price: "$24M",
    status: "Available",
  },
  {
    city: "London",
    name: "The Knightsbridge",
    price: "£18M",
    status: "In Escrow",
  },
  {
    city: "Dubai",
    name: "Palm Jumeirah",
    price: "AED 90M",
    status: "Off Market",
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
