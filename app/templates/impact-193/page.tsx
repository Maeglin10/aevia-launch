// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Wind, Hand, Star, Phone, MapPin, Clock, CheckCircle, Leaf, Circle, Calendar, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   OSTÉO GAÏA — Ostéopathe D.O. (Montpellier)
   Palette : sable doux #f5f0e8 / terracotta #c26b4c / brun chaud #5a3825 / beige foncé #3a2e28
   Fonts : Libre Baskerville (titres humanistes) + Lato
   Style : bien-être, corps, soin, chaleureux, corporel, confiance
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-55px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const PRISES_EN_CHARGE = [
  { icon: Wind, title: "Douleurs du dos & lombalgies", desc: "Cervicalgie, dorsalgie, lombalgie, sciatique. Traitement manuel des restrictions de mobilité articulaire et musculaire. Soins adaptés aux douleurs chroniques et aiguës." },
  { icon: Heart, title: "Suivi grossesse & nourrissons", desc: "Accompagnement périnatal, préparation à l'accouchement, suivi post-partum. Traitement des coliques, régurgitations et troubles du sommeil chez le nourrisson." },
  { icon: Hand, title: "Troubles musculo-squelettiques", desc: "Tendinites, entorses, tensions musculaires, troubles de la posture. Prise en charge préventive avant et récupérative après activité sportive." },
  { icon: Circle, title: "Céphalées & migraines", desc: "Migraines de tension, céphalées cervicogéniques. Traitement des zones de tension crâniennes et cervicales. Suivi sur plusieurs séances pour réduire la fréquence." },
  { icon: Leaf, title: "Digestion & viscéral", desc: "Syndrome de l'intestin irritable, colopathie fonctionnelle, RGO, constipation. Ostéopathie viscérale douce sur les organes et leurs attaches." },
  { icon: Calendar, title: "Sportifs & préparation physique", desc: "Bilan ostéo préventif avant saison, récupération post-blessure, optimisation mobilité articulaire. Suivi de sportifs amateurs et semi-professionnels." },
]

