"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, ChevronDown, ChevronRight, Calendar, Leaf, Heart } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, BreathingCircle, FloatingLotus, TESTIMONIALS, FAQS } from "./shared";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);

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
            <span style={{ color: C.sage, fontSize: 13, fontWeight: 600 }}>Studio certifié Yoga Alliance</span>
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
            Ananda Flow vous invite à un voyage vers la sérénité. Cours de yoga, méditation et
            pranayama pour tous les niveaux, dans un cadre chaleureux au cœur de Lyon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
          >
            <Link href="/templates/impact-31/pricing" style={{ textDecoration: "none" }}>
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BreathingCircle />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const stats = [
    { value: "850+", label: "Élèves actifs" },
    { value: "12", label: "Professeurs certifiés" },
    { value: "30+", label: "Cours par semaine" },
    { value: "4.8★", label: "Note Google" },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "90px 80px",
        background: `linear-gradient(135deg, ${C.text} 0%, #5a3a28 100%)`,
        fontFamily: FONT_BODY,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
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

// ─── Testimonials ─────────────────────────────────────────────────────────────
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnandaFlowHome() {
  return (
    <>
      <Hero />
      <Stats />
      <Testimonials />
      <FAQ />
    </>
  );
}
