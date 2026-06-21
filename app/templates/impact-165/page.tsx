"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Check, Star, Zap, Shield, BarChart2, Bell, MessageSquare, Users, Smartphone, Apple, Play, ChevronRight } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-pulse-app"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const FEATURES = [
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics temps réel",
    title: "Toutes vos métriques en un coup d'œil",
    desc: "Dashboards interactifs, graphiques de tendances, rapports automatiques. Visualisez vos KPIs clés sans quitter l'app.",
    bullets: ["Graphiques live actualisés toutes les 30s", "Alertes automatiques sur seuils", "Export PDF/CSV en un tap"],
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications intelligentes",
    title: "Les bonnes alertes au bon moment",
    desc: "Notre moteur IA filtre le bruit et vous envoie uniquement les notifications qui comptent pour votre activité.",
    bullets: ["Regroupement intelligent par priorité", "Mode focus sans distraction", "Résumé quotidien à 8h"],
  },
  {
    id: "team",
    icon: Users,
    label: "Collaboration",
    title: "Votre équipe toujours alignée",
    desc: "Partagez des vues, assignez des tâches, commentez en contexte. La collaboration native sans jongler entre les apps.",
    bullets: ["Espaces de travail partagés", "Mentions et threads contextuels", "Historique complet des actions"],
  },
  {
    id: "security",
    icon: Shield,
    label: "Sécurité",
    title: "Données chiffrées, conformité garantie",
    desc: "Chiffrement AES-256, authentification biométrique, conformité RGPD. Vos données restent les vôtres.",
    bullets: ["Chiffrement bout-en-bout", "SSO et 2FA obligatoires", "SOC2 Type II certifié"],
  },
]

const PRICING = [
  {
    name: "Starter",
    price: "0",
    desc: "Pour tester sans limite de temps",
    features: ["Jusqu'à 3 utilisateurs", "5 projets actifs", "Analytics 30 jours", "Support communauté"],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    name: "Growth",
    price: "29",
    desc: "Pour les équipes en pleine expansion",
    features: ["Jusqu'à 25 utilisateurs", "Projets illimités", "Analytics 12 mois", "Notifications IA", "Support prioritaire"],
    cta: "Essai gratuit 14 jours",
    highlight: true,
  },
  {
    name: "Scale",
    price: "89",
    desc: "Pour les organisations ambitieuses",
    features: ["Utilisateurs illimités", "Tout Growth inclus", "SSO & SAML", "API complète", "SLA 99.9%", "CSM dédié"],
    cta: "Contacter les ventes",
    highlight: false,
  },
]

const TESTIMONIALS = [
  { name: "Mathieu Garnier", role: "CEO — Flowly", text: "En 3 semaines, Pulse a remplacé 4 outils différents. Notre équipe gagne 2h par jour.", rating: 5, avatar: "MG" },
  { name: "Laura Bertrand", role: "Head of Ops — Nimble", text: "Les analytics temps réel ont transformé notre façon de prendre des décisions. On voit tout, instantanément.", rating: 5, avatar: "LB" },
  { name: "Antoine Perrin", role: "CTO — DataBrick", text: "L'API est propre, la doc est excellente, l'intégration nous a pris 2 jours. Rare pour ce type d'outil.", rating: 5, avatar: "AP" },
  { name: "Camille Dumont", role: "Product — Kynda", text: "La collaboration contextuelle est une révélation. Fini les mails, fini les Slack perdus.", rating: 5, avatar: "CD" },
]

