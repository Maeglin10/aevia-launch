"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── COLORS ──────────────────────────── */
export const C = {
  bg: "#02040a",
  bgCard: "#0a0f1a",
  cyan: "#06b6d4",       // cyan-500
  cyanLight: "#22d3ee",  // cyan-400
  blue: "#2563eb",       // blue-600
  blueLight: "#3b82f6",  // blue-500
  blueMid: "#60a5fa",    // blue-400
  accent: "#06b6d4",
  white: "#ffffff",
  black: "#000000",
} as const;

/* ── FONTS ───────────────────────────── */
export const F = {
  sans: "Inter, system-ui, sans-serif",
} as const;

/* ── NAV LINKS ───────────────────────── */
export const NAV_LINKS = [
  { label: "Home", href: "/templates/impact-50" },
  { label: "About", href: "/templates/impact-50/about" },
  { label: "Contact", href: "/templates/impact-50/contact" },
  { label: "Legal", href: "/templates/impact-50/legal" },
] as const;

/* ── GLOBAL CSS ──────────────────────── */
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
`;

/* ── REUSABLE: Reveal ────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
