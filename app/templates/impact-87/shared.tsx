"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const C = {
  bg: "#f8f8f8",
  bgDark: "#111827",
  text: "#111827",
  textMuted: "#6b7280",
  accent: "#ef4444",
  accentDark: "#dc2626",
  accentLight: "#fee2e2",
  white: "#ffffff",
  border: "#e5e7eb",
  shadow: "0 2px 12px rgba(0,0,0,0.08)",
  shadowLg: "0 16px 48px rgba(0,0,0,0.15)",
};

export const FONT = "'Barlow Condensed', system-ui, sans-serif";
export const FONT_BODY = "'Inter', system-ui, sans-serif";

export const STATS = [
  { value: "5 ans", label: "d'existence" },
  { value: "800+", label: "membres actifs" },
  { value: "40", label: "cours/semaine" },
  { value: "8", label: "coachs certifiés" },
];

export const COURS = [
  {
    nom: "CrossFit WOD",
    description: "Le cœur du programme. Entraînements variés haute intensité pour développer force, endurance et puissance.",
    icon: "🏋️",
    niveau: "Tous niveaux",
  },
  {
    nom: "Weightlifting",
    description: "Maîtrisez l'arraché et l'épaulé-jeté avec nos coachs certifiés FFHALTÉRO.",
    icon: "🥇",
    niveau: "Intermédiaire+",
  },
  {
    nom: "HIIT Cardio",
    description: "30 minutes de cardio fractionné intense pour brûler les graisses et booster le métabolisme.",
    icon: "⚡",
    niveau: "Tous niveaux",
  },
  {
    nom: "Mobilité & Récup",
    description: "Étirements actifs, foam rolling et yoga fonctionnel pour récupérer et prévenir les blessures.",
    icon: "🧘",
    niveau: "Tous niveaux",
  },
  {
    nom: "Open Gym",
    description: "Accès libre aux équipements pour pratiquer à votre rythme. Coaching disponible sur demande.",
    icon: "🔓",
    niveau: "Tous niveaux",
  },
  {
    nom: "Kids CrossFit",
    description: "Programme adapté 8-15 ans. Développement athlétique par le jeu, la coordination et la confiance en soi.",
    icon: "⭐",
    niveau: "8-15 ans",
  },
];

export const AVIS = [
  {
    nom: "Thomas R.",
    texte: "Iron Club a changé ma vie. En 8 mois j'ai perdu 18 kg et gagné une vraie communauté. Les coachs sont au top, toujours disponibles.",
    note: 5,
    depuis: "Membre depuis 2 ans",
  },
  {
    nom: "Camille D.",
    texte: "J'avais peur de me lancer dans le CrossFit mais l'accueil était parfait. Le coaching individualisé m'a permis de progresser sans me blesser.",
    note: 5,
    depuis: "Membre depuis 1 an",
  },
  {
    nom: "Marc L.",
    texte: "La meilleure salle de Lyon sans hésitation. Équipements pro, box propre, ambiance incroyable. Les WOD du matin à 6h sont dingues !",
    note: 5,
    depuis: "Membre depuis 3 ans",
  },
];

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
