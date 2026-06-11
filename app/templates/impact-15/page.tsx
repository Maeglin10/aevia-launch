// @ts-nocheck
"use client"

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Shield, Lock, Terminal, AlertTriangle, ChevronRight, Server, Eye, Zap, CheckCircle, HelpCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("fort-fonts")) return
    const s = document.createElement("style")
    s.id = "fort-fonts"
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap');`
    document.head.appendChild(s)
  }, [])
}

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  )
}

const SERVICES = [
  { icon: <Shield className="w-6 h-6" />, title: "Pentest & Red Team", desc: "Simulation d'attaques avancées. Nous pensons comme vos adversaires pour révéler vos failles avant eux.", tag: "Offensif" },
  { icon: <Eye className="w-6 h-6" />, title: "SOC & SIEM 24/7", desc: "Surveillance continue de votre infrastructure. Détection des menaces en temps réel, réponse en moins de 15 min.", tag: "Défensif" },
  { icon: <Lock className="w-6 h-6" />, title: "Audit RSSI", desc: "Analyse complète de votre posture sécurité, conformité RGPD/ISO 27001, et roadmap de remédiation priorisée.", tag: "Conseil" },
  { icon: <Server className="w-6 h-6" />, title: "DevSecOps", desc: "Intégration de la sécurité dans vos pipelines CI/CD. Analyse SAST/DAST automatisée à chaque déploiement.", tag: "Intégration" },
  { icon: <AlertTriangle className="w-6 h-6" />, title: "Incident Response", desc: "Cellule de crise disponible 24h/24. Containment, éradication, forensics et communication de crise.", tag: "Urgence" },
  { icon: <Zap className="w-6 h-6" />, title: "Formation & CTF", desc: "Programmes de sensibilisation et challenges cyber pour vos équipes techniques et non techniques.", tag: "Prévention" },
]

const STATS = [
  { n: "2 400+", l: "Entreprises protégées" },
  { n: "99.7%", l: "Uptime SOC" },
  { n: "< 15min", l: "Temps de réponse" },
  { n: "0", l: "Brèche non détectée" },
]

const CERTIFICATIONS = ["ISO 27001", "SOC 2 Type II", "PASSI ANSSI", "CREST", "CEH", "OSCP"]

const THREATS = [
  { type: "Ransomware", severity: "CRITIQUE", time: "03:42:17" },
  { type: "Phishing ciblé", severity: "HAUTE", time: "01:15:03" },
  { type: "Exfiltration données", severity: "CRITIQUE", time: "00:08:44" },
  { type: "Accès non autorisé", severity: "MOYENNE", time: "12:30:01" },
]

const PLANS = [
  { name: "Starter", price: "2 490€", period: "mois", features: ["Audit de surface", "Scan vulnérabilités", "Rapport mensuel", "Support 9h–18h"], highlight: false },
  { name: "Business", price: "5 990€", period: "mois", features: ["SOC 24/7", "Pentest trimestriel", "SIEM managé", "Réponse < 30 min", "RSSI virtuel"], highlight: true },
  { name: "Enterprise", price: "Sur devis", period: "", features: ["Red team continu", "SOC dédié", "Compliance automatisée", "SLA personnalisé", "CISO on demand"], highlight: false },
]

type ActivePage = "home" | "services" | "offres" | "certifications" | "legal"

