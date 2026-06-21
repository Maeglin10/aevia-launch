// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flame, Thermometer, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, Shield, Zap, Menu, Award } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   THERMOTEK CHAUFFAGE — Chauffagiste professionnel (Bordeaux)
   Palette : noir charbon / orange flamme #ea580c / cuivre / blanc
   Fonts : DM Sans (titres) + Fira Code (accents)
   Style : dark industrial warm, technique et rassurant
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const SERVICES = [
  { icon: Flame, title: "Installation chaudière", desc: "Chaudière gaz, fioul, condensation, micro-cogénération. Toutes marques. Mise en service et formation à l'utilisation incluses." },
  { icon: Thermometer, title: "Pompe à chaleur (PAC)", desc: "PAC air-air, air-eau, géothermique. Dossier CEE et aides MaPrimeRénov' gérés par nos soins. Garantie 5 ans." },
  { icon: Wrench, title: "Entretien & révision", desc: "Contrat d'entretien annuel (obligatoire pour les chaudières gaz). Rapport de combustion, nettoyage, diagnostic." },
  { icon: Zap, title: "Dépannage d'urgence", desc: "Plus de chauffage en plein hiver ? Intervention sous 4h dans la métropole bordelaise. Astreinte 7j/7 de novembre à mars." },
  { icon: Shield, title: "Plancher chauffant", desc: "Pose de plancher chauffant hydraulique sur dalle neuve ou rénovation. Conception de la régulation par pièce." },
  { icon: Flame, title: "VMC & ventilation", desc: "VMC simple et double flux, DRV, traitement de l'air. Bilan aéraulique, pose, entretien. Labels QualAir et RGE." },
]

