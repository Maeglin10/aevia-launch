"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Calendar,
  Menu,
  X,
  Users,
  Heart,
  Sunrise,
  Wind,
  Award,
  Leaf,
} from "lucide-react";
import {
  clientCity,
  clientFaq,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientTeam,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let bp: any = null;
let fd: any = null;

// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { value: "850+", label: "Élèves actifs" },
            { value: "12", label: "Professeurs certifiés" },
            { value: "30+", label: "Cours / semaine" }
];
let STATS_INLINE = STATS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#faf7f2",
  bgLight: "#f2ede4",
  bgSection: "#fdf9f5",
  text: "#3d2b1f",
  textMuted: "#7a6558",
  accent: "var(--brand-light,#c0614a)",
  accentDark: "#a84f3a",
  accentLight: "#fbeae6",
  sage: "var(--brand,#6b8f6b)",
  sageDark: "#4f6e4f",
  sageLight: "#e8f0e8",
  white: "#FFFFFF",
  border: "#e8ddd4",
  cream: "#fdf6ec",
  shadow: "0 4px 24px rgba(61,43,31,0.08)",
  shadowLg: "0 12px 48px rgba(61,43,31,0.14)",
};

const FONT_HEADING = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'Lato', system-ui, sans-serif";

// ─── Breathing Circle (Hero Animation) ────────────────────────────────────────
function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const phases = [
    { label: "Inspirez", duration: 4000, scale: 1.35 },
    { label: "Retenez", duration: 2000, scale: 1.35 },
    { label: "Expirez", duration: 6000, scale: 1 },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const current = phases[phaseIdx];
    const t = setTimeout(() => {
      setPhaseIdx((prev) => (prev + 1) % 3);
    }, current.duration);
    setPhase(phaseIdx === 0 ? "inhale" : phaseIdx === 1 ? "hold" : "exhale");
    return () => clearTimeout(t);
  }, [phaseIdx]);

  const current = phases[phaseIdx];

  return (
    <div style={{ position: "relative", width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <motion.div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: `2px solid ${C.accent}`,
          opacity: 0.18,
        }}
        animate={{ scale: current.scale * 1.1 }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      />
      {/* Middle ring */}
      <motion.div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: `1.5px solid ${C.sage}`,
          opacity: 0.25,
        }}
        animate={{ scale: current.scale * 1.05 }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      />
      {/* Main breathing circle */}
      <motion.div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 38%, ${C.accentLight}, ${C.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 48px rgba(192,97,74,0.35)`,
        }}
        animate={{ scale: current.scale }}
        transition={{ duration: current.duration / 1000, ease: "easeInOut" }}
      >
        {/* Lotus SVG inside */}
        <svg viewBox="0 0 80 80" width={56} height={56}>
          <motion.ellipse cx="40" cy="58" rx="14" ry="18" fill="rgba(255,255,255,0.9)" animate={{ scaleY: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="20" cy="46" rx="12" ry="17" fill="rgba(255,255,255,0.7)" transform="rotate(-30, 20, 46)" animate={{ rotate: [-30, -26, -30] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="60" cy="46" rx="12" ry="17" fill="rgba(255,255,255,0.7)" transform="rotate(30, 60, 46)" animate={{ rotate: [30, 26, 30] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="10" cy="58" rx="9" ry="13" fill="rgba(255,255,255,0.5)" transform="rotate(-55, 10, 58)" animate={{ rotate: [-55, -50, -55] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.ellipse cx="70" cy="58" rx="9" ry="13" fill="rgba(255,255,255,0.5)" transform="rotate(55, 70, 58)" animate={{ rotate: [55, 50, 55] }} transition={{ duration: 3, repeat: Infinity }} />
        </svg>
      </motion.div>

      {/* Phase label */}
      <motion.div
        key={current.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "6px 18px",
          fontSize: 13,
          fontWeight: 700,
          color: C.accent,
          fontFamily: FONT_BODY,
          whiteSpace: "nowrap",
          boxShadow: C.shadow,
        }}
      >
        {current.label}
      </motion.div>
    </div>
  );
}

// ─── Floating Lotus ────────────────────────────────────────────────────────────
function FloatingLotus() {
  return (
    <motion.div
      style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.12 }}
      animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" width={120} height={120}>
        <ellipse cx="60" cy="88" rx="22" ry="28" fill={C.accent} />
        <ellipse cx="32" cy="70" rx="18" ry="26" fill={C.accent} transform="rotate(-30, 32, 70)" />
        <ellipse cx="88" cy="70" rx="18" ry="26" fill={C.accent} transform="rotate(30, 88, 70)" />
        <ellipse cx="14" cy="86" rx="13" ry="20" fill={C.accent} transform="rotate(-55, 14, 86)" />
        <ellipse cx="106" cy="86" rx="13" ry="20" fill={C.accent} transform="rotate(55, 106, 86)" />
      </svg>
    </motion.div>
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

  const links = ["Accueil", "Cours", "Professeurs", "Tarifs", "Contact"];

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
          background: scrolled ? "rgba(250,247,242,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT_BODY,
        }}
      >
        <motion.div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} whileHover={{ scale: 1.03 }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <div style={{ width: 38, height: 38, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={20} color={C.white} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 21, color: C.text, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>
                {clientName({ formData: fd }) ?? "Ananda"}<span style={{ color: C.accent }}>Flow</span>
              </span>
            </>
          )}
        </motion.div>

        <div className="sky-desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <motion.a
              key={link}
              href="/templates/impact-31"
              style={{ color: C.text, fontWeight: 400, fontSize: 15, textDecoration: "none", fontFamily: FONT_BODY }}
              whileHover={{ color: C.accent }}
              transition={{ duration: 0.15 }}
            >
              {link}
            </motion.a>
          ))}
          <motion.button
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 25,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: FONT_BODY,
            }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Essai gratuit
          </motion.button>
        </div>

        <motion.button
          className="sky-mobile-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.text }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
        <style>{`@media (max-width: 900px){.sky-desktop-nav{display:none !important}.sky-mobile-burger{display:flex !important}}`}</style>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed", top: 72, left: 0, right: 0, zIndex: 99,
              background: C.bg, padding: "24px 48px",
              borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow,
              fontFamily: FONT_BODY,
            }}
          >
            {links.map((link) => (
              <a key={link} href="/templates/impact-31" style={{ display: "block", padding: "12px 0", color: C.text, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>
                {link}
              </a>
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
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgLight} 60%, ${C.sageLight} 100%)`,
        display: "flex",
        alignItems: "center",
        padding: "100px 80px 60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT_BODY,
      }}
    >
      {/* Background organic shapes */}
      <motion.div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: "60% 40% 70% 30%",
          background: `${C.sageLight}`,
          opacity: 0.6,
          zIndex: 0,
        }}
        animate={{ borderRadius: ["60% 40% 70% 30%", "40% 60% 30% 70%", "60% 40% 70% 30%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingLotus />

      {/* Left: text */}
      <motion.div
        style={{ flex: 1, maxWidth: 580, position: "relative", zIndex: 2, y: textY, opacity: heroOpacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: FONT_HEADING,
            fontSize: "clamp(38px, 4.5vw, 64px)",
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.12,
            letterSpacing: -1,
            marginBottom: 24,
          }}
        >{/* ACCROCHE */ clientTagline({ formData: fd, generatedContent: c }) ?? (<>
          Trouvez votre{" "}
          <em style={{ color: C.accent, fontStyle: "italic" }}>équilibre intérieur</em>
        </>)}</motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 17, color: C.textMuted, lineHeight: 1.78, marginBottom: 36, maxWidth: 480 }}
        >
          Ananda Flow vous invite à un voyage vers la sérénité. Cours de yoga, méditation et
          pranayama pour tous les niveaux, dans un cadre chaleureux au cœur de Lyon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
        >
          <motion.button
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 30,
              padding: "16px 34px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT_BODY,
            }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Calendar size={18} />
            Cours d'essai gratuit
          </motion.button>
          <motion.button
            style={{
              background: "transparent",
              color: C.text,
              border: `1.5px solid ${C.border}`,
              borderRadius: 30,
              padding: "15px 28px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT_BODY,
            }}
            whileHover={{ borderColor: C.accent, color: C.accent }}
            whileTap={{ scale: 0.97 }}
          >
            Voir les cours <ChevronRight size={16} />
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
          {STATS_INLINE.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 24, color: C.accent }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: breathing circle */}
      <motion.div
        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BreathingCircle />
      </motion.div>
    </section>
  );
}

