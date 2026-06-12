"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useInView, useScroll } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Flame,
  Clock,
  Package,
  Zap,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const C = {
  bg: "#fdf8f3",
  bgAlt: "#f7f0e6",
  text: "#1a0a00",
  textMuted: "#7a5c3a",
  espresso: "#1a0a00",
  caramel: "#c4813a",
  caramelLight: "#f5ddb8",
  cream: "#fdf8f3",
  sand: "#e8d5b7",
  white: "#ffffff",
  border: "#e2cba8",
  borderLight: "#f0e4cc",
};

export const SERIF = "'Fraunces', Georgia, serif";
export const SANS = "'DM Sans', system-ui, sans-serif";

// ─── Datasets ─────────────────────────────────────────────────────────────────
export const ORIGINS = [
  {
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    process: "Washed",
    altitude: "1,800–2,200m",
    flavor: ["Jasmine", "Bergamot", "Stone fruit", "Bright acidity"],
    roast: "Light",
    price: "19",
    region: "Africa",
    description:
      "A floral, tea-like cup from the birthplace of coffee. Hand-picked from small family farms in the Gedeo Zone.",
    longDescription:
      "L'Ethiopian Yirgacheffe est considéré comme l'un des cafés les plus exceptionnels au monde. Cultivé à plus de 1 800 mètres d'altitude dans la zone Gedeo, chaque cerise est récoltée à la main par des familles qui pratiquent la caféiculture depuis des générations. Le processus washed révèle toute la complexité florale du grain — jasmin, bergamote, fruits à noyau — avec une acidité lumineuse caractéristique des grands cafés d'Éthiopie.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&fit=crop",
  },
  {
    name: "Colombian Huila Natural",
    origin: "Colombia",
    process: "Natural",
    altitude: "1,600–1,900m",
    flavor: ["Dark cherry", "Chocolate", "Brown sugar", "Full body"],
    roast: "Medium",
    price: "17",
    region: "Latin America",
    description:
      "Rich and fruit-forward from Colombia's most celebrated region. Sun-dried for 25 days on raised beds.",
    longDescription:
      "La région de Huila, au sud de la Colombie, produit certains des meilleurs cafés d'Amérique Latine. Ce lot Natural est séché au soleil pendant 25 jours sur des lits surélevés, ce qui développe une richesse fruitée exceptionnelle. La cerise fermente doucement autour du grain, conférant des notes de cerise noire, de chocolat noir et de cassonade avec un corps plein et velouté.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&fit=crop",
  },
  {
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    process: "Wet-Hulled",
    altitude: "1,200–1,500m",
    flavor: ["Earthy", "Cedar", "Dark chocolate", "Low acidity"],
    roast: "Dark",
    price: "16",
    region: "Asia-Pacific",
    description:
      "A unique wet-hulled processing gives this Sumatran coffee its distinctively earthy, full-bodied character.",
    longDescription:
      "Le Sumatra Mandheling est l'un des cafés les plus distinctifs au monde, grâce au processus de déparchage humide unique à l'Indonésie (Giling Basah). Cette méthode confère au café ses notes terreuses caractéristiques, évoquant le cèdre, la forêt après la pluie et le chocolat amer. Faible en acidité, il convient parfaitement aux amateurs de cafés foncés et intenses.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&fit=crop",
  },
  {
    name: "Guatemala Antigua",
    origin: "Guatemala",
    process: "Washed",
    altitude: "1,500–1,700m",
    flavor: ["Toffee", "Caramel", "Mild citrus", "Medium body"],
    roast: "Medium",
    price: "15",
    region: "Latin America",
    description:
      "Volcanic soil and consistent climate produce a balanced, approachable cup with classic Central American character.",
    longDescription:
      "Cultivé sur les flancs des volcans entourant la vallée d'Antigua, ce café bénéficie d'un sol volcanique riche en minéraux et d'un microclimat exceptionnel. Le processus washed met en valeur la clarté et la balance de ce terroir unique — des notes de caramel, toffee et agrumes légers pour une tasse équilibrée et accessible, idéale pour découvrir les cafés d'Amérique Centrale.",
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80&fit=crop",
  },
];

