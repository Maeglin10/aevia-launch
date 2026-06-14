"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export const SERVICES = [
  {
    id: 1,
    name: "Architectural Nails",
    tag: "Sculpted & Structured",
    price: "from €85",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
    desc: "A minimalist approach to nail architecture. Focused on structural health and clean aesthetic lines.",
  },
  {
    id: 2,
    name: "Velvet Lashes",
    tag: "Couture Volume",
    price: "from €120",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80",
    desc: "Weightless silk extensions applied with surgical precision for a natural yet profound gaze.",
  },
  {
    id: 3,
    name: "Pure Facial Ritual",
    tag: "Bio-Active Glow",
    price: "from €145",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
    desc: "Cellular rejuvenation using botanical extracts and lymphatic drainage techniques.",
  },
  {
    id: 4,
    name: "Brow Architecture",
    tag: "Lamination & Tint",
    price: "from €65",
    img: "https://picsum.photos/seed/beauty/1200/750",
    desc: "Framing the face through geometric mapping and custom pigment blending.",
  },
];

export const PROTOCOLS = [
  {
    title: "Consultation",
    desc: "Mapping facial geometry and identifying skin bio-types.",
  },
  {
    title: "Preparation",
    desc: "Deep thermal cleansing using ozonated steam.",
  },
  {
    title: "Infusion",
    desc: "Active serum delivery through micro-current technology.",
  },
  {
    title: "Regeneration",
    desc: "Cold-pressed botanical mask for immediate recovery.",
  },
];

export const REVIEWS = [
  {
    author: "Elena V.",
    text: "The most clinical yet calming environment I've ever experienced. My nails have never been this healthy.",
    role: "Paris",
  },
  {
    author: "Sophie L.",
    text: "L'Atelier is more like a laboratory than a salon. The precision is unmatched.",
    role: "Lyon",
  },
  {
    author: "Marc A.",
    text: "The facial ritual is a total sensory reset. My skin feels architectural.",
    role: "Bordeaux",
  },
];

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
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