// ─── Class Schedule ────────────────────────────────────────────────────────────
const CLASSES = [
  { day: "Lundi", time: "07h00", name: "Hatha Flow", level: "Débutant", teacher: "Emma D.", spots: 8, icon: <Sunrise size={18} color="var(--brand-light,#c0614a)" /> },
  { day: "Lundi", time: "19h00", name: "Vinyasa Power", level: "Intermédiaire", teacher: "Lucas R.", spots: 4, icon: <Wind size={18} color="var(--brand,#6b8f6b)" /> },
  { day: "Mercredi", time: "09h30", name: "Yin & Méditation", level: "Tous niveaux", teacher: "Sophie M.", spots: 12, icon: <Heart size={18} color="var(--brand-light,#c0614a)" /> },
  { day: "Jeudi", time: "18h30", name: "Ashtanga", level: "Avancé", teacher: "Lucas R.", spots: 6, icon: <Award size={18} color="var(--brand,#6b8f6b)" /> },
  { day: "Samedi", time: "10h00", name: "Yoga Nidra", level: "Tous niveaux", teacher: "Emma D.", spots: 14, icon: <Leaf size={18} color="var(--brand-light,#c0614a)" /> },
  { day: "Dimanche", time: "09h00", name: "Kundalini", level: "Intermédiaire", teacher: "Amara B.", spots: 2, icon: <Sunrise size={18} color="var(--brand,#6b8f6b)" /> },
];

