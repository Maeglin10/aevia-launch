// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Coffee, Thermometer } from "lucide-react";

export const BEANS = [
  {
    id: 1,
    name: "VOID_BREW",
    origin: "Ethiopia, Yirgacheffe",
    notes: ["Blueberry", "Bergamot", "Jasmine"],
    roast: "Light",
    process: "Washed",
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
  },
  {
    id: 2,
    name: "SOLAR_FLARE",
    origin: "Colombia, Huila",
    notes: ["Chocolate", "Caramel", "Orange"],
    roast: "Medium",
    process: "Natural",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: 3,
    name: "LUNAR_ROAST",
    origin: "Sumatra, Mandheling",
    notes: ["Earthy", "Spicy", "Tobacco"],
    roast: "Dark",
    process: "Giling Basah",
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
  },
];

export const BREW_METHODS = [
  { name: "V60", temp: "92°C", time: "3:30", ratio: "1:15" },
  { name: "AEROPRESS", temp: "85°C", time: "2:00", ratio: "1:12" },
  { name: "CHEMEX", temp: "94°C", time: "5:00", ratio: "1:16" },
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
