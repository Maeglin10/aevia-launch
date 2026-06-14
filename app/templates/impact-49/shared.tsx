"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
} from "framer-motion";
import { Star } from "lucide-react";

/* ==========================================================================
   COLORS & FONTS
   ========================================================================== */

export const C = {
  bg: "#F5F3FF",
  primary: "#6366F1",
  secondary: "#818CF8",
  cta: "#10B981",
  ctaHover: "#059669",
  dark: "#1E1B4B",
  darkAlt: "#312E81",
  text: "#4B5563",
  textLight: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#E0E7FF",
  borderSubtle: "#F3F4F6",
  surface: "#F9FAFB",
  surfaceBlue: "#EEF2FF",
  yellow: "#F59E0B",
  red: "#EF4444",
  teal: "#14B8A6",
  pink: "#EC4899",
  purple: "#8B5CF6",
  accent: "#A5B4FC",
} as const;

export const F = {
  main: "'Plus Jakarta Sans', sans-serif",
} as const;

/* ==========================================================================
   NAV LINKS
   ========================================================================== */

export const NAV_LINKS = [
  { label: "Cours", href: "/templates/impact-49" },
  { label: "Formateurs", href: "/templates/impact-49/about" },
  { label: "Tarifs", href: "/templates/impact-49/pricing" },
  { label: "Contact", href: "/templates/impact-49/contact" },
];

