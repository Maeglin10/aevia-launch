"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const C = {
  bg: "#f8fafb",
  bgSection: "#eef3f8",
  text: "#0d2137",
  textMuted: "#5a7490",
  accent: "#1e3a5f",
  accentDark: "#122438",
  accentLight: "#ddeaf7",
  green: "#1a9e6f",
  greenLight: "#d6f0e7",
  white: "#ffffff",
  border: "#d0dfe9",
  shadow: "0 2px 12px rgba(13,33,55,0.07)",
  shadowLg: "0 16px 48px rgba(13,33,55,0.14)",
};

export const FONT = "'Montserrat', system-ui, sans-serif";
export const FONT_BODY = "'Lato', system-ui, sans-serif";

export const STATS = [
  { value: "25 ans", label: "d'existence" },
  { value: "350", label: "clients accompagnés" },
  { value: "98%", label: "taux de satisfaction" },
  { value: "12", label: "experts comptables" },
];

export const MISSIONS = [
  {
    titre: "Comptabilité & Bilan",
    description: "Tenue comptable rigoureuse, élaboration des comptes annuels et bilans conformes aux normes françaises.",
    icon: "📊",
    tag: "Essentiel",
  },
  {
    titre: "Fiscalité & Déclarations",
    description: "Optimisation fiscale légale, déclarations IS/IR, TVA, liasse fiscale et veille réglementaire permanente.",
    icon: "📋",
    tag: "Optimisation",
  },
  {
    titre: "Paie & Social",
    description: "Gestion complète de la paie, déclarations sociales, DSN, conseils en droit du travail pour vos équipes.",
    icon: "👥",
    tag: "RH",
  },
  {
    titre: "Création d'entreprise",
    description: "Accompagnement de A à Z : choix de la structure juridique, business plan, prévisionnel, formalités.",
    icon: "🚀",
    tag: "Création",
  },
  {
    titre: "Audit & Commissariat",
    description: "Commissariat aux comptes, audit légal et contractuel, due diligence pour cessions et acquisitions.",
    icon: "🔍",
    tag: "Audit",
  },
  {
    titre: "Conseil en gestion",
    description: "Tableaux de bord, prévisions de trésorerie, analyse de rentabilité et pilotage stratégique de votre activité.",
    icon: "📈",
    tag: "Stratégie",
  },
];

export const TEMOIGNAGES = [
  {
    nom: "Pierre Moreau",
    poste: "PDG, Moreau Distribution",
    texte: "Ledger & Associés nous accompagne depuis 10 ans. Leur expertise fiscale nous a permis d'économiser des sommes considérables. Réactifs, précis, toujours disponibles.",
    note: 5,
  },
  {
    nom: "Isabelle Fouquet",
    poste: "Directrice, Cabinet IF Conseil",
    texte: "J'ai créé mon cabinet de conseil avec leur aide. Du business plan à l'optimisation de ma rémunération, ils m'ont guidée à chaque étape. Un partenaire de confiance.",
    note: 5,
  },
  {
    nom: "David Lemaire",
    poste: "Gérant, Restaurant Le Pressoir",
    texte: "Enfin un cabinet qui parle simplement. Ils m'expliquent mes chiffres sans jargon et me font des recommandations concrètes. Mon résultat a progressé de 18% en 2 ans.",
    note: 5,
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
