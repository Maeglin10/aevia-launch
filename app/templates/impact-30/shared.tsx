"use client";

import { motion } from "framer-motion";
import { Smile, Star, Award, Users, ThumbsUp, Shield, Heart } from "lucide-react";

export const C = {
  bg: "#FFFFFF",
  bgLight: "#e8f4fd",
  bgSection: "#f8fcff",
  text: "#1a2744",
  textMuted: "#5a6a8a",
  accent: "#00b894",
  accentDark: "#00a381",
  accentLight: "#e0f9f4",
  white: "#FFFFFF",
  border: "#dce9f5",
  shadow: "0 4px 24px rgba(26,39,68,0.08)",
  shadowLg: "0 12px 48px rgba(26,39,68,0.14)",
  whiteTrans: "rgba(255, 255, 255, 0.95)",
};

export const FONT = "'Inter', system-ui, sans-serif";

export function AnimatedTooth() {
  return (
    <motion.div
      style={{ position: "relative", width: 320, height: 360 }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Glow pulse ring */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`,
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating tooth SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        width={200}
        height={240}
        style={{ position: "relative", zIndex: 1, margin: "0 auto", display: "block" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M100 18 C58 18, 28 44, 26 82 C24 112, 34 134, 39 162 C44 188, 47 218, 60 227 C70 235, 81 221, 88 200 C94 184, 100 170, 100 170 C100 170, 106 184, 112 200 C119 221, 130 235, 140 227 C153 218, 156 188, 161 162 C166 134, 176 112, 174 82 C172 44, 142 18, 100 18 Z"
          fill={C.white}
          stroke={C.accent}
          strokeWidth={3.5}
          filter="drop-shadow(0 10px 28px rgba(0,184,148,0.28))"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <motion.path
          d="M80 170 C78 190, 74 210, 68 222 M120 170 C122 190, 126 210, 132 222"
          fill="none"
          stroke={`${C.accent}40`}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <motion.path
          d="M72 42 C65 57, 62 78, 66 98"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <motion.path
          d="M80 128 L95 146 L122 112"
          fill="none"
          stroke={C.accent}
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.2 }}
        />
      </motion.svg>

      <motion.div
        style={{
          position: "absolute",
          top: 18,
          right: 8,
          background: C.accent,
          color: C.white,
          borderRadius: 12,
          padding: "7px 15px",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: FONT,
          boxShadow: "0 4px 16px rgba(0,184,148,0.38)",
          zIndex: 2,
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        Agréé ARS
      </motion.div>
    </motion.div>
  );
}

export const SERVICES = [
  {
    icon: <Smile size={28} color="#00b894" />,
    title: "Blanchiment dentaire",
    desc: "Technologie Zoom! pour un résultat jusqu'à 8 teintes plus blanc en une seule séance.",
    price: "À partir de 350 €",
    tag: "Populaire",
  },
  {
    icon: <Shield size={28} color="#00b894" />,
    title: "Implants dentaires",
    desc: "Remplacement naturel et durable de vos dents manquantes avec une garantie 10 ans.",
    price: "À partir de 1 200 €",
    tag: "Premium",
  },
  {
    icon: <Star size={28} color="#00b894" />,
    title: "Orthodontie Invisalign",
    desc: "Aligneurs transparents discrets pour corriger votre sourire sans bagues metalliques.",
    price: "À partir de 2 800 €",
    tag: "Invisible",
  },
  {
    icon: <Heart size={28} color="#00b894" />,
    title: "Soins pédiatriques",
    desc: "Cabinet dédié enfants, soins préventifs et éducation bucco-dentaire dès 3 ans.",
    price: "À partir de 45 €",
    tag: "Famille",
  },
];

export const STATS = [
  { value: "12 000+", label: "Patients satisfaits", icon: <Users size={24} color="#fff" /> },
  { value: "4.9 / 5", label: "Note moyenne Google", icon: <Star size={24} color="#fff" /> },
  { value: "15 ans", label: "D'expérience", icon: <Award size={24} color="#fff" /> },
  { value: "98 %", label: "Taux de satisfaction", icon: <ThumbsUp size={24} color="#fff" /> },
];

export const TESTIMONIALS = [
  {
    name: "Sophie M.",
    treatment: "Blanchiment + Facettes",
    before: "Je n'osais plus sourire à cause de mes dents jaunies depuis des années.",
    after: "Résultat incroyable ! 8 teintes plus blanc. Je souris à nouveau en toute confiance. L'équipe est d'une gentillesse exceptionnelle.",
    stars: 5,
    date: "Mars 2025",
  },
  {
    name: "Thomas B.",
    treatment: "Implant dentaire",
    before: "J'avais perdu une dent depuis 3 ans et j'en étais très complexé au quotidien.",
    after: "L'implant est posé depuis 6 mois — aucune différence avec mes vraies dents. Dr. Laurent est tout simplement exceptionnelle !",
    stars: 5,
    date: "Janvier 2025",
  },
  {
    name: "Amina K.",
    treatment: "Aligneurs Invisalign",
    before: "Mes dents chevauchaient et j'évitais de sourire sur toutes les photos.",
    after: "18 mois de traitement et mon sourire est parfaitement aligné. Les gouttières sont vraiment très discrètes.",
    stars: 5,
    date: "Décembre 2024",
  },
];

export const TEAM = [
  { name: "Dr. Claire Laurent", role: "Chirurgienne-dentiste", specialty: "Implantologie & Chirurgie orale", experience: "18 ans", initials: "CL", color: "#4a90d9" },
  { name: "Dr. Marc Dupont", role: "Orthodontiste", specialty: "Aligneurs Invisalign certifié Diamond", experience: "12 ans", initials: "MD", color: "#7c3aed" },
  { name: "Dr. Sofia Ramirez", role: "Chirurgienne-dentiste", specialty: "Esthétique dentaire & Blanchiment", experience: "9 ans", initials: "SR", color: "#00b894" },
];

export const PLANS = [
  {
    name: "Essentiel",
    price: "45",
    period: "/ consultation",
    desc: "Pour un bilan complet et les soins courants du quotidien.",
    features: ["Bilan bucco-dentaire complet", "Détartrage professionnel", "Radiographie panoramique", "Conseils hygiène personnalisés", "Devis gratuit sous 24h"],
    cta: "Prendre RDV",
    highlight: false,
  },
  {
    name: "Sourire",
    price: "350",
    period: "traitement complet",
    desc: "Pour un sourire éclatant et parfaitement entretenu.",
    features: ["Tout le plan Essentiel", "Blanchiment Zoom! professionnel", "Polissage dentaire intensif", "Kit d'entretien domicile inclus", "Suivi 6 mois inclus", "Garantie résultat"],
    cta: "Choisir ce plan",
    highlight: true,
  },
  {
    name: "Premium",
    price: "Sur Devis",
    period: "traitement sur mesure",
    desc: "Pour les transformations complètes et l'implantologie avancée.",
    features: ["Tout le plan Sourire", "Implants dentaires Straumann", "Facettes céramiques Emax", "Orthodontie Invisalign Diamond", "Suivi illimité 2 ans", "Financement 0 % disponible"],
    cta: "Demander un devis",
    highlight: false,
  },
];

export const FAQS = [
  {
    q: "Le blanchiment dentaire est-il remboursé par la Sécurité Sociale ?",
    a: "Non, le blanchiment esthétique n'est pas pris en charge par la Sécurité Sociale. Certaines mutuelles offrent cependant une prise en charge partielle. Nous vous fournissons un devis détaillé et proposons des solutions de financement adaptées.",
  },
  {
    q: "Combien de temps dure un traitement Invisalign ?",
    a: "La durée varie selon la complexité du cas, de 6 à 24 mois en moyenne. Lors de votre consultation initiale gratuite, le Dr. Dupont établira un plan de traitement personnalisé avec une estimation précise.",
  },
  {
    q: "Les implants dentaires sont-ils douloureux ?",
    a: "La pose d'implants se fait sous anesthésie locale — vous ne ressentirez aucune douleur pendant l'intervention. Des suites légères (gonflements, sensibilités) sont normales les 2-3 premiers jours, gérables avec des antidouleurs classiques.",
  },
  {
    q: "À quelle fréquence consulter un dentiste ?",
    a: "Nous recommandons une visite de contrôle tous les 6 mois. Un détartrage professionnel est recommandé au minimum une fois par an, voire deux fois selon votre situation bucco-dentaire.",
  },
  {
    q: "Acceptez-vous les urgences dentaires ?",
    a: "Oui, nous réservons des créneaux d'urgence chaque jour. En cas de douleur aiguë ou de traumatisme, appelez-nous au 01 42 56 78 90 — nous vous prendrons en charge dans les plus brefs délais.",
  },
];
