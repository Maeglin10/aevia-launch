"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Shield, Calendar, Phone, Stethoscope, Syringe, Heart, Award, Users, Star, ChevronDown, ArrowRight } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT, SectionBadge, AnimatedPaw, PetTabs, SERVICES_DATA, TEAM_DATA, TESTIMONIALS, FAQS } from "./shared";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "calc(100vh - 72px)", background: `linear-gradient(140deg, ${C.bg} 0%, ${C.accentLight} 100%)`, display: "flex", alignItems: "center", padding: "60px 80px", position: "relative", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 68%)`, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40, zIndex: 1 }}>
        <motion.div style={{ flex: "1 1 500px", maxWidth: 580, position: "relative", zIndex: 1, y: textY, opacity: textOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.accent}`, borderRadius: 20, padding: "7px 16px", marginBottom: 24 }}>
            <Shield size={14} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>Clinique vétérinaire agréée CNOV</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24 }}>
            Vos animaux méritent{" "}<span style={{ color: C.accent }}>le meilleur soin</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.72, marginBottom: 36, maxWidth: 490 }}>
            PawCare Clinic, c'est une équipe de vétérinaires passionnés à Bordeaux, dédiée à la santé et au bonheur de vos compagnons à poils, plumes ou écailles.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
              <motion.button type="button"
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
                whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Calendar size={18} /> Prendre rendez-vous
              </motion.button>
            </Link>
            <Link href="/templates/impact-32/contact" style={{ textDecoration: "none" }}>
              <motion.button type="button"
                style={{ background: C.sandLight, color: C.sand, border: `2px solid ${C.sand}`, borderRadius: 10, padding: "14px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Phone size={16} /> Urgences 24h
              </motion.button>
            </Link>
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
        <motion.div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", alignItems: "center" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <AnimatedPaw />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Home Services Preview ─────────────────────────────────────────────────────
function HomeServices() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Nos services" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>Des soins adaptés à chaque animal</h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>Technologies de pointe, équipe bienveillante — pour que votre compagnon soit entre les meilleures mains.</p>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto 48px" }}>
        {SERVICES_DATA.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 44 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: s.urgent ? C.text : C.white, borderRadius: 18, padding: "28px 26px", border: `1px solid ${s.urgent ? C.text : C.border}`, boxShadow: C.shadow, position: "relative" }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: s.urgent ? C.sand : C.accentLight, color: s.urgent ? C.white : C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{s.tag}</div>
            <div style={{ width: 52, height: 52, background: s.urgent ? "rgba(255,255,255,0.12)" : C.accentLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              {s.urgent ? <Heart size={26} color="#fff" /> : s.icon}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: s.urgent ? C.white : C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: s.urgent ? "rgba(255,255,255,0.7)" : C.textMuted, lineHeight: 1.65 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/services" style={{ textDecoration: "none" }}>
          <motion.button type="button"
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 8 }}
            whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Voir tous nos services <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
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
    <section ref={ref} style={{ padding: "90px 80px", background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`, fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.82 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.icon} size={36} /></div>
            <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, color: C.white, letterSpacing: -1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Team preview (home) ───────────────────────────────────────────────────────
function HomeTeam() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Notre équipe" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Des vétérinaires passionnés</h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 960, margin: "0 auto 48px" }}>
        {TEAM_DATA.slice(0, 3).map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 44 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.12 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 20, padding: 32, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: doc.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, fontWeight: 800, color: C.white, letterSpacing: 1 }}>{doc.initials}</div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 700, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div style={{ display: "inline-block", background: C.accentLight, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: C.accent }}>{doc.exp} d'expérience</div>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/equipe" style={{ textDecoration: "none" }}>
          <motion.button type="button"
            style={{ background: "transparent", color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "13px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 8 }}
            whileHover={{ background: C.accentLight, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Rencontrer toute l'équipe <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Témoignages" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Des propriétaires heureux</h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => <Star key={k} size={14} color="#f59e0b" fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.accent }}>— {t.name}</div>
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
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="FAQ" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Questions fréquentes</h2>
      </motion.div>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT }}>
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

export default function PawCareHome() {
  return (
    <>
      <Hero />
      <section style={{ padding: "60px 80px", background: C.bg, display: "flex", justifyContent: "center" }}>
        <PetTabs />
      </section>
      <HomeServices />
      <Stats />
      <HomeTeam />
      <Testimonials />
      <FAQ />
    </>
  );
}
