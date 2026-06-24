// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scissors, Star, Phone, MapPin, Clock, Calendar, Sparkles, Heart, ArrowRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   ATELIER LÉONIE — Salon de coiffure premium femmes (Paris 16e)
   Palette : crème #faf6f1 / vieux rose #c97b7b / or rosé #d4a5a5 / encre #1a1218
   Fonts : Bodoni Moda (titres élégants) + Lato (corps épuré)
   Style : luxe accessible, féminin, chaud, boudoir élégant
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PRESTATIONS = [
  { title: "Coupe & brushing", price: "Dès 65€", desc: "Coupe sur mesure adaptée à votre morphologie, densité et mode de vie. Brushing professionnel ou coiffage naturel." },
  { title: "Couleur & balayage", price: "Dès 95€", desc: "Couleur pleine, balayage californien, mèches, ombré. Produits Kérastase & L'Oréal Professionnel. Bilan capillaire offert." },
  { title: "Traitement & soin", price: "Dès 45€", desc: "Soins Olaplex, masques kératine, lissage brésilien, soins anti-chute. Résultat visible dès la première séance." },
  { title: "Chignon & coiffure occasion", price: "Dès 85€", desc: "Chignon romantique, tresses, ondulations, coiffure de mariée. Essai inclus, disponible le dimanche sur RDV." },
  { title: "Extensions", price: "Dès 250€", desc: "Extensions kératine, bandes, clips. Volume, longueur, densité. Pose personnalisée, entretien et dépose assurés." },
  { title: "Consultation capillaire", price: "Offerte", desc: "Diagnostic état de la fibre, rythme colorimétrique, soins adaptés. En amont de chaque nouveau service, sur demande." },
]

