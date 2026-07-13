"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export const MODELS = [
  { name: "The Chronos 01", cat: "Rose Gold Edition", price: "€24,500", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200" },
  { name: "Deep Sea Master", cat: "Titanium / Ceramic", price: "€18,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200" },
  { name: "Lunar Phase", cat: "Platinum / Leather", price: "€42,000", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200" },
];

export const NAV_LINKS = [
  { label: "The Movement", href: "/templates/impact-60/movement" },
  { label: "Collections", href: "/templates/impact-60/collections" },
  { label: "Atelier", href: "/templates/impact-60/atelier" },
] as const;

// ─── REVEAL COMPONENT ────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── PARALLAX IMAGE COMPONENT ────────────────────────────────────────────────
export function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}

// ─── GLOBAL STYLES & STYLE INJECTOR ──────────────────────────────────────────
export const GLOBAL_STYLES = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 24s linear infinite;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-60-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-60-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-60-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