export const PROCESS_STEPS = [
  {
    icon: Leaf,
    step: "01",
    title: "Source",
    desc: "We visit farms annually. Every lot is traceable to the specific producer and harvest. No middlemen.",
  },
  {
    icon: Package,
    step: "02",
    title: "Select",
    desc: "Green coffee is cupped blind by our team. Less than 8% of samples we receive make it to roasting.",
  },
  {
    icon: Flame,
    step: "03",
    title: "Roast",
    desc: "Small-batch roasting on our Loring S35. Every profile is developed over months and documented precisely.",
  },
  {
    icon: Clock,
    step: "04",
    title: "Rest",
    desc: "All coffee rests 5–14 days after roasting before shipping — peak degassing for optimal extraction.",
  },
  {
    icon: Package,
    step: "05",
    title: "Pack",
    desc: "Nitrogen-flushed valve bags preserve freshness. Shipped within 48h of packing.",
  },
  {
    icon: Zap,
    step: "06",
    title: "Brew",
    desc: "Every bag includes QR-linked brew guides for that specific lot and roast level.",
  },
];

export const REVIEWS = [
  {
    name: "James Okafor",
    role: "Home Barista",
    avatar: "JO",
    rating: 5,
    text: "The Ethiopian Yirgacheffe changed how I think about coffee. I've tried beans from every major subscription — Origin Roast is in another category.",
  },
  {
    name: "Sophie Lindqvist",
    role: "Café Owner, Stockholm",
    avatar: "SL",
    rating: 5,
    text: "We switched our cafe's house blend to Origin Roast six months ago. Customer feedback on our espresso has improved measurably. The consistency is remarkable.",
  },
  {
    name: "Tariq Hassan",
    role: "Monthly Subscriber",
    avatar: "TH",
    rating: 5,
    text: "The monthly box is a coffee education. Each arrival I learn something new — about the farm, the process, the roast. It's made me genuinely knowledgeable.",
  },
];

export const FAQS = [
  {
    q: "How fresh is the coffee when it arrives?",
    a: "We roast to order. Your coffee is roasted within 48 hours of your order, rested 5–14 days (depending on process), then shipped. Most subscribers receive coffee 7–10 days off-roast — ideal for espresso and filter.",
  },
  {
    q: "What grind options are available?",
    a: "Whole bean, coarse filter (French press/cold brew), medium filter (pour over/drip), fine filter (Aeropress), and espresso. We recommend whole bean for peak freshness.",
  },
  {
    q: "Can I skip or pause my subscription?",
    a: "Yes — skip up to 4 consecutive deliveries per year, or pause for up to 3 months. Manage everything from your account dashboard or email us.",
  },
  {
    q: "Do you offer decaffeinated options?",
    a: "Yes. We carry a Swiss Water Process decaf single origin, rotated seasonally. All subscription plans can include decaf as one of your selections.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship to 22 countries across Europe and North America. International orders include expedited shipping to ensure freshness. DHL tracked, typically 3–5 days.",
  },
  {
    q: "What is your sourcing philosophy?",
    a: "Direct trade where possible — we visit producers annually and pay above Fair Trade minimums. All partners are paid before harvest via crop financing. Full transparency on every bag.",
  },
];

export const STATS = [
  { value: "47", label: "Farm Partners" },
  { value: "18", label: "Countries Sourced" },
  { value: "32k+", label: "Bags Roasted" },
  { value: "4.9", label: "Avg. Rating" },
];

