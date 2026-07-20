"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Camera, Eye, Award, ChevronRight, MapPin, Mail, Tag, Star, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("obs-fonts")) return
    const s = document.createElement("style")
    s.id = "obs-fonts"
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Grotesk:wght@400;500&display=swap');`
    document.head.appendChild(s)
  }, [])
}

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  )
}

const CATEGORIES = ["Tous", "Portrait", "Mode", "Reportage", "Architecture", "Nature"]

const WORKS = [
  { title: "La Lumière de Minuit", category: "Portrait", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", year: "2025" },
  { title: "Couture Invisible", category: "Mode", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", year: "2025" },
  { title: "Mémoire des Rues", category: "Reportage", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", year: "2024" },
  { title: "Béton & Lumière", category: "Architecture", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", year: "2024" },
  { title: "Femme en Avant", category: "Mode", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", year: "2025" },
  { title: "Le Temps Suspendu", category: "Portrait", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", year: "2023" },
]

const SERVICES = [
  { title: "Portraits & Éditorial", desc: "Portraits intimes et éditoriaux pour magazines, agences et particuliers. Studio ou extérieur.", from: "600€" },
  { title: "Campagnes Mode", desc: "Direction artistique et photographie pour collections et lookbooks. Équipe complète sur demande.", from: "2 400€" },
  { title: "Reportage Événementiel", desc: "Mariage, lancement produit, conférence. Documentation professionnelle haute définition.", from: "900€" },
  { title: "Architecture & Intérieur", desc: "Valorisation de projets architecturaux et d'espaces de vie. Post-production cinématographique.", from: "1 200€" },
]

const AWARDS = [
  { name: "World Photography Awards", year: "2025", category: "Portrait" },
  { name: "IPA — International Photography Awards", year: "2024", category: "Mode" },
  { name: "Prix Roger-Viollet", year: "2023", category: "Reportage" },
]

const CLIENTS = ["Vogue France", "Le Monde", "LVMH", "Chanel", "Elle", "Air France"]

type ActivePage = "home" | "portfolio" | "services" | "propos" | "legal"


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ObscuraPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()
  const [page, setPage] = useState<ActivePage>("home")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Tous")

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
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div className="min-h-dvh bg-[#0A0806] text-white selection:bg-[#C9A86C]/20 selection:text-[#C9A86C] overflow-x-clip" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0A0806]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
          <div onClick={() => goTo("home")} className="cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <span className="text-[#C9A86C] tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>{fd?.businessName ?? "Obscura"}</span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {[
              { name: "Portfolio", key: "portfolio" },
              { name: "Services", key: "services" },
              { name: "À propos", key: "propos" }
            ].map(item => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${page === item.key ? "text-[#C9A86C] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <button onClick={() => goTo("services")} className="hidden md:inline-flex border border-[#C9A86C]/30 text-[#C9A86C] text-xs px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer tracking-wide uppercase font-medium">
            Réserver
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden text-white cursor-pointer"><Menu className="w-5 h-5" /></SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0806] border-[#C9A86C]/10 text-white p-8">
               <div className="flex items-center justify-between mb-12">
                  {fd?.logoBase64 ? (
                    <img
                      src={fd.logoBase64}
                      alt={fd?.businessName ?? 'logo'}
                      style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fd?.businessName ?? "Obscura"}</span>
                  )}
               </div>
               <div className="flex flex-col gap-6 font-medium">
                  {[
                    { name: "Accueil", key: "home" },
                    { name: "Portfolio", key: "portfolio" },
                    { name: "Services", key: "services" },
                    { name: "À propos", key: "propos" },
                    { name: "Mentions Légales", key: "legal" }
                  ].map(item => (
                    <a 
                      key={item.key} 
                      href={`#${item.key}`} 
                      onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                      className={`text-2xl hover:text-[#C9A86C] transition-colors ${page === item.key ? "text-[#C9A86C] font-bold" : "text-white/60"}`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {item.name}
                    </a>
                  ))}
               </div>
            </SheetContent>
         </Sheet>
        </div>
      </nav>

      <main>
        {page === "home" && (
          <>
            {/* Hero */}
            <section id="hero" ref={heroRef} className="relative h-dvh overflow-hidden">
              <motion.div className="absolute inset-0" style={{ y: heroY }}>
                <Image src={photo(0, "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=85")} alt="Obscura Photography" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806]/70 via-[#0A0806]/20 to-[#0A0806]/90" />
              </motion.div>
              <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ opacity: heroOpacity }}>
                <Reveal>
                  <div className="flex items-center gap-2 text-[#C9A86C] text-xs tracking-widest uppercase mb-8">
                    <Camera className="w-4 h-4" /> Photographe · Paris
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-white text-6xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{c?.heroHeadline ?? <>{fd?.businessName ?? "Obscura"}</>}</h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-white/50 text-lg max-w-md leading-relaxed mb-12 font-sans font-light">{c?.heroSubline ?? fd?.tagline ?? <>
                    L'art de capturer l'imperceptible. Portrait, mode et reportage au service de l'émotion pure.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <button onClick={() => goTo("portfolio")} className="border border-[#C9A86C]/40 text-[#C9A86C] text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer rounded-xl">
                    Voir le portfolio
                  </button>
                </Reveal>
              </motion.div>
            </section>

            {/* Portfolio Preview */}
            <section className="py-24 px-6 bg-[#0A0806]">
              <div className="max-w-6xl mx-auto">
                <Reveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div>
                      <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Portfolio</p>
                      <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Œuvres sélectionnées</h2>
                    </div>
                    <button onClick={() => goTo("portfolio")} className="text-[#C9A86C] text-sm font-bold flex items-center gap-2 hover:underline font-mono tracking-widest uppercase mt-6 md:mt-0">
                      Explorer la Galerie <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Reveal>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {WORKS.slice(0, 3).map((w, i) => (
                    <Reveal key={w.title} delay={i * 0.1}>
                      <div onClick={() => goTo("portfolio")} className="relative overflow-hidden rounded-xl group cursor-pointer aspect-[3/4]">
                        <Image src={w.src} alt={w.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[#C9A86C] text-xs tracking-widest uppercase font-mono">{w.category}</span>
                          <p className="text-white text-lg mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{w.title}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Clients Bar */}
            <section className="py-16 px-6 bg-[#0E0B08] border-y border-white/5">
              <div className="max-w-6xl mx-auto">
                <Reveal className="text-center mb-8"><p className="text-white/20 text-xs tracking-widest uppercase font-mono">Partenaires & Diffusions</p></Reveal>
                <div className="flex flex-wrap justify-center gap-12">
                  {CLIENTS.map((c, i) => (
                    <Reveal key={c} delay={i * 0.06}><span className="text-white/30 text-sm tracking-widest hover:text-[#C9A86C] transition-colors cursor-pointer uppercase font-mono">{c}</span></Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "portfolio" && <PortfolioPage activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
        {page === "services" && <ServicesPage goTo={goTo} />}
        {page === "propos" && <ProposPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-[#060402] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20 font-mono">
          <span className="text-[#C9A86C]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>Obscura · Photographe Paris</span>
          <div className="flex gap-6">
            <a href="/templates/impact-16" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C9A86C] transition-colors">Mentions légales</a>
            <a href="/templates/impact-16" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C9A86C] transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (OBSCURA GOLD STYLE)
   ========================================================================= */

function PortfolioPage({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) {
  const filteredWorks = activeCategory === "Tous" ? WORKS : WORKS.filter(w => w.category === activeCategory)

  return (
    <section id="realisations" className="py-24 px-6 bg-[#0A0806] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Galerie</span>
          <h1 className="text-5xl md:text-7xl font-light leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Portfolio</h1>
          <p className="max-w-xl mx-auto text-white/50 text-sm font-sans font-light mb-10">
            Parcourez nos séries photographiques argentiques et numériques. Chaque cliché témoigne d'une recherche sur l'ombre, la géométrie des espaces et la sincérité du sujet.
          </p>

          <div className="flex gap-2 flex-wrap justify-center mt-10">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all cursor-pointer rounded-lg border font-mono ${activeCategory === cat ? "bg-[#C9A86C] text-black border-[#C9A86C] shadow-md shadow-[#C9A86C]/10" : "border-white/10 text-white/40 hover:border-[#C9A86C]/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredWorks.map((w, i) => (
              <motion.div 
                key={w.title} 
                layout 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.4, delay: i * 0.05 }} 
                className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid border border-white/5 bg-[#0e0b09]"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image src={w.src} alt={w.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 filter grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#C9A86C] text-xs tracking-widest uppercase font-mono">{w.category} · {w.year}</span>
                    <p className="text-white text-xl mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{w.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function ServicesPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  return (
    <section className="py-24 px-6 bg-[#0E0B08] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Prestations</span>
          <h1 className="text-5xl md:text-7xl font-light leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Services & Tarifs</h1>
          <p className="max-w-xl mx-auto text-white/50 text-sm font-sans font-light">
            Une approche sur mesure pour chaque projet photographique, de la direction artistique préliminaire au tirage d'exposition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="bg-[#131008] border border-white/5 rounded-3xl p-8 hover:border-[#C9A86C]/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-6 border-b border-white/5 pb-4">
                  <h3 className="text-white text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                  <span className="text-[#C9A86C] text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dès {s.from}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-8 font-sans">
                  {s.desc} Comprend la sélection des clichés sur planche contact numérique, le travail d'étalonnage colorimétrique complet et la retouche fine des fichiers haute définition.
                </p>
              </div>
              <button onClick={() => goTo("propos")} className="w-full py-4 border border-[#C9A86C]/30 hover:border-[#C9A86C] text-[#C9A86C] hover:text-black hover:bg-[#C9A86C] rounded-xl text-xs tracking-widest uppercase transition-all font-mono">
                Demander un Devis
              </button>
            </div>
          ))}
        </div>

        <div className="border border-[#C9A86C]/20 bg-[#C9A86C]/5 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Matériel & Tirages d'Art</h3>
          <p className="text-white/60 text-sm leading-relaxed font-sans mb-0">
             Chaque prise de vue est réalisée avec des boîtiers Leica M11 numériques et des chambres moyen format argentiques Hasselblad. Nous collaborons avec des laboratoires parisiens de confiance pour réaliser des tirages d'exposition haut de gamme sur papiers fine art certifiés Hahnemühle.
          </p>
        </div>
      </div>
    </section>
  )
}

function ProposPage() {
  return (
    <section className="py-24 px-6 bg-[#0A0806] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5">
            <Image src={photo(1, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80")} alt="Elena Korr Obscura" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div className="lg:col-span-7">
            <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Elena Korr</span>
            <h2 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Capturer le <span className="italic">temps suspendu.</span></h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6 font-sans font-light">
              Diplômée de l'École Nationale Supérieure des Arts Décoratifs de Paris, je consacre ma pratique photographique à l'étude des ambiances lumineuses contrastées et à la géométrie rigoureuse des lignes architecturales.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-10 font-sans font-light">
               Mon travail navigue entre la spontanéité du reportage de rue et la rigueur millimétrée du portrait de mode en studio. J'ai eu l'opportunité de collaborer avec des maisons de haute couture internationales et des rédactions de presse indépendantes qui partagent cette même obsession de l'excellence visuelle.
            </p>
            
            <div className="flex gap-4">
              <a href={`mailto:${fd?.email ?? "contact@obscura.fr"}`} className="bg-[#C9A86C] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors flex items-center gap-2 font-mono"><Mail className="w-4 h-4" />{fd?.email ?? "contact@obscura.fr"}</a>
              <a href="#contact" className="border border-white/10 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2 font-mono"><Instagram className="w-4 h-4" /> @obscuraphoto</a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
          <div>
            <h3 className="text-3xl font-light mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prix & Reconnaissance</h3>
            <div className="space-y-4">
              {AWARDS.map((a, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 font-mono text-xs">
                  <div>
                    <p className="text-white font-medium">{a.name}</p>
                    <p className="text-white/30 text-[10px]">{a.category}</p>
                  </div>
                  <span className="text-white/30">{a.year}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Publications & Clients</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-8 font-sans font-light">
               Mon travail est régulièrement exposé dans des galeries parisiennes et publié dans des magazines de mode internationaux. Nous assurons la production de A à Z (casting, stylisme, repérages).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-[#C9A86C]">
              {CLIENTS.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LegalPage() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#0A0806] border-t border-white/5 font-mono text-xs">
      <div className="max-w-3xl mx-auto space-y-16">
        <div>
          <span className="text-[#C9A86C] text-[10px] uppercase tracking-widest mb-4 block">Compliance</span>
          <h1 className="text-4xl md:text-6xl font-light uppercase text-white mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mentions Légales</h1>
        </div>

        <div className="border border-[#C9A86C]/20 bg-[#0E0B08] p-10 space-y-6">
          <div className="border-b border-white/10 pb-4">
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">EDITEUR</div>
             <p className="text-white font-medium uppercase leading-relaxed">
                Aevia WS — Valentin Milliand<br />
                Entrepreneur Individuel<br />
                SIREN : 852 546 225<br />
                RCS : Bourg-en-Bresse<br />
                Email : valentinmilliand@aevia.services<br />
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
                Toutes les photographies, images, logos, structures de code et fichiers multimédias présents sur ce site sont la propriété exclusive d'Elena Korr Studio ou de ses représentants autorisés. Toute reproduction sans accord écrit préalable fera l'objet de poursuites pénales.
             </p>
          </div>
        </div>
      </div>
    </section>
  )
}
