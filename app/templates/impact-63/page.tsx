"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
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

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cormorant+SC:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
`;

// ── Types ──────────────────────────────────────────────────────────────────────
type WatchPage = "home" | "collections" | "savoir-faire" | "atelier" | "contact" | "mentions" | "privacy";

// ── Data ───────────────────────────────────────────────────────────────────────
const COLLECTIONS = [
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

const HERITAGE = [
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

const SAVOIR_FAIRE_HOME = [
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

const PRESS = [
  {
    quote: "La Perpétuelle de Drouet est, sans contestation possible, l'une des cinq meilleures complications mécaniques produites en ce siècle.",
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

const AWARDS = ["GPHG — Aiguille d'Or 2023", "Prix Gaïa 2021", "Red Dot Design 2022", "FHH Award 2024"];

const BESPOKE_STEPS = [
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

// ── Shared components ──────────────────────────────────────────────────────────
function StatNumber({ value, label }: { value: string; label: string }) {
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
      <div style={{ height: "1px", width: "2rem", background: C.goldDim }} />
      <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.goldDim, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

function HoverGoldLine() {
  return (
    <motion.div
      style={{ position: "absolute", bottom: 0, left: 0, height: "1px", background: C.gold, width: 0 }}
      whileHover={{ width: "100%" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
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

// ── Orbital SVG Complication ───────────────────────────────────────────────────
function OrbitalComplication({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
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

// ── Sub-page: CollectionsPage ──────────────────────────────────────────────────
function CollectionsPage({ goTo }: { goTo: (p: WatchPage) => void }) {
  const [filter, setFilter] = useState<"All" | "Classic" | "Sport" | "Complications">("All");
  const [active, setActive] = useState(0);

  const filtered = filter === "All" ? COLLECTIONS : COLLECTIONS.filter((c) => c.category === filter);
  const selected = filtered[active] ?? filtered[0];

  useEffect(() => { setActive(0); }, [filter]);

  return (
    <PageWrapper>
      {/* Hero banner */}
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Catalogue Complet</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1, marginBottom: "1rem" }}>
          Nos Collections<br /><em style={{ color: C.gold }}>2024</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75 }}>
          Six expressions de l'excellence horlogère genevoise. De l'entrée de gamme au grand complication, chaque pièce est signée d'un seul maître-horloger.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ padding: "0 clamp(2rem, 6vw, 6rem)", background: C.bg, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 0 }}>
        {(["All", "Classic", "Sport", "Complications"] as const).map((f) => (
          <motion.button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              background: "none",
              border: "none",
              padding: "1.1rem 1.75rem",
              fontFamily: "'Cormorant SC', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: f === filter ? C.gold : C.textMuted,
              cursor: "pointer",
              position: "relative",
            }}
            whileHover={{ color: C.text }}
          >
            {f === "All" ? "Toutes" : f}
            {f === filter && (
              <motion.div layoutId="col-filter" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: C.gold }} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ padding: "4rem clamp(2rem, 6vw, 6rem) 6rem", maxWidth: "1300px", margin: "0 auto" }}>
        {/* Tab row */}
        <div style={{ display: "flex", gap: 0, marginBottom: "3rem", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          {filtered.map((col, i) => (
            <motion.button
              key={col.id}
              type="button"
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                padding: "0.9rem 1.75rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: i === active ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                whiteSpace: "nowrap",
              }}
              whileHover={{ color: C.text }}
            >
              {col.name}
              {i === active && (
                <motion.div layoutId="col-tab" style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}
            >
              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: C.bgCard, border: `1px solid ${C.border}` }}>
                <img
                  src={selected.image}
                  alt={selected.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 50%, ${C.bg}cc)` }} />
                <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim }}>RÉFÉRENCE</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.gold, letterSpacing: "0.1em" }}>{selected.ref}</div>
                </div>
              </div>

              {/* Details */}
              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.5rem" }}>{selected.category}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300, color: C.text, marginBottom: "1.25rem" }}>{selected.name}</h2>
                <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2rem", maxWidth: "45ch" }}>{selected.desc}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, marginBottom: "2rem" }}>
                  {[
                    { label: "Mouvement", val: selected.movement },
                    { label: "Boîtier", val: selected.case },
                    { label: "Étanchéité", val: selected.water },
                  ].map((spec) => (
                    <div key={spec.label}>
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.52rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>{spec.label}</div>
                      <div style={{ fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.4 }}>{spec.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.52rem", letterSpacing: "0.2em", color: C.textDim }}>PRIX PUBLIC</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.gold }}>{selected.price}</div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => goTo("atelier")}
                    whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: C.gold,
                      color: C.bg,
                      border: "none",
                      padding: "0.8rem 1.75rem",
                      fontFamily: "'Cormorant SC', serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                  >
                    DEMANDER UNE CONSULTATION
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All cards mini-grid */}
        <div style={{ marginTop: "5rem", paddingTop: "4rem", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>TOUTES LES RÉFÉRENCES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {filtered.map((col, i) => (
              <motion.button
                key={col.id}
                type="button"
                onClick={() => setActive(i)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: i === active ? C.bgCard : C.bgSection,
                  border: `1px solid ${i === active ? C.goldDim : C.border}`,
                  padding: "1.5rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.5rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>{col.ref}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: i === active ? C.gold : C.text, marginBottom: "0.5rem" }}>{col.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: C.goldDim }}>{col.price}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Sub-page: SavoirFairePage ──────────────────────────────────────────────────
function SavoirFairePage() {
  const chapters = [
    {
      id: "ébauche",
      title: "L'Ébauche",
      subtitle: "La platine-mère",
      desc: "Tout commence par l'ébauche — la platine qui recevra chaque composant. Usinée dans notre manufacture du Plan-les-Ouates, elle est mesurée au micron avant d'accueillir les premiers rouages. 847 composants pour le calibre MD-TB01.",
      image: "https://images.unsplash.com/photo-1490750967868-88df5691cc7b?w=800&q=80&fit=crop",
      stat: "847 composants",
    },
    {
      id: "anglage",
      title: "L'Anglage",
      subtitle: "Le biseau parfait",
      desc: "Chaque arête des ponts et platines est biseautée à la main, poncée, polie miroir. Le chanfrein d'une largeur de 0,2mm est tracé à la lime, puis au bâton de buis. La lumière doit se réfléchir comme sur de l'eau.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
      stat: "0.2mm précision",
    },
    {
      id: "rhodiage",
      title: "Le Rhodiage",
      subtitle: "L'éclat immuable",
      desc: "Les ponts sont rhodiés — recouverts d'une infime couche de rhodium — pour les protéger de l'oxydation et leur conférer cet éclat gris-acier distinctif. Un bain de galvanoplastie de 30 secondes qui dure une vie.",
      image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&q=80&fit=crop",
      stat: "30s de dépôt",
    },
    {
      id: "reglage",
      title: "La Mise au Point",
      subtitle: "Le réglage COSC",
      desc: "Le régleur soumet chaque mouvement à 5 positions et 3 températures sur 16 jours. L'objectif : moins de 2 secondes d'écart par jour, critère COSC. Seuls 60% des mouvements passent du premier coup.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&fit=crop",
      stat: "16 jours de test",
    },
  ];

  const arts = [
    { title: "Guillochage Main", desc: "Tour à guillocher XIXe siècle. Motifs grain d'orge, clous de Paris, soleil. 8 heures par cadran." },
    { title: "Émail Grand Feu", desc: "Cuisson à 800°C. Trois couches successives. Translucide, laiteux ou opaque — jamais identique." },
    { title: "Serti Grains", desc: "47 diamants VS sertis grain par grain à la main. Loupe 10x. La pince ne touche qu'une fois." },
  ];

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Depuis 1891</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1, marginBottom: "1rem" }}>
          Manufacture<br /><em style={{ color: C.gold }}>100% Maison</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75, marginBottom: "2rem" }}>
          175 ans d'horlogerie genevoise. Chaque composant, du spiral au boîtier, naît entre ces murs. Aucun sous-traitant. Aucun compromis.
        </p>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", paddingTop: "2rem", borderTop: `1px solid ${C.border}` }}>
          {[["847", "composants par calibre"], ["2 400h", "d'assemblage par an"], ["18 mois", "de développement / calibre"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.gold }}>{v}</div>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "3rem" }}>LES QUATRE ÉTAPES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {chapters.map((ch, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-100px" });
            return (
              <motion.div
                key={ch.id}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: "4rem", alignItems: "center", direction: i % 2 === 0 ? "ltr" : "rtl" as "ltr" | "rtl" }}
              >
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <img src={ch.image} alt={ch.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                </div>
                <div style={{ direction: "ltr" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: C.border, lineHeight: 1, marginBottom: "0.5rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.5rem" }}>{ch.subtitle}</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>{ch.title}</h2>
                  <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "45ch", marginBottom: "1.5rem" }}>{ch.desc}</p>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.9rem", color: C.gold }}>{ch.stat}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Métiers d'art */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <SectionLabel>Métiers d'Art</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 3rem)", fontWeight: 300, color: C.text }}>
              Les Gestes<br /><em style={{ color: C.gold }}>Irremplaçables</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.border }}>
            {arts.map((art, i) => (
              <div key={art.title} style={{ background: C.bg, padding: "2.5rem" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 300, color: C.border, lineHeight: 1, marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: C.gold, marginBottom: "0.75rem" }}>{art.title}</h3>
                <p style={{ fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.7 }}>{art.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Sub-page: AtelierPage ──────────────────────────────────────────────────────
function AtelierPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Création Unique</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1, marginBottom: "1rem" }}>
          L'Atelier<br /><em style={{ color: C.gold }}>Bespoke</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "55ch", lineHeight: 1.75 }}>
          Commissionnez une pièce unique. Votre vision, notre savoir-faire ancestral. Une montre que personne d'autre au monde ne possédera.
        </p>
      </div>

      {/* Process */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "3rem" }}>LE PROCESSUS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {BESPOKE_STEPS.map((step, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-80px" });
              return (
                <motion.div
                  key={step.n}
                  ref={ref}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{ display: "grid", gridTemplateColumns: "5rem 1fr", gap: "2rem", padding: "2.5rem 0", borderBottom: i < BESPOKE_STEPS.length - 1 ? `1px solid ${C.border}` : "none" }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: C.goldDim }}>{step.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{step.title}</div>
                    <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "60ch" }}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bespoke options */}
      <div style={{ padding: "4rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Personnalisation</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Chaque Détail<br /><em style={{ color: C.gold }}>Est le Vôtre</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { title: "Matière du boîtier", options: ["Or blanc 18K", "Or rose 18K", "Platine 950", "Titane grade 5"] },
              { title: "Cadran", options: ["Guilloché main", "Émail grand feu", "Nacre naturelle", "Météorite Widmanstätten"] },
              { title: "Complications", options: ["Tourbillon volant", "Répétition minutes", "Quantième perpétuel", "Phase de lune"] },
              { title: "Gravures", options: ["Monogramme", "Armoiries familiales", "Texte libre", "Motif japonais"] },
              { title: "Bracelet", options: ["Alligator Mississippi", "Cuir de requin", "Caoutchouc manufacture", "Bracelet intégré"] },
              { title: "Références", options: ["Mouvement exclusif", "Index diamants", "Fond saphir serti", "Couronne en pierre"] },
            ].map((opt) => (
              <div key={opt.title} style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "1rem" }}>{opt.title.toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {opt.options.map((o) => (
                    <div key={o} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: C.goldDim, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: C.textMuted }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation form */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Demande de Consultation</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Commençons<br /><em style={{ color: C.gold }}>Votre Projet</em>
            </h2>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: "4rem", background: C.bgCard, border: `1px solid ${C.borderGold}` }}
            >
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.goldDim, marginBottom: "1rem" }}>REÇU</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>Votre demande a été transmise.</h3>
              <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75 }}>Nous vous contacterons dans les 48 heures ouvrables pour convenir d'un premier entretien.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { id: "name", label: "Nom complet", type: "text", required: true },
                { id: "country", label: "Pays de résidence", type: "text", required: true },
                { id: "email", label: "Adresse email", type: "email", required: true },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} style={{ display: "block", fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>
                    {field.label.toUpperCase()}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    style={{
                      width: "100%",
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      padding: "0.85rem 1rem",
                      color: C.text,
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "1rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>BUDGET INDICATIF</div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {["CHF 30k – 80k", "CHF 80k – 200k", "CHF 200k+"].map((b) => (
                    <label key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input type="radio" name="budget" value={b} style={{ accentColor: C.gold }} />
                      <span style={{ fontSize: "0.88rem", color: C.textMuted }}>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="project" style={{ display: "block", fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>
                  VOTRE PROJET
                </label>
                <textarea
                  id="project"
                  rows={5}
                  style={{
                    width: "100%",
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    padding: "0.85rem 1rem",
                    color: C.text,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>CONTACT PRÉFÉRÉ</div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {["Email", "Téléphone", "WhatsApp"].map((m) => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input type="radio" name="contact" value={m} style={{ accentColor: C.gold }} />
                      <span style={{ fontSize: "0.88rem", color: C.textMuted }}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: C.gold,
                  color: C.bg,
                  border: "none",
                  padding: "1rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  transition: "background 0.3s",
                }}
              >
                ENVOYER MA DEMANDE
              </motion.button>
            </form>
          )}
        </div>
      </div>

      {/* Service & révision */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <SectionLabel>Entretien & Révision</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Service<br /><em style={{ color: C.gold }}>Après-Vente</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
            {[
              { service: "Révision complète", price: "CHF 1,200", detail: "Démontage total, nettoyage ultrasonique, remplacement des joints, réglage COSC. Recommandé tous les 5 ans." },
              { service: "Polissage & remontage", price: "CHF 480", detail: "Remise à neuf du boîtier et du bracelet. Polissage miroir ou satiné selon la finition d'origine." },
              { service: "Remplacement verre saphir", price: "CHF 320", detail: "Verre saphir anti-reflets traité deux faces. Délai 5 jours ouvrables." },
              { service: "Authentification & certification", price: "CHF 150", detail: "Vérification de l'authenticité, délivrance d'un nouveau certificat numéroté." },
            ].map((s) => (
              <div key={s.service} style={{ background: C.bg, padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: C.text }}>{s.service}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.gold, whiteSpace: "nowrap", marginLeft: "1rem" }}>{s.price}</div>
                </div>
                <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.65 }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Sub-page: ContactPage ──────────────────────────────────────────────────────
function ContactPage() {
  const boutiques = [
    { city: "Paris", address: "Rue du Faubourg Saint-Honoré, 75008", note: "Sur rendez-vous uniquement" },
    { city: "Genève", address: "Rue du Rhône, 1204 Genève", note: "Sur rendez-vous uniquement" },
    { city: "Tokyo", address: "Ginza, Chuo-ku, 104-0061", note: "Sur rendez-vous uniquement" },
  ];

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Nous Contacter</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1, marginBottom: "1.5rem" }}>
          La Maison<br /><em style={{ color: C.gold }}>Vous Reçoit</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "50ch", lineHeight: 1.75 }}>
          Notre maison reçoit sur rendez-vous uniquement. Chaque visiteur bénéficie d'un accueil personnalisé par un conseiller expert.
        </p>
      </div>

      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
            {/* Contact details */}
            <div>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>COORDONNÉES</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>ADRESSE</div>
                  <div style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.65 }}>Adresse communiquée sur demande à<br /><span style={{ color: C.gold }}>contact@aevia.io</span></div>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>EMAIL</div>
                  <a href="mailto:contact@aevia.io" style={{ fontSize: "1rem", color: C.gold, textDecoration: "none" }}>contact@aevia.io</a>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>TÉLÉPHONE</div>
                  <a href="tel:+41220000000" style={{ fontSize: "1rem", color: C.textMuted, textDecoration: "none" }}>+41 22 000 00 00</a>
                  <div style={{ fontSize: "0.8rem", color: C.textDim, marginTop: "0.25rem" }}>Lundi – Samedi, 9h – 18h (CET)</div>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>RENDEZ-VOUS</div>
                  <div style={{ fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.65 }}>Entretiens sur rendez-vous uniquement. Durée minimale : 60 minutes. Champagne servi.</div>
                </div>
              </div>
            </div>

            {/* Boutiques */}
            <div>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>NOS BOUTIQUES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {boutiques.map((b, i) => (
                  <div
                    key={b.city}
                    style={{
                      padding: "2rem",
                      borderBottom: i < boutiques.length - 1 ? `1px solid ${C.border}` : "none",
                      borderLeft: `2px solid ${C.goldDim}`,
                      paddingLeft: "1.5rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: C.text, marginBottom: "0.35rem" }}>{b.city}</div>
                    <div style={{ fontSize: "0.9rem", color: C.textMuted, marginBottom: "0.4rem" }}>{b.address}</div>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.18em", color: C.goldDim }}>{b.note.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "3rem", padding: "2rem", background: C.bgCard, border: `1px solid ${C.borderGold}` }}>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.75rem" }}>NOTE</div>
                <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>
                  La Maison Drouet ne dispose pas de boutique en ligne. Toute acquisition passe par un entretien personnel avec l'un de nos conseillers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Sub-page: LegalPage ────────────────────────────────────────────────────────
function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  if (type === "mentions") {
    return (
      <PageWrapper>
        <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 5rem", maxWidth: "800px" }}>
          <SectionLabel>Informations Légales</SectionLabel>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, marginBottom: "3rem" }}>
            Mentions Légales
          </h1>

          {[
            {
              title: "Éditeur du site",
              content: "Aevia WS — SIREN 852 546 225\nContact : contact@aevia.io\nAdresse du siège social communiquée sur demande à contact@aevia.io.",
            },
            {
              title: "Hébergement",
              content: "Vercel Inc.\n340 Pine Street, Suite 701\nSan Francisco, CA 94104, États-Unis\nhttps://vercel.com",
            },
            {
              title: "Propriété intellectuelle",
              content: "L'ensemble du contenu de ce site (textes, images, éléments graphiques, logotypes) est protégé par le droit de la propriété intellectuelle et appartient à Aevia WS ou à ses ayants droit. Toute reproduction sans autorisation écrite préalable est interdite.",
            },
            {
              title: "Responsabilité",
              content: "Les informations contenues sur ce site sont fournies à titre indicatif. Aevia WS ne saurait être tenu responsable des erreurs ou omissions, ni de l'utilisation qui pourrait en être faite.",
            },
            {
              title: "Droit applicable",
              content: "Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence exclusive des tribunaux français.",
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.gold, marginBottom: "0.75rem" }}>{section.title}</h2>
              <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75, whiteSpace: "pre-line" }}>{section.content}</p>
            </div>
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 5rem", maxWidth: "800px" }}>
        <SectionLabel>RGPD</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, marginBottom: "3rem" }}>
          Politique de Confidentialité
        </h1>

        {[
          {
            title: "Responsable du traitement",
            content: "Aevia WS, SIREN 852 546 225. Contact : contact@aevia.io",
          },
          {
            title: "Données collectées",
            content: "Nous collectons uniquement les données que vous nous transmettez volontairement via nos formulaires de contact et de demande de consultation : nom, adresse email, pays de résidence, description de votre projet. Aucune donnée n'est collectée automatiquement au-delà des logs techniques nécessaires à l'hébergement.",
          },
          {
            title: "Finalités du traitement",
            content: "Vos données sont utilisées exclusivement pour répondre à vos demandes de consultation et assurer le suivi de votre relation avec la Maison Drouet. Elles ne sont jamais vendues, louées ou transmises à des tiers commerciaux.",
          },
          {
            title: "Base légale",
            content: "Le traitement est fondé sur votre consentement explicite (article 6.1.a du RGPD), exprimé lors de la soumission du formulaire.",
          },
          {
            title: "Durée de conservation",
            content: "Vos données sont conservées 3 ans à compter de votre dernière interaction avec la Maison. Au-delà, elles sont supprimées ou anonymisées.",
          },
          {
            title: "Vos droits",
            content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Exercez ces droits en contactant contact@aevia.io. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
          },
          {
            title: "Cookies",
            content: "Ce site n'utilise pas de cookies de traçage publicitaire. Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés.",
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.gold, marginBottom: "0.75rem" }}>{section.title}</h2>
            <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75 }}>{section.content}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function MaisonDrouet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCol, setActiveCol] = useState(0);

  // Page state
  const [page, setPage] = useState<WatchPage>("home");
  const goTo = (p: WatchPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(14,12,10,0)", "rgba(14,12,10,0.95)"]);

  const NAV_LINKS: { label: string; page: WatchPage }[] = [
    { label: "Collections", page: "collections" },
    { label: "Savoir-Faire", page: "savoir-faire" },
    { label: "L'Atelier", page: "atelier" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'EB Garamond', serif",
        minHeight: "100vh",
        overflowX: "clip",
      }}
    >
      <style>{FONT}</style>

      {/* ── Navigation (outside gate) ─────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left nav links */}
        <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
          {NAV_LINKS.slice(0, 2).map(({ label, page: p }) => (
            <motion.button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: page === p ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                background: "none",
                border: "none",
                padding: 0,
              }}
              whileHover={{ color: C.text }}
              transition={{ duration: 0.2 }}
            >
              {label}
              {page === p && (
                <motion.div layoutId="nav-active" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
              <HoverGoldLine />
            </motion.button>
          ))}
        </div>

        {/* Logo center */}
        <motion.button
          type="button"
          onClick={() => goTo("home")}
          style={{ textAlign: "center", flex: 1, background: "none", border: "none", cursor: "pointer" }}
        >
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.goldDim }}>MAISON</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.15em", color: C.text, lineHeight: 1 }}>
            DROUET
          </div>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.5rem", letterSpacing: "0.3em", color: C.textDim }}>GENÈVE · 1891</div>
        </motion.button>

        {/* Right nav links */}
        <div style={{ display: "flex", gap: "2rem", flex: 1, justifyContent: "flex-end" }}>
          {NAV_LINKS.slice(2).map(({ label, page: p }) => (
            <motion.button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: page === p ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                background: "none",
                border: "none",
                padding: 0,
              }}
              whileHover={{ color: C.text }}
              transition={{ duration: 0.2 }}
            >
              {label}
              {page === p && (
                <motion.div layoutId="nav-active-r" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
              <HoverGoldLine />
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── HOME ───────────────────────────────────────────────────────── */}
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

            {/* Hero */}
            <section
              ref={heroRef}
              style={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div style={{ y: heroY, opacity: heroOpacity, padding: "clamp(4rem, 10vw, 8rem) 3rem clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)" }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
                  <SectionLabel>Horlogerie Genevoise</SectionLabel>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", fontWeight: 300, lineHeight: 0.95, color: C.text, margin: "1.5rem 0", letterSpacing: "-0.02em" }}
                >
                  Le Temps<br />
                  <em style={{ color: C.gold, fontStyle: "italic" }}>Comme</em><br />
                  Philosophie
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  style={{ fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "42ch", marginBottom: "2.5rem" }}
                >
                  Depuis 1891, la Maison Drouet perpétue à Genève l'art de la Haute Horlogerie.
                  Chaque montre est une déclaration — contre la hâte, pour la permanence.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                >
                  <motion.button
                    type="button"
                    onClick={() => goTo("collections")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: C.gold, color: C.bg, border: "none", padding: "0.85rem 2rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer" }}
                  >
                    DÉCOUVRIR LES COLLECTIONS
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => goTo("atelier")}
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.85rem 2rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", transition: "all 0.3s" }}
                  >
                    BESPOKE
                  </motion.button>
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  style={{ height: "1px", background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: "3rem", transformOrigin: "left" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ padding: "6rem 4rem 6rem 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ width: "min(500px, 90%)", aspectRatio: "1" }}>
                  <OrbitalComplication scrollYProgress={scrollYProgress} />
                </div>
              </motion.div>

              <div style={{ position: "absolute", top: "5rem", left: "3rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>
                GENÈVE · SUISSE
              </div>
              <div style={{ position: "absolute", bottom: "3rem", right: "3rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, textAlign: "right" }}>
                EST. MDCCCXCI
              </div>
            </section>

            {/* Stats */}
            <section style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgSection }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
                <StatNumber value="133" label="Années d'histoire" />
                <StatNumber value="23" label="Maîtres-horlogers" />
                <StatNumber value="4,200" label="Pièces par an" />
                <StatNumber value="47" label="Distinctions" />
              </div>
            </section>

            {/* Collections preview */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                  <SectionLabel>Nos Collections</SectionLabel>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, letterSpacing: "-0.01em" }}>
                    Quatre Expressions<br /><em style={{ color: C.gold }}>d'une Même Passion</em>
                  </h2>
                </div>

                <div style={{ display: "flex", gap: 0, marginBottom: "3rem", borderBottom: `1px solid ${C.border}` }}>
                  {COLLECTIONS.slice(0, 4).map((col, i) => (
                    <motion.button
                      key={col.id}
                      type="button"
                      onClick={() => setActiveCol(i)}
                      style={{ background: "none", border: "none", padding: "1rem 2rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: i === activeCol ? C.gold : C.textMuted, cursor: "pointer", position: "relative" }}
                      whileHover={{ color: C.text }}
                    >
                      {col.name}
                      {i === activeCol && <motion.div layoutId="col-indicator" style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: C.gold }} />}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCol}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
                  >
                    <div style={{ aspectRatio: "4/5", background: C.bgCard, border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
                      <img src={COLLECTIONS[activeCol].image} alt={COLLECTIONS[activeCol].name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${C.bg}cc)` }} />
                      <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                        <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim }}>RÉFÉRENCE</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: C.gold }}>{COLLECTIONS[activeCol].ref}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text, marginBottom: "0.5rem" }}>
                        {COLLECTIONS[activeCol].name}
                      </div>
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "1.5rem" }}>
                        {COLLECTIONS[activeCol].ref}
                      </div>
                      <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2rem", maxWidth: "45ch" }}>
                        {COLLECTIONS[activeCol].desc}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                        {[
                          { label: "Mouvement", val: COLLECTIONS[activeCol].movement },
                          { label: "Boîtier", val: COLLECTIONS[activeCol].case },
                          { label: "Étanchéité", val: COLLECTIONS[activeCol].water },
                        ].map((spec) => (
                          <div key={spec.label}>
                            <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>{spec.label}</div>
                            <div style={{ fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.4 }}>{spec.val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>PRIX PUBLIC</div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.gold }}>{COLLECTIONS[activeCol].price}</div>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => goTo("collections")}
                          whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                          whileTap={{ scale: 0.98 }}
                          style={{ background: C.gold, color: C.bg, border: "none", padding: "0.75rem 1.75rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.65rem", letterSpacing: "0.2em", cursor: "pointer", transition: "background 0.3s" }}
                        >
                          VOIR TOUTES LES COLLECTIONS
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* Heritage timeline */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
              <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ marginBottom: "5rem" }}>
                  <SectionLabel>Notre Patrimoine</SectionLabel>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
                    133 Ans<br /><em style={{ color: C.gold }}>de Continuité</em>
                  </h2>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "6rem", top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg, transparent, ${C.border} 10%, ${C.border} 90%, transparent)` }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {HERITAGE.map((event, i) => {
                      const ref = useRef<HTMLDivElement>(null);
                      const inView = useInView(ref, { once: true, margin: "-100px" });
                      return (
                        <motion.div
                          key={event.year}
                          ref={ref}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          style={{ display: "grid", gridTemplateColumns: "6rem 1fr", gap: "3rem", paddingBottom: "3.5rem", paddingTop: "0.5rem", position: "relative" }}
                        >
                          <div style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: C.gold }}>{event.year}</div>
                            <div style={{ position: "absolute", left: "calc(6rem - 3px)", top: "0.4rem", width: "7px", height: "7px", borderRadius: "50%", background: C.gold, border: `2px solid ${C.bgSection}` }} />
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{event.title}</div>
                            <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "60ch" }}>{event.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Savoir-faire preview */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                  <SectionLabel>Savoir-Faire</SectionLabel>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
                    L'Art de<br /><em style={{ color: C.gold }}>la Perfection</em>
                  </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.border }}>
                  {SAVOIR_FAIRE_HOME.map((sf, i) => {
                    const ref = useRef<HTMLDivElement>(null);
                    const inView = useInView(ref, { once: true, margin: "-80px" });
                    return (
                      <motion.div
                        key={sf.title}
                        ref={ref}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: (i % 2) * 0.15 }}
                        style={{ background: C.bg, padding: "3.5rem", position: "relative", overflow: "hidden" }}
                      >
                        <div style={{ position: "absolute", top: "1rem", right: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "6rem", fontWeight: 300, color: C.border, lineHeight: 1, userSelect: "none" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "1.6rem", color: C.gold, marginBottom: "1rem", position: "relative" }}>{sf.stat}</div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 500, color: C.text, marginBottom: "0.75rem" }}>{sf.title}</h3>
                        <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75 }}>{sf.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <motion.button
                    type="button"
                    onClick={() => goTo("savoir-faire")}
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.85rem 2rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", transition: "all 0.3s" }}
                  >
                    DÉCOUVRIR NOTRE SAVOIR-FAIRE
                  </motion.button>
                </div>
              </div>
            </section>

            {/* Bespoke teaser */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
                  <div>
                    <SectionLabel>Création Unique</SectionLabel>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, marginBottom: "1.5rem" }}>
                      Votre Montre.<br /><em style={{ color: C.gold }}>Nulle Autre.</em>
                    </h2>
                    <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "45ch" }}>
                      Le programme Bespoke Drouet transforme une vision personnelle en chef-d'œuvre horloger. Mouvement exclusif, cadran unique, gravures sur mesure.
                    </p>
                    <motion.button
                      type="button"
                      onClick={() => goTo("atelier")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ marginTop: "2rem", background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, padding: "0.85rem 2rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer" }}
                    >
                      DEMANDER UNE CONSULTATION
                    </motion.button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {BESPOKE_STEPS.map((step, i) => {
                      const ref = useRef<HTMLDivElement>(null);
                      const inView = useInView(ref, { once: true, margin: "-80px" });
                      return (
                        <motion.div
                          key={step.n}
                          ref={ref}
                          initial={{ opacity: 0, x: 20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          style={{ display: "grid", gridTemplateColumns: "3rem 1fr", gap: "1.5rem", padding: "1.75rem 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}
                        >
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: C.goldDim }}>{step.n}</div>
                          <div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 500, color: C.text, marginBottom: "0.4rem" }}>{step.title}</div>
                            <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.65 }}>{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Press */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                  <SectionLabel>Presse & Distinctions</SectionLabel>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
                    Ce Que l'On Dit<br /><em style={{ color: C.gold }}>de Drouet</em>
                  </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border, marginBottom: "4rem" }}>
                  {PRESS.map((item, i) => {
                    const ref = useRef<HTMLDivElement>(null);
                    const inView = useInView(ref, { once: true });
                    return (
                      <motion.div
                        key={i}
                        ref={ref}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        style={{ background: C.bg, padding: "2.5rem" }}
                      >
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: C.goldDim, lineHeight: 1, marginBottom: "1rem" }}>"</div>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: C.text, lineHeight: 1.75, marginBottom: "1.5rem" }}>{item.quote}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "1.5rem", height: "1px", background: C.goldDim }} />
                          <div>
                            <div style={{ fontSize: "0.8rem", color: C.text }}>{item.author}</div>
                            <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textMuted }}>{item.outlet} · {item.year}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
                  {AWARDS.map((award) => (
                    <div key={award} style={{ textAlign: "center" }}>
                      <div style={{ width: "2px", height: "1.5rem", background: C.goldDim, margin: "0 auto 0.75rem" }} />
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textMuted }}>{award}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgCard, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ width: "40px", height: "1px", background: C.goldDim, margin: "0 auto 1rem" }} />
                  <SectionLabel>Nos Boutiques</SectionLabel>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>
                  Sur Rendez-Vous<br /><em style={{ color: C.gold }}>Uniquement</em>
                </h2>
                <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "1rem" }}>
                  Paris · Genève · Tokyo
                </p>
                <p style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "2.5rem" }}>
                  NOTRE MAISON REÇOIT SUR RENDEZ-VOUS UNIQUEMENT
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <motion.button
                    type="button"
                    onClick={() => goTo("contact")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: C.gold, color: C.bg, border: "none", padding: "0.85rem 2.5rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer" }}
                  >
                    PRENDRE RENDEZ-VOUS
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => goTo("contact")}
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.85rem 2.5rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", transition: "all 0.3s" }}
                  >
                    NOS ADRESSES
                  </motion.button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── OTHER PAGES ─────────────────────────────────────────────────── */}
        {page === "collections" && <motion.div key="collections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px" }}><CollectionsPage goTo={goTo} /></motion.div>}
        {page === "savoir-faire" && <motion.div key="savoir-faire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px" }}><SavoirFairePage /></motion.div>}
        {page === "atelier" && <motion.div key="atelier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px" }}><AtelierPage /></motion.div>}
        {page === "contact" && <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px" }}><ContactPage /></motion.div>}
        {page === "mentions" && <motion.div key="mentions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px", padding: "70px clamp(2rem, 6vw, 6rem) 0" }}><LegalPage type="mentions" /></motion.div>}
        {page === "privacy" && <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ paddingTop: "70px", padding: "70px clamp(2rem, 6vw, 6rem) 0" }}><LegalPage type="privacy" /></motion.div>}
      </AnimatePresence>

      {/* ── Footer (outside gate) ─────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem clamp(2rem, 6vw, 6rem)", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", letterSpacing: "0.15em", color: C.text, marginBottom: "0.25rem" }}>
              MAISON DROUET
            </div>
            <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "1.5rem" }}>
              HORLOGERS · GENÈVE · 1891
            </div>
            <p style={{ fontSize: "0.85rem", color: C.textDim, lineHeight: 1.65 }}>
              Chaque seconde compte.<br />Chaque montre témoigne.
            </p>
          </div>

          {[
            {
              title: "Collections",
              items: [
                { label: "Perpétuelle", page: "collections" as WatchPage },
                { label: "Tourbillon Souverain", page: "collections" as WatchPage },
                { label: "Marine Chronographe", page: "collections" as WatchPage },
                { label: "Classique Dame", page: "collections" as WatchPage },
              ],
            },
            {
              title: "Maison",
              items: [
                { label: "Notre Histoire", page: "savoir-faire" as WatchPage },
                { label: "Savoir-Faire", page: "savoir-faire" as WatchPage },
                { label: "L'Atelier Bespoke", page: "atelier" as WatchPage },
                { label: "Nous Contacter", page: "contact" as WatchPage },
              ],
            },
            {
              title: "Informations",
              items: [
                { label: "Mentions légales", page: "mentions" as WatchPage },
                { label: "Confidentialité", page: "privacy" as WatchPage },
                { label: "Contact", page: "contact" as WatchPage },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    onClick={() => goTo(item.page)}
                    style={{ fontSize: "0.88rem", color: C.textMuted, textDecoration: "none", cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left" }}
                    whileHover={{ color: C.text, x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "1200px", margin: "3rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>
            © 2024 AEVIA WS · SIREN 852 546 225 · TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "Mentions légales", page: "mentions" as WatchPage },
              { label: "Confidentialité", page: "privacy" as WatchPage },
            ].map((item) => (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => goTo(item.page)}
                style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.textDim, textDecoration: "none", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                whileHover={{ color: C.textMuted }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