export default function FortressPage() {
  useFonts()
  const [page, setPage] = useState<ActivePage>("home")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeService, setActiveService] = useState(0)

  const goTo = (p: ActivePage) => {
    setPage(p)
    setMobileOpen(false)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }

  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"])

  return (
    <div className="min-h-screen bg-[#060A0F] text-white selection:bg-[#00FF88]/20 selection:text-[#00FF88]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#00FF88] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 font-mono">
        <div className="max-w-6xl mx-auto bg-[#060A0F]/90 backdrop-blur-md border border-[#00FF88]/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg">
          <div onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-black" /></div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FORTRESS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            {[
              { name: "Services", key: "services" },
              { name: "Offres", key: "offres" },
              { name: "Certifications", key: "certifications" }
            ].map(item => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                className={`hover:text-[#00FF88] transition-colors cursor-pointer ${page === item.key ? "text-[#00FF88] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <button onClick={() => goTo("offres")} className="hidden md:inline-flex bg-[#00FF88] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00CC6E] transition-colors cursor-pointer">
            Audit gratuit
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
               <button className="md:hidden text-white cursor-pointer"><Menu className="w-5 h-5" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#060A0F] border-[#00FF88]/10 text-white p-8">
               <div className="flex items-center gap-2 mb-12">
                  <div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-black" /></div>
                  <span className="text-white font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FORTRESS</span>
               </div>
               <div className="flex flex-col gap-6 font-mono font-medium">
                  {[
                    { name: "Accueil", key: "home" },
                    { name: "Services", key: "services" },
                    { name: "Offres", key: "offres" },
                    { name: "Certifications", key: "certifications" },
                    { name: "Mentions Légales", key: "legal" }
                  ].map(item => (
                    <a 
                      key={item.key} 
                      href={`#${item.key}`} 
                      onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                      className={`text-xl hover:text-[#00FF88] transition-colors ${page === item.key ? "text-[#00FF88] font-bold" : "text-gray-400"}`}
                    >
                      {item.name}
                    </a>
                  ))}
               </div>
            </SheetContent>
         </Sheet>
        </div>
      </nav>

      <main className="pt-24">
        {page === "home" && (
          <>
            {/* Hero */}
            <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center pt-20 pb-16 px-6">
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
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 font-sans">
                      Fortress protège les entreprises les plus exigeantes contre les attaques les plus sophistiquées. SOC 24/7, pentests, RSSI virtuel.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="flex gap-4">
                      <button onClick={() => goTo("offres")} className="bg-[#00FF88] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00CC6E] transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#00FF88]/10">
                        Audit gratuit <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => goTo("services")} className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer font-semibold">
                        Découvrir les services
                      </button>
                    </div>
                  </Reveal>
                </div>
                {/* Terminal widget */}
                <Reveal delay={0.15}>
                  <div className="bg-[#0A0F14] border border-[#00FF88]/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#0F151C] border-b border-[#00FF88]/10">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      <span className="text-gray-500 text-xs font-mono ml-2">fortress-soc — threat_monitor</span>
                    </div>
                    <div className="p-5 space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {THREATS.map((t, i) => (
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
            <section className="py-12 bg-[#00FF88] relative z-10">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
                {STATS.map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-black text-3xl font-bold mb-1 font-mono">{s.n}</p>
                    <p className="text-black/50 text-xs uppercase tracking-widest font-bold">{s.l}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Services Preview */}
            <section className="py-24 px-6 bg-[#080C12] border-t border-white/5">
              <div className="max-w-6xl mx-auto">
                <Reveal className="flex justify-between items-end mb-12">
                  <div>
                    <p className="text-[#00FF88] text-xs font-mono tracking-widest uppercase mb-3">$ ls services/</p>
                    <h2 className="text-white text-4xl font-bold">Protection complète</h2>
                  </div>
                  <button onClick={() => goTo("services")} className="text-[#00FF88] text-sm font-bold flex items-center gap-2 hover:underline font-mono">
                    Consulter les protocoles <ArrowRight className="w-4 h-4" />
                  </button>
                </Reveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SERVICES.slice(0, 3).map((s, i) => (
                    <Reveal key={s.title} delay={i * 0.07}>
                      <div onClick={() => goTo("services")} className="bg-[#0A0F14] border border-white/5 rounded-2xl p-6 cursor-pointer transition-all hover:border-[#00FF88]/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-[#00FF88]/10 rounded-xl flex items-center justify-center text-[#00FF88]">{s.icon}</div>
                          <span className="text-xs font-mono bg-[#00FF88]/5 text-[#00FF88]/70 border border-[#00FF88]/10 px-2 py-0.5 rounded">{s.tag}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-sans">{s.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "services" && <ServicesPage goTo={goTo} />}
        {page === "offres" && <OffresPage />}
        {page === "certifications" && <CertificationsPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-[#060A0F] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div onClick={() => goTo("home")} className="flex items-center gap-2 mb-4 cursor-pointer">
               <div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-black" /></div>
               <span className="text-white font-bold font-mono">FORTRESS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-sans">Cybersécurité de niveau enterprise. Protection 24/7 pour les entreprises les plus exigeantes.</p>
          </div>
          {[
            { title: "Services", items: [{ n: "Red Team & Pentest", k: "services" }, { n: "SOC 24/7 & SIEM", k: "services" }, { n: "Audit & RSSI", k: "services" }] },
            { title: "Ressources", items: [{ n: "Abonnements", k: "offres" }, { n: "Accréditations", k: "certifications" }] },
            { title: "Légal", items: [{ n: "Mentions Légales", k: "legal" }, { n: "Sécurité", k: "legal" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4 font-mono">{col.title}</h4>
              <ul className="space-y-2 font-sans">
                {col.items.map(l => <li key={l.n}><a href="#" onClick={(e) => { e.preventDefault(); goTo(l.k as any); }} className="text-gray-500 text-sm hover:text-[#00FF88] transition-colors cursor-pointer">{l.n}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600 font-mono">
          <span>© 2026 Fortress Security. All rights reserved.</span>
          <span>SOC STATUS: <span className="text-[#00FF88] animate-pulse">OPERATIONAL</span></span>
        </div>
      </footer>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (CYBER SECURITY TECH STYLE)
   ========================================================================= */

function ServicesPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  return (
    <section className="py-20 px-6 bg-[#080C12] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 font-mono">
          <span className="text-[#00FF88] text-xs uppercase tracking-widest block mb-4">$ cat services.info</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-sans">Protocoles de Protection</h1>
          <p className="max-w-2xl mx-auto text-gray-500 font-sans">
            Nous combinons des capacités offensives d'élite avec des systèmes défensifs automatisés pour assurer la résilience globale de vos données et architectures cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="bg-[#0A0F14] border border-white/5 rounded-3xl p-8 hover:border-[#00FF88]/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#00FF88]/10 rounded-xl flex items-center justify-center text-[#00FF88]">{s.icon}</div>
                  <span className="text-xs font-mono bg-[#00FF88]/5 text-[#00FF88]/70 border border-[#00FF88]/10 px-3 py-1 rounded-full">{s.tag}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-sans mb-8">
                  {s.desc} Nos équipes opèrent selon les méthodologies standards les plus strictes (OWASP, MITRE ATT&CK, ISO 27001) pour vous fournir des livrables de remédiation directement applicables.
                </p>
              </div>
              <button onClick={() => goTo("offres")} className="w-full py-4 bg-[#0A0F14] hover:bg-[#00FF88] text-[#00FF88] hover:text-black border border-[#00FF88]/30 hover:border-transparent rounded-xl text-sm font-bold transition-all font-mono">
                [ Request_Assessment_{s.tag.toUpperCase()} ]
              </button>
            </div>
          ))}
        </div>

        <div className="border border-[#00FF88]/20 bg-[#00FF88]/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 font-mono">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Cellule de Crise Incidents Cyber 24/7</h3>
            <p className="text-gray-400 text-sm max-w-xl font-sans">
              Votre infrastructure fait l'objet d'une intrusion ou d'une demande de rançon ? Contactez notre cellule d'intervention d'urgence pour un confinement immédiat.
            </p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
            ALERTE INFRASTRUCTURE
          </button>
        </div>
      </div>
    </section>
  )
}

function OffresPage() {
  return (
    <section className="py-20 px-6 bg-[#060A0F] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 font-mono">
          <span className="text-[#00FF88] text-xs uppercase tracking-widest block mb-4">$ cat offerings.config</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-sans">Plans & Niveaux de Service</h1>
          <p className="max-w-xl mx-auto text-gray-500 font-sans">
            Des formules de protection adaptées à votre volume d'activité. Garantie de temps de réponse (SLA) contractuelle sur tous nos abonnements professionnels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${plan.highlight ? "bg-[#00FF88] text-black scale-105 shadow-2xl shadow-[#00FF88]/10" : "bg-[#0A0F14] border border-white/10"}`}>
              <div>
                <h3 className={`font-bold text-2xl mb-2 font-mono ${plan.highlight ? "text-black" : "text-white"}`}>{plan.name}</h3>
                <div className="mb-6 font-mono">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-black" : "text-white"}`}>{plan.price}</span>
                  {plan.period && <span className={`text-sm ${plan.highlight ? "text-black/60" : "text-gray-400"}`}>/{plan.period}</span>}
                </div>
                <ul className="space-y-4 mb-8 font-sans font-medium text-sm">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-black" : "text-[#00FF88]"}`} />
                      <span className={plan.highlight ? "text-black/95" : "text-gray-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-colors cursor-pointer font-mono ${plan.highlight ? "bg-black text-[#00FF88] hover:bg-gray-950" : "bg-[#00FF88] text-black hover:bg-[#00CC6E]"}`}>
                [ Select_Plan_{plan.name.toUpperCase()} ]
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto font-mono">
          <h2 className="text-2xl font-bold text-center mb-10 text-white font-sans">Engagements SLA & Garanties</h2>
          <div className="space-y-6 font-sans">
            {[
              { q: "Quelles sont les garanties de temps d'intervention ?", a: "Pour l'offre Business, nous garantissons un début d'analyse de l'alerte SOC sous 30 minutes. Pour le niveau Enterprise, ce délai est abaissé à 15 minutes, avec pénalités contractuelles automatiques en cas de dépassement." },
              { q: "Qu'est-ce que l'infrastructure SIEM managée ?", a: "Nous déployons et configurons nos agents de collecte de logs sur vos serveurs cloud. Toutes les données de sécurité sont corrélées en temps réel par notre moteur IA de détection comportementale et analysées par nos opérateurs SOC." },
              { q: "Le diagnostic gratuit est-il intrusif ?", a: "Non, notre audit de surface initial consiste en une cartographie passive externe de vos ports ouverts et de vos sous-domaines exposés. Il n'y a aucun risque de perturbation de vos services." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#0A0F14] rounded-2xl p-6 border border-white/5 flex gap-4">
                <HelpCircle className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CertificationsPage() {
  return (
    <section className="py-20 px-6 bg-[#080C12] border-t border-white/5 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#00FF88] text-xs uppercase tracking-widest block mb-4">$ ls compliance/certifications</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-sans">Accréditations Cyber</h1>
          <p className="max-w-2xl mx-auto text-gray-500 font-sans">
            Nous faisons auditer nos pratiques et nos outils par des tiers de confiance indépendants pour vous garantir le plus haut niveau d'exigence réglementaire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { n: "PASSI ANSSI", d: "Prestataire d'Audit de la Sécurité des Systèmes d'Information qualifié par l'ANSSI pour les audits réglementaires étatiques français." },
            { n: "ISO 27001", d: "Certification internationale garantissant que Fortress déploie un Système de Management de la Sécurité de l'Information (SMSI) robuste." },
            { n: "SOC 2 Type II", d: "Rapport d'audit indépendant validant l'efficacité opérationnelle de nos contrôles de sécurité et de confidentialité sur une période de 12 mois." }
          ].map((c, i) => (
            <div key={i} className="bg-[#0A0F14] border border-[#00FF88]/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-[#00FF88] mb-4">{c.n}</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {CERTIFICATIONS.map(c => (
            <div key={c} className="bg-[#0A0F14] border border-white/10 text-white/50 text-xs px-5 py-2.5 rounded-xl tracking-widest hover:border-[#00FF88]/20 hover:text-[#00FF88] transition-colors">{c}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LegalPage() {
  return (
    <section className="py-20 px-6 bg-[#060A0F] border-t border-white/5 font-mono text-xs">
      <div className="max-w-3xl mx-auto space-y-16">
        <div>
          <span className="text-[#00FF88] text-[10px] uppercase tracking-widest mb-4 block">$ check --compliance</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter italic text-white mb-12 font-sans">Mentions Légales</h1>
        </div>

        <div className="border border-white/10 bg-[#0A0F14] p-10 space-y-6">
          <div className="border-b border-white/10 pb-4">
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">EDITEUR</div>
             <p className="text-white font-medium uppercase leading-relaxed">
                Aevia WS — Valentin Milliand<br />
                Entrepreneur Individuel<br />
                SIREN : 852 546 225<br />
                RCS : Bourg-en-Bresse<br />
                Email : contact@aevia.io<br />
                Adresse : Communiquée sur demande
             </p>
          </div>

          <div className="border-b border-white/10 pb-4">
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">HEBERGEUR</div>
             <p className="text-white font-medium uppercase leading-relaxed">
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789, USA
             </p>
          </div>

          <div>
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">PROPRIETE INTELLECTUELLE</div>
             <p className="text-white/50 font-medium uppercase leading-relaxed font-sans">
                Toutes les marques, images, logos, structures de code et fichiers multimédias présents sur ce site sont la propriété exclusive de Fortress Security ou de ses représentants autorisés. Toute reproduction sans accord écrit préalable fera l'objet de poursuites pénales.
             </p>
          </div>
        </div>
      </div>
    </section>
  )
}
