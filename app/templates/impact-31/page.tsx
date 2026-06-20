"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
  Star,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Leaf,
  Heart,
  Wind,
  Sunrise,
  Moon,
  Users,
  Award,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";
import {
  C,
  FONT_HEADING,
  FONT_BODY,
  BreathingCircle,
  FloatingLotus,
  TESTIMONIALS,
  FAQS,
  SERVICES,
  INSTRUCTORS,
  WEEK_SCHEDULE,
  STATS_TICKER,
  HOME_PLANS,
} from "./shared";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "calc(100vh - 72px)",
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgLight} 60%, ${C.sageLight} 100%)`,
        display: "flex",
        alignItems: "center",
        padding: "60px 80px",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT_BODY,
      }}
    >
      {/* Parallax background organic shape */}
      <motion.div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: "60% 40% 70% 30%",
          background: C.sageLight,
          opacity: 0.6,
          zIndex: 0,
          y: bgY,
        }}
        animate={{ borderRadius: ["60% 40% 70% 30%", "40% 60% 30% 70%", "60% 40% 70% 30%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Second decorative blob */}
      <motion.div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 360,
          height: 360,
          borderRadius: "40% 60% 50% 50%",
          background: C.accentLight,
          opacity: 0.45,
          zIndex: 0,
          y: bgY,
        }}
        animate={{ borderRadius: ["40% 60% 50% 50%", "60% 40% 50% 50%", "40% 60% 50% 50%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingLotus />

      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40, zIndex: 1 }}>
        {/* Left: text */}
        <motion.div
          style={{ flex: "1 1 500px", maxWidth: 580, position: "relative", zIndex: 2, y: textY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.sageLight,
              border: `1px solid ${C.sage}`,
              borderRadius: 20,
              padding: "7px 16px",
              marginBottom: 28,
            }}
          >
            <Leaf size={14} color={C.sage} />
            <span style={{ color: C.sage, fontSize: 13, fontWeight: 600 }}>Studio certifié Yoga Alliance RYT-500</span>
          </motion.div>

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
          >
            Trouvez votre{" "}
            <em style={{ color: C.accent, fontStyle: "italic" }}>équilibre intérieur</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 17, color: C.textMuted, lineHeight: 1.78, marginBottom: 36, maxWidth: 480 }}
          >
            Ananda Flow vous invite à un voyage vers la sérénité. Yoga, méditation et
            pranayama pour tous les niveaux, dans un cadre chaleureux au cœur de Lyon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
          >
            <Link href="/templates/impact-31/contact" style={{ textDecoration: "none" }}>
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
            </Link>
            <Link href="/templates/impact-31/cours" style={{ textDecoration: "none" }}>
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
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            {[
              { value: "850+", label: "Élèves actifs" },
              { value: "12", label: "Professeurs certifiés" },
              { value: "30+", label: "Cours / semaine" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 24, color: C.accent }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: breathing circle */}
        <motion.div
          style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <BreathingCircle />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Défiler</span>
        <ChevronDown size={18} color={C.textMuted} />
      </motion.div>
    </section>
  );
}

// ─── Stats Ticker ─────────────────────────────────────────────────────────────
function StatsTicker() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "80px 80px",
        background: `linear-gradient(135deg, ${C.text} 0%, #5a3a28 100%)`,
        fontFamily: FONT_BODY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative circle */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(192,97,74,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(107,143,107,0.1)", pointerEvents: "none" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {STATS_TICKER.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(192,97,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
              {s.icon}
            </div>
            <motion.div
              style={{ fontFamily: FONT_HEADING, fontSize: "clamp(30px, 3vw, 48px)", fontWeight: 700, color: C.white }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
            >
              {s.value}
            </motion.div>
            <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 14, maxWidth: 140, lineHeight: 1.4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Services Grid ────────────────────────────────────────────────────────────
function ServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Nos disciplines
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Six chemins vers la sérénité
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          Que vous soyez débutant ou pratiquant avancé, chaque discipline vous offre une voie unique vers l'équilibre corps-esprit.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: C.bgSection,
              borderRadius: 20,
              padding: "36px 32px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              cursor: "default",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: service.bgIcon, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {service.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 2 }}>{service.name}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: service.levelColor, background: service.levelBg, borderRadius: 20, padding: "2px 10px" }}>{service.level}</span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.72, marginBottom: 20 }}>{service.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {service.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 12, color: C.textMuted, background: C.bgLight, borderRadius: 20, padding: "4px 12px", border: `1px solid ${C.border}` }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted }}>
                <Clock size={14} color={C.textMuted} />
                {service.duration}
              </div>
              <Link href="/templates/impact-31/cours" style={{ textDecoration: "none" }}>
                <motion.span
                  style={{ fontSize: 13, fontWeight: 700, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}
                  whileHover={{ gap: 8 }}
                >
                  Voir les cours <ArrowRight size={14} />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Instructors Section ──────────────────────────────────────────────────────
function InstructorsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: `linear-gradient(180deg, ${C.bgLight} 0%, ${C.bg} 100%)`, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          L'équipe
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Vos guides sur le chemin
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          Nos professeurs certifiés apportent des années de pratique et de pédagogie bienveillante pour vous accompagner à votre rythme.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
        {INSTRUCTORS.map((inst, i) => (
          <motion.div
            key={inst.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 24, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            {/* Photo area */}
            <div style={{ position: "relative", height: 220, background: `linear-gradient(135deg, ${inst.bgFrom}, ${inst.bgTo})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={inst.photo}
                alt={inst.name}
                style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.white}`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              />
              <div style={{ position: "absolute", top: 16, right: 16, background: C.white, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: inst.accentColor }}>
                {inst.cert}
              </div>
            </div>
            {/* Info */}
            <div style={{ padding: "24px 28px 28px" }}>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>{inst.name}</h3>
              <div style={{ fontSize: 14, fontWeight: 600, color: inst.accentColor, marginBottom: 14 }}>{inst.role}</div>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 16 }}>{inst.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {inst.specialties.map((sp) => (
                  <span key={sp} style={{ fontSize: 12, background: C.sageLight, color: C.sage, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                    {sp}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted }}>
                <Award size={14} color={C.sage} />
                <span>{inst.experience}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        style={{ textAlign: "center", marginTop: 48 }}
      >
        <Link href="/templates/impact-31/professeurs" style={{ textDecoration: "none" }}>
          <motion.button
            style={{
              background: "transparent",
              color: C.text,
              border: `1.5px solid ${C.border}`,
              borderRadius: 30,
              padding: "14px 32px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT_BODY,
            }}
            whileHover={{ borderColor: C.accent, color: C.accent }}
            whileTap={{ scale: 0.97 }}
          >
            Voir toute l'équipe <ChevronRight size={16} />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── Schedule Section ─────────────────────────────────────────────────────────
type TimeFilter = "all" | "morning" | "noon" | "evening";

function ScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [filter, setFilter] = useState<TimeFilter>("all");

  const filters: { key: TimeFilter; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Tous", icon: <Sparkles size={14} /> },
    { key: "morning", label: "Matin", icon: <Sunrise size={14} /> },
    { key: "noon", label: "Midi", icon: <Wind size={14} /> },
    { key: "evening", label: "Soir", icon: <Moon size={14} /> },
  ];

  const filtered = filter === "all" ? WEEK_SCHEDULE : WEEK_SCHEDULE.filter((c) => c.period === filter);

  const levelBadge = (level: string) => {
    if (level === "Débutant") return { bg: C.sageLight, color: C.sage };
    if (level === "Avancé") return { bg: C.accentLight, color: C.accent };
    return { bg: C.bgLight, color: C.textMuted };
  };

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Planning
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Cours de la semaine
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
          Des sessions adaptées à tous les rythmes de vie — matin, midi ou soir.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 44, flexWrap: "wrap" }}
      >
        {filters.map((f) => (
          <motion.button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 25,
              border: `1.5px solid ${filter === f.key ? C.accent : C.border}`,
              background: filter === f.key ? C.accent : C.white,
              color: filter === f.key ? C.white : C.textMuted,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              transition: "all 0.2s",
            }}
            whileTap={{ scale: 0.96 }}
          >
            {f.icon}
            {f.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}
        >
          {filtered.map((cls, i) => {
            const badge = levelBadge(cls.level);
            return (
              <motion.div
                key={`${cls.day}-${cls.time}-${cls.name}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, boxShadow: C.shadowLg }}
                style={{ background: C.white, borderRadius: 16, padding: "24px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{cls.day}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: FONT_HEADING }}>{cls.time}</div>
                  </div>
                  <div style={{ background: C.accentLight, borderRadius: 10, padding: "7px 9px" }}>{cls.icon}</div>
                </div>
                <h3 style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{cls.name}</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, background: badge.bg, color: badge.color, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>{cls.level}</span>
                  <span style={{ fontSize: 13, color: C.textMuted }}>avec {cls.teacher}</span>
                  <span style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {cls.duration}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: cls.spots <= 3 ? C.accent : C.textMuted, fontWeight: cls.spots <= 3 ? 700 : 400 }}>
                    {cls.spots <= 3 ? `⚡ ${cls.spots} places restantes` : `${cls.spots} places disponibles`}
                  </span>
                  <Link href="/templates/impact-31/contact" style={{ textDecoration: "none" }}>
                    <motion.button
                      style={{ background: C.accent, color: C.white, border: "none", borderRadius: 20, padding: "7px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT_BODY }}
                      whileHover={{ background: C.accentDark, scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Réserver
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        style={{ textAlign: "center", marginTop: 44 }}
      >
        <Link href="/templates/impact-31/cours" style={{ textDecoration: "none" }}>
          <motion.button
            style={{ background: "transparent", color: C.accent, border: `1.5px solid ${C.accent}`, borderRadius: 30, padding: "13px 30px", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentLight }}
            whileTap={{ scale: 0.97 }}
          >
            Planning complet <ChevronRight size={16} />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── Testimonials Carousel ─────────────────────────────────────────────────────
function TestimonialsCarousel() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Témoignages
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Ils ont trouvé leur équilibre
        </h2>
      </motion.div>

      {/* Featured large testimonial */}
      <div style={{ maxWidth: 820, margin: "0 auto 40px", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            style={{ background: C.white, borderRadius: 24, padding: "48px 52px", border: `1px solid ${C.border}`, boxShadow: C.shadowLg, textAlign: "center" }}
          >
            <div style={{ fontSize: 56, color: C.accentLight, fontFamily: FONT_HEADING, lineHeight: 1, marginBottom: 8 }}>"</div>
            <p style={{ fontSize: 19, color: C.text, lineHeight: 1.78, fontStyle: "italic", marginBottom: 32, fontFamily: FONT_HEADING, fontWeight: 400 }}>
              {TESTIMONIALS[current].text}
            </p>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
              {Array.from({ length: TESTIMONIALS[current].stars }).map((_, k) => (
                <Star key={k} size={18} color="#d4832a" fill="#d4832a" />
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>{TESTIMONIALS[current].name}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{TESTIMONIALS[current].practice}</div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <motion.button
          onClick={prev}
          style={{ position: "absolute", left: -24, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: C.white, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadow, zIndex: 2 }}
          whileHover={{ scale: 1.08, boxShadow: C.shadowLg }}
          whileTap={{ scale: 0.94 }}
          aria-label="Précédent"
        >
          <ChevronLeft size={20} color={C.text} />
        </motion.button>
        <motion.button
          onClick={next}
          style={{ position: "absolute", right: -24, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: C.white, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadow, zIndex: 2 }}
          whileHover={{ scale: 1.08, boxShadow: C.shadowLg }}
          whileTap={{ scale: 0.94 }}
          aria-label="Suivant"
        >
          <ChevronRight size={20} color={C.text} />
        </motion.button>
      </div>

      {/* Dots + thumbnail cards */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
        {TESTIMONIALS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, background: i === current ? C.accent : C.border, border: "none", cursor: "pointer", padding: 0, transition: "width 0.25s, background 0.25s" }}
            aria-label={`Témoignage ${i + 1}`}
          />
        ))}
      </div>

      {/* Mini cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.filter((_, i) => i !== current).slice(0, 3).map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            onClick={() => setCurrent(TESTIMONIALS.findIndex((x) => x.name === t.name))}
            style={{ background: C.white, borderRadius: 16, padding: "22px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {Array.from({ length: t.stars }).map((_, k) => <Star key={k} size={13} color="#d4832a" fill="#d4832a" />)}
            </div>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65, fontStyle: "italic", marginBottom: 12 }}>"{t.text.slice(0, 90)}…"</p>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{t.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{t.practice}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing Preview ───────────────────────────────────────────────────────────
function PricingPreview() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Abonnements
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>
          Investissez dans votre bien-être
        </h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>Premier cours d'essai toujours gratuit — Sans engagement</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 1000, margin: "0 auto 48px", alignItems: "start" }}>
        {HOME_PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: p.highlight ? 0 : -4, boxShadow: C.shadowLg }}
            style={{
              background: p.highlight ? C.text : C.bgSection,
              borderRadius: 24,
              padding: "40px 34px",
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
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <CheckCircle size={15} color={p.highlight ? C.accent : C.sage} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/templates/impact-31/pricing" style={{ textDecoration: "none" }}>
              <motion.button
                style={{
                  width: "100%",
                  background: p.highlight ? C.accent : "transparent",
                  color: p.highlight ? C.white : C.text,
                  border: p.highlight ? "none" : `1.5px solid ${C.border}`,
                  borderRadius: 25,
                  padding: "13px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: FONT_BODY,
                }}
                whileHover={{ background: p.highlight ? C.accentDark : C.accentLight, borderColor: C.accent, color: p.highlight ? C.white : C.accent }}
                whileTap={{ scale: 0.97 }}
              >
                {p.cta}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} style={{ textAlign: "center" }}>
        <Link href="/templates/impact-31/pricing" style={{ textDecoration: "none" }}>
          <motion.span
            style={{ fontSize: 15, color: C.accent, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}
            whileHover={{ gap: 10 }}
          >
            Voir tous les abonnements <ArrowRight size={16} />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
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

// ─── Animated CTA Final ────────────────────────────────────────────────────────
function AnimatedCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: `linear-gradient(135deg, ${C.text} 0%, #5a3a28 100%)`, fontFamily: FONT_BODY, position: "relative", overflow: "hidden" }}
    >
      {/* Decorative blobs */}
      <motion.div
        style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(192,97,74,0.12)", pointerEvents: "none" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(107,143,107,0.12)", pointerEvents: "none" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}
      >
        <motion.div
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,97,74,0.2)", border: "1px solid rgba(192,97,74,0.4)", borderRadius: 20, padding: "7px 18px", marginBottom: 28 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Play size={13} color={C.accent} fill={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>Premier cours 100% gratuit</span>
        </motion.div>

        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 20, letterSpacing: -0.5 }}>
          Commencez votre voyage{" "}
          <em style={{ color: C.accent, fontStyle: "italic" }}>dès aujourd'hui</em>
        </h2>

        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.68)", lineHeight: 1.72, marginBottom: 44, maxWidth: 520, margin: "0 auto 44px" }}>
          Rejoignez 850+ élèves qui ont choisi Ananda Flow pour transformer leur vie. Aucun engagement — juste un premier pas vers votre équilibre.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/templates/impact-31/contact" style={{ textDecoration: "none" }}>
            <motion.button
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 30,
                padding: "18px 40px",
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT_BODY,
                boxShadow: "0 8px 32px rgba(192,97,74,0.4)",
              }}
              whileHover={{ background: C.accentDark, scale: 1.05, y: -3, boxShadow: "0 12px 40px rgba(192,97,74,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar size={20} />
              Réserver mon cours d'essai
            </motion.button>
          </Link>
          <Link href="/templates/impact-31/cours" style={{ textDecoration: "none" }}>
            <motion.button
              style={{
                background: "transparent",
                color: C.white,
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 30,
                padding: "17px 32px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_BODY,
              }}
              whileHover={{ borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.97 }}
            >
              Explorer les cours <ChevronRight size={18} />
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" }}
        >
          {[
            { icon: <Users size={16} color="rgba(255,255,255,0.55)" />, text: "850+ membres actifs" },
            { icon: <Star size={16} color="#d4832a" fill="#d4832a" />, text: "4.8/5 sur Google" },
            { icon: <Leaf size={16} color={C.sage} />, text: "RYT-500 certifié" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "rgba(255,255,255,0.55)" }}>
              {item.icon}
              {item.text}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnandaFlowHome() {
  return (
    <>
      <Hero />
      <StatsTicker />
      <ServicesGrid />
      <InstructorsSection />
      <ScheduleSection />
      <TestimonialsCarousel />
      <PricingPreview />
      <FAQ />
      <AnimatedCTA />
    </>
  );
}
