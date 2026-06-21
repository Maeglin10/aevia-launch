"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Leaf, ChevronRight, ShoppingBag, Star, ChevronDown, Award, Users, Heart } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT_HEADING, FONT_BODY, Marquee, CATEGORIES, TESTIMONIALS, FAQS } from "./shared";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{ height: "115vh", minHeight: "900px", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", fontFamily: FONT_BODY }}
    >
      <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80"
          alt="Boulangerie artisanale La Fournée"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,15,5,0.93) 0%, rgba(30,15,5,0.45) 45%, rgba(30,15,5,0.08) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}22 0%, transparent 55%)` }} />

      <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "7px 16px", marginBottom: 28 }}
        >
          <Leaf size={14} color="#fff" />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Artisan boulanger depuis 1987 · Paris 11e</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          style={{ fontFamily: FONT_HEADING, fontSize: "clamp(42px, 5vw, 72px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 24 }}
        >
          Le pain, l'art,{" "}
          <em style={{ color: C.accent, fontStyle: "italic" }}>la tradition</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }}
          style={{ fontSize: 19, color: "rgba(255,255,255,0.80)", lineHeight: 1.76, marginBottom: 40, maxWidth: 560 }}
        >
          La Fournée, c'est l'amour du pain au levain, des viennoiseries pur beurre et des pâtisseries
          de saison. Tout est fait maison chaque jour dès 4h du matin dans notre fournil ouvert sur la rue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}
        >
          <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 34px", fontWeight: 700, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY, boxShadow: `0 8px 32px ${C.accent}55` }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingBag size={19} /> Commander en ligne
            </motion.button>
          </Link>
          <Link href="/templates/impact-33/boutique" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.30)", borderRadius: 10, padding: "14px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY, backdropFilter: "blur(8px)" }}
              whileHover={{ background: "rgba(255,255,255,0.20)" }}
              whileTap={{ scale: 0.97 }}
            >
              Notre carte <ChevronRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ display: "flex", gap: 36 }}>
          {[{ value: "37 ans", label: "De savoir-faire" }, { value: "4.9★", label: "Google Avis" }, { value: "100%", label: "Fait maison" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 24, color: C.accent }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
      >
        <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Menu Categories (home section) ──────────────────────────────────────────
function MenuSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="menu" ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Notre carte
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Fait avec amour, chaque matin
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
        style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 44 }}
      >
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.name}
            type="button"
            onClick={() => setActiveCategory(i)}
            style={{
              background: activeCategory === i ? C.accent : C.white,
              color: activeCategory === i ? C.white : C.text,
              border: `1.5px solid ${activeCategory === i ? C.accent : C.border}`,
              borderRadius: 25, padding: "10px 22px",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <TemplateIcon emoji={cat.emoji} size={18} />
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}
        >
          {CATEGORIES[activeCategory].items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: C.shadowLg }}
              style={{ background: C.bgSection, borderRadius: 16, padding: "24px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
            >
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 18, fontFamily: FONT_HEADING }}>{item.price}</div>
                <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
                  <motion.button
                    type="button"
                    style={{ background: C.accentLight, color: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT_BODY }}
                    whileHover={{ background: C.accent, color: C.white }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Commander
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div style={{ textAlign: "center", marginTop: 44 }}>
        <Link href="/templates/impact-33/boutique" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            style={{ background: "transparent", color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "13px 30px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY }}
            whileHover={{ background: C.accent, color: C.white }}
            whileTap={{ scale: 0.97 }}
          >
            Voir tout le catalogue →
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────
function Story() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, margin: "0 auto", flexWrap: "wrap" }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Notre histoire
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 24 }}>
            Une boulangerie de quartier, <em style={{ color: C.accent }}>depuis 1987</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
            La Fournée est née de la passion de Marcel Girard pour le pain au levain naturel. À l'époque où les industriels envahissaient les boulangeries, Marcel choisissait l'artisanat, la lenteur et le respect des céréales.
          </p>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32 }}>
            Aujourd'hui, sa fille Camille perpétue cet héritage avec la même exigence : farines Label Rouge, beurre AOP, levain vivant nourri depuis 20 ans. Chaque baguette est façonnée à la main, chaque croissant feuilleté à la main.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { icon: <Leaf size={18} color="#d4832a" />, text: "Farines Bio Label Rouge" },
              { icon: <Heart size={18} color="#d4832a" />, text: "Beurre AOP Poitou" },
              { icon: <Award size={18} color="#d4832a" />, text: "Meilleur artisan 2023" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, lineHeight: 1.3 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {["🥐", "🍞", "🎂", "🥖"].map((emoji, i) => (
            <motion.div
              key={i}
              style={{ background: C.cream, borderRadius: 20, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}
              whileHover={{ scale: 1.05, y: -4 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <TemplateIcon emoji={emoji} size={60} />
            </motion.div>
          ))}
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
    { value: "37 ans", label: "De savoir-faire artisanal", emoji: "🏆" },
    { value: "4.9★", label: "Note Google Maps", emoji: "⭐" },
    { value: "300+", label: "Commandes par jour", emoji: "🥖" },
    { value: "20 ans", label: "Notre levain naturel", emoji: "🌾" },
  ];
  return (
    <section ref={ref} style={{ padding: "90px 80px", background: C.text, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.emoji} size={36} /></div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.white, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>{s.label}</div>
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
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Avis clients
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Ils nous font confiance
        </h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t: { name: string; text: string; stars: number }, i: number) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => (<Star key={k} size={14} color={C.accent} fill={C.accent} />))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.72, marginBottom: 20, fontStyle: "italic", fontFamily: FONT_HEADING }}>"{t.text}"</p>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>— {t.name}</div>
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
          Vos questions, nos réponses
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
              type="button"
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

export default function FourneeHome() {
  return (
    <>
      <Hero />
      <section style={{ padding: "48px 0", background: C.bgSection, overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 28, fontFamily: FONT_HEADING, fontSize: 16, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
          Nos créations du moment
        </div>
        <Marquee />
      </section>
      <MenuSection />
      <Story />
      <Stats />
      <Testimonials />
      <FAQ />
    </>
  );
}
