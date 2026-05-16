"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

// ─── EQ Bars Component ────────────────────────────────────────────────────────
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
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "5px",
        height: "80px",
        padding: "0 4px",
      }}
    >
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          animate={{
            height: [`${bar.min}%`, `${bar.max}%`, `${bar.min + 10}%`, `${bar.max - 5}%`, `${bar.min}%`],
          }}
          transition={{
            duration: 0.9 + bar.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bar.delay,
          }}
          style={{
            width: 6,
            backgroundColor: C.accent,
            borderRadius: "2px 2px 0 0",
            minHeight: "20%",
            boxShadow: `0 0 8px ${C.accent}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
function ArtistMarquee({ artists }: { artists: string[] }) {
  const doubled = [...artists, ...artists];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 80,
          background: `linear-gradient(to right, ${C.bg}, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0,
          width: 80,
          background: `linear-gradient(to left, ${C.bg}, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: [0, `-${50}%`] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "0", whiteSpace: "nowrap" }}
      >
        {doubled.map((artist, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1.5rem",
              padding: "0 2.5rem",
            }}
          >
            <span
              style={{
                fontFamily: C.headingFont,
                fontSize: "1.6rem",
                color: i % 3 === 0 ? C.accent : C.textMuted,
                letterSpacing: "0.08em",
              }}
            >
              {artist}
            </span>
            <span style={{ color: C.border, fontSize: "1.2rem" }}>◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "1.25rem 0",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: C.bodyFont, fontSize: "1rem", color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={20} color={C.accent} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.8, paddingBottom: "1.25rem" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const studios = [
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
    desc: "Studio polyvalent idéal pour voix, podcasts, overdubs et mix. Neve 8078 vintage restauré. Monitoring Augspurger en field service.",
    features: ["Neve 8078 (vintage)", "Augspurger monitors", "Universal Audio Apollo 16", "Pro Tools HDX", "Vocal booth isolée (8 m²)", "Micros vintage Neumann U47"],
    color: "#f97316",
  },
  {
    name: "Studio C",
    size: "28 m²",
    desc: "Suite de production et mastering numérique. Idéal pour beatmakers, compositeurs et mastering. Monitoring de précision et outboard de mastering haut de gamme.",
    features: ["Dangerous Music Monitor ST", "Maselec MLA-2 compressor", "DAW : Ableton + Logic", "Plugin suite Waves Mercury", "Référence acoustique calibrée", "Accès autonome 24/7"],
    color: "#8b5cf6",
  },
];

const artists = [
  "Pomme", "Vianney", "Zaho de Sagazan", "Lomepal", "Julien Doré",
  "Clara Luciani", "Fishbach", "Pierre de Maere", "Bon Entendeur", "Caballero & JeanJass",
  "Roméo Elvis", "Angèle", "OrelSan", "Eddy de Pretto",
];

const gear = [
  { category: "Consoles", items: ["SSL 9000 J (Studio A)", "Neve 8078 (Studio B)", "SSL AWS 948 (Mix)"] },
  { category: "Microphones", items: ["Neumann U47, U67, U87", "AKG C12, C414", "Shure SM7B, SM57", "Coles 4038 ribbon", "RCA 77 DX vintage"] },
  { category: "Outboard", items: ["Neve 1073 × 8", "UA 1176LN × 4", "Fairchild 670 (vintage)", "Maselec MLA-2", "Pultec EQP-1A × 2"] },
  { category: "Monitoring", items: ["Augspurger (2-way)", "Genelec 1234A", "Yamaha NS-10M", "Avantone MixCubes", "Focal Trio11 Be"] },
  { category: "Instruments", items: ["Steinway D (Studio A)", "Hammond B3 + Leslie 122", "Gibson Les Paul 1959 (repro)", "Fender Strat 1964", "Moog Minimoog"] },
  { category: "Enregistrement", items: ["Pro Tools HDX × 3", "Logic Pro X", "Ableton Live Suite", "UAD Quad Core × 2", "Dante audio network"] },
];

const testimonials = [
  {
    name: "Julien Renard",
    role: "Producteur — JR Productions",
    text: "J'ai enregistré dans des studios à Los Angeles, Londres et Berlin. Echo Chamber est au même niveau. L'acoustique du Studio A est exceptionnelle. Je reviens pour chaque projet.",
    rating: 5,
    avatar: "JR",
  },
  {
    name: "Maeva Torres",
    role: "Artiste, label Sony Music",
    text: "L'équipe d'Echo Chamber a capturé quelque chose que les autres studios n'avaient pas réussi à saisir. Ils comprennent vraiment l'intention artistique. Mon album sonne incroyable.",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "DeeJay Phantom",
    role: "Producteur électronique",
    text: "Studio C pour le mastering. Résultat parfait en 2 sessions. Le monitoring Dangerous est une révélation — j'entends enfin les détails que je n'avais jamais perçus auparavant.",
    rating: 5,
    avatar: "DJ",
  },
];

const packages = [
  {
    name: "Demi-Journée",
    duration: "6h",
    price: "480",
    studio: "Studio B ou C",
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
    studio: "Studio A, B ou C",
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
  {
    q: "Comment réserver une session ?",
    a: "Contactez-nous par email ou téléphone pour vérifier les disponibilités. Un acompte de 30% confirme la réservation. Annulation sans frais jusqu'à 72h avant la session.",
  },
  {
    q: "Fournissez-vous un ingénieur du son ?",
    a: "Oui, un ingénieur expérimenté est inclus dans tous nos forfaits. Pour les packs Semaine, vous pouvez aussi amener votre propre ingénieur moyennant une réduction de 15%.",
  },
  {
    q: "Puis-je utiliser mon propre matériel ?",
    a: "Absolument. Nous avons un accès Dante pour intégrer du matériel externe. Vérifiez la compatibilité avec notre équipe technique en amont. Nous acceptons aussi les plugins tiers.",
  },
  {
    q: "Les sessions sont-elles enregistrées en multitrack ?",
    a: "Oui, toutes les sessions livrent les multitracks Pro Tools (BWF 48kHz/32bit) sur votre support ou via WeTransfer. La session est archivée 3 mois chez nous gratuitement.",
  },
  {
    q: "Proposez-vous du mastering ?",
    a: "Oui, notre Studio C est équipé pour le mastering analogique et numérique. Comptez 80€ par titre ou 250€ pour un EP (4 titres). Tarifs préférentiels pour les clients studio.",
  },
  {
    q: "Le studio est-il accessible la nuit ?",
    a: "Le Studio C dispose d'un accès autonome 24h/24, 7j/7. Les Studios A et B peuvent être réservés de nuit (22h–8h) avec tarif préférentiel de −20% sur présentation d'un projet.",
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function EchoChamberPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStudio, setActiveStudio] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Studios", href: "#studios" },
    { label: "Artistes", href: "#artistes" },
    { label: "Équipement", href: "#equipement" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? "0.75rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled ? "rgba(0,0,0,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.38s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: "8px",
              backgroundColor: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 16px ${C.accentGlow}`,
            }}
          >
            <Mic2 size={18} color={C.white} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.6rem", letterSpacing: "0.08em", color: C.white }}>
            ECHO CHAMBER
          </span>
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.85rem",
                color: C.textLight,
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textLight)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tarifs"
            style={{
              backgroundColor: C.accent,
              color: C.white,
              padding: "0.55rem 1.4rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.87rem",
              fontWeight: 700,
              fontFamily: C.bodyFont,
              boxShadow: `0 4px 16px ${C.accentGlow}`,
            }}
          >
            Réserver
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }} aria-label="Menu">
          {menuOpen ? <X color={C.white} size={24} /> : <Menu color={C.white} size={24} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: "fixed",
              top: 64, left: 0, right: 0,
              zIndex: 99,
              backgroundColor: "#080808",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: C.text, textDecoration: "none", fontSize: "1.05rem", fontFamily: C.bodyFont }}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          backgroundColor: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "5rem",
        }}
      >
        {/* Scan lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Red glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            backgroundColor: C.accent,
            filter: "blur(180px)",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 960, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}
        >
          {/* EQ bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}
          >
            <EQBars />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: "inline-block",
              backgroundColor: `${C.accent}18`,
              border: `1px solid ${C.accent}44`,
              color: C.accent,
              padding: "0.3rem 1rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              fontFamily: C.bodyFont,
            }}
          >
            Studio d'enregistrement professionnel — Paris 11e
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(4rem, 10vw, 9rem)",
              fontWeight: 400,
              color: C.white,
              lineHeight: 0.95,
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            ECHO<br />
            <span style={{ color: C.accent, WebkitTextStroke: "0px" }}>CHAMBER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.34 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.05rem",
              color: C.textLight,
              maxWidth: 540,
              margin: "0 auto 3rem",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
            }}
          >
            Trois studios indépendants. SSL, Neve, Pro Tools HDX. 200+ artistes enregistrés. Votre son mérite ce qu'il y a de mieux.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.48 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="#tarifs"
              style={{
                backgroundColor: C.accent,
                color: C.white,
                padding: "1rem 2.6rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: `0 8px 30px ${C.accentGlow}`,
                letterSpacing: "0.03em",
              }}
            >
              Réserver une session <ArrowRight size={16} />
            </a>
            <a
              href="#studios"
              style={{
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: "1rem 2.6rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 600,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
              }}
            >
              Visiter les studios
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.62 }}
            style={{ display: "flex", gap: "3.5rem", justifyContent: "center", marginTop: "4.5rem", flexWrap: "wrap" }}
          >
            {[
              { val: "3", label: "studios indépendants" },
              { val: "200+", label: "artistes enregistrés" },
              { val: "12 ans", label: "d'expérience" },
              { val: "24/7", label: "Studio C disponible" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "2rem", letterSpacing: "0.06em", color: C.accent }}>{s.val}</div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          <ChevronDown color={C.accent} size={28} opacity={0.6} />
        </motion.div>
      </section>

      {/* ── STUDIOS ── */}
      <section id="studios" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                Nos espaces
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>
                TROIS STUDIOS, UNE VISION
              </h2>
            </div>
          </SectionReveal>

          {/* Studio tabs */}
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1px" }}>
              {studios.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setActiveStudio(i)}
                  style={{
                    padding: "0.75rem 1.75rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: C.headingFont,
                    fontSize: "1.1rem",
                    letterSpacing: "0.08em",
                    color: activeStudio === i ? s.color : C.textMuted,
                    borderBottom: activeStudio === i ? `2px solid ${s.color}` : "2px solid transparent",
                    transition: "all 0.2s",
                    marginBottom: "-1px",
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudio}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: studios[activeStudio].color, letterSpacing: "0.04em" }}>
                    {studios[activeStudio].name}
                  </span>
                  <span
                    style={{
                      fontFamily: C.bodyFont,
                      fontSize: "0.8rem",
                      color: studios[activeStudio].color,
                      border: `1px solid ${studios[activeStudio].color}55`,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    {studios[activeStudio].size}
                  </span>
                </div>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.8, marginBottom: "2rem" }}>
                  {studios[activeStudio].desc}
                </p>
                <a
                  href="#tarifs"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: studios[activeStudio].color,
                    color: C.white,
                    padding: "0.8rem 1.8rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontFamily: C.bodyFont,
                    fontSize: "0.88rem",
                    boxShadow: `0 4px 20px ${studios[activeStudio].color}33`,
                  }}
                >
                  <Calendar size={15} /> Réserver {studios[activeStudio].name}
                </a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {studios[activeStudio].features.map((feat) => (
                  <div
                    key={feat}
                    style={{
                      backgroundColor: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: "8px",
                      padding: "0.8rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: studios[activeStudio].color, flexShrink: 0 }} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.text }}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── ARTISTS MARQUEE ── */}
      <section id="artistes" style={{ padding: "5rem 0", backgroundColor: C.bg, overflow: "hidden" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto 3rem", padding: "0 2rem" }}>
          <SectionReveal>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                Ils ont enregistré ici
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
            </div>
            <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0 0 2.5rem" }}>
              200+ ARTISTES ET PRODUCTEURS
            </h2>
          </SectionReveal>
        </div>
        <ArtistMarquee artists={artists} />
      </section>

      {/* ── GEAR ── */}
      <section id="equipement" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                Matériel
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>
                NOTRE ARSENAL
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {gear.map((g, i) => (
              <SectionReveal key={g.category} delay={i * 0.07}>
                <div
                  style={{
                    backgroundColor: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: "10px",
                    padding: "1.75rem",
                  }}
                >
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>
                    {g.category}
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {g.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontFamily: C.bodyFont,
                          fontSize: "0.87rem",
                          color: C.textLight,
                          padding: "0.4rem 0",
                          borderBottom: `1px solid ${C.border}`,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
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
      <section id="temoignages" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                Avis clients
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>
                ILS EN PARLENT
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    padding: "2.25rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.25rem" }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} color={C.accent} fill={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.8, flex: 1, fontStyle: "italic" }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                    <div
                      style={{
                        width: 44, height: 44,
                        borderRadius: "8px",
                        backgroundColor: C.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: C.headingFont,
                        fontSize: "1rem",
                        color: C.white,
                        letterSpacing: "0.04em",
                        flexShrink: 0,
                      }}
                    >
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
      <section id="tarifs" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                Tarifs
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>
                CHOISISSEZ VOTRE SESSION
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            {packages.map((pkg, i) => (
              <SectionReveal key={pkg.name} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: pkg.popular ? C.accent : pkg.color,
                    border: `1px solid ${pkg.border}`,
                    borderRadius: "12px",
                    padding: "2.25rem",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {pkg.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-13px",
                        right: "1.5rem",
                        backgroundColor: C.white,
                        color: C.accent,
                        padding: "0.25rem 0.85rem",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        fontFamily: C.bodyFont,
                        letterSpacing: "0.08em",
                      }}
                    >
                      LE PLUS DEMANDÉ
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <Clock size={14} color={pkg.popular ? C.white : C.accent} opacity={0.7} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, color: pkg.popular ? C.white : C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {pkg.duration}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", color: pkg.popular ? C.white : C.accentColor, letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    {pkg.name}
                  </h3>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: pkg.popular ? "rgba(255,255,255,0.7)" : C.textMuted, marginBottom: "1.25rem" }}>
                    {pkg.studio}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.02em" }}>
                      {pkg.price}€
                    </span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.72)" : C.textMuted, marginBottom: "2rem", lineHeight: 1.6 }}>
                    {pkg.desc}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.25rem", flex: 1 }}>
                    {pkg.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem" }}>
                        <Check size={14} color={pkg.popular ? C.white : C.accent} style={{ flexShrink: 0, marginTop: "0.18rem" }} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.85)" : C.textLight }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    style={{
                      display: "block",
                      textAlign: "center",
                      backgroundColor: pkg.popular ? C.white : C.accent,
                      color: pkg.popular ? C.accent : C.white,
                      padding: "0.9rem",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontFamily: C.bodyFont,
                      fontSize: "0.9rem",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Réserver cette session
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>
                FAQ
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>
                VOS QUESTIONS
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </SectionReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#050505", padding: "5rem 2.5rem 2.5rem", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.35rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${C.accentGlow}` }}>
                  <Mic2 size={18} color={C.white} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em" }}>ECHO CHAMBER</span>
              </div>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 290 }}>
                Studio d'enregistrement professionnel au cœur de Paris. SSL, Neve, Pro Tools HDX. Ouvert 7j/7.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <MapPin size={13} />, text: "47 rue Oberkampf, 75011 Paris" },
                  { icon: <Phone size={13} />, text: "+33 1 43 57 88 00" },
                  { icon: <Mail size={13} />, text: "booking@echochamber.fr" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Studios", links: ["Studio A — Flagship", "Studio B — Polyvalent", "Studio C — Production", "Visites virtuelles"] },
              { title: "Services", links: ["Enregistrement", "Mix & Mastering", "Production", "Podcast"] },
              { title: "Infos", links: ["Tarifs & réservation", "Équipement complet", "Accès & parking", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.08em", marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted }}>
              © 2026 Echo Chamber Studios SARL — SIRET 812 345 678 00012
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {["Mentions légales", "Confidentialité", "CGV"].map((l) => (
                <a key={l} href="#" style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
