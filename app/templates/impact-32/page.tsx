"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, Calendar, Phone, Stethoscope, Syringe, Heart, Award, Users, Star,
  ChevronDown, ArrowRight, CheckCircle, Clock, MapPin, Zap, Activity,
  ThumbsUp, AlertCircle, Microscope
} from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import {
  C, FONT, SectionBadge, PetTabs,
  SERVICES_DATA, TEAM_DATA, TESTIMONIALS, FAQS
} from "./shared";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS_BAR = [
  { value: "1 400+", label: "Consultations / an", icon: <Stethoscope size={22} color={C.accent} /> },
  { value: "24h/7j", label: "Service urgences", icon: <AlertCircle size={22} color={C.sand} /> },
  { value: "6", label: "Vétérinaires", icon: <Users size={22} color={C.accent} /> },
  { value: "18 ans", label: "D'expérience", icon: <Award size={22} color={C.accent} /> },
];

const ANIMALS_DATA = [
  {
    emoji: "🐕",
    label: "Chiens",
    desc: "Toutes races, du chiot au senior. Médecine préventive, chirurgie, oncologie.",
    tags: ["Consultation", "Vaccination", "Chirurgie", "Dentisterie"],
    color: C.accent,
  },
  {
    emoji: "🐈",
    label: "Chats",
    desc: "Soins félins adaptés. Identification, stérilisation, pathologies chroniques.",
    tags: ["Primo-vaccination", "Puce électronique", "Diabète félin", "Castration"],
    color: "#4a7aa0",
  },
  {
    emoji: "🐇",
    label: "Lapins",
    desc: "Dr. Sall est spécialisée lapins — stérilisation, entérotoxémie, soins dentaires.",
    tags: ["Stérilisation", "Dentisterie", "Chirurgie douce", "Nutrition"],
    color: "#7a5ea0",
  },
  {
    emoji: "🦎",
    label: "NAC & Reptiles",
    desc: "Oiseaux, rongeurs, reptiles, poissons — consultation et chirurgie spécialisées.",
    tags: ["Oiseaux", "Reptiles", "Amphibiens", "Rongeurs"],
    color: "#a05e5e",
  },
];

const EXTENDED_TESTIMONIALS = [
  {
    name: "Julie & Max",
    animal: "Border Collie, 4 ans",
    text: "L'équipe PawCare a sauvé la vie de Max lors d'une urgence nocturne. Réactivité exemplaire, soins impeccables. Nous ne changerons jamais de clinique.",
    stars: 5,
    photo: "photo-1587300003388-59208cc962cb",
  },
  {
    name: "Antoine Berniers",
    animal: "2 chats, Milo & Pixel",
    text: "Dr. Fontaine est une perle. Elle prend le temps d'expliquer chaque diagnostic, elle est douce et toujours disponible pour nos questions.",
    stars: 5,
    photo: "photo-1514888286974-6c03e2ca1dba",
  },
  {
    name: "Léa Marchand",
    animal: "Noisette, lapine angora",
    text: "Difficile de trouver un vétérinaire pour les lapins. Dr. Sall est une vraie spécialiste NAC — Noisette est en parfaite santé grâce à elle !",
    stars: 5,
    photo: "photo-1585110396000-c9ffd4e4b308",
  },
  {
    name: "Marc & Sasha",
    animal: "Berger Australien, 7 ans",
    text: "Nous venons de Paris exprès pour consulter Dr. Leroy en cardiologie. Son expertise a permis de diagnostiquer une anomalie cardiaque avant qu'elle ne devienne critique.",
    stars: 5,
    photo: "photo-1560807707-8cc77767d783",
  },
  {
    name: "Sophie Girard",
    animal: "Ara de Buffon, Coco",
    text: "Un vétérinaire qui connaît les perroquets c'est rare ! Dr. Sall a diagnostiqué une infection fongique en quelques minutes. Coco va très bien maintenant.",
    stars: 5,
    photo: "photo-1552728089-57bdde30beb3",
  },
];

