"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flower2, Sun, TreeDeciduous, Snowflake } from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  bg: "#fdf9ee",
  bgAlt: "#f5efdc",
  bgDark: "#1e3a0f",
  bgDark2: "#2d5016",
  text: "#1a2e08",
  textLight: "#5a6e48",
  textMuted: "#8a9a78",
  accent: "#f0c040",
  accentDark: "#c8a020",
  earth: "#8b5e3c",
  earthLight: "#b8845a",
  white: "#ffffff",
  border: "#ddd5ba",
  shadow: "rgba(45, 80, 22, 0.12)",
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'Merriweather Sans', system-ui, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
export const seasons = ["spring", "summer", "fall", "winter"] as const;
export type Season = (typeof seasons)[number];

export const seasonData: Record<
  Season,
  { label: string; icon: React.ReactNode; color: string; items: { name: string; desc: string; emoji: string }[] }
> = {
  spring: {
    label: "Printemps",
    icon: <Flower2 size={18} />,
    color: "#7bb85a",
    items: [
      { name: "Asperges vertes", desc: "Tendres et croquantes, récoltées à l'aube", emoji: "🌿" },
      { name: "Radis multicolores", desc: "Rose, blanc et violet — croquant garanti", emoji: "🌈" },
      { name: "Épinards baby", desc: "Doux et riches en fer, parfaits crus", emoji: "🥬" },
      { name: "Petits pois", desc: "Sucrés et frais, à croquer directement", emoji: "🫛" },
      { name: "Fraises Gariguette", desc: "Parfumées et juteuses, cuites au soleil", emoji: "🍓" },
      { name: "Ail des ours", desc: "Sauvage, récolté dans nos bois adjacents", emoji: "🌱" },
    ],
  },
  summer: {
    label: "Été",
    icon: <Sun size={18} />,
    color: "#f0c040",
    items: [
      { name: "Tomates anciennes", desc: "12 variétés — noir de Crimée, Green Zebra, Cœur de bœuf", emoji: "🍅" },
      { name: "Courgettes", desc: "Rondes et longues, cueillie avant maturité", emoji: "🥒" },
      { name: "Maïs doux", desc: "Bicolore, à cuire le jour même", emoji: "🌽" },
      { name: "Melons charentais", desc: "Sucrés et odorants, elevés sous filets", emoji: "🍈" },
      { name: "Haricots verts fins", desc: "Croquants, sans fil, récoltés à la main", emoji: "🫘" },
      { name: "Basilic grand vert", desc: "Aromatique et copieux, en bouquet", emoji: "🌿" },
    ],
  },
  fall: {
    label: "Automne",
    icon: <TreeDeciduous size={18} />,
    color: "#c4703a",
    items: [
      { name: "Courges Butternut", desc: "Fondantes et sucrées, parfaites en velouté", emoji: "🎃" },
      { name: "Pommes reinette", desc: "Acidulées et croquantes, verger biologique", emoji: "🍎" },
      { name: "Champignons cultivés", desc: "Shiitake, pleurotes et Paris rosé", emoji: "🍄" },
      { name: "Poireaux", desc: "Doux et tendres, blancs sur 30 cm", emoji: "🧅" },
      { name: "Noix fraîches", desc: "Récoltées de nos noyers centenaires", emoji: "🪨" },
      { name: "Betteraves chioggia", desc: "Rayées rose et blanc, crues ou rôties", emoji: "🟣" },
    ],
  },
  winter: {
    label: "Hiver",
    icon: <Snowflake size={18} />,
    color: "#6ea8d0",
    items: [
      { name: "Choux de Bruxelles", desc: "Tendres et légèrement sucrés après gelée", emoji: "🥦" },
      { name: "Carottes de sable", desc: "Extra-sucrées, élevées en pleine terre", emoji: "🥕" },
      { name: "Endives bressanes", desc: "Blanches et tendres, culture traditionnelle", emoji: "🌿" },
      { name: "Mâche", desc: "Douce et délicate, sans assaisonnement", emoji: "🥗" },
      { name: "Topinambours", desc: "Rustiques et gourmands, en velouté ou sautés", emoji: "🌰" },
      { name: "Céleris-raves", desc: "Denses et parfumés, crus en rémoulade", emoji: "⚪" },
    ],
  },
};

export const testimonials = [
  {
    name: "Isabelle Marchand",
    role: "Critique gastronomique, Le Monde",
    text: "Une expérience sensorielle rare. La cuisine de Gabriel Renaud dialogue avec la saison d'une façon que peu de chefs osent encore. Chaque plat est une révélation.",
    rating: 5,
    avatar: "IM",
  },
  {
    name: "Thomas & Élise Bonnet",
    role: "Anniversaire de mariage",
    text: "Le menu Prestige nous a transportés. L'accord mets et vins était d'une justesse absolue. Le service, d'une discrétion et d'une attention incomparables.",
    rating: 5,
    avatar: "TE",
  },
  {
    name: "Chef Olivier Payet",
    role: "3 étoiles Michelin, Marseille",
    text: "Gabriel est l'un des rares chefs à avoir su préserver l'âme d'un terroir tout en proposant une cuisine résolument contemporaine. Une adresse incontournable.",
    rating: 5,
    avatar: "OP",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accent }} />
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
    </div>
  );
}