export default function ThermotekChauffagePage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0906] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0906]/97 backdrop-blur-xl py-3 border-b border-[#ea580c]/10" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-[#ea580c] fill-[#ea580c]/20" />
            <span className="font-bold text-lg tracking-tight">Thermo<span className="text-[#ea580c]">tek</span></span>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            {["Services", "Réalisations", "Contrats", "Zone", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-[#ea580c] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0556123456" className="hidden md:flex items-center gap-2 text-[#ea580c] font-bold text-sm">
              <Phone className="w-4 h-4" /> 05 56 12 34 56
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#f97316] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0906] border-[#ea580c]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Contact"].map(l => <Link key={l} href="#" className="text-3xl font-bold hover:text-[#ea580c] transition-colors">{l}</Link>)}
                  <a href="tel:0556123456" className="flex items-center gap-3 text-[#ea580c] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 05 56 12 34 56</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=85&w=2400" alt="Chauffagiste intervention chaudière" fill className="object-cover" priority style={{ filter: "brightness(0.5)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906] via-[#0a0906]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0906]/60 to-transparent" />
          <div className="absolute inset-0 bg-[#ea580c]/5 mix-blend-overlay" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-7" style={{ fontFamily: "'Fira Code', monospace" }}>
              <Flame className="w-4 h-4 text-[#ea580c]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#ea580c]">Chauffagiste certifié RGE · Bordeaux Métropole</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-9">
            Votre confort<br />thermique,<br /><span className="text-[#ea580c]">notre priorité.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10">
            Installation, entretien et dépannage de chaudières, pompes à chaleur et planchers chauffants. Certifié RGE, éligible aides MaPrimeRénov'. Intervention d'urgence sous 4h.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[#ea580c] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#f97316] transition-colors">
              Devis gratuit
            </button>
            <a href="tel:0556123456" className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#ea580c]/50 hover:text-[#ea580c] transition-all">
              <Phone className="w-4 h-4" /> Urgence 4h
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#ea580c]/60 to-transparent" />
        </div>
      </section>

      {/* ── URGENCE BANNER ── */}
      <section className="bg-[#ea580c] py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-sm text-white">Panne de chauffage ? Astreinte 7j/7 de novembre à mars</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-white/85 font-semibold text-sm"><Clock className="w-4 h-4" /> &lt; 4h d'intervention</span>
            <a href="tel:0556123456" className="bg-white text-[#ea580c] px-5 py-2 font-bold text-sm hover:bg-orange-50 transition-colors">05 56 12 34 56</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "22+", l: "Ans d'expérience" },
            { v: "3 200+", l: "Installations" },
            { v: "98%", l: "Satisfaction clients" },
            { v: "RGE", l: "Qualibat / QualiPAC" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center border border-white/5 p-6 hover:border-[#ea580c]/20 transition-colors">
                <div className="text-3xl font-bold text-[#ea580c] mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ea580c] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Nos métiers</div>
              <h2 className="text-4xl md:text-5xl font-bold">Ce que nous <span className="text-[#ea580c]">maîtrisons.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="bg-[#0a0906] p-9 group hover:bg-[#140c07] transition-colors duration-500 h-full flex flex-col gap-5">
                  <div className="w-11 h-11 border border-[#ea580c]/20 flex items-center justify-center group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-all duration-500">
                    <s.icon className="w-5 h-5 text-[#ea580c] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-3 group-hover:text-[#ea580c] transition-colors">{s.title}</h3>
                    <p className="text-sm text-white/30 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-[#06040a] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ea580c] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Avis clients</div>
            <h2 className="text-4xl font-bold">Ce qu'ils <span className="text-[#ea580c]">disent.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Chaudière tombée en panne un dimanche soir de janvier. Technicien présent en 3h. Pièce remplacée, chaudière repartie. Service au top.", n: "Bernard L.", l: "Bordeaux (33)" },
              { q: "Thermotek nous a installé une PAC air-eau et géré toutes les aides MaPrimeRénov'. Économie de 60% sur notre facture de gaz. Exceptionnel.", n: "Isabelle & Marc D.", l: "Mérignac (33)" },
              { q: "Entretien annuel ponctuel, technicien sérieux et pédagogue. Le rapport de combustion est clair. On continue avec Thermotek depuis 8 ans.", n: "Sylvain A.", l: "Pessac (33)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="border border-white/5 p-9 hover:border-[#ea580c]/15 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#ea580c] text-[#ea580c]" />)}
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="border-t border-white/5 pt-5 mt-6">
                    <div className="font-bold text-sm uppercase tracking-widest">{t.n}</div>
                    <div className="text-[10px] text-[#ea580c]/60 mt-1"><MapPin className="w-2.5 h-2.5 inline mr-1" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-36 bg-[#ea580c] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6" style={{ fontFamily: "'Fira Code', monospace" }}>// Prendre contact</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Besoin de chaleur ?<br />On s'en occupe.</h2>
            <p className="text-white/60 mb-10 text-sm leading-relaxed">Devis gratuit sous 24h · Éligible MaPrimeRénov' · Certifié RGE</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#ea580c] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-orange-50 transition-colors">
                Demander un devis
              </button>
              <a href="tel:0556123456" className="flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" /> 05 56 12 34 56
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#040302] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Flame className="w-5 h-5 text-[#ea580c]" />
              <span className="font-bold text-sm">Thermotek Chauffage</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">Chauffagiste RGE · Bordeaux Métropole. Chaudières, PAC, plancher chauffant depuis 2002.</p>
          </div>
          {[
            { t: "Services", ls: ["Chaudière gaz/condensation", "Pompe à chaleur", "Plancher chauffant", "VMC double flux", "Entretien annuel", "Dépannage urgent"] },
            { t: "Aides", ls: ["MaPrimeRénov'", "CEE (Certificats Économie Énergie)", "Eco-prêt taux zéro", "TVA à 5,5%", "Dossiers pris en charge"] },
            { t: "Contact", ls: ["05 56 12 34 56", "contact@thermotek.fr", "Bordeaux Métropole", "Astreinte hiver 24h/24", "Devis gratuit 24h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ea580c] mb-5" style={{ fontFamily: "'Fira Code', monospace" }}>{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 Thermotek Chauffage · SIRET 345 678 901 00034 · RGE Qualibat · QualiPAC · Assurance Décennale</span>
          <span className="text-[#ea580c]/30">Chauffagiste certifié · Bordeaux</span>
        </div>
      </footer>
    </div>
  )
}
