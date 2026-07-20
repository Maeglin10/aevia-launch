"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Heart, Activity, Stethoscope, Calendar, Clock, Phone, Mail, MapPin,
  Star, ArrowRight, ChevronRight, Menu, X, Shield, Award, Users,
  CheckCircle, Microscope, Brain, Zap
} from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  {
    id: "generale",
    label: "Médecine Générale",
    icon: Stethoscope,
    desc: "Suivi global de votre santé avec une approche préventive et personnalisée. Bilans annuels, vaccinations et orientation vers les spécialistes.",
    doctor: "Dr. Claire Fontaine",
    duration: "30 min",
  },
  {
    id: "cardio",
    label: "Cardiologie",
    icon: Heart,
    desc: "Diagnostic et traitement des maladies cardiovasculaires. ECG, échocardiographie, holter et suivi de l'hypertension artérielle.",
    doctor: "Dr. Marc Leclerc",
    duration: "45 min",
  },
  {
    id: "dermato",
    label: "Dermatologie",
    icon: Shield,
    desc: "Soins de la peau, acné, eczéma, psoriasis et dépistage des cancers cutanés. Dermoscopie numérique haute résolution.",
    doctor: "Dr. Sophie Renard",
    duration: "30 min",
  },
  {
    id: "nutrition",
    label: "Nutrition Médicale",
    icon: Activity,
    desc: "Bilan nutritionnel complet, gestion du poids, diabète et troubles alimentaires. Accompagnement personnalisé sur 6 mois.",
    doctor: "Dr. Antoine Moreau",
    duration: "60 min",
  },
  {
    id: "sport",
    label: "Médecine du Sport",
    icon: Zap,
    desc: "Suivi des sportifs, prévention des blessures, aptitude à la compétition et optimisation des performances.",
    doctor: "Dr. Lucie Bernard",
    duration: "45 min",
  },
  {
    id: "antiage",
    label: "Médecine Anti-Âge",
    icon: Brain,
    desc: "Bilan hormonal, micronutrition, thérapies régénératives et programmes de prévention du vieillissement cellulaire.",
    doctor: "Dr. Pierre Durand",
    duration: "60 min",
  },
]

const DOCTORS = [
  {
    name: "Dr. Claire Fontaine",
    role: "Médecin Généraliste & Directrice Médicale",
    formation: "Faculté Paris VI · Diplôme de médecine fonctionnelle",
    years: "18 ans",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dr. Marc Leclerc",
    role: "Cardiologue Interventionnel",
    formation: "Hôpital Européen Georges-Pompidou · Fellowship Johns Hopkins",
    years: "22 ans",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dr. Sophie Renard",
    role: "Dermatologue & Vénérologue",
    formation: "Hôpital Saint-Louis · DU Dermatologie esthétique",
    years: "14 ans",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dr. Antoine Moreau",
    role: "Nutritionniste & Endocrinologue",
    formation: "Faculté Paris VII · Diplôme de Nutri-thérapie",
    years: "12 ans",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop",
  },
]

const STEPS = [
  { n: "01", title: "Évaluation", desc: "Entretien approfondi de 45 minutes pour comprendre votre historique médical et vos objectifs santé." },
  { n: "02", title: "Bilan Approfondi", desc: "Analyses biologiques complètes, imagerie si nécessaire et évaluation des facteurs de risque." },
  { n: "03", title: "Protocole", desc: "Élaboration d'un plan de soins personnalisé avec objectifs mesurables à 3, 6 et 12 mois." },
  { n: "04", title: "Séances", desc: "Suivi régulier avec ajustements en temps réel selon les résultats obtenus." },
  { n: "05", title: "Optimisation", desc: "Révision annuelle du protocole et intégration des nouvelles avancées médicales." },
]

const SCIENCE = [
  { icon: Microscope, title: "Diagnostic Précis", desc: "Analyses biologiques avancées avec équipements de dernière génération. Résultats en 24h." },
  { icon: Brain, title: "Protocoles Validés", desc: "Chaque traitement repose sur des études cliniques randomisées et les recommandations HAS." },
  { icon: Activity, title: "Suivi Continu", desc: "Dossier médical numérique partagé, alertes proactives et téléconsultation 7j/7." },
  { icon: Award, title: "Innovation Médicale", desc: "Intégration des thérapies émergentes : microbiome, génomique nutritionnelle et médecine régénérative." },
]

