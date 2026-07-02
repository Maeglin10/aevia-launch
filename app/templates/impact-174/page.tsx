"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Dumbbell, Zap, Target, Timer, Flame, Trophy, Star, ArrowRight,
  ChevronRight, Menu, X, Users, Activity, Heart, Calendar,
  CheckCircle, Clock, MapPin, Phone, Mail, Instagram
} from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROGRAMS = [
  { title: "HIIT Circuit", intensity: "MAX", duration: "45 min", desc: "Intervalles haute intensité conçus pour brûler le maximum de calories et booster votre métabolisme 24h après la séance.", tag: "Bestseller" },
  { title: "Force Brute", intensity: "HIGH", duration: "60 min", desc: "Programme de musculation progressif orienté hypertrophie et développement de la force fonctionnelle.", tag: "Force" },
  { title: "CrossFit FORGE", intensity: "MAX", duration: "50 min", desc: "WODs variés combinant haltérophilie, cardio et mouvements gymnastics. La définition de l'effort total.", tag: "Signature" },
  { title: "Yoga Power", intensity: "MED", duration: "60 min", desc: "Yoga dynamique fusion flow et strength. Flexibilité, équilibre et mental de fer.", tag: "Récupération" },
  { title: "Cardio Boost", intensity: "HIGH", duration: "40 min", desc: "Entraînement cardiovasculaire mixte : vélo, tapis, rameur et corde à sauter en circuit non-stop.", tag: "Cardio" },
  { title: "Récup Active", intensity: "LOW", duration: "45 min", desc: "Stretching profond, mobilité articulaire et techniques de récupération musculaire accélérée.", tag: "Recovery" },
]

