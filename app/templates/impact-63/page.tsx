"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import React, { useRef, useState } from "react";

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

const COLLECTIONS = [
  {
    id: "perpetuelle",
    name: "Perpétuelle",
    ref: "MD-2891-PP",
    price: "CHF 38,500",
    desc: "Calendrier perpétuel mécanique. Mouvement manufacture 2891, 72h de réserve de marche. Boîtier or blanc 18 carats, cadran guilloché main.",
    movement: "Calibre MD-2891 — 45 rubis",
    case: "Or blanc 18K — Ø 40mm",
    water: "50m",
    image: "perpétuelle",
    accent: "#C9A96E",
  },
  {
    id: "tourbillon",
    name: "Tourbillon Souverain",
    ref: "MD-0001-TB",
    price: "CHF 124,000",
    desc: "Tourbillon volant à cage ouverte. Le summum de l'horlogerie fine, 6 jours de réserve de marche. Serti de 47 diamants VS.",
    movement: "Calibre MD-TB01 — 72 rubis",
    case: "Platine 950 — Ø 42mm",
    water: "30m",
    image: "tourbillon",
    accent: "#E8D5A3",
  },
  {
    id: "marine",
    name: "Marine Chronographe",
    ref: "MD-7750-MC",
    price: "CHF 18,200",
    desc: "Chronographe colonne-roue. Cadran bleu océan, index luminescents. Bracelet acier satins-poli aux transitions précises.",
    movement: "Calibre ETA 7750 — 17 rubis",
    case: "Acier 316L — Ø 42mm",
    water: "200m",
    image: "marine",
    accent: "#6B8FBF",
  },
  {
    id: "classique",
    name: "Classique Dame",
    ref: "MD-2892-CD",
    price: "CHF 9,600",
    desc: "Élégance intemporelle pour femme. Cadran nacre naturelle, aiguilles feuille dorées. Le premier achat d'une vie d'horlogerie.",
    movement: "Calibre ETA 2892 — 21 rubis",
    case: "Or rose 18K — Ø 33mm",
    water: "30m",
    image: "classique",
    accent: "#C9A96E",
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

const SAVOIR_FAIRE = [
  {
    title: "Guillochage Main",
    desc: "Chaque cadran est guilloché à la main sur tour à guillocher du XIXe siècle. Un cadran requiert 8 heures de travail. Aucun guilloché n'est identique.",
    stat: "8h / cadran",
  },
  {
    title: "Anglage",
    desc: "Les chanfreins des ponts sont anglés, polis, biseautés à la main. 1 micron d'écart et la pièce est refusée. La précision n'est pas une option — c'est une obsession.",
    stat: "±1 μm tolérance",
  },
  {
    title: "Assemblage",
    desc: "Un seul maître-horloger assemble chaque montre de bout en bout. Il la signe. Cette responsabilité totale garantit la cohérence absolue du résultat final.",
    stat: "1 artisan / montre",
  },
  {
    title: "Contrôle Qualité",
    desc: "Chaque pièce est chronométrée 72 heures dans 5 positions. Seules les montres affichant moins de 2 secondes d'écart jour sortent de la manufacture.",
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

// ── Orbital SVG Complication (signature element) ──────────────────────────────
function OrbitalComplication({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const r3 = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <motion.svg
      viewBox="0 0 400 400"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* Outer ring */}
      <motion.g style={{ rotate: r1, originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="175" fill="none" stroke={C.goldDim} strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="200" cy="25" r="4" fill={C.gold} />
        <circle cx="200" cy="375" r="2" fill={C.goldDim} />
        {/* Hour markers outer */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 200 + 165 * Math.sin(angle);
          const y1 = 200 - 165 * Math.cos(angle);
          const x2 = 200 + 175 * Math.sin(angle);
          const y2 = 200 - 175 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth={i % 3 === 0 ? "2" : "0.8"} />;
        })}
      </motion.g>

      {/* Middle ring */}
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

      {/* Inner ring */}
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

      {/* Watch face center */}
      <circle cx="200" cy="200" r="65" fill={C.bgCard} stroke={C.border} strokeWidth="1" />
      <circle cx="200" cy="200" r="60" fill="none" stroke={C.borderGold} strokeWidth="0.5" />

      {/* Guilloché pattern suggestion */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={200 + 15 * Math.cos(angle)}
            y1={200 + 15 * Math.sin(angle)}
            x2={200 + 55 * Math.cos(angle)}
            y2={200 + 55 * Math.sin(angle)}
            stroke={C.borderGold}
            strokeWidth="0.5"
          />
        );
      })}

      {/* Hour hand */}
      <motion.line
        x1="200" y1="200" x2="200" y2="152"
        stroke={C.text}
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 43200, repeat: Infinity, ease: "linear" }}
        style={{ originX: "200px", originY: "200px" }}
      />
      {/* Minute hand */}
      <motion.line
        x1="200" y1="200" x2="200" y2="145"
        stroke={C.gold}
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 3600, repeat: Infinity, ease: "linear" }}
        style={{ originX: "200px", originY: "200px" }}
      />
      {/* Seconds hand */}
      <motion.line
        x1="200" y1="220" x2="200" y2="142"
        stroke="#C04040"
        strokeWidth="0.8"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ originX: "200px", originY: "200px" }}
      />

      {/* Center cap */}
      <circle cx="200" cy="200" r="4" fill={C.gold} />
      <circle cx="200" cy="200" r="2" fill={C.bgCard} />

      {/* Brand text */}
      <text x="200" y="175" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="Cormorant SC, serif" letterSpacing="3">
        MAISON
      </text>
      <text x="200" y="186" textAnchor="middle" fill={C.gold} fontSize="9" fontFamily="Cormorant SC, serif" letterSpacing="2">
        DROUET
      </text>
      <text x="200" y="228" textAnchor="middle" fill={C.textDim} fontSize="5.5" fontFamily="Cormorant SC, serif" letterSpacing="2">
        GENÈVE · EST. 1891
      </text>
    </motion.svg>
  );
}

