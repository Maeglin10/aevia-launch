// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { HardHat, Hammer, Phone, Star, MapPin, ArrowRight, CheckCircle, Ruler, ShieldCheck, Award, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   BÂTIR SOLIDE — Maçon & Gros Œuvre (Marseille)
   Palette : sable chaud #d4a96a / brun terre #5c3317 / blanc cassé / ardoise
   Fonts : Barlow (titres condensed bold) + Source Sans (corps)
   Style : puissant, artisanal, solide, méditerranéen
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
  { icon: Hammer, title: "Gros œuvre & fondations", desc: "Terrassement, fouilles, fondations, chaînages, dalles, poteaux. Construction de maisons individuelles, extensions, garages." },
  { icon: Ruler, title: "Extension & surélévation", desc: "Agrandissement de votre maison, pièce supplémentaire, véranda maçonnée, surélévation de toiture. Études de faisabilité incluses." },
  { icon: HardHat, title: "Ravalement de façade", desc: "Enduit monocouche, crépis, peinture minérale, ITE (isolation thermique par l'extérieur). Travaux en grande hauteur." },
  { icon: Hammer, title: "Rénovation structurelle", desc: "Suppression de murs porteurs, création d'ouvertures, renforcement de plancher. Études de structure par ingénieur partenaire." },
  { icon: Ruler, title: "Dallage & terrassement", desc: "Terrassement général, voirie, dallage béton, fondations pour abris et piscines. Engins de chantier disponibles." },
  { icon: ShieldCheck, title: "Réparation fissurations", desc: "Diagnostic des fissures, injection de résines, armatures, reprise en sous-œuvre. Rapport d'expertise fourni." },
]

