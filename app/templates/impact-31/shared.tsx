"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sunrise, Wind, Heart, Award, Leaf, Users, Star, Clock, Moon } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: "#faf7f2",
  bgLight: "#f2ede4",
  bgSection: "#fdf9f5",
  text: "#3d2b1f",
  textMuted: "#7a6558",
  accent: "#c0614a",
  accentDark: "#a84f3a",
  accentLight: "#fbeae6",
  sage: "#6b8f6b",
  sageDark: "#4f6e4f",
  sageLight: "#e8f0e8",
  white: "#FFFFFF",
  border: "#e8ddd4",
  cream: "#fdf6ec",
  shadow: "0 4px 24px rgba(61,43,31,0.08)",
  shadowLg: "0 12px 48px rgba(61,43,31,0.14)",
};

export const FONT_HEADING = "'Playfair Display', Georgia, serif";
export const FONT_BODY = "'Lato', system-ui, sans-serif";

// ─── Breathing Circle (Hero Animation) ────────────────────────────────────────
export function BreathingCircle() {
  const [phaseIdx, setPhaseIdx] = useState(0);

  const phases = [
    { label: "Inspirez", duration: 4000, scale: 1.35 },
    { label: "Retenez", duration: 2000, scale: 1.35 },
    { label: "Expirez", duration: 6000, scale: 1 },
  ];

  useEffect(() => {
    const current = phases[phaseIdx];
    const t = setTimeout(() => {
      setPhaseIdx((prev) => (prev + 1) % 3);
    }, current.duration);
    return () => clearTimeout(t);
  }, [phaseIdx]);

  const current = phases[phaseIdx];

  return (
    <div style={{ position: "relative", width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <motion.div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: `2px solid ${C.accent}`,
          opacity: 0.18,
        }}
        animate={{ scale: current.scale * 1.1 }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      />
      {/* Middle ring */}
      <motion.div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: `1.5px solid ${C.sage}`,
          opacity: 0.25,
        }}
        animate={{ scale: current.scale * 1.05 }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      />
      {/* Main breathing circle */}
      <motion.div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 38%, ${C.accentLight}, ${C.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 48px rgba(192,97,74,0.35)`,
        }}
        animate={{ scale: current.scale }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      >
        {/* Lotus SVG inside */}
        <svg viewBox="0 0 80 80" width={56} height={56}>
          <motion.ellipse cx="40" cy="58" rx="14" ry="18" fill="rgba(255,255,255,0.9)" animate={{ scaleY: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="20" cy="46" rx="12" ry="17" fill="rgba(255,255,255,0.7)" transform="rotate(-30, 20, 46)" animate={{ rotate: [-30, -26, -30] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="60" cy="46" rx="12" ry="17" fill="rgba(255,255,255,0.7)" transform="rotate(30, 60, 46)" animate={{ rotate: [30, 26, 30] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="10" cy="58" rx="9" ry="13" fill="rgba(255,255,255,0.5)" transform="rotate(-55, 10, 58)" animate={{ rotate: [-55, -50, -55] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="70" cy="58" rx="9" ry="13" fill="rgba(255,255,255,0.5)" transform="rotate(55, 70, 58)" animate={{ rotate: [55, 50, 55] }} transition={{ duration: 3, repeat: Infinity }} />
        </svg>
      </motion.div>

      {/* Phase label */}
      <motion.div
        key={current.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "6px 18px",
          fontSize: 13,
          fontWeight: 700,
          color: C.accent,
          fontFamily: FONT_BODY,
          whiteSpace: "nowrap",
          boxShadow: C.shadow,
        }}
      >
        {current.label}
      </motion.div>
    </div>
  );
}

// ─── Floating Lotus ────────────────────────────────────────────────────────────
export function FloatingLotus() {
  return (
    <motion.div
      style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.12 }}
      animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" width={120} height={120}>
        <ellipse cx="60" cy="88" rx="22" ry="28" fill={C.accent} />
        <ellipse cx="32" cy="70" rx="18" ry="26" fill={C.accent} transform="rotate(-30, 32, 70)" />
        <ellipse cx="88" cy="70" rx="18" ry="26" fill={C.accent} transform="rotate(30, 88, 70)" />
        <ellipse cx="14" cy="86" rx="13" ry="20" fill={C.accent} transform="rotate(-55, 14, 86)" />
        <ellipse cx="106" cy="86" rx="13" ry="20" fill={C.accent} transform="rotate(55, 106, 86)" />
      </svg>
    </motion.div>
  );
}

// ─── Stats Ticker Data ─────────────────────────────────────────────────────────
export const STATS_TICKER = [
  { value: "850+", label: "Élèves actifs dans notre communauté", icon: <Users size={22} color={C.accent} /> },
  { value: "30+", label: "Cours dispensés chaque semaine", icon: <Clock size={22} color={C.accent} /> },
  { value: "11 ans", label: "D'expérience et d'enseignement", icon: <Award size={22} color={C.accent} /> },
  { value: "4.8★", label: "Note moyenne sur Google Reviews", icon: <Star size={22} color="#d4832a" fill="#d4832a" /> },
];

// ─── Services Data ─────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    name: "Hatha Yoga",
    level: "Débutant",
    levelBg: "#e8f0e8",
    levelColor: "#6b8f6b",
    bgIcon: "#e8f0e8",
    icon: <Leaf size={24} color="#6b8f6b" />,
    desc: "Le fondement de toute pratique. Postures alignées, respiration consciente et retour à l'essentiel. Idéal pour découvrir le yoga en douceur.",
    tags: ["Postures", "Respiration", "Alignement", "Relaxation"],
    duration: "75 min",
  },
  {
    name: "Méditation",
    level: "Tous niveaux",
    levelBg: "#f2ede4",
    levelColor: "#7a6558",
    bgIcon: "#fbeae6",
    icon: <Heart size={24} color="#c0614a" />,
    desc: "Techniques de pleine conscience pour apaiser le mental, réduire l'anxiété et cultiver une présence sereine dans le quotidien.",
    tags: ["Pleine conscience", "Visualisation", "Scan corporel", "Silence"],
    duration: "60 min",
  },
  {
    name: "Pilates Yoga",
    level: "Intermédiaire",
    levelBg: "#f2ede4",
    levelColor: "#7a6558",
    bgIcon: "#e8f0e8",
    icon: <Wind size={24} color="#6b8f6b" />,
    desc: "Fusion du contrôle musculaire pilates et de la fluidité du yoga pour un renforcement profond du centre du corps et une posture parfaite.",
    tags: ["Core", "Gainage", "Souplesse", "Posture"],
    duration: "60 min",
  },
  {
    name: "Pranayama",
    level: "Tous niveaux",
    levelBg: "#f2ede4",
    levelColor: "#7a6558",
    bgIcon: "#fbeae6",
    icon: <Sunrise size={24} color="#c0614a" />,
    desc: "L'art du contrôle du souffle : techniques ancestrales pour vitaliser l'énergie, purifier le corps énergétique et équilibrer le système nerveux.",
    tags: ["Nadi Shodhana", "Kapalabhati", "Ujjayi", "Énergie"],
    duration: "45 min",
  },
  {
    name: "Yin Yoga",
    level: "Tous niveaux",
    levelBg: "#f2ede4",
    levelColor: "#7a6558",
    bgIcon: "#e8f0e8",
    icon: <Moon size={24} color="#6b8f6b" />,
    desc: "Postures tenues longtemps pour assouplir les tissus profonds, libérer les tensions chroniques et entrer dans un état méditatif profond.",
    tags: ["Fascias", "Tenue longue", "Lâcher-prise", "Récupération"],
    duration: "75 min",
  },
  {
    name: "Retraite & Immersion",
    level: "Avancé",
    levelBg: "#fbeae6",
    levelColor: "#c0614a",
    bgIcon: "#fbeae6",
    icon: <Award size={24} color="#c0614a" />,
    desc: "Journées et week-ends immersifs dans notre espace dédié. Pratique intensive, alimentation consciente et cérémonies pour une transformation profonde.",
    tags: ["Week-end", "Intensif", "Cérémonies", "Nature"],
    duration: "1–3 jours",
  },
];

// ─── Instructors Data ──────────────────────────────────────────────────────────
export const INSTRUCTORS = [
  {
    name: "Emma Dubois",
    role: "Hatha & Yin Yoga",
    bio: "18 ans de pratique, certifiée RYT-500. Spécialiste du yoga thérapeutique et de la méditation pleine conscience, Emma crée des espaces de guérison profonde.",
    specialties: ["Hatha", "Yin", "Thérapeutique", "Méditation"],
    experience: "12 ans d'enseignement",
    cert: "RYT-500",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face",
    bgFrom: "#e8f0e8",
    bgTo: "#fdf9f5",
    accentColor: "#6b8f6b",
    initials: "ED",
  },
  {
    name: "Lucas Renaud",
    role: "Vinyasa & Ashtanga",
    bio: "Formé à Mysore auprès de maîtres indiens. Sa pratique dynamique et rigoureuse guide vers la maîtrise de soi, la force et la discipline intérieure.",
    specialties: ["Vinyasa", "Ashtanga", "Inversions", "Bandhas"],
    experience: "8 ans d'enseignement",
    cert: "RYT-300",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face",
    bgFrom: "#fbeae6",
    bgTo: "#fdf9f5",
    accentColor: "#c0614a",
    initials: "LR",
  },
  {
    name: "Amara Bah",
    role: "Kundalini & Pranayama",
    bio: "Experte en techniques respiratoires et en éveil de l'énergie kundalini. Elle accompagne les transformations profondes avec douceur et puissance.",
    specialties: ["Kundalini", "Pranayama", "Kriyas", "Mantras"],
    experience: "10 ans d'enseignement",
    cert: "KRI Level 2",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=240&h=240&fit=crop&crop=face",
    bgFrom: "#e8f0e8",
    bgTo: "#fbeae6",
    accentColor: "#9b7b6b",
    initials: "AB",
  },
  {
    name: "Sophie Moreau",
    role: "Yoga Nidra & Méditation",
    bio: "Psychologue et enseignante, Sophie marie neurosciences et sagesse yogique pour des pratiques de sommeil conscient et de réduction du stress.",
    specialties: ["Yoga Nidra", "MBSR", "Pleine conscience", "Stress"],
    experience: "7 ans d'enseignement",
    cert: "RYT-200 + MBSR",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&crop=face",
    bgFrom: "#fbeae6",
    bgTo: "#e8f0e8",
    accentColor: "#c0614a",
    initials: "SM",
  },
];

// ─── Week Schedule Data ────────────────────────────────────────────────────────
export const WEEK_SCHEDULE = [
  { day: "Lundi", time: "07h00", name: "Hatha Flow", level: "Débutant", teacher: "Emma D.", spots: 8, duration: "75 min", period: "morning", icon: <Sunrise size={16} color="#c0614a" /> },
  { day: "Lundi", time: "12h30", name: "Pranayama Express", level: "Tous niveaux", teacher: "Amara B.", spots: 12, duration: "45 min", period: "noon", icon: <Wind size={16} color="#6b8f6b" /> },
  { day: "Lundi", time: "19h00", name: "Vinyasa Power", level: "Intermédiaire", teacher: "Lucas R.", spots: 4, duration: "60 min", period: "evening", icon: <Wind size={16} color="#6b8f6b" /> },
  { day: "Mardi", time: "09h30", name: "Yin & Méditation", level: "Tous niveaux", teacher: "Sophie M.", spots: 12, duration: "75 min", period: "morning", icon: <Heart size={16} color="#c0614a" /> },
  { day: "Mardi", time: "18h00", name: "Pilates Yoga", level: "Intermédiaire", teacher: "Emma D.", spots: 6, duration: "60 min", period: "evening", icon: <Award size={16} color="#6b8f6b" /> },
  { day: "Mercredi", time: "07h00", name: "Kundalini Matin", level: "Tous niveaux", teacher: "Amara B.", spots: 10, duration: "60 min", period: "morning", icon: <Sunrise size={16} color="#c0614a" /> },
  { day: "Mercredi", time: "20h00", name: "Yoga Nidra", level: "Tous niveaux", teacher: "Sophie M.", spots: 14, duration: "60 min", period: "evening", icon: <Moon size={16} color="#6b8f6b" /> },
  { day: "Jeudi", time: "18h30", name: "Ashtanga", level: "Avancé", teacher: "Lucas R.", spots: 6, duration: "90 min", period: "evening", icon: <Award size={16} color="#6b8f6b" /> },
  { day: "Vendredi", time: "08h00", name: "Hatha Doux", level: "Débutant", teacher: "Emma D.", spots: 10, duration: "60 min", period: "morning", icon: <Leaf size={16} color="#6b8f6b" /> },
  { day: "Vendredi", time: "12h00", name: "Méditation Déjeuner", level: "Tous niveaux", teacher: "Sophie M.", spots: 15, duration: "30 min", period: "noon", icon: <Heart size={16} color="#c0614a" /> },
  { day: "Samedi", time: "09h00", name: "Vinyasa Flow", level: "Intermédiaire", teacher: "Lucas R.", spots: 5, duration: "75 min", period: "morning", icon: <Wind size={16} color="#6b8f6b" /> },
  { day: "Samedi", time: "11h00", name: "Yin Yoga Profond", level: "Tous niveaux", teacher: "Amara B.", spots: 8, duration: "90 min", period: "morning", icon: <Moon size={16} color="#c0614a" /> },
  { day: "Dimanche", time: "09h00", name: "Kundalini Élévation", level: "Intermédiaire", teacher: "Amara B.", spots: 2, duration: "75 min", period: "morning", icon: <Sunrise size={16} color="#6b8f6b" /> },
  { day: "Dimanche", time: "17h00", name: "Yoga Restauratif", level: "Tous niveaux", teacher: "Sophie M.", spots: 12, duration: "75 min", period: "evening", icon: <Heart size={16} color="#c0614a" /> },
];

// ─── Classes (legacy — used by cours/page.tsx) ─────────────────────────────────
export const CLASSES = [
  { day: "Lundi", time: "07h00", name: "Hatha Flow", level: "Débutant", teacher: "Emma D.", spots: 8, icon: <Sunrise size={18} color="#c0614a" /> },
  { day: "Lundi", time: "19h00", name: "Vinyasa Power", level: "Intermédiaire", teacher: "Lucas R.", spots: 4, icon: <Wind size={18} color="#6b8f6b" /> },
  { day: "Mercredi", time: "09h30", name: "Yin & Méditation", level: "Tous niveaux", teacher: "Sophie M.", spots: 12, icon: <Heart size={18} color="#c0614a" /> },
  { day: "Jeudi", time: "18h30", name: "Ashtanga", level: "Avancé", teacher: "Lucas R.", spots: 6, icon: <Award size={18} color="#6b8f6b" /> },
  { day: "Samedi", time: "10h00", name: "Yoga Nidra", level: "Tous niveaux", teacher: "Emma D.", spots: 14, icon: <Leaf size={18} color="#c0614a" /> },
  { day: "Dimanche", time: "09h00", name: "Kundalini", level: "Intermédiaire", teacher: "Amara B.", spots: 2, icon: <Sunrise size={18} color="#6b8f6b" /> },
];

// ─── Teachers (legacy — used by professeurs/page.tsx) ─────────────────────────
export const TEACHERS = [
  { name: "Emma Dubois", role: "Hatha & Yin Yoga", bio: "18 ans de pratique, certifiée RYT-500. Spécialiste du yoga thérapeutique et de la méditation pleine conscience.", exp: "12 ans d'enseignement", initials: "ED", color: C.accent },
  { name: "Lucas Renaud", role: "Vinyasa & Ashtanga", bio: "Formé à Mysore auprès de maîtres indiens. Sa pratique dynamique guide vers la maîtrise de soi et la discipline.", exp: "8 ans d'enseignement", initials: "LR", color: "#6b8f6b" },
  { name: "Amara Bah", role: "Kundalini & Pranayama", bio: "Experte en techniques respiratoires et en éveil de l'énergie. Elle accompagne les transformations profondes.", exp: "10 ans d'enseignement", initials: "AB", color: "#9b7b6b" },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name: "Céline F.",
    text: "Ananda Flow a complètement transformé ma relation au stress. Les cours de Sophie sont une parenthèse de paix dans mes journées chargées. Je me sens une personne différente après chaque session.",
    stars: 5,
    practice: "Yin & Méditation",
  },
  {
    name: "Romain G.",
    text: "J'ai commencé le yoga sans aucune souplesse. Lucas est incroyablement patient et pédagogue. En 6 mois, je ne me reconnais plus — non seulement physiquement, mais aussi mentalement.",
    stars: 5,
    practice: "Vinyasa Power",
  },
  {
    name: "Naomi L.",
    text: "Le Kundalini d'Amara m'a ouvert des portes intérieures que je ne soupçonnais pas. Une expérience profondément transformatrice. Je recommande à quiconque cherche quelque chose de plus profond.",
    stars: 5,
    practice: "Kundalini",
  },
  {
    name: "Marc T.",
    text: "En tant que cadre stressé, je cherchais un antidote à mon rythme de vie effréné. Les cours de pranayama d'Amara ont révolutionné ma façon de gérer la pression. Indispensable.",
    stars: 5,
    practice: "Pranayama",
  },
  {
    name: "Isabelle K.",
    text: "Le Hatha d'Emma est d'une douceur et d'une précision rare. Elle prend soin de chaque élève individuellement. C'est ce que j'attendais depuis des années sans le trouver ailleurs.",
    stars: 5,
    practice: "Hatha Flow",
  },
];

// ─── Plans (homepage preview — 3 tiers) ───────────────────────────────────────
export const HOME_PLANS = [
  {
    name: "Découverte",
    price: "29",
    period: "/ semaine",
    desc: "Idéal pour commencer votre pratique en douceur.",
    features: ["3 cours par semaine", "Accès à tous les niveaux", "Cours en ligne inclus", "Application mobile"],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Équilibre",
    price: "89",
    period: "/ mois",
    desc: "La formule complète pour une pratique régulière.",
    features: ["Cours illimités en studio", "Cours en ligne illimités", "1 atelier / mois offert", "Accès prioritaire réservations", "Communauté privée"],
    cta: "Rejoindre",
    highlight: true,
  },
  {
    name: "Immersion",
    price: "149",
    period: "/ mois",
    desc: "Pour les pratiquants avancés et la transformation totale.",
    features: ["Tout le plan Équilibre", "2 cours privés / mois", "Accès retraites exclusives", "Programme nutrition", "Coaching mensuel"],
    cta: "Choisir Immersion",
    highlight: false,
  },
];

// ─── Plans (pricing page — full detail) ───────────────────────────────────────
export const PLANS = [
  {
    name: "Découverte",
    price: "29",
    period: "/ semaine",
    desc: "Idéal pour commencer votre pratique en douceur.",
    features: ["3 cours par semaine", "Accès à tous les niveaux", "Cours en ligne inclus", "Application mobile", "Support par email"],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Équilibre",
    price: "89",
    period: "/ mois",
    desc: "La formule complète pour une pratique régulière.",
    features: ["Cours illimités en studio", "Cours en ligne illimités", "1 atelier / mois offert", "Accès prioritaire réservations", "Communauté privée", "Bilan trimestriel avec enseignant"],
    cta: "Rejoindre",
    highlight: true,
  },
  {
    name: "Immersion",
    price: "149",
    period: "/ mois",
    desc: "Pour les pratiquants avancés et la transformation totale.",
    features: ["Tout le plan Équilibre", "2 cours privés / mois", "Accès retraites exclusives", "Programme nutrition inclus", "Coaching bien-être mensuel", "Réductions sur nos ateliers"],
    cta: "Choisir Immersion",
    highlight: false,
  },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  { q: "Je suis débutant(e), puis-je commencer le yoga ?", a: "Absolument ! Tous nos cours débutants sont conçus pour les personnes sans aucune expérience. Emma et nos autres professeurs adaptent chaque posture selon les capacités de chacun. Votre premier cours est entièrement gratuit." },
  { q: "Quels accessoires doivent être apportés ?", a: "Nous mettons des tapis à disposition gratuitement. Venez simplement en tenue confortable. Les props (blocs, sangles, coussins) sont fournis. Vous pouvez bien sûr apporter votre propre tapis si vous en avez un." },
  { q: "Puis-je me joindre à n'importe quel moment ?", a: "Oui, les inscriptions sont ouvertes toute l'année. Nous vous recommandons de commencer par notre cours de découverte (gratuit) pour trouver le format qui vous convient le mieux avant de vous abonner." },
  { q: "Y a-t-il des cours en ligne ?", a: "Oui ! Tous nos abonnements payants incluent un accès illimité à notre plateforme en ligne avec plus de 200 cours enregistrés et 3 sessions live par semaine." },
  { q: "Quelle est votre politique d'annulation ?", a: "Vous pouvez annuler un cours jusqu'à 4h avant son début sans pénalité. En dessous de 4h, la séance est décomptée. Notre abonnement mensuel est résiliable à tout moment sans frais." },
];

// ─── Contact FAQ (for contact page) ───────────────────────────────────────────
export const CONTACT_FAQS = [
  { q: "Comment se déroule le cours d'essai gratuit ?", a: "Le cours d'essai dure 60 à 75 minutes selon la discipline choisie. Arrivez 10 minutes avant pour un accueil personnalisé et une présentation du studio. Tout le matériel est fourni — venez juste en tenue confortable." },
  { q: "Comment accéder au studio depuis le centre de Lyon ?", a: "Nous sommes au 18 Rue de la Paix, 69002 Lyon, à 5 minutes à pied de la station de métro Bellecour (lignes A et D). Des places de vélos sécurisées sont disponibles devant le studio." },
  { q: "Dois-je m'inscrire à l'avance ou puis-je venir directement ?", a: "L'inscription préalable est recommandée car les places sont limitées (10–15 par cours). Vous pouvez réserver via ce formulaire, par téléphone ou sur notre application. Les walk-ins sont acceptés si des places sont disponibles." },
  { q: "Le studio propose-t-il des vestiaires et des douches ?", a: "Oui, nous disposons de vestiaires mixtes avec casiers sécurisés et de 3 douches. Une tisanerie est à votre disposition avant et après chaque cours pour continuer la détente." },
  { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons les cartes bancaires, les virements SEPA, le chèque et les espèces. Le paiement par carte bancaire est disponible directement à l'accueil et en ligne via notre système sécurisé." },
  { q: "Proposez-vous des cours adaptés aux personnes avec blessures ?", a: "Absolument. Nos professeurs sont formés au yoga thérapeutique. Mentionnez vos blessures ou conditions lors de l'inscription — nous vous orienterons vers les cours les plus adaptés et pourrons proposer des modifications personnalisées." },
];