export const WORKSHOPS = [
  {
    title: "Initiation à la dégustation",
    duration: "2h",
    price: "45",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=800&q=80&fit=crop",
    description:
      "Découvrez les fondamentaux de la dégustation du café — arômes, textures, acidité, amertume — guidé par notre responsable torréfaction.",
    whatYouLearn: [
      "Vocabulaire sensoriel du café de spécialité",
      "Différences entre les méthodes de traitement",
      "Comment identifier les défauts et les qualités",
      "Protocole de cupping professionnel",
    ],
    includes: ["Dégustation de 6 origines", "Guide sensoriel illustré", "1 sachet de café à emporter"],
    groupSize: "4–8 personnes",
    level: "Débutant",
  },
  {
    title: "Barista pour un jour",
    duration: "3h",
    price: "75",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1620905770869-ccaabc65b9b0?w=800&q=80&fit=crop",
    description:
      "Maîtrisez l'extraction espresso et les bases du latte art lors d'une session intensive derrière le comptoir de notre café.",
    whatYouLearn: [
      "Réglage du moulin et extraction espresso",
      "Technique de mousse de lait",
      "Bases du latte art (cœur, tulipe)",
      "Paramètres d'extraction pour différents profils",
    ],
    includes: ["Accès machine espresso professionnelle", "1 kg de café pour pratiquer", "Livret technique barista"],
    groupSize: "2–4 personnes",
    level: "Intermédiaire",
  },
  {
    title: "Torréfaction découverte",
    duration: "4h",
    price: "120",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?w=800&q=80&fit=crop",
    description:
      "Plongez dans l'univers de la torréfaction artisanale : de la sélection du café vert jusqu'à la dégustation du lot que vous aurez torréfié.",
    whatYouLearn: [
      "Chimie de la torréfaction (réaction de Maillard, first crack)",
      "Lecture et interprétation d'un profil de torréfaction",
      "Influence du niveau de torréfaction sur les arômes",
      "Comment déguster et évaluer son propre lot",
    ],
    includes: ["Torréfaction de votre propre lot (250g)", "Emportez votre café fraîchement torréfié", "Fiche de profil personnalisée"],
    groupSize: "2–3 personnes",
    level: "Tout niveau",
  },
];

export const ABONNEMENT_PLANS = [
  {
    name: "Découverte",
    weight: "250g",
    origins: "1 origine",
    price: "18",
    priceBi: "16",
    period: "mois",
    features: [
      "1 origine sélectionnée par notre torréfacteur",
      "Notes de dégustation incluses",
      "Grain entier ou moulu",
      "Livraison offerte",
      "Pause ou annulation libre",
    ],
    highlight: false,
    badge: null,
  },
  {
    name: "Amateur",
    weight: "500g",
    origins: "2 origines",
    price: "32",
    priceBi: "28",
    period: "mois",
    features: [
      "2 origines complémentaires",
      "1 café filtre + 1 café espresso",
      "Guide de préparation par lot",
      "Livraison offerte",
      "Accès prioritaire aux nouveaux lots",
      "Pause ou annulation libre",
    ],
    highlight: true,
    badge: "Populaire",
  },
  {
    name: "Connaisseur",
    weight: "1 kg",
    origins: "3 origines",
    price: "55",
    priceBi: "48",
    period: "mois",
    features: [
      "3 origines de notre sélection premium",
      "Moulu sur commande selon votre méthode",
      "Notes de dégustation détaillées + histoire du producteur",
      "Livraison offerte en express",
      "Accès réserves exclusives",
      "Invitation aux ateliers à tarif préférentiel",
      "Pause ou annulation libre",
    ],
    highlight: false,
    badge: "Premium",
  },
];

export const MENU_SECTIONS = [
  {
    title: "Espressos",
    icon: "☕",
    items: [
      { name: "Espresso", desc: "Ristretto ou lungo, grain du jour", price: "3,00" },
      { name: "Lungo", desc: "Extraction longue, rondeur assurée", price: "3,50" },
      { name: "Americano", desc: "Espresso allongé à l'eau chaude", price: "3,00" },
      { name: "Macchiato", desc: "Espresso, nuage de mousse", price: "3,50" },
    ],
  },
  {
    title: "Lattes & Milk",
    icon: "🥛",
    items: [
      { name: "Flat White", desc: "Double ristretto, micro-mousse onctueuse", price: "4,50" },
      { name: "Cortado", desc: "Espresso et lait chaud à parts égales", price: "4,00" },
      { name: "Oat Latte", desc: "Espresso, lait d'avoine, latte art", price: "5,00" },
      { name: "Cappuccino", desc: "Espresso, lait chaud, mousse épaisse", price: "4,50" },
    ],
  },
  {
    title: "Cold Brew",
    icon: "🧊",
    items: [
      { name: "Cold Brew", desc: "Infusion 18h, velouté et sans amertume", price: "5,00" },
      { name: "Nitro Cold Brew", desc: "Cold brew infusé à l'azote", price: "6,00" },
      { name: "Cold Brew Tonic", desc: "Cold brew sur eau tonique, citron", price: "6,00" },
    ],
  },
  {
    title: "Filtres & Spécialités",
    icon: "🫖",
    items: [
      { name: "V60 du jour", desc: "Préparation manuelle, origine du moment", price: "5,50" },
      { name: "AeroPress", desc: "Corps intense, préparation minute", price: "4,50" },
      { name: "Café viennois", desc: "Espresso, chantilly légère, cacao", price: "5,00" },
    ],
  },
  {
    title: "Restauration",
    icon: "🥐",
    items: [
      { name: "Croissant partenaire", desc: "Boulangerie artisanale locale, beurre AOP", price: "3,50" },
      { name: "Banana bread", desc: "Maison, noix et caramel brun", price: "4,00" },
      { name: "Cookie café-chocolat", desc: "Généreux, cuit minute", price: "3,00" },
      { name: "Muffin saisonnier", desc: "Recette qui change chaque semaine", price: "3,50" },
    ],
  },
];