type ClassInfo = { day: string; time: string; name: string; level: string; teacher: string };

function BookingModal({ cls, onClose }: { cls: ClassInfo; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(61,43,31,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", background: C.white, borderRadius: 20, padding: "36px 32px", position: "relative", boxShadow: C.shadowLg, fontFamily: FONT_BODY }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{ position: "absolute", top: 16, right: 16, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer" }}
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "24px 0" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                style={{ width: 64, height: 64, borderRadius: "50%", background: C.sageLight, color: C.sage, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}
              >
                <CheckCircle size={28} />
              </motion.div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 10 }}>Réservation confirmée</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>
                Votre place pour <strong>{cls.name}</strong> — {cls.day} à {cls.time} avec {cls.teacher} — est réservée. Un e-mail de confirmation vous a été envoyé.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
              <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.6 }}>
                {cls.day} · {cls.time}
              </div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>{cls.name}</h3>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>{cls.level} · avec {cls.teacher}</p>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="bm-name" style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Nom complet</label>
                <input id="bm-name" name="name" type="text" required placeholder="Camille Dubois" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: FONT_BODY, outline: "none", color: C.text }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="bm-email" style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>E-mail</label>
                <input id="bm-email" name="email" type="email" required placeholder="vous@email.com" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: FONT_BODY, outline: "none", color: C.text }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label htmlFor="bm-phone" style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Téléphone</label>
                <input id="bm-phone" name="phone" type="tel" required placeholder="06 12 34 56 78" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: FONT_BODY, outline: "none", color: C.text }} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { background: C.accentDark }}
                whileTap={loading ? {} : { scale: 0.98 }}
                style={{ width: "100%", minHeight: 44, background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: FONT_BODY, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? 0.75 : 1 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.white}`, borderTopColor: "transparent" }}
                    />
                    Réservation en cours…
                  </>
                ) : (
                  "Confirmer ma réservation"
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function Classes() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Planning
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Nos cours de la semaine
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Des cours pour tous les niveaux, du lundi au dimanche. Réservez votre place en ligne.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        {CLASSES.map((c, i) => (
          <motion.div
            key={`${c.day}-${c.time}`}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 16, padding: "24px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{c.day}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: FONT_HEADING }}>{c.time}</div>
              </div>
              <div style={{ background: C.accentLight, borderRadius: 12, padding: "8px 10px" }}>{c.icon}</div>
            </div>
            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 4 }}>{c.name}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, background: c.level === "Débutant" ? C.sageLight : c.level === "Avancé" ? C.accentLight : C.bgLight, color: c.level === "Débutant" ? C.sage : c.level === "Avancé" ? C.accent : C.textMuted, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                  {c.level}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted }}>avec {c.teacher}</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: 13, color: c.spots <= 3 ? C.accent : C.textMuted, fontWeight: c.spots <= 3 ? 700 : 400 }}>
                {c.spots <= 3 ? `${c.spots} places` : `${c.spots} places dispo`}
              </span>
              <motion.button
                onClick={() => setSelectedClass({ day: c.day, time: c.time, name: c.name, level: c.level, teacher: c.teacher })}
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 20, padding: "8px 18px", minHeight: 44, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}
                whileHover={{ background: C.accentDark, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                Réserver
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedClass && <BookingModal cls={selectedClass} onClose={() => setSelectedClass(null)} />}
      </AnimatePresence>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const stats = resolveList(
    clientStats({ formData: fd, businessProfile: bp, generatedContent: c })?.map((s: any, i: number) => ({ ...([
    { value: "850+", label: "Élèves actifs", icon: <Users size={22} color="#fff" /> },
    { value: "12", label: "Professeurs certifiés", icon: <Award size={22} color="#fff" /> },
    { value: "30+", label: "Cours par semaine", icon: <Calendar size={22} color="#fff" /> },
    { value: "4.8★", label: "Note Google", icon: <Star size={22} color="#fff" /> },
  ])[i % ([
    { value: "850+", label: "Élèves actifs", icon: <Users size={22} color="#fff" /> },
    { value: "12", label: "Professeurs certifiés", icon: <Award size={22} color="#fff" /> },
    { value: "30+", label: "Cours par semaine", icon: <Calendar size={22} color="#fff" /> },
    { value: "4.8★", label: "Note Google", icon: <Star size={22} color="#fff" /> },
  ]).length], value: s.value, label: s.label })),
    [
    { value: "850+", label: "Élèves actifs", icon: <Users size={22} color="#fff" /> },
    { value: "12", label: "Professeurs certifiés", icon: <Award size={22} color="#fff" /> },
    { value: "30+", label: "Cours par semaine", icon: <Calendar size={22} color="#fff" /> },
    { value: "4.8★", label: "Note Google", icon: <Star size={22} color="#fff" /> },
  ],
  );

  return (
    <section
      ref={ref}
      style={{
        padding: "90px 80px",
        background: `linear-gradient(135deg, ${C.text} 0%, #5a3a28 100%)`,
        fontFamily: FONT_BODY,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ width: 50, height: 50, background: "rgba(192,97,74,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              {s.icon}
            </div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.white, marginBottom: 8 }}>
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Teachers ─────────────────────────────────────────────────────────────────
const TEACHERS_SOURCE = [
  { name: "Emma Dubois", role: "Hatha & Yin Yoga", bio: "18 ans de pratique, certifiée RYT-500. Spécialiste du yoga thérapeutique et de la méditation pleine conscience.", exp: "12 ans d'enseignement", initials: "ED", color: C.accent },
  { name: "Lucas Renaud", role: "Vinyasa & Ashtanga", bio: "Formé à Mysore auprès de maîtres indiens. Sa pratique dynamique guide vers la maîtrise de soi et la discipline.", exp: "8 ans d'enseignement", initials: "LR", color: "var(--brand,#6b8f6b)" },
  { name: "Amara Bah", role: "Kundalini & Pranayama", bio: "Experte en techniques respiratoires et en éveil de l'énergie. Elle accompagne les transformations profondes.", exp: "10 ans d'enseignement", initials: "AB", color: "#9b7b6b" },
];
let TEACHERS = TEACHERS_SOURCE;