const TESTIMONIALS = [
  {
    name: "Marie-Laure D.",
    age: 52,
    result: "Cholestérol normalisé en 4 mois sans statines",
    quote: "Le Dr Moreau a réussi là où trois autres médecins avaient échoué. Un suivi exceptionnel, des résultats bluffants.",
    stars: 5,
  },
  {
    name: "Thomas K.",
    age: 38,
    result: "Perte de 18kg sur protocole nutrition sport",
    quote: "Pour la première fois, un médecin a pris le temps de comprendre mes habitudes. Le programme sur-mesure a tout changé.",
    stars: 5,
  },
  {
    name: "Isabelle V.",
    age: 61,
    result: "Tension artérielle stabilisée, arrêt d'un médicament",
    quote: "Vitalité Médical m'a offert une approche que je n'avais jamais connue : la médecine préventive vraiment appliquée.",
    stars: 5,
  },
  {
    name: "Julien R.",
    age: 29,
    result: "Diagnostic précis après 2 ans d'errance médicale",
    quote: "En une consultation et un bilan complet, ils ont identifié ce que personne n'avait vu. Je leur dois ma qualité de vie.",
    stars: 5,
  },
]

const MARQUEE_ITEMS = [
  "Médecine Préventive", "Bilan Complet", "Cardiologie", "Nutrition Médicale",
  "Dermatologie", "Médecine du Sport", "Anti-Âge", "Téléconsultation",
  "Médecine Préventive", "Bilan Complet", "Cardiologie", "Nutrition Médicale",
  "Dermatologie", "Médecine du Sport", "Anti-Âge", "Téléconsultation",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "fonts-vitalite"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&family=Noto+Sans:wght@300;400;500;700&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl shadow-lg px-6 py-4 flex flex-col items-center text-center border border-[#0891B2]/10">
      <span className="text-2xl font-bold text-[#0891B2]" style={{ fontFamily: "'Figtree', sans-serif" }}>{value}</span>
      <span className="text-xs text-[#134E4A]/60 mt-1" style={{ fontFamily: "'Noto Sans', sans-serif" }}>{label}</span>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact171Page() {
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
  const [activeSpec, setActiveSpec] = useState("generale")

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "20%"])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, []);

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
  }, [c]);const navLinks = ["Spécialités", "Médecins", "Protocoles", "Science", "Tarifs", "Contact"]
  const activeSpecData = SPECIALTIES.find(s => s.id === activeSpec)!

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#F0FDFA] text-[#134E4A]" style={{ fontFamily: "'Noto Sans', sans-serif" }}>

      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#0891B2] z-[1000] origin-left"
        style={{ scaleX: scrollYProgress }} />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-2">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Heart className="w-5 h-5 text-[#0891B2]" />
                <span className="text-xl font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>VITALITÉ</span>
                <span className="text-xs font-medium text-[#0891B2] uppercase tracking-widest">Médical</span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <button key={l} onClick={() => document.getElementById(l.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-[#134E4A]/70 hover:text-[#0891B2] transition-colors cursor-pointer">
                {l}
              </button>
            ))}
            <button className="px-5 py-2 bg-[#0891B2] text-white text-sm font-medium rounded-full hover:bg-[#0e7490] transition-colors cursor-pointer">
              Prendre RDV
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#134E4A] cursor-pointer">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#0891B2]/10 px-6 py-4 flex flex-col gap-4">
              {navLinks.map(l => (
                <button key={l} onClick={() => { setMenuOpen(false); document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" }) }}
                  className="text-left text-sm text-[#134E4A]/70 py-2 cursor-pointer">
                  {l}
                </button>
              ))}
              <button className="px-5 py-3 bg-[#0891B2] text-white text-sm font-medium rounded-full cursor-pointer">
                Prendre RDV
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-dvh pt-24 pb-16 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDFA] via-[#ccfbf1] to-[#F0FDFA] z-0" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0891B2]/10 rounded-full mb-6">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                <span className="text-xs font-medium text-[#0891B2] uppercase tracking-widest">Consultations disponibles</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-[#134E4A] mb-6" style={{ fontFamily: "'Figtree', sans-serif" }}>{c?.heroHeadline ?? <>
                Votre Santé.<br />
                <span className="text-[#0891B2]">Notre Engagement.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-[#134E4A]/70 leading-relaxed mb-8 max-w-lg">{c?.heroSubline ?? fd?.tagline ?? <>
                Médecine evidence-based, suivi personnalisé et technologies de diagnostic avancées.
                Vitalité Médical place la prévention au cœur de votre santé.
              </>}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 mb-10">
                <button className="px-7 py-3.5 bg-[#0891B2] text-white font-semibold rounded-full hover:bg-[#0e7490] transition-all shadow-lg shadow-[#0891B2]/25 cursor-pointer flex items-center gap-2">
                  Prendre RDV <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-7 py-3.5 border-2 border-[#0891B2]/30 text-[#0891B2] font-semibold rounded-full hover:bg-[#0891B2]/5 transition-all cursor-pointer">
                  Découvrir la clinique
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full bg-[#0891B2]/20 border-2 border-white flex items-center justify-center text-xs font-bold text-[#0891B2]">{i}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-xs text-[#134E4A]/60">4.9/5 — 3 200+ patients</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — image + floating stat cards */}
          <div className="relative">
            <Reveal delay={0.2}>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <motion.div style={{ y: heroY }} className="absolute inset-0">
                  <Image src={photo(0, "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop")}
                    alt="Cabinet médical" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent" />
              </div>
            </Reveal>

            {/* Floating stat cards */}
            <div className="absolute -left-6 top-16 flex flex-col gap-3">
              <StatCard value="4.9★" label="Satisfaction" delay={0.5} />
              <StatCard value="98%" label="Résultats" delay={0.65} />
            </div>
            <div className="absolute -right-4 bottom-20">
              <StatCard value="3 200+" label="Patients suivis" delay={0.8} />
            </div>
            <div className="absolute right-8 top-8">
              <StatCard value="12 ans" label="D'expertise" delay={0.7} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#0891B2] py-4">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap w-max">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-10 text-white/80 text-xs font-medium uppercase tracking-widest">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block flex-shrink-0" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── SPÉCIALITÉS ─────────────────────────────────────────────────── */}
      <section id="specialites" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Nos Spécialités</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                Une médecine complète
              </h2>
            </div>
          </Reveal>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {SPECIALTIES.map(s => (
              <button key={s.id} onClick={() => setActiveSpec(s.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${activeSpec === s.id ? "bg-[#0891B2] text-white shadow-md shadow-[#0891B2]/30" : "bg-[#F0FDFA] text-[#134E4A]/70 hover:bg-[#ccfbf1]"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeSpec} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#F0FDFA] rounded-3xl p-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#0891B2]/10 rounded-2xl flex items-center justify-center">
                    <activeSpecData.icon className="w-7 h-7 text-[#0891B2]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>{activeSpecData.label}</h3>
                    <span className="text-sm text-[#0891B2]">{activeSpecData.doctor}</span>
                  </div>
                </div>
                <p className="text-[#134E4A]/70 leading-relaxed mb-8">{activeSpecData.desc}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-[#134E4A]/60">
                    <Clock className="w-4 h-4" />
                    <span>{activeSpecData.duration}</span>
                  </div>
                  <button className="px-5 py-2.5 bg-[#0891B2] text-white text-sm font-medium rounded-full hover:bg-[#0e7490] transition-colors cursor-pointer flex items-center gap-2">
                    Réserver <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image src={photo(1, "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop")}
                  alt={activeSpecData.label} fill className="object-cover" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── MÉDECINS ────────────────────────────────────────────────────── */}
      <section id="medecins" className="py-28 bg-[#F0FDFA]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Notre Équipe</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                Des médecins d'exception
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map((doc, i) => (
              <Reveal key={doc.name} delay={i * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={doc.img} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#134E4A] mb-1" style={{ fontFamily: "'Figtree', sans-serif" }}>{doc.name}</h3>
                    <p className="text-xs text-[#0891B2] font-medium mb-3">{doc.role}</p>
                    <p className="text-xs text-[#134E4A]/60 leading-relaxed mb-3">{doc.formation}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#134E4A]/50">{doc.years} d'expérience</span>
                      <button className="text-xs text-[#0891B2] font-medium flex items-center gap-1 cursor-pointer hover:gap-2 transition-all">
                        RDV <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOLES ──────────────────────────────────────────────────── */}
      <section id="protocoles" className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Parcours Patient</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                5 étapes vers votre mieux-être
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#0891B2]/20 hidden md:block" />
            <div className="flex flex-col gap-8">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.1}>
                  <div className="flex gap-8 items-start group">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-[#0891B2] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#0891B2]/25 group-hover:scale-105 transition-transform" style={{ fontFamily: "'Figtree', sans-serif" }}>
                        {step.n}
                      </div>
                    </div>
                    <div className="bg-[#F0FDFA] rounded-2xl p-6 flex-1 group-hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-xl text-[#134E4A] mb-2" style={{ fontFamily: "'Figtree', sans-serif" }}>{step.title}</h3>
                      <p className="text-[#134E4A]/70 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCIENCE ─────────────────────────────────────────────────────── */}
      <section id="science" className="py-28 bg-[#F0FDFA]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Approche Médicale</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                La science au service<br />de votre santé
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCIENCE.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 group cursor-pointer border border-[#0891B2]/5">
                  <div className="w-12 h-12 bg-[#0891B2]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0891B2] transition-colors">
                    <item.icon className="w-6 h-6 text-[#0891B2] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg text-[#134E4A] mb-3" style={{ fontFamily: "'Figtree', sans-serif" }}>{item.title}</h3>
                  <p className="text-sm text-[#134E4A]/60 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS (teal bg) ──────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-[#0891B2]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: "4.9★", l: "Satisfaction" },
              { v: "98%", l: "Taux de résultats" },
              { v: "12 ans", l: "D'expertise clinique" },
              { v: "3 200+", l: "Patients suivis" },
            ].map((stat, i) => (
              <Reveal key={stat.l} delay={i * 0.1}>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: "'Figtree', sans-serif" }}>{stat.v}</div>
                  <div className="text-white/70 text-sm uppercase tracking-widest">{stat.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─────────────────────────────────────────────────── */}
      <section id="temoignages" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Témoignages</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                Ils ont retrouvé leur vitalité
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#F0FDFA] rounded-3xl p-8 border border-[#0891B2]/10">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[#134E4A]/80 leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>{t.name}</span>
                      <span className="text-xs text-[#134E4A]/50 ml-2">{t.age} ans</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#22C55E]/10 rounded-full px-3 py-1">
                      <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-xs text-[#22C55E] font-medium">{t.result}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="py-28 bg-[#F0FDFA]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Honoraires</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                Transparence tarifaire
              </h2>
              <p className="text-[#134E4A]/60 mt-4 max-w-2xl mx-auto">Secteur 2 avec dépassements d'honoraires maîtrisés. Remboursement Sécurité Sociale + complémentaire santé.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Consultation", price: "120 €", desc: "Consultation médicale complète avec dossier médical personnalisé", features: ["Anamnèse approfondie", "Examen clinique complet", "Ordonnances si nécessaire", "Compte-rendu numérique"], color: false },
              { name: "Bilan Complet", price: "280 €", desc: "Bilan de santé global avec analyses biologiques et imagerie si nécessaire", features: ["Consultation 1h", "Analyses biologiques étendues", "Bilan cardiovasculaire", "Programme préventif personnalisé"], color: true },
              { name: "Programme", price: "Sur devis", desc: "Accompagnement sur-mesure sur 3, 6 ou 12 mois avec suivi continu", features: ["Consultations illimitées", "Téléconsultation 7j/7", "Accès dossier médical", "Alertes proactives"], color: false },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-3xl p-8 border-2 transition-all duration-300 ${plan.color ? "bg-[#0891B2] border-[#0891B2] text-white" : "bg-white border-[#0891B2]/10 text-[#134E4A] hover:border-[#0891B2]/30"}`}>
                  <h3 className="font-bold text-xl mb-2" style={{ fontFamily: "'Figtree', sans-serif" }}>{plan.name}</h3>
                  <div className="text-3xl font-black mb-4" style={{ fontFamily: "'Figtree', sans-serif" }}>{plan.price}</div>
                  <p className={`text-sm mb-6 leading-relaxed ${plan.color ? "text-white/80" : "text-[#134E4A]/60"}`}>{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.color ? "text-white" : "text-[#22C55E]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-full font-medium text-sm cursor-pointer transition-all ${plan.color ? "bg-white text-[#0891B2] hover:bg-white/90" : "bg-[#0891B2] text-white hover:bg-[#0e7490]"}`}>
                    Réserver une consultation
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2] block mb-4">Prendre RDV</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                Commencez votre parcours
              </h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>Adresse</p>
                    <p className="text-[#134E4A]/60 text-sm">14 rue de Rivoli, 75004 Paris</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>Horaires</p>
                    <p className="text-[#134E4A]/60 text-sm">Lun–Ven 8h–19h · Sam 9h–13h</p>
                    <p className="text-[#134E4A]/60 text-sm">Téléconsultation 7j/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>Téléphone</p>
                    <p className="text-[#134E4A]/60 text-sm">01 42 36 78 90</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#134E4A]" style={{ fontFamily: "'Figtree', sans-serif" }}>Email</p>
                    <p className="text-[#134E4A]/60 text-sm">{fd?.email ?? "contact@vitalite-medical.fr"}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Prénom" className="w-full px-4 py-3 bg-[#F0FDFA] border border-[#0891B2]/20 rounded-xl text-[#134E4A] placeholder-[#134E4A]/40 focus:outline-none focus:border-[#0891B2] text-sm" />
                  <input type="text" placeholder="Nom" className="w-full px-4 py-3 bg-[#F0FDFA] border border-[#0891B2]/20 rounded-xl text-[#134E4A] placeholder-[#134E4A]/40 focus:outline-none focus:border-[#0891B2] text-sm" />
                </div>
                <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-[#F0FDFA] border border-[#0891B2]/20 rounded-xl text-[#134E4A] placeholder-[#134E4A]/40 focus:outline-none focus:border-[#0891B2] text-sm" />
                <select className="w-full px-4 py-3 bg-[#F0FDFA] border border-[#0891B2]/20 rounded-xl text-[#134E4A] focus:outline-none focus:border-[#0891B2] text-sm cursor-pointer">
                  <option value="">Spécialité souhaitée</option>
                  {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <textarea rows={4} placeholder="Votre message (motif de consultation...)" className="w-full px-4 py-3 bg-[#F0FDFA] border border-[#0891B2]/20 rounded-xl text-[#134E4A] placeholder-[#134E4A]/40 focus:outline-none focus:border-[#0891B2] text-sm resize-none" />
                <button type="submit" className="w-full py-3.5 bg-[#0891B2] text-white font-semibold rounded-xl hover:bg-[#0e7490] transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Envoyer ma demande <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#134E4A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-[#22C55E]" />
                <span className="text-xl font-bold" style={{ fontFamily: "'Figtree', sans-serif" }}>VITALITÉ Médical</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Médecine evidence-based et suivi personnalisé pour une santé optimale. Paris 4ème.
              </p>
            </div>
            {[
              { title: "Spécialités", links: ["Médecine Générale", "Cardiologie", "Dermatologie", "Nutrition", "Sport", "Anti-Âge"] },
              { title: "Clinique", links: ["Notre équipe", "Nos protocoles", "Tarifs", "Témoignages", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-bold text-sm uppercase tracking-widest text-[#0891B2] mb-4" style={{ fontFamily: "'Figtree', sans-serif" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><span className="text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <span>© 2026 Vitalité Médical — Tous droits réservés</span>
            <div className="flex gap-6">
              <span className="hover:text-white/70 cursor-pointer">Mentions légales</span>
              <span className="hover:text-white/70 cursor-pointer">RGPD</span>
              <span className="hover:text-white/70 cursor-pointer">Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
