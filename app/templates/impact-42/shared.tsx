'use client';

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Star,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  bg: "#000000",
  bgAlt: "#0a0a0a",
  bgCard: "#111111",
  bgCardHover: "#1a1a1a",
  text: "#f5f5f5",
  textLight: "#a0a0a0",
  textMuted: "#555555",
  accent: "#dc2626",
  accentHover: "#ef4444",
  accentGlow: "rgba(220,38,38,0.25)",
  white: "#ffffff",
  border: "#222222",
  borderHover: "#333333",
  shadow: "rgba(220,38,38,0.15)",
  headingFont: "'Bebas Neue', Impact, 'Arial Black', sans-serif",
  bodyFont: "'Inter', system-ui, sans-serif",
};

// ─── EQ Bars ──────────────────────────────────────────────────────────────────
export function EQBars() {
  const bars = [
    { delay: 0, min: 20, max: 80 },
    { delay: 0.1, min: 40, max: 95 },
    { delay: 0.2, min: 15, max: 70 },
    { delay: 0.05, min: 60, max: 100 },
    { delay: 0.15, min: 25, max: 85 },
    { delay: 0.25, min: 50, max: 90 },
    { delay: 0.08, min: 35, max: 75 },
    { delay: 0.18, min: 45, max: 95 },
    { delay: 0.3, min: 20, max: 65 },
    { delay: 0.12, min: 55, max: 100 },
    { delay: 0.22, min: 30, max: 80 },
    { delay: 0.07, min: 40, max: 90 },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "80px", padding: "0 4px" }}>
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          animate={{ height: [`${bar.min}%`, `${bar.max}%`, `${bar.min + 10}%`, `${bar.max - 5}%`, `${bar.min}%`] }}
          transition={{ duration: 0.9 + bar.delay, repeat: Infinity, ease: "easeInOut", delay: bar.delay }}
          style={{ width: 6, backgroundColor: C.accent, borderRadius: "2px 2px 0 0", minHeight: "20%", boxShadow: `0 0 8px ${C.accent}` }}
        />
      ))}
    </div>
  );
}