function Teachers() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Nos professeurs
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Des guides inspirants
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28, maxWidth: 960, margin: "0 auto" }}>
        {TEACHERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 20, padding: 32, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, fontWeight: 700, color: C.white, fontFamily: FONT_HEADING, letterSpacing: 1 }}>
              {t.initials}
            </div>
            <h3 style={{ fontFamily: FONT_HEADING, fontSize: 21, fontWeight: 700, color: C.text, marginBottom: 4 }}>{t.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.color, marginBottom: 12 }}>{t.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 16 }}>{t.bio}</p>
            <div style={{ display: "inline-block", background: C.bgLight, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, color: C.textMuted }}>
              {t.exp}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS_SOURCE = [
  { name: "Céline F.", text: "Ananda Flow a complètement transformé ma relation au stress. Les cours de Sophie sont une parenthèse de paix dans mes journées chargées.", stars: 5, practice: "Yin & Méditation" },
  { name: "Romain G.", text: "J'ai commencé le yoga sans aucune souplesse. Lucas est incroyablement patient et pédagogue. En 6 mois, je ne me reconnais plus.", stars: 5, practice: "Vinyasa Power" },
  { name: "Naomi L.", text: "Le Kundalini d'Amara m'a ouvert des portes intérieures que je ne soupçonnais pas. Une expérience profondément transformatrice.", stars: 5, practice: "Kundalini" },
];
let TESTIMONIALS_DEMO = TESTIMONIALS_SOURCE;
let TESTIMONIALS = TESTIMONIALS_DEMO;

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Témoignages
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Ils ont trouvé leur équilibre
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 20, padding: 32, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {Array.from({ length: t.stars }).map((_, k) => (<Star key={k} size={16} color="#d4832a" fill="#d4832a" />))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.72, marginBottom: 20, fontStyle: "italic" }}>
              "{t.text}"
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{t.practice}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={18} color={C.accent} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS_SOURCE = [
  {
    name: "Découverte",
    price: "29",
    period: "/ semaine",
    desc: "Idéal pour commencer votre pratique en douceur.",
    features: ["3 cours par semaine", "Accès à tous les niveaux", "Cours en ligne inclus", "Application mobile", "Support par email"],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Équilibre",
    price: "89",
    period: "/ mois",
    desc: "La formule complète pour une pratique régulière.",
    features: ["Cours illimités en studio", "Cours en ligne illimités", "1 atelier / mois offert", "Accès prioritaire réservations", "Communauté privée", "Bilan trimestriel avec enseignant"],
    cta: "Rejoindre",
    highlight: true,
  },
  {
    name: "Immersion",
    price: "149",
    period: "/ mois",
    desc: "Pour les pratiquants avancés et la transformation totale.",
    features: ["Tout le plan Équilibre", "2 cours privés / mois", "Accès retraites exclusives", "Programme nutrition inclus", "Coaching bien-être mensuel", "Réductions sur nos ateliers"],
    cta: "Choisir Immersion",
    highlight: false,
  },
];
let PLANS = PLANS_SOURCE;

