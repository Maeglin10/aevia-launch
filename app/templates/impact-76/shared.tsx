// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Compass, Activity, Zap } from "lucide-react";

export const PROJECTS = [
  {
    id: 1,
    title: "VILLA_AETHER",
    location: "Swiss Alps, CH",
    year: "2025",
    type: "Residential",
    area: "850m²",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    desc: "A brutalist concrete sanctuary suspended over the valley. Zero-carbon geothermal integration.",
  },
  {
    id: 2,
    title: "KINETIC_TOWER",
    location: "Dubai, UAE",
    year: "2024",
    type: "Commercial",
    area: "42,000m²",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    desc: "Adaptive facade systems that react to solar intensity. Real-time thermal optimization.",
  },
  {
    id: 3,
    title: "VOID_STUDIO",
    location: "Tokyo, JP",
    year: "2026",
    type: "Cultural",
    area: "1,200m²",
    img: "https://picsum.photos/seed/realestate/1200/750",
    desc: "Subterranean art gallery utilizing natural light diffraction through glass fissures.",
  },
];

export const PHILOSOPHY = [
  {
    title: "Precision",
    desc: "Every millimeter is calculated through generative algorithms for structural peak efficiency.",
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: "Entropy",
    desc: "Embracing the natural aging of raw materials. Concrete, steel, and glass in dialogue.",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    title: "Sustenance",
    desc: "Autonomous energy systems. Passive cooling. Reclaimed water cycles.",
    icon: <Zap className="w-5 h-5" />,
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
