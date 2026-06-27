"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const C = {
  bg: "#faf8f5",
  bgDark: "#1a0f08",
  text: "#1a0f08",
  textMuted: "#7c6050",
  accent: "#c9a87c",
  accentDark: "#a8825a",
  accentLight: "#f7ede0",
  warm: "#2c1810",
  white: "#ffffff",
  border: "#e8d9c8",
  shadow: "0 2px 14px rgba(26,15,8,0.08)",
  shadowLg: "0 16px 48px rgba(26,15,8,0.14)",
  // Aliases for auto-generated sub-pages
  gold: "#c9a87c",
  muted: "#7c6050",
};

export const FONT = "'Cormorant Garamond', Georgia, serif";
export const FONT_BODY = "'Jost', system-ui, sans-serif";

export const STATS = [
  { value: "12 ans", label: "d'expérience" },
  { value: "400+", label: "mariages immortalisés" },
  { value: "4.9 ★", label: "avis clients" },
  { value: "100%", label: "digital delivery" },
];

export const PRESTATIONS = [
  {
    titre: "Reportage mariage complet",
    description: "De la préparation jusqu'au dîner — chaque instant capturé avec discrétion et poésie. Livraison 500+ photos HD retouchées.",
    icon: "💍",
  },
  {
    titre: "Engagement & lovesession",
    description: "Une séance photo en amoureux avant le grand jour. Portraits naturels et complices dans un lieu qui vous ressemble.",
    icon: "🌹",
  },
  {
    titre: "Portraits famille",
    description: "Capturez la douceur et la joie de votre famille. Séances en studio ou en extérieur, enfants bienvenus.",
    icon: "👨‍👩‍👧",
  },
  {
    titre: "Studio book perso",
    description: "Mettez en valeur votre personnalité avec un book professionnel ou artistique en studio à Paris.",
    icon: "📸",
  },
  {
    titre: "Événements corporate",
    description: "Conférences, soirées d'entreprise, séminaires — une couverture professionnelle qui valorise votre image.",
    icon: "🏢",
  },
  {
    titre: "Retraitement & albums",
    description: "Albums haut de gamme façonnés à la main, retouche artistique avancée, tirage fine art sur commande.",
    icon: "📖",
  },
];

export const TEMOIGNAGES = [
  {
    couple: "Sophie & Julien",
    texte: "Léa a su saisir chaque émotion de notre journée avec une sensibilité incroyable. Les photos sont au-delà de nos espérances. Chaque image raconte notre histoire.",
    mariage: "Château de Vaux-le-Vicomte · Juin 2024",
    note: 5,
  },
  {
    couple: "Marie & Thomas",
    texte: "Professionnalisme, discrétion, talent. On a oublié qu'on était photographiés tellement Léa est naturelle. Un souvenir inoubliable en images.",
    mariage: "Moulin de la Récupe · Septembre 2024",
    note: 5,
  },
  {
    couple: "Amira & Karim",
    texte: "De la love session à notre mariage, Léa nous a accompagnés avec bienveillance. Elle a su mettre en valeur notre culture et nos traditions. Merci du fond du cœur.",
    mariage: "Paris 16e · Avril 2024",
    note: 5,
  },
];

export const GALERIE = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
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
