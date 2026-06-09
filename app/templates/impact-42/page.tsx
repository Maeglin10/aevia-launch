// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Music,
  Headphones,
  Calendar,
  Check,
  ChevronDown,
  ArrowRight,
  Star,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Cpu,
  Radio,
  Layers,
  Clock,
  Users,
  Volume2,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
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

// ─── Page type ────────────────────────────────────────────────────────────────
type StudioPage = "home" | "studios" | "artistes" | "booking" | "production" | "contact" | "mentions" | "privacy";

// ─── EQ Bars ──────────────────────────────────────────────────────────────────
function EQBars() {
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
function ArtistMarquee({ artists }: { artists: string[] }) {
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
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
function FAQItem({ q, a }: { q: string; a: string }) {
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
const marqueeArtists = [
  "Pomme", "Vianney", "Zaho de Sagazan", "Lomepal", "Julien Doré",
  "Clara Luciani", "Fishbach", "Pierre de Maere", "Bon Entendeur", "Caballero & JeanJass",
  "Roméo Elvis", "Angèle", "OrelSan", "Eddy de Pretto",
];

const homeStudios = [
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

const gear = [
  { category: "Consoles", items: ["SSL 9000 J (Studio A)", "SSL Duality 48ch (Studio B)", "SSL AWS 948 (Mix)"] },
  { category: "Microphones", items: ["Neumann U47, U67, U87", "AKG C12, C414", "Shure SM7B, SM57", "Coles 4038 ribbon", "RCA 77 DX vintage"] },
  { category: "Outboard", items: ["Neve 1073 × 8", "API 512c × 4", "UA 1176LN × 4", "Empirical Labs Distressor × 2", "Manley Vari-Mu"] },
  { category: "Monitoring", items: ["Augspurger (2-way)", "Genelec 1234A", "Yamaha NS-10M", "Avantone MixCubes", "Adam A77X (Mastering)"] },
  { category: "Instruments", items: ["Steinway D (Studio A)", "Hammond B3 + Leslie 122", "Gibson Les Paul 1959 (repro)", "Fender Strat 1964", "Moog Minimoog"] },
  { category: "Enregistrement", items: ["Pro Tools HDX × 3", "Logic Pro X", "Ableton Live Suite", "UAD Quad Core × 2", "Dante audio network"] },
];

const testimonials = [
  { name: "Julien Renard", role: "Producteur — JR Productions", text: "J'ai enregistré dans des studios à Los Angeles, Londres et Berlin. Echo Chamber est au même niveau. L'acoustique du Studio A est exceptionnelle. Je reviens pour chaque projet.", rating: 5, avatar: "JR" },
  { name: "Maeva Torres", role: "Artiste, label Sony Music", text: "L'équipe d'Echo Chamber a capturé quelque chose que les autres studios n'avaient pas réussi à saisir. Ils comprennent vraiment l'intention artistique. Mon album sonne incroyable.", rating: 5, avatar: "MT" },
  { name: "DeeJay Phantom", role: "Producteur électronique", text: "Mastering Suite pour le mastering. Résultat parfait en 2 sessions. Le monitoring est une révélation — j'entends enfin les détails que je n'avais jamais perçus auparavant.", rating: 5, avatar: "DJ" },
];

const packages = [
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

const faqs = [
  { q: "Comment réserver une session ?", a: "Contactez-nous par email ou téléphone pour vérifier les disponibilités. Un acompte de 30% confirme la réservation. Annulation sans frais jusqu'à 72h avant la session." },
  { q: "Fournissez-vous un ingénieur du son ?", a: "Oui, un ingénieur expérimenté est inclus dans tous nos forfaits. Pour les packs Semaine, vous pouvez aussi amener votre propre ingénieur moyennant une réduction de 15%." },
  { q: "Puis-je utiliser mon propre matériel ?", a: "Absolument. Nous avons un accès Dante pour intégrer du matériel externe. Vérifiez la compatibilité avec notre équipe technique en amont. Nous acceptons aussi les plugins tiers." },
  { q: "Les sessions sont-elles enregistrées en multitrack ?", a: "Oui, toutes les sessions livrent les multitracks Pro Tools (BWF 48kHz/32bit) sur votre support ou via WeTransfer. La session est archivée 3 mois chez nous gratuitement." },
  { q: "Proposez-vous du mastering ?", a: "Oui, notre Mastering Suite est équipée pour le mastering analogique et numérique. Comptez 200€/h ou 150€ par titre en forfait. Tarifs préférentiels pour les clients studio." },
  { q: "Le studio est-il accessible la nuit ?", a: "La Mastering Suite dispose d'un accès autonome 24h/24, 7j/7. Les Studios A et B peuvent être réservés de nuit (22h–8h) avec tarif préférentiel de −20% sur présentation d'un projet." },
];

// ─── SUB-PAGES ────────────────────────────────────────────────────────────────

function StudiosPage({ goTo }: { goTo: (p: StudioPage) => void }) {
  const [activeTab, setActiveTab] = useState(0);

  const studioDetails = [
    {
      name: "Studio A",
      tag: "Main Room",
      size: "80 m²",
      rate: "800€/jour",
      color: C.accent,
      img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
      desc: "Notre flagship. Grand live room acoustique de 80 m² avec traitement sur-mesure, pensé pour capter les grands ensembles — orchestres de chambre, groupes rock, chœurs. La console SSL 9000 J 72 canaux est l'une des rares en France.",
      console: "SSL 9000 J — 72 ch.",
      gear: [
        "SSL 9000 J console — 72 canaux",
        "Neve 1073 × 8 (preamps)",
        "Pro Tools HDX + Logic Pro",
        "Neumann U87, U47, C414",
        "Hammond B3 + Leslie 122",
        "Steinway D (grand piano)",
        "Grand live room — 80 m²",
        "Iso booth 15 m² intégrée",
        "Isolation 72 dB",
        "Dante audio network",
      ],
    },
    {
      name: "Studio B",
      tag: "Production & Mixing",
      size: "45 m²",
      rate: "500€/jour",
      color: "#f97316",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
      desc: "Studio polyvalent taillé pour la production moderne et le mixing hybride. L'SSL Duality 48ch et l'Avid S6 offrent une flexibilité totale — full ITB, full analog, ou rig hybride au choix de l'ingénieur.",
      console: "SSL Duality — 48 ch.",
      gear: [
        "SSL Duality 48ch console",
        "Avid S6 control surface",
        "Full ITB + hybrid rig",
        "2 iso booths indépendantes",
        "Pro Tools HDX",
        "Neumann U47, U87",
        "Universal Audio Apollo 16",
        "Genelec 1234A monitors",
        "Yamaha NS-10M",
        "UAD Quad Core × 2",
      ],
    },
    {
      name: "Mastering Suite",
      tag: "Mastering",
      size: "20 m²",
      rate: "200€/h",
      color: "#8b5cf6",
      img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&fit=crop",
      desc: "Suite de mastering de précision acoustique. Calibrée pour une reproduction sonore de référence, elle accueille les sessions de mastering analogique et numérique. Accessible en autonomie 24/7 pour les clients abonnés.",
      console: "Prism Dream ADA-8XR",
      gear: [
        "Prism Dream ADA-8XR (conversion)",
        "Dangerous Master (summing)",
        "Sennheiser HD800S",
        "Adam A77X monitors",
        "Sequoia + Pro Tools",
        "Izotope Ozone 11 Advanced",
        "Plugin Alliance Mastering Suite",
        "Référence acoustique calibrée",
        "Accès autonome 24/7",
        "Archivage session inclus",
      ],
    },
  ];

  const outboard = [
    { brand: "Neve", items: ["1073 × 8", "33609 compressor"] },
    { brand: "API", items: ["512c × 4", "2500 bus compressor"] },
    { brand: "Universal Audio", items: ["1176LN × 4", "LA-2A × 2"] },
    { brand: "Empirical Labs", items: ["Distressor × 2", "Fatso"] },
    { brand: "Manley", items: ["Vari-Mu", "SLAM!"] },
    { brand: "Pultec", items: ["EQP-1A × 2", "MEQ-5 × 2"] },
  ];

  const s = studioDetails[activeTab];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      {/* Header */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nos espaces</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>NOS STUDIOS</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75 }}>
          Trois espaces pensés pour des besoins différents. Chacun dispose d'un parc matériel haut de gamme et d'une acoustique traitée par des experts.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: "2.5rem" }}>
          {studioDetails.map((sd, i) => (
            <button
              key={sd.name}
              type="button"
              onClick={() => setActiveTab(i)}
              style={{
                padding: "0.75rem 1.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.headingFont,
                fontSize: "1.1rem",
                letterSpacing: "0.08em",
                color: activeTab === i ? sd.color : C.textMuted,
                borderBottom: activeTab === i ? `2px solid ${sd.color}` : "2px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-1px",
              }}
            >
              {sd.name}
            </button>
          ))}
        </div>
      </div>

      {/* Studio detail */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem 4rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: s.color, letterSpacing: "0.04em" }}>{s.name}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: s.color, border: `1px solid ${s.color}55`, padding: "0.2rem 0.7rem", borderRadius: "4px", fontWeight: 700 }}>{s.tag}</span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Surface</div>
                    <div style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.04em" }}>{s.size}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tarif</div>
                    <div style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: s.color, letterSpacing: "0.04em" }}>{s.rate}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Console</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.text, fontWeight: 600 }}>{s.console}</div>
                  </div>
                </div>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.85, marginBottom: "2rem" }}>{s.desc}</p>
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                  <img src={s.img} alt={s.name} loading="lazy" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.bg}88, transparent)` }} />
                </div>
              </div>
              {/* Right — gear grid */}
              <div>
                <h3 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>ÉQUIPEMENT INCLUS</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "2.5rem" }}>
                  {s.gear.map((item) => (
                    <div key={item} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "0.75rem 0.9rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo("booking")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: s.color, color: C.white, padding: "0.9rem 2rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.9rem", boxShadow: `0 4px 20px ${s.color}33`, letterSpacing: "0.02em" }}
                >
                  <Calendar size={15} /> Réserver {s.name} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Outboard section */}
      <div style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Outboard</span>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 2.5rem" }}>NOTRE ARSENAL</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
            {outboard.map((o) => (
              <div key={o.brand} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.5rem" }}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1rem" }}>{o.brand}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {o.items.map((item) => (
                    <li key={item} style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, padding: "0.35rem 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistesPage({ goTo }: { goTo: (p: StudioPage) => void }) {
  const artistRoster = [
    { name: "Kova", genre: "R&B / Soul", albums: 3, achievement: "Top 10 FR", desc: "Son dernier album a atteint le Top 10 FR. Voix puissante, production soul moderne enregistrée en Studio A.", tags: ["R&B", "Soul", "Vocals"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&fit=crop" },
    { name: "Théo Laurent", genre: "Hip-Hop", albums: 2, achievement: "50M streams Spotify", desc: "50M streams cumulés sur Spotify. Textes incisifs, prod trap/boom-bap. Enregistré en Studio B.", tags: ["Hip-Hop", "Trap", "Rap"], img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80&fit=crop" },
    { name: "MIRA", genre: "Electro / Pop", albums: 1, achievement: "Netflix · Canal+", desc: "Synchronisations sur Netflix et Canal+. Electro-pop aérienne avec des arrangements sophistiqués.", tags: ["Electro", "Pop", "Sync"], img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop" },
    { name: "Les Frères Vidal", genre: "Jazz", albums: 4, achievement: "Victoires de la Musique", desc: "Nominés aux Victoires de la Musique. Quartet jazz moderne, live en Studio A avec grand piano Steinway D.", tags: ["Jazz", "Acoustic", "Live"], img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&fit=crop" },
    { name: "Lucie Mercer", genre: "Folk / Indie", albums: 1, achievement: "Coup de cœur Fnac", desc: "Coup de cœur Fnac pour son premier album. Folk intime enregistré en Studio B, arrangements cordes sur Studio A.", tags: ["Folk", "Indie", "Acoustic"], img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&fit=crop" },
    { name: "BLOC", genre: "Metal / Rock", albums: 2, achievement: "Tournée Européenne", desc: "Tournée européenne 2025. Metal alt-rock, drum live room Studio A, guitares et mix en Studio B.", tags: ["Metal", "Rock", "Live"], img: "https://images.unsplash.com/photo-1578944032637-f09897c5a4b6?w=800&q=80&fit=crop" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Ils ont enregistré ici</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>ARTISTES</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75, marginBottom: "3rem" }}>
          200+ artistes et producteurs ont fait confiance à Echo Chamber depuis notre ouverture. Voici quelques-uns de ceux qui ont gravé leur son entre ces murs.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
          {artistRoster.map((artist, i) => (
            <SectionReveal key={artist.name} delay={i * 0.08}>
              <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.25s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={artist.img} alt={artist.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.bg}ee, transparent 50%)` }} />
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: C.accent, color: C.white, padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, fontFamily: C.bodyFont, letterSpacing: "0.06em" }}>
                    {artist.achievement}
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div>
                      <h3 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", color: C.white, letterSpacing: "0.04em", margin: 0 }}>{artist.name}</h3>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent, fontWeight: 600 }}>{artist.genre}</span>
                    </div>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", color: C.textMuted }}>{artist.albums} album{artist.albums > 1 ? "s" : ""}</span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.7, margin: "0.75rem 0 1rem" }}>{artist.desc}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {artist.tags.map((tag) => (
                      <span key={tag} style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.2rem 0.55rem", borderRadius: "4px", letterSpacing: "0.04em" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "4rem", padding: "3rem", backgroundColor: C.bgCard, borderRadius: "16px", border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "1rem" }}>VOTRE NOM ICI ?</h2>
          <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            Rejoignez le roster d'artistes qui ont façonné leur son à Echo Chamber.
          </p>
          <button
            type="button"
            onClick={() => goTo("booking")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: C.accent, color: C.white, padding: "1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", boxShadow: `0 8px 30px ${C.accentGlow}` }}
          >
            Réserver une session <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studio: "",
    startDate: "",
    days: "",
    sessionType: "",
    artist: "",
    genre: "",
    description: "",
    engineer: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    padding: "0.8rem 1rem",
    color: C.text,
    fontFamily: C.bodyFont,
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: C.bodyFont,
    fontSize: "0.78rem",
    fontWeight: 600,
    color: C.textLight,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.4rem",
    display: "block",
  };

  const fieldGroup = (label: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", maxWidth: 520, padding: "3rem 2rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: `${C.accent}22`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem" }}>
            <Check size={32} color={C.accent} />
          </div>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "1rem" }}>DEMANDE REÇUE</h2>
          <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.75, fontSize: "1rem" }}>
            Notre équipe vous contacte sous <strong style={{ color: C.accent }}>2h ouvrées</strong> pour confirmer votre session et vous communiquer les détails de réservation.
          </p>
          <p style={{ fontFamily: C.bodyFont, color: C.textMuted, fontSize: "0.85rem", marginTop: "1rem" }}>
            Un email de confirmation vous a été envoyé à l'adresse indiquée.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Réservation</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>RÉSERVER</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", lineHeight: 1.75, marginBottom: "3rem", maxWidth: 520 }}>
          Remplissez le formulaire ci-dessous. Notre équipe valide les disponibilités et revient vers vous sous 2h ouvrées.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Studio & dates */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>VOTRE SESSION</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Studio",
                <select name="studio" value={form.studio} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Sélectionner un studio</option>
                  <option value="studio-a">Studio A — 800€/jour</option>
                  <option value="studio-b">Studio B — 500€/jour</option>
                  <option value="mastering">Mastering Suite — 200€/h</option>
                </select>
              )}
              {fieldGroup("Type de session",
                <select name="sessionType" value={form.sessionType} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Sélectionner</option>
                  <option value="recording">Enregistrement</option>
                  <option value="mixing">Mixage</option>
                  <option value="mastering">Mastering</option>
                  <option value="production">Production</option>
                </select>
              )}
              {fieldGroup("Date de début",
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required style={inputStyle} />
              )}
              {fieldGroup("Nombre de jours / heures",
                <input type="text" name="days" value={form.days} onChange={handleChange} placeholder="Ex : 2 jours ou 6h" required style={inputStyle} />
              )}
            </div>
            {fieldGroup("Ingénieur du son",
              <select name="engineer" value={form.engineer} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                <option value="">Sélectionner</option>
                <option value="yes">Oui, ingénieur Echo Chamber (+200€/jour)</option>
                <option value="no">Non, j'amène mon propre ingénieur</option>
              </select>
            )}
          </div>

          {/* Project info */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>VOTRE PROJET</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Nom artiste / groupe",
                <input type="text" name="artist" value={form.artist} onChange={handleChange} placeholder="Nom de scène ou groupe" required style={inputStyle} />
              )}
              {fieldGroup("Genre musical",
                <input type="text" name="genre" value={form.genre} onChange={handleChange} placeholder="Ex : Hip-Hop, Jazz, Électro…" style={inputStyle} />
              )}
            </div>
            {fieldGroup("Description du projet",
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Décrivez votre projet, vos besoins spécifiques, le nombre de musiciens…" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            )}
          </div>

          {/* Contact */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>CONTACT</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Nom complet",
                <input type="text" name="contactName" value={form.contactName} onChange={handleChange} placeholder="Prénom Nom" required style={inputStyle} />
              )}
              {fieldGroup("Email",
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@exemple.fr" required style={inputStyle} />
              )}
              {fieldGroup("Téléphone",
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00" style={inputStyle} />
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", backgroundColor: C.accent, color: C.white, padding: "1.1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "1rem", boxShadow: `0 8px 30px ${C.accentGlow}`, letterSpacing: "0.03em" }}
          >
            Envoyer ma demande <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function ProductionPage({ goTo }: { goTo: (p: StudioPage) => void }) {
  const services = [
    {
      icon: <Music size={24} color={C.accent} />,
      title: "Beat Production",
      desc: "Beats exclusifs produits par nos producteurs en résidence. Tous styles — trap, boom-bap, afro, électronique, orchestral.",
      pricing: [
        { label: "Beat exclusif", price: "à partir de 500€" },
        { label: "Leasing (non-exclusif)", price: "à partir de 99€" },
        { label: "Pack 5 beats leasing", price: "399€" },
      ],
      color: C.accent,
    },
    {
      icon: <Layers size={24} color="#f97316" />,
      title: "Arrangement & Orchestration",
      desc: "De l'idée brute à l'arrangement complet — cordes, cuivres, chœurs, arrangements électroniques. Tarif sur devis selon complexité.",
      pricing: [
        { label: "Arrangement simple (1-4 instru.)", price: "sur devis" },
        { label: "Arrangement complet", price: "sur devis" },
        { label: "Orchestration complète", price: "sur devis" },
      ],
      color: "#f97316",
    },
    {
      icon: <Volume2 size={24} color="#8b5cf6" />,
      title: "Mix & Mastering",
      desc: "Mixage et mastering par des ingénieurs certifiés. Délai standard 5–7 jours ouvrés. Retours illimités inclus dans le tarif.",
      pricing: [
        { label: "Mixage — par titre", price: "300€" },
        { label: "Mastering — par titre", price: "150€" },
        { label: "Mix + Master bundle", price: "400€/titre" },
      ],
      color: "#8b5cf6",
    },
    {
      icon: <Radio size={24} color="#22c55e" />,
      title: "Music Sync & Supervision",
      desc: "Placement de vos titres en synchronisation (film, série, publicité, jeu vidéo). Supervision musicale pour productions audiovisuelles.",
      pricing: [
        { label: "Dépôt catalogue sync", price: "gratuit" },
        { label: "Supervision musicale", price: "sur devis" },
        { label: "Commission sync placement", price: "20%" },
      ],
      color: "#22c55e",
    },
    {
      icon: <Cpu size={24} color="#06b6d4" />,
      title: "Sample Packs",
      desc: "Packs de samples originaux enregistrés dans nos studios — drums, basses, synthés, one-shots, loops. Droits libres, utilisation commerciale.",
      pricing: [
        { label: "Pack standard (100 samples)", price: "49€" },
        { label: "Pack premium (300 samples)", price: "99€" },
        { label: "Abonnement mensuel", price: "19€/mois" },
      ],
      color: "#06b6d4",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Services</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>PRODUCTION</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75, marginBottom: "3.5rem" }}>
          Au-delà de la location de studio, Echo Chamber propose une suite complète de services de production musicale pour accompagner votre projet de A à Z.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "4rem" }}>
          {services.map((svc, i) => (
            <SectionReveal key={svc.title} delay={i * 0.07}>
              <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    {svc.icon}
                    <h3 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", color: C.white, letterSpacing: "0.04em", margin: 0 }}>{svc.title}</h3>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.75, maxWidth: 560 }}>{svc.desc}</p>
                </div>
                <div style={{ minWidth: 220 }}>
                  <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }}>
                    {svc.pricing.map((p, j) => (
                      <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", borderBottom: j < svc.pricing.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{p.label}</span>
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", fontWeight: 700, color: svc.color }}>{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Devis CTA */}
        <div style={{ backgroundColor: C.accent, borderRadius: "16px", padding: "3rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "0.75rem" }}>DEMANDER UN DEVIS</h2>
          <p style={{ fontFamily: C.bodyFont, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 460, margin: "0 auto 1.75rem" }}>
            Chaque projet est unique. Contactez-nous pour un devis personnalisé adapté à vos besoins et votre budget.
          </p>
          <button
            type="button"
            onClick={() => goTo("contact")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: C.white, color: C.accent, padding: "1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 800, fontFamily: C.bodyFont, fontSize: "0.95rem", letterSpacing: "0.02em" }}
          >
            Nous contacter <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nous trouver</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 3rem", lineHeight: 1 }}>CONTACT</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {[
                { icon: <MapPin size={20} color={C.accent} />, label: "Adresse", value: "Adresse communiquée sur demande", sub: "Contactez-nous à contact@aevia.io" },
                { icon: <Phone size={20} color={C.accent} />, label: "Téléphone", value: "+33 1 43 57 88 00", sub: "Lun–Dim, 10h–23h" },
                { icon: <Mail size={20} color={C.accent} />, label: "Email", value: "contact@aevia.io", sub: "Réponse sous 2h ouvrées" },
                { icon: <Clock size={20} color={C.accent} />, label: "Horaires", value: "Lundi – Dimanche", sub: "10h00 – 23h00" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.25rem" }}>
                  <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{item.label}</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.white, fontWeight: 600 }}>{item.value}</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.15rem" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.white, letterSpacing: "0.06em", marginBottom: "1rem" }}>RÉSEAUX SOCIAUX</h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { icon: <Instagram size={20} />, label: "Instagram", handle: "@echochamber.studio" },
                { icon: <Volume2 size={20} />, label: "SoundCloud", handle: "echochamber-studio" },
                { icon: <Youtube size={20} />, label: "YouTube", handle: "Echo Chamber Studio" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1rem 0.75rem", textDecoration: "none", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                >
                  <span style={{ color: C.accent }}>{social.icon}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — map placeholder + booking note */}
          <div>
            <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop"
                alt="Studio exterior"
                loading="lazy"
                style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", color: C.white, letterSpacing: "0.04em", marginBottom: "0.5rem" }}>COMMENT NOUS REJOINDRE</h3>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.75 }}>
                  Notre adresse précise vous est communiquée après confirmation de réservation. Studio situé à Paris, facilement accessible en métro et avec parking à proximité. Contactez-nous à <strong style={{ color: C.accent }}>contact@aevia.io</strong> pour obtenir les accès.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: "10px", padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Calendar size={18} color={C.accent} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                <div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", fontWeight: 700, color: C.white, marginBottom: "0.3rem" }}>Réservation prioritaire</div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: C.textLight, lineHeight: 1.65 }}>
                    Pour garantir votre créneau, utilisez notre formulaire de réservation en ligne. Réponse sous 2h ouvrées, confirmation sous 24h.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  const isMentions = type === "mentions";
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
          {isMentions ? "Légal" : "Confidentialité"}
        </span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 2.5rem", lineHeight: 1 }}>
          {isMentions ? "MENTIONS LÉGALES" : "POLITIQUE DE CONFIDENTIALITÉ"}
        </h1>

        {isMentions ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              {
                title: "Éditeur du site",
                content: "Aevia WS\nSIREN : 852 546 225\nEmail : contact@aevia.io\nAdresse du siège social communiquée sur demande."
              },
              {
                title: "Hébergement",
                content: "Vercel Inc.\n340 Pine Street, Suite 700\nSan Francisco, CA 94104\nÉtats-Unis\nhttps://vercel.com"
              },
              {
                title: "Directeur de publication",
                content: "Le directeur de publication est le représentant légal d'Aevia WS."
              },
              {
                title: "Propriété intellectuelle",
                content: "L'ensemble du contenu de ce site (textes, images, sons, vidéos, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation sans autorisation préalable est interdite."
              },
              {
                title: "Responsabilité",
                content: "Aevia WS s'efforce d'assurer l'exactitude des informations publiées sur ce site. Toutefois, nous ne pouvons garantir l'exhaustivité ou l'absence d'erreur. La société se réserve le droit de modifier le contenu à tout moment."
              },
              {
                title: "Contact",
                content: "Pour toute question relative aux mentions légales, vous pouvez nous contacter à l'adresse : contact@aevia.io"
              },
            ].map((section) => (
              <div key={section.title} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "1.75rem" }}>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{section.title}</h2>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: C.text, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { title: "Collecte des données", content: "Nous collectons uniquement les données que vous nous fournissez volontairement via nos formulaires de contact et de réservation (nom, email, téléphone, informations de projet). Ces données sont utilisées exclusivement pour traiter vos demandes." },
              { title: "Utilisation des données", content: "Vos données personnelles sont utilisées pour :\n• Traiter vos demandes de réservation\n• Vous recontacter dans le cadre de votre projet\n• Améliorer nos services\n\nNous ne vendons, ne louons ni ne partageons vos données avec des tiers à des fins commerciales." },
              { title: "Conservation des données", content: "Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et, le cas échéant, pour une durée de 3 ans à des fins de prospection commerciale, conformément à la réglementation RGPD." },
              { title: "Vos droits", content: "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement\n• Droit à la portabilité\n• Droit d'opposition\n\nPour exercer ces droits : contact@aevia.io" },
              { title: "Cookies", content: "Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de tracking tiers n'est utilisé sans votre consentement explicite." },
              { title: "Contact DPO", content: "Pour toute question relative à la protection de vos données : contact@aevia.io\nAevia WS — SIREN : 852 546 225" },
            ].map((section) => (
              <div key={section.title} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "1.75rem" }}>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{section.title}</h2>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: C.text, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function EchoChamberPage() {
  const [page, setPage] = useState<StudioPage>("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStudio, setActiveStudio] = useState(0);
  const heroRef = useRef(null);

  const goTo = (p: StudioPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; key: StudioPage }[] = [
    { label: "Nos Studios", key: "studios" },
    { label: "Artistes", key: "artistes" },
    { label: "Réserver", key: "booking" },
    { label: "Production", key: "production" },
    { label: "Contact", key: "contact" },
  ];

  return (
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "clip" }}>

      {/* ── NAVBAR (always visible) ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? "0.75rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.82)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.38s ease",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => goTo("home")}
          style={{ display: "flex", alignItems: "center", gap: "0.7rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${C.accentGlow}` }}>
            <Mic2 size={18} color={C.white} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.6rem", letterSpacing: "0.08em", color: C.white }}>ECHO CHAMBER</span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => goTo(l.key)}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.85rem",
                color: page === l.key ? C.accent : C.textLight,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: page === l.key ? 700 : 500,
                transition: "color 0.2s",
                letterSpacing: "0.02em",
                padding: 0,
                borderBottom: page === l.key ? `1px solid ${C.accent}` : "1px solid transparent",
                paddingBottom: "2px",
              }}
              onMouseEnter={(e) => { if (page !== l.key) (e.currentTarget.style.color = C.text); }}
              onMouseLeave={(e) => { if (page !== l.key) (e.currentTarget.style.color = C.textLight); }}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo("booking")}
            style={{ backgroundColor: C.accent, color: C.white, padding: "0.55rem 1.4rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.87rem", fontWeight: 700, fontFamily: C.bodyFont, boxShadow: `0 4px 16px ${C.accentGlow}` }}
          >
            Réserver
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
          aria-label="Menu"
        >
          {menuOpen ? <X color={C.white} size={24} /> : <Menu color={C.white} size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, backgroundColor: "#080808", padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderBottom: `1px solid ${C.border}` }}
          >
            {navLinks.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => goTo(l.key)}
                style={{ color: page === l.key ? C.accent : C.text, background: "none", border: "none", cursor: "pointer", fontSize: "1.05rem", fontFamily: C.bodyFont, textAlign: "left", padding: "0.25rem 0" }}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE ROUTER ── */}
      <AnimatePresence mode="wait">
        {page !== "home" && (
          <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
            {page === "studios" && <StudiosPage goTo={goTo} />}
            {page === "artistes" && <ArtistesPage goTo={goTo} />}
            {page === "booking" && <BookingPage />}
            {page === "production" && <ProductionPage goTo={goTo} />}
            {page === "contact" && <ContactPage />}
            {page === "mentions" && <LegalPage type="mentions" />}
            {page === "privacy" && <LegalPage type="privacy" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HOME (gated) ── */}
      {page === "home" && (
        <>
          {/* HERO */}
          <section
            ref={heroRef}
            style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "5rem" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 1 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", backgroundColor: C.accent, filter: "blur(180px)", opacity: 0.06, pointerEvents: "none" }} />

            <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 960, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
                <EQBars />
              </motion.div>

              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ display: "inline-block", backgroundColor: `${C.accent}18`, border: `1px solid ${C.accent}44`, color: C.accent, padding: "0.3rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", fontFamily: C.bodyFont }}
              >
                Studio d'enregistrement professionnel — Paris
              </motion.span>

              <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}
                style={{ fontFamily: C.headingFont, fontSize: "clamp(4rem, 10vw, 9rem)", fontWeight: 400, color: C.white, lineHeight: 0.95, marginBottom: "1.5rem", letterSpacing: "0.04em" }}
              >
                ECHO<br />
                <span style={{ color: C.accent }}>CHAMBER</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.34 }}
                style={{ fontFamily: C.bodyFont, fontSize: "1.05rem", color: C.textLight, maxWidth: 540, margin: "0 auto 3rem", lineHeight: 1.75, letterSpacing: "0.01em" }}
              >
                Trois studios indépendants. SSL, Neve, Pro Tools HDX. 200+ artistes enregistrés. Votre son mérite ce qu'il y a de mieux.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.48 }}
                style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
              >
                <button
                  type="button"
                  onClick={() => goTo("booking")}
                  style={{ backgroundColor: C.accent, color: C.white, padding: "1rem 2.6rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: `0 8px 30px ${C.accentGlow}`, letterSpacing: "0.03em" }}
                >
                  Réserver une session <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo("studios")}
                  style={{ border: `1px solid ${C.border}`, color: C.text, padding: "1rem 2.6rem", borderRadius: "6px", background: "none", cursor: "pointer", fontWeight: 600, fontFamily: C.bodyFont, fontSize: "0.95rem" }}
                >
                  Visiter les studios
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.62 }}
                style={{ display: "flex", gap: "3.5rem", justifyContent: "center", marginTop: "4.5rem", flexWrap: "wrap" }}
              >
                {[
                  { val: "3", label: "studios indépendants" },
                  { val: "200+", label: "artistes enregistrés" },
                  { val: "12 ans", label: "d'expérience" },
                  { val: "Lun–Dim", label: "10h – 23h" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: C.headingFont, fontSize: "2rem", letterSpacing: "0.06em", color: C.accent }}>{s.val}</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
            >
              <ChevronDown color={C.accent} size={28} opacity={0.6} />
            </motion.div>
          </section>

          {/* ── STUDIOS SHOWCASE ── */}
          <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ marginBottom: "3.5rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nos espaces</span>
                  <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>TROIS STUDIOS, UNE VISION</h2>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1px" }}>
                  {homeStudios.map((s, i) => (
                    <button key={s.name} type="button" onClick={() => setActiveStudio(i)}
                      style={{ padding: "0.75rem 1.75rem", background: "none", border: "none", cursor: "pointer", fontFamily: C.headingFont, fontSize: "1.1rem", letterSpacing: "0.08em", color: activeStudio === i ? s.color : C.textMuted, borderBottom: activeStudio === i ? `2px solid ${s.color}` : "2px solid transparent", transition: "all 0.2s", marginBottom: "-1px" }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </SectionReveal>

              <AnimatePresence mode="wait">
                <motion.div key={activeStudio} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
                      <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: homeStudios[activeStudio].color, letterSpacing: "0.04em" }}>{homeStudios[activeStudio].name}</span>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: homeStudios[activeStudio].color, border: `1px solid ${homeStudios[activeStudio].color}55`, padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>{homeStudios[activeStudio].size}</span>
                    </div>
                    <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.8, marginBottom: "2rem" }}>{homeStudios[activeStudio].desc}</p>
                    <button type="button" onClick={() => goTo("booking")}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: homeStudios[activeStudio].color, color: C.white, padding: "0.8rem 1.8rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.88rem", boxShadow: `0 4px 20px ${homeStudios[activeStudio].color}33` }}
                    >
                      <Calendar size={15} /> Réserver {homeStudios[activeStudio].name}
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {homeStudios[activeStudio].features.map((feat) => (
                      <div key={feat} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: homeStudios[activeStudio].color, flexShrink: 0 }} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.text }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* ── ARTISTS MARQUEE ── */}
          <section style={{ padding: "5rem 0", backgroundColor: C.bg, overflow: "hidden" }}>
            <div style={{ maxWidth: 1140, margin: "0 auto 3rem", padding: "0 2rem" }}>
              <SectionReveal>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Ils ont enregistré ici</span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
                </div>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0 0 2.5rem" }}>200+ ARTISTES ET PRODUCTEURS</h2>
              </SectionReveal>
            </div>
            <ArtistMarquee artists={marqueeArtists} />
          </section>

          {/* ── GEAR ── */}
          <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ marginBottom: "3.5rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Matériel</span>
                  <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>NOTRE ARSENAL</h2>
                </div>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {gear.map((g, i) => (
                  <SectionReveal key={g.category} delay={i * 0.07}>
                    <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.75rem" }}>
                      <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>{g.category}</h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {g.items.map((item) => (
                          <li key={item} style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ marginBottom: "3.5rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Avis clients</span>
                  <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>ILS EN PARLENT</h2>
                </div>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
                {testimonials.map((t, i) => (
                  <SectionReveal key={t.name} delay={i * 0.1}>
                    <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.25rem" }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} color={C.accent} fill={C.accent} />)}
                      </div>
                      <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.8, flex: 1, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                        <div style={{ width: 44, height: 44, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.04em", flexShrink: 0 }}>
                          {t.avatar}
                        </div>
                        <div>
                          <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.white }}>{t.name}</div>
                          <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.1rem" }}>{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── PACKAGES ── */}
          <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ marginBottom: "3.5rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Tarifs</span>
                  <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>CHOISISSEZ VOTRE SESSION</h2>
                </div>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
                {packages.map((pkg, i) => (
                  <SectionReveal key={pkg.name} delay={i * 0.1}>
                    <div style={{ backgroundColor: pkg.popular ? C.accent : pkg.color, border: `1px solid ${pkg.border}`, borderRadius: "12px", padding: "2.25rem", position: "relative", display: "flex", flexDirection: "column" }}>
                      {pkg.popular && (
                        <div style={{ position: "absolute", top: "-13px", right: "1.5rem", backgroundColor: C.white, color: C.accent, padding: "0.25rem 0.85rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, fontFamily: C.bodyFont, letterSpacing: "0.08em" }}>
                          LE PLUS DEMANDÉ
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                        <Clock size={14} color={pkg.popular ? C.white : C.accent} opacity={0.7} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, color: pkg.popular ? C.white : C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{pkg.duration}</span>
                      </div>
                      <h3 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.06em", marginBottom: "0.35rem" }}>{pkg.name}</h3>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: pkg.popular ? "rgba(255,255,255,0.7)" : C.textMuted, marginBottom: "1.25rem" }}>{pkg.studio}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.02em" }}>{pkg.price}€</span>
                      </div>
                      <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.72)" : C.textMuted, marginBottom: "2rem", lineHeight: 1.6 }}>{pkg.desc}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.25rem", flex: 1 }}>
                        {pkg.items.map((item) => (
                          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem" }}>
                            <Check size={14} color={pkg.popular ? C.white : C.accent} style={{ flexShrink: 0, marginTop: "0.18rem" }} />
                            <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.85)" : C.textLight }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => goTo("booking")}
                        style={{ display: "block", width: "100%", textAlign: "center", backgroundColor: pkg.popular ? C.white : C.accent, color: pkg.popular ? C.accent : C.white, padding: "0.9rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.9rem", letterSpacing: "0.03em" }}
                      >
                        Réserver cette session
                      </button>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ marginBottom: "3.5rem" }}>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>FAQ</span>
                  <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>VOS QUESTIONS</h2>
                </div>
              </SectionReveal>
              <SectionReveal delay={0.1}>
                {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
              </SectionReveal>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER (always visible) ── */}
      <footer style={{ backgroundColor: "#050505", padding: "5rem 2.5rem 2.5rem", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <button type="button" onClick={() => goTo("home")} style={{ display: "flex", alignItems: "center", gap: "0.7rem", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "1.35rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${C.accentGlow}` }}>
                  <Mic2 size={18} color={C.white} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em" }}>ECHO CHAMBER</span>
              </button>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 290 }}>
                Studio d'enregistrement professionnel. SSL, Neve, Pro Tools HDX. Ouvert 7j/7, 10h–23h.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <Mail size={13} />, text: "contact@aevia.io" },
                  { icon: <Clock size={13} />, text: "Lun–Dim : 10h–23h" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Studios",
                links: [
                  { label: "Studio A — Flagship", page: "studios" as StudioPage },
                  { label: "Studio B — Production", page: "studios" as StudioPage },
                  { label: "Mastering Suite", page: "studios" as StudioPage },
                ],
              },
              {
                title: "Services",
                links: [
                  { label: "Réserver une session", page: "booking" as StudioPage },
                  { label: "Production musicale", page: "production" as StudioPage },
                  { label: "Artistes", page: "artistes" as StudioPage },
                ],
              },
              {
                title: "Infos",
                links: [
                  { label: "Contact", page: "contact" as StudioPage },
                  { label: "Mentions légales", page: "mentions" as StudioPage },
                  { label: "Confidentialité", page: "privacy" as StudioPage },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.08em", marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => goTo(link.page)}
                        style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s", textAlign: "left" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted }}>
              © 2026 Echo Chamber — Aevia WS, SIREN 852 546 225
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {[
                { label: "Mentions légales", page: "mentions" as StudioPage },
                { label: "Confidentialité", page: "privacy" as StudioPage },
              ].map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => goTo(l.page)}
                  style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
