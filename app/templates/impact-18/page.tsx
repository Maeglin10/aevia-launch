"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Zap, BarChart3, Users, CheckCircle, ChevronDown, Globe, Layers, Bell, Shield, Code2, TrendingUp, Cpu, Server, Lock, HelpCircle } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("sl-fonts")) return;
    const s = document.createElement("style");
    s.id = "sl-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const features = [
  { icon: <Zap className="w-5 h-5" />, title: "Automatisation intelligente", desc: "Automatisez vos workflows en quelques clics. Connectez vos outils préférés sans code.", color: "#3B82F6" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics en temps réel", desc: "Tableaux de bord personnalisables avec vos KPIs les plus importants mis à jour en direct.", color: "#8B5CF6" },
  { icon: <Users className="w-5 h-5" />, title: "Collaboration d'équipe", desc: "Travaillez ensemble avec des espaces de travail partagés, commentaires et permissions granulaires.", color: "#06B6D4" },
  { icon: <Shield className="w-5 h-5" />, title: "Sécurité enterprise", desc: "SSO, 2FA, chiffrement AES-256 et conformité RGPD, SOC2 & ISO 27001.", color: "#10B981" },
  { icon: <Globe className="w-5 h-5" />, title: "Intégrations natives", desc: "Connectez-vous à +350 applications : Slack, Salesforce, HubSpot, Notion, et plus.", color: "#F59E0B" },
  { icon: <Code2 className="w-5 h-5" />, title: "API & Webhooks", desc: "Une API REST complète et des webhooks pour construire des intégrations sur mesure.", color: "#EF4444" },
];

const kanban = [
  { col: "À faire", color: "#374151", items: ["Audit sécurité Q2", "Onboarding équipe marketing", "Intégration Salesforce"] },
  { col: "En cours", color: "#1D4ED8", items: ["Dashboard exécutif", "Migration données", "API v2"] },
  { col: "En revue", color: "#6D28D9", items: ["Rapport mensuel", "Tests UAT"] },
  { col: "Terminé", color: "#065F46", items: ["Lancement v3.0", "Audit RGPD", "Formation équipes"] },
];

const plans = [
  { name: "Starter", price: "0", desc: "Pour les petites équipes", features: ["5 utilisateurs", "10 projets", "2 Go stockage", "Intégrations basiques", "Support communauté"], highlight: false, cta: "Gratuit pour toujours" },
  { name: "Growth", price: "29", desc: "Pour les équipes qui grandissent", features: ["Utilisateurs illimités", "Projets illimités", "100 Go stockage", "350+ intégrations", "Analytics avancés", "Support prioritaire"], highlight: true, cta: "Essai 14 jours" },
  { name: "Enterprise", price: "99", desc: "Pour les grandes organisations", features: ["Tout Growth inclus", "SSO & SAML", "SLA 99.99%", "Déploiement on-prem", "CISO dédié", "Support 24/7"], highlight: false, cta: "Contacter les ventes" },
];

const testimonials = [
  { name: "Aurélie Marchand", role: "COO — Fintech Scale-up", text: "Streamline a réduit notre temps de réunion de 40%. Tout le monde sait exactement quoi faire et quand. Indispensable.", rating: 5 },
  { name: "Thomas Leroy", role: "CTO — Agence digitale", text: "L'API est un chef-d'œuvre. On a construit notre propre couche d'automatisation en 2 semaines. Aucune autre plateforme n'offre ça.", rating: 5 },
  { name: "Sophie Chen", role: "VP Product — SaaS B2B", text: "Migration de Jira en 3 jours. L'équipe a adoré dès le premier jour. Le support a été réactif à chaque étape.", rating: 5 },
];

const integrations = ["Slack", "Salesforce", "HubSpot", "Notion", "GitHub", "Figma", "Stripe", "Zapier", "Linear", "Intercom"];

