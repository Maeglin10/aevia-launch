// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChefHat, Star, Phone, MapPin, Clock, CheckCircle, Utensils, Wine, Users, Truck, Gift, Camera, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE D'EXCEPTION — Traiteur premium & buffets événementiels (Lyon)
   Palette : blanc chaud #fefcf8 / champagne #d4a853 / bordeaux #7c2d3e / anthracite #1f1d1a
   Fonts : Playfair Display (titres gastronomiques) + Source Sans 3
   Style : gastronomique, festif, chaleur, prestige accessible
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

const PRESTATIONS = [
  { icon: Users, title: "Cocktails & réceptions", desc: "Cocktail dînatoire, standing, mariage, gala. Buffets chauds et froids, bouchées minute, animations culinaires. De 20 à 800 personnes." },
  { icon: ChefHat, title: "Repas assis & gastronomique", desc: "Menu 3 ou 5 services, carte personnalisée, régimes spéciaux. Chef à domicile ou en salle. Vaisselle premium, personnel de service inclus." },
  { icon: Gift, title: "Plateaux repas entreprise", desc: "Plateaux livrés sous 24h. Formule midi, buffet réunion, petit-déjeuner d'équipe. Conditionnements individuels ou collectifs certifiés HACCP." },
  { icon: Truck, title: "Livraison & installation", desc: "Livraison sur Lyon Métropole, montage des buffets, décoration de table. Équipe complète sur place selon formule. Reprise du matériel incluse." },
  { icon: Wine, title: "Accord mets & vins", desc: "Sélection vins de la Vallée du Rhône, champagnes, cocktails sans alcool maison. Bar à eaux premium, infusions fraîches. Sommelier sur demande." },
  { icon: Utensils, title: "Cuisine du monde & thème", desc: "Cuisine lyonnaise, méditerranéenne, asiatique, sud-américaine. Plancha, wok, live cooking, atelier dégustation. Décor de table thématique inclus." },
]

