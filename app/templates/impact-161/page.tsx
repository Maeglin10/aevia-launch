"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Check, Star, Zap, BarChart2, Shield, Users, Clock, Globe, ChevronRight, Play, Sparkles } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-essential-saas"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const FEATURES = [
  { icon: BarChart2, title: "Analytics avancés", desc: "Tableaux de bord en temps réel avec métriques personnalisables. Exportez vos données en un clic." },
  { icon: Shield, title: "Sécurité enterprise", desc: "Chiffrement AES-256, SSO, 2FA et conformité SOC2. Vos données sont protégées par défaut." },
  { icon: Users, title: "Collaboration d'équipe", desc: "Invitez votre équipe, gérez les rôles et permissions. Travaillez ensemble en temps réel." },
  { icon: Zap, title: "Automatisations", desc: "Créez des workflows automatisés en quelques clics. Connectez 200+ outils populaires." },
  { icon: Globe, title: "API complète", desc: "API REST et GraphQL documentée. SDKs disponibles pour Python, JavaScript, Ruby et Go." },
  { icon: Clock, title: "Support 24/7", desc: "Équipe de support dédiée, disponible à tout moment. Temps de réponse moyen : 2 heures." },
]

const PRICING = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    desc: "Pour démarrer et explorer",
    features: ["Jusqu'à 3 utilisateurs", "5 projets", "1 Go de stockage", "Support communauté", "API (100 req/jour)"],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    name: "Pro",
    price: "29",
    period: "/ mois / utilisateur",
    desc: "Pour les équipes en croissance",
    features: ["Utilisateurs illimités", "Projets illimités", "100 Go de stockage", "Support prioritaire (4h)", "API illimitée", "Analytics avancés", "Automations (500/mois)"],
    cta: "Essai gratuit 14 jours",
    highlight: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    desc: "Pour les grandes organisations",
    features: ["Tout Pro inclus", "SSO & SAML", "Audit logs complets", "SLA 99.99%", "Stockage illimité", "Onboarding dédié", "CSM attitré"],
    cta: "Contacter les ventes",
    highlight: false,
  },
]

