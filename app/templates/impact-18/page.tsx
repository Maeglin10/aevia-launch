"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Zap, BarChart3, Users, CheckCircle, ChevronDown, Globe, Layers, Bell, Shield, Code2, TrendingUp } from "lucide-react";

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

export default function StreamlinePage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();

  const faqs = [
    { q: "Combien de temps dure l'essai gratuit ?", a: "14 jours, sans carte de crédit requise. Accès complet à toutes les fonctionnalités Growth." },
    { q: "Puis-je migrer depuis Jira, Asana ou Monday ?", a: "Oui. Notre outil d'import automatique gère Jira, Asana, Monday.com, Trello et Notion en quelques minutes." },
    { q: "Streamline est-il conforme RGPD ?", a: "Oui. Données hébergées en Europe (Frankfurt), DPA disponible, droit à l'effacement et à la portabilité respectés." },
    { q: "Y a-t-il un engagement de durée ?", a: "Non. Abonnement mensuel ou annuel (-20%), annulation à tout moment sans frais." },
    { q: "Quelle est la limite d'utilisateurs sur le plan Starter ?", a: "5 membres actifs sur le plan Starter. Passez à Growth pour des équipes illimitées." },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#3B82F6] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">Streamline</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            {["Fonctionnalités", "Intégrations", "Tarifs", "Docs", "Blog"].map(item => (
              <Link key={item} href="#" className="hover:text-white transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors cursor-pointer">Se connecter</button>
            <button className="bg-[#3B82F6] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2563EB] transition-colors cursor-pointer font-medium">Essai gratuit</button>
          </div>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0D1117] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white font-bold text-xl">Streamline</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Fonctionnalités", "Intégrations", "Tarifs", "Docs", "Blog"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-2xl font-bold mb-6 cursor-pointer" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
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
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Gérez tout votre travail<br />
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">en un seul endroit</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2} className="text-center">
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">Projets, équipes, analytics, intégrations. Streamline centralise votre stack de productivité et automatise ce qui peut l'être.</p>
          </Reveal>
          <Reveal delay={0.3} className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#3B82F6] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2563EB] transition-colors cursor-pointer flex items-center justify-center gap-2">
              Démarrer gratuitement <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              Voir une démo
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
                  <div key={col.col}>
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
      <section className="py-16 bg-[#161B27] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[["12 000+", "Équipes actives"], ["350+", "Intégrations"], ["99.99%", "Uptime SLA"], ["-40%", "Temps de réunion"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-white text-3xl font-extrabold mb-1">{n}</p>
              <p className="text-gray-500 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#60A5FA] text-sm font-semibold mb-3">Fonctionnalités</p>
            <h2 className="text-white text-4xl font-bold">Tout ce dont votre équipe a besoin</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="bg-[#161B27] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${f.color}20`, color: f.color }}>{f.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-[#161B27] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-8"><p className="text-gray-500 text-sm">Connectez-vous à vos outils existants</p></Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {integrations.map((intg, i) => (
              <Reveal key={intg} delay={i * 0.04}>
                <div className="bg-[#1E2535] border border-white/5 text-gray-300 text-xs font-medium px-4 py-2.5 rounded-xl hover:border-[#3B82F6]/30 hover:text-white transition-all cursor-pointer">{intg}</div>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <div className="bg-[#1E2535] border border-white/5 text-[#60A5FA] text-xs font-medium px-4 py-2.5 rounded-xl cursor-pointer">+340 autres →</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#60A5FA] text-sm font-semibold mb-3">Témoignages</p>
            <h2 className="text-white text-4xl font-bold">Ce qu'en disent nos clients</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#161B27] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-[#F59E0B] text-xs">★</span>)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-[#161B27]">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-4">
            <p className="text-[#60A5FA] text-sm font-semibold mb-3">Tarifs</p>
            <h2 className="text-white text-4xl font-bold">Simple et transparent</h2>
          </Reveal>
          <Reveal className="flex items-center justify-center gap-3 mb-12">
            <button onClick={() => setBillingAnnual(false)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${!billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Mensuel</button>
            <button onClick={() => setBillingAnnual(true)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Annuel <span className="text-[#10B981] text-xs font-bold ml-1">-20%</span></button>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 ${plan.highlight ? "bg-gradient-to-b from-[#3B82F6] to-[#2563EB] scale-105 shadow-2xl" : "bg-[#1E2535] border border-white/5"}`}>
                  <h3 className={`font-bold text-xl mb-1 ${plan.highlight ? "text-white" : "text-white"}`}>{plan.name}</h3>
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
                  <button className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${plan.highlight ? "bg-white text-[#2563EB] hover:bg-gray-100" : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"}`}>{plan.cta}</button>
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

      {/* CTA */}
      <section className="py-24 px-6 bg-[#161B27]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-[#3B82F6]/20 rounded-3xl p-10 md:p-16">
              <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4">Prêt à streamliner votre équipe ?</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-10">14 jours gratuits. Pas de carte de crédit. Accès complet à toutes les fonctionnalités Growth.</p>
              <button className="bg-[#3B82F6] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#2563EB] transition-colors cursor-pointer text-lg">
                Commencer gratuitement →
              </button>
              <p className="text-gray-600 text-xs mt-4">Annulation à tout moment · Aucun engagement</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div><span className="text-white font-bold text-lg">Streamline</span></div>
            <p className="text-gray-500 text-sm leading-relaxed">La plateforme de productivité pour les équipes modernes. Gérez tout votre travail en un seul endroit.</p>
          </div>
          {[
            { title: "Produit", links: ["Fonctionnalités", "Intégrations", "API", "Changelog"] },
            { title: "Ressources", links: ["Documentation", "Blog", "Guides", "Status"] },
            { title: "Légal", links: ["Confidentialité", "CGU", "RGPD", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><Link href="#" className="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer">{l}</Link></li>)}
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
