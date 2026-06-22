// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Droplets, ShieldCheck, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, Award, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   AQUANOVA PLOMBERIE — Plombier professionnel (Lyon)
   Palette : blanc / bleu atlantique #0369a1 / ardoise / acier
   Fonts : Outfit (titres) + Roboto Mono (accents)
   Style : clair, propre, professionnel, confiance
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
  { icon: Droplets, title: "Dépannage urgent 24h/24", desc: "Fuite d'eau, canalisation bouchée, casse de tuyauterie — intervention sous 1h. Disponible week-end et jours fériés." },
  { icon: Wrench, title: "Installation sanitaire", desc: "Salle de bain complète, WC, douche, baignoire, vasque. Fourniture et pose de robinetterie haut de gamme." },
  { icon: ShieldCheck, title: "Rénovation salle de bain", desc: "De la démolition à la finition. Conception sur-mesure, carrelage, plomberie, électricité, peinture. Clé en main." },
  { icon: Droplets, title: "Détection de fuite", desc: "Méthode non destructive par thermographie et corrélation acoustique. Localisation précise sans casser les murs." },
  { icon: Wrench, title: "Ballon d'eau chaude & PAC", desc: "Remplacement cumulus, installation chauffe-eau thermodynamique, optimisation consommation eau chaude sanitaire." },
  { icon: ShieldCheck, title: "Devis gratuit sous 2h", desc: "Estimation détaillée avec photos, sans engagement. Paiement en fin de chantier uniquement. Travaux garantis 2 ans." },
]

