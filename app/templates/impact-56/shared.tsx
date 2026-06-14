"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Map, Grape, Clock } from "lucide-react";

// ─── REVEAL COMPONENT ────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: "1789", label: "Fondation", suffix: "" },
  { value: "45", label: "Hectares de Vignes", suffix: "Ha" },
  { value: "1er", label: "Grand Cru Classé", suffix: "" },
  { value: "24", label: "Mois d'Élevage", suffix: "m" },
  { value: "12", label: "Générations", suffix: "" },
];

export const FEATURES = [
  {
    id: "terroir",
    title: "Le Terroir",
    icon: <Map className="w-6 h-6" />,
    description: "Niché au cœur de Margaux, notre vignoble repose sur des croupes de graves profondes. Ce sol exceptionnel, pauvre et bien drainé, oblige la vigne à s'enraciner profondément, offrant à nos vins leur élégance légendaire.",
    bullets: [
      "Graves garonnaises du quaternaire",
      "Sous-sol argilo-calcaire",
      "Micro-climat exceptionnel",
      "Rendements naturellement limités"
    ],
    image: "https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=800&q=80&fit=crop"
  },
  {
    id: "vinification",
    title: "La Vinification",
    icon: <Grape className="w-6 h-6" />,
    description: "Une approche respectueuse où la technologie sert la tradition. La vendange, entièrement manuelle, est triée grain par grain avant une fermentation parcellaire en cuves tronconiques bois.",
    bullets: [
      "Vendanges 100% manuelles",
      "Tri optique de haute précision",
      "Extraction douce et lente",
      "Zéro intrant de synthèse"
    ],
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop"
  },
  {
    id: "elevage",
    title: "L'Élevage en Barrique",
    icon: <Clock className="w-6 h-6" />,
    description: "Dans le silence de nos chais souterrains, le vin repose pendant 18 à 24 mois. Nous utilisons exclusivement des barriques de chêne français à grain fin, renouvelées selon la puissance du millésime.",
    bullets: [
      "Chêne des forêts de Tronçais",
      "Chauffe moyenne sur mesure",
      "Soutirage traditionnel à la bougie",
      "Collage au blanc d'œuf frais"
    ],
    image: "https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=800&q=80&fit=crop"
  }
];

export const TESTIMONIALS = [
  {
    name: "Jean-Marc Quarin",
    role: "Critique Indépendant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    content: "Le Château Vestige 2026 redéfinit l'élégance de l'appellation. Une texture de velours qui enveloppe un fruit d'une pureté saisissante. Magistral.",
    rating: 5,
    score: "98/100"
  },
  {
    name: "Jancis Robinson",
    role: "Master of Wine",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content: "Un vin d'une aristocratie naturelle. Les tanins sont d'une finesse incomparable, promettant une garde de plusieurs décennies.",
    rating: 5,
    score: "19/20"
  },
  {
    name: "Robert Parker",
    role: "The Wine Advocate",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    content: "Probablement le plus grand millésime produit par la propriété depuis 1982. La complexité aromatique est vertigineuse.",
    rating: 5,
    score: "99/100"
  },
  {
    name: "Antonio Galloni",
    role: "Vinous",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    content: "L'assemblage est d'une symétrie parfaite. Le Cabernet Sauvignon y dicte sa structure avec une grâce souveraine.",
    rating: 5,
    score: "97/100"
  }
];

