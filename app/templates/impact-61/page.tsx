"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

// ── Design System (ui-ux-pro-max: Exaggerated Minimalism, Archivo/Space Grotesk) ──
const C = {
  bg: "#FFFFFF",
  bgOff: "#F7F7F5",
  bgDark: "#171717",
  text: "#171717",
  textLight: "#FFFFFF",
  textMuted: "#404040",
  textDim: "#A0A0A0",
  border: "#E8E8E8",
  borderDark: "#2A2A2A",
  gold: "#D4AF37",
  goldDark: "#8A7020",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
`;

const PROJECTS = [
  {
    id: "S.01",
    title: "Maison Flottante",
    type: "Résidence privée",
    location: "Lac d'Annecy",
    year: "2024",
    area: "420 m²",
    status: "Réalisé",
    desc: "Habitation suspendue au-dessus de l'eau. Structure en acier cor-ten, toiture végétalisée, vue panoramique 270°. Prix Pritzker régional 2024.",
    tags: ["Résidentiel", "Acier", "Bois"],
  },
  {
    id: "S.02",
    title: "Pavillon Négatif",
    type: "Espace culturel",
    location: "Bordeaux",
    year: "2024",
    area: "1 200 m²",
    status: "Réalisé",
    desc: "Centre d'art contemporain dont l'architecture est définie par ses vides. Béton brut, lumière zénithale, acoustique de salle de concert.",
    tags: ["Culturel", "Béton", "Lumière"],
  },
  {
    id: "S.03",
    title: "Tour Ombre",
    type: "Immeuble de bureaux",
    location: "Paris 13e",
    year: "2023",
    area: "8 400 m²",
    status: "Réalisé",
    desc: "18 étages de bureaux collaboratifs. Façade en peaux d'aluminium perforées qui changent d'aspect selon l'heure. Certifié HQE Exceptionnel.",
    tags: ["Tertiaire", "Aluminium", "Façade"],
  },
  {
    id: "S.04",
    title: "Bibliothèque du Vide",
    type: "Équipement public",
    location: "Lyon",
    year: "2023",
    area: "3 600 m²",
    status: "Réalisé",
    desc: "Médiathèque de quartier où l'espace intérieur est conçu comme un creux dans la masse bâtie. Bois lamellé-croisé, patio central, double peau.",
    tags: ["Public", "Bois", "CLT"],
  },
  {
    id: "S.05",
    title: "Résidence Séquence",
    type: "Logements collectifs",
    location: "Nantes",
    year: "2022",
    area: "5 200 m²",
    status: "Réalisé",
    desc: "48 logements sociaux dont chaque unité est une variation sur un même thème. Béton blanc, terrasses filantes, jardin partagé en pleine terre.",
    tags: ["Logement", "Social", "Béton blanc"],
  },
];

const TEAM = [
  { name: "Laurent Segré", role: "Associé fondateur", credential: "DPLG · HMONP" },
  { name: "Mei Zhang", role: "Architecte senior", credential: "MArch Harvard" },
  { name: "Antoine Brel", role: "Chef de projet", credential: "DPLG · HQE" },
];

const AWARDS = [
  { year: "2024", title: "Prix Équerre d'Argent — Mention spéciale", project: "Maison Flottante" },
  { year: "2024", title: "Trophées Bâtiments Publics Or", project: "Pavillon Négatif" },
  { year: "2023", title: "Prix National de la Construction Bois", project: "Bibliothèque du Vide" },
  { year: "2022", title: "Prix Éco-quartier Argent", project: "Résidence Séquence" },
];

// ── 21st.dev: TextReveal (mask slide) ────────────────────────────────────────
function TextReveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── 21st.dev: MagneticButton ─────────────────────────────────────────────────
function MagneticButton({ children, style = {}, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { style?: React.CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, ...style }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

// ── 21st.dev: SpotlightCard ──────────────────────────────────────────────────
function SpotlightCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = divRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ...style,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute",
          pointerEvents: "none",
          borderRadius: "50%",
          width: "400px",
          height: "400px",
          left: pos.x - 200,
          top: pos.y - 200,
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          transition: "opacity 0.2s",
          zIndex: 0,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── Dot navigation (signature element) ──────────────────────────────────────
function DotNav({ sections, active }: { sections: string[]; active: number }) {
  return (
    <div style={{
      position: "fixed",
      right: "2rem",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      {sections.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <motion.div
            animate={{
              width: i === active ? "1.5rem" : "6px",
              height: "6px",
              backgroundColor: i === active ? C.gold : C.textDim,
              borderRadius: i === active ? "3px" : "50%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Count-up (21st.dev pattern) ───────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1500;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SegmentOS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const navBg = useTransform(scrollYProgress, [0, 0.04], ["rgba(255,255,255,0)", "rgba(255,255,255,0.97)"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const SECTIONS = ["Studio", "Projets", "Méthode", "Équipe", "Contact"];

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* Progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.gold, width: progressWidth, zIndex: 200 }} />

      {/* Dot nav */}
      <DotNav sections={SECTIONS} active={activeSection} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.12em", color: C.text }}>
          SEGMENT
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          {["Projets", "Studio", "Contact"].map((item) => (
            <motion.a
              key={item}
              href="#"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.a>
          ))}
        </div>
        <MagneticButton
          style={{
            background: C.bgDark,
            color: C.textLight,
            border: "none",
            padding: "0.5rem 1.5rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          CONTACT
        </MagneticButton>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem", paddingTop: "7rem", position: "relative" }}>
        {/* Giant number background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "absolute",
            top: "3rem",
            right: "2rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(8rem, 25vw, 22rem)",
            fontWeight: 900,
            color: C.border,
            lineHeight: 0.85,
            userSelect: "none",
            letterSpacing: "-0.06em",
          }}
        >
          23
        </motion.div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", color: C.textDim, marginBottom: "1.5rem" }}
            >
              ARCHITECTES · PARIS · DEPUIS 2001
            </motion.div>
          </div>

          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 900, lineHeight: 0.87, letterSpacing: "-0.04em", color: C.text }}>
            <TextReveal delay={0.3}>FORMES</TextReveal>
            <TextReveal delay={0.4} style={{ color: C.gold }}>ET</TextReveal>
            <TextReveal delay={0.5}>VIDES</TextReveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "4rem", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "42ch" }}
            >
              Segment est un studio d'architecture fondé sur une conviction : la qualité d'un espace se mesure à ses silences autant qu'à sa matière. Vingt ans de pratique, vingt ans de cette même question.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <MagneticButton
                style={{
                  background: C.bgDark,
                  color: C.textLight,
                  border: "none",
                  padding: "1rem 2rem",
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                VOIR LES PROJETS
                <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>→</span>
              </MagneticButton>
              <MagneticButton
                style={{
                  background: "transparent",
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  padding: "1rem 2rem",
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                TÉLÉCHARGER LE DOSSIER
                <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>↓</span>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { n: 23, suffix: "", label: "années d'exercice" },
            { n: 85, suffix: "+", label: "projets réalisés" },
            { n: 42, suffix: "", label: "distinctions" },
            { n: 7, suffix: "", label: "pays d'intervention" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "3rem 2rem",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "3.5rem", fontWeight: 900, color: C.text, letterSpacing: "-0.04em", lineHeight: 1 }}>
                <CountUp target={stat.n} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textDim, marginTop: "0.5rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects ──────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 3rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
            <div>
              <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
                Projets Réalisés
              </TextReveal>
            </div>
            <motion.a
              href="#"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              TOUT VOIR
              <div style={{ width: "2rem", height: "1px", background: "currentcolor" }} />
            </motion.a>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {PROJECTS.map((project, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <SpotlightCard
                  key={project.id}
                  style={{ borderTop: i === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}` }}
                >
                  <motion.div
                    ref={ref}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    onClick={() => setActiveProject(activeProject === i ? null : i)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "5rem 1fr auto auto auto", gap: "3rem", padding: "2rem 0", alignItems: "center" }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.textDim }}>
                        {project.id}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                          {project.title}
                        </div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted, marginTop: "0.2rem" }}>
                          {project.type}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                        {project.location}
                      </div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                        {project.area}
                      </div>
                      <div>
                        <motion.div
                          animate={{ rotate: activeProject === i ? 45 : 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, borderRadius: "50%" }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                            <line x1="12" y1="5" x2="12" y2="19" stroke={C.text} strokeWidth="1.5" />
                            <line x1="5" y1="12" x2="19" y2="12" stroke={C.text} strokeWidth="1.5" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeProject === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "5rem 1fr 1fr", gap: "3rem", paddingBottom: "2.5rem" }}>
                            <div />
                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "55ch" }}>
                              {project.desc}
                            </p>
                            <div>
                              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                                {project.tags.map((tag) => (
                                  <span key={tag} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, color: C.textMuted }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textDim }}>
                                {project.year} · {project.status}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgDark, overflow: "hidden", position: "relative" }}>
        {/* Decorative line */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: C.gold, opacity: 0.3 }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.gold, marginBottom: "3rem" }}>
            PHILOSOPHIE
          </div>

          {[
            { quote: "L'architecture n'est pas l'art de construire des murs. C'est l'art de choisir où ne pas en mettre.", weight: 900 },
            { quote: "Un bâtiment réussi est celui dont les habitants finissent par oublier qu'il a été conçu.", weight: 300 },
            { quote: "La lumière n'est pas un détail. Elle est le matériau principal de tout espace habitable.", weight: 500 },
          ].map((item, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-60px" });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                  fontWeight: item.weight,
                  color: i === 0 ? C.textLight : i === 2 ? C.gold : "#666",
                  lineHeight: 1.35,
                  paddingBottom: "2rem",
                  marginBottom: "2rem",
                  borderBottom: i < 2 ? `1px solid #222` : "none",
                  letterSpacing: "-0.01em",
                }}
              >
                "{item.quote}"
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#444", marginTop: "1rem" }}
          >
            — Laurent Segré, Fondateur
          </motion.div>
        </div>
      </section>

      {/* ── Awards ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 3rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              Distinctions
            </TextReveal>
          </div>
          {AWARDS.map((award, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "grid", gridTemplateColumns: "6rem 1fr auto", gap: "3rem", padding: "1.75rem 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}
              >
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.gold, fontWeight: 600 }}>
                  {award.year}
                </div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 500, color: C.text }}>
                  {award.title}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textDim, textAlign: "right" }}>
                  {award.project}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 3rem", background: C.bgOff }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              L'Équipe
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
            {TEAM.map((member, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <SpotlightCard key={member.name} style={{ background: C.bg }}>
                  <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    style={{ padding: "3rem 2.5rem" }}
                  >
                    <div style={{ width: "60px", height: "60px", background: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
                      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.textLight }}>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.3rem" }}>
                      {member.name}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textMuted, marginBottom: "0.75rem" }}>
                      {member.role}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textDim, padding: "0.3rem 0.65rem", border: `1px solid ${C.border}`, display: "inline-block" }}>
                      {member.credential}
                    </div>
                  </motion.div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgDark, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(6rem, 22vw, 20rem)",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.06em",
          }}>
            /S/
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: C.textLight, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "2rem" }}>
            Votre projet<br />mérite mieux.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "1rem", color: "#666", lineHeight: 1.75, marginBottom: "3rem" }}
          >
            On accepte 4 nouveaux projets par an. Si le vôtre est l'un d'eux, écrivons-nous.
          </motion.p>
          <MagneticButton
            style={{
              background: C.gold,
              color: C.bgDark,
              border: "none",
              padding: "1.1rem 3rem",
              fontFamily: "'Archivo', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}
          >
            DÉMARRER UN PROJET →
          </MagneticButton>
          <div style={{ marginTop: "2rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "#444" }}>
            contact@segment-architectes.fr · +33 1 XX XX XX XX
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid #222`, padding: "3rem", background: C.bgDark }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.12em", color: C.textLight, marginBottom: "1rem" }}>
              SEGMENT
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", marginBottom: "1.5rem" }}>
              ARCHITECTES · PARIS
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#444", lineHeight: 1.65 }}>
              Architecture pour ceux qui croient que la forme suit le vide autant que la fonction.
            </p>
          </div>
          {[
            { title: "PROJETS", items: ["Résidentiel", "Tertiaire", "Culturel", "Public"] },
            { title: "STUDIO", items: ["Philosophie", "Équipe", "Méthode", "Prix"] },
            { title: "CONTACT", items: ["Nouveau projet", "Presse", "Recrutement", "Paris 11e"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#333", marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#555", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.textLight }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "#333" }}>
            © 2025 SEGMENT ARCHITECTES. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "RGPD"].map((item) => (
              <motion.a key={item} href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: "#333", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: "#777" }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
