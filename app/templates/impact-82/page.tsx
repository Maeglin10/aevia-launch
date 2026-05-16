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
  bg: "#F4F2EF",
  bgDark: "#1A1C1E",
  bgCard: "#ECEAE6",
  text: "#1A1C1E",
  textLight: "#F4F2EF",
  textMuted: "#6B6E72",
  textDim: "#A8AAAD",
  border: "#D8D5D0",
  borderDark: "#2E3033",
  steel: "#5B6B7A",
  concrete: "#8A8F95",
  accent: "#2A4A6B",
  accentLight: "#4A7FAA",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&display=swap');
`;

const PROJECTS = [
  {
    id: "P-2401",
    name: "Tour Séquoia",
    type: "Tour de bureaux",
    location: "La Défense, Paris",
    surface: "48 200 m²",
    floors: "32 étages",
    delivery: "Q2 2026",
    status: "En construction",
    statusColor: "#E8A020",
    budget: "€ 380M",
    cert: ["HQE Exceptionnel", "BREEAM Outstanding", "Wiredscore Platinum"],
  },
  {
    id: "P-2312",
    name: "Archipel",
    type: "Campus mixte",
    location: "Lyon Confluence",
    surface: "31 500 m²",
    floors: "6 bâtiments",
    delivery: "Q4 2025",
    status: "Commercialisation",
    statusColor: "#2A8A4A",
    budget: "€ 220M",
    cert: ["LEED Platinum", "Well Building Gold"],
  },
  {
    id: "P-2308",
    name: "Le Granite",
    type: "Immeuble de bureaux",
    location: "Euronantes",
    surface: "22 800 m²",
    floors: "18 étages",
    delivery: "Livré Q1 2025",
    status: "Livré",
    statusColor: "#5B6B7A",
    budget: "€ 145M",
    cert: ["HQE Excellent", "E+C-"],
  },
];

const SPECS = [
  { label: "Projets développés", value: "2.8M m²" },
  { label: "Volume traité", value: "€ 4.2 Md" },
  { label: "Actifs en gestion", value: "62" },
  { label: "Certifications obtenues", value: "140+" },
];

const EXPERTISE = [
  {
    code: "01",
    title: "Développement",
    desc: "De l'acquisition foncière à la livraison clé en main. Montage, permis, maîtrise d'ouvrage déléguée pour bureaux, logistique et résidentiel premium.",
  },
  {
    code: "02",
    title: "Gestion d'Actifs",
    desc: "Asset management actif. Optimisation des revenus, plans de valorisation, arbitrages stratégiques sur un portefeuille de 62 actifs pan-européens.",
  },
  {
    code: "03",
    title: "Investissement",
    desc: "Club-deals institutionnels et OPCI dédiés. Sélection rigoureuse, due diligence complète, accompagnement jusqu'à la sortie.",
  },
  {
    code: "04",
    title: "Durabilité",
    desc: "Net Zéro Carbon 2040. Intégration systématique des standards BREEAM, LEED, HQE et Well Building dès la conception.",
  },
];

const TENANTS = ["Société Générale", "EDF", "Capgemini", "Accenture", "Bouygues Energies", "Total Energies", "Orange Business", "BNP Paribas"];

// ── Architectural floor plan SVG (signature element) ──────────────────────────
function FloorPlanSVG({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 480 360" style={{ width: "100%", height: "100%", opacity: 0.9 }}>
      {/* Outer building footprint */}
      <motion.rect
        x="40" y="30" width="400" height="300"
        fill="none" stroke={C.accent} strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Core walls */}
      <motion.rect
        x="180" y="120" width="120" height="120"
        fill={C.bgCard} stroke={C.accent} strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      {/* Core label */}
      {animated && (
        <text x="240" y="185" textAnchor="middle" fill={C.concrete} fontSize="8" fontFamily="DM Mono, monospace" letterSpacing="2">
          CORE
        </text>
      )}

      {/* Structural columns */}
      {[
        [40, 30], [240, 30], [440, 30],
        [40, 180], [440, 180],
        [40, 330], [240, 330], [440, 330],
      ].map(([cx, cy], i) => (
        <motion.rect
          key={i}
          x={cx - 5} y={cy - 5} width="10" height="10"
          fill={C.accent}
          initial={{ scale: 0, opacity: 0 }}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.2 + i * 0.05 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Interior grid lines */}
      {animated && (
        <>
          <line x1="140" y1="30" x2="140" y2="330" stroke={C.border} strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="340" y1="30" x2="340" y2="330" stroke={C.border} strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="40" y1="120" x2="440" y2="120" stroke={C.border} strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="40" y1="240" x2="440" y2="240" stroke={C.border} strokeWidth="0.5" strokeDasharray="4 8" />
          {/* Bay lines */}
          <line x1="90" y1="30" x2="90" y2="120" stroke={C.border} strokeWidth="0.3" strokeDasharray="2 6" />
          <line x1="390" y1="30" x2="390" y2="120" stroke={C.border} strokeWidth="0.3" strokeDasharray="2 6" />
        </>
      )}

      {/* Dimension arrows */}
      {animated && (
        <>
          <motion.line
            x1="40" y1="350" x2="440" y2="350"
            stroke={C.concrete} strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          />
          <text x="240" y="358" textAnchor="middle" fill={C.concrete} fontSize="7" fontFamily="DM Mono, monospace">
            48.5 m
          </text>
          <line x1="20" y1="30" x2="20" y2="330" stroke={C.concrete} strokeWidth="0.5" />
          <text x="8" y="185" textAnchor="middle" fill={C.concrete} fontSize="7" fontFamily="DM Mono, monospace" transform="rotate(-90 8 185)">
            36.2 m
          </text>
        </>
      )}

      {/* Floor label */}
      {animated && (
        <text x="440" y="22" textAnchor="end" fill={C.steel} fontSize="7" fontFamily="DM Mono, monospace" letterSpacing="2">
          NIVEAU TYPE · TOUR SÉQUOIA
        </text>
      )}
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlueprintDev() {
  const containerRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const planInView = useInView(planRef, { once: true, margin: "-100px" });

  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(244,242,239,0)", "rgba(244,242,239,0.96)"]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 60]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 500, color: C.text, letterSpacing: "0.05em" }}>
            SÉQUOIA
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: C.textMuted }}>
            DÉVELOPPEMENT IMMOBILIER
          </div>
        </div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Projets", "Expertise", "Investisseurs", "ESG", "Contact"].map((item) => (
            <motion.button key={item} onClick={() => document.getElementById(({"Projets": "projets", "Expertise": "expertise", "Investisseurs": "investisseurs", "ESG": "esg", "Contact": "contact"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              
              
              style={{ fontSize: "0.75rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ backgroundColor: C.accent, borderColor: C.accent, color: C.textLight }}
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
          Espace Investisseurs
        </motion.button>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ height: "100vh", background: C.bgDark, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "0 3rem 5rem" }}>
        {/* Blueprint background lines */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          <svg width="100%" height="100%" viewBox="0 0 1400 900">
            {Array.from({ length: 30 }).map((_, i) => (
              <g key={i}>
                <line x1={i * 46.7} y1="0" x2={i * 46.7} y2="900" stroke="#4A7FAA" strokeWidth="0.5" />
                <line x1="0" y1={i * 30} x2="1400" y2={i * 30} stroke="#4A7FAA" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
        </div>

        {/* Building silhouette */}
        <motion.div
          style={{ position: "absolute", right: "5%", bottom: 0, y: heroY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 300 600" style={{ width: "240px", height: "480px" }}>
            <rect x="60" y="0" width="180" height="600" fill={C.accentLight} />
            {Array.from({ length: 30 }).map((_, i) => (
              <rect key={i} x="65" y={i * 20} width="170" height="12" fill={C.bgDark} />
            ))}
            <rect x="100" y="540" width="100" height="60" fill={C.bgDark} />
          </svg>
        </motion.div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.steel, marginBottom: "1.5rem" }}
          >
            PROMOTEUR · DÉVELOPPEUR · GESTIONNAIRE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 700,
              color: C.textLight,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            L'Immobilier<br />
            <span style={{ color: C.accentLight }}>Institutionnel</span><br />
            Réinventé
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#8A9AA8", lineHeight: 1.75, maxWidth: "55ch", marginBottom: "2.5rem" }}
          >
            Séquoia développe et gère des actifs immobiliers de premier rang pour les investisseurs institutionnels. 2.8 millions de m² développés, €4.2 milliards de volume traité.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{ display: "flex", gap: "1rem" }}
          >
            <motion.button
              whileHover={{ backgroundColor: C.accentLight }}
              style={{
                background: C.accent,
                color: C.textLight,
                border: "none",
                padding: "0.85rem 2rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              VOIR LES PROJETS
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.accentLight, color: C.accentLight }}
              style={{
                background: "transparent",
                color: C.steel,
                border: `1px solid #3A4A5A`,
                padding: "0.85rem 2rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              RAPPORT ANNUEL
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Key figures ─────────────────────────────────────────────────── */}
      <section id="projets" style={{ background: C.bgDark, borderTop: `1px solid ${C.borderDark}`, borderBottom: `1px solid ${C.borderDark}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {SPECS.map((spec, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={spec.label}
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: "3rem 2rem",
                  borderRight: i < 3 ? `1px solid ${C.borderDark}` : "none",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: C.textLight }}>
                  {spec.value}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.steel, marginTop: "0.5rem" }}>
                  {spec.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────────── */}
      <section id="expertise" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textMuted, marginBottom: "0.5rem" }}>
                PIPELINE
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, color: C.text }}>
                Projets en Cours
              </h2>
            </div>
          </div>

          {/* Project tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, marginBottom: "3rem" }}>
            {PROJECTS.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => setActiveProject(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.85rem 2rem",
                  fontSize: "0.75rem",
                  color: i === activeProject ? C.text : C.textMuted,
                  cursor: "pointer",
                  position: "relative",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.05em",
                }}
                whileHover={{ color: C.text }}
              >
                {p.id}
                {i === activeProject && (
                  <motion.div
                    layoutId="project-indicator"
                    style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "2px", background: C.accent }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    padding: "0.3rem 0.75rem",
                    background: PROJECTS[activeProject].statusColor + "20",
                    color: PROJECTS[activeProject].statusColor,
                    border: `1px solid ${PROJECTS[activeProject].statusColor}40`,
                  }}>
                    {PROJECTS[activeProject].status}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim }}>
                    {PROJECTS[activeProject].id}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
                  {PROJECTS[activeProject].name}
                </h3>
                <div style={{ fontSize: "0.9rem", color: C.textMuted, marginBottom: "2rem" }}>
                  {PROJECTS[activeProject].type} · {PROJECTS[activeProject].location}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  {[
                    { label: "Surface totale", val: PROJECTS[activeProject].surface },
                    { label: "Programme", val: PROJECTS[activeProject].floors },
                    { label: "Livraison", val: PROJECTS[activeProject].delivery },
                    { label: "Volume", val: PROJECTS[activeProject].budget },
                  ].map((spec) => (
                    <div key={spec.label} style={{ paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.35rem" }}>
                        {spec.label}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 500, color: C.text }}>{spec.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                    CERTIFICATIONS
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {PROJECTS[activeProject].cert.map((c) => (
                      <span key={c} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, color: C.textMuted }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ backgroundColor: C.accent, color: C.textLight, borderColor: C.accent }}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    color: C.textMuted,
                    padding: "0.75rem 1.75rem",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.1em",
                  }}
                >
                  DOSSIER INVESTISSEUR →
                </motion.button>
              </div>

              {/* Floor plan */}
              <div ref={planRef} style={{ background: C.bgCard, padding: "3rem", border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "1.5rem" }}>
                  PLAN DE NIVEAU TYPE
                </div>
                <div style={{ aspectRatio: "4/3" }}>
                  <FloorPlanSVG animated={planInView} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Expertise ────────────────────────────────────────────────────── */}
      <section id="investisseurs" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textMuted, marginBottom: "0.5rem" }}>
              MÉTIERS
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, color: C.text }}>
              Notre Expertise
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.border }}>
            {EXPERTISE.map((exp, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={exp.code}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                  style={{ background: C.bgCard, padding: "3rem" }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: C.accent, marginBottom: "1.5rem" }}>
                    {exp.code}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.75 }}>
                    {exp.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tenants ──────────────────────────────────────────────────────── */}
      <section id="esg" style={{ padding: "5rem clamp(2rem, 5vw, 4rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textMuted, marginBottom: "2.5rem" }}>
            LOCATAIRES DE RÉFÉRENCE
          </div>
          <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
            {TENANTS.map((tenant, i) => (
              <motion.div
                key={tenant}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{
                  padding: "1.25rem 2rem",
                  border: `1px solid ${C.border}`,
                  marginRight: "-1px",
                  marginBottom: "-1px",
                  fontSize: "0.8rem",
                  color: C.textMuted,
                  fontWeight: 500,
                  cursor: "default",
                }}
              >
                {tenant}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgDark, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.steel, marginBottom: "1.5rem" }}>
            INVESTISSEURS INSTITUTIONNELS
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: C.textLight, marginBottom: "1.5rem" }}>
            Accéder à Notre Pipeline
          </h2>
          <p style={{ fontSize: "1rem", color: "#6A7A88", lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Séquoia travaille avec un cercle restreint d'investisseurs institutionnels sur des transactions off-market. Demandez un accès à notre espace dédié.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <motion.button
              whileHover={{ backgroundColor: C.accentLight }}
              style={{
                background: C.accent,
                color: C.textLight,
                border: "none",
                padding: "0.9rem 2.5rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "background 0.3s",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              DEMANDER UN ACCÈS
            </motion.button>
          </div>
          <div style={{ marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.steel }}>
            relations.investisseurs@sequoia-immo.fr · +33 1 XX XX XX XX
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.borderDark}`, padding: "3rem clamp(2rem, 5vw, 4rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", fontWeight: 500, color: C.textLight, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              SÉQUOIA
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: C.steel, marginBottom: "1.5rem" }}>
              IMMOBILIER INSTITUTIONNEL
            </div>
            <p style={{ fontSize: "0.8rem", color: C.steel, lineHeight: 1.65 }}>
              Société de développement immobilier agréée AMF. SIREN 448 123 456 — Paris (75008).
            </p>
          </div>
          {[
            { title: "PROJETS", items: ["Pipeline en cours", "Projets livrés", "Portfolio", "Rapport ESG"] },
            { title: "SERVICES", items: ["Développement", "Gestion d'actifs", "Investissement", "Conseil"] },
            { title: "GROUPE", items: ["À propos", "Équipe", "Presse", "Carrières"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.steel, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    style={{ fontSize: "0.8rem", color: C.steel, textDecoration: "none", cursor: "pointer" }}
                    whileHover={{ color: C.textLight }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1200px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.borderDark}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#333" }}>
            © 2025 SÉQUOIA DÉVELOPPEMENT. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Politique de confidentialité", "CGU"].map((item) => (
              <motion.a key={item} href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#333", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: "#666" }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