// ─── Artist Marquee ───────────────────────────────────────────────────────────
export function ArtistMarquee({ artists }: { artists: string[] }) {
  const doubled = [...artists, ...artists];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${C.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${C.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "0", whiteSpace: "nowrap" }}
      >
        {doubled.map((artist, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", padding: "0 2.5rem" }}>
            <span style={{ fontFamily: C.headingFont, fontSize: "1.6rem", color: i % 3 === 0 ? C.accent : C.textMuted, letterSpacing: "0.08em" }}>{artist}</span>
            <span style={{ color: C.border, fontSize: "1.2rem" }}>◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Section reveal ───────────────────────────────────────────────────────────
export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "none", border: "none", cursor: "pointer", padding: "1.25rem 0", textAlign: "left", gap: "1rem" }}
      >
        <span style={{ fontFamily: C.bodyFont, fontSize: "1rem", color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={20} color={C.accent} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.8, paddingBottom: "1.25rem" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const marqueeArtists = [
  "Pomme", "Vianney", "Zaho de Sagazan", "Lomepal", "Julien Doré",
  "Clara Luciani", "Fishbach", "Pierre de Maere", "Bon Entendeur", "Caballero & JeanJass",
  "Roméo Elvis", "Angèle", "OrelSan", "Eddy de Pretto",
];

export const homeStudios = [
  {
    name: "Studio A",
    size: "85 m²",
    desc: "Notre flagship studio. Live room acoustique de 85 m², conçu pour capturer les grands ensembles. SSL 9000 J 72 channels, Neve 1073 outboard, Pro Tools HDX.",
    features: ["SSL 9000 J (72 ch.)", "Neve 1073 × 8", "Pro Tools HDX + Logic Pro X", "Isolation 72 dB", "Iso booth (15 m²)", "Grand piano Steinway D"],
    color: C.accent,
  },
  {
    name: "Studio B",
    size: "45 m²",
    desc: "Studio polyvalent idéal pour voix, podcasts, overdubs et mix. SSL Duality 48ch + Avid S6. Full ITB & hybrid rig, 2 iso booths.",
    features: ["SSL Duality 48ch", "Avid S6", "Full ITB + hybrid rig", "2 iso booths", "Pro Tools HDX", "Micros vintage Neumann U47"],
    color: "#f97316",
  },
  {
    name: "Mastering Suite",
    size: "28 m²",
    desc: "Suite de mastering de précision. Prism Dream ADA-8XR, Dangerous Master, Sennheiser HD800S, Adam A77X. Référence acoustique calibrée.",
    features: ["Prism Dream ADA-8XR", "Dangerous Master", "Sennheiser HD800S", "Adam A77X", "DAW : Sequoia + Pro Tools", "Accès autonome 24/7"],
    color: "#8b5cf6",
  },
];

export const gear = [
  { category: "Consoles", items: ["SSL 9000 J (Studio A)", "SSL Duality 48ch (Studio B)", "SSL AWS 948 (Mix)"] },
  { category: "Microphones", items: ["Neumann U47, U67, U87", "AKG C12, C414", "Shure SM7B, SM57", "Coles 4038 ribbon", "RCA 77 DX vintage"] },
  { category: "Outboard", items: ["Neve 1073 × 8", "API 512c × 4", "UA 1176LN × 4", "Empirical Labs Distressor × 2", "Manley Vari-Mu"] },
  { category: "Monitoring", items: ["Augspurger (2-way)", "Genelec 1234A", "Yamaha NS-10M", "Avantone MixCubes", "Adam A77X (Mastering)"] },
  { category: "Instruments", items: ["Steinway D (Studio A)", "Hammond B3 + Leslie 122", "Gibson Les Paul 1959 (repro)", "Fender Strat 1964", "Moog Minimoog"] },
  { category: "Enregistrement", items: ["Pro Tools HDX × 3", "Logic Pro X", "Ableton Live Suite", "UAD Quad Core × 2", "Dante audio network"] },
];

export const testimonials = [
  { name: "Julien Renard", role: "Producteur — JR Productions", text: "J'ai enregistré dans des studios à Los Angeles, Londres et Berlin. Echo Chamber est au même niveau. L'acoustique du Studio A est exceptionnelle. Je reviens pour chaque projet.", rating: 5, avatar: "JR" },
  { name: "Maeva Torres", role: "Artiste, label Sony Music", text: "L'équipe d'Echo Chamber a capturé quelque chose que les autres studios n'avaient pas réussi à saisir. Ils comprennent vraiment l'intention artistique. Mon album sonne incroyable.", rating: 5, avatar: "MT" },
  { name: "DeeJay Phantom", role: "Producteur électronique", text: "Mastering Suite pour le mastering. Résultat parfait en 2 sessions. Le monitoring est une révélation — j'entends enfin les détails que je n'avais jamais perçus auparavant.", rating: 5, avatar: "DJ" },
];

export const packages = [
  {
    name: "Demi-Journée",
    duration: "6h",
    price: "480",
    studio: "Studio B ou Mastering",
    desc: "Idéal pour voix, overdubs, podcast ou session courte",
    items: ["6h de studio", "Ingénieur du son inclus", "Micros et câblage fournis", "Session Pro Tools livrée", "1 révision de mix incluse"],
    color: C.bgCard,
    border: C.border,
    accentColor: C.accent,
    popular: false,
  },
  {
    name: "Journée Complète",
    duration: "12h",
    price: "880",
    studio: "Studio A, B ou Mastering",
    desc: "La session standard pour enregistrements complets",
    items: ["12h de studio", "Ingénieur senior inclus", "Choix du studio", "Session Pro Tools", "3 révisions de mix", "Accès backline complet", "Déjeuner inclus (traiteur)"],
    color: C.accent,
    border: "transparent",
    accentColor: C.white,
    popular: true,
  },
  {
    name: "Pack Semaine",
    duration: "5 jours",
    price: "3 800",
    studio: "Studio A prioritaire",
    desc: "Production complète d'un EP ou album",
    items: ["5 × 12h consécutifs", "Producteur assistant", "Studio A en priorité", "Mastering inclus (4 titres)", "Stems livrés", "Backline complet", "Suivi post-session", "Crédit sur l'œuvre"],
    color: "#111111",
    border: C.border,
    accentColor: C.accent,
    popular: false,
  },
];

export const faqs = [
  { q: "Comment réserver une session ?", a: "Contactez-nous par email ou téléphone pour vérifier les disponibilités. Un acompte de 30% confirme la réservation. Annulation sans frais jusqu'à 72h avant la session." },
  { q: "Fournissez-vous un ingénieur du son ?", a: "Oui, un ingénieur expérimenté est inclus dans tous nos forfaits. Pour les packs Semaine, vous pouvez aussi amener votre propre ingénieur moyennant une réduction de 15%." },
  { q: "Puis-je utiliser mon propre matériel ?", a: "Absolument. Nous avons un accès Dante pour intégrer du matériel externe. Vérifiez la compatibilité avec notre équipe technique en amont. Nous acceptons aussi les plugins tiers." },
  { q: "Les sessions sont-elles enregistrées en multitrack ?", a: "Oui, toutes les sessions livrent les multitracks Pro Tools (BWF 48kHz/32bit) sur votre support ou via WeTransfer. La session est archivée 3 mois chez nous gratuitement." },
  { q: "Proposez-vous du mastering ?", a: "Oui, notre Mastering Suite est équipée pour le mastering analogique et numérique. Comptez 200€/h ou 150€ par titre en forfait. Tarifs préférentiels pour les clients studio." },
  { q: "Le studio est-il accessible la nuit ?", a: "La Mastering Suite dispose d'un accès autonome 24h/24, 7j/7. Les Studios A et B peuvent être réservés de nuit (22h–8h) avec tarif préférentiel de −20% sur présentation d'un projet." },
];