export default function PulseAppPage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [billingAnnual, setBillingAnnual] = useState(true)
  const { scrollYProgress } = useScroll()

  const phoneRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: phoneScroll } = useScroll({ target: phoneRef, offset: ["start end", "end start"] })
  const phoneScale = useTransform(phoneScroll, [0, 0.5], [0.85, 1])
  const phoneY = useTransform(phoneScroll, [0, 1], ["60px", "-60px"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ActiveIcon = FEATURES[activeFeature].icon

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#0F0B2D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[3px] bg-[#6366F1] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F8F7FF]/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-700 font-bold">Pulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4B4570]">
            {["Fonctionnalités", "Tarifs", "Blog", "Docs"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#6366F1] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#tarifs" className="text-[#6366F1] hover:text-[#4F46E5] transition-colors">Se connecter</Link>
            <Link href="#tarifs" className="px-5 py-2.5 bg-[#6366F1] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors cursor-pointer">
              Essai gratuit
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#F8F7FF] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5FF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                <span className="text-lg font-bold">Pulse</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-6 p-8">
              {["Fonctionnalités", "Tarifs", "Blog", "Docs"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-2xl font-semibold hover:text-[#6366F1] transition-colors cursor-pointer">{l}</Link>
                </motion.div>
              ))}
              <Link href="#tarifs" className="mt-4 w-full py-4 bg-[#6366F1] text-white text-center font-semibold rounded-xl cursor-pointer">Essai gratuit 14 jours</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEF2FF] rounded-full text-[#6366F1] text-sm font-semibold mb-8">
                <Zap className="w-3.5 h-3.5" />
                Nouveau — Analytics IA en bêta
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
                L&apos;app qui fait<br />travailler votre<br /><span className="text-[#6366F1]">équipe mieux</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-[#4B4570] leading-relaxed mb-8 max-w-lg">
                Analytics temps réel, notifications intelligentes, collaboration native. Pulse connecte votre équipe et vos données dans une seule application mobile.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="#tarifs" className="flex items-center justify-center gap-2 px-7 py-4 bg-[#6366F1] text-white font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors cursor-pointer">
                  Démarrer gratuitement <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#fonctionnalités" className="flex items-center justify-center gap-2 px-7 py-4 bg-white text-[#0F0B2D] font-semibold rounded-xl border border-[#E8E5FF] hover:border-[#6366F1] transition-colors cursor-pointer">
                  <Play className="w-4 h-4 text-[#6366F1]" /> Voir la démo
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["MG", "LB", "AP", "CD"].map(av => (
                    <div key={av} className="w-9 h-9 rounded-full bg-[#6366F1] border-2 border-[#F8F7FF] flex items-center justify-center text-xs text-white font-semibold">{av}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />)}
                    <span className="text-sm font-semibold ml-1">4.9</span>
                  </div>
                  <p className="text-xs text-[#4B4570]">+2 400 équipes actives</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Phone mockup */}
          <div ref={phoneRef} className="relative flex justify-center">
            <motion.div className="relative" style={{ scale: phoneScale, y: phoneY }}>
              <div className="relative w-[300px] md:w-[340px] bg-[#0F0B2D] rounded-[48px] p-3 shadow-2xl">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1a1740] rounded-full z-10" />
                <div className="bg-[#1a1740] rounded-[40px] overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
                  {/* App screen */}
                  <div className="p-5 pt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-[#8B87B0]">Bonjour, Mathieu</p>
                        <p className="text-white font-semibold">Tableau de bord</p>
                      </div>
                      <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    {/* Metric cards */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[["Revenus", "€48.2k", "+12.4%", true], ["Utilisateurs", "2,847", "+8.1%", false]].map(([label, val, change, green]) => (
                        <div key={label as string} className="bg-[#252150] rounded-2xl p-3">
                          <p className="text-[10px] text-[#8B87B0] mb-1">{label as string}</p>
                          <p className="text-white text-base font-bold mb-1">{val as string}</p>
                          <span className={`text-[10px] font-semibold ${green ? "text-[#22C55E]" : "text-[#6366F1]"}`}>{change as string}</span>
                        </div>
                      ))}
                    </div>
                    {/* Mini chart */}
                    <div className="bg-[#252150] rounded-2xl p-4 mb-4">
                      <p className="text-[11px] text-[#8B87B0] mb-3">Activité 7 jours</p>
                      <div className="flex items-end gap-1.5 h-16">
                        {[40, 65, 45, 80, 70, 90, 75].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? "#6366F1" : "#3D3770" }} />
                        ))}
                      </div>
                    </div>
                    {/* Notifications */}
                    <div className="space-y-2">
                      {["Rapport hebdomadaire prêt", "3 tâches en retard", "Objectif atteint"].map(notif => (
                        <div key={notif} className="bg-[#252150] rounded-xl p-3 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#6366F1] flex-shrink-0" />
                          <span className="text-[11px] text-[#C8C4E8]">{notif}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div className="absolute -left-12 top-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5"
                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <div className="w-8 h-8 bg-[#EEF2FF] rounded-xl flex items-center justify-center"><BarChart2 className="w-4 h-4 text-[#6366F1]" /></div>
                <div><p className="text-[10px] text-gray-500">Conversion</p><p className="text-sm font-bold">+23.6%</p></div>
              </motion.div>
              <motion.div className="absolute -right-10 bottom-1/3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5"
                animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <div className="w-8 h-8 bg-[#F0FDF4] rounded-xl flex items-center justify-center"><Check className="w-4 h-4 text-[#22C55E]" /></div>
                <div><p className="text-[10px] text-gray-500">Uptime</p><p className="text-sm font-bold">99.97%</p></div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Social proof logos */}
        <div className="mt-20 pt-10 border-t border-[#E8E5FF]">
          <p className="text-xs tracking-widest uppercase text-[#8B87B0] text-center mb-8">Ils utilisent Pulse</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-40">
            {["Flowly", "Nimble", "DataBrick", "Kynda", "Axiom", "Serenity"].map(brand => (
              <span key={brand} className="text-sm font-bold tracking-wide">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalités" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Fonctionnalités</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Tout ce dont votre équipe a besoin</h2>
              <p className="text-[#4B4570] text-lg max-w-2xl mx-auto">Une plateforme unifiée qui remplace votre stack d&apos;outils fragmentés.</p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-2">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <button key={f.id} onClick={() => setActiveFeature(i)} className={`w-full text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer ${activeFeature === i ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-200" : "bg-[#F8F7FF] hover:bg-[#EEF2FF] text-[#4B4570]"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeFeature === i ? "bg-white/20" : "bg-white"}`}>
                        <Icon className={`w-5 h-5 ${activeFeature === i ? "text-white" : "text-[#6366F1]"}`} />
                      </div>
                      <span className="font-semibold">{f.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="bg-[#F8F7FF] rounded-3xl p-8 md:p-10">
                  <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-6">
                    <ActiveIcon className="w-7 h-7 text-[#6366F1]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{FEATURES[activeFeature].title}</h3>
                  <p className="text-[#4B4570] leading-relaxed mb-8">{FEATURES[activeFeature].desc}</p>
                  <ul className="space-y-3">
                    {FEATURES[activeFeature].bullets.map(b => (
                      <li key={b} className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#6366F1] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["2 400+", "Équipes actives"], ["99.97%", "Uptime garanti"], ["4.9/5", "Note App Store"], ["2h/jour", "Temps économisé"]].map(([val, label]) => (
              <Reveal key={label}>
                <div className="text-4xl font-extrabold mb-2">{val}</div>
                <div className="text-sm text-indigo-200">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#0F0B2D] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Témoignages</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ils en parlent mieux que nous</h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="bg-[#1a1740] rounded-2xl p-6 hover:bg-[#252150] transition-colors duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />)}
                  </div>
                  <p className="text-[#C8C4E8] text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[#8B87B0]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Tarifs</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Simple, transparent, sans surprise</h2>
              <div className="inline-flex items-center gap-3 bg-[#F8F7FF] rounded-full p-1.5">
                <button onClick={() => setBillingAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${!billingAnnual ? "bg-white shadow text-[#0F0B2D]" : "text-[#4B4570]"}`}>Mensuel</button>
                <button onClick={() => setBillingAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${billingAnnual ? "bg-white shadow text-[#0F0B2D]" : "text-[#4B4570]"}`}>
                  Annuel <span className="text-[#6366F1] text-xs ml-1">-20%</span>
                </button>
              </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => {
              const price = billingAnnual && plan.price !== "0" ? Math.round(parseInt(plan.price) * 0.8) : plan.price
              return (
                <Reveal key={plan.name} delay={i * 0.1}>
                  <div className={`rounded-3xl p-8 relative ${plan.highlight ? "bg-[#6366F1] text-white shadow-2xl shadow-indigo-200 scale-105" : "bg-[#F8F7FF]"}`}>
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0F0B2D] text-xs font-bold px-4 py-1.5 rounded-full">
                        Le plus populaire
                      </div>
                    )}
                    <div className="mb-6">
                      <div className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-indigo-200" : "text-[#6366F1]"}`}>{plan.name}</div>
                      <div className="text-4xl font-extrabold mb-1">
                        {price === "0" ? "Gratuit" : `€${price}`}
                        {price !== "0" && <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-indigo-200" : "text-[#4B4570]"}`}>/mois</span>}
                      </div>
                      <p className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-[#4B4570]"}`}>{plan.desc}</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm">
                          <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-white" : "text-[#6366F1]"}`} />
                          <span className={plan.highlight ? "text-indigo-100" : "text-[#4B4570]"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${plan.highlight ? "bg-white text-[#6366F1] hover:bg-indigo-50" : "bg-[#6366F1] text-white hover:bg-[#4F46E5]"}`}>
                      {plan.cta}
                    </button>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* App Store CTA */}
      <section className="py-24 bg-[#EEF2FF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <Smartphone className="w-12 h-12 text-[#6366F1] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Téléchargez l&apos;app</h2>
            <p className="text-[#4B4570] text-lg mb-10">Disponible sur iOS et Android. Synchronisez-vous avec votre équipe partout, à tout moment.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#" className="flex items-center gap-3 px-7 py-4 bg-[#0F0B2D] text-white rounded-xl hover:bg-[#1a1740] transition-colors cursor-pointer">
                <Apple className="w-5 h-5" />
                <div className="text-left"><div className="text-[10px] opacity-70">Télécharger sur l&apos;</div><div className="text-sm font-semibold">App Store</div></div>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-7 py-4 bg-[#0F0B2D] text-white rounded-xl hover:bg-[#1a1740] transition-colors cursor-pointer">
                <Play className="w-5 h-5" />
                <div className="text-left"><div className="text-[10px] opacity-70">Disponible sur</div><div className="text-sm font-semibold">Google Play</div></div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#6366F1] text-white text-center px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Prêt à passer à Pulse ?</h2>
          <p className="text-indigo-200 text-lg mb-10">14 jours gratuits. Pas de carte bancaire requise. Annulez à tout moment.</p>
          <Link href="#tarifs" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#6366F1] font-bold rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer text-lg">
            Commencer maintenant <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0B2D] text-[#8B87B0] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                <span className="text-white font-bold text-lg">Pulse</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">La plateforme mobile qui connecte votre équipe, vos données et vos décisions.</p>
            </div>
            {[["Produit", ["Fonctionnalités", "Tarifs", "Changelog", "Roadmap"]], ["Ressources", ["Documentation", "API", "Blog", "Status"]], ["Société", ["À propos", "Carrières", "Presse", "Contact"]]].map(([title, links]) => (
              <div key={title as string}>
                <p className="text-white font-semibold text-sm mb-4">{title as string}</p>
                {(links as string[]).map(l => <Link key={l} href="#tarifs" className="block text-sm hover:text-white mb-3 transition-colors cursor-pointer">{l}</Link>)}
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-[#1a1740] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Pulse · Tous droits réservés</span>
            <div className="flex gap-6">
              {["Confidentialité", "CGU", "Cookies"].map(l => <Link key={l} href="#fonctionnalités" className="hover:text-white transition-colors cursor-pointer">{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
