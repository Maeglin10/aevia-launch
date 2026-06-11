"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Shield,
  Award,
  Heart,
  Smile,
  CheckCircle,
  Calendar,
  Menu,
  X,
  Users,
  ThumbsUp,
  Activity,
  Calculator,
  FileText
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  bgLight: "#e8f4fd",
  bgSection: "#f8fcff",
  text: "#1a2744",
  textMuted: "#5a6a8a",
  accent: "#00b894",
  accentDark: "#00a381",
  accentLight: "#e0f9f4",
  white: "#FFFFFF",
  border: "#dce9f5",
  shadow: "0 4px 24px rgba(26,39,68,0.08)",
  shadowLg: "0 12px 48px rgba(26,39,68,0.14)",
  whiteTrans: "rgba(255, 255, 255, 0.95)",
};

const FONT = "'Inter', system-ui, sans-serif";

type ActivePage = "home" | "soins" | "pricing" | "team" | "legal";

// ─── Animated Tooth SVG ───────────────────────────────────────────────────────
function AnimatedTooth() {
  return (
    <motion.div
      style={{ position: "relative", width: 320, height: 360 }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Glow pulse ring */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`,
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating tooth SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        width={200}
        height={240}
        style={{ position: "relative", zIndex: 1, margin: "0 auto", display: "block" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M100 18 C58 18, 28 44, 26 82 C24 112, 34 134, 39 162 C44 188, 47 218, 60 227 C70 235, 81 221, 88 200 C94 184, 100 170, 100 170 C100 170, 106 184, 112 200 C119 221, 130 235, 140 227 C153 218, 156 188, 161 162 C166 134, 176 112, 174 82 C172 44, 142 18, 100 18 Z"
          fill={C.white}
          stroke={C.accent}
          strokeWidth={3.5}
          filter="drop-shadow(0 10px 28px rgba(0,184,148,0.28))"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <motion.path
          d="M80 170 C78 190, 74 210, 68 222 M120 170 C122 190, 126 210, 132 222"
          fill="none"
          stroke={`${C.accent}40`}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <motion.path
          d="M72 42 C65 57, 62 78, 66 98"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <motion.path
          d="M80 128 L95 146 L122 112"
          fill="none"
          stroke={C.accent}
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.2 }}
        />
      </motion.svg>

      <motion.div
        style={{
          position: "absolute",
          top: 18,
          right: 8,
          background: C.accent,
          color: C.white,
          borderRadius: 12,
          padding: "7px 15px",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: FONT,
          boxShadow: "0 4px 16px rgba(0,184,148,0.38)",
          zIndex: 2,
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        Agréé ARS
      </motion.div>
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, goTo }: { page: ActivePage; goTo: (p: ActivePage) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Accueil", id: "home" as const },
    { label: "Soins", id: "soins" as const },
    { label: "Tarifs & Remboursement", id: "pricing" as const },
    { label: "L'Équipe", id: "team" as const },
  ];

  return (
    <>
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT,
        }}
      >
        {/* Logo */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => goTo("home")}
          whileHover={{ scale: 1.03 }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              background: C.accent,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Smile size={22} color={C.white} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>
            Smile<span style={{ color: C.accent }}>Studio</span>
          </span>
        </motion.div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              style={{
                color: page === link.id ? C.accent : C.text,
                fontWeight: 600,
                fontSize: 15,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (page !== "home") goTo("home");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 150);
            }}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Calendar size={16} />
            Prendre RDV
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.text,
          }}
          className="md:hidden block"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              zIndex: 99,
              background: C.white,
              padding: "24px 48px",
              borderBottom: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              fontFamily: FONT,
            }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMenuOpen(false);
                  goTo(link.id);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 0",
                  color: page === link.id ? C.accent : C.text,
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                if (page !== "home") goTo("home");
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                marginTop: 18,
                padding: "12px",
                background: C.accent,
                color: C.white,
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Prendre RDV en ligne
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ goTo }: { goTo: (p: ActivePage) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        background: `linear-gradient(140deg, ${C.bg} 0%, ${C.bgLight} 100%)`,
        display: "flex",
        alignItems: "center",
        padding: "100px 80px 60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 68%)`,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      {/* Left column: text */}
      <motion.div
        style={{ flex: 1, maxWidth: 580, position: "relative", zIndex: 1, y: textY, opacity: textOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: C.accentLight,
            border: `1px solid ${C.accent}`,
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
          }}
        >
          <Shield size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
            Cabinet agréé ARS Île-de-France
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(36px, 4vw, 58px)",
            fontWeight: 800,
            color: C.text,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            marginBottom: 24,
          }}
        >
          Votre sourire, <span style={{ color: C.accent }}>notre passion</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 18,
            color: C.textMuted,
            lineHeight: 1.72,
            marginBottom: 38,
            maxWidth: 490,
          }}
        >
          Smile Studio est le cabinet dentaire de référence à Paris 8e. Soins de pointe,
          technologies dernière génération et équipe bienveillante pour des résultats
          qui transforment votre vie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
        >
          <motion.button
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "16px 32px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT,
            }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Calendar size={18} />
            Prendre rendez-vous
          </motion.button>
          <motion.button
            onClick={() => goTo("soins")}
            style={{
              background: "transparent",
              color: C.text,
              border: `2px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT,
            }}
            whileHover={{ borderColor: C.accent, color: C.accent, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Découvrir nos soins <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", gap: 36 }}
        >
          {[
            { value: "15+", label: "Ans d'expertise" },
            { value: "4.9★", label: "Note Google" },
            { value: "12 000+", label: "Patients" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right column: tooth */}
      <motion.div
        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex"
      >
        <AnimatedTooth />
      </motion.div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <Smile size={28} color="#00b894" />,
    title: "Blanchiment dentaire",
    desc: "Technologie Zoom! pour un résultat jusqu'à 8 teintes plus blanc en une seule séance.",
    price: "À partir de 350 €",
    tag: "Populaire",
  },
  {
    icon: <Shield size={28} color="#00b894" />,
    title: "Implants dentaires",
    desc: "Remplacement naturel et durable de vos dents manquantes avec une garantie 10 ans.",
    price: "À partir de 1 200 €",
    tag: "Premium",
  },
  {
    icon: <Star size={28} color="#00b894" />,
    title: "Orthodontie Invisalign",
    desc: "Aligneurs transparents discrets pour corriger votre sourire sans bagues metalliques.",
    price: "À partir de 2 800 €",
    tag: "Invisible",
  },
  {
    icon: <Heart size={28} color="#00b894" />,
    title: "Soins pédiatriques",
    desc: "Cabinet dédié enfants, soins préventifs et éducation bucco-dentaire dès 3 ans.",
    price: "À partir de 45 €",
    tag: "Famille",
  },
];

function Services({ goTo }: { goTo: (p: ActivePage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Nos soins
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          Des traitements d'excellence
        </h2>
        <p style={{ fontSize: 18, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Chaque soin est réalisé avec les technologies les plus récentes pour votre confort maximal.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto 48px",
        }}
      >
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            onClick={() => goTo("soins")}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -8, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: 32,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "box-shadow 0.25s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: C.accentLight,
                color: C.accent,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {s.tag}
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                background: C.accentLight,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              {s.icon}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65, marginBottom: 22 }}>
              {s.desc}
            </p>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 16 }}>{s.price}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => goTo("soins")}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Consulter le catalogue clinique complet <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "12 000+", label: "Patients satisfaits", icon: <Users size={24} color="#fff" /> },
  { value: "4.9 / 5", label: "Note moyenne Google", icon: <Star size={24} color="#fff" /> },
  { value: "15 ans", label: "D'expérience", icon: <Award size={24} color="#fff" /> },
  { value: "98 %", label: "Taux de satisfaction", icon: <ThumbsUp size={24} color="#fff" /> },
];

function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "90px 80px",
        background: `linear-gradient(135deg, ${C.text} 0%, #253b6e 100%)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 40,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                background: "rgba(0,184,148,0.22)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              {s.icon}
            </div>
            <div
              style={{
                fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 900,
                color: C.white,
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Sophie M.",
    treatment: "Blanchiment + Facettes",
    before: "Je n'osais plus sourire à cause de mes dents jaunies depuis des années.",
    after: "Résultat incroyable ! 8 teintes plus blanc. Je souris à nouveau en toute confiance. L'équipe est d'une gentillesse exceptionnelle.",
    stars: 5,
    date: "Mars 2025",
  },
  {
    name: "Thomas B.",
    treatment: "Implant dentaire",
    before: "J'avois perdu une dent depuis 3 ans et j'en étais très complexé au quotidien.",
    after: "L'implant est posé depuis 6 mois — aucune différence avec mes vraies dents. Dr. Laurent est tout simplement exceptionnelle !",
    stars: 5,
    date: "Janvier 2025",
  },
  {
    name: "Amina K.",
    treatment: "Aligneurs Invisalign",
    before: "Mes dents chevauchaient et j'évitais de sourire sur toutes les photos.",
    after: "18 mois de traitement et mon sourire est parfaitement aligné. Les gouttières sont vraiment très discrètes.",
    stars: 5,
    date: "Décembre 2024",
  },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Témoignages
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1,
          }}
        >
          Avant / Après — Ils nous font confiance
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            style={{
              background: C.bgSection,
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            {/* Before */}
            <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${C.border}`, background: "#fff8f8" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#d46060", letterSpacing: 1, marginBottom: 8 }}>
                Avant
              </div>
              <p style={{ color: C.textMuted, fontSize: 14, fontStyle: "italic", lineHeight: 1.65 }}>
                "{t.before}"
              </p>
            </div>
            {/* After */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.accent, letterSpacing: 1, marginBottom: 8 }}>
                Après
              </div>
              <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                "{t.after}"
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{t.treatment}</div>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                    {Array.from({ length: t.stars }).map((_, k) => (
                      <Star key={k} size={13} color="#f59e0b" fill="#f59e0b" />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted, textAlign: "right" }}>{t.date}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Dr. Claire Laurent", role: "Chirurgienne-dentiste", specialty: "Implantologie & Chirurgie orale", experience: "18 ans", initials: "CL", color: "#4a90d9" },
  { name: "Dr. Marc Dupont", role: "Orthodontiste", specialty: "Aligneurs Invisalign certifié Diamond", experience: "12 ans", initials: "MD", color: "#7c3aed" },
  { name: "Dr. Sofia Ramirez", role: "Chirurgienne-dentiste", specialty: "Esthétique dentaire & Blanchiment", experience: "9 ans", initials: "SR", color: "#00b894" },
];

function Team({ goTo }: { goTo: (p: ActivePage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="team"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Notre équipe
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des experts à votre service
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          maxWidth: 920,
          margin: "0 auto 48px",
        }}
      >
        {TEAM.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: doc.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 24,
                fontWeight: 800,
                color: C.white,
                letterSpacing: 1,
              }}
            >
              {doc.initials}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div
              style={{
                display: "inline-block",
                background: C.bgLight,
                borderRadius: 20,
                padding: "5px 15px",
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {doc.experience} d'expérience
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => goTo("team")}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Voir les biographies de nos praticiens <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Essentiel",
    price: "45",
    period: "/ consultation",
    desc: "Pour un bilan complet et les soins courants du quotidien.",
    features: ["Bilan bucco-dentaire complet", "Détartrage professionnel", "Radiographie panoramique", "Conseils hygiène personnalisés", "Devis gratuit sous 24h"],
    cta: "Prendre RDV",
    highlight: false,
  },
  {
    name: "Sourire",
    price: "350",
    period: "traitement complet",
    desc: "Pour un sourire éclatant et parfaitement entretenu.",
    features: ["Tout le plan Essentiel", "Blanchiment Zoom! professionnel", "Polissage dentaire intensif", "Kit d'entretien domicile inclus", "Suivi 6 mois inclus", "Garantie résultat"],
    cta: "Choisir ce plan",
    highlight: true,
  },
  {
    name: "Premium",
    price: "Sur Devis",
    period: "traitement sur mesure",
    desc: "Pour les transformations complètes et l'implantologie avancée.",
    features: ["Tout le plan Sourire", "Implants dentaires Straumann", "Facettes céramiques Emax", "Orthodontie Invisalign Diamond", "Suivi illimité 2 ans", "Financement 0 % disponible"],
    cta: "Demander un devis",
    highlight: false,
  },
];

function Pricing({ goTo }: { goTo: (p: ActivePage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="pricing"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Tarifs
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Des prix transparents
        </h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>
          Remboursement Sécurité Sociale & mutuelles — Financement possible
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          maxWidth: 980,
          margin: "0 auto 48px",
          alignItems: "start",
        }}
      >
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{
              background: p.highlight ? C.text : C.white,
              borderRadius: 24,
              padding: "38px 32px",
              border: p.highlight ? "none" : `2px solid ${C.border}`,
              boxShadow: p.highlight ? C.shadowLg : C.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {p.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${C.accent}, #00e0b5)`,
                }}
              />
            )}
            {p.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: C.accent,
                  color: C.white,
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Le plus choisi
              </div>
            )}
            <h3 style={{ fontSize: 20, fontWeight: 700, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>
              {p.name}
            </h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>
              {p.desc}
            </p>
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  fontSize: p.price.includes("Devis") || p.price.includes("Sur") ? 26 : 40,
                  fontWeight: 900,
                  color: p.highlight ? C.white : C.text,
                  letterSpacing: -1,
                }}
              >
                {p.price.includes("Devis") || p.price.includes("Sur") ? p.price : `€${p.price}`}
              </span>
              {!p.price.includes("Devis") && !p.price.includes("Sur") && (
                <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>
                  {p.period}
                </span>
              )}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 11 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={C.accent} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button
              onClick={() => {
                if (p.cta === "Demander un devis" || p.cta === "Choisir ce plan") {
                  goTo("pricing");
                } else {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{
                width: "100%",
                background: p.highlight ? C.accent : "transparent",
                color: p.highlight ? C.white : C.text,
                border: p.highlight ? "none" : `2px solid ${C.border}`,
                borderRadius: 10,
                padding: "14px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
              }}
              whileHover={{
                background: p.highlight ? C.accentDark : C.accentLight,
                borderColor: C.accent,
                color: p.highlight ? C.white : C.accent,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => goTo("pricing")}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Accéder au simulateur de remboursement mutuelle <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Le blanchiment dentaire est-il remboursé par la Sécurité Sociale ?",
    a: "Non, le blanchiment esthétique n'est pas pris en charge par la Sécurité Sociale. Certaines mutuelles offrent cependant une prise en charge partielle. Nous vous fournissons un devis détaillé et proposons des solutions de financement adaptées.",
  },
  {
    q: "Combien de temps dure un traitement Invisalign ?",
    a: "La durée varie selon la complexité du cas, de 6 à 24 mois en moyenne. Lors de votre consultation initiale gratuite, le Dr. Dupont établira un plan de traitement personnalisé avec une estimation précise.",
  },
  {
    q: "Les implants dentaires sont-ils douloureux ?",
    a: "La pose d'implants se fait sous anesthésie locale — vous ne ressentirez aucune douleur pendant l'intervention. Des suites légères (gonflements, sensibilités) sont normales les 2-3 premiers jours, gérables avec des antidouleurs classiques.",
  },
  {
    q: "À quelle fréquence consulter un dentiste ?",
    a: "Nous recommandons une visite de contrôle tous les 6 mois. Un détartrage professionnel est recommandé au minimum une fois par an, voire deux fois selon votre situation bucco-dentaire.",
  },
  {
    q: "Acceptez-vous les urgences dentaires ?",
    a: "Oui, nous réservons des créneaux d'urgence chaque jour. En cas de douleur aiguë ou de traumatisme, appelez-nous au 01 42 56 78 90 — nous vous prendrons en charge dans les plus brefs délais.",
  },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
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
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              background: C.white,
              borderRadius: 14,
              border: `1px solid ${open === i ? C.accent : C.border}`,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                padding: "20px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                fontFamily: FONT,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ flexShrink: 0 }}
              >
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>
                    {faq.a}
                  </div>
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
function Footer({ goTo }: { goTo: (p: ActivePage) => void }) {
  return (
    <footer
      id="contact"
      style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 48,
          marginBottom: 52,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smile size={22} color={C.white} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20 }}>SmileStudio</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
            Cabinet dentaire d'excellence au cœur de Paris 8e. Soins de pointe, équipe bienveillante et résultats qui transforment votre sourire.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <Phone size={15} />, text: "01 42 56 78 90" },
              { icon: <Mail size={15} />, text: "contact@smilestudio.paris" },
              { icon: <MapPin size={15} />, text: "42 Av. des Champs-Élysées, 75008 Paris" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {[
          { title: "Soins Cliniques", links: [
            { label: "Blanchiment dentaire", id: "soins" as const },
            { label: "Implants dentaires", id: "soins" as const },
            { label: "Orthodontie Invisalign", id: "soins" as const },
            { label: "Soins pédiatriques", id: "soins" as const }
          ]},
          { title: "Le Cabinet", links: [
            { label: "Notre équipe", id: "team" as const },
            { label: "Tarifs transparents", id: "pricing" as const },
            { label: "Simulateur mutuelle", id: "pricing" as const },
          ]},
          { title: "Pratique", links: [
            { label: "Accueil", id: "home" as const },
            { label: "Mentions légales", id: "legal" as const },
          ]},
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {col.title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((link) => (
                <button 
                  key={link.label} 
                  onClick={() => goTo(link.id)} 
                  style={{ 
                    color: "rgba(255,255,255,0.55)", 
                    fontSize: 14, 
                    background: "none", 
                    border: "none", 
                    textAlign: "left", 
                    cursor: "pointer", 
                    fontFamily: FONT,
                    padding: 0
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2026 Smile Studio. Tous droits réservés.</p>
        <div style={{ display: "flex", gap: 20 }}>
          <button onClick={() => goTo("legal")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.38)", fontSize: 13, cursor: "pointer", fontFamily: FONT }}>Mentions légales</button>
          <button onClick={() => goTo("legal")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.38)", fontSize: 13, cursor: "pointer", fontFamily: FONT }}>Confidentialité</button>
        </div>
      </div>
    </footer>
  );
}

// ─── Subpage: Soins ───────────────────────────────────────────────────────────
function SoinsPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  const specialties = [
    {
      title: "Blanchiment dentaire Zoom!",
      tech: "Lampe LED Philips Zoom! WhiteSpeed",
      details: "Le traitement de blanchiment au fauteuil Philips Zoom! est cliniquement prouvé pour blanchir vos dents jusqu'à 8 teintes en une seule séance de 45 minutes. C'est le procédé de blanchiment le plus demandé au monde, alliant rapidité et sécurité absolue pour l'émail.",
      advantages: [
        "Jusqu'à 8 teintes gagnées en une séance",
        "Formule brevetée limitant la sensibilité post-traitement",
        "Supervisé entièrement par un chirurgien-dentiste certifié",
        "Polissage final protecteur inclus"
      ],
      price: "350 €"
    },
    {
      title: "Implants dentaires Straumann",
      tech: "Titane Grade 4 & Céramique Emax",
      details: "Nous utilisons exclusivement les implants suisses Straumann, leaders mondiaux de l'implantologie. Posé sous anesthésie locale, l'implant remplace la racine naturelle manquante et s'intègre parfaitement à l'os (ostéointégration) pour accueillir une couronne céramique esthétique.",
      advantages: [
        "Matériaux biocompatibles haute durabilité",
        "Garantie internationale Straumann de 10 ans",
        "Remplacement fixe et invisible au quotidien",
        "Préservation de la structure osseuse maxillaire"
      ],
      price: "À partir de 1 200 €"
    },
    {
      title: "Orthodontie Invisible Invisalign",
      tech: "Scanner 3D iTero & Aligneurs SmartTrack",
      details: "Invisalign utilise des séries de gouttières transparentes amovibles et sur mesure pour déplacer vos dents en douceur. Pratiquement invisibles, elles se retirent facilement pour manger et se brosser les dents, offrant une alternative esthétique idéale aux bagues métalliques.",
      advantages: [
        "Gouttières translucides très discrètes",
        "Amovibles pour une hygiène bucco-dentaire impeccable",
        "Visualisation 3D du résultat final avant de commencer",
        "Rendez-vous de contrôle simplifiés toutes les 6 à 8 semaines"
      ],
      price: "À partir de 2 800 €"
    },
    {
      title: "Facettes Céramiques Emax",
      tech: "Porcelaine feldspathique Emax pressée",
      details: "Les facettes Emax sont de fines pellicules de céramique collées sur la face visible des dents antérieures. Elles permettent de corriger instantanément les défauts de forme, d'alignement, d'espacement (diastèmes) ou de coloration rebelle, pour un sourire harmonieux sur mesure.",
      advantages: [
        "Rendu ultra-naturel avec translucidité de l'émail",
        "Haute résistance aux taches de café, thé ou tabac",
        "Préparation dentaire ultra-conservatrice (a minima)",
        "Durée de vie supérieure à 15 ans avec une bonne hygiène"
      ],
      price: "À partir de 800 € / dent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 32, marginBottom: 48 }}>
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Catalogue Clinique</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            Nos Soins Spécialisés & Technologies
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Découvrez nos spécialités en dentisterie esthétique et restauratrice. Nous appliquons des protocoles rigoureux avec des équipements certifiés.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {specialties.map((s, idx) => (
            <div key={s.title} style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="lg:grid-cols-12 border-b border-gray-100 pb-12">
              <div className="lg:col-span-5">
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, background: C.accentLight, padding: "5px 12px", borderRadius: 12 }}>
                  {s.tech}
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginTop: 16, marginBottom: 16 }}>
                  {s.title}
                </h3>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>
                  {s.price}
                </div>
                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    marginTop: 24,
                    background: C.accent,
                    color: C.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: FONT
                  }}
                >
                  Prendre rendez-vous
                </button>
              </div>

              <div className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-[#dce9f5]">
                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, marginBottom: 12 }}>Détails Cliniques</h4>
                <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
                  {s.details}
                </p>

                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, marginBottom: 12 }}>Avantages Clés</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {s.advantages.map((adv) => (
                    <div key={adv} style={{ display: "flex", gap: 8, alignItems: "start", fontSize: 13, color: C.text, fontWeight: 500 }}>
                      <CheckCircle size={16} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Subpage: Pricing & Simulator ────────────────────────────────────────────
function PricingPage() {
  const [proc, setProc] = useState("Consultation");
  const [mutuelle, setMutuelle] = useState("100"); // 100%, 200%, 300%, 0 (none)

  const procedures = [
    { name: "Consultation", cost: 23, baseSecu: 23, rateSecu: 0.70, desc: "Bilan bucco-dentaire annuel de contrôle." },
    { name: "Détartrage", cost: 43.38, baseSecu: 43.38, rateSecu: 0.70, desc: "Détartrage professionnel des arcades supérieure et inférieure." },
    { name: "Blanchiment Zoom!", cost: 350, baseSecu: 0, rateSecu: 0, desc: "Blanchiment esthétique au fauteuil (non remboursé par la Sécurité Sociale)." },
    { name: "Facette céramique Emax", cost: 800, baseSecu: 0, rateSecu: 0, desc: "Facette esthétique unitaire en porcelaine (non remboursée par la Sécurité Sociale)." },
    { name: "Implant dentaire complet", cost: 1800, baseSecu: 120, rateSecu: 0.70, desc: "Implant titane Straumann + pilier + couronne céramique." },
  ];

  const current = procedures.find(p => p.name === proc) || procedures[0];

  // Calculations
  const secuShare = Math.round(current.baseSecu * current.rateSecu * 100) / 100;
  
  let mutuelleShare = 0;
  if (mutuelle !== "0" && current.baseSecu > 0) {
    const pct = parseFloat(mutuelle) / 100;
    // Mutuelle coverage usually includes the Secu share.
    // Max coverage is limited by the actual cost of the procedure.
    const totalMaxCoverage = current.baseSecu * pct;
    mutuelleShare = Math.min(current.cost - secuShare, totalMaxCoverage - secuShare);
    if (mutuelleShare < 0) mutuelleShare = 0;
  }
  mutuelleShare = Math.round(mutuelleShare * 100) / 100;

  const outOfPocket = Math.round((current.cost - secuShare - mutuelleShare) * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 32, marginBottom: 48 }}>
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Transparence Clinique</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            Grille Tarifaire & Devis
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Nous pratiquons des tarifs transparents et établissons un devis avant tout traitement. Le cabinet accepte la carte vitale et applique le tiers-payant sur la part Sécurité Sociale.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }} className="lg:grid-cols-12">
          {/* Prices Table */}
          <div className="lg:col-span-6">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={20} color={C.accent} /> Tarifs des Soins Courants
            </h3>

            <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text }}>Traitement</th>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text, textAlign: "right" }}>Honoraires</th>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text, textAlign: "right" }}>Base Sécu</th>
                  </tr>
                </thead>
                <tbody>
                  {procedures.map((p) => (
                    <tr key={p.name} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: proc === p.name ? C.accentLight : "transparent" }} onClick={() => setProc(p.name)}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: C.text }}>{p.name}</td>
                      <td style={{ padding: "16px 20px", color: C.text, fontWeight: 700, textAlign: "right" }}>€{p.cost.toFixed(2)}</td>
                      <td style={{ padding: "16px 20px", color: C.textMuted, textAlign: "right" }}>{p.baseSecu > 0 ? `€${p.baseSecu.toFixed(2)}` : "Hors nomenc."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16, lineHeight: 1.5 }}>
              * Les soins esthétiques (blanchiment, facettes) ne font pas l'objet d'un remboursement Sécurité Sociale obligatoire. Renseignez-vous auprès de votre mutuelle pour d'éventuels forfaits esthétiques.
            </p>
          </div>

          {/* Interactive Simulator */}
          <div className="lg:col-span-6 bg-slate-50 border border-[#dce9f5] p-8 rounded-2xl">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Calculator size={20} color={C.accent} /> Simulateur de Restes à Charge
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>
              Simulez la prise en charge de vos soins selon votre couverture mutuelle complémentaire.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Select Procedure */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, display: "block", marginBottom: 8 }}>Sélectionner le Traitement</label>
                <div style={{ position: "relative" }}>
                  <select 
                    value={proc}
                    onChange={(e) => setProc(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: C.white,
                      color: C.text,
                      fontSize: 14,
                      fontWeight: 600,
                      appearance: "none",
                      outline: "none"
                    }}
                  >
                    {procedures.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: 15, pointerEvents: "none" }} />
                </div>
                <p style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{current.desc}</p>
              </div>

              {/* Select Mutuelle Rate */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, display: "block", marginBottom: 8 }}>Taux de Remboursement Mutuelle</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Pas de mutuelle", value: "0" },
                    { label: "100%", value: "100" },
                    { label: "200%", value: "200" },
                    { label: "300%", value: "300" },
                  ].map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMutuelle(m.value)}
                      style={{
                        padding: "10px 4px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: mutuelle === m.value ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                        background: mutuelle === m.value ? C.accentLight : C.white,
                        color: mutuelle === m.value ? C.accent : C.text,
                        cursor: "pointer",
                        fontFamily: FONT
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Result */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginTop: 10 }} className="space-y-4">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Honoraires praticien :</span>
                  <span style={{ fontWeight: 700, color: C.text }}>€{current.cost.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Part Sécurité Sociale ({current.rateSecu * 100}%) :</span>
                  <span style={{ fontWeight: 600, color: C.text }}>- €{secuShare.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Part Mutuelle complémentaire :</span>
                  <span style={{ fontWeight: 600, color: C.text }}>- €{mutuelleShare.toFixed(2)}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, borderTop: `2px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
                  <span style={{ fontWeight: 800, color: C.text }}>Reste à charge patient :</span>
                  <span style={{ fontWeight: 900, color: C.accent, fontSize: 22 }}>€{outOfPocket.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Subpage: Team ───────────────────────────────────────────────────────────
function TeamPage() {
  const members = [
    {
      name: "Dr. Claire Laurent",
      role: "Chirurgienne-dentiste co-fondatrice",
      specialty: "Implantologie complexe & Chirurgie reconstructrice",
      experience: "18 ans",
      initials: "CL",
      color: "#4a90d9",
      diplomas: [
        "Diplôme d'État de Docteur en Chirurgie Dentaire — Université Paris VII (Cochin)",
        "Post-Graduate en Implantologie et Parodontologie — New York University (NYU)",
        "D.U. de Reconstruction Osseuse Maxillo-Faciale — Hôpital de la Salpêtrière"
      ],
      description: "Le Dr Laurent dirige les pôles de chirurgie orale et d'implantologie. Passionnée par la réhabilitation globale, elle s'efforce de redonner confort et esthétique aux sourires les plus complexes en utilisant les dernières techniques de guidage chirurgical 3D."
    },
    {
      name: "Dr. Marc Dupont",
      role: "Orthodontiste exclusif",
      specialty: "Orthodontie de l'enfant et de l'adulte, aligneurs transparents",
      experience: "12 ans",
      initials: "MD",
      color: "#7c3aed",
      diplomas: [
        "Diplôme d'État de Docteur en Chirurgie Dentaire — Université de Lyon",
        "Spécialiste Qualifié en Orthopédie Dento-Faciale (CECSOF)",
        "Praticien certifié Invisalign Diamond Apex (Top 1% Europe)"
      ],
      description: "Le Dr Dupont est spécialisé dans l'alignement dentaire discret. Précurseur de l'utilisation d'aligneurs Invisalign en France, il intègre des technologies numériques de scan et de simulation de croissance maxillaire pour des traitements précis et confortables."
    },
    {
      name: "Dr. Sofia Ramirez",
      role: "Chirurgienne-dentiste omnipraticienne",
      specialty: "Dentisterie esthétique, blanchiment & facettes céramiques",
      experience: "9 ans",
      initials: "SR",
      color: "#00b894",
      diplomas: [
        "Diplôme en Médecine Dentaire — Faculté de Médecine de Madrid",
        "Master en Esthétique Dentaire et Prothèses — Université Complutense de Madrid",
        "Certifiée en techniques avancées de collage de facettes Emax"
      ],
      description: "Spécialisée dans l'esthétique du sourire et la dentisterie conservatrice (dite a minima), le Dr Ramirez met son sens artistique au service des patients pour éclaircir ou restructurer les sourires de façon naturelle et élégante."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 32, marginBottom: 48 }}>
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Découvrez nos Experts</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            L'Équipe Médicale Smile Studio
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Nos dentistes et orthodontistes sont diplômés des plus grandes universités et se forment continuellement aux protocoles médicaux les plus avancés.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {members.map((m) => (
            <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="md:grid-cols-12 pb-12 border-b border-gray-100">
              {/* Left Column: Initials and Title */}
              <div className="md:col-span-4 text-center md:text-left">
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: m.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 32,
                    fontWeight: 800,
                    color: C.white,
                    boxShadow: C.shadow,
                    marginLeft: "0"
                  }}
                  className="mx-auto md:ml-0"
                >
                  {m.initials}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>{m.name}</h3>
                <div style={{ fontSize: 15, fontWeight: 700, color: m.color, marginBottom: 8 }}>{m.role}</div>
                <span style={{ fontSize: 13, background: C.bgLight, color: C.text, padding: "5px 12px", borderRadius: 12, fontWeight: 600 }}>
                  {m.experience} d'activité
                </span>
              </div>

              {/* Right Column: Bio and Diplomas */}
              <div className="md:col-span-8">
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Présentation</h4>
                <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
                  {m.description}
                </p>

                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Titres & Diplômes universitaires</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {m.diplomas.map((d, idx) => (
                    <li key={idx} style={{ display: "flex", gap: 10, alignItems: "start", fontSize: 13, color: C.textMuted }}>
                      <Award size={16} color={m.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Subpage: Legal ──────────────────────────────────────────────────────────
function LegalPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 38 }}>
          Mentions Légales
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 32, fontSize: 14, lineHeight: 1.7, color: C.textMuted }}>
          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>1. Éditeur du Site Internet</h2>
            <p style={{ fontWeight: 600, color: C.text }}>Aevia WS — Valentin Milliand</p>
            <p>SIREN : 852 546 225</p>
            <p>RCS : Bourg-en-Bresse</p>
            <p>Email de contact : <a href="mailto:contact@aevia.ws" style={{ color: C.accent, textDecoration: "underline" }}>contact@aevia.ws</a></p>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>Conformément à la réglementation sur la protection de la vie privée, l'adresse physique est transmissible sur simple demande justifiée.</p>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>2. Hébergement du Site</h2>
            <p style={{ fontWeight: 600, color: C.text }}>Vercel Inc.</p>
            <p>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
            <p>Site Internet : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>vercel.com</a></p>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>3. Droits de Propriété Intellectuelle</h2>
            <p>
              L'ensemble du contenu publié sur ce site (graphismes, illustrations vectorielles, animations, logos) relève de la législation française et internationale sur le droit d'auteur. Toute reproduction totale ou partielle sans consentement exprès de l'éditeur constitue une contrefaçon passible de sanctions judiciaires.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>4. Cookies & Données Personnelles</h2>
            <p>
              Ce site à visée de démonstration ne dépose aucun cookie publicitaire et n'enregistre aucune donnée utilisateur de façon permanente. Les saisies dans le formulaire de simulation ou de contact restent stockées localement en mémoire et sont purgées lors de la fermeture de l'onglet.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function Impact30() {
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <main style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <Navbar page={page} goTo={goTo} />
      
      {/* Home sections wrapped in a display-controlled div to prevent Framer Motion Target unmounting crashes */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
        <Hero goTo={goTo} />
        <Services goTo={goTo} />
        <Stats />
        <Testimonials />
        <Team goTo={goTo} />
        <Pricing goTo={goTo} />
        <FAQ />
      </div>

      {/* Pages */}
      {page === "soins" && <SoinsPage goTo={goTo} />}
      {page === "pricing" && <PricingPage />}
      {page === "team" && <TeamPage />}
      {page === "legal" && <LegalPage />}

      {/* Contact Form Section (Shared for quick actions, placed outside conditional if needed, but in original it's inside footer styled contact) */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
        <section id="contact-form" style={{ padding: "80px 48px", background: C.bgSection, fontFamily: FONT, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 38 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 10 }}>Contactez notre Cabinet</h2>
              <p style={{ color: C.textMuted, fontSize: 15 }}>Une question ou une demande spécifique ? Laissez-nous un message.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <input type="text" placeholder="Votre Nom" style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none" }} />
              <input type="email" placeholder="Votre E-mail" style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none" }} />
            </div>
            <textarea placeholder="Votre message..." rows={4} style={{ width: "100%", padding: "14px 18px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", resize: "none", marginBottom: 20 }} />
            <button 
              onClick={() => alert("Message envoyé ! (Simulation)")}
              style={{ width: "100%", padding: "14px", background: C.accent, color: C.white, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
            >
              Envoyer le message
            </button>
          </div>
        </section>
      </div>

      <Footer goTo={goTo} />
    </main>
  );
}