export default function TableExceptionPage() {
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
    <div className="bg-[#fefcf8] text-[#1f1d1a] overflow-x-hidden" style={{ fontFamily: "'Source Sans 3', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#fefcf8]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#d4a853]/12" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            <div className="font-bold tracking-wide text-[#1f1d1a] text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Table d'Exception</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#d4a853]/60">Traiteur · Lyon & Rhône-Alpes</div>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1f1d1a]/28">
            {["Formules", "Réalisations", "Devis", "Menu", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#d4a853] transition-colors">{l}</Link>
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
            <a href="tel:0478345678" className="hidden md:flex items-center gap-2 text-[#d4a853] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 78 34 56 78
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#d4a853] text-white text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-[#ba9040] transition-colors">
              Devis gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#fefcf8] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Formules", "Réalisations", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#1f1d1a] hover:text-[#d4a853] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{l}</Link>)}
                  <a href="tel:0478345678" className="flex items-center gap-3 text-[#d4a853] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 04 78 34 56 78</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[58px] z-[98] flex flex-col gap-4 px-6 py-6 lg:hidden" style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {["Formules", "Réalisations", "Devis", "Menu", "Contact"].map((l) => (
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
          <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=88&w=2400" alt="Table gastronomique traiteur" fill className="object-cover object-center" priority style={{ filter: "brightness(0.38)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140f0a] via-[#140f0a]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#140f0a]/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-30">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[1px] bg-[#d4a853]/60" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#d4a853]/65">Traiteur haut de gamme · Lyon & Rhône-Alpes</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[90px] font-bold leading-[0.88] tracking-tight mb-4 text-[#fefcf8]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            L'art de recevoir
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[90px] font-bold italic leading-[0.88] tracking-tight mb-10 text-[#d4a853]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            à la lyonnaise.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-md text-sm text-[#fefcf8]/28 leading-relaxed mb-10">
            Traiteur événementiel à Lyon. Mariages, séminaires, cocktails, repas gastronomiques. Chef et équipe complète. Devis personnalisé sous 24h.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4 mb-8">
            <button className="px-9 py-4 bg-[#d4a853] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#ba9040] transition-colors">
              Devis personnalisé
            </button>
            <a href="tel:0478345678" className="flex items-center gap-3 px-9 py-4 border border-[#fefcf8]/12 text-[#fefcf8]/38 font-bold text-[10px] uppercase tracking-widest hover:border-[#d4a853]/40 hover:text-[#d4a853] transition-all">
              <Phone className="w-4 h-4" /> 04 78 34 56 78
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-5">
            {["Devis 24h", "Chef & service inclus", "Certifié HACCP"].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#d4a853]" />
                <span className="text-[10px] font-bold text-[#fefcf8]/28 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="w-[1px] h-10 bg-gradient-to-b from-[#d4a853]/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="services" className="py-12 bg-[#f7f0e3]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "16 ans", l: "D'expérience" },
            { v: "1 200+", l: "Événements réalisés" },
            { v: "4.9★", l: "Note Google" },
            { v: "800 pers.", l: "Capacité max" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-5 bg-white shadow-sm">
                <div className="text-2xl font-bold text-[#d4a853] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{s.v}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#1f1d1a]/30">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section className="py-28 bg-[#fefcf8]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a853] mb-4">Nos formules</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f1d1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pour chaque<br /><span className="italic text-[#d4a853]">occasion.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESTATIONS.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white border border-[#f0e8d5] hover:border-[#d4a853]/30 hover:shadow-xl hover:shadow-[#d4a853]/5 transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#d4a853]/8 flex items-center justify-center mb-5 group-hover:bg-[#d4a853] transition-colors duration-500">
                    <p.icon className="w-5 h-5 text-[#d4a853] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1f1d1a] mb-3 group-hover:text-[#d4a853] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h3>
                  <p className="text-sm text-[#1f1d1a]/38 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-24 bg-[#1f1d1a] text-[#fefcf8]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a853]/55 mb-4">— Ce qu'ils disent</div>
            <h2 className="text-4xl font-bold text-[#fefcf8]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Des événements <span className="italic text-[#d4a853]">mémorables.</span>
            </h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Cocktail mariage pour 220 personnes, tout était parfait. La présentation des buffets épatante, les bouchées délicieuses, le service discret et rapide. Merci Table d'Exception !", n: "Anaïs & Pierre R.", l: "Mariage à Lyon · Mai 2025" },
              { q: "Séminaire corporate avec repas assis 80 couverts. Menu sur mesure, chef présent, accords vins impeccables. Nos partenaires ont demandé le contact du traiteur dès le dessert.", n: "Directrice Générale · Lyon", l: "Groupe Solia · 60M€ CA" },
              { q: "Plateaux repas récurrents pour nos 40 collaborateurs. Qualité constante, livraison à l'heure, variété impressionnante. C'est devenu un rituel d'équipe incontournable.", n: "Thomas V.", l: "RH · Startup Lyonnaise" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#fefcf8]/6 hover:border-[#d4a853]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#d4a853] text-[#d4a853]" />)}
                  </div>
                  <p className="text-sm text-[#fefcf8]/30 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#fefcf8]/6">
                    <div className="font-bold text-[#fefcf8] text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{t.n}</div>
                    <div className="text-[10px] text-[#d4a853] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[#7c2d3e] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-5">Votre prochain événement</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ensemble, créons<br /><span className="italic">l'exception.</span>
            </h2>
            <p className="text-white/45 mb-10 text-sm">Devis personnalisé sous 24h · Lyon & Rhône-Alpes · Chef & équipe inclus</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#7c2d3e] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#fefcf8] transition-colors shadow-lg">
                Demander un devis
              </button>
              <a href="tel:0478345678" className="flex items-center gap-3 px-10 py-4 border border-white/25 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" /> 04 78 34 56 78
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#140f0a] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-[#fefcf8] mb-1 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Table d'Exception</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#d4a853]/40 mb-5">Traiteur · Lyon</div>
            <p className="text-[#fefcf8]/15 text-sm leading-relaxed">Traiteur haut de gamme à Lyon. Mariages, corporate, cocktails, plateaux. Chef et équipe sur place.</p>
          </div>
          {[
            { t: "Formules", ls: ["Cocktails & réceptions", "Repas assis", "Plateaux repas", "Livraison & installation", "Cuisine du monde"] },
            { t: "Infos", ls: ["Notre chef", "Portfolio", "Zone d'intervention", "Tarifs", "FAQ"] },
            { t: "Contact", ls: ["04 78 34 56 78", "contact@table-exception.fr", "Lyon & Rhône-Alpes", "Lun-Sam 8h-19h", "Devis sous 24h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4a853]/35 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#fefcf8]/15 text-sm hover:text-[#fefcf8]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#fefcf8]/8">
          <span>© 2026 Table d'Exception · SIRET 789 012 345 00066 · Traiteur agréé · Lyon (69)</span>
          <span className="text-[#d4a853]/15">L'art de recevoir</span>
        </div>
      </footer>
    </div>
  )
}
