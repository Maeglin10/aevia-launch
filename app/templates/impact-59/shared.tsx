"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export const RETREATS = [
  {
    id: 1,
    name: "Sonoran Silence",
    location: "Arizona Desert, USA",
    duration: "7 Nights",
    price: "from $4,200",
    theme: "Stillness",
    season: "Oct–Apr",
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop",
    desc: "Seven days in an ancient desert landscape. Dawn somatic practice, silent midday walks, and evening fire ceremonies. No agenda. No schedule beyond your own unfolding.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Private desert sanctuary"],
      ["Practice", "Somatic therapy + silence"],
      ["Meals", "Biodynamic plant cuisine"],
    ],
  },
  {
    id: 2,
    name: "Icelandic Deep Reset",
    location: "Westfjords, Iceland",
    duration: "5 Nights",
    price: "from $5,800",
    theme: "Clarity",
    season: "Jun–Aug",
    img: "https://images.unsplash.com/photo-1540555700478-4be709347c63?w=1200&q=80",
    desc: "Geothermal pools at midnight beneath the aurora. Five days designed to dissolve the residue of over-functioning and restore access to your own thinking.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Isolated fjord lodge"],
      ["Practice", "Breathwork + thermal immersion"],
      ["Meals", "Icelandic foraged cuisine"],
    ],
  },
  {
    id: 3,
    name: "Kyoto Forest Immersion",
    location: "Arashiyama, Japan",
    duration: "6 Nights",
    price: "from $6,100",
    theme: "Presence",
    season: "Mar–May",
    img: "https://images.unsplash.com/photo-1571017853234-0b220809f68a?w=1200&q=80",
    desc: "Shinrin-yoku through Arashiyama bamboo groves. Zen walking sequences with a lineage-trained teacher. Tea ceremony as contemplative practice.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Private ryokan retreat"],
      ["Practice", "Zen practice + forest bathing"],
      ["Meals", "Kaiseki plant cuisine"],
    ],
  },
];

export const LINEAGE = [
  {
    name: "Dr. Clara Metz",
    role: "Founder & Lead Clinician",
    bio: "Former neuropsychologist specialized in burnout recovery, Clara developed the Luminal Method after a decade in clinical practice.",
    avatar: "CM",
  },
  {
    name: "Master Juro Nakano",
    role: "Contemplative Guide",
    bio: "A Zen monk with 30 years of practice in the Rinzai lineage, Juro oversees all meditation and walking sequences.",
    avatar: "JN",
  },
  {
    name: "Elena Rossi",
    role: "Somatic Therapist",
    bio: "Expert in nervous system regulation and trauma release, Elena leads the somatic re-patterning sessions.",
    avatar: "ER",
  },
];

import { Sparkles, Sun, Activity } from "lucide-react";

export const SCIENTIFIC_PILLARS = [
  {
    title: "Neuro-Plasticity",
    desc: "Our environments are chosen to maximize cognitive flexibility through novel sensory input and radical reduction of digital noise.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Circadian Sync",
    desc: "Protocols are timed to natural light cycles to reset the hypothalamic-pituitary-adrenal axis and restore sleep architecture.",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    title: "Somatic Recall",
    desc: "Body-based interventions that target the vagus nerve to down-regulate high-stress arousal states permanently.",
    icon: <Activity className="w-5 h-5" />,
  },
];

export const APPLICATION_STEPS = [
  {
    step: "01",
    title: "Intake Survey",
    desc: "A detailed questionnaire mapping your current psychological and physiological baseline.",
  },
  {
    step: "02",
    title: "Inquiry Call",
    desc: "A 45-minute consultation with a guide to ensure alignment with our method and group dynamics.",
  },
  {
    step: "03",
    title: "Placement",
    desc: "Selection of the retreat landscape best suited to your specific restorative needs.",
  },
  {
    step: "04",
    title: "Preparation",
    desc: "A 21-day pre-arrival protocol to begin the process of digital and cognitive deceleration.",
  },
];

export const NAV_LINKS = [
  { label: "Retreats", href: "/templates/impact-59/retreats" },
  { label: "The_Method", href: "/templates/impact-59/method" },
  { label: "Lineage", href: "/templates/impact-59/lineage" },
  { label: "Apply", href: "/templates/impact-59/apply" },
] as const;

// ─── REVEAL COMPONENT ────────────────────────────────────────────────────────
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
    >
      {children}
    </motion.div>
  );
}

// ─── COUNTER COMPONENT ────────────────────────────────────────────────────────
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
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
      {count}
      {suffix}
    </span>
  );
}

// ─── STYLE INJECTOR ──────────────────────────────────────────────────────────
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  
  body {
    background-color: #f8f5f0;
    color: #2a2a2a;
    font-family: 'Lora', Georgia, serif;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-59-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-59-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-59-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
