// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scissors, Star, Phone, MapPin, Clock, ChevronRight, Shield, Calendar, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   GENTLEMAN'S CUT — Barbier premium (Bordeaux)
   Palette : noir encre #0a0908 / or vintage #c9a84c / ivoire #f5f0e8 / charcoal #1e1c1a
   Fonts : Playfair Display (titres) + DM Mono (labels)
   Style : éditorial masculin, premium, brasserie chic, contrasté
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SERVICES = [
  { title: "Coupe classique", price: "28€", desc: "Coupe ciseau + tondeuse, finitions rasoir droite. Inclut consultation, shampoing, séchage et coiffage." },
  { title: "Rasage traditionnel", price: "35€", desc: "Rasoir droit à l'ancienne. Serviette chaude, mousse artisanale, baume après-rasage maison. 45 minutes de pure détente." },
  { title: "Combo barbe + coupe", price: "55€", desc: "La formule complète. Coupe sur mesure + taille et soin de barbe. Le must pour repartir à 100%." },
  { title: "Taille de barbe", price: "22€", desc: "Mise en forme, taille précise, soin hydratant. Contours nets au rasoir. Résultat impeccable garanti." },
  { title: "Color & gris", price: "45€", desc: "Coloration naturelle ou couvrance des cheveux blancs. Teinte personnalisée, respect de la matière." },
  { title: "Soin cuir chevelu", price: "30€", desc: "Gommage + masque nourrissant. Idéal cuirs chevelu secs, desquamation ou chute de cheveux. En add-on ou seul." },
]

const TEMOIGNAGES = [
  { q: "Meilleur barbier de Bordeaux, sans discussion. Rasage au rasoir droit parfait, ambiance vintage au top, et le gars sait vraiment écouter ce qu'on veut.", n: "Julien F.", l: "Bordeaux Centre" },
  { q: "Je viens depuis 3 ans. On parle de moi d'un coup de ciseau à l'autre, et chaque fois c'est nickel. La fidélité se mérite — ici elle est bien méritée.", n: "Pierre-Louis B.", l: "Mérignac" },
  { q: "Barbier de confiance, propre, précis, discret. Le genre d'endroit où on revient pas pour l'ambiance (bien qu'elle soit top) mais pour le résultat.", n: "Karim T.", l: "Pessac" },
]