function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Abonnements
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Investissez dans votre bien-être
        </h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>Premier cours d'essai toujours gratuit — Sans engagement</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28, maxWidth: 980, margin: "0 auto", alignItems: "start" }}>
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{
              background: p.highlight ? C.text : C.bgSection,
              borderRadius: 24,
              padding: "38px 32px",
              border: p.highlight ? "none" : `1.5px solid ${C.border}`,
              boxShadow: p.highlight ? C.shadowLg : C.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {p.highlight && (
              <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, #e07c62)` }} />
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
                  Populaire
                </div>
              </>
            )}
            <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>{p.desc}</p>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 44, fontWeight: 700, color: p.highlight ? C.white : C.text }}>€{p.price}</span>
              <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>{p.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 11 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={p.highlight ? C.accent : C.sage} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button
              style={{
                width: "100%",
                background: p.highlight ? C.accent : "transparent",
                color: p.highlight ? C.white : C.text,
                border: p.highlight ? "none" : `1.5px solid ${C.border}`,
                borderRadius: 25,
                padding: "14px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT_BODY,
              }}
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
const FAQS_DEMO = [
  { q: "Je suis débutant(e), puis-je commencer le yoga ?", a: "Absolument ! Tous nos cours débutants sont conçus pour les personnes sans aucune expérience. Emma et nos autres professeurs adaptent chaque posture selon les capacités de chacun. Votre premier cours est entièrement gratuit." },
  { q: "Quels accessoires dois-je apporter ?", a: "Nous mettons des tapis à disposition gratuitement. Venez simplement en tenue confortable. Les props (blocs, sangles, coussins) sont fournis. Vous pouvez bien sûr apporter votre propre tapis si vous en avez un." },
  { q: "Puis-je me joindre à n'importe quel moment ?", a: "Oui, les inscriptions sont ouvertes toute l'année. Nous vous recommandons de commencer par notre cours de découverte (gratuit) pour trouver le format qui vous convient le mieux avant de vous abonner." },
  { q: "Y a-t-il des cours en ligne ?", a: "Oui ! Tous nos abonnements payants incluent un accès illimité à notre plateforme en ligne avec plus de 200 cours enregistrés et 3 sessions live par semaine." },
  { q: "Quelle est votre politique d'annulation ?", a: "Vous pouvez annuler un cours jusqu'à 4h avant son début sans pénalité. En dessous de 4h, la séance est décomptée. Notre abonnement mensuel est résiliable à tout moment sans frais." },
];
let FAQS = FAQS_DEMO;

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          FAQ
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
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
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT_BODY }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
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

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function Impact31() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    businessProfile?: any;
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;

  bp = session?.businessProfile;
  TEACHERS = resolveList(
    clientTeam(session)?.map((m: any, i: number) => ({ ...TEACHERS_SOURCE[i % TEACHERS_SOURCE.length], name: m.name, role: m.role })),
    TEACHERS_SOURCE,
  );
  PLANS = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...PLANS_SOURCE[i % PLANS_SOURCE.length], name: s.title, desc: s.desc || "" || "", price: s.price ?? PLANS_SOURCE[i % PLANS_SOURCE.length].price })),
    PLANS_SOURCE,
  );

  STATS_INLINE = resolveList(

    clientStats(session)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      value: s.value,

      label: s.label,

    })),

    STATS_INLINE_SOURCE,

  );
  TESTIMONIALS_DEMO = resolveList(
    clientReviews(session)?.map((r: any, i: number) => ({ ...TESTIMONIALS_SOURCE[i % TESTIMONIALS_SOURCE.length], name: r.author, text: r.text })),
    TESTIMONIALS_SOURCE,
  );
  TESTIMONIALS = resolveList(
    clientReviews(session)?.map((r, i) => ({ ...TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length], text: r.text, name: r.author })),
    TESTIMONIALS_DEMO,
  );
  FAQS = resolveList(
    clientFaq(session)?.map((r, i) => ({ ...FAQS_DEMO[i % FAQS_DEMO.length], q: r.q, a: r.a })),
    FAQS_DEMO,
  );
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand };
  }

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    // layout.tsx already renders a fixed Navbar above {children} — this page
    // rendered a second fixed Navbar on top of it, causing the "Professeurs" /
    // "Tarifs" links to double up and overlap illegibly. layout.tsx's Navbar
    // is the single source of truth for this route segment.
    <main style={{ background: C.bg, overflowX: "hidden" }}>
      <Hero />
      <Classes />
      <Stats />
      <Teachers />
      <Testimonials />
      <Pricing />
      <FAQ />
      {/* layout.tsx renders the site footer; this page rendered a second one
          on top of it, so the site showed two stacked footers. */}
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.55 }}>
        {clientName({ formData: fd }) ?? "impact-31"}
        {clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}
      </footer>
    </main>
  );
}
