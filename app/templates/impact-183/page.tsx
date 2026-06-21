// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Paintbrush, Sparkles, Phone, Star, MapPin, ArrowRight, CheckCircle, Layers, Brush, Shield, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   COULEURS & CO — Peintre en bâtiment (Lille)
   Palette : blanc pur / vert sauge #4d7c5f / gris perle #e8e8e4 / encre #1a1a2e
   Fonts : Montserrat (titres) + Nunito (corps)
   Style : frais, propre, coloré, artisanal premium
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
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
  { icon: Paintbrush, title: "Peinture intérieure", desc: "Séjour, chambre, cuisine, bureau. Préparation des supports (enduit, rebouchage, ponçage), application soignée multicouche. Toutes teintes." },
  { icon: Layers, title: "Revêtement mural", desc: "Papier peint, toile de verre, enduit décoratif, béton ciré, stuc. Pose soignée, raccords impeccables, respect des calepinages." },
  { icon: Brush, title: "Peinture extérieure", desc: "Façade, volets, portail, clôture. Peinture microporeuse, lasure, laque. Nettoyage haute pression et imperméabilisation inclus." },
  { icon: Sparkles, title: "Décoration & relooking", desc: "Conseil couleur personnalisé, échantillons fournis, suivi Pantone. Jeux de matières et effets décoratifs pour un résultat unique." },
  { icon: Shield, title: "Traitement avant peinture", desc: "Démoussage, anti-humidité, traitement anti-moisissures, reprises fissures. Garantie d'adhérence pour une peinture qui dure 10 ans." },
  { icon: Paintbrush, title: "Logements locatifs", desc: "Remise en état entre deux locataires, réparations état des lieux. Tarifs avantageux, délais rapides, facture et garantie incluses." },
]

const COULEURS = [
  { name: "Vert Sauge", hex: "#8fae9a", desc: "Tendance 2025" },
  { name: "Terracotta", hex: "#c87c5c", desc: "Chaleur & caractère" },
  { name: "Bleu Orage", hex: "#3d5a80", desc: "Profondeur & élégance" },
  { name: "Crème Douce", hex: "#f5ede3", desc: "Intemporel & lumineux" },
]