const REALISATIONS = [
  { title: "Extension 45 m² · Villa provençale", tag: "Extension gros œuvre", img: "https://images.unsplash.com/photo-1590725138916-85f5af01fc2e?auto=format&fit=crop&q=80&w=1200" },
  { title: "Ravalement ITE · Immeuble R+4", tag: "Isolation thermique extérieure", img: "https://images.unsplash.com/photo-1504662955545-b8d7b98bef0b?auto=format&fit=crop&q=80&w=1200" },
  { title: "Construction garage + dalle béton", tag: "Gros œuvre & dallage", img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1200" },
]

export default function BatirSolidePage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#faf7f2] text-[#1a1008] overflow-x-hidden" style={{ fontFamily: "'Barlow', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#1a1008]/96 backdrop-blur-xl py-3 border-b border-[#d4a96a]/15" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardHat className="w-6 h-6 text-[#d4a96a]" />
            <span className="font-black text-lg tracking-wide text-white uppercase">Bâtir <span className="text-[#d4a96a]">Solide</span></span>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            {["Savoir-faire", "Chantiers", "Matériaux", "Zone", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#d4a96a] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0491234567" className="hidden md:flex items-center gap-2 text-[#d4a96a] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 91 23 45 67
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#d4a96a] text-[#1a1008] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e8bf85] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#1a1008] border-[#d4a96a]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Savoir-faire", "Chantiers", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-black uppercase text-white hover:text-[#d4a96a] transition-colors">{l}</Link>)}
                  <a href="tel:0491234567" className="flex items-center gap-3 text-[#d4a96a] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 04 91 23 45 67</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=85&w=2400" alt="Maçon construction gros œuvre" fill className="object-cover" priority style={{ filter: "brightness(0.5)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-[#1a1008]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1008]/65 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-[2px] bg-[#d4a96a]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#d4a96a]">Maçon & Gros Œuvre · Région PACA</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter mb-9 uppercase text-white">
            On construit<br />pour <span className="text-[#d4a96a]">durer.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10">
            Gros œuvre, extensions, ravalement, fondations. Artisan maçon qualifié Qualibat, 25 ans d'expérience sur la région PACA. Garantie décennale, devis gratuit sous 48h.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-9 py-4 bg-[#d4a96a] text-[#1a1008] font-black text-[10px] uppercase tracking-[0.25em] hover:bg-[#e8bf85] transition-colors">
              Devis gratuit sous 48h
            </button>
            <a href="tel:0491234567" className="flex items-center gap-3 px-9 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#d4a96a]/50 hover:text-[#d4a96a] transition-all">
              <Phone className="w-4 h-4" /> 04 91 23 45 67
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#d4a96a]/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#2d1f0e]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-0">
          {[
            { v: "25 ans", l: "D'expérience" },
            { v: "900+", l: "Chantiers livrés" },
            { v: "Qualibat", l: "3311 Gros Œuvre" },
            { v: "10 ans", l: "Décennale garantie" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-8 border-r border-white/10 last:border-r-0">
                <div className="text-2xl font-black text-[#d4a96a] mb-1 uppercase">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#faf7f2]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5c3317] mb-4">Savoir-faire</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase text-[#1a1008]">Ce qu'on <span className="text-[#5c3317]">sait faire.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white border border-[#d4a96a]/10 hover:border-[#d4a96a]/40 hover:shadow-lg hover:shadow-[#d4a96a]/5 transition-all duration-500">
                  <div className="w-11 h-11 bg-[#d4a96a]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4a96a] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#5c3317] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-[#1a1008] mb-3 uppercase tracking-wide group-hover:text-[#5c3317] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#1a1008]/45 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section className="py-28 bg-[#1a1008]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a96a] mb-4">Portfolio chantiers</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white">Nos <span className="text-[#d4a96a]">chantiers.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {REALISATIONS.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5">
                    <ParallaxImg src={r.img} alt={r.title} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#d4a96a] text-[#1a1008] text-[9px] font-black uppercase tracking-widest">{r.tag}</div>
                    <div className="absolute inset-0 bg-[#1a1008]/0 group-hover:bg-[#1a1008]/20 transition-all duration-700" />
                  </div>
                  <h3 className="font-black text-white uppercase group-hover:text-[#d4a96a] transition-colors">{r.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="about" className="py-28 bg-[#faf7f2]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5c3317] mb-4">Avis clients</div>
            <h2 className="text-4xl font-black uppercase text-[#1a1008]">Ce qu'ils <span className="text-[#5c3317]">disent.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Extension de 40 m² réalisée en 3 mois top chrono. Qualité béton irréprochable, finitions soignées, aucun dépassement budget. Chapeau.", n: "Jean-Pierre M.", l: "Marseille 12ème" },
              { q: "Suppression d'un mur porteur de 6m avec IPN. Bâtir Solide a géré l'étude de structure et les travaux. Parfait, aucune fissure, résultat propre.", n: "Nathalie & Frédéric D.", l: "Aix-en-Provence" },
              { q: "Ravalement ITE de notre immeuble 6 logements. Dossier MaPrimeRénov' entièrement géré par l'équipe. Économies énergétiques bluffantes.", n: "Syndicat copropriété Les Pins", l: "Aubagne (13)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-[#d4a96a]/10 hover:border-[#d4a96a]/30 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#d4a96a] text-[#d4a96a]" />)}
                  </div>
                  <p className="text-[#1a1008]/45 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#d4a96a]/10">
                    <div className="font-black text-[#1a1008] text-sm uppercase tracking-wide">{t.n}</div>
                    <div className="text-[10px] text-[#5c3317] mt-1"><MapPin className="w-3 h-3 inline mr-1" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="realisations" className="py-32 bg-[#2d1f0e] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a96a] mb-6">Votre projet</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-6">Un projet<br /><span className="text-[#d4a96a]">de construction ?</span></h2>
            <p className="text-white/35 mb-10 text-sm leading-relaxed">Devis gratuit sous 48h · Garantie décennale · Qualibat 3311</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#d4a96a] text-[#1a1008] font-black text-[10px] uppercase tracking-[0.25em] hover:bg-[#e8bf85] transition-colors">
                Demander un devis
              </button>
              <a href="tel:0491234567" className="flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#d4a96a]/50 hover:text-[#d4a96a] transition-all">
                <Phone className="w-4 h-4" /> 04 91 23 45 67
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#0f0905] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><HardHat className="w-5 h-5 text-[#d4a96a]" /><span className="font-black text-white text-sm uppercase">Bâtir Solide</span></div>
            <p className="text-white/25 text-sm leading-relaxed">Maçon & Gros Œuvre · Région PACA. Construction, extension, ravalement depuis 1999.</p>
          </div>
          {[
            { t: "Savoir-faire", ls: ["Gros œuvre", "Extensions", "Ravalement ITE", "Rénovation structurelle", "Dallage & terrassement"] },
            { t: "Certifications", ls: ["Qualibat 3311", "Garantie Décennale", "RGE ITE", "MaPrimeRénov' éligible", "Assurance civile"] },
            { t: "Contact", ls: ["04 91 23 45 67", "devis@batirsolide.fr", "Marseille & PACA", "Lundi-Vendredi 7h-18h", "Devis gratuit 48h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4a96a] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 Bâtir Solide · SIRET 567 890 123 00045 · Qualibat 3311 · Assurance Décennale SMABTP</span>
          <span className="text-[#d4a96a]/30">Maçon certifié · Région PACA</span>
        </div>
      </footer>
    </div>
  )
}
