"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

const C = {
  bg: "#FAFAF8",
  bgAlt: "#F4F3EF",
  bgDark: "#1C1E1A",
  text: "#1C1E1A",
  textLight: "#FAFAF8",
  textMuted: "#6A6D65",
  textDim: "#BABDB5",
  border: "#E2E4DC",
  borderDark: "#2C2E28",
  khaki: "#8A8D70",
  khakiLight: "#C0C3A8",
  khakiDark: "#5A5D44",
  molecule: "#4A7A5A",
  accent: "#2A4A3A",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
`;

const PRODUCTS = [
  {
    code: "AE-001",
    name: "Sérum Biomimétique",
    tagline: "Reconstitution barrière cutanée",
    volume: "30ml",
    price: "€ 145",
    key_ingredient: "Palmitoyl Pentapeptide-4 3%",
    full_formula: ["Niacinamide 5%", "Palmitoyl Pentapeptide-4 3%", "Acide hyaluronique multi-poids", "Extrait de Centella Asiatica"],
    texture: "Sérum aqueux non gras",
    target: "Peaux matures, ridules, manque de tonicité",
    clinical: "+38% de fermeté après 8 semaines — étude clinique double-aveugle n=62",
  },
  {
    code: "AE-002",
    name: "Émulsion Régénérante",
    tagline: "Renouvellement cellulaire accéléré",
    volume: "50ml",
    price: "€ 98",
    key_ingredient: "Rétinal 0.05%",
    full_formula: ["Rétinal (Rétinaldéhyde) 0.05%", "Bakuchiol 0.8%", "Bisabolol", "Squalane végétal"],
    texture: "Émulsion légère",
    target: "Peaux ternes, texture irrégulière, cicatrices légères",
    clinical: "+52% de renouvellement cellulaire en 4 semaines — étude VISIA",
  },
  {
    code: "AE-003",
    name: "Concentré Éclat C15",
    tagline: "Vitamine C stabilisée haute concentration",
    volume: "20ml",
    price: "€ 125",
    key_ingredient: "Acide L-ascorbique 15%",
    full_formula: ["Acide L-ascorbique 15%", "Acide férulique", "Vitamine E", "Acide glycolique 3%"],
    texture: "Sérum légèrement acide",
    target: "Taches pigmentaires, teint terne, oxydation cutanée",
    clinical: "-34% de taches en 12 semaines — spectrocolorimétrie",
  },
];

const SCIENCE_POINTS = [
  {
    title: "Formulation sans compromis",
    desc: "Chaque formule Aether Labs est développée avec des concentrations actives cliniquement significatives. Nous n'utilisons pas les actifs à des doses symboliques.",
  },
  {
    title: "Tests cliniques obligatoires",
    desc: "Aucun produit ne sort sans étude d'efficacité. Études en double-aveugle, mesures instrumentales, panels consommateurs. Les chiffres sont vérifiables.",
  },
  {
    title: "Formulation minimale",
    desc: "Le moins d'ingrédients possible. Le plus d'efficacité possible. Chaque composant a une raison d'être. Rien n'est là pour l'esthétique de la liste INCI.",
  },
  {
    title: "Transparence totale",
    desc: "Toutes nos études cliniques sont disponibles sur demande. Les concentrations exactes sont indiquées. Aucun secret de formulation — la science parle d'elle-même.",
  },
];

const ROUTINE = [
  { step: "AM", name: "Matin", products: ["Nettoyant léger", "Concentré Éclat C15", "SPF 50+"] },
  { step: "PM", name: "Soir", products: ["Double nettoyage", "Émulsion Régénérante", "Sérum Biomimétique"] },
];

// ── Molecular structure (signature element) ──────────────────────────────────
function MolecularDiagram({ inView }: { inView: boolean }) {
  const atoms = [
    { id: "C1", x: 200, y: 150, label: "C", color: C.text },
    { id: "C2", x: 260, y: 115, label: "C", color: C.text },
    { id: "C3", x: 320, y: 150, label: "C", color: C.text },
    { id: "C4", x: 320, y: 210, label: "C", color: C.text },
    { id: "C5", x: 260, y: 245, label: "C", color: C.text },
    { id: "C6", x: 200, y: 210, label: "C", color: C.text },
    { id: "O1", x: 150, y: 120, label: "O", color: C.molecule },
    { id: "N1", x: 360, y: 115, label: "N", color: "#4A6A8A" },
    { id: "H1", x: 150, y: 240, label: "H", color: C.textDim },
    { id: "H2", x: 260, y: 60, label: "H", color: C.textDim },
    { id: "C7", x: 420, y: 150, label: "C", color: C.text },
    { id: "O2", x: 420, y: 210, label: "O", color: C.molecule },
  ];

  const bonds = [
    ["C1", "C2"], ["C2", "C3"], ["C3", "C4"], ["C4", "C5"], ["C5", "C6"], ["C6", "C1"],
    ["C1", "O1"], ["C3", "N1"], ["C2", "H2"], ["C6", "H1"], ["N1", "C7"], ["C7", "O2"],
  ];

  const atomMap = Object.fromEntries(atoms.map((a) => [a.id, a]));

  return (
    <svg viewBox="0 80 480 240" style={{ width: "100%", height: "100%" }}>
      {/* Background grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="100" y1={60 + i * 25} x2="460" y2={60 + i * 25} stroke={C.border} strokeWidth="0.4" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={100 + i * 24} y1="60" x2={100 + i * 24} y2="340" stroke={C.border} strokeWidth="0.4" />
      ))}

      {/* Bonds */}
      {bonds.map(([from, to], i) => {
        const a = atomMap[from];
        const b = atomMap[to];
        if (!a || !b) return null;
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={C.khaki} strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
          />
        );
      })}

      {/* Atoms */}
      {atoms.map((atom, i) => (
        <motion.g key={atom.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
          style={{ transformOrigin: `${atom.x}px ${atom.y}px` }}
        >
          <circle cx={atom.x} cy={atom.y} r="14" fill={C.bg} stroke={atom.color} strokeWidth="1.5" />
          <text x={atom.x} y={atom.y + 4} textAnchor="middle" fill={atom.color} fontSize="9" fontFamily="DM Mono, monospace" fontWeight="500">
            {atom.label}
          </text>
        </motion.g>
      ))}

      {/* Label */}
      {inView && (
        <text x="280" y="345" textAnchor="middle" fill={C.textDim} fontSize="7" fontFamily="DM Mono, monospace" letterSpacing="4">
          PALMITOYL PENTAPEPTIDE-4
        </text>
      )}
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AetherLabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const molRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const molInView = useInView(molRef, { once: true, margin: "-80px" });
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(250,250,248,0)", "rgba(250,250,248,0.97)"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 500, color: C.text, letterSpacing: "0.08em" }}>
          AETHER<span style={{ color: C.khaki }}>_</span>LABS
        </div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Formules", "Science", "Routine", "À propos"].map((item) => (
            <motion.button key={item} onClick={() => document.getElementById(({"Formules": "formules", "Science": "science", "Routine": "routine", "À propos": "a-propos"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              
              
              style={{ fontSize: "0.75rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ backgroundColor: C.accent, color: C.textLight, borderColor: C.accent }}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textMuted,
            padding: "0.5rem 1.25rem",
            fontSize: "0.7rem",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Commander
        </motion.button>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 3rem 5rem 4rem" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.khaki, marginBottom: "1.5rem" }}
          >
            SKINCARE CLINIQUE · PARIS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            La Science<br />
            Au Service<br />
            <em style={{ color: C.khaki, fontStyle: "italic", fontWeight: 400 }}>de Votre Peau</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginBottom: "2.5rem" }}
          >
            Des formules développées en laboratoire, testées cliniquement, documentées scientifiquement. Aether Labs refuse le marketing. Seuls les résultats prouvés comptent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{ display: "flex", gap: "1rem" }}
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: C.accent }}
              style={{
                background: C.bgDark,
                color: C.textLight,
                border: "none",
                padding: "0.85rem 2rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              VOIR LES FORMULES
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.khaki, color: C.khaki }}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textMuted,
                padding: "0.85rem 2rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              LIRE LES ÉTUDES
            </motion.button>
          </motion.div>
        </div>

        {/* Right: molecular diagram */}
        <div
          ref={molRef}
          style={{
            background: C.bgAlt,
            borderLeft: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 3rem",
          }}
        >
          <div style={{ width: "100%", maxWidth: "480px", aspectRatio: "2/1" }}>
            <MolecularDiagram inView={molInView} />
          </div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────── */}
      <section id="formules" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.khaki, marginBottom: "0.5rem" }}>
                FORMULES
              </div>
              <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: C.text }}>
                Notre Gamme
              </h2>
            </div>
          </div>

          {/* Product tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, marginBottom: "3rem" }}>
            {PRODUCTS.map((p, i) => (
              <motion.button
                key={p.code}
                onClick={() => setActiveProduct(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.85rem 2rem",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: i === activeProduct ? C.text : C.textMuted,
                  cursor: "pointer",
                  position: "relative",
                }}
                whileHover={{ color: C.text }}
              >
                {p.code}
                {i === activeProduct && (
                  <motion.div layoutId="prod-indicator" style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "2px", background: C.khaki }} />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}
            >
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.khaki, marginBottom: "0.75rem" }}>
                  {PRODUCTS[activeProduct].code}
                </div>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
                  {PRODUCTS[activeProduct].name}
                </h3>
                <div style={{ fontSize: "0.9rem", fontStyle: "italic", color: C.textMuted, marginBottom: "2rem" }}>
                  {PRODUCTS[activeProduct].tagline}
                </div>

                <div style={{ background: C.bgAlt, padding: "1.5rem", borderLeft: `3px solid ${C.khaki}`, marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.khaki, marginBottom: "0.5rem" }}>
                    ACTIF CLÉ
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: C.text, fontWeight: 500 }}>
                    {PRODUCTS[activeProduct].key_ingredient}
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                    FORMULE COMPLÈTE
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {PRODUCTS[activeProduct].full_formula.map((ingredient) => (
                      <div key={ingredient} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ width: "4px", height: "4px", background: C.khaki, borderRadius: "50%", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: C.textMuted }}>
                          {ingredient}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.bgAlt, padding: "1.25rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.molecule, marginBottom: "0.4rem" }}>
                    ÉTUDE CLINIQUE
                  </div>
                  <div style={{ fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6 }}>
                    {PRODUCTS[activeProduct].clinical}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
                      {PRODUCTS[activeProduct].volume}
                    </div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text }}>
                      {PRODUCTS[activeProduct].price}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: C.accent }}
                    style={{
                      background: C.bgDark,
                      color: C.textLight,
                      border: "none",
                      padding: "0.75rem 1.75rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                  >
                    AJOUTER AU PANIER
                  </motion.button>
                </div>
              </div>

              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                  TEXTURE
                </div>
                <div style={{ fontSize: "0.9rem", color: C.textMuted, marginBottom: "2rem" }}>
                  {PRODUCTS[activeProduct].texture}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                  INDIQUÉ POUR
                </div>
                <div style={{ fontSize: "0.9rem", color: C.text, marginBottom: "2.5rem", lineHeight: 1.65 }}>
                  {PRODUCTS[activeProduct].target}
                </div>

                {/* Visual: product bottle placeholder */}
                <div style={{
                  background: C.bgAlt,
                  border: `1px solid ${C.border}`,
                  aspectRatio: "3/4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Molecule watermark */}
                  <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
                    <circle cx="100" cy="100" r="80" fill="none" stroke={C.khaki} strokeWidth="1" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke={C.khaki} strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="20" fill={C.khaki} />
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <line
                        key={angle}
                        x1={100 + 20 * Math.cos((angle * Math.PI) / 180)}
                        y1={100 + 20 * Math.sin((angle * Math.PI) / 180)}
                        x2={100 + 50 * Math.cos((angle * Math.PI) / 180)}
                        y2={100 + 50 * Math.sin((angle * Math.PI) / 180)}
                        stroke={C.khaki} strokeWidth="1"
                      />
                    ))}
                  </svg>
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>
                      {PRODUCTS[activeProduct].code}
                    </div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.2rem", fontWeight: 700, color: C.text }}>
                      {PRODUCTS[activeProduct].name}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, marginTop: "0.5rem" }}>
                      {PRODUCTS[activeProduct].volume}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Science pillars ──────────────────────────────────────────── */}
      <section id="science" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.khaki, marginBottom: "0.5rem" }}>
              NOTRE PHILOSOPHIE
            </div>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: C.textLight }}>
              Science Sans Concession
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.borderDark }}>
            {SCIENCE_POINTS.map((point, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={point.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                  style={{ background: C.bgDark, padding: "3rem" }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.khaki, marginBottom: "1.5rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.2rem", fontWeight: 700, color: C.textLight, marginBottom: "0.75rem" }}>
                    {point.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#6A6D65", lineHeight: 1.75 }}>
                    {point.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Routine builder ──────────────────────────────────────────── */}
      <section id="routine" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.khaki, marginBottom: "0.5rem" }}>
              ROUTINE RECOMMANDÉE
            </div>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: C.text }}>
              Le Programme Aether
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: C.border }}>
            {ROUTINE.map((r, i) => (
              <div key={r.step} style={{ background: C.bg, padding: "2.5rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 500, color: C.text, marginBottom: "0.25rem" }}>
                  {r.step}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "1.5rem" }}>
                  {r.name}
                </div>
                {r.products.map((p, j) => (
                  <div key={p} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.75rem 0", borderBottom: j < r.products.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: "1.5rem", height: "1.5rem", background: C.bgAlt, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: C.textDim }}>
                        {j + 1}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: C.textMuted }}>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section id="a-propos" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.khaki, marginBottom: "1.5rem" }}>
            DIAGNOSTIC PEAU GRATUIT
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
            Trouvez Votre<br />
            <em style={{ color: C.khaki }}>Formule Exacte</em>
          </h2>
          <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Répondez à 8 questions sur votre peau. Nous analysons votre profil cutané et vous recommandons le protocole adapté, avec les études cliniques à l'appui.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: C.accent }}
            style={{
              background: C.bgDark,
              color: C.textLight,
              border: "none",
              padding: "0.9rem 2.5rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            DÉMARRER LE DIAGNOSTIC
          </motion.button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem clamp(2rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 500, color: C.text, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              AETHER<span style={{ color: C.khaki }}>_</span>LABS
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
              SKINCARE · PARIS
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textDim, lineHeight: 1.65 }}>
              Formules développées en laboratoire, testées cliniquement. Efficacité prouvée, transparence totale.
            </p>
          </div>
          {[
            { title: "PRODUITS", items: ["Sérum Biomimétique", "Émulsion Régénérante", "Concentré C15", "Nouveautés"] },
            { title: "SCIENCE", items: ["Études cliniques", "Ingrédients", "Notre labo", "Publications"] },
            { title: "AIDE", items: ["Diagnostic peau", "FAQ", "Retours", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontSize: "0.8rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.text }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            © 2025 AETHER LABS. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Confidentialité"].map((item) => (
              <motion.a key={item} href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.textMuted }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