const REALISATIONS = [
  { title: "Rénovation complète SdB · 8 m²", tag: "Salle de bain clé en main", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200" },
  { title: "Détection fuite sous chape", tag: "Fuite non-destructive", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" },
  { title: "Salle de bain PMR · Villa", tag: "Accessibilité handicap", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200" },
]

export default function AquanovaPlomberiePage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-white text-[#0f172a] overflow-x-hidden" style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/97 backdrop-blur-xl py-3 shadow-sm border-b border-slate-100" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0369a1] flex items-center justify-center rounded">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0f172a]">AquaNova <span className="text-[#0369a1]">Plomberie</span></span>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a]/40">
            {["Services", "Réalisations", "Tarifs", "Zone intervention", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#0369a1] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0478987654" className="hidden md:flex items-center gap-2 text-[#0369a1] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 78 98 76 54
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#0369a1] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5 text-[#0f172a]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Réalisations", "Contact"].map(l => (
                    <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#0f172a] hover:text-[#0369a1] transition-colors">{l}</Link>
                  ))}
                  <a href="tel:0478987654" className="flex items-center gap-3 text-[#0369a1] font-bold text-xl mt-4">
                    <Phone className="w-5 h-5" /> 04 78 98 76 54
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=85&w=2400" alt="Plombier au travail" fill className="object-cover" priority style={{ filter: "brightness(0.6)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/55 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#0369a1]/20 backdrop-blur border border-[#0369a1]/30 rounded mb-8">
              <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#38bdf8]">Disponible maintenant · Intervention &lt; 1h</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 text-white">
            Votre plombier<br />de <span className="text-[#38bdf8]">confiance</span><br />à Lyon.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/45 leading-relaxed mb-10">
            Dépannage d'urgence, rénovation de salle de bain, détection de fuite. Artisan certifié RGE, devis gratuit sous 2h, garantie 2 ans sur tous les travaux.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[#0369a1] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">
              Devis gratuit sous 2h
            </button>
            <a href="tel:0478987654" className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.15em] rounded hover:bg-white/20 transition-all">
              <Phone className="w-4 h-4" /> Urgence 24h/24
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#38bdf8]/60 to-transparent" />
        </div>
      </section>

      {/* ── URGENCE BANNER ── */}
      <section className="bg-[#0369a1] py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-pulse" />
            <span className="font-bold text-sm">Urgence plomberie disponible 24h/24 · 7j/7</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white/80 text-sm font-semibold"><Clock className="w-4 h-4" /> &lt; 1h d'intervention</span>
            <a href="tel:0478987654" className="bg-white text-[#0369a1] px-5 py-2 rounded font-bold text-sm hover:bg-[#f0f9ff] transition-colors">
              04 78 98 76 54
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "18+", l: "Ans d'expérience" },
            { v: "2 400+", l: "Interventions" },
            { v: "4.9★", l: "Avis Google" },
            { v: "2 ans", l: "Garantie travaux" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="bg-white rounded-lg border border-slate-100 p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-[#0369a1] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0369a1] mb-4">Nos interventions</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a]">Tout ce que nous <span className="text-[#0369a1]">faisons.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 border border-slate-100 rounded-xl hover:border-[#0369a1]/30 hover:shadow-lg hover:shadow-[#0369a1]/5 transition-all duration-500">
                  <div className="w-12 h-12 bg-[#0369a1]/8 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0369a1] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#0369a1] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3 group-hover:text-[#0369a1] transition-colors">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0369a1] mb-4">Portfolio</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a]">Nos <span className="text-[#0369a1]">réalisations.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {REALISATIONS.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ParallaxImg src={r.img} alt={r.title} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#0369a1] text-white text-[9px] font-bold uppercase tracking-widest rounded">{r.tag}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#0f172a] group-hover:text-[#0369a1] transition-colors">{r.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0369a1] mb-4">Avis clients</div>
              <h2 className="text-4xl font-bold text-[#0f172a]">Ils nous font <span className="text-[#0369a1]">confiance.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Arrivé en moins d'une heure pour une fuite catastrophique sous l'évier. Réparation propre, explication claire, prix honnête. Parfait.", n: "Sandrine M.", l: "Lyon 3ème", s: 5 },
              { q: "Rénovation complète de notre salle de bain, du carrelage aux sanitaires. Résultat bluffant pour un budget respecté. On les recommande les yeux fermés.", n: "Patrick & Aurélie F.", l: "Villeurbanne", s: 5 },
              { q: "Détection de fuite sous ma terrasse sans démolir quoi que ce soit. Technologie impressionnante, réparation discrète. Service vraiment professionnel.", n: "Luc B.", l: "Lyon 6ème", s: 5 },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-slate-100 rounded-xl hover:border-[#0369a1]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.s)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#0369a1] text-[#0369a1]" />)}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="font-bold text-[#0f172a] text-sm">{t.n}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[#0369a1] mt-1"><MapPin className="w-3 h-3" /> {t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-16 bg-[#0369a1]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { t: "Certifié RGE", s: "Reconnu Garant Environnement" },
            { t: "Garantie Décennale", s: "Assurance professionnelle" },
            { t: "Label Qualibat", s: "Excellence artisanale" },
            { t: "Garantie 2 ans", s: "Sur tous les travaux" },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-2 py-4">
                <CheckCircle className="w-8 h-8 text-white/70 mb-1" />
                <div className="font-bold text-white text-sm">{c.t}</div>
                <div className="text-white/50 text-[10px] tracking-wide">{c.s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-[#0f172a] text-center">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#38bdf8] mb-6">Prendre contact</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Un problème ?<br /><span className="text-[#38bdf8]">On arrive.</span></h2>
            <p className="text-white/40 mb-10 text-sm leading-relaxed">Devis gratuit sous 2h · Intervention &lt; 1h pour les urgences · Travaux garantis 2 ans</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#0369a1] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">
                Demander un devis
              </button>
              <a href="tel:0478987654" className="flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-[0.15em] rounded hover:border-[#38bdf8]/50 hover:text-[#38bdf8] transition-all">
                <Phone className="w-4 h-4" /> 04 78 98 76 54
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060d18] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 bg-[#0369a1] rounded flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">AquaNova Plomberie</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">Plombier certifié RGE · Grand Lyon. Dépannage, rénovation, sanitaires depuis 2006.</p>
          </div>
          {[
            { t: "Services", ls: ["Dépannage urgent", "Installation sanitaire", "Rénovation SdB", "Détection de fuite", "Ballon eau chaude"] },
            { t: "Informations", ls: ["Qui sommes-nous", "Certifications RGE", "Zone d'intervention", "Témoignages", "Conseils plomberie"] },
            { t: "Contact", ls: ["04 78 98 76 54", "contact@aquanova.fr", "Zone Grand Lyon", "Urgences 24h/24", "Devis gratuit sous 2h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#38bdf8] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 AquaNova Plomberie · SIRET 234 567 890 00056 · RGE Qualibat · Assurance Décennale</span>
          <span className="text-[#38bdf8]/30">Plombier certifié · Grand Lyon</span>
        </div>
      </footer>
    </div>
  )
}
