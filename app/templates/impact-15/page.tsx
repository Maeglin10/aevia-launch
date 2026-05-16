"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Shield, Lock, Terminal, AlertTriangle, ChevronRight, Server, Eye, Zap, CheckCircle } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("fort-fonts")) return;
    const s = document.createElement("style");
    s.id = "fort-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const services = [
  { icon: <Shield className="w-6 h-6" />, title: "Pentest & Red Team", desc: "Simulation d'attaques avancées. Nous pensons comme vos adversaires pour révéler vos failles avant eux.", tag: "Offensif" },
  { icon: <Eye className="w-6 h-6" />, title: "SOC & SIEM 24/7", desc: "Surveillance continue de votre infrastructure. Détection des menaces en temps réel, réponse en moins de 15 min.", tag: "Défensif" },
  { icon: <Lock className="w-6 h-6" />, title: "Audit RSSI", desc: "Analyse complète de votre posture sécurité, conformité RGPD/ISO 27001, et roadmap de remédiation priorisée.", tag: "Conseil" },
  { icon: <Server className="w-6 h-6" />, title: "DevSecOps", desc: "Intégration de la sécurité dans vos pipelines CI/CD. Analyse SAST/DAST automatisée à chaque déploiement.", tag: "Intégration" },
  { icon: <AlertTriangle className="w-6 h-6" />, title: "Incident Response", desc: "Cellule de crise disponible 24h/24. Containment, éradication, forensics et communication de crise.", tag: "Urgence" },
  { icon: <Zap className="w-6 h-6" />, title: "Formation & CTF", desc: "Programmes de sensibilisation et challenges cyber pour vos équipes techniques et non techniques.", tag: "Prévention" },
];

const stats = [
  { n: "2 400+", l: "Entreprises protégées" },
  { n: "99.7%", l: "Uptime SOC" },
  { n: "< 15min", l: "Temps de réponse" },
  { n: "0", l: "Brèche non détectée" },
];

const certifications = ["ISO 27001", "SOC 2 Type II", "PASSI ANSSI", "CREST", "CEH", "OSCP"];

const threats = [
  { type: "Ransomware", severity: "CRITIQUE", time: "03:42:17" },
  { type: "Phishing ciblé", severity: "HAUTE", time: "01:15:03" },
  { type: "Exfiltration données", severity: "CRITIQUE", time: "00:08:44" },
  { type: "Accès non autorisé", severity: "MOYENNE", time: "12:30:01" },
];

const plans = [
  { name: "Starter", price: "2 490€", period: "mois", features: ["Audit de surface", "Scan vulnérabilités", "Rapport mensuel", "Support 9h–18h"], highlight: false },
  { name: "Business", price: "5 990€", period: "mois", features: ["SOC 24/7", "Pentest trimestriel", "SIEM managé", "Réponse < 30 min", "RSSI virtuel"], highlight: true },
  { name: "Enterprise", price: "Sur devis", period: "", features: ["Red team continu", "SOC dédié", "Compliance automatisée", "SLA personnalisé", "CISO on demand"], highlight: false },
];