const TESTIMONIALS = [
  { name: "Alice Dupont", role: "CTO — StartupX", text: "On a migré en 2 jours. L'API est propre, la doc claire. On n'a jamais regardé en arrière.", avatar: "AD" },
  { name: "Thomas Leroy", role: "CEO — Agence Nova", text: "Nos clients adorent les dashboards partagés. Ça a changé notre façon de livrer des projets.", avatar: "TL" },
  { name: "Camille Martin", role: "Product Manager", text: "Les automations nous ont économisé 15h par semaine. En 3 mois, le ROI était déjà là.", avatar: "CM" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function EssentialSaaSPage() {
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
  }, [c]);return (
    <div className="min-h-screen bg-white text-[#0F172A]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[3px] bg-[#6366F1] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">Flowbase</span>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {["Fonctionnalités", "Tarifs", "Docs", "Blog"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#6366F1] transition-colors">{l}</Link>
            ))}
            <Link href="#tarifs" className="text-[#6366F1]">Connexion</Link>
            <Link href="#tarifs" className="px-5 py-2.5 bg-[#6366F1] text-white rounded-xl font-semibold hover:bg-[#4F46E5] transition-colors cursor-pointer">
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
          <motion.div className="fixed inset-0 z-[200] bg-white flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                {fd?.logoBase64 ? (
                  <img
                    src={fd.logoBase64}
                    alt={fd?.businessName ?? 'logo'}
                    style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                  />
                ) : (
                  <>
                    <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
                    <span className="font-bold">Flowbase</span>
                  </>
                )}
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-6 p-8">
              {["Fonctionnalités", "Tarifs", "Docs", "Blog"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-2xl font-semibold hover:text-[#6366F1] transition-colors cursor-pointer">{l}</Link>
                </motion.div>
              ))}
              <Link href="#tarifs" className="mt-4 py-4 bg-[#6366F1] text-white text-center font-semibold rounded-xl cursor-pointer">Essai gratuit</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" className="pt-28 pb-20 px-6 max-w-7xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEF2FF] rounded-full text-[#6366F1] text-sm font-semibold mb-8">
            <Zap className="w-3.5 h-3.5" />
            Nouveau — Intégration IA disponible
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">{c?.heroHeadline ?? <>
            Gérez votre business<br />avec <span className="text-[#6366F1]">clarté et vitesse</span>
          </>}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
            Flowbase réunit vos projets, votre équipe et vos analytics dans une plateforme unique. Moins d&apos;outils, plus d&apos;impact.
          </>}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="#tarifs" className="flex items-center gap-2 px-8 py-4 bg-[#6366F1] text-white font-bold rounded-xl hover:bg-[#4F46E5] transition-colors cursor-pointer text-lg">
              Démarrer gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#tarifs" className="flex items-center gap-2 px-8 py-4 border border-slate-200 rounded-xl font-semibold hover:border-[#6366F1] transition-colors cursor-pointer">
              <Play className="w-4 h-4 text-[#6366F1]" /> Voir la démo (2 min)
            </Link>
          </div>
        </Reveal>

        {/* Dashboard preview */}
        <Reveal delay={0.4}>
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4 bg-slate-700 rounded-md py-1 px-3 text-xs text-slate-400">app.flowbase.io/dashboard</div>
              </div>
              <div className="bg-[#F8F9FF] p-6">
                {/* Mock dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[["€128k", "Revenus ce mois", "+14%"], ["2,847", "Utilisateurs actifs", "+8%"], ["98.7%", "Uptime", ""], ["4.2h", "Temps moyen session", "+12%"]].map(([val, label, change]) => (
                    <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold mb-1">{val}</div>
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      {change && <div className="text-xs text-green-600 font-semibold">{change}</div>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm font-semibold mb-4">Croissance mensuelle</div>
                    <div className="flex items-end gap-2 h-24">
                      {[30, 50, 40, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? "#6366F1" : "#E0E7FF" }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm font-semibold mb-3">Projets actifs</div>
                    {[["Refonte site", 80, "#6366F1"], ["App mobile", 55, "#10B981"], ["API v3", 35, "#F59E0B"]].map(([name, pct, color]) => (
                      <div key={name as string} className="mb-3">
                        <div className="flex justify-between text-xs mb-1"><span>{name as string}</span><span>{pct}%</span></div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color as string }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Logos */}
        <div className="mt-16 pt-10 border-t border-slate-100">
          <p className="text-sm text-slate-400 mb-6">Utilisé par +2 400 équipes dans 45 pays</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
            {["Flowly", "Nimble", "DataBrick", "Kynda", "Axiom", "Serenity"].map(b => (
              <span key={b} className="text-sm font-bold tracking-wide">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalités" className="py-28 bg-[#F8F9FF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Fonctionnalités</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Tout ce dont vous avez besoin</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Une plateforme qui grandit avec vous. Pas de configuration complexe, pas de modules cachés.</p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal key={f.title} delay={i * 0.07}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-[#6366F1]/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#6366F1] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#6366F1] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Prise en main</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Opérationnel en 5 minutes</h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-[2px] bg-[#EEF2FF]" />
            {[
              { step: "1", title: "Créez votre compte", desc: "Inscription en 30 secondes. Pas de carte bancaire requise. Commencez immédiatement avec le plan gratuit." },
              { step: "2", title: "Invitez votre équipe", desc: "Envoyez des invitations par email. Les membres rejoignent en un clic et trouvent leurs outils prêts à l'emploi." },
              { step: "3", title: "Connectez vos outils", desc: "200+ intégrations en un clic. Slack, Notion, GitHub, Jira, HubSpot... Votre stack existant reste en place." },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="text-center relative">
                  <div className="w-16 h-16 bg-[#6366F1] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-6 relative z-10">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="about" className="py-20 bg-[#6366F1] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["2 400+", "Équipes actives"], ["99.99%", "Uptime garanti"], ["4.9/5", "Note moyenne"], ["15h/sem", "Temps économisé"]].map(([val, label]) => (
              <Reveal key={label}>
                <div>
                  <div className="text-4xl font-extrabold mb-2">{val}</div>
                  <div className="text-indigo-200 text-sm">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#F8F9FF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Témoignages</p>
              <h2 className="text-4xl font-extrabold tracking-tight">Ils nous font confiance</h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />)}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
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
          <div className="text-center mb-14">
            <Reveal>
              <p className="text-[#6366F1] font-semibold text-sm mb-3">Tarifs</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple et transparent</h2>
              <p className="text-slate-500 text-lg">Commencez gratuitement, évoluez quand vous en avez besoin.</p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 relative ${plan.highlight ? "bg-[#6366F1] text-white shadow-2xl shadow-indigo-200 scale-105" : "bg-[#F8F9FF] border border-slate-100"}`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-4 py-1.5 rounded-full">
                      Recommandé
                    </div>
                  )}
                  <div className="mb-6">
                    <div className={`font-semibold text-sm mb-2 ${plan.highlight ? "text-indigo-200" : "text-[#6366F1]"}`}>{plan.name}</div>
                    <div className="text-3xl font-extrabold mb-1">
                      {plan.price === "Sur devis" ? plan.price : plan.price === "0" ? "Gratuit" : `€${plan.price}`}
                    </div>
                    {plan.period && <div className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>{plan.period}</div>}
                    <p className={`text-sm mt-2 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>{plan.desc}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-white" : "text-[#6366F1]"}`} />
                        <span className={plan.highlight ? "text-indigo-100" : "text-slate-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${plan.highlight ? "bg-white text-[#6366F1] hover:bg-indigo-50" : "bg-[#6366F1] text-white hover:bg-[#4F46E5]"}`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F8F9FF]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-center mb-12">Questions fréquentes</h2>
          </Reveal>
          <div className="space-y-4">
            {[
              ["Puis-je annuler à tout moment ?", "Oui. Aucun engagement, aucun frais de résiliation. Vous pouvez annuler depuis votre tableau de bord en un clic."],
              ["La migration depuis mon outil actuel est-elle simple ?", "Nous proposons des imports depuis Notion, Asana, Monday, Jira et 40+ outils. Notre équipe vous accompagne gratuitement."],
              ["Mes données sont-elles sécurisées ?", "Vos données sont chiffrées en transit (TLS) et au repos (AES-256). Nous sommes conformes RGPD et SOC2 Type II."],
              ["Puis-je inviter des clients en lecture seule ?", "Oui. Le plan Pro inclut des accès invités illimités en mode visualisation."],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={i * 0.05}>
                <details className="bg-white border border-slate-100 rounded-xl group">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold">
                    {q}
                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-5 text-slate-500 leading-relaxed">{a}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-[#6366F1] text-white text-center px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Prêt à simplifier votre workflow ?</h2>
          <p className="text-indigo-200 text-lg mb-10">14 jours d&apos;essai gratuit. Pas de carte bancaire. Annulable à tout moment.</p>
          <Link href="#tarifs" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#6366F1] font-bold rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer text-lg">
            Commencer maintenant <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-500 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
                <span className="text-white font-bold">Flowbase</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">La plateforme SaaS qui connecte votre équipe, vos projets et vos données.</p>
            </div>
            {[["Produit", ["Fonctionnalités", "Tarifs", "Changelog", "Roadmap"]], ["Ressources", ["Docs", "API", "Blog", "Status"]], ["Société", ["À propos", "Carrières", "Contact"]]].map(([title, links]) => (
              <div key={title as string}>
                <p className="text-white font-semibold text-sm mb-4">{title as string}</p>
                {(links as string[]).map(l => <Link key={l} href="#tarifs" className="block text-sm hover:text-white mb-3 transition-colors cursor-pointer">{l}</Link>)}
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Flowbase · Tous droits réservés</span>
            <div className="flex gap-6">
              {["Confidentialité", "CGU", "Cookies"].map(l => <Link key={l} href="#fonctionnalités" className="hover:text-white transition-colors cursor-pointer">{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
