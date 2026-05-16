"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Globe,
  BookOpen,
  Utensils,
  Home,
  ChevronDown,
  Check,
  ArrowRight,
  Star,
  Users,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  TrendingUp,
  Gift,
  Shield,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#fffef9",
  bgAlt: "#f8f7f0",
  bgDark: "#1e3a8a",
  bgDeep: "#172554",
  text: "#1f2937",
  textLight: "#4b5563",
  textMuted: "#9ca3af",
  accent: "#fbbf24",
  accentLight: "#fde68a",
  white: "#ffffff",
  border: "#e5e7eb",
  shadow: "rgba(30,58,138,0.1)",
  warm: "#374151",
  headingFont: "'Merriweather', Georgia, serif",
  bodyFont: "'Open Sans', system-ui, sans-serif",
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const steps = 60;
    const stepVal = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepVal;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

// ─── Donation progress bar ────────────────────────────────────────────────────
function DonationProgress({ goal, current, label }: { goal: number; current: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const pct = Math.min((current / goal) * 100, 100);

  return (
    <div ref={ref} style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: C.textLight, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: C.bgDark, fontWeight: 700 }}>
          {current.toLocaleString("fr-FR")} € / {goal.toLocaleString("fr-FR")} €
        </span>
      </div>
      <div style={{ height: 10, backgroundColor: C.border, borderRadius: "5px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            backgroundColor: C.accent,
            borderRadius: "5px",
          }}
        />
      </div>
      <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.3rem" }}>{Math.round(pct)}% atteint</div>
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
          padding: "1.1rem 0",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.text, fontWeight: 700, lineHeight: 1.45 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={20} color={C.bgDark} />
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
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.8, paddingBottom: "1.1rem" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const programs = [
  {
    icon: <BookOpen size={28} />,
    title: "Éducation pour tous",
    desc: "Nous finançons la construction de salles de classe, la formation d'enseignants et la fourniture de matériaux scolaires dans 14 pays d'Afrique subsaharienne et d'Asie du Sud-Est.",
    stats: "147 écoles construites",
    color: "#3b82f6",
  },
  {
    icon: <Utensils size={28} />,
    title: "Alimentation & nutrition",
    desc: "Notre programme de cantines scolaires assure un repas chaud et équilibré par jour à 42 000 enfants. La nutrition améliore l'assiduité scolaire de 68%.",
    stats: "3,2M repas servis/an",
    color: "#10b981",
  },
  {
    icon: <Home size={28} />,
    title: "Abris sécurisés",
    desc: "En partenariat avec des ONG locales, nous fournissons des abris d'urgence aux familles déplacées et soutenons la reconstruction de villages après catastrophes naturelles.",
    stats: "8 200 familles logées",
    color: "#f59e0b",
  },
];

const stories = [
  {
    name: "Amara, 9 ans",
    country: "Mali",
    text: "Grâce à Lumière d'Espoir, j'ai pu aller à l'école pour la première fois. Je veux devenir médecin pour aider mon village.",
    bg: "#dbeafe",
    accent: "#1e40af",
    initial: "A",
  },
  {
    name: "Fatou, mère de 3 enfants",
    country: "Sénégal",
    text: "La cantine scolaire a tout changé. Mes enfants partent le matin avec le sourire, sachant qu'ils auront un vrai repas. Leurs notes se sont améliorées.",
    bg: "#dcfce7",
    accent: "#15803d",
    initial: "F",
  },
  {
    name: "Ravi Kumar, instituteur",
    country: "Inde",
    text: "Avant, j'enseignais sous un arbre. Aujourd'hui j'ai une belle salle de classe avec des tableaux, des livres, et des enfants qui viennent régulièrement.",
    bg: "#fef3c7",
    accent: "#d97706",
    initial: "R",
  },
];

const donationTiers = [
  {
    amount: "10",
    label: "Bienfaiteur",
    desc: "Un repas par semaine pour un enfant pendant un mois",
    impact: "4 repas offerts",
    color: C.border,
    textColor: C.text,
    accent: C.bgDark,
  },
  {
    amount: "25",
    label: "Soutien",
    desc: "Financement partiel de fournitures scolaires pour un élève",
    impact: "1 kit scolaire",
    color: C.bgDark,
    textColor: C.white,
    accent: C.accent,
    popular: true,
  },
  {
    amount: "50",
    label: "Ambassadeur",
    desc: "Financement d'un mois complet de repas pour un enfant",
    impact: "30 repas offerts",
    color: C.accent,
    textColor: C.bgDeep,
    accent: C.bgDeep,
  },
  {
    amount: "100",
    label: "Parrain",
    desc: "Participation à la construction d'une salle de classe",
    impact: "1/500e d'une école",
    color: C.bgDeep,
    textColor: C.white,
    accent: C.accentLight,
  },
];

const faqs = [
  {
    q: "Mon don est-il déductible des impôts ?",
    a: "Oui. Lumière d'Espoir est reconnu d'utilité publique en France. Vos dons sont déductibles à 66% de votre impôt sur le revenu, dans la limite de 20% de votre revenu imposable. Vous recevez un reçu fiscal dans les 48h.",
  },
  {
    q: "Comment mon argent est-il utilisé ?",
    a: "87% des fonds vont directement aux programmes sur le terrain. 8% couvrent les frais de coordination internationale, et 5% les frais administratifs. Nous publions un rapport annuel certifié par un commissaire aux comptes.",
  },
  {
    q: "Puis-je parrainer un enfant spécifique ?",
    a: "Notre programme de parrainage vous associe à un enfant dans un pays de votre choix. Vous recevez des nouvelles et des photos deux fois par an. Le parrainage commence à 25€/mois.",
  },
  {
    q: "Puis-je annuler mon don mensuel ?",
    a: "Oui, à tout moment, sans frais ni préavis. Connectez-vous à votre espace donateur ou contactez-nous. Vos dons passés ont déjà eu un impact concret — nous vous en remercions.",
  },
  {
    q: "Intervenez-vous en cas de crise humanitaire ?",
    a: "Oui, nous disposons d'un fonds d'urgence permettant une intervention sous 72h en cas de catastrophe naturelle ou de conflit. 15% de nos réserves annuelles sont dédiées à cette réponse rapide.",
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LumiereEspoirPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Notre mission", href: "#mission" },
    { label: "Impact", href: "#impact" },
    { label: "Programmes", href: "#programmes" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "Donner", href: "#dons" },
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
          padding: scrolled ? "0.7rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled ? "rgba(255,254,249,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled ? `0 1px 24px ${C.shadow}` : "none",
          transition: "all 0.38s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div
            style={{
              width: 38, height: 38,
              borderRadius: "50%",
              backgroundColor: C.bgDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Heart size={18} color={C.accent} fill={C.accent} />
          </div>
          <div>
            <div style={{ fontFamily: C.headingFont, fontSize: "1.05rem", fontWeight: 700, color: scrolled ? C.bgDark : C.white, lineHeight: 1.1 }}>
              Lumière d'Espoir
            </div>
            <div style={{ fontFamily: C.bodyFont, fontSize: "0.65rem", color: scrolled ? C.textMuted : "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ONG humanitaire
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.875rem",
                color: scrolled ? C.textLight : "rgba(255,255,255,0.82)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolled ? C.bgDark : C.accent)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = scrolled ? C.textLight : "rgba(255,255,255,0.82)")}
            >
              {l.label}
            </a>
          ))}
          <button onClick={() => document.getElementById("dons")?.scrollIntoView({behavior:"smooth"})}
            style={{
              backgroundColor: C.accent,
              color: C.bgDeep,
              padding: "0.6rem 1.5rem",
              borderRadius: "2rem",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 800,
              fontFamily: C.bodyFont,
              boxShadow: "0 4px 14px rgba(251,191,36,0.35)",
            }}
          >
            Faire un don
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }} aria-label="Menu">
          {menuOpen ? <X color={scrolled ? C.bgDark : C.white} size={24} /> : <Menu color={scrolled ? C.bgDark : C.white} size={24} />}
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
              backgroundColor: C.bg,
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxShadow: `0 8px 32px ${C.shadow}`,
            }}
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: C.text, textDecoration: "none", fontSize: "1.05rem", fontFamily: C.bodyFont, fontWeight: 500 }}>
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
          background: `linear-gradient(160deg, ${C.bgDeep} 0%, ${C.bgDark} 60%, #1e50c8 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "5rem",
        }}
      >
        {/* Animated background blobs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            backgroundColor: C.accent,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 900, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}
          >
            <Globe size={16} color={C.accent} />
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Présents dans 14 pays
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14 }}
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 900,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Chaque enfant mérite<br />
            <span style={{ color: C.accent }}>une lumière d'espoir</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.15rem",
              color: "rgba(255,255,255,0.7)",
              maxWidth: 580,
              margin: "0 auto 3rem",
              lineHeight: 1.8,
            }}
          >
            Lumière d'Espoir agit depuis 2003 pour garantir l'éducation, la nutrition et un abri aux enfants les plus vulnérables dans le monde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <button onClick={() => document.getElementById("dons")?.scrollIntoView({behavior:"smooth"})}
              style={{
                backgroundColor: C.accent,
                color: C.bgDeep,
                padding: "1.1rem 2.6rem",
                borderRadius: "3rem",
                textDecoration: "none",
                fontWeight: 800,
                fontFamily: C.bodyFont,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 36px rgba(251,191,36,0.4)",
              }}
            >
              <Heart size={18} fill={C.bgDeep} /> Faire un don maintenant
            </a>
            <button onClick={() => document.getElementById("programmes")?.scrollIntoView({behavior:"smooth"})}
              style={{
                border: `2px solid rgba(255,255,255,0.28)`,
                color: C.white,
                padding: "1.1rem 2.6rem",
                borderRadius: "3rem",
                textDecoration: "none",
                fontWeight: 600,
                fontFamily: C.bodyFont,
                fontSize: "1rem",
              }}
            >
              Nos programmes
            </a>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.58 }}
            style={{ display: "flex", gap: "3.5rem", justifyContent: "center", marginTop: "4.5rem", flexWrap: "wrap" }}
          >
            {[
              { val: 127000, label: "enfants aidés", suffix: "+" },
              { val: 147, label: "écoles construites", suffix: "" },
              { val: 3200000, label: "repas servis/an", suffix: "" },
              { val: 14, label: "pays d'intervention", suffix: "" },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "2.2rem", fontWeight: 900, color: C.accent }}>
                  {i === 0 ? <AnimatedCounter target={s.val} suffix={s.suffix} /> :
                   i === 2 ? <AnimatedCounter target={s.val} suffix={s.suffix} /> :
                   <>{s.val}{s.suffix}</>}
                </div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(255,255,255,0.52)", marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          <ChevronDown color={C.accent} size={30} opacity={0.55} />
        </motion.div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "5rem", alignItems: "center" }}>
            <SectionReveal>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bgDark }}>
                Notre mission
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", color: C.text, fontWeight: 900, margin: "0.75rem 0 1.5rem", lineHeight: 1.2 }}>
                Agir avec efficacité, transparence et respect
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "1.25rem" }}>
                Fondée en 2003 par Isabelle Marchand et le Dr. Seydou Coulibaly, Lumière d'Espoir croit que chaque enfant, où qu'il naisse, mérite les mêmes chances. Nous ne faisons pas de charité — nous construisons des ponts vers l'autonomie.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "2.25rem" }}>
                Nos équipes travaillent en collaboration étroite avec les communautés locales, les gouvernements et des partenaires internationaux pour créer des changements durables, mesurables et respectueux des cultures.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { icon: <Shield size={16} />, label: "Labellisé Don en Confiance" },
                  { icon: <TrendingUp size={16} />, label: "87% sur le terrain" },
                  { icon: <Star size={16} />, label: "Noté 4,9/5 par nos donateurs" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: C.bgDark }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.textLight, fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div
                style={{
                  backgroundColor: C.bgDark,
                  borderRadius: "2rem",
                  padding: "2.5rem",
                  color: C.white,
                }}
              >
                <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.white, marginBottom: "1.5rem", fontWeight: 700 }}>
                  Objectifs 2026 — Avancement
                </h3>
                <DonationProgress goal={500000} current={342800} label="Fonds éducation annuel" />
                <DonationProgress goal={200000} current={187400} label="Programme nutrition" />
                <DonationProgress goal={150000} current={98200} label="Construction d'abris" />
                <DonationProgress goal={80000} current={61500} label="Formation enseignants" />
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.25rem",
                    backgroundColor: "rgba(251,191,36,0.12)",
                    borderRadius: "1rem",
                    border: `1px solid rgba(251,191,36,0.25)`,
                  }}
                >
                  <div style={{ fontFamily: C.headingFont, fontSize: "1.5rem", color: C.accent, fontWeight: 700 }}>690 000 €</div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", marginTop: "0.2rem" }}>collectés en 2026 — objectif 930 000 €</div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── IMPACT COUNTERS ── */}
      <section id="impact" style={{ padding: "6rem 2rem", backgroundColor: C.bgDark }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.white, fontWeight: 900, marginBottom: "0.8rem" }}>
                Notre impact en chiffres
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: "rgba(255,255,255,0.6)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
                Des résultats concrets, vérifiables, depuis 2003.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { target: 127000, label: "enfants aidés directement", suffix: "+", icon: <Users size={24} />, color: "#3b82f6" },
              { target: 147, label: "salles de classe construites", suffix: "", icon: <BookOpen size={24} />, color: "#10b981" },
              { target: 3200000, label: "repas distribués par an", suffix: "", icon: <Utensils size={24} />, color: C.accent },
              { target: 8200, label: "familles relogées", suffix: "", icon: <Home size={24} />, color: "#f43f5e" },
              { target: 2400, label: "enseignants formés", suffix: "", icon: <Star size={24} />, color: "#8b5cf6" },
              { target: 14, label: "pays d'intervention", suffix: "", icon: <Globe size={24} />, color: "#06b6d4" },
            ].map((item, i) => (
              <SectionReveal key={item.label} delay={i * 0.07}>
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: item.color, display: "flex", justifyContent: "center", marginBottom: "1rem" }}>{item.icon}</div>
                  <div style={{ fontFamily: C.headingFont, fontSize: "2.4rem", fontWeight: 900, color: C.white }}>
                    <AnimatedCounter target={item.target} suffix={item.suffix} />
                  </div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: "0.4rem", lineHeight: 1.5 }}>
                    {item.label}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="programmes" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bgDark }}>
                Nos programmes
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.text, fontWeight: 900, margin: "0.6rem 0" }}>
                Trois axes d'action, un seul objectif
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
            {programs.map((prog, i) => (
              <SectionReveal key={prog.title} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: C.white,
                    borderRadius: "1.75rem",
                    padding: "2.5rem",
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: `0 2px 24px ${C.shadow}`,
                  }}
                >
                  <div
                    style={{
                      width: 56, height: 56,
                      borderRadius: "1rem",
                      backgroundColor: `${prog.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: prog.color,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {prog.icon}
                  </div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.text, fontWeight: 700, marginBottom: "0.9rem" }}>
                    {prog.title}
                  </h3>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.8, flex: 1 }}>
                    {prog.desc}
                  </p>
                  <div
                    style={{
                      marginTop: "1.75rem",
                      padding: "0.7rem 1.1rem",
                      backgroundColor: `${prog.color}10`,
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <TrendingUp size={14} color={prog.color} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: prog.color, fontWeight: 700 }}>{prog.stats}</span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section id="temoignages" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bgDark }}>
                Histoires du terrain
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.text, fontWeight: 900, margin: "0.6rem 0" }}>
                Derrière chaque chiffre, une vie
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {stories.map((story, i) => (
              <SectionReveal key={story.name} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: story.bg,
                    borderRadius: "1.75rem",
                    padding: "2.5rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: story.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    {story.country}
                  </div>
                  <p style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.text, lineHeight: 1.75, flex: 1, fontStyle: "italic" }}>
                    "{story.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                    <div
                      style={{
                        width: 46, height: 46,
                        borderRadius: "50%",
                        backgroundColor: story.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: C.headingFont,
                        fontSize: "1rem",
                        color: C.white,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {story.initial}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{story.name}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.1rem" }}>{story.country}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATION TIERS ── */}
      <section id="dons" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bgDark }}>
                Faire un don
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.text, fontWeight: 900, margin: "0.6rem 0 1rem" }}>
                Choisissez votre engagement mensuel
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
                Chaque euro compte. Déductible à 66% de vos impôts. Annulable à tout moment.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {donationTiers.map((tier, i) => (
              <SectionReveal key={tier.label} delay={i * 0.08}>
                <div
                  style={{
                    backgroundColor: tier.color,
                    borderRadius: "1.75rem",
                    padding: "2.25rem",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    border: tier.textColor === C.text ? `2px solid ${C.border}` : "none",
                  }}
                >
                  {tier.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-13px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: C.accent,
                        color: C.bgDeep,
                        padding: "0.28rem 1.1rem",
                        borderRadius: "2rem",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        fontFamily: C.bodyFont,
                        whiteSpace: "nowrap",
                      }}
                    >
                      LE PLUS POPULAIRE
                    </div>
                  )}
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, color: tier.textColor, opacity: tier.textColor === C.text ? 0.55 : 0.65, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {tier.label}
                  </div>
                  <div style={{ fontFamily: C.headingFont, fontSize: "3rem", fontWeight: 900, color: tier.textColor === C.text ? C.bgDark : tier.accent, margin: "0.4rem 0 0.25rem" }}>
                    {tier.amount}€
                    <span style={{ fontSize: "1rem", fontFamily: C.bodyFont, fontWeight: 400, opacity: 0.6 }}>/mois</span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: tier.textColor, opacity: 0.75, lineHeight: 1.65, margin: "0.75rem 0 1.5rem", flex: 1 }}>
                    {tier.desc}
                  </p>
                  <div
                    style={{
                      padding: "0.65rem 1rem",
                      backgroundColor: tier.textColor === C.text ? `${C.bgDark}12` : "rgba(255,255,255,0.12)",
                      borderRadius: "0.75rem",
                      marginBottom: "1.5rem",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    <Gift size={14} color={tier.textColor === C.text ? C.bgDark : tier.accent} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: tier.textColor === C.text ? C.bgDark : tier.accent, fontWeight: 700 }}>
                      {tier.impact}
                    </span>
                  </div>
                  <a
                    href="#"
                    style={{
                      display: "block",
                      textAlign: "center",
                      backgroundColor: tier.popular ? C.accent : tier.textColor === C.text ? C.bgDark : "rgba(255,255,255,0.18)",
                      color: tier.popular ? C.bgDeep : tier.textColor === C.text ? C.white : tier.textColor,
                      padding: "0.9rem",
                      borderRadius: "1rem",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontFamily: C.bodyFont,
                      fontSize: "0.9rem",
                    }}
                  >
                    Je donne {tier.amount}€/mois
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bgDark }}>
                Questions fréquentes
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.7rem)", color: C.text, fontWeight: 900, margin: "0.6rem 0 0" }}>
                Tout ce que vous devez savoir
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </SectionReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: C.bgDeep, padding: "5rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.35rem" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={18} color={C.accent} fill={C.accent} />
                </div>
                <div>
                  <div style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.white, fontWeight: 700 }}>Lumière d'Espoir</div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>ONG humanitaire</div>
                </div>
              </div>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 290 }}>
                Fondée en 2003, Lumière d'Espoir agit dans 14 pays pour garantir éducation, nutrition et abri aux enfants les plus vulnérables.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <MapPin size={13} />, text: "12 rue de la Solidarité, 75011 Paris" },
                  { icon: <Phone size={13} />, text: "+33 1 42 88 00 12" },
                  { icon: <Mail size={13} />, text: "contact@lumiere-despoir.org" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Organisation", links: ["Notre histoire", "Équipe dirigeante", "Rapport annuel", "Certifications"] },
              { title: "Agir", links: ["Faire un don", "Devenir parrain", "Léguer à l'ONG", "Entreprises partenaires"] },
              { title: "Ressources", links: ["Blog terrain", "Médias & presse", "Programme éducatif", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "0.95rem", color: C.white, fontWeight: 700, marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(255,255,255,0.28)" }}>
              © 2026 Lumière d'Espoir — Association loi 1901 — RNA W751234567 — Don en Confiance
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {["Mentions légales", "Confidentialité", "Statuts"].map((l) => (
                <a key={l} href="#" style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(255,255,255,0.28)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
