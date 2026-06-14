// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

export const CLASSES = [
  {
    id: 1,
    title: "Vinyasa Flow",
    level: "All Levels",
    duration: "60 min",
    intensity: "Medium",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    desc: "A dynamic sequence of postures that breath-synchronizes movement to build heat and flexibility.",
  },
  {
    id: 2,
    title: "Yin & Sound Bath",
    level: "Beginner",
    duration: "90 min",
    intensity: "Low",
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80",
    desc: "Deep connective tissue release paired with meditative crystal bowl frequencies.",
  },
  {
    id: 3,
    title: "Ashtanga Primary",
    level: "Advanced",
    duration: "75 min",
    intensity: "High",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    desc: "The traditional rigorous series focusing on breath, bandhas, and drishti for internal purification.",
  },
  {
    id: 4,
    title: "Hatha Awakening",
    level: "All Levels",
    duration: "60 min",
    intensity: "Low",
    img: "https://images.unsplash.com/photo-1510894347713-fc3ad69df939?w=800&q=80",
    desc: "Foundational postures held longer to align the body and quiet the central nervous system.",
  },
];

export const TEACHERS = [
  {
    name: "Maya Sterling",
    specialty: "Vinyasa & Meditation",
    avatar: "MS",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  },
  {
    name: "Julian Zen",
    specialty: "Ashtanga & Pranayama",
    avatar: "JZ",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Elena Rose",
    specialty: "Yin & Sound Healing",
    avatar: "ER",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export const SCHEDULE = [
  {
    time: "07:00",
    class: "Hatha Awakening",
    teacher: "Maya Sterling",
    type: "Morning",
  },
  {
    time: "09:00",
    class: "Vinyasa Flow",
    teacher: "Maya Sterling",
    type: "Flow",
  },
  {
    time: "12:30",
    class: "Lunch Express",
    teacher: "Julian Zen",
    type: "Power",
  },
  {
    time: "17:30",
    class: "Ashtanga Primary",
    teacher: "Julian Zen",
    type: "Advanced",
  },
  {
    time: "19:30",
    class: "Yin & Sound Bath",
    teacher: "Elena Rose",
    type: "Relax",
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
