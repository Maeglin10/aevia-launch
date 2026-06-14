"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

export const MENUS = [
  {
    id: 1,
    category: "The Beginning",
    items: [
      {
        name: "Osciètre Dore",
        desc: "30g Iranian caviar, blini au beurre noisette, crème d'oursin",
        price: "€ 110",
      },
      {
        name: "Langoustines Rôties",
        desc: "Langoustines de Saint-Gilles, beurre blanc à l'estragon, gel citron yuzu",
        price: "€ 68",
      },
      {
        name: "Foie Gras Mi-Cuit",
        desc: "Torchon de foie gras, pain brioché, confiture de figue noire",
        price: "€ 52",
      },
    ],
  },
  {
    id: 2,
    category: "The Core",
    items: [
      {
        name: "Bœuf Wagyu A5",
        desc: "Entrecôte 200g, jus de truffe noire, gratin dauphinois, haricots verts fins",
        price: "€ 145",
      },
      {
        name: "Turbot Sauvage",
        desc: "Turbot de ligne, beurre mousseux aux câpres, pommes château, épinards",
        price: "€ 98",
      },
      {
        name: "Pigeon en Deux Services",
        desc: "Filet rôti à la braise, cuisse confite, sauce au sang, gnocchi truffés",
        price: "€ 115",
      },
    ],
  },
  {
    id: 3,
    category: "The Finale",
    items: [
      {
        name: "Soufflé au Grand Marnier",
        desc: "Soufflé chaud, glace vanille Bourbon, tuiles dentelles",
        price: "€ 38",
      },
      {
        name: "Chocolat Araguani",
        desc: "Fondant 72%, sorbet cacao, praliné feuilleté, fleur de sel",
        price: "€ 32",
      },
      {
        name: "Tarte Fine aux Pommes",
        desc: "Pâte feuilletée caramélisée, pommes Golden, crème Calvados",
        price: "€ 28",
      },
    ],
  },
];

export const WINE_PAIRINGS = [
  {
    title: "Old World Journey",
    wines: 9,
    focus: "Classic European Vintages",
    price: "€ 145",
  },
  {
    title: "Grand Cru Experience",
    wines: 7,
    focus: "Rare & Auction Exclusive",
    price: "€ 290",
  },
  {
    title: "Artisan Natural",
    wines: 8,
    focus: "Minimal Intervention Gems",
    price: "€ 120",
  },
];

export const ARTISANS = [
  {
    name: "Le Potager d'Antony",
    specialty: "Rare heirloom vegetables",
    loc: "Versailles",
  },
  {
    name: "Maison Bordier",
    specialty: "Artisan baratte butter",
    loc: "Saint-Malo",
  },
  {
    name: "Pêcherie de la Cotinière",
    specialty: "Line-caught wild fish",
    loc: "Oléron",
  },
];

// ── Reveal Component ──
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
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={{ paddingBottom: "0.15em" }} // Prevents descender clipping
    >
      {children}
    </motion.div>
  );
}

// ── Counter Component ──
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

// ── Magnetic Button ──
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
export const GLOBAL_STYLES = `
  .premium-theme {
    --gold: #b8860b;
  }
`;