const COACHES = [
  {
    name: "Alexis Romain",
    role: "Head Coach — Force & Conditioning",
    certs: "CrossFit L3 · NSCA-CSCS · Olympic Lifting",
    quote: "La force n'est pas un don. C'est une décision que tu renouvelles chaque jour.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Sofia Marchetti",
    role: "Coach HIIT & Nutrition",
    certs: "ACE Certified · Precision Nutrition L2",
    quote: "Chaque répétition est un choix. Chaque choix te rapproche de ta meilleure version.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Kenji Watanabe",
    role: "Coach Mobilité & Récupération",
    certs: "FRC Certified · ISSA · Yoga Alliance 500h",
    quote: "La récupération n'est pas de la faiblesse — c'est de la stratégie.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  },
]

const SCHEDULE = [
  { day: "Lun", classes: [{ time: "6h30", name: "HIIT Circuit" }, { time: "12h00", name: "Force Brute" }, { time: "19h00", name: "CrossFit FORGE" }] },
  { day: "Mar", classes: [{ time: "7h00", name: "Yoga Power" }, { time: "12h30", name: "Cardio Boost" }, { time: "18h30", name: "Force Brute" }] },
  { day: "Mer", classes: [{ time: "6h30", name: "CrossFit FORGE" }, { time: "12h00", name: "HIIT Circuit" }, { time: "19h00", name: "Récup Active" }] },
  { day: "Jeu", classes: [{ time: "7h00", name: "Force Brute" }, { time: "12h30", name: "Yoga Power" }, { time: "18h30", name: "HIIT Circuit" }] },
  { day: "Ven", classes: [{ time: "6h30", name: "Cardio Boost" }, { time: "12h00", name: "CrossFit FORGE" }, { time: "19h00", name: "Force Brute" }] },
  { day: "Sam", classes: [{ time: "9h00", name: "HIIT Circuit" }, { time: "10h30", name: "Yoga Power" }, { time: "12h00", name: "Récup Active" }] },
  { day: "Dim", classes: [{ time: "10h00", name: "CrossFit FORGE" }, { time: "11h30", name: "Récup Active" }] },
]

const MEMBERSHIPS = [
  {
    name: "Découverte",
    price: "39 €",
    period: "/mois",
    desc: "Parfait pour démarrer",
    features: ["Accès illimité salle", "2 cours collectifs/sem", "Accès vestiaires", "Application FORGE"],
    highlight: false,
  },
  {
    name: "FORGE",
    price: "59 €",
    period: "/mois",
    desc: "Le plus populaire",
    features: ["Accès illimité salle", "Cours illimités", "1 coaching/mois inclus", "Programme nutrition", "Application FORGE Premium"],
    highlight: true,
  },
  {
    name: "Elite",
    price: "89 €",
    period: "/mois",
    desc: "Pour aller au maximum",
    features: ["Tout FORGE inclus", "4 coachings/mois", "Plan nutrition sur-mesure", "Accès 24h/24 7j/7", "Suivi biométrique mensuel"],
    highlight: false,
  },
]

const MARQUEE_ITEMS = [
  "HIIT · FORCE · CROSSFIT · YOGA · CARDIO · RÉCUPÉRATION",
  "HIIT · FORCE · CROSSFIT · YOGA · CARDIO · RÉCUPÉRATION",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "fonts-forge"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact174Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
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
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroImageY = useTransform(scrollYProgress, [0, 0.4], ["0%", "15%"])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return () => window.removeEventListener("scroll", fn)
  }, [])

  const navLinks = ["Programs", "Schedule", "Coaches", "Membership"]

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-[#f5f5f5]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#84cc16] z-[1000] origin-left"
        style={{ scaleX: scrollYProgress }} />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#84cc16]/10 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-[#84cc16]" />
            <span className="text-2xl font-bold tracking-tighter text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{fd?.businessName ?? "FORGE"}</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-[#f5f5f5]/60 hover:text-[#84cc16] transition-colors cursor-pointer uppercase tracking-widest text-xs font-medium">
                {l}
              </button>
            ))}
            <button className="px-6 py-2.5 bg-[#84cc16] text-[#0a0a0a] text-sm font-bold uppercase tracking-widest hover:bg-[#a3e635] transition-colors cursor-pointer" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Start Today
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#f5f5f5] cursor-pointer">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#111] border-t border-[#84cc16]/10 px-6 py-4 flex flex-col gap-4">
              {navLinks.map(l => (
                <button key={l} onClick={() => { setMenuOpen(false); document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" }) }}
                  className="text-left text-sm text-[#f5f5f5]/60 py-2 uppercase tracking-widest cursor-pointer hover:text-[#84cc16] transition-colors">
                  {l}
                </button>
              ))}
              <button className="px-5 py-3 bg-[#84cc16] text-[#0a0a0a] text-sm font-bold uppercase tracking-widest cursor-pointer">
                Start Today
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO — 50/50 split ─────────────────────────────────────────── */}
      <section id="hero" className="relative h-screen flex overflow-hidden">
        {/* Left — text */}
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-10 md:px-16 bg-[#0a0a0a]">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#84cc16] block mb-6">Paris · Hautes-Performances</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none text-white mb-8 uppercase tracking-tighter" style={{ fontFamily: "'Oswald', sans-serif" }}>{c?.heroHeadline ?? <>
              FORGEZ<br />
              <span className="text-[#84cc16]">VOTRE</span><br />
              CORPS.
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#f5f5f5]/50 text-lg leading-relaxed mb-10 max-w-md">{c?.heroSubline ?? fd?.tagline ?? <>
              L'entraînement haute intensité rencontre la précision scientifique. Programmes sur-mesure, coachs d'élite, résultats mesurables.
            </>}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-[#84cc16] text-[#0a0a0a] font-bold uppercase tracking-widest hover:bg-[#a3e635] transition-colors cursor-pointer flex items-center gap-3" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Commencer <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-[#f5f5f5]/20 text-[#f5f5f5]/60 font-medium uppercase tracking-widest hover:border-[#84cc16] hover:text-[#84cc16] transition-all cursor-pointer text-sm">
                Voir les programs
              </button>
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.4}>
            <div className="flex gap-8 mt-12 pt-8 border-t border-[#f5f5f5]/5">
              {[["2000+", "Membres"], ["15", "Programs"], ["7j/7", "Ouvert"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-[#84cc16]" style={{ fontFamily: "'Oswald', sans-serif" }}>{v}</div>
                  <div className="text-xs text-[#f5f5f5]/40 uppercase tracking-widest">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — athlete image */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <motion.div style={{ y: heroImageY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1200&auto=format&fit=crop"
              alt="FORGE athlete" fill className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute inset-0 bg-[#84cc16]/5 mix-blend-screen z-20" />
          {/* Lime corner accent */}
          <div className="absolute bottom-0 right-0 w-32 h-1 bg-[#84cc16] z-30" />
          <div className="absolute bottom-0 right-0 w-1 h-32 bg-[#84cc16] z-30" />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#84cc16] py-4">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-8 px-10 text-[#0a0a0a] text-xs font-bold uppercase tracking-[0.4em]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── PROGRAMS ────────────────────────────────────────────────────── */}
      <section id="programs" className="py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#84cc16] block mb-4">Training</span>
                <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  6 Programs.<br />1 Mission.
                </>}</h2>
              </div>
              <p className="text-[#f5f5f5]/40 max-w-xs text-sm leading-relaxed">{c?.aboutText ?? <>
                Chaque programme est conçu par nos coachs certifiés pour des résultats mesurables en 8 semaines.
              </>}</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#f5f5f5]/5">
            {PROGRAMS.map((prog, i) => (
              <Reveal key={prog.title} delay={i * 0.08}>
                <div className="bg-[#0a0a0a] p-8 flex flex-col h-full group hover:bg-[#111] transition-all cursor-pointer border-b border-[#f5f5f5]/5">
                  <div className="flex items-start justify-between mb-6">
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${prog.intensity === "MAX" ? "bg-[#84cc16] text-[#0a0a0a]" : prog.intensity === "HIGH" ? "bg-[#f5f5f5]/10 text-[#f5f5f5]/60" : "bg-[#f5f5f5]/5 text-[#f5f5f5]/40"}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                      {prog.intensity}
                    </span>
                    <span className="text-xs text-[#84cc16] font-medium">{prog.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter text-white mb-4 group-hover:text-[#84cc16] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {prog.title}
                  </h3>
                  <p className="text-sm text-[#f5f5f5]/40 leading-relaxed mb-8 flex-1">{prog.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-[#f5f5f5]/5">
                    <div className="flex items-center gap-2 text-xs text-[#f5f5f5]/30">
                      <Clock className="w-3.5 h-3.5" />{prog.duration}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#f5f5f5]/20 group-hover:text-[#84cc16] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ────────────────────────────────────────────────────── */}
      <section id="schedule" className="py-28 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#84cc16] block mb-4">Planning</span>
              <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Cette semaine
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-7 gap-px bg-[#f5f5f5]/5 border border-[#f5f5f5]/5">
            {SCHEDULE.map((day, i) => (
              <Reveal key={day.day} delay={i * 0.05}>
                <div className="bg-[#111] p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#84cc16] mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>{day.day}</div>
                  <div className="space-y-3">
                    {day.classes.map(cls => (
                      <div key={cls.time} className="group cursor-pointer">
                        <div className="text-[10px] text-[#f5f5f5]/30 mb-0.5">{cls.time}</div>
                        <div className="text-xs text-[#f5f5f5]/60 group-hover:text-[#84cc16] transition-colors font-medium">{cls.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="text-center text-xs text-[#f5f5f5]/30 mt-6 uppercase tracking-widest">Planning complet disponible sur l'app FORGE · Inscription requise</p>
          </Reveal>
        </div>
      </section>

      {/* ── COACHES ─────────────────────────────────────────────────────── */}
      <section id="coaches" className="py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#84cc16] block mb-4">L'Équipe</span>
                <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Vos Coachs.
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {COACHES.map((coach, i) => (
              <Reveal key={coach.name} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative h-80 overflow-hidden mb-6">
                    <Image src={coach.img} alt={coach.name} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-[#84cc16] text-xs font-bold uppercase tracking-widest mb-1">{coach.certs}</div>
                    </div>
                    {/* Lime corner */}
                    <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-[#84cc16] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter text-white mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>{coach.name}</h3>
                  <p className="text-xs text-[#84cc16] uppercase tracking-widest mb-4">{coach.role}</p>
                  <p className="text-sm text-[#f5f5f5]/40 italic">"{coach.quote}"</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section id="equipe" className="py-20 bg-[#84cc16]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: "2 000+", l: "Membres actifs" },
              { v: "98%", l: "Satisfaction" },
              { v: "15", l: "Programmes" },
              { v: "7j/7", l: "Disponibilité" },
            ].map((stat, i) => (
              <Reveal key={stat.l} delay={i * 0.1}>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>{stat.v}</div>
                  <div className="text-[#0a0a0a]/60 text-xs uppercase tracking-widest">{stat.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP ──────────────────────────────────────────────────── */}
      <section id="membership" className="py-28 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#84cc16] block mb-4">Adhésion</span>
              <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Choisissez votre niveau
              </h2>
              <p className="text-[#f5f5f5]/40 mt-4 text-sm">Sans engagement. Résiliable à tout moment.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {MEMBERSHIPS.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <div className={`p-8 border-2 flex flex-col transition-all duration-300 ${m.highlight ? "border-[#84cc16] bg-[#84cc16]/5" : "border-[#f5f5f5]/10 bg-[#111] hover:border-[#84cc16]/30"}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.name}</h3>
                      <p className="text-xs text-[#f5f5f5]/40 mt-1">{m.desc}</p>
                    </div>
                    {m.highlight && <span className="text-xs bg-[#84cc16] text-[#0a0a0a] px-3 py-1 font-bold uppercase tracking-widest">Populaire</span>}
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.price}</span>
                    <span className="text-[#f5f5f5]/40 text-sm">{m.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {m.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-[#f5f5f5]/60">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${m.highlight ? "text-[#84cc16]" : "text-[#84cc16]/50"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 font-bold uppercase tracking-widest text-sm cursor-pointer transition-all ${m.highlight ? "bg-[#84cc16] text-[#0a0a0a] hover:bg-[#a3e635]" : "border border-[#f5f5f5]/20 text-[#f5f5f5]/60 hover:border-[#84cc16] hover:text-[#84cc16]"}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Rejoindre FORGE
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 bg-[#111]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Prêt à<br /><span className="text-[#84cc16]">Forger</span> ?
            </h2>
            <p className="text-[#f5f5f5]/40 mb-10 max-w-md mx-auto">Première séance découverte offerte. Venez rencontrer l'équipe et tester nos installations.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-10 py-5 bg-[#84cc16] text-[#0a0a0a] font-bold uppercase tracking-widest hover:bg-[#a3e635] transition-colors cursor-pointer flex items-center gap-3 justify-center" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Séance offerte <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-5 border border-[#f5f5f5]/20 text-[#f5f5f5]/60 font-medium uppercase tracking-widest hover:border-[#84cc16] hover:text-[#84cc16] transition-all cursor-pointer text-sm">
                Nous appeler
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-[#f5f5f5]/30">
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="w-4 h-4 text-[#84cc16]" />
                <span>8 rue Oberkampf, 75011 Paris</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Clock className="w-4 h-4 text-[#84cc16]" />
                <span>Lun–Ven 6h–22h · Sam–Dim 8h–20h</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 text-[#84cc16]" />
                <span>01 43 57 82 14</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-[#84cc16]/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#84cc16]" />
            <span className="text-xl font-bold uppercase tracking-tighter text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{fd?.businessName ?? "FORGE"}</span>
          </div>
          <p className="text-xs text-[#f5f5f5]/30 uppercase tracking-widest">© 2026 FORGE Performance · Paris 11ème</p>
          <div className="flex gap-6">
            {["Instagram", "TikTok", "YouTube"].map(s => (
              <span key={s} className="text-xs text-[#f5f5f5]/30 hover:text-[#84cc16] transition-colors cursor-pointer uppercase tracking-widest">{s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