const APPOINTMENT_SLOTS = [
  { day: "Lundi", date: "23 juin", slots: ["08:30", "10:00", "14:30", "16:00"] },
  { day: "Mardi", date: "24 juin", slots: ["09:00", "11:00", "15:00", "17:30"] },
  { day: "Mercredi", date: "25 juin", slots: ["08:30", "09:30", "14:00"] },
  { day: "Jeudi", date: "26 juin", slots: ["10:00", "11:30", "15:00", "16:30"] },
  { day: "Vendredi", date: "27 juin", slots: ["09:00", "14:00", "17:00"] },
];

const CLINIC_FEATURES = [
  { icon: <Microscope size={20} color={C.accent} />, title: "Bloc opératoire équipé", desc: "Monitoring cardiaque, respirateur, écho Doppler, salle de réveil soins intensifs." },
  { icon: <Activity size={20} color={C.accent} />, title: "Imagerie médicale", desc: "Radiographie numérique, échographie abdominale et cardiaque, endoscopie." },
  { icon: <Zap size={20} color={C.sand} />, title: "Laboratoire embarqué", desc: "Résultats bilan sanguin en 45 min. Urinalyse, cytologie, bactériologie sur place." },
  { icon: <ThumbsUp size={20} color={C.accent} />, title: "Hospitalisation", desc: "Boxes individuels climatisés 24h/24. Suivi continu avec caméra de surveillance." },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        height: "115vh",
        minHeight: "900px",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80"
          alt="Clinique vétérinaire PawCare"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,20,15,0.92) 0%, rgba(5,20,15,0.45) 45%, rgba(5,20,15,0.08) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />

      <motion.div
        style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "7px 16px",
            marginBottom: 24,
          }}
        >
          <Shield size={14} color="#fff" />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Clinique vétérinaire agréée CNOV</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontSize: "clamp(42px, 5vw, 68px)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: -2,
            marginBottom: 24,
          }}
        >
          Vos animaux méritent{" "}
          <span style={{ color: C.accent }}>le meilleur soin</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          style={{ fontSize: 18, color: "rgba(255,255,255,0.80)", lineHeight: 1.72, marginBottom: 36, maxWidth: 490 }}
        >
          PawCare Clinic, c'est une équipe de 6 vétérinaires passionnés à Bordeaux, dédiée à la
          santé et au bonheur de vos compagnons à poils, plumes ou écailles depuis 18 ans.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}
        >
          <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "16px 34px",
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT,
                boxShadow: `0 8px 32px ${C.accent}55`,
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar size={19} /> Prendre RDV
            </motion.button>
          </Link>
          <Link href="/templates/impact-32/contact" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.30)",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT,
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ background: "rgba(255,255,255,0.20)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> Urgences 24h
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: 36 }}
        >
          {[
            { value: "3 500+", label: "Animaux soignés" },
            { value: "4.8★", label: "Note Google" },
            { value: "18 ans", label: "D'expertise" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.60)" }}>{s.label}</div>
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

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      style={{
        background: C.white,
        borderTop: `3px solid ${C.accent}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 80px",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
        {STATS_BAR.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            style={{
              padding: "32px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: C.bgSection,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: -0.5, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
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
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="Nos services" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Des soins adaptés à chaque animal
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Technologies de pointe, équipe bienveillante — pour que votre compagnon soit entre les meilleures mains.
        </p>
      </motion.div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          maxWidth: 1100,
          margin: "0 auto 48px",
        }}
      >
        {SERVICES_DATA.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: s.urgent ? C.text : C.white,
              borderRadius: 18,
              padding: "28px 26px",
              border: `1px solid ${s.urgent ? C.text : C.border}`,
              boxShadow: C.shadow,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: s.urgent ? C.sand : C.accentLight,
                color: s.urgent ? C.white : C.accent,
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
                width: 52,
                height: 52,
                background: s.urgent ? "rgba(255,255,255,0.12)" : C.accentLight,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              {s.urgent ? <Heart size={26} color="#fff" /> : s.icon}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: s.urgent ? C.white : C.text, marginBottom: 10 }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 14, color: s.urgent ? "rgba(255,255,255,0.7)" : C.textMuted, lineHeight: 1.65 }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/services" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "14px 32px",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Voir tous nos services <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { value: "3 500+", label: "Animaux soignés / an", icon: "🐾" },
    { value: "4.8/5", label: "Note Google Maps", icon: "⭐" },
    { value: "18 ans", label: "D'expertise vétérinaire", icon: "🏆" },
    { value: "24h/7j", label: "Service urgences", icon: "🚨" },
  ];
  return (
    <section
      ref={ref}
      style={{
        padding: "90px 80px",
        background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 40,
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ marginBottom: 12 }}>
              <TemplateIcon emoji={s.icon} size={36} />
            </div>
            <div
              style={{
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 900,
                color: C.white,
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Animals We Treat ─────────────────────────────────────────────────────────
function AnimalsWeTreat() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeAnimal, setActiveAnimal] = useState(0);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 56 }}
      >
        <SectionBadge label="Nos patients" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Chiens, chats, lapins & NAC
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Notre équipe pluridisciplinaire prend en charge toutes les espèces avec la même rigueur et la même bienveillance.
        </p>
      </motion.div>

      {/* Animal selector tabs */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
        {ANIMALS_DATA.map((a, i) => (
          <motion.button
            key={a.label}
            type="button"
            onClick={() => setActiveAnimal(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: activeAnimal === i ? C.accent : C.white,
              color: activeAnimal === i ? C.white : C.text,
              border: `2px solid ${activeAnimal === i ? C.accent : C.border}`,
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
          >
            <TemplateIcon emoji={a.emoji} size={18} />
            {a.label}
          </motion.button>
        ))}
      </div>

      {/* Animal detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAnimal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: C.bgSection,
            borderRadius: 24,
            padding: "48px",
            border: `1px solid ${C.border}`,
            display: "flex",
            gap: 48,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 72, flexShrink: 0 }}>
            <TemplateIcon emoji={ANIMALS_DATA[activeAnimal].emoji} size={72} />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: ANIMALS_DATA[activeAnimal].color,
                marginBottom: 12,
              }}
            >
              {ANIMALS_DATA[activeAnimal].label}
            </h3>
            <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
              {ANIMALS_DATA[activeAnimal].desc}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ANIMALS_DATA[activeAnimal].tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle size={12} color={C.accent} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ─── Clinic Features ──────────────────────────────────────────────────────────
function ClinicFeatures() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 80px",
        background: C.bgSection,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="Nos équipements" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Un plateau technique de haut niveau
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Nos installations répondent aux standards des hôpitaux vétérinaires universitaires pour des diagnostics précis et des soins sécurisés.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {CLINIC_FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 18,
              padding: "32px 28px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                background: C.accentLight,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 10 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{f.desc}</p>
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
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="Notre équipe" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des vétérinaires passionnés
        </h2>
      </motion.div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          maxWidth: 960,
          margin: "0 auto 48px",
        }}
      >
        {TEAM_DATA.slice(0, 3).map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: C.bgSection,
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
            <h3 style={{ fontSize: 19, fontWeight: 800, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 700, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div
              style={{
                display: "inline-block",
                background: C.accentLight,
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: C.accent,
              }}
            >
              {doc.exp} d'expérience
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/equipe" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            style={{
              background: "transparent",
              color: C.accent,
              border: `2px solid ${C.accent}`,
              borderRadius: 10,
              padding: "13px 32px",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            whileHover={{ background: C.accentLight, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Rencontrer toute l'équipe <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Testimonials (extended, 5 cards) ─────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="Témoignages" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des propriétaires heureux
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "16px auto 0" }}>
          Plus de 2 400 avis — une note de 4.8/5 sur Google Maps
        </p>
      </motion.div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {EXTENDED_TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: C.white,
              borderRadius: 18,
              padding: 28,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            {/* Animal photo */}
            <div
              style={{
                width: "100%",
                height: 160,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 20,
                background: C.bgSection,
              }}
            >
              <img
                src={`https://images.unsplash.com/${t.photo}?w=600&q=80&fit=crop`}
                alt={t.animal}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => (
                <Star key={k} size={14} color="#f59e0b" fill="#f59e0b" />
              ))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>
              "{t.text}"
            </p>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.accent }}>— {t.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.animal}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Appointment CTA with calendar preview ────────────────────────────────────
function AppointmentCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 80px",
        background: `linear-gradient(140deg, ${C.accentDark} 0%, ${C.accent} 100%)`,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            color: C.white,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase" as const,
            letterSpacing: 0.8,
          }}
        >
          Prise de rendez-vous
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.white,
            letterSpacing: -1,
            marginBottom: 14,
          }}
        >
          Choisissez votre créneau
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", maxWidth: 480, margin: "0 auto" }}>
          Confirmé par email sous 2h ouvrées. Annulation gratuite jusqu'à 24h avant.
        </p>
      </motion.div>

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: C.white,
          borderRadius: 24,
          padding: "40px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Day selector */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
          {APPOINTMENT_SLOTS.map((day, i) => (
            <motion.button
              key={day.day}
              type="button"
              onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flexShrink: 0,
                background: selectedDay === i ? C.accent : C.bgSection,
                color: selectedDay === i ? C.white : C.text,
                border: `1.5px solid ${selectedDay === i ? C.accent : C.border}`,
                borderRadius: 12,
                padding: "12px 20px",
                fontFamily: FONT,
                cursor: "pointer",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 14 }}>{day.day}</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{day.date}</div>
            </motion.button>
          ))}
        </div>

        {/* Time slots */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, marginBottom: 14, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
            Créneaux disponibles
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {APPOINTMENT_SLOTS[selectedDay].slots.map((slot) => (
              <motion.button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: selectedSlot === slot ? C.accent : C.white,
                  color: selectedSlot === slot ? C.white : C.text,
                  border: `1.5px solid ${selectedSlot === slot ? C.accent : C.border}`,
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: FONT,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                <Clock size={14} />
                {slot}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info + CTA */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.textMuted }}>
              <MapPin size={14} color={C.accent} /> 15 Rue des Platanes, Bordeaux
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.textMuted }}>
              <Clock size={14} color={C.accent} /> Durée : 20–30 min
            </div>
          </div>
          <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ background: C.accentDark, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={16} />
              {selectedSlot
                ? `Confirmer ${APPOINTMENT_SLOTS[selectedDay].day} à ${selectedSlot}`
                : "Sélectionner un créneau"}
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Urgences strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        style={{
          maxWidth: 860,
          margin: "24px auto 0",
          background: "#dc2626",
          borderRadius: 14,
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <AlertCircle size={20} color="#fff" />
        <div style={{ flex: 1 }}>
          <span style={{ color: C.white, fontWeight: 800, fontSize: 15 }}>Urgence vétérinaire ? </span>
          <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 14 }}>
            Notre ligne urgences est disponible 24h/24, 7j/7. Intervention en moins de 30 minutes.
          </span>
        </div>
        <a
          href="tel:+33556000000"
          style={{
            background: C.white,
            color: "#dc2626",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 800,
            fontSize: 14,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Phone size={14} /> Appeler maintenant
        </a>
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
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="FAQ" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Questions fréquentes
        </h2>
      </motion.div>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
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
              type="button"
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
                textAlign: "left" as const,
                fontFamily: FONT,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PawCareHome() {
  return (
    <>
      <Hero />
      <StatsBar />
      <section style={{ padding: "60px 80px", background: C.bg, display: "flex", justifyContent: "center" }}>
        <PetTabs />
      </section>
      <HomeServices />
      <Stats />
      <AnimalsWeTreat />
      <ClinicFeatures />
      <HomeTeam />
      <Testimonials />
      <AppointmentCTA />
      <FAQ />
    </>
  );
}