/* ==========================================================================
   GLOBAL CSS (fonts via @import)
   ========================================================================== */

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
`;

/* ==========================================================================
   DATA
   ========================================================================== */

export const CATEGORIES = [
  { label: "Design", color: "#6366F1", count: 420 },
  { label: "Développement", color: "#818CF8", count: 980 },
  { label: "Marketing", color: "#10B981", count: 340 },
  { label: "Data & IA", color: "#F59E0B", count: 260 },
  { label: "Business", color: "#EF4444", count: 510 },
  { label: "Photographie", color: "#EC4899", count: 180 },
  { label: "Finance", color: "#14B8A6", count: 290 },
  { label: "Langues", color: "#8B5CF6", count: 140 },
];

export const COURSES = [
  {
    id: 1,
    title: "React & Next.js — De Zéro à Expert",
    instructor: "Alexandre Martin",
    rating: 4.9,
    students: "18 240",
    duration: "38h",
    price: "94€",
    originalPrice: "199€",
    category: "Développement",
    badge: "Bestseller" as string | null,
    categoryColor: "#818CF8",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 2,
    title: "UX Design: Figma Maîtrise Complète",
    instructor: "Sofia Bernard",
    rating: 4.8,
    students: "11 580",
    duration: "24h",
    price: "79€",
    originalPrice: "159€",
    category: "Design",
    badge: "Nouveau" as string | null,
    categoryColor: "#6366F1",
    img: "photo-1522202176988-66273c2fd55f",
  },
  {
    id: 3,
    title: "Growth Hacking & SEO Avancé",
    instructor: "Clément Rousseau",
    rating: 4.7,
    students: "9 120",
    duration: "18h",
    price: "69€",
    originalPrice: "129€",
    category: "Marketing",
    badge: null,
    categoryColor: "#10B981",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 4,
    title: "Python & Machine Learning: Pratique",
    instructor: "Nadia Karim",
    rating: 4.9,
    students: "22 100",
    duration: "45h",
    price: "109€",
    originalPrice: "249€",
    category: "Data & IA",
    badge: "Bestseller" as string | null,
    categoryColor: "#F59E0B",
    img: "photo-1522202176988-66273c2fd55f",
  },
  {
    id: 5,
    title: "Finance Personnelle & Investissement",
    instructor: "Thomas Lefevre",
    rating: 4.8,
    students: "14 900",
    duration: "22h",
    price: "84€",
    originalPrice: "179€",
    category: "Finance",
    badge: null,
    categoryColor: "#14B8A6",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 6,
    title: "Photographie Créative: Light & Composition",
    instructor: "Julie Morin",
    rating: 4.6,
    students: "6 780",
    duration: "14h",
    price: "59€",
    originalPrice: "99€",
    category: "Photographie",
    badge: "Populaire" as string | null,
    categoryColor: "#EC4899",
    img: "photo-1522202176988-66273c2fd55f",
  },
];

export const SKILL_PATHS = [
  {
    id: "sp1",
    title: "Développeur Frontend",
    subtitle: "12 cours · 120h de contenu",
    icon: "Zap" as const,
    color: "#6366F1",
    bg: "#EEF2FF",
    steps: ["HTML & CSS", "JavaScript ES6+", "React", "Next.js", "TypeScript", "Tests & CI/CD"],
    progress: 68,
    students: "8 400",
    level: "Débutant → Avancé",
  },
  {
    id: "sp2",
    title: "Data Analyst",
    subtitle: "9 cours · 90h de contenu",
    icon: "BarChart" as const,
    color: "#F59E0B",
    bg: "#FFFBEB",
    steps: ["Excel Avancé", "SQL", "Python", "Pandas", "Visualisation", "Power BI"],
    progress: 45,
    students: "6 200",
    level: "Intermédiaire",
  },
  {
    id: "sp3",
    title: "UX Designer",
    subtitle: "8 cours · 80h de contenu",
    icon: "Target" as const,
    color: "#10B981",
    bg: "#ECFDF5",
    steps: ["Research UX", "Wireframing", "Figma", "Prototypage", "Tests utilisateurs", "Design System"],
    progress: 30,
    students: "4 900",
    level: "Tous niveaux",
  },
];

export const MARQUEE_ITEMS = [
  "50 000+ apprenants actifs",
  "3 200+ cours disponibles",
  "180+ formateurs experts",
  "4.8★ satisfaction moyenne",
  "Certifications reconnues",
  "Accès à vie aux cours achetés",
  "Support 7j/7",
  "Mises à jour incluses",
];

export const INSTRUCTORS = [
  {
    name: "Alexandre Martin",
    specialty: "React & Node.js Expert",
    students: "42K",
    courses: 11,
    rating: 4.9,
    bio: "Ex-Senior Engineer chez Doctolib. 8 ans d'expérience en développement full-stack.",
  },
  {
    name: "Sofia Bernard",
    specialty: "UX & Product Design",
    students: "28K",
    courses: 6,
    rating: 4.8,
    bio: "Designer Lead chez Ledger. Spécialiste Figma et design systems à grande échelle.",
  },
  {
    name: "Nadia Karim",
    specialty: "Data Science & IA",
    students: "61K",
    courses: 14,
    rating: 4.9,
    bio: "PhD en ML, ex-chercheuse DeepMind. Auteure de 3 publications Nature sur l'IA générative.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Maxime Dubois",
    before: "Caissier",
    after: "Développeur Frontend @ Deezer",
    salary: "+87% salaire",
    rating: 5,
    quote:
      "En 9 mois avec le parcours Frontend de Skillbridge, j'ai décroché un poste que je n'aurais jamais cru possible. La qualité des cours est incomparable.",
    avatar: "MD",
  },
  {
    name: "Camille Renard",
    before: "Assistante RH",
    after: "UX Designer @ Sncf Connect",
    salary: "+65% salaire",
    rating: 5,
    quote:
      "J'avais peur que la reconversion soit trop longue. Avec Skillbridge, j'ai eu mon premier job en UX 6 mois après avoir commencé. Le parcours est structuré parfaitement.",
    avatar: "CR",
  },
  {
    name: "Julien Parra",
    before: "Commercial",
    after: "Data Analyst @ BNP Paribas",
    salary: "+72% salaire",
    rating: 5,
    quote:
      "Le parcours Data Analyst est d'une densité impressionnante. Les projets pratiques m'ont permis de construire un portfolio solide pour convaincre les recruteurs.",
    avatar: "JP",
  },
  {
    name: "Léa Fournier",
    before: "Infirmière",
    after: "Growth Manager @ Qonto",
    salary: "+90% salaire",
    rating: 5,
    quote:
      "Incroyable. Je n'aurais jamais imaginé être Growth Manager. Skillbridge m'a donné toutes les clés pour réussir une reconversion complète en moins d'un an.",
    avatar: "LF",
  },
];

export const PLANS = [
  {
    name: "Free",
    price: "0€",
    period: "/mois",
    description: "Découvrez Skillbridge sans engagement",
    highlight: false,
    cta: "Commencer gratuitement",
    features: [
      "5 cours gratuits à vie",
      "Accès aux previews de tous les cours",
      "Communauté étudiante",
      "Certificat de complétion",
      "Application mobile",
    ],
    missing: ["Cours premium", "Parcours guidés", "Mentorat", "Support prioritaire"],
  },
  {
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "L'accès complet pour apprendre sans limites",
    highlight: true,
    cta: "Essai gratuit 7 jours",
    features: [
      "Accès illimité à 3 200+ cours",
      "Tous les parcours guidés",
      "Certificats vérifiables",
      "Téléchargements offline",
      "Support prioritaire 24/7",
      "Sessions live mensuelles",
      "Mises à jour cours incluses",
    ],
    missing: [],
  },
  {
    name: "Team",
    price: "49€",
    period: "/utilisateur/mois",
    description: "La solution pour former vos équipes",
    highlight: false,
    cta: "Contacter les ventes",
    features: [
      "Tout le plan Pro",
      "Tableau de bord RH",
      "Rapports de progression",
      "SSO & SAML",
      "Contenu personnalisé",
      "Gestionnaire de compte dédié",
      "Facturation centralisée",
    ],
    missing: [],
  },
];

export const COMPANY_LOGOS = [
  "Doctolib", "Deezer", "BlaBlaCar", "Ledger", "Qonto", "Swile", "Alan", "Dataiku",
];

export const FOOTER_LINKS: Record<string, string[]> = {
  "Apprendre": ["Tous les cours", "Parcours guidés", "Certifications", "Cours gratuits", "Nouveautés"],
  "Formateurs": ["Devenir formateur", "Ressources", "Programme partenaires", "Studio qualité"],
  "Entreprises": ["Solutions équipes", "Cas clients", "Tarifs entreprise", "Démo"],
  "Aide": ["Centre d'aide", "Communauté", "Politique remboursement", "Accessibilité"],
};

/* ==========================================================================
   REUSABLE COMPONENTS
   ========================================================================== */

export function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={s <= Math.floor(rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}
        />
      ))}
      <span className="ml-1 text-[#6366F1] font-bold text-xs">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366F1] to-[#10B981] z-[999]"
    />
  );
}

export function MarqueeStrip({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-12 items-center"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-sm font-semibold text-[#1E1B4B]">
            <span className="w-2 h-2 rounded-full bg-[#6366F1] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function useFonts() {
  useEffect(() => {
    const id = "skillbridge-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}