// ─── Visual & Helper Components ────────────────────────────────────────────────
export function CoffeeBeanSVG() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ width: 180, height: 180, margin: "0 auto" }}
    >
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <ellipse cx="50" cy="50" rx="32" ry="44" fill={C.caramel} opacity="0.9" transform="rotate(-20 50 50)" />
        <ellipse cx="50" cy="50" rx="30" ry="42" fill="none" stroke={C.espresso} strokeWidth="1.5" opacity="0.4" transform="rotate(-20 50 50)" />
        <path d="M35,30 Q50,50 65,70" fill="none" stroke={C.espresso} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" transform="rotate(-20 50 50)" />
        <ellipse cx="40" cy="38" rx="8" ry="5" fill="white" opacity="0.12" transform="rotate(-20 50 50)" />
      </svg>
    </motion.div>
  );
}

export function OriginMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 800 400"
        style={{ width: "100%", background: `${C.espresso}12`, borderRadius: 16, border: `1px solid ${C.border}` }}
      >
        <path d="M 380 80 L 430 85 L 450 130 L 440 190 L 410 230 L 390 250 L 370 220 L 355 170 L 360 120 Z"
          fill={hovered === "Africa" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Africa" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Africa")} onMouseLeave={() => setHovered(null)} />
        <path d="M 200 80 L 240 85 L 255 140 L 245 200 L 220 240 L 200 220 L 185 160 L 190 110 Z"
          fill={hovered === "Latin America" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Latin America" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Latin America")} onMouseLeave={() => setHovered(null)} />
        <path d="M 580 80 L 660 90 L 680 150 L 650 190 L 600 180 L 570 140 L 565 100 Z"
          fill={hovered === "Asia-Pacific" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Asia-Pacific" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Asia-Pacific")} onMouseLeave={() => setHovered(null)} />
        <text x="400" y="280" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Africa</text>
        <text x="218" y="270" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Latin America</text>
        <text x="625" y="215" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Asia-Pacific</text>
        {hovered && (
          <text x="400" y="340" textAnchor="middle" fontSize="12" fill={C.textMuted} fontFamily="'DM Sans', system-ui">
            {ORIGINS.find((o) => o.region === hovered)?.name || hovered}
          </text>
        )}
        <line x1="100" y1="160" x2="700" y2="160" stroke={C.caramel} strokeWidth="0.5" strokeDasharray="6,6" opacity="0.3" />
        <text x="108" y="155" fontSize="9" fill={C.caramel} opacity="0.5" fontFamily="'DM Sans', system-ui">Equator</text>
      </svg>
      <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 10 }}>
        Survolez pour explorer les régions de culture
      </p>
    </div>
  );
}

export function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ background: C.white, border: `1px solid ${open ? C.caramel : C.border}`, borderRadius: 10, padding: "20px 24px", cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 16, color: C.espresso }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={18} color={C.caramel} />
          </motion.div>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontFamily: "'DM Sans', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, dark = false }: { title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div style={{ padding: "80px 5% 60px", background: dark ? C.espresso : C.bgAlt, borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, color: dark ? C.cream : C.espresso, marginBottom: subtitle ? 16 : 0 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: 17, color: dark ? C.sand : C.textMuted, maxWidth: 520, lineHeight: 1.8, fontWeight: 300 }}>
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