// ── Components ─────────────────────────────────────────────────────────────────
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function MaisonDrouet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCol, setActiveCol] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(14,12,10,0)", "rgba(14,12,10,0.95)"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'EB Garamond', serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
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
        {/* Left nav */}
        <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
          {["Collections", "Patrimoine", "Savoir-Faire"].map((item) => (
            <motion.button
              key={item} onClick={() => document.getElementById(({"Collections": "collections", "Patrimoine": "patrimoine", "Savoir-Faire": "savoir-faire"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textMuted, textDecoration: "none", cursor: "pointer", position: "relative" }}
              whileHover={{ color: C.text }}
              transition={{ duration: 0.2 }}
            >
              {item}
              <HoverGoldLine />
            </motion.button>
          ))}
        </div>

        {/* Logo center */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.goldDim }}>MAISON</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.15em", color: C.text, lineHeight: 1 }}>
            DROUET
          </div>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.5rem", letterSpacing: "0.3em", color: C.textDim }}>GENÈVE · 1891</div>
        </div>

        {/* Right nav */}
        <div style={{ display: "flex", gap: "2rem", flex: 1, justifyContent: "flex-end" }}>
          {["Bespoke", "Boutiques", "Contact"].map((item) => (
            <motion.button
              key={item} onClick={() => document.getElementById(({"Collections": "collections", "Patrimoine": "patrimoine", "Savoir-Faire": "savoir-faire"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textMuted, textDecoration: "none", cursor: "pointer", position: "relative" }}
              whileHover={{ color: C.text }}
              transition={{ duration: 0.2 }}
            >
              {item}
              <HoverGoldLine />
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
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
        {/* Left: text */}
        <motion.div style={{ y: heroY, opacity: heroOpacity, padding: "clamp(4rem, 10vw, 8rem) 3rem clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <SectionLabel>Horlogerie Genevoise</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              color: C.text,
              margin: "1.5rem 0",
              letterSpacing: "-0.02em",
            }}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: C.gold,
                color: C.bg,
                border: "none",
                padding: "0.85rem 2rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              DÉCOUVRIR LES COLLECTIONS
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.gold, color: C.gold }}
              style={{
                background: "transparent",
                color: C.textMuted,
                border: `1px solid ${C.border}`,
                padding: "0.85rem 2rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              BESPOKE
            </motion.button>
          </motion.div>

          {/* Thin gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            style={{ height: "1px", background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: "3rem", transformOrigin: "left" }}
          />
        </motion.div>

        {/* Right: Orbital */}
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

        {/* Corner decorations */}
        <div style={{ position: "absolute", top: "5rem", left: "3rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>
          GENÈVE · SUISSE
        </div>
        <div style={{ position: "absolute", bottom: "3rem", right: "3rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, textAlign: "right" }}>
          EST. MDCCCXCI
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section id="collections" style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgSection }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
          <StatNumber value="133" label="Années d'histoire" />
          <StatNumber value="23" label="Maîtres-horlogers" />
          <StatNumber value="4,200" label="Pièces par an" />
          <StatNumber value="47" label="Distinctions" />
        </div>
      </section>

      {/* ── Collections ────────────────────────────────────────────────────── */}
      <section id="patrimoine" style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <SectionLabel>Nos Collections</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, letterSpacing: "-0.01em" }}>
              Quatre Expressions<br />
              <em style={{ color: C.gold }}>d'une Même Passion</em>
            </h2>
          </div>

          {/* Tab selectors */}
          <div style={{ display: "flex", gap: "0", marginBottom: "3rem", borderBottom: `1px solid ${C.border}` }}>
            {COLLECTIONS.map((col, i) => (
              <motion.button
                key={col.id}
                onClick={() => setActiveCol(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "1rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  color: i === activeCol ? C.gold : C.textMuted,
                  cursor: "pointer",
                  position: "relative",
                }}
                whileHover={{ color: C.text }}
              >
                {col.name}
                {i === activeCol && (
                  <motion.div
                    layoutId="col-indicator"
                    style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: C.gold }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Active collection */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCol}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
            >
              {/* Visual placeholder */}
              <div style={{
                aspectRatio: "4/5",
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Guilloché pattern */}
                <svg viewBox="0 0 400 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <g key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="500" stroke={C.gold} strokeWidth="0.5" />
                      <line x1="0" y1={i * 25} x2="400" y2={i * 25} stroke={C.gold} strokeWidth="0.5" />
                    </g>
                  ))}
                </svg>
                <div style={{ textAlign: "center", zIndex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "1rem" }}>
                    RÉFÉRENCE
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: C.gold, letterSpacing: "0.1em" }}>
                    {COLLECTIONS[activeCol].ref}
                  </div>
                  <div style={{ width: "40px", height: "1px", background: C.goldDim, margin: "1.5rem auto" }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: C.text }}>
                    {COLLECTIONS[activeCol].name}
                  </div>
                </div>
                {/* Corner marks */}
                {[["0,0", "20,0", "0,20"], ["100%,0", "calc(100% - 20px),0", "100%,20px"]].map((_, i) => (
                  <div key={i} style={{ position: "absolute", [i === 0 ? "top" : "top"]: "1rem", [i === 0 ? "left" : "right"]: "1rem" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d={i === 0 ? "M0,0 L20,0 M0,0 L0,20" : "M20,0 L0,0 M20,0 L20,20"} stroke={C.goldDim} strokeWidth="0.8" fill="none" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Details */}
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
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>
                        {spec.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.4 }}>{spec.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>PRIX PUBLIC</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: C.gold }}>
                      {COLLECTIONS[activeCol].price}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: C.gold,
                      color: C.bg,
                      border: "none",
                      padding: "0.75rem 1.75rem",
                      fontFamily: "'Cormorant SC', serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                  >
                    DEMANDER EN BOUTIQUE
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Heritage Timeline ──────────────────────────────────────────────── */}
      <section id="savoir-faire" style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>Notre Patrimoine</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
              133 Ans<br />
              <em style={{ color: C.gold }}>de Continuité</em>
            </h2>
          </div>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: "6rem", top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg, transparent, ${C.border} 10%, ${C.border} 90%, transparent)` }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
                    {/* Year */}
                    <div style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: C.gold }}>
                        {event.year}
                      </div>
                      {/* Dot on timeline */}
                      <div style={{ position: "absolute", left: "calc(6rem - 3px)", top: "0.4rem", width: "7px", height: "7px", borderRadius: "50%", background: C.gold, border: `2px solid ${C.bgSection}` }} />
                    </div>
                    {/* Content */}
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>
                        {event.title}
                      </div>
                      <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "60ch" }}>
                        {event.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Savoir-Faire ───────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>Savoir-Faire</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
              L'Art de<br />
              <em style={{ color: C.gold }}>la Perfection</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.border }}>
            {SAVOIR_FAIRE.map((sf, i) => {
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
                  {/* Background number */}
                  <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.5rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "6rem",
                    fontWeight: 300,
                    color: C.border,
                    lineHeight: 1,
                    userSelect: "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "1.6rem", color: C.gold, marginBottom: "1rem", position: "relative" }}>
                    {sf.stat}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 500, color: C.text, marginBottom: "0.75rem" }}>
                    {sf.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75 }}>
                    {sf.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bespoke ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
            <div>
              <SectionLabel>Création Unique</SectionLabel>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, marginBottom: "1.5rem" }}>
                Votre Montre.<br />
                <em style={{ color: C.gold }}>Nulle Autre.</em>
              </h2>
              <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "45ch" }}>
                Le programme Bespoke Drouet transforme une vision personnelle en chef-d'œuvre horloger. Mouvement exclusif, cadran unique, gravures sur mesure. Une montre que personne d'autre au monde ne possédera.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: "2rem",
                  background: "transparent",
                  color: C.gold,
                  border: `1px solid ${C.gold}`,
                  padding: "0.85rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                }}
              >
                DEMANDER UNE CONSULTATION
              </motion.button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: C.goldDim }}>
                      {step.n}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 500, color: C.text, marginBottom: "0.4rem" }}>
                        {step.title}
                      </div>
                      <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.65 }}>{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Press ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>Presse & Distinctions</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
              Ce Que l'On Dit<br />
              <em style={{ color: C.gold }}>de Drouet</em>
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
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: C.text, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {item.quote}
                  </p>
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

          {/* Awards */}
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
            {AWARDS.map((award) => (
              <div key={award} style={{ textAlign: "center" }}>
                <div style={{ width: "2px", height: "1.5rem", background: C.goldDim, margin: "0 auto 0.75rem" }} />
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textMuted }}>
                  {award}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgCard, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ width: "40px", height: "1px", background: C.goldDim, margin: "0 auto 1rem" }} />
            <SectionLabel>Nos Boutiques</SectionLabel>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 300, color: C.text, marginBottom: "1rem" }}>
            Venez Nous Rendre<br />
            <em style={{ color: C.gold }}>Visite à Genève</em>
          </h2>
          <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "1rem" }}>
            42 rue de Rive, 1204 Genève<br />
            Lundi–Samedi, 10h–18h30
          </p>
          <p style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "2.5rem" }}>
            SUR RENDEZ-VOUS ÉGALEMENT DISPONIBLE
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: C.gold,
                color: C.bg,
                border: "none",
                padding: "0.85rem 2.5rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              PRENDRE RENDEZ-VOUS
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.gold, color: C.gold }}
              style={{
                background: "transparent",
                color: C.textMuted,
                border: `1px solid ${C.border}`,
                padding: "0.85rem 2.5rem",
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              +41 22 000 00 00
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "3rem" }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", letterSpacing: "0.15em", color: C.text, marginBottom: "0.25rem" }}>
              MAISON DROUET
            </div>
            <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "1.5rem" }}>
              HORLOGERS · GENÈVE · 1891
            </div>
            <p style={{ fontSize: "0.85rem", color: C.textDim, lineHeight: 1.65 }}>
              Chaque seconde compte.<br />
              Chaque montre témoigne.
            </p>
          </div>

          {[
            { title: "Collections", items: ["Perpétuelle", "Tourbillon Souverain", "Marine Chronographe", "Classique Dame"] },
            { title: "Maison", items: ["Notre Histoire", "Savoir-Faire", "Bespoke", "Carrières"] },
            { title: "Service", items: ["Entretien & Révision", "Authentification", "Service Après-Vente", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    style={{ fontSize: "0.88rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
                    whileHover={{ color: C.text, x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: "1200px", margin: "3rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>
            © 2024 MAISON DROUET. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Confidentialité", "CGU"].map((item) => (
              <motion.a
                key={item}
                href="#"
                style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.textDim, textDecoration: "none", cursor: "pointer" }}
                whileHover={{ color: C.textMuted }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