export const FAQS = [
  {
    question: "Comment garantissez-vous l'authenticité des bouteilles ?",
    answer: "Depuis le millésime 2022, chaque bouteille de Château Vestige est équipée d'une puce NFC intégrée sous l'étiquette et d'un scellé holographique sur la capsule. En scannant la puce avec votre smartphone, vous accédez à la blockchain vérifiant la provenance de la bouteille."
  },
  {
    question: "Est-il possible de visiter le domaine et les chais ?",
    answer: "Nous accueillons les amateurs sur rendez-vous uniquement. La visite privée comprend la découverte du vignoble, l'explication de notre cuvier gravitaire, le passage dans nos chais souterrains et s'achève par une dégustation de 3 millésimes. Veuillez contacter la conciergerie."
  },
  {
    question: "Quelles sont vos pratiques environnementales ?",
    answer: "Le Château Vestige est certifié HVE 3 et en conversion vers la biodynamie. Nous pratiquons l'enherbement naturel, la confusion sexuelle pour limiter les traitements, et entretenons plusieurs hectares de biodiversité (forêts, haies) autour du vignoble."
  },
  {
    question: "Puis-je faire conserver mes vins directement au Château ?",
    answer: "Oui, les membres du Club Privilège bénéficient d'un espace dédié dans nos caves historiques. L'hygrométrie (80%) et la température (13°C) y sont parfaite et constantes."
  },
  {
    question: "Comment expédiez-vous les vins à l'international ?",
    answer: "Nous utilisons exclusivement des transporteurs spécialisés. Les vins voyagent dans des caisses isolées thermiquement, par voie aérienne avec contrôle continu de la température. Toutes les expéditions sont couvertes par notre assurance."
  },
  {
    question: "Quand dois-je boire mon Grand Vin ?",
    answer: "Un Grand Vin du Château Vestige requiert généralement 10 à 15 ans de garde pour que ses tanins se fondent. Les très grands millésimes peuvent aisément traverser 50 ans ou plus. Consultez notre charte des millésimes pour nos recommandations précises."
  }
];

export const WINES = [
  {
    id: "grand-vin",
    name: "Château Vestige",
    subtitle: "Grand Vin du Domaine",
    appellation: "Margaux AOC — 1er Grand Cru Classé",
    millesimes: ["2019", "2018", "2016"],
    price: 480,
    priceRange: "420 – 480 €",
    cepages: "Cabernet Sauvignon 80%, Merlot 15%, Petit Verdot 5%",
    robe: "Robe grenat profond aux reflets pourpres",
    nez: "Cassis, violette, tabac blond, notes de cèdre et de sous-bois",
    bouche: "Tanins soyeux et précis, finale longue et minérale",
    service: "17–18°C",
    garde: "20–25 ans et au-delà",
    image: "https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=800&q=80&fit=crop",
    badge: "Signature"
  },
  {
    id: "second-vin",
    name: "L'Héritier de Vestige",
    subtitle: "Second Vin",
    appellation: "Margaux AOC",
    millesimes: ["2020", "2019"],
    price: 85,
    priceRange: "85 €",
    cepages: "Merlot 60%, Cabernet Sauvignon 35%, Petit Verdot 5%",
    robe: "Robe rubis brillante aux reflets grenat",
    nez: "Fruits rouges croquants, cerise, légères notes vanillées",
    bouche: "Souple et gourmand, tanins fondus, belle fraîcheur",
    service: "16–17°C",
    garde: "10–15 ans",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&fit=crop",
    badge: null
  },
  {
    id: "blanc",
    name: "Blanc du Domaine",
    subtitle: "Bordeaux Blanc Sec",
    appellation: "Bordeaux Blanc AOC",
    millesimes: ["2023", "2022"],
    price: 65,
    priceRange: "65 €",
    cepages: "Sauvignon Blanc 70%, Sémillon 30%",
    robe: "Robe jaune pâle aux reflets dorés",
    nez: "Agrumes frais, fleurs blanches, léger boisé grillé",
    bouche: "Vif et élégant, belle tension minérale, finale citronnée",
    service: "10–12°C",
    garde: "5–8 ans",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
    badge: null
  },
  {
    id: "coffret",
    name: "Coffret Prestige",
    subtitle: "Sélection Curatée — 6 bouteilles",
    appellation: "Assortiment Grand Cru",
    millesimes: ["2019", "2018", "2016"],
    price: 290,
    priceRange: "290 €",
    cepages: "2× Grand Vin · 2× Second Vin · 2× Blanc",
    robe: "Coffret bois gravé, papier de soie, ficelle naturelle",
    nez: "Idéal pour offrir ou découvrir le style du domaine",
    bouche: "Livraison sous température dirigée, certificat d'authenticité inclus",
    service: "Voir chaque vin",
    garde: "Voir chaque vin",
    image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&q=80&fit=crop",
    badge: "Cadeau"
  }
];

export const NAV_LINKS = [
  { label: "Nos Vins", href: "/templates/impact-56/vins" },
  { label: "Le Terroir", href: "/templates/impact-56/terroir" },
  { label: "Visites", href: "/templates/impact-56/visite" },
  { label: "Commander", href: "/templates/impact-56/commande" },
  { label: "Contact", href: "/templates/impact-56/contact" },
] as const;