export default function GentlemansCutPage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0908] text-[#f5f0e8] overflow-x-hidden" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0908]/97 backdrop-blur-xl py-3 border-b border-[#c9a84c]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="w-4 h-4 text-[#c9a84c]" />
            <span className="font-bold text-[#f5f0e8] tracking-wide text-sm">Gentleman's <span className="text-[#c9a84c]">Cut</span></span>
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5f0e8]/25" style={{ fontFamily: "'DM Mono', monospace" }}>
            {["Services", "Tarifs", "Réservation", "À propos", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#c9a84c] transition-colors">{l}</Link>
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
            <a href="tel:0556789012" className="hidden md:flex items-center gap-2 text-[#c9a84c] font-bold text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Phone className="w-4 h-4" /> 05 56 78 90 12
            </a>
            <button className="hidden md:block px-5 py-2.5 border border-[#c9a84c] text-[#c9a84c] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#c9a84c] hover:text-[#0a0908] transition-all" style={{ fontFamily: "'DM Mono', monospace" }}>
              Réserver
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#f5f0e8]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0f0e0c] border-[#c9a84c]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Tarifs", "Réservation"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#f5f0e8] hover:text-[#c9a84c] transition-colors">{l}</Link>)}
                  <a href="tel:0556789012" className="flex items-center gap-3 text-[#c9a84c] font-bold text-lg mt-4"><Phone className="w-5 h-5" /> 05 56 78 90 12</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[58px] z-[98] flex flex-col gap-4 px-6 py-6 lg:hidden" style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {["Services", "Tarifs", "Réservation", "À propos", "Contact"].map((l) => (
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
          <Image src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=88&w=2400" alt="Barbier rasage traditionnel" fill className="object-cover object-top" priority style={{ filter: "brightness(0.35) contrast(1.05)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/70 via-[#0a0908]/20 to-transparent" />
        </motion.div>

        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#c9a84c]/20 to-transparent z-10" />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-[#c9a84c]/60" />
              <span className="text-[9px] font-bold uppercase tracking-[0.55em] text-[#c9a84c]/70" style={{ fontFamily: "'DM Mono', monospace" }}>Barbier Traditionnel · Bordeaux</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[96px] font-bold leading-[0.85] tracking-tight mb-3 text-[#f5f0e8]">
            The Art
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[96px] font-bold italic leading-[0.85] tracking-tight mb-10 text-[#c9a84c]">
            of Grooming.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-sm text-sm text-[#f5f0e8]/30 leading-relaxed mb-12" style={{ fontFamily: "'DM Mono', monospace", fontStyle: "normal" }}>
            Coupe au ciseau, rasage droit, taille de barbe. Techniques ancestrales, produits artisanaux, précision chirurgicale.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button className="px-9 py-4 bg-[#c9a84c] text-[#0a0908] font-bold text-[10px] uppercase tracking-[0.3em]  hover:bg-[#b8973d] transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
              Prendre rendez-vous
            </button>
            <a href="tel:0556789012" className="flex items-center gap-3 px-9 py-4 border border-[#f5f0e8]/12 text-[#f5f0e8]/50 font-bold text-[10px] uppercase tracking-widest hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Phone className="w-4 h-4" /> 05 56 78 90 12
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.6 }} className="w-[1px] h-12 bg-gradient-to-b from-[#c9a84c]/40 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <div className="py-12 border-y border-[#c9a84c]/12 bg-[#0f0e0c]">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl text-[#f5f0e8]/25 italic leading-relaxed">
            "Un homme bien coiffé n'a pas besoin de se justifier."
          </p>
          <div className="mt-4 text-[9px] font-bold uppercase tracking-[0.4em] text-[#c9a84c]/40" style={{ fontFamily: "'DM Mono', monospace" }}>— L'esprit Gentleman's Cut</div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#0a0908]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#c9a84c]/60 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— Nos prestations</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0e8]">Chaque service,<br /><span className="text-[#c9a84c] italic">à la perfection.</span></h2>
            </div>
          </Reveal>
          <div className="divide-y divide-[#c9a84c]/8">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="group py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-12 hover:bg-[#1e1c1a]/30 -mx-4 px-4 transition-colors cursor-default">
                  <div className="text-[11px] font-bold text-[#c9a84c]/30 w-8 shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#f5f0e8] group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
                      <div className="text-xl font-bold text-[#c9a84c]">{s.price}</div>
                    </div>
                    <p className="text-sm text-[#f5f0e8]/25 leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#c9a84c]/20 group-hover:text-[#c9a84c]/60 group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉSERVATION RAPIDE ── */}
      <section id="contact" className="py-24 bg-[#1e1c1a]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#c9a84c]/50 mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>Réservation</div>
                <h2 className="text-4xl font-bold text-[#f5f0e8] mb-6">Votre prochain<br /><span className="text-[#c9a84c] italic">rendez-vous.</span></h2>
                <p className="text-sm text-[#f5f0e8]/25 leading-relaxed mb-8" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Réservez en ligne en moins de 2 minutes. Confirmation SMS immédiate. Annulation gratuite jusqu'à 2h avant.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Clock, t: "Mar-Sam · 9h–19h" },
                    { icon: MapPin, t: "12 rue du Pas Saint-Georges, 33000 Bordeaux" },
                    { icon: Calendar, t: "Résa en ligne ou 05 56 78 90 12" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <item.icon className="w-4 h-4 text-[#c9a84c]" />
                      <span className="text-sm text-[#f5f0e8]/40" style={{ fontFamily: "'DM Mono', monospace" }}>{item.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=85&w=900" alt="Intérieur barbier vintage" fill className="object-cover" style={{ filter: "brightness(0.6) sepia(0.15)" }} />
                <div className="absolute inset-0 border border-[#c9a84c]/15" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-[#0a0908]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#c9a84c]/50 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— Ce qu'ils disent</div>
            <h2 className="text-4xl font-bold text-[#f5f0e8]">La parole <span className="italic text-[#c9a84c]">des clients.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#c9a84c]/8">
            {TEMOIGNAGES.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0a0908] p-10 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[#c9a84c] text-[#c9a84c]" />)}
                  </div>
                  <p className="text-sm text-[#f5f0e8]/30 leading-relaxed italic flex-1" style={{ fontFamily: "'DM Mono', monospace" }}>{`"${t.q}"`}</p>
                  <div className="mt-8 pt-6 border-t border-[#c9a84c]/8">
                    <div className="font-bold text-[#f5f0e8] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#c9a84c]/50 mt-1 flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace" }}><MapPin className="w-2.5 h-2.5" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 border-t border-[#c9a84c]/12 bg-[#0f0e0c]">
        <Reveal>
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-16 bg-[#c9a84c]/30" />
              <Scissors className="w-5 h-5 text-[#c9a84c]/40" />
              <div className="h-[1px] w-16 bg-[#c9a84c]/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0e8] mb-5">
              Prêt pour une<br /><span className="italic text-[#c9a84c]">coupe parfaite ?</span>
            </h2>
            <p className="text-[#f5f0e8]/25 mb-10 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              Disponible du mardi au samedi · Bordeaux Centre · Sur rendez-vous
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#c9a84c] text-[#0a0908] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#b8973d] transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
                Réserver maintenant
              </button>
              <a href="tel:0556789012" className="flex items-center gap-3 px-10 py-4 border border-[#f5f0e8]/10 text-[#f5f0e8]/35 font-bold text-[10px] uppercase tracking-widest hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Phone className="w-4 h-4" /> Appeler
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050403] pt-16 pb-8 px-6 border-t border-[#c9a84c]/8">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Scissors className="w-4 h-4 text-[#c9a84c]" /><span className="font-bold text-[#f5f0e8] text-sm">Gentleman's Cut</span></div>
            <p className="text-[#f5f0e8]/15 text-sm leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>Barbier traditionnel à Bordeaux. Coupe, rasage, barbe. Depuis 2011.</p>
          </div>
          {[
            { t: "Services", ls: ["Coupe classique", "Rasage traditionnel", "Combo barbe + coupe", "Taille de barbe", "Coloration & gris"] },
            { t: "Infos", ls: ["Notre histoire", "L'équipe", "FAQ", "Avis clients", "Politique hygiène"] },
            { t: "Adresse", ls: ["12 rue du Pas Saint-Georges", "33000 Bordeaux", "Mar-Sam 9h–19h", "05 56 78 90 12", "contact@gentlemanscut.fr"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c9a84c]/50 mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f5f0e8]/15 text-sm hover:text-[#f5f0e8]/50 transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#c9a84c]/6 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#f5f0e8]/8" style={{ fontFamily: "'DM Mono', monospace" }}>
          <span>© 2026 Gentleman's Cut · SIRET 890 123 456 00078 · Bordeaux</span>
          <span className="text-[#c9a84c]/20">The Art of Grooming</span>
        </div>
      </footer>
    </div>
  )
}