export default function AtelierLeoniePage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="bg-[#faf6f1] text-[#1a1218] overflow-x-hidden" style={{ fontFamily: "'Lato', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf6f1]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#c97b7b]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            <div className="font-bold text-[#1a1218] tracking-widest text-sm" style={{ fontFamily: "'Bodoni Moda', 'Georgia', serif" }}>ATELIER LÉONIE</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#c97b7b]/60">Salon de coiffure · Paris 16e</div>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1218]/30">
            {["Prestations", "Tarifs", "Équipe", "Galerie", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#c97b7b] transition-colors">{l}</Link>
            ))}
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
            aria-label="Menu"
          >
            <span className="block w-[22px] h-[2px] bg-current rounded-sm transition-transform duration-300" style={{ transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
            <span className="block w-[22px] h-[2px] bg-current rounded-sm transition-opacity duration-300" style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-[22px] h-[2px] bg-current rounded-sm transition-transform duration-300" style={{ transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
          </button>
          <div className="flex items-center gap-3">
            <a href="tel:0145678901" className="hidden md:flex items-center gap-2 text-[#c97b7b] font-bold text-sm">
              <Phone className="w-4 h-4" /> 01 45 67 89 01
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#c97b7b] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#b56868] transition-colors">
              Réserver
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf6f1] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Prestations", "Tarifs", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#1a1218] hover:text-[#c97b7b] transition-colors" style={{ fontFamily: "'Bodoni Moda', serif" }}>{l}</Link>)}
                  <a href="tel:0145678901" className="flex items-center gap-3 text-[#c97b7b] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 01 45 67 89 01</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[58px] z-[98] flex flex-col gap-4 px-6 py-6 lg:hidden" style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {["Prestations", "Tarifs", "Équipe", "Galerie", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileOpen(false)}
              className="text-white/80 text-sm uppercase tracking-wider no-underline hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[115vh] min-h-[900px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=88&w=2400" alt="Salon de coiffure élégant" fill className="object-cover object-center" priority style={{ filter: "brightness(0.4) saturate(0.9)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#110c10] via-[#110c10]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#110c10]/65 to-transparent" />
        </motion.div>

        {/* Decorative rose element */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 1.2 }}
          className="absolute top-32 right-8 md:right-20 z-10 w-20 h-20 rounded-full border border-[#c97b7b]/20 flex items-center justify-center hidden lg:flex">
          <Scissors className="w-8 h-8 text-[#c97b7b]/40" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[#c97b7b]/60" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#d4a5a5]">Salon de coiffure & atelier capillaire · Paris 16e</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-4 text-white" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>
            L'art de la
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold italic leading-[0.88] tracking-tight mb-10 text-[#c97b7b]" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>
            coiffure.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-sm text-sm text-white/32 leading-relaxed mb-10">
            Salon de coiffure premium à Paris 16e. Coupe, couleur, soins, extensions, coiffure de mariée. Stylistes passionnées, produits haut de gamme, résultat sur mesure.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button className="px-9 py-4 bg-[#c97b7b] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#b56868] transition-colors">
              Prendre rendez-vous
            </button>
            <a href="tel:0145678901" className="flex items-center gap-3 px-9 py-4 border border-white/12 text-white/50 font-bold text-[10px] uppercase tracking-widest hover:border-[#c97b7b]/40 hover:text-[#d4a5a5] transition-all">
              <Phone className="w-4 h-4" /> 01 45 67 89 01
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-[1px] h-10 bg-gradient-to-b from-[#c97b7b]/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-[#f3ede6]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "11 ans", l: "D'excellence capillaire" },
            { v: "2 800+", l: "Clientes fidèles" },
            { v: "4.9★", l: "Avis Google" },
            { v: "8", l: "Stylistes certifiées" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-5 bg-white shadow-sm">
                <div className="text-2xl font-bold text-[#c97b7b] mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1218]/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section id="realisations" className="py-28 bg-[#faf6f1]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16 flex flex-col md:flex-row gap-8 justify-between items-end">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c97b7b] mb-4">Nos prestations</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  Pour chaque<br /><span className="italic text-[#c97b7b]">cheveu, un soin.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm text-[#1a1218]/35 leading-relaxed">Prestations personnalisées, bilan capillaire offert, produits Kérastase & Olaplex.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESTATIONS.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white border border-[#f3ede6] hover:border-[#c97b7b]/25 hover:shadow-lg hover:shadow-[#c97b7b]/5 transition-all duration-500 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-[#1a1218] group-hover:text-[#c97b7b] transition-colors" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.title}</h3>
                    <div className="text-sm font-bold text-[#c97b7b] whitespace-nowrap ml-4">{p.price}</div>
                  </div>
                  <p className="text-sm text-[#1a1218]/38 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE RÉALISATIONS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c97b7b] mb-4">Réalisations</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>Le détail qui <span className="italic text-[#c97b7b]">fait tout.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[60vh] min-h-[400px]">
            <div className="col-span-2 row-span-2 relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=85&w=800" alt="Coiffure femme" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=85&w=600" alt="Couleur cheveux" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?auto=format&fit=crop&q=85&w=600" alt="Balayage" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1487412947147-5cebf100d7fb?auto=format&fit=crop&q=85&w=600" alt="Maquillage brushing" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1554519515-242161756769?auto=format&fit=crop&q=85&w=600" alt="Coiffure updo" /></div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="contact" className="py-28 bg-[#faf6f1]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c97b7b] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>Elles adorent <span className="italic text-[#c97b7b]">le résultat.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Léonie a transformé mes cheveux abîmés en quelque chose de sublime. Le balayage est naturel, la couleur exactement ce que je voulais. Enfin une vraie experte.", n: "Sophie M.", l: "Paris 16e" },
              { q: "Coiffure de mariée parfaite le jour J. L'essai en amont m'a permis d'ajuster chaque détail. On s'est senti chouchouté du début à la fin. Merci Atelier Léonie !", n: "Clémence R.", l: "Paris 75" },
              { q: "Lissage brésilien impeccable. Résultat qui dure 4 mois, aucun problème aux repousses. Pour moi c'est devenu un rituel bi-annuel incontournable.", n: "Aïcha D.", l: "Neuilly-sur-Seine" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-[#f3ede6] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c97b7b] text-[#c97b7b]" />)}
                  </div>
                  <p className="text-sm text-[#1a1218]/40 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f3ede6]">
                    <div className="font-bold text-[#1a1218] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#c97b7b] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="services" className="py-24 bg-[#1a1218] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25 mb-6">Votre prochain rendez-vous</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Révélez la beauté<br /><span className="italic text-[#c97b7b]">qui est en vous.</span>
            </h2>
            <p className="text-white/30 mb-10 text-sm">Réservation en ligne 24h/24 · Paris 16e · Consultation capillaire offerte</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#c97b7b] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#b56868] transition-colors">
                Réserver maintenant
              </button>
              <a href="tel:0145678901" className="flex items-center gap-3 px-10 py-4 border border-white/12 text-white/40 font-bold text-[10px] uppercase tracking-widest hover:border-[#c97b7b]/40 hover:text-[#d4a5a5] transition-all">
                <Phone className="w-4 h-4" /> 01 45 67 89 01
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#110c10] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-white mb-1 text-sm" style={{ fontFamily: "'Bodoni Moda', serif" }}>Atelier Léonie</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#c97b7b]/40 mb-5">Salon · Paris 16e</div>
            <p className="text-white/20 text-sm leading-relaxed">Salon de coiffure premium. Coupe, couleur, soins, extensions, coiffure de mariée. Produits Kérastase & Olaplex.</p>
          </div>
          {[
            { t: "Prestations", ls: ["Coupe & brushing", "Couleur & balayage", "Soins & traitements", "Extensions", "Coiffure mariée"] },
            { t: "Salon", ls: ["L'équipe", "Nos produits", "Tarifs", "Galerie", "FAQ"] },
            { t: "Nous trouver", ls: ["38 av. Victor Hugo", "75016 Paris", "Mar-Sam 9h-19h", "01 45 67 89 01", "contact@atelier-leonie.fr"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c97b7b]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/20 text-sm hover:text-white/60 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-white/8">
          <span>© 2026 Atelier Léonie · SIRET 234 567 890 00011 · Paris (75016)</span>
          <span className="text-[#c97b7b]/20">L'art de la coiffure</span>
        </div>
      </footer>
    </div>
  )
}