type ActivePage = "home" | "features" | "integrations" | "tarifs" | "docs" | "blog" | "legal";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function StreamlinePage() {
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

  useFonts();
  const [page, setPage] = useState<ActivePage>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const goTo = (p: ActivePage) => {
    setPage(p);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const { scrollYProgress } = useScroll();

  const faqs = [
    { q: "Combien de temps dure l'essai gratuit ?", a: "14 jours, sans carte de crédit requise. Accès complet à toutes les fonctionnalités Growth." },
    { q: "Puis-je migrer depuis Jira, Asana ou Monday ?", a: "Oui. Notre outil d'import automatique gère Jira, Asana, Monday.com, Trello et Notion en quelques minutes." },
    { q: "Streamline est-il conforme RGPD ?", a: "Oui. Données hébergées en Europe (Frankfurt), DPA disponible, droit à l'effacement et à la portabilité respectés." },
    { q: "Y a-t-il un engagement de durée ?", a: "Non. Abonnement mensuel ou annuel (-20%), annulation à tout moment sans frais." },
    { q: "Quelle est la limite d'utilisateurs sur le plan Starter ?", a: "5 membres actifs sur le plan Starter. Passez à Growth pour des équipes illimitées." },
  ];

  
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
return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-clip flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#3B82F6] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">{fd?.businessName ?? "Streamline"}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            {[
              { name: "Fonctionnalités", key: "features" },
              { name: "Intégrations", key: "integrations" },
              { name: "Tarifs", key: "tarifs" },
              { name: "Docs", key: "docs" },
              { name: "Blog", key: "blog" }
            ].map(item => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }}
                className={`hover:text-white transition-colors cursor-pointer ${page === item.key ? "text-[#3B82F6] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => goTo("tarifs")} className="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors cursor-pointer">Se connecter</button>
            <button onClick={() => goTo("tarifs")} className="bg-[#3B82F6] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2563EB] transition-colors cursor-pointer font-medium">Essai gratuit</button>
          </div>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0D1117] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white font-bold text-xl">{fd?.businessName ?? "Streamline"}</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {[
              { name: "Accueil", key: "home" },
              { name: "Fonctionnalités", key: "features" },
              { name: "Intégrations", key: "integrations" },
              { name: "Tarifs", key: "tarifs" },
              { name: "Docs", key: "docs" },
              { name: "Blog", key: "blog" },
              { name: "Mentions Légales", key: "legal" }
            ].map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <a
                  href={`#${item.key}`}
                  className={`block text-white text-2xl font-bold mb-6 cursor-pointer ${page === item.key ? "text-[#3B82F6] font-bold" : ""}`}
                  onClick={(e) => { e.preventDefault(); goTo(item.key as any); }}
                >
                  {item.name}
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {page === "home" && (
          <>
            {/* Hero */}
            <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
              </div>
              <div className="max-w-6xl mx-auto w-full relative z-10">
                <Reveal className="text-center">
                  <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#60A5FA] px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
                    <TrendingUp className="w-3 h-3" /> +12 000 équipes nous font confiance
                  </div>
                </Reveal>
                <Reveal delay={0.1} className="text-center">
                  <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">{c?.heroHeadline ?? <>
                    Gérez tout votre travail<br />
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">en un seul endroit</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.2} className="text-center">
                  <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">{c?.heroSubline ?? fd?.tagline ?? <>Projets, équipes, analytics, intégrations. Streamline centralise votre stack de productivité et automatise ce qui peut l'être.</>}</p>
                </Reveal>
                <Reveal delay={0.3} className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => goTo("tarifs")} className="bg-[#3B82F6] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2563EB] transition-colors cursor-pointer flex items-center justify-center gap-2">
                    Démarrer gratuitement <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => goTo("features")} className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    Voir les fonctionnalités
                  </button>
                </Reveal>
                {/* Kanban mockup */}
                <Reveal delay={0.4} className="mt-16">
                  <div className="bg-[#161B27] border border-white/10 rounded-2xl p-6 overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-yellow-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" /></div>
                      <span className="text-gray-500 text-xs">streamline — Vue Kanban</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 overflow-x-auto">
                      {kanban.map(col => (
                        <div key={col.col} className="min-w-[150px]">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                            <span className="text-gray-300 text-xs font-semibold">{col.col}</span>
                            <span className="text-gray-600 text-xs ml-auto">{col.items.length}</span>
                          </div>
                          <div className="space-y-2">
                            {col.items.map(item => (
                              <div key={item} className="bg-[#1E2535] border border-white/5 rounded-lg p-3 cursor-pointer hover:border-white/15 transition-colors">
                                <p className="text-gray-300 text-xs">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* Stats */}
            <section id="about" className="py-16 bg-[#161B27] border-y border-white/5">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
                {[["12 000+", "Équipes actives"], ["350+", "Intégrations"], ["99.99%", "Uptime SLA"], ["-40%", "Temps de réunion"]].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-white text-3xl font-extrabold mb-1">{n}</p>
                    <p className="text-gray-500 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Preview */}
            <section className="py-24 px-6">
              <div className="max-w-6xl mx-auto">
                <Reveal className="text-center mb-16">
                  <p className="text-[#60A5FA] text-sm font-semibold mb-3">Fonctionnalités</p>
                  <h2 className="text-white text-4xl font-bold">Tout ce dont votre équipe a besoin</h2>
                </Reveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {features.slice(0, 3).map((f, i) => (
                    <Reveal key={f.title} delay={i * 0.07}>
                      <div onClick={() => goTo("features")} className="bg-[#161B27] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${f.color}20`, color: f.color }}>{f.icon}</div>
                        <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6">
              <div className="max-w-3xl mx-auto">
                <Reveal className="text-center mb-12">
                  <h2 className="text-white text-4xl font-bold">Questions fréquentes</h2>
                </Reveal>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <Reveal key={i} delay={i * 0.05}>
                      <div className="bg-[#161B27] border border-white/5 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <div className="flex items-center justify-between p-5">
                          <p className="text-white font-medium text-sm">{faq.q}</p>
                          <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-4" />
                          </motion.div>
                        </div>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "features" && <FeaturesPage />}
        {page === "integrations" && <IntegrationsPage />}
        {page === "tarifs" && <TarifsPage billingAnnual={billingAnnual} setBillingAnnual={setBillingAnnual} />}
        {page === "docs" && <DocsPage />}
        {page === "blog" && <BlogPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div onClick={() => goTo("home")} className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
              <span className="text-white font-bold text-lg">{fd?.businessName ?? "Streamline"}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">La plateforme de productivité pour les équipes modernes. Gérez tout votre travail en un seul endroit.</p>
          </div>
          {[
            { title: "Produit", links: [
              { name: "Fonctionnalités", key: "features" },
              { name: "Intégrations", key: "integrations" },
              { name: "Tarifs", key: "tarifs" }
            ]},
            { title: "Ressources", links: [
              { name: "Documentation", key: "docs" },
              { name: "Blog", key: "blog" }
            ]},
            { title: "Légal", links: [
              { name: "Mentions Légales", key: "legal" },
              { name: "Confidentialité", key: "legal" }
            ]},
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l.name}><a href="/templates/impact-18" onClick={(e) => { e.preventDefault(); goTo(l.key as any); }} className="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer">{l.name}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600">
          <span>© 2026 Streamline. Tous droits réservés.</span>
          <span>Made in 🇫🇷 Paris</span>
        </div>
      </footer>
    </div>
  );
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (STREAMLINE DARK SAAS STYLE)
   ========================================================================= */

function FeaturesPage() {
  return (
    <section className="py-24 px-6 bg-[#0D1117] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#3B82F6] text-sm font-semibold mb-3 block">Fonctionnalités</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Une plateforme puissante</h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm leading-relaxed">
            Éliminez le travail répétitif grâce à des tableaux de bord interactifs, des intégrations fluides et un moteur d'automatisation no-code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="bg-[#161B27] border border-white/5 rounded-2xl p-8 hover:border-[#3B82F6]/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${f.color}20`, color: f.color }}>{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="flex items-center gap-2 text-[#3B82F6] text-xs font-semibold uppercase tracking-wider">
                En savoir plus <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-br from-[#1E2535] to-[#161B27] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Besoin d'un déploiement sur-mesure ?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pour les grandes organisations, nous proposons un hébergement isolé sur votre cloud (AWS/GCP), des SLAs de disponibilité et des audits de sécurité annuels.
            </p>
          </div>
          <button className="shrink-0 bg-white text-black font-bold px-6 py-4 rounded-xl hover:bg-gray-200 transition-colors text-sm">
            Contacter notre équipe
          </button>
        </div>
      </div>
    </section>
  );
}

function IntegrationsPage() {
  return (
    <section className="py-24 px-6 bg-[#0E131F] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#8B5CF6] text-sm font-semibold mb-3 block">Connecteurs</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Intégrations natives</h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm leading-relaxed">
            Connectez toute votre stack en 2 clics. Plus de 350 outils sont déjà supportés pour synchroniser vos données instantanément.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
          {integrations.map((intg, i) => (
            <div key={intg} className="bg-[#161B27] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#8B5CF6]/30 transition-colors cursor-pointer text-center">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-bold text-[#8B5CF6]">{intg.charAt(0)}</div>
              <span className="text-white text-xs font-semibold">{intg}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#161B27] border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-[#8B5CF6]" /> Webhooks et API Custom</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Configurez des récepteurs de webhooks personnalisés avec signature HMAC pour intégrer vos propres serveurs de production. Débit maximal de 10 000 requêtes par minute.
          </p>
        </div>
      </div>
    </section>
  );
}

function TarifsPage({ billingAnnual, setBillingAnnual }: { billingAnnual: boolean; setBillingAnnual: (v: boolean) => void }) {
  return (
    <section id="tarifs" className="py-24 px-6 bg-[#0D1117] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#3B82F6] text-sm font-semibold mb-3 block">Tarification</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple et transparent</h1>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setBillingAnnual(false)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${!billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Mensuel</button>
            <button onClick={() => setBillingAnnual(true)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Annuel <span className="text-[#10B981] text-xs font-bold ml-1">-20%</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={plan.name} className={`rounded-2xl p-8 flex flex-col justify-between ${plan.highlight ? "bg-gradient-to-b from-[#3B82F6] to-[#2563EB] scale-105 shadow-2xl" : "bg-[#1E2535] border border-white/5"}`}>
              <div>
                <h3 className="font-bold text-xl mb-1 text-white">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price === "0" ? "Gratuit" : `${billingAnnual ? Math.round(parseInt(plan.price) * 0.8) : plan.price}€`}</span>
                  {plan.price !== "0" && <span className={`text-sm ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>/mois</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#3B82F6]"}`} />
                      <span className={plan.highlight ? "text-white/90" : "text-gray-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-colors mt-6 ${plan.highlight ? "bg-white text-[#2563EB] hover:bg-gray-100" : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"}`}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocsPage() {
  return (
    <section className="py-24 px-6 bg-[#0E131F] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="text-[#3B82F6] text-sm font-semibold mb-3 block">Développeurs</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation API</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Consultez nos guides techniques pour authentifier vos requêtes, écouter nos webhooks et automatiser la création de tâches.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-[#161B27] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lock className="w-5 h-5 text-[#3B82F6]" /> Authentification</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Passez votre jeton API dans le header HTTP `Authorization` comme suit :
            </p>
            <pre className="bg-[#0D1117] p-4 rounded-xl text-xs text-gray-300 overflow-x-auto font-mono">
              Authorization: Bearer st_live_abc123xyz...
            </pre>
          </div>

          <div className="bg-[#161B27] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Server className="w-5 h-5 text-[#3B82F6]" /> Récupérer les tâches (GET)</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Requête API standard pour lister les tâches actives :
            </p>
            <pre className="bg-[#0D1117] p-4 rounded-xl text-xs text-gray-300 overflow-x-auto font-mono">
              GET https://api.streamline.sh/v1/tasks?status=active
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPage() {
  const posts = [
    { title: "Comment réduire le temps de réunion de 40%", desc: "Découvrez nos techniques agiles et l'utilisation de tableaux de bord Kanban pour dynamiser la communication d'équipe.", date: "10 juin 2026" },
    { title: "Intégrer Salesforce & Slack sans écrire de code", desc: "Guide pas-à-pas pour synchroniser vos opportunités commerciales vers vos canaux d'alertes en 5 minutes.", date: "2 juin 2026" },
    { title: "Lancement de Streamline v3.0 : Rapidité décuplée", desc: "Découvrez notre nouveau moteur d'exécution asynchrone qui accélère le temps de réponse global de 50%.", date: "18 mai 2026" }
  ];

  return (
    <section className="py-24 px-6 bg-[#0D1117] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#8B5CF6] text-sm font-semibold mb-3 block">Journal</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog de productivité</h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm leading-relaxed">
            Retrouvez nos conseils d'organisation, nos actualités logicielles et les retours d'expérience de nos scale-ups partenaires.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((p, idx) => (
            <div key={idx} className="bg-[#161B27] border border-white/5 rounded-2xl p-8 hover:border-[#8B5CF6]/30 transition-colors cursor-pointer">
              <span className="text-xs text-gray-500 font-semibold">{p.date}</span>
              <h3 className="text-white text-xl font-bold mt-2 mb-3">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#0D1117] border-t border-white/5 font-mono text-xs text-gray-400">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[#3B82F6] text-[10px] uppercase tracking-widest mb-3 block font-bold">Sécurité & Conformité</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Mentions Légales</h1>
        </div>

        <div className="border border-white/10 bg-[#161B27] p-8 rounded-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="text-[#3B82F6] text-[10px] font-bold uppercase mb-2">ÉDITEUR</div>
            <p className="leading-relaxed font-sans text-sm text-gray-300">
              <strong>Aevia WS — Valentin Milliand</strong><br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Email : contact@aevia.io<br />
              Adresse : Communiquée sur demande
            </p>
          </div>

          <div className="border-b border-white/5 pb-4">
            <div className="text-[#3B82F6] text-[10px] font-bold uppercase mb-2">HÉBERGEUR</div>
            <p className="leading-relaxed font-sans text-sm text-gray-300">
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA
            </p>
          </div>

          <div>
            <div className="text-[#3B82F6] text-[10px] font-bold uppercase mb-2">PROPRIÉTÉ INTELLECTUELLE</div>
            <p className="leading-relaxed font-sans text-xs text-gray-500">
              Le logiciel Streamline, les icônes, les marques ainsi que les codes de style présents sur cette plateforme sont la propriété exclusive d'Aevia WS ou de ses concédants de licence. Toute reproduction est soumise à approbation écrite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
