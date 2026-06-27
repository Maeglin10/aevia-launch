"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Calendar,
  Menu,
  X,
  Users,
  Heart,
  Shield,
  Award,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { TemplateIcon } from '@/components/TemplateIcon';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#fafffe",
  bgLight: "#d8f3dc",
  bgSection: "#f2fbf5",
  text: "#1a3a2a",
  textMuted: "#4a7060",
  accent: "#2d6a4f",
  accentLight: "#d8f3dc",
  accentDark: "#1e4d38",
  sand: "#f4a261",
  sandLight: "#fef3e8",
  white: "#FFFFFF",
  border: "#b7d9c4",
  shadow: "0 4px 24px rgba(45,106,79,0.09)",
  shadowLg: "0 12px 48px rgba(45,106,79,0.16)",
};

const FONT = "'Nunito', system-ui, sans-serif";

// ─── Animated Paw SVG ─────────────────────────────────────────────────────────
function AnimatedPaw() {
  return (
    <motion.div
      style={{ position: "relative", width: 380, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glow */}
      <motion.div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bouncing paw SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        width={230}
        height={230}
        style={{ position: "relative", zIndex: 1 }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: "spring", stiffness: 120, damping: 10 }}
      >
        {/* Main pad */}
        <motion.ellipse
          cx="100" cy="130"
          rx="42" ry="38"
          fill={C.accent}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Toe pads */}
        <motion.circle cx="60" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.1 }} />
        <motion.circle cx="100" cy="68" r="24" fill={C.accent}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.25 }} />
        <motion.circle cx="140" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.15 }} />
        {/* Heart inside main pad */}
        <motion.path
          d="M100 115 C100 115, 86 100, 86 90 C86 84, 91 79, 100 88 C109 79, 114 84, 114 90 C114 100, 100 115, 100 115 Z"
          fill="rgba(255,255,255,0.85)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        />
      </motion.svg>

      {/* Floating badges */}
      <motion.div
        style={{
          position: "absolute", top: 24, right: 8,
          background: C.sand, color: C.white,
          borderRadius: 12, padding: "7px 15px",
          fontSize: 13, fontWeight: 800, fontFamily: FONT,
          boxShadow: "0 4px 16px rgba(244,162,97,0.4)", zIndex: 2,
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        Urgences 24h/7j
      </motion.div>
      <motion.div
        style={{
          position: "absolute", bottom: 36, left: 0,
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "9px 17px",
          fontSize: 13, fontWeight: 700, fontFamily: FONT,
          color: C.text, boxShadow: C.shadow, zIndex: 2,
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        4.8 / 5 — 2 400+ avis
      </motion.div>
    </motion.div>
  );
}

// ─── Pet Species Tabs ──────────────────────────────────────────────────────────
function PetTabs() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const species = [
    {
      label: "Chiens",
      emoji: "🐕",
      services: ["Vaccination annuelle", "Stérilisation", "Bilan santé senior", "Traitement antiparasitaire", "Chirurgie douce", "Dentisterie vétérinaire"],
    },
    {
      label: "Chats",
      emoji: "🐈",
      services: ["Primo-vaccination", "Identification puce", "Castration / Stérilisation", "Traitement leucose FIV", "Soins dermatologiques", "Gestion diabète félin"],
    },
    {
      label: "Exotiques",
      emoji: "🐇",
      services: ["Lapins & rongeurs", "Oiseaux & reptiles", "Poissons & tortues", "Examen complet", "Chirurgie spécialisée", "Alimentation conseils"],
    },
  ];

  return (
    <div ref={ref} style={{ fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}
      >
        {species.map((s, i) => (
          <motion.button
            key={s.label}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? C.accent : C.white,
              color: active === i ? C.white : C.text,
              border: `2px solid ${active === i ? C.accent : C.border}`,
              borderRadius: 30,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <TemplateIcon emoji={s.emoji} size={18} />
            {s.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {species[active].services.map((service) => (
            <div
              key={service}
              style={{
                background: C.white,
                borderRadius: 12,
                padding: "16px 20px",
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: C.shadow,
              }}
            >
              <CheckCircle size={16} color={C.accent} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{service}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Accueil", "Services", "Équipe", "Tarifs", "Contact"];

  return (
    <>
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 48px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(250,255,254,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease", fontFamily: FONT,
        }}
      >
        <motion.div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} whileHover={{ scale: 1.03 }}>
          <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TemplateIcon emoji="🐾" size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>
            Paw<span style={{ color: C.accent }}>Care</span>
          </span>
        </motion.div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <motion.a key={link} href="/templates/impact-32" style={{ color: C.text, fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ color: C.accent }} transition={{ duration: 0.15 }}>
              {link}
            </motion.a>
          ))}
          <motion.button
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Prendre RDV
          </motion.button>
        </div>

        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.text }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, padding: "24px 48px", borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow, fontFamily: FONT }}
          >
            {links.map((link) => (
              <a key={link} href="/templates/impact-32" style={{ display: "block", padding: "12px 0", color: C.text, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        background: `linear-gradient(140deg, ${C.bg} 0%, ${C.accentLight} 100%)`,
        display: "flex", alignItems: "center",
        padding: "100px 80px 60px",
        position: "relative", overflow: "hidden", fontFamily: FONT,
      }}
    >
      {/* Bg deco */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 68%)`, opacity: 0.5, pointerEvents: "none" }} />

      {/* Left text */}
      <motion.div style={{ flex: 1, maxWidth: 580, position: "relative", zIndex: 1, y: textY, opacity: textOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.accent}`, borderRadius: 20, padding: "7px 16px", marginBottom: 24 }}
        >
          <Shield size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>Clinique vétérinaire agréée CNOV</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24 }}
        >
          Vos animaux méritent{" "}
          <span style={{ color: C.accent }}>le meilleur soin</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.72, marginBottom: 36, maxWidth: 490 }}
        >
          PawCare Clinic, c'est une équipe de vétérinaires passionnés à Bordeaux, dédiée à la
          santé et au bonheur de vos compagnons à poils, plumes ou écailles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
        >
          <motion.button
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Calendar size={18} /> Prendre rendez-vous
          </motion.button>
          <motion.button
            style={{ background: C.sandLight, color: C.sand, border: `2px solid ${C.sand}`, borderRadius: 10, padding: "14px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Phone size={16} /> Urgences 24h
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
          {[{ value: "3 500+", label: "Animaux soignés" }, { value: "4.8★", label: "Note Google" }, { value: "20 ans", label: "D'expertise" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: paw */}
      <motion.div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <AnimatedPaw />
      </motion.div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: <Stethoscope size={26} color="#2d6a4f" />, title: "Consultations", desc: "Bilan de santé complet, suivi régulier et prévention pour votre animal.", tag: "Essentiel" },
  { icon: <Syringe size={26} color="#2d6a4f" />, title: "Vaccinations", desc: "Protocoles vaccinaux adaptés à chaque espèce et mode de vie.", tag: "Prévention" },
  { icon: <Shield size={26} color="#2d6a4f" />, title: "Chirurgie", desc: "Chirurgie douce avec anesthésie sécurisée et monitoring cardiaque.", tag: "Spécialisé" },
  { icon: <Heart size={26} color="#2d6a4f" />, title: "Cardiologie", desc: "Échographie cardiaque et suivi des pathologies cardiovasculaires.", tag: "Expert" },
  { icon: <Award size={26} color="#2d6a4f" />, title: "Dermatologie", desc: "Diagnostic et traitement des affections cutanées chroniques.", tag: "Spécialisé" },
  { icon: <Users size={26} color="#2d6a4f" />, title: "Urgences 24h/7j", desc: "Équipe d'astreinte pour les urgences vitales, 24h/24, 7j/7.", tag: "Urgent", urgent: true },
];

function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="services" ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Nos services
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Des soins adaptés à chaque animal
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Technologies de pointe, équipe bienveillante — pour que votre compagnon soit entre les meilleures mains.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto 60px" }}>
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: (s as any).urgent ? C.text : C.white,
              borderRadius: 18,
              padding: "28px 26px",
              border: `1px solid ${(s as any).urgent ? C.text : C.border}`,
              boxShadow: C.shadow,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 16, background: (s as any).urgent ? C.sand : C.accentLight, color: (s as any).urgent ? C.white : C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
              {s.tag}
            </div>
            <div style={{ width: 52, height: 52, background: (s as any).urgent ? "rgba(255,255,255,0.12)" : C.accentLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              {(s as any).urgent ? <Heart size={26} color="#fff" /> : s.icon}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: (s as any).urgent ? C.white : C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: (s as any).urgent ? "rgba(255,255,255,0.7)" : C.textMuted, lineHeight: 1.65 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Pet species tabs */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
        <h3 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 32 }}>
          Soins par espèce
        </h3>
        <PetTabs />
      </motion.div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { value: "3 500+", label: "Animaux soignés / an", icon: "🐾" },
    { value: "4.8/5", label: "Note Google Maps", icon: "⭐" },
    { value: "20 ans", label: "D'expertise vétérinaire", icon: "🏆" },
    { value: "24h/7j", label: "Service urgences", icon: "🚨" },
  ];

  return (
    <section
      ref={ref}
      style={{ padding: "90px 80px", background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`, fontFamily: FONT }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.icon} size={36} /></div>
            <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, color: C.white, letterSpacing: -1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Dr. Marie Fontaine", role: "Vétérinaire généraliste", specialty: "Chiens & chats, chirurgie douce", exp: "14 ans", initials: "MF", color: C.accent },
  { name: "Dr. Pierre Leroy", role: "Vétérinaire spécialisé", specialty: "Cardiologie & imagerie médicale", exp: "10 ans", initials: "PL", color: "#4a7aa0" },
  { name: "Dr. Nadia Sall", role: "Vétérinaire exotiques", specialty: "NAC — oiseaux, reptiles, rongeurs", exp: "8 ans", initials: "NS", color: "#7a5ea0" },
];

function Team() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="team" ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Notre équipe
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des vétérinaires passionnés
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 960, margin: "0 auto" }}>
        {TEAM.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 20, padding: 32, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: doc.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, fontWeight: 800, color: C.white, letterSpacing: 1 }}>
              {doc.initials}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 700, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div style={{ display: "inline-block", background: C.accentLight, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: C.accent }}>
              {doc.exp} d'expérience
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Julie & Max (Border Collie)", text: "L'équipe PawCare a sauvé la vie de Max lors d'une urgence nocturne. Réactivité exemplaire, soins impeccables. Nous ne changerons jamais de clinique.", stars: 5 },
  { name: "Antoine & ses 2 chats", text: "Dr. Fontaine est une perle. Elle prend le temps d'expliquer chaque diagnostic, elle est douce avec les chats et toujours disponible pour répondre à nos questions.", stars: 5 },
  { name: "Léa & Noisette (lapin)", text: "Difficile de trouver un vétérinaire pour les lapins. Dr. Sall est une vraie spécialiste NAC — Noisette est en parfaite santé grâce à elle !", stars: 5 },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Témoignages
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des propriétaires heureux
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => (<Star key={k} size={14} color="#f59e0b" fill="#f59e0b" />))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.accent }}>— {t.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Basic Care",
    price: "25",
    period: "/ consultation",
    desc: "Pour les soins courants et le suivi préventif.",
    features: ["Consultation vétérinaire", "Déparasitage interne", "Conseils nutrition", "Carnet de santé digital", "Devis gratuit"],
    cta: "Prendre RDV",
    highlight: false,
    emoji: "🐾",
  },
  {
    name: "Complete Care",
    price: "89",
    period: "/ mois",
    desc: "La formule tout-inclus pour un suivi serein.",
    features: ["Consultations illimitées", "Vaccinations annuelles", "Bilan sanguin semestriel", "Détartrage dentaire", "Urgences prioritaires", "Application suivi santé"],
    cta: "S'abonner",
    highlight: true,
    emoji: "⭐",
  },
  {
    name: "Premium Care",
    price: "149",
    period: "/ mois",
    desc: "Le meilleur pour les animaux qui méritent tout.",
    features: ["Tout Complete Care", "Chirurgies incluses (hors implants)", "Suivi nutritionnel personnalisé", "Téléconsultation 7j/7", "Assurance accidents incluse", "Livraison médicaments"],
    cta: "Choisir Premium",
    highlight: false,
    emoji: "💎",
  },
];

function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="pricing" ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Tarifs
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Plans de soins transparents
        </h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>Remboursement assurance animaux partenaires — Sans engagement</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 980, margin: "0 auto", alignItems: "start" }}>
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{
              background: p.highlight ? C.text : C.bgSection,
              borderRadius: 24, padding: "38px 32px",
              border: p.highlight ? "none" : `1.5px solid ${C.border}`,
              boxShadow: p.highlight ? C.shadowLg : C.shadow,
              position: "relative", overflow: "hidden",
            }}
          >
            {p.highlight && (
              <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, #52b788)` }} />
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
                  Le plus choisi
                </div>
              </>
            )}
            <div style={{ marginBottom: 14 }}><TemplateIcon emoji={p.emoji} size={28} /></div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>{p.desc}</p>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: p.highlight ? C.white : C.text, letterSpacing: -1 }}>€{p.price}</span>
              <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>{p.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 11 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={p.highlight ? C.sand : C.accent} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button
              style={{ width: "100%", background: p.highlight ? C.accent : "transparent", color: p.highlight ? C.white : C.text, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
              whileHover={{ background: p.highlight ? C.accentDark : C.accentLight, borderColor: C.accent, color: p.highlight ? C.white : C.accent, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Comment prendre rendez-vous en urgence ?", a: "Appelez directement notre ligne urgences au 05 56 78 90 12, disponible 24h/24 et 7j/7. Pour les urgences vitales, notre équipe d'astreinte intervient en moins de 30 minutes." },
  { q: "Acceptez-vous les animaux exotiques (lapins, oiseaux, reptiles) ?", a: "Oui ! Dr. Nadia Sall est spécialisée NAC (Nouveaux Animaux de Compagnie). Elle reçoit lapins, cobayes, oiseaux, reptiles et poissons du lundi au vendredi sur rendez-vous." },
  { q: "Travaillez-vous avec les assurances animaux ?", a: "Nous collaborons avec les principaux assureurs vétérinaires : Agria, Santévet, Assur O'Poil et April. Nous émettons les factures dans le format requis pour vos remboursements." },
  { q: "Proposez-vous la téléconsultation ?", a: "Oui, la téléconsultation est disponible pour les abonnés Complete Care et Premium Care. Idéale pour les questions de suivi, l'interprétation de résultats ou les conseils comportementaux." },
  { q: "Quelle est la durée d'une consultation standard ?", a: "Une consultation standard dure entre 20 et 30 minutes. Les consultations spécialisées (cardiologie, dermatologie) peuvent durer jusqu'à 45 minutes. Nous ne consultons jamais en flux tendu." },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          FAQ
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Questions fréquentes
        </h2>
      </motion.div>

      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><TemplateIcon emoji="🐾" size={20} color="#fff" /></div>
            <span style={{ fontWeight: 800, fontSize: 20 }}>PawCare Clinic</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
            Clinique vétérinaire bienveillante à Bordeaux. Parce que votre animal mérite les mêmes soins d'excellence que vous.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <Phone size={15} />, text: "05 56 78 90 12" },
              { icon: <Mail size={15} />, text: "contact@pawcare-bordeaux.fr" },
              { icon: <MapPin size={15} />, text: "15 Cours de l'Intendance, 33000 Bordeaux" },
              { icon: <Clock size={15} />, text: "Lun–Sam 8h–20h | Urgences 24h/7j" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                <span style={{ color: C.sand }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
        {[
          { title: "Services", links: ["Consultations", "Vaccinations", "Chirurgie", "Urgences", "Exotiques"] },
          { title: "Clinique", links: ["Notre équipe", "Nos valeurs", "Tarifs", "Actualités"] },
          { title: "Pratique", links: ["Rendez-vous", "Téléconsultation", "Accès", "Assurances"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((link) => (<a key={link} href="/templates/impact-32" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none" }}>{link}</a>))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2025 PawCare Clinic. Tous droits réservés.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Mentions légales", "Confidentialité", "RGPD"].map((link) => (<a key={link} href="/templates/impact-32" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>{link}</a>))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function Impact32() {
  return (
    <main style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <Team />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
