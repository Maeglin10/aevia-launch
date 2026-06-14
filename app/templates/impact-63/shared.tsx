"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// ── Design tokens ──
export const C = {
  bg: "#0E0C0A",
  bgCard: "#1C1814",
  bgSection: "#131110",
  gold: "#C9A96E",
  goldLight: "#E8D5A3",
  goldDim: "#8A6E44",
  text: "#F5F0E8",
  textMuted: "#9A8E7E",
  textDim: "#5C5347",
  border: "#2E2820",
  borderGold: "#3A3020",
};

export const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cormorant+SC:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
`;

export const COLLECTIONS = [
  {
    id: "perpetuelle",
    name: "Perpétuelle",
    ref: "MD-2891-PP",
    price: "CHF 38,500",
    category: "Complications",
    desc: "Calendrier perpétuel mécanique. Mouvement manufacture MD-2891, 72h de réserve de marche. Boîtier or blanc 18 carats, cadran guilloché main.",
    movement: "Calibre MD-2891 — 45 rubis",
    case: "Or blanc 18K — Ø 40mm",
    water: "50m",
    accent: "#C9A96E",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80&fit=crop",
  },
  {
    id: "tourbillon",
    name: "Tourbillon Souverain",
    ref: "MD-0001-TB",
    price: "CHF 124,000",
    category: "Complications",
    desc: "Tourbillon volant à cage ouverte. Le summum de l'horlogerie fine, 6 jours de réserve de marche. Serti de 47 diamants VS. Platine 950.",
    movement: "Calibre MD-TB01 — 72 rubis",
    case: "Platine 950 — Ø 42mm",
    water: "30m",
    accent: "#E8D5A3",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80&fit=crop",
  },
  {
    id: "marine",
    name: "Marine Chronographe",
    ref: "MD-7750-MC",
    price: "CHF 18,200",
    category: "Sport",
    desc: "Chronographe colonne-roue. Cadran bleu océan, index luminescents. Bracelet acier satin-poli aux transitions précises.",
    movement: "Calibre ETA 7750 — 17 rubis",
    case: "Acier 316L — Ø 42mm",
    water: "200m",
    accent: "#6B8FBF",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80&fit=crop",
  },
  {
    id: "classique",
    name: "Classique Dame",
    ref: "MD-2892-CD",
    price: "CHF 9,600",
    category: "Classic",
    desc: "Élégance intemporelle pour femme. Cadran nacre naturelle, aiguilles feuille dorées. Le premier achat d'une vie d'horlogerie.",
    movement: "Calibre ETA 2892 — 21 rubis",
    case: "Or rose 18K — Ø 33mm",
    water: "30m",
    accent: "#C9A96E",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80&fit=crop",
  },
  {
    id: "reserve",
    name: "Réserve de Marche",
    ref: "MD-2847-RM",
    price: "CHF 9,800",
    category: "Classic",
    desc: "Affichage de réserve de marche 72 heures en secteur. Acier poli-satiné, bracelet intégré, fond saphir. La lisibilité élevée au rang d'art.",
    movement: "Calibre MD-2847 — 28 rubis",
    case: "Acier 316L poli — Ø 38mm",
    water: "100m",
    accent: "#C9A96E",
    image: "https://images.unsplash.com/photo-1553968448-d1bcbcf51a1f?w=800&q=80&fit=crop",
  },
  {
    id: "grand-complication",
    name: "Grand Complication",
    ref: "MD-GC01",
    price: "CHF 186,000",
    category: "Complications",
    desc: "Sonnerie à la demande, répétition minutes, quantième perpétuel, céloscopie. Le chef-d'œuvre absolu. Moins de 5 pièces par an.",
    movement: "Calibre MD-GC01 — 108 rubis",
    case: "Or blanc 18K — Ø 44mm",
    water: "30m",
    accent: "#E8D5A3",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80&fit=crop",
  },
];

export const HERITAGE = [
  {
    year: "1891",
    title: "Fondation à Genève",
    desc: "Édouard Drouet, maître horloger formé à l'École d'Horlogerie de Genève, ouvre son premier atelier rue de Rive. Cinq compagnons, un établi, l'ambition de l'excellence.",
  },
  {
    year: "1923",
    title: "Brevet Tourbillon",
    desc: "Henri Drouet, fils du fondateur, dépose le brevet du tourbillon volant MD-01 — une cage allégée de 40% par rapport aux standards de l'époque. Médaille d'or à l'Exposition Universelle.",
  },
  {
    year: "1958",
    title: "Manufacture Propre",
    desc: "Construction de la manufacture du Plan-les-Ouates. Pour la première fois, chaque composant — du spiral au balancier — naît sous le même toit. 23 horlogers, 1 vision.",
  },
  {
    year: "1989",
    title: "Calendrier Perpétuel",
    desc: "Présentation du calibre MD-2891, premier mouvement maison à complication perpétuelle. Reconnu par les grands musées de l'horlogerie, exposé au Patek Philippe Museum.",
  },
  {
    year: "2019",
    title: "Quatrième Génération",
    desc: "Sophie Drouet prend la direction artistique. Alliance des techniques ancestrales et du design contemporain. La Maison entre dans l'ère de la rareté calculée.",
  },
];

export const SAVOIR_FAIRE_HOME = [
  {
    title: "Guillochage Main",
    desc: "Chaque cadran est guilloché à la main sur tour à guillocher du XIXe siècle. Un cadran requiert 8 heures de travail.",
    stat: "8h / cadran",
  },
  {
    title: "Anglage",
    desc: "Les chanfreins des ponts sont anglés, polis, biseautés à la main. 1 micron d'écart et la pièce est refusée.",
    stat: "±1 μm tolérance",
  },
  {
    title: "Assemblage",
    desc: "Un seul maître-horloger assemble chaque montre de bout en bout. Il la signe.",
    stat: "1 artisan / montre",
  },
  {
    title: "Contrôle Qualité",
    desc: "Chaque pièce est chronométrée 72 heures dans 5 positions. Moins de 2 secondes d'écart autorisées.",
    stat: "72h de tests",
  },
];

export const PRESS = [
  {
    quote: "La Perpétuelle de Drouet est, sans contestation possible, l'une des chicanes mécaniques les plus impressionnantes produites en ce siècle.",
    author: "Jean-Marie Schaller",
    outlet: "Revolution Watch",
    year: "2024",
  },
  {
    quote: "Sophie Drouet a réussi l'impossible : rendre Drouet désirable aux collectionneurs de la nouvelle génération sans trahir l'âme des anciens.",
    author: "Cara Barrett",
    outlet: "Town & Country",
    year: "2023",
  },
  {
    quote: "Entrer dans la Maison Drouet, c'est comprendre que la montre n'est pas un objet. C'est un argument philosophique sur le temps.",
    author: "Nicolas Foulc",
    outlet: "Vogue Paris",
    year: "2024",
  },
];

export const AWARDS = ["GPHG — Aiguille d'Or 2023", "Prix Gaïa 2021", "Red Dot Design 2022", "FHH Award 2024"];

export const BESPOKE_STEPS = [
  {
    n: "01",
    title: "Consultation Privée",
    desc: "Rendez-vous confidentiel dans notre salon de la rue de Rive. Vous exposez votre vision. Nos horlogers écoutent, questionnent, dessinent.",
  },
  {
    n: "02",
    title: "Design Sur Mesure",
    desc: "Trois propositions de cadran, boîtier et bracelet. Gravures, guilloché personnalisé, monogramme. Chaque détail est validé ensemble.",
  },
  {
    n: "03",
    title: "Fabrication",
    desc: "14 à 18 mois de fabrication par votre maître-horloger attitré. Des photos mensuelles vous témoignent de l'avancement de votre pièce.",
  },
  {
    n: "04",
    title: "Remise Solennelle",
    desc: "Livraison en mains propres à Genève ou à domicile. Certificat d'authenticité numéroté, garantie à vie, passeport de service.",
  },
];

// ── Shared components ──
export function StatNumber({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center" }}
    >
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.gold, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textMuted, marginTop: "0.5rem", textTransform: "uppercase" }}>
        {label}
      </div>
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
      <div style={{ height: "1px", width: "2rem", background: C.goldDim }} />
      <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.goldDim, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

export function HoverGoldLine() {
  return (
    <motion.div
      style={{ position: "absolute", bottom: 0, left: 0, height: "1px", background: C.gold, width: 0 }}
      whileHover={{ width: "100%" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Orbital SVG Complication ──
export function OrbitalComplication({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const r3 = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <motion.svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <motion.g style={{ rotate: r1, originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="175" fill="none" stroke={C.goldDim} strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="200" cy="25" r="4" fill={C.gold} />
        <circle cx="200" cy="375" r="2" fill={C.goldDim} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 200 + 165 * Math.sin(angle);
          const y1 = 200 - 165 * Math.cos(angle);
          const x2 = 200 + 175 * Math.sin(angle);
          const y2 = 200 - 175 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth={i % 3 === 0 ? "2" : "0.8"} />;
        })}
      </motion.g>
      <motion.g style={{ rotate: r2, originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="130" fill="none" stroke={C.borderGold} strokeWidth="1" />
        <circle cx="200" cy="70" r="6" fill="none" stroke={C.gold} strokeWidth="1.5" />
        <circle cx="200" cy="330" r="3" fill={C.goldDim} />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const x1 = 200 + 122 * Math.sin(angle);
          const y1 = 200 - 122 * Math.cos(angle);
          const x2 = 200 + 130 * Math.sin(angle);
          const y2 = 200 - 130 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.goldDim} strokeWidth={i % 5 === 0 ? "1.5" : "0.5"} />;
        })}
      </motion.g>
      <motion.g style={{ rotate: r3, originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="88" fill="none" stroke={C.border} strokeWidth="1.5" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 200 + 80 * Math.sin(angle);
          const y1 = 200 - 80 * Math.cos(angle);
          const x2 = 200 + 88 * Math.sin(angle);
          const y2 = 200 - 88 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.goldDim} strokeWidth="1" />;
        })}
      </motion.g>
      <circle cx="200" cy="200" r="65" fill={C.bgCard} stroke={C.border} strokeWidth="1" />
      <circle cx="200" cy="200" r="60" fill="none" stroke={C.borderGold} strokeWidth="0.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line key={i} x1={200 + 15 * Math.cos(angle)} y1={200 + 15 * Math.sin(angle)} x2={200 + 55 * Math.cos(angle)} y2={200 + 55 * Math.sin(angle)} stroke={C.borderGold} strokeWidth="0.5" />
        );
      })}
      <motion.line x1="200" y1="200" x2="200" y2="152" stroke={C.text} strokeWidth="2.5" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 43200, repeat: Infinity, ease: "linear" }} style={{ originX: "200px", originY: "200px" }} />
      <motion.line x1="200" y1="200" x2="200" y2="145" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 3600, repeat: Infinity, ease: "linear" }} style={{ originX: "200px", originY: "200px" }} />
      <motion.line x1="200" y1="220" x2="200" y2="142" stroke="#C04040" strokeWidth="0.8" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ originX: "200px", originY: "200px" }} />
      <circle cx="200" cy="200" r="4" fill={C.gold} />
      <circle cx="200" cy="200" r="2" fill={C.bgCard} />
      <text x="200" y="175" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="Cormorant SC, serif" letterSpacing="3">MAISON</text>
      <text x="200" y="186" textAnchor="middle" fill={C.gold} fontSize="9" fontFamily="Cormorant SC, serif" letterSpacing="2">DROUET</text>
      <text x="200" y="228" textAnchor="middle" fill={C.textDim} fontSize="5.5" fontFamily="Cormorant SC, serif" letterSpacing="2">GENÈVE · EST. 1891</text>
    </motion.svg>
  );
}

// Style Injector
export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-63-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-63-styles";
    tag.textContent = FONT;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-63-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
