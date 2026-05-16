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
  bg: "#0A0C0E",
  bgCard: "#111418",
  bgLight: "#161A1F",
  text: "#E8EAF0",
  textMuted: "#8A8FA0",
  textDim: "#3A3F4A",
  border: "#1E242C",
  borderGold: "#3A3020",
  gold: "#C8A87A",
  goldLight: "#E8D5A8",
  goldDark: "#7A6040",
  white: "#F0F4FF",
  clinical: "#4A8A9A",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');
`;

const PROTOCOLS = [
  {
    id: "genesis",
    code: "CX-001",
    name: "Protocole Genèse",
    tagline: "La jeunesse comme état fondamental",
    price: "À partir de € 2,800",
    sessions: "3 séances",
    technology: "RF Microneedling + Exosomes",
    result: "Régénération cellulaire profonde, fermeté, éclat durable",
    targets: ["Relâchement cutané", "Taches pigmentaires", "Texture irrégulière"],
  },
  {
    id: "architect",
    code: "CX-002",
    name: "Protocole Architecte",
    tagline: "Redessiner les volumes avec précision",
    price: "À partir de € 1,900",
    sessions: "2 séances",
    technology: "Acide hyaluronique haute densité + Fils tenseurs",
    result: "Repositionnement volumique, correction de l'ovale, projection des pommettes",
    targets: ["Affaissement des volumes", "Perte de définition", "Fatigue structurelle"],
  },
  {
    id: "cipher",
    code: "CX-003",
    name: "Protocole Cipher",
    tagline: "Effacer sans laisser de traces",
    price: "À partir de € 1,200",
    sessions: "1 séance",
    technology: "Laser CO2 fractionnel + Plasma Pen",
    result: "Lissage des ridules, fermeté immédiate, peau neuve",
    targets: ["Ridules", "Cicatrices", "Relâchement léger"],
  },
  {
    id: "oracle",
    code: "CX-004",
    name: "Protocole Oracle",
    tagline: "Le diagnostic absolu, personnalisé",
    price: "€ 490",
    sessions: "Consultation + bilan 3D",
    technology: "Scanner Visia + Analyse cutimétrique",
    result: "Cartographie complète de votre peau, programme sur 12 mois",
    targets: ["Nouveau patient", "Évaluation globale", "Suivi longitudinal"],
  },
];

const EXPERTISE = [
  { code: "DR. A.V.", name: "Dr. Amira Valentin", spec: "Médecine esthétique · Anti-aging", credential: "AFME · DIU Lyon" },
  { code: "DR. L.M.", name: "Dr. Luca Moreno", spec: "Médecine régénérative · Laser", credential: "AFME · Harvard CME" },
  { code: "DR. C.N.", name: "Dr. Clara Nkemdirim", spec: "Dermatologie · Traitements pigmentaires", credential: "DESC Dermatologie" },
];

const PROCESS = [
  { step: "01", title: "Bilan Complet", desc: "Scanner 3D Visia, photographies standardisées, analyse cutimétrique. 90 minutes pour tout comprendre." },
  { step: "02", title: "Protocole Sur Mesure", desc: "Votre programme personnalisé sur 6 à 12 mois. Chaque décision médicale est expliquée, motivée, documentée." },
  { step: "03", title: "Traitement", desc: "Chaque séance est réalisée par le médecin référent, dans notre bloc technique certifié. Zéro délégation." },
  { step: "04", title: "Suivi Longitudinal", desc: "Contrôle photographique systématique. Ajustements en temps réel. Votre peau est suivie comme un investissement." },
];

// ── Biometric scan animation (signature element) ──────────────────────────────
function BiometricScan({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 280 280" style={{ width: "100%", height: "100%" }}>
      {/* Outer circle */}
      <circle cx="140" cy="140" r="130" fill="none" stroke={C.border} strokeWidth="1" />

      {/* Rotating arc */}
      <motion.circle
        cx="140" cy="140" r="130"
        fill="none"
        stroke={C.gold}
        strokeWidth="1.5"
        strokeDasharray="60 750"
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 140px" }}
      />

      {/* Inner rings */}
      <circle cx="140" cy="140" r="100" fill="none" stroke={C.border} strokeWidth="0.5" />
      <circle cx="140" cy="140" r="70" fill="none" stroke={C.borderGold} strokeWidth="0.8" />

      {/* Scan line */}
      <motion.line
        x1="10" y1="140" x2="270" y2="140"
        stroke={C.gold} strokeWidth="0.5" opacity="0.4"
        animate={active ? { y1: [10, 270, 10], y2: [10, 270, 10] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Face outline dots */}
      {[
        [140, 95], [110, 115], [170, 115],
        [125, 125], [155, 125],
        [140, 155], [118, 175], [162, 175],
        [140, 185],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r="2.5"
          fill={C.gold}
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: [0, 1, 0.5], scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.08, repeat: Infinity, repeatDelay: 2.5 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Corner marks */}
      {[[20, 20], [260, 20], [20, 260], [260, 260]].map(([x, y], i) => (
        <g key={i}>
          <line
            x1={x + (x < 140 ? 0 : -12)} y1={y}
            x2={x + (x < 140 ? 12 : 0)} y2={y}
            stroke={C.gold} strokeWidth="1.5"
          />
          <line
            x1={x} y1={y + (y < 140 ? 0 : -12)}
            x2={x} y2={y + (y < 140 ? 12 : 0)}
            stroke={C.gold} strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Center crosshair */}
      <line x1="135" y1="140" x2="145" y2="140" stroke={C.gold} strokeWidth="0.8" />
      <line x1="140" y1="135" x2="140" y2="145" stroke={C.gold} strokeWidth="0.8" />

      {/* Labels */}
      {active && (
        <>
          <text x="140" y="250" textAnchor="middle" fill={C.textDim} fontSize="6" fontFamily="DM Mono, monospace" letterSpacing="3">
            ANALYSE EN COURS
          </text>
          <text x="20" y="16" fill={C.goldDark} fontSize="5.5" fontFamily="DM Mono, monospace" letterSpacing="2">
            VISIA 3D
          </text>
        </>
      )}
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CypherClinic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const [activeProtocol, setActiveProtocol] = useState(0);
  const scanInView = useInView(scanRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({ target: containerRef });
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(10,12,14,0)", "rgba(10,12,14,0.96)"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.12em", color: C.text }}>
            CYPHER
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.45rem", letterSpacing: "0.3em", color: C.textDim }}>
            CLINIQUE MÉDICALE
          </div>
        </div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Protocoles", "Médecins", "Résultats", "Contact"].map((item) => (
            <motion.button key={item} onClick={() => document.getElementById(({"Protocoles": "protocoles", "Médecins": "medecins", "Résultats": "resultats", "Contact": "contact"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              
              
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ borderColor: C.gold, color: C.gold }}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textMuted,
            padding: "0.5rem 1.5rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          CONSULTATION
        </motion.button>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
        {/* Left: text */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "8rem 3rem 5rem 4rem",
          background: C.bg,
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
          >
            <div style={{ width: "2rem", height: "1px", background: C.gold }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.gold }}>
              MÉDECINE ESTHÉTIQUE CLINIQUE
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
              fontWeight: 800,
              color: C.text,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            La Médecine<br />
            Esthétique<br />
            <span style={{ color: C.gold }}>Sans Compromis</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginBottom: "3rem" }}
          >
            Cypher Clinic est une clinique médicale privée dédiée aux traitements esthétiques d'excellence. Chaque protocole est conçu et réalisé par des médecins certifiés. Aucun compromis sur la sécurité ou les résultats.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{ display: "flex", gap: "1rem" }}
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
              style={{
                background: C.gold,
                color: C.bg,
                border: "none",
                padding: "0.9rem 2rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              BILAN GRATUIT →
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.gold, color: C.gold }}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textMuted,
                padding: "0.9rem 2rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              VOIR LES PROTOCOLES
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${C.border}` }}>
            {[
              { n: "3", label: "Médecins experts" },
              { n: "8 ans", label: "D'exercice exclusif" },
              { n: "100%", label: "Actes médicaux certifiés" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.gold }}>{stat.n}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: C.textDim, marginTop: "0.2rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: biometric scan */}
        <div ref={scanRef} style={{
          background: C.bgCard,
          borderLeft: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Grid background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.03 }}>
            <svg width="100%" height="100%" viewBox="0 0 500 700">
              {Array.from({ length: 25 }).map((_, i) => (
                <g key={i}>
                  <line x1={i * 20} y1="0" x2={i * 20} y2="700" stroke={C.clinical} strokeWidth="0.5" />
                  <line x1="0" y1={i * 28} x2="500" y2={i * 28} stroke={C.clinical} strokeWidth="0.5" />
                </g>
              ))}
            </svg>
          </div>

          <div style={{ width: "min(320px, 100%)", aspectRatio: "1", position: "relative", zIndex: 1 }}>
            <BiometricScan active={scanInView} />
          </div>

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: "2rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.5rem" }}>
              SCANNER VISIA GEN7
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: C.textMuted }}>
              Analyse cutanée 3D complète
            </div>
          </div>
        </div>
      </section>

      {/* ── Protocols ─────────────────────────────────────────────────── */}
      <section id="protocoles" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "2rem", height: "1px", background: C.gold }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.gold }}>PROTOCOLES</span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, color: C.text }}>
              Nos Programmes Médicaux
            </h2>
          </div>

          {/* Protocol tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, marginBottom: "3rem" }}>
            {PROTOCOLS.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => setActiveProtocol(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.85rem 1.5rem",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: i === activeProtocol ? C.gold : C.textMuted,
                  cursor: "pointer",
                  position: "relative",
                }}
                whileHover={{ color: C.text }}
              >
                {p.code}
                {i === activeProtocol && (
                  <motion.div layoutId="protocol-indicator" style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "1px", background: C.gold }} />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProtocol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}
            >
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                  {PROTOCOLS[activeProtocol].code}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
                  {PROTOCOLS[activeProtocol].name}
                </h3>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: "1rem", color: C.textMuted, marginBottom: "2rem" }}>
                  {PROTOCOLS[activeProtocol].tagline}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  {[
                    { label: "Technologie", val: PROTOCOLS[activeProtocol].technology },
                    { label: "Programme", val: PROTOCOLS[activeProtocol].sessions },
                  ].map((spec) => (
                    <div key={spec.label} style={{ paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.4rem" }}>
                        {spec.label}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.5 }}>{spec.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "1.5rem", background: C.bg, border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.gold, marginBottom: "0.75rem" }}>
                    RÉSULTAT ATTENDU
                  </div>
                  <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.65 }}>
                    {PROTOCOLS[activeProtocol].result}
                  </p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.75rem" }}>
                    INDICATIONS
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {PROTOCOLS[activeProtocol].targets.map((t) => (
                      <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, color: C.textMuted }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>TARIF</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.gold }}>
                      {PROTOCOLS[activeProtocol].price}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                    style={{
                      background: C.gold,
                      color: C.bg,
                      border: "none",
                      padding: "0.75rem 1.75rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                  >
                    DEMANDER CE PROTOCOLE
                  </motion.button>
                </div>
              </div>

              {/* Visual: protocol steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {["Consultation médicale initiale", "Bilan photographique standardisé", "Réalisation par le médecin référent", "Contrôle post-traitement J+7", "Suivi photographique M+1"].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.25rem", background: C.bg, border: `1px solid ${C.border}` }}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.gold, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Medical team ─────────────────────────────────────────────── */}
      <section id="medecins" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "2rem", height: "1px", background: C.gold }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.gold }}>ÉQUIPE MÉDICALE</span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, color: C.text }}>
              Nos Médecins
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
            {EXPERTISE.map((dr, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={dr.code}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{ background: C.bgCard, padding: "2.5rem" }}
                >
                  <div style={{ width: "60px", height: "60px", background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: C.gold }}>
                      {dr.code}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.4rem" }}>
                    {dr.name}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: C.textMuted, marginBottom: "0.75rem", lineHeight: 1.5 }}>
                    {dr.spec}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: C.textDim, padding: "0.35rem 0.65rem", border: `1px solid ${C.border}`, display: "inline-block" }}>
                    {dr.credential}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section id="resultats" style={{ padding: "7rem clamp(2rem, 5vw, 4rem)", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "2rem", height: "1px", background: C.gold }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.gold }}>MÉTHODE</span>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 700, color: C.text }}>
                Le Protocole Cypher
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.border }}>
            {PROCESS.map((step, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={step.step}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ background: C.bgCard, padding: "2.5rem 2rem" }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: C.gold, marginBottom: "1.5rem" }}>
                    {step.step}
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "8rem clamp(2rem, 5vw, 4rem)", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ width: "2rem", height: "1px", background: C.gold }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.gold }}>CONSULTATION GRATUITE</span>
            <div style={{ width: "2rem", height: "1px", background: C.gold }} />
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, color: C.text, marginBottom: "1rem", lineHeight: 1.1 }}>
            Commençons par<br />
            <span style={{ color: C.gold }}>Votre Bilan</span>
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2.5rem" }}>
            La première consultation est offerte. 60 minutes avec votre médecin référent pour analyser votre peau, comprendre vos attentes, et concevoir votre programme.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
            style={{
              background: C.gold,
              color: C.bg,
              border: "none",
              padding: "1rem 3rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            PRENDRE RENDEZ-VOUS →
          </motion.button>
          <div style={{ marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: C.textDim }}>
            hello@cypher-clinic.fr · 01 XX XX XX XX
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem clamp(2rem, 5vw, 4rem)", background: C.bgCard }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.12em", color: C.text, marginBottom: "0.5rem" }}>
              CYPHER
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
              CLINIQUE MÉDICALE
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textDim, lineHeight: 1.65 }}>
              Clinique médicale privée. Actes réalisés par des médecins. RPPS disponible sur demande.
            </p>
          </div>
          {[
            { title: "SOINS", items: ["Protocoles médicaux", "Résultats avant/après", "Tarifs", "FAQ"] },
            { title: "CLINIQUE", items: ["Notre équipe", "Nos engagements", "Accréditations", "Presse"] },
            { title: "CONTACT", items: ["Consultation", "Urgences post-soin", "Paris 8e", "+33 1 XX XX XX XX"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontSize: "0.8rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.text }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            © 2025 CYPHER CLINIC. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Confidentialité", "CGU"].map((item) => (
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