export default function OsteoGaiaPage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#f5f0e8] text-[#3a2e28] overflow-x-hidden" style={{ fontFamily: "'Lato', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f5f0e8]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#c26b4c]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            <div className="font-bold text-[#3a2e28] text-sm" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>Ostéo Gaïa</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#c26b4c]/60">Ostéopathe D.O. · Montpellier</div>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#3a2e28]/30">
            {["Soins", "L'approche", "Tarifs", "Agenda", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#c26b4c] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0467891234" className="hidden md:flex items-center gap-2 text-[#c26b4c] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 67 89 12 34
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#c26b4c] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#a85a3c] transition-colors rounded-lg">
              Prendre RDV
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#f5f0e8] border-slate-200 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Soins", "L'approche", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#3a2e28] hover:text-[#c26b4c] transition-colors" style={{ fontFamily: "'Libre Baskerville', serif" }}>{l}</Link>)}
                  <a href="tel:0467891234" className="flex items-center gap-3 text-[#c26b4c] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 04 67 89 12 34</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=85&w=2400" alt="Traitement ostéopathique manuel" fill className="object-cover object-center" priority style={{ filter: "brightness(0.38) saturate(0.8)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231a14] via-[#231a14]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#231a14]/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1300px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[#c26b4c]/70" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#d4937a]">Ostéopathe diplômée D.O. · Montpellier</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[84px] font-bold leading-[0.9] tracking-tight mb-7 text-[#f5f0e8]" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
            Retrouvez l'équilibre<br /><span className="text-[#c26b4c] italic">de votre corps.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-md text-sm text-[#f5f0e8]/30 leading-relaxed mb-10">
            Cabinet d'ostéopathie à Montpellier. Douleurs du dos, nourrissons, sportifs, grossesse. Approche globale, douce et personnalisée. Prise en charge mutuelle partielle.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-4">
            <button className="px-9 py-4 bg-[#c26b4c] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#a85a3c] transition-colors rounded-lg">
              Prendre rendez-vous
            </button>
            <a href="tel:0467891234" className="flex items-center gap-3 px-9 py-4 border border-[#f5f0e8]/12 text-[#f5f0e8]/40 font-bold text-[10px] uppercase tracking-widest hover:border-[#c26b4c]/40 hover:text-[#d4937a] transition-all rounded-lg">
              <Phone className="w-4 h-4" /> 04 67 89 12 34
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-[1px] h-10 bg-gradient-to-b from-[#c26b4c]/50 to-transparent" />
        </div>
      </section>

      {/* ── CONFIANCE ── */}
      <section className="py-10 bg-[#ede6d9]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-wrap gap-6 justify-center md:justify-between">
          {["Diplômée IFSO Montpellier", "Remboursement mutuelle", "Nourrissons & grossesse", "Suivi sportifs"].map((b, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#c26b4c]" />
                <span className="text-sm font-bold text-[#3a2e28]">{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SOINS ── */}
      <section className="py-28 bg-[#f5f0e8]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c26b4c] mb-4">Prises en charge</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3a2e28]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Votre corps mérite<br /><span className="text-[#c26b4c] italic">d'être écouté.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRISES_EN_CHARGE.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white rounded-xl border border-[#ede6d9] hover:border-[#c26b4c]/25 hover:shadow-lg hover:shadow-[#c26b4c]/5 transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#c26b4c]/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#c26b4c] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#c26b4c] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#3a2e28] mb-3 group-hover:text-[#c26b4c] transition-colors" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.title}</h3>
                  <p className="text-sm text-[#3a2e28]/38 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'APPROCHE ── */}
      <section className="py-24 bg-[#3a2e28] text-[#f5f0e8]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c26b4c]/60 mb-5">L'approche Gaïa</div>
              <h2 className="text-4xl font-bold text-[#f5f0e8] mb-7" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Traiter la cause,<br /><span className="text-[#c26b4c] italic">pas le symptôme.</span>
              </h2>
              <p className="text-[#f5f0e8]/40 leading-relaxed text-sm mb-6">
                L'ostéopathie part du principe que le corps a la capacité de s'autoréguler. Mon rôle est d'identifier et de lever les restrictions qui l'en empêchent — qu'elles soient musculo-squelettiques, viscérales ou crânio-sacrées.
              </p>
              <p className="text-[#f5f0e8]/40 leading-relaxed text-sm mb-8">
                Chaque consultation commence par une anamnèse complète et un bilan postural. Les techniques employées sont adaptées à votre sensibilité : jamais de geste brusque sans accord préalable.
              </p>
              <div className="flex gap-4">
                <button className="px-7 py-3.5 bg-[#c26b4c] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#a85a3c] transition-colors rounded-lg">
                  Prendre RDV
                </button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=85&w=800" alt="Cabinet ostéopathie" fill className="object-cover" style={{ filter: "brightness(0.7) saturate(0.8)" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c26b4c] mb-4">Patients</div>
            <h2 className="text-4xl font-bold text-[#3a2e28]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Ce qu'ils <span className="text-[#c26b4c] italic">ressentent.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Sciatique depuis 3 mois, aucun soulagement avec les médicaments. Après 2 séances avec Emma, la douleur a diminué de 70%. Je recommence à marcher normalement.", n: "Frédéric H.", l: "Montpellier" },
              { q: "Mon fils de 6 semaines avait des coliques intenses. Deux séances d'ostéopathie crânienne et les cris nocturnes ont quasiment disparu. Je n'aurais pas cru si je ne l'avais pas vécu.", n: "Camille & Maxime D.", l: "Lattes (34)" },
              { q: "Suivi trimestriel depuis ma grossesse jusqu'à maintenant (14 mois post-partum). Emma est bienveillante, pédagogue, ses mains savent exactement où aller. Une vraie experte.", n: "Louise M.", l: "Palavas-les-Flots" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-[#f5f0e8] rounded-xl border border-[#ede6d9] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c26b4c] text-[#c26b4c]" />)}
                  </div>
                  <p className="text-sm text-[#3a2e28]/45 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#ede6d9]">
                    <div className="font-bold text-[#3a2e28] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#c26b4c] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#c26b4c] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-5">Rendez-vous</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Un corps qui<br /><span className="italic">fonctionne bien.</span>
            </h2>
            <p className="text-white/55 mb-10 text-sm">Consultation 60 min · Montpellier · Remboursement mutuelle partiel · Réservation en ligne</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#c26b4c] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f5f0e8] transition-colors rounded-lg shadow-lg">
                Prendre rendez-vous
              </button>
              <a href="tel:0467891234" className="flex items-center gap-3 px-10 py-4 border border-white/25 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all rounded-lg">
                <Phone className="w-4 h-4" /> 04 67 89 12 34
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#231a14] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-[#f5f0e8] mb-1 text-sm" style={{ fontFamily: "'Libre Baskerville', serif" }}>Ostéo Gaïa</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#c26b4c]/50 mb-5">Emma Dubois · D.O.</div>
            <p className="text-[#f5f0e8]/20 text-sm leading-relaxed">Ostéopathe diplômée D.O. à Montpellier. Dos, nourrissons, sportifs, grossesse, viscéral, crânio-sacré.</p>
          </div>
          {[
            { t: "Soins", ls: ["Lombalgies & dos", "Nourrissons & bébés", "Grossesse & post-partum", "Sportifs", "Céphalées", "Viscéral"] },
            { t: "Cabinet", ls: ["L'approche", "Mon parcours", "Tarifs & remboursements", "Avis patients", "FAQ"] },
            { t: "RDV", ls: ["8 rue de la Merci", "34000 Montpellier", "Mar-Sam 8h30-19h", "04 67 89 12 34", "contact@osteo-gaia.fr"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c26b4c]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f5f0e8]/20 text-sm hover:text-[#f5f0e8]/60 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#f5f0e8]/8">
          <span>© 2026 Ostéo Gaïa · Emma Dubois D.O. · ADELI 340012345 · Montpellier (34)</span>
          <span className="text-[#c26b4c]/20">Ostéopathe · Montpellier</span>
        </div>
      </footer>
    </div>
  )
}
