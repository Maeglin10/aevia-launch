"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export const C = {
  bg: "#1a0f05",
  bgAlt: "#120a03",
  bgCard: "#221508",
  text: "#f5e8d0",
  textMuted: "#a08060",
  accent: "#C9A96E",
  accentDark: "#9e7a45",
  accentLight: "#e8c88a",
  accentGlow: "rgba(201,169,110,0.15)",
  border: "#3a2510",
  borderGold: "rgba(201,169,110,0.3)",
  white: "#ffffff",
  ruby: "#9b2335",
  sapphire: "#1a3a6b",
  emerald: "#1a5c3a",
  diamond: "#c8d8e8",
  amethyst: "#5c2d7a",
};

export const FONT_HEADING = "'Cormorant Garamond', Georgia, serif";
export const FONT_BODY = "'Cormorant Garamond', Georgia, serif";
export const FONT_LABEL = "system-ui, sans-serif";

export const COLLECTIONS = [
  {
    id: "high-jewelry",
    label: "High Jewelry",
    pieces: [
      {
        name: "Constellation Noir",
        subtitle: "Collier haute joaillerie",
        price: "€185,000",
        stone: "Diamant noir 8 ct",
        metal: "Or blanc 18k",
        gem: "diamond",
        desc: "Un firmament de diamants noirs taille étoile, serti en micro-pavé sur or blanc rhodié. Pièce unique, certificat GIA.",
        limited: true,
      },
      {
        name: "Flamme Imperiale",
        subtitle: "Bracelet manchette",
        price: "€94,000",
        stone: "Rubis Mogok 6 ct",
        metal: "Or jaune 22k",
        gem: "ruby",
        desc: "Rubis de Birmanie d'une pureté exceptionnelle, entouré de diamants blancs taille brillant. Collection Imperiale.",
        limited: false,
      },
      {
        name: "Larme d'Azur",
        subtitle: "Bague solitaire",
        price: "€67,000",
        stone: "Saphir Cachemire 4.2 ct",
        metal: "Platine 950",
        gem: "sapphire",
        desc: "Saphir de Cachemire non-chauffé, couleur Royal Blue certifiée. Entourage diamants taille ancienne.",
        limited: false,
      },
      {
        name: "Forêt Secrète",
        subtitle: "Parure collier + boucles",
        price: "€52,000",
        stone: "Émeraude Colombie 5.5 ct",
        metal: "Or rose 18k",
        gem: "emerald",
        desc: "Émeraude vivid green de Colombie en taille cabochon. Feuillage ciselé à la main par nos maîtres joailliers.",
        limited: true,
      },
    ],
  },
  {
    id: "timepieces",
    label: "Horlogerie",
    pieces: [
      {
        name: "Aurelius Perpetuel",
        subtitle: "Calendrier perpétuel",
        price: "€142,000",
        stone: "Cadran nacre",
        metal: "Or blanc 18k",
        gem: "diamond",
        desc: "Mouvement manufacture Calibre AH-21, 396 composants. Calendrier perpétuel, phases de lune, réserve de marche 72h.",
        limited: true,
      },
      {
        name: "Héritage Tourbillon",
        subtitle: "Tourbillon volant",
        price: "€285,000",
        stone: "Saphir massif",
        metal: "Titane grade 5",
        gem: "sapphire",
        desc: "Tourbillon volant à cage ouverte visible à 6h. Boîte en titane brossé, fond saphir, bracelet alligator Hermès.",
        limited: true,
      },
      {
        name: "Solstice Dame",
        subtitle: "Montre dame parée",
        price: "€89,000",
        stone: "Diamants 2.8 ct total",
        metal: "Or rose 18k",
        gem: "ruby",
        desc: "Boîte entièrement pavée de diamants roses. Cadran nacre rose, aiguilles feuilles d'or. Mouvement manufacture quartz haute précision.",
        limited: false,
      },
      {
        name: "Nuit Éternelle",
        subtitle: "Skeleton automatique",
        price: "€76,000",
        stone: "Cadran squelette laqué",
        metal: "Or gris 18k",
        gem: "amethyst",
        desc: "Architecture squelette ouverte révélant le Calibre AH-14. Décor côtes de Genève poli à la main, 40h de réserve.",
        limited: false,
      },
    ],
  },
  {
    id: "bespoke",
    label: "Sur Mesure",
    pieces: [
      {
        name: "Service Bespoke",
        subtitle: "Création unique",
        price: "Sur devis",
        stone: "Pierre de votre choix",
        metal: "Métal de votre choix",
        gem: "diamond",
        desc: "Nos maîtres joailliers créent votre pièce unique. Consultation privée à Paris, Monaco ou à domicile. Délai : 6 à 18 mois.",
        limited: false,
      },
      {
        name: "Héritage Familial",
        subtitle: "Transformation et restauration",
        price: "À partir de €8,000",
        stone: "Vos pierres existantes",
        metal: "Vos métaux existants",
        gem: "emerald",
        desc: "Donnez une seconde vie à vos bijoux de famille. Redesign complet ou restauration à l'identique par nos experts.",
        limited: false,
      },
      {
        name: "Alliance Éternité",
        subtitle: "Alliances personnalisées",
        price: "À partir de €12,000",
        stone: "Diamant de votre choix",
        metal: "Or ou Platine",
        gem: "sapphire",
        desc: "Alliances gravées à vos initiales, ornées de la pierre qui symbolise votre histoire. Écrin assorti inclus.",
        limited: false,
      },
      {
        name: "Montre Signature",
        subtitle: "Cadran personnalisé",
        price: "À partir de €45,000",
        stone: "Email grand feu",
        metal: "Or 18k",
        gem: "amethyst",
        desc: "Votre peinture miniature sur email grand feu, artisanat vieux de 3 siècles. Portrait, paysage ou motif symbolique.",
        limited: false,
      },
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Isabelle de Montfort",
    role: "Collectionneuse, Paris VIIe",
    note: 5,
    text: "La Constellation Noir surpasse tout ce que j'ai vu chez Van Cleef ou Cartier. L'attention au détail est simplement bouleversante.",
    piece: "Constellation Noir",
  },
  {
    name: "Richard Ashworth",
    role: "CEO, Londres",
    note: 5,
    text: "Le Tourbillon Héritage que j'ai commandé est une œuvre d'art mécanique. L'équipe Aurelius a su transcender mes attentes.",
    piece: "Héritage Tourbillon",
  },
  {
    name: "Sophia Marchetti",
    role: "Architecte d'intérieur, Milan",
    note: 5,
    text: "Mon service bespoke a été une expérience inoubliable. Six mois de collaboration intense pour une bague qui me ressemble.",
    piece: "Service Bespoke",
  },
  {
    name: "Ibrahim Al-Rashidi",
    role: "Ambassadeur, Genève",
    note: 5,
    text: "Aurelius Heritage est l'une des rares maisons à allier l'excellence horlogère suisse à l'art de la joaillerie française. Unique.",
    piece: "Solstice Dame",
  },
  {
    name: "Caroline Lefebvre",
    role: "Présidente de galerie, Monaco",
    note: 5,
    text: "La parure Forêt Secrète est le summum du raffinement. Portée lors d'un gala, elle a suscité l'admiration générale.",
    piece: "Forêt Secrète",
  },
];

export const STATS = [
  { value: "1887", label: "Fondée en", suffix: "" },
  { value: "138", label: "Années de savoir-faire", suffix: "" },
  { value: "4,200", label: "Pièces créées", suffix: "+" },
  { value: "32", label: "Pays représentés", suffix: "" },
];

export const PROCESS = [
  {
    num: "01",
    title: "Consultation Privée",
    desc: "Rencontre confidentielle dans notre atelier parisien ou à domicile pour définir votre vision, vos désirs et le budget.",
  },
  {
    num: "02",
    title: "Sélection des Matières",
    desc: "Nos gemmologues GIA présentent une sélection exclusive de pierres certifiées. Chaque pierre est choisie pour son caractère unique.",
  },
  {
    num: "03",
    title: "Esquisse & Design",
    desc: "Nos dessinateurs créent plusieurs propositions à la main. Aquarelles, dessins techniques, modélisation 3D si souhaité.",
  },
  {
    num: "04",
    title: "Création en Atelier",
    desc: "Fabrication entièrement à la main par nos maîtres joailliers. Chaque pièce requiert entre 200 et 800 heures de travail.",
  },
  {
    num: "05",
    title: "Remise Cérémonielle",
    desc: "Présentation privée accompagnée du certificat d'authenticité, du passeport de la pierre et de l'écrin Aurelius Heritage.",
  },
];

export const TEAM = [
  {
    name: "Édouard Aurelius III",
    role: "Maître Joaillier & Directeur",
    bio: "Troisième génération de la famille fondatrice. Formé à l'École des Arts Joailliers, perfectionnement à Anvers et à Tokyo.",
    exp: "28 ans",
  },
  {
    name: "Céleste Fontenay",
    role: "Gemmologue GIA",
    bio: "Docteure en minéralogie, diplômée du GIA (Gemological Institute of America). Spécialiste des rubis birmans et des saphirs du Cachemire.",
    exp: "19 ans",
  },
  {
    name: "Viktor Brandt",
    role: "Maître Horloger",
    bio: "Ancien chef d'atelier chez Patek Philippe. Membre de l'Académie Horlogère de Genève. Spécialiste des complications grands feux.",
    exp: "34 ans",
  },
  {
    name: "Amélie Rousseau",
    role: "Designer Joaillier",
    bio: "École Boulle, puis ESMA Paris. Primée au Grand Prix de la Création de la Ville de Paris. Auteure de 47 collections.",
    exp: "15 ans",
  },
];

export const FAQ = [
  {
    q: "Proposez-vous un service de transport sécurisé ?",
    a: "Oui, nous travaillons avec Brink's et Ferrari Lux pour le transport de valeurs. Toutes nos pièces sont livrées sous escorte et pleinement assurées Lloyd's of London.",
  },
  {
    q: "Puis-je essayer une pièce avant de l'acheter ?",
    a: "Toutes nos pièces disponibles peuvent être présentées lors d'un rendez-vous privé dans notre atelier. Nous proposons également un service de prêt de 48h pour les clients fidèles.",
  },
  {
    q: "Quels sont vos délais pour le sur-mesure ?",
    a: "Les délais varient selon la complexité : 6 mois pour une bague simple, jusqu'à 24 mois pour une montre à complications. Nous vous tenons informés à chaque étape.",
  },
  {
    q: "Acceptez-vous les reprises de bijoux ou montres ?",
    a: "Oui, nous évaluons et rachetions les pièces de haute joaillerie et d'horlogerie de prestige, ou les intégrons dans un échange partiel pour une nouvelle création.",
  },
  {
    q: "Proposez-vous une garantie sur vos créations ?",
    a: "Toutes nos pièces sont garanties à vie contre les défauts de fabrication. Un service d'entretien annuel est inclus les 5 premières années.",
  },
];

export const GEM_COLORS: Record<string, { fill: string; glow: string; name: string }> = {
  diamond: { fill: C.diamond, glow: "rgba(200,216,232,0.6)", name: "Diamant" },
  ruby: { fill: C.ruby, glow: "rgba(155,35,53,0.6)", name: "Rubis" },
  sapphire: { fill: C.sapphire, glow: "rgba(26,58,107,0.6)", name: "Saphir" },
  emerald: { fill: C.emerald, glow: "rgba(26,92,58,0.6)", name: "Émeraude" },
  amethyst: { fill: C.amethyst, glow: "rgba(92,45,122,0.6)", name: "Améthyste" },
};

export function GemStoneSVG({ type, size = 120, animated = true }: { type: string; size?: number; animated?: boolean }) {
  const gem = GEM_COLORS[type] || GEM_COLORS.diamond;
  const [hovered, setHovered] = useState(false);
  const glowSize = hovered ? size * 1.4 : size * 1.1;

  const facets = [
    "M60,10 L90,40 L60,55 Z",
    "M60,10 L30,40 L60,55 Z",
    "M90,40 L100,75 L60,55 Z",
    "M30,40 L20,75 L60,55 Z",
    "M100,75 L60,100 L60,55 Z",
    "M20,75 L60,100 L60,55 Z",
    "M60,100 L90,40 L100,75 Z",
    "M60,100 L30,40 L20,75 Z",
  ];
  const opacities = [0.9, 0.7, 0.8, 0.6, 0.85, 0.65, 0.75, 0.55];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "relative", width: size, height: size, cursor: "pointer" }}
    >
      {/* Glow */}
      <motion.div
        animate={{ width: glowSize, height: glowSize, opacity: hovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${gem.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <motion.svg
        viewBox="0 0 120 110"
        width={size}
        height={size}
        animate={animated ? { rotateY: hovered ? 180 : 0 } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 ${hovered ? 16 : 8}px ${gem.glow})` }}
      >
        {facets.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill={gem.fill}
            fillOpacity={opacities[i]}
            stroke={C.accentLight}
            strokeWidth="0.5"
            animate={{ fillOpacity: hovered ? opacities[i] * 1.2 : opacities[i] }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          />
        ))}
        {/* Center sparkle */}
        {hovered && (
          <motion.circle
            cx="60" cy="55" r="3"
            fill={C.white}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: [0, 1, 0], r: [0, 4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </motion.svg>
    </motion.div>
  );
}

export function Counter({ target, suffix }: { target: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const isNumeric = !isNaN(parseInt(target.replace(/,/g, "")));
  const numericTarget = isNumeric ? parseInt(target.replace(/,/g, "")) : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start = 0;
    const duration = 2000;
    const step = duration / numericTarget;
    const timer = setInterval(() => {
      start += Math.ceil(numericTarget / 80);
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, numericTarget, isNumeric]);

  return (
    <span ref={ref}>
      {isNumeric ? count.toLocaleString("fr-FR") : target}
      {suffix}
    </span>
  );
}

export function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