export default function CouleursCOPage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fefefe] text-[#1a1a2e] overflow-x-hidden" style={{ fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/97 backdrop-blur-xl py-3 shadow-sm border-b border-[#4d7c5f]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Paintbrush className="w-5 h-5 text-[#4d7c5f]" />
            <span className="font-bold text-[#1a1a2e] text-base tracking-tight">Couleurs <span className="text-[#4d7c5f]">&amp; Co</span></span>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a2e]/35">
            {["Services", "Réalisations", "Couleurs", "Zone", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-[#4d7c5f] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0320456789" className="hidden md:flex items-center gap-2 text-[#4d7c5f] font-bold text-sm">
              <Phone className="w-4 h-4" /> 03 20 45 67 89
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#4d7c5f] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3d6b50] transition-colors rounded-sm">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5 text-[#1a1a2e]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Réalisations", "Contact"].map(l => <Link key={l} href="#" className="text-3xl font-bold text-[#1a1a2e] hover:text-[#4d7c5f] transition-colors">{l}</Link>)}
                  <a href="tel:0320456789" className="flex items-center gap-3 text-[#4d7c5f] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 03 20 45 67 89</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=85&w=2400" alt="Peintre professionnel intérieur" fill className="object-cover" priority style={{ filter: "brightness(0.55)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/55 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#4d7c5f]/40 bg-[#4d7c5f]/10 mb-8">
              <Paintbrush className="w-3.5 h-3.5 text-[#7db88f]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#7db88f]">Peintre en bâtiment qualifié · Nord & Pas-de-Calais</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 text-white">
            La couleur<br />qui change <span className="text-[#7db88f]">tout.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Peinture intérieure et extérieure, revêtements muraux, décorations. Artisan qualifié, conseils couleur personnalisés, préparation impeccable des supports. Devis gratuit sous 24h.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[#4d7c5f] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#3d6b50] transition-colors rounded-sm">
              Devis gratuit sous 24h
            </button>
            <a href="tel:0320456789" className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7db88f]/50 hover:text-[#7db88f] transition-all">
              <Phone className="w-4 h-4" /> 03 20 45 67 89
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#4d7c5f]/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#e8e8e4]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "14 ans", l: "D'expérience" },
            { v: "600+", l: "Chantiers réalisés" },
            { v: "4.9★", l: "Avis Google" },
            { v: "5 ans", l: "Garantie travaux" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-[#4d7c5f] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a2e]/40">{s.l}</div>
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
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4d7c5f] mb-4">Nos prestations</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a2e]">Ce qu'on <span className="text-[#4d7c5f]">maîtrise.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 border border-[#e8e8e4] hover:border-[#4d7c5f]/30 hover:shadow-lg transition-all duration-500">
                  <div className="w-11 h-11 bg-[#4d7c5f]/8 flex items-center justify-center mb-6 group-hover:bg-[#4d7c5f] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#4d7c5f] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] mb-3 group-hover:text-[#4d7c5f] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#1a1a2e]/45 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PALETTE TENDANCES ── */}
      <section className="py-20 bg-[#f5f5f0]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4d7c5f] mb-4">Palette 2025-2026</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">Couleurs <span className="text-[#4d7c5f]">du moment.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COULEURS.map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group cursor-default">
                  <div className="aspect-square rounded-lg mb-3 transition-transform duration-500 group-hover:scale-105" style={{ background: c.hex }} />
                  <div className="font-bold text-[#1a1a2e] text-sm mb-0.5">{c.name}</div>
                  <div className="text-[10px] text-[#1a1a2e]/40">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-8 text-sm text-[#1a1a2e]/40 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Nous proposons un service de conseil couleur gratuit. Apportez vos photos, votre mobilier, vos envies — on trouve ensemble la teinte parfaite.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4d7c5f] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1a1a2e]">Ils adorent <span className="text-[#4d7c5f]">le résultat.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Notre salon relooké avec un vert sauge magnifique. Conseils couleur top, finitions parfaites, pas une trace de peinture ailleurs. Je suis bluffée.", n: "Amélie B.", l: "Lille (59)" },
              { q: "Ravalement de façade fait proprement, avec un enduit imperméabilisant. Maison comme neuve, 20 ans de moins. Rapport qualité-prix excellent.", n: "Paul & Martine G.", l: "Roubaix (59)" },
              { q: "Appartement entier refait avant mise en location. Couleurs neutres parfaites pour la mise en valeur. Livré en 4 jours. Très pro et réactif.", n: "Karim D.", l: "Tourcoing (59)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#e8e8e4] hover:border-[#4d7c5f]/25 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#4d7c5f] text-[#4d7c5f]" />)}
                  </div>
                  <p className="text-[#1a1a2e]/45 text-sm leading-relaxed italic flex-1" style={{ fontFamily: "'Nunito', sans-serif" }}>{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8e8e4]">
                    <div className="font-bold text-[#1a1a2e] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#4d7c5f] mt-1"><MapPin className="w-3 h-3 inline mr-1" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-[#4d7c5f] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-6">Votre projet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Une pièce à<br />transformer ?</h2>
            <p className="text-white/60 mb-10 text-sm leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>Devis gratuit sous 24h · Conseil couleur inclus · Travaux garantis 5 ans</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#4d7c5f] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f0f7f3] transition-colors">
                Demander un devis
              </button>
              <a href="tel:0320456789" className="flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" /> 03 20 45 67 89
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a2e] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Paintbrush className="w-5 h-5 text-[#4d7c5f]" /><span className="font-bold text-white text-sm">Couleurs & Co</span></div>
            <p className="text-white/25 text-sm leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>Peintre qualifié · Nord & Pas-de-Calais. Peinture intérieure/extérieure, revêtements, déco depuis 2010.</p>
          </div>
          {[
            { t: "Services", ls: ["Peinture intérieure", "Revêtements muraux", "Peinture extérieure", "Conseil couleur", "Logements locatifs"] },
            { t: "Infos", ls: ["Qui sommes-nous", "Nos réalisations", "Zone d'intervention", "Avis clients", "Blog peinture"] },
            { t: "Contact", ls: ["03 20 45 67 89", "contact@couleurs-co.fr", "Lille Métropole", "Lundi-Vendredi 8h-18h", "Devis gratuit 24h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#4d7c5f] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 Couleurs & Co · SIRET 678 901 234 00056 · Qualibat 6312 · Artisan peintre</span>
          <span className="text-[#4d7c5f]/40">Peintre qualifié · Nord-Pas-de-Calais</span>
        </div>
      </footer>
    </div>
  )
}