export default function FortressPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-[#060A0F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#00FF88] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#060A0F]/90 backdrop-blur-md border border-[#00FF88]/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-black" /></div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FORTRESS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            {["Services", "Offres", "Certifications", "Blog", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#00FF88] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex bg-[#00FF88] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00CC6E] transition-colors cursor-pointer">
            Audit gratuit
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#060A0F] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FORTRESS</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Services", "Offres", "Certifications", "Blog", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-2xl font-bold mb-6 cursor-pointer" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center pt-24 pb-16 px-6">
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300FF88%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl" />
        </motion.div>
        <div className="max-w-6xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] px-4 py-1.5 rounded-full text-xs font-mono mb-8">
                <span className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" /> SOC ACTIF — 2 421 menaces neutralisées aujourd'hui
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                Votre bouclier<br />
                contre les<br />
                <span className="text-[#00FF88]">cybermenaces</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                Fortress protège les entreprises les plus exigeantes contre les attaques les plus sophistiquées. SOC 24/7, pentests, RSSI virtuel.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex gap-4">
                <button className="bg-[#00FF88] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00CC6E] transition-colors cursor-pointer flex items-center gap-2">
                  Audit gratuit <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  Demo SOC
                </button>
              </div>
            </Reveal>
          </div>
          {/* Terminal widget */}
          <Reveal delay={0.15}>
            <div className="bg-[#0A0F14] border border-[#00FF88]/20 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0F151C] border-b border-[#00FF88]/10">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-gray-500 text-xs font-mono ml-2">fortress-soc — threat_monitor</span>
              </div>
              <div className="p-5 space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {threats.map((t, i) => (
                  <motion.div key={t.type} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.severity === "CRITIQUE" ? "bg-red-500/20 text-red-400" : t.severity === "HAUTE" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>{t.severity}</span>
                      <span className="text-gray-300">{t.type}</span>
                    </div>
                    <span className="text-gray-600">{t.time} ago</span>
                  </motion.div>
                ))}
                <div className="border-t border-[#00FF88]/10 pt-3 flex items-center gap-2 text-xs text-[#00FF88]">
                  <span className="animate-pulse">▮</span>
                  <span>Tous les événements bloqués. Infrastructure sécurisée.</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#00FF88]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {stats.map(s => (
            <div key={s.l} className="text-center">
              <p className="text-black text-3xl font-bold mb-1">{s.n}</p>
              <p className="text-black/50 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-[#080C12]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#00FF88] text-xs font-mono tracking-widest uppercase mb-3">$ ls services/</p>
              <h2 className="text-white text-4xl font-bold">Protection complète</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div onClick={() => setActiveService(i)} className={`bg-[#0A0F14] border rounded-2xl p-6 cursor-pointer transition-all hover:border-[#00FF88]/30 ${i === activeService ? "border-[#00FF88]/40 bg-[#0D1419]" : "border-white/5"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#00FF88]/10 rounded-xl flex items-center justify-center text-[#00FF88]">{s.icon}</div>
                    <span className="text-xs bg-[#00FF88]/5 text-[#00FF88]/70 border border-[#00FF88]/10 px-2 py-0.5 rounded">{s.tag}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#00FF88] text-xs font-mono tracking-widest uppercase mb-3">$ cat pricing.json</p>
            <h2 className="text-white text-4xl font-bold">Offres de protection</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 ${plan.highlight ? "bg-[#00FF88] text-black scale-105 shadow-2xl" : "bg-[#0A0F14] border border-white/10"}`}>
                  <h3 className={`font-bold text-xl mb-2 ${plan.highlight ? "text-black" : "text-white"}`}>{plan.name}</h3>
                  <div className="mb-6">
                    <span className={`text-3xl font-bold ${plan.highlight ? "text-black" : "text-white"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ${plan.highlight ? "text-black/60" : "text-gray-400"}`}>/{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-black" : "text-[#00FF88]"}`} />
                        <span className={plan.highlight ? "text-black/80" : "text-gray-400"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors ${plan.highlight ? "bg-black text-[#00FF88] hover:bg-gray-900" : "bg-[#00FF88] text-black hover:bg-[#00CC6E]"}`}>
                    Démarrer
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6 bg-[#080C12] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-8"><p className="text-gray-500 text-xs tracking-widest uppercase font-mono">Certifications & Accréditations</p></Reveal>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((c, i) => (
              <Reveal key={c} delay={i * 0.06}>
                <div className="bg-[#0A0F14] border border-[#00FF88]/20 text-[#00FF88] text-xs font-mono px-5 py-2.5 rounded-xl tracking-widest">{c}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060A0F] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-black" /></div><span className="text-white font-bold font-mono">FORTRESS</span></div>
            <p className="text-gray-500 text-sm leading-relaxed">Cybersécurité de niveau enterprise. Protection 24/7 pour les entreprises les plus exigeantes.</p>
          </div>
          {[
            { title: "Services", links: ["Pentest & Red Team", "SOC 24/7", "Audit RSSI", "DevSecOps"] },
            { title: "Ressources", links: ["Blog sécurité", "Threat Intelligence", "Documentation", "Webinaires"] },
            { title: "Contact", links: ["Audit gratuit", "Urgence cyber", "Partenaires", "Carrières"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><Link href="#" className="text-gray-500 text-sm hover:text-[#00FF88] transition-colors cursor-pointer">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600 font-mono">
          <span>© 2026 Fortress Security. All rights reserved.</span>
          <span>SOC STATUS: <span className="text-[#00FF88]">OPERATIONAL</span></span>
        </div>
      </footer>
    </div>
  );
}
