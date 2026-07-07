"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Phone, MapPin, Calendar, Sparkles, Music, Camera, Flower, Gift, ChevronRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   MAISON ÉLISE — Wedding planner & organisatrice événements (Nice)
   Palette : blanc ivoire #fdfaf7 / blush poudré #e8c5c5 / or rosé #c4a06a / nuit #1a1018
   Fonts : Didact Gothic (élégant, géométrique) + Lora (serif romantique)
   Style : romantique luxe, délicat, élégance intemporelle
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

const FORMULES = [
  { icon: Sparkles, title: "Coordination jour J", desc: "Gestion de votre mariage le jour même. Coordination prestataires, briefing équipes, timing, gestion imprévus. Vous profitez — on gère." },
  { icon: Gift, title: "Formule clé en main", desc: "De la recherche du lieu aux derniers confettis. Sélection prestataires, budget, déco, plan de table, animation. 100% serein." },
  { icon: Flower, title: "Conception florale & déco", desc: "Arche florale, centre de table, bouquets, pétales, compositions végétales. Style contemporain, romantique ou champêtre. Sur mesure." },
  { icon: Camera, title: "Mise en scène & styling", desc: "Direction artistique complète. Moodboard, palette de couleurs, papeterie, séance couple. Un mariage qui vous ressemble visuellement." },
  { icon: Music, title: "Recherche prestataires", desc: "Sélection DJ, orchestre, photographe, vidéaste, traiteur, officiant. 200+ prestataires partenaires vérifiés. Négociation tarifaire incluse." },
  { icon: Calendar, title: "Événements corporate & privés", desc: "Cocktail d'entreprise, anniversaire élaboré, soirée gala. Budget 5 000 à 200 000€. Expérience événementielle globale." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function MaisonElisePage() {
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

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    
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
return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fdfaf7] text-[#1a1018] overflow-x-hidden" style={{ fontFamily: "'Didact Gothic', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#fdfaf7]/97 backdrop-blur-xl py-3 shadow-sm border-b border-[#c4a06a]/12" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="font-bold tracking-[0.2em] text-[#1a1018] text-sm uppercase" style={{ fontFamily: "'Lora', Georgia, serif" }}>Maison Élise</div>
                <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#c4a06a]/60">Wedding Planner · Nice & Riviera</div>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1018]/28">
            {["Formules", "Portfolio", "L'équipe", "Blog", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#c4a06a] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0493567890"}`} className="hidden md:flex items-center gap-2 text-[#c4a06a] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 93 56 78 90
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#c4a06a] text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#a88550] transition-colors">
              Consultation gratuite
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#fdfaf7] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Formules", "Portfolio", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#1a1018] hover:text-[#c4a06a] transition-colors" style={{ fontFamily: "'Lora', serif" }}>{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0493567890"}`} className="flex items-center gap-3 text-[#c4a06a] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 04 93 56 78 90</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
            {/* Mobile menu placeholder */}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[115vh] min-h-[900px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=88&w=2400" alt="Mariage élégant décoration florale" fill className="object-cover object-center" priority style={{ filter: "brightness(0.38) saturate(0.85)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100b0f] via-[#100b0f]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100b0f]/65 to-transparent" />
        </motion.div>

        {/* Elegant vertical text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
          <div className="text-[9px] font-bold uppercase tracking-[0.6em] text-[#c4a06a]/25 writing-vertical" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Nice · Cannes · Monaco · Riviera
          </div>
        </div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-[#c4a06a]/50" />
              <span className="text-[9px] font-bold uppercase tracking-[0.55em] text-[#c4a06a]/60">Wedding Planner & Events · Côte d'Azur</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 65 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="font-bold leading-[0.88] tracking-tight mb-4 text-[#fdfaf7]" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "clamp(52px,7.5vw,96px)" }}>{c?.heroHeadline ?? <>
              Votre plus beau
            </>}</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 65 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="font-bold italic leading-[0.88] tracking-tight mb-10 text-[#c4a06a]" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "clamp(52px,7.5vw,96px)" }}>
              jour en mémoire.
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-sm text-sm text-[#fdfaf7]/28 leading-relaxed mb-12">{c?.heroSubline ?? fd?.tagline ?? <>
            Wedding planner sur la Côte d'Azur. Coordination jour J, organisation clé en main, déco florale, corporate. Chaque événement mérite d'être extraordinaire.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button className="px-9 py-4 bg-[#c4a06a] text-white font-bold text-[10px] uppercase tracking-[0.28em] hover:bg-[#a88550] transition-colors">{c?.ctaText ?? <>
              Consultation gratuite
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0493567890"}`} className="flex items-center gap-3 px-9 py-4 border border-[#fdfaf7]/12 text-[#fdfaf7]/38 font-bold text-[10px] uppercase tracking-widest hover:border-[#c4a06a]/40 hover:text-[#c4a06a] transition-all">
              <Phone className="w-4 h-4" /> 04 93 56 78 90
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.6 }} className="w-[1px] h-12 bg-gradient-to-b from-[#c4a06a]/40 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#f5ede4]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "9 ans", l: "D'événements créés" },
            { v: "320+", l: "Mariages réalisés" },
            { v: "4.9★", l: "Note Google" },
            { v: "7 pays", l: "Mariages à l'étranger" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-5 bg-white">
                <div className="text-2xl font-bold text-[#c4a06a] mb-1" style={{ fontFamily: "'Lora', serif" }}>{s.v}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#1a1018]/30">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FORMULES ── */}
      <section className="py-28 bg-[#fdfaf7]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4a06a] mb-4">Nos formules</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1018]" style={{ fontFamily: "'Lora', serif" }}>
                Un service pour<br /><span className="italic text-[#c4a06a]">chaque vision.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FORMULES.map((f, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white border border-[#f0e6dc] hover:border-[#c4a06a]/30 hover:shadow-xl hover:shadow-[#c4a06a]/5 transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#c4a06a]/8 flex items-center justify-center mb-5 group-hover:bg-[#c4a06a] transition-colors duration-500">
                    <f.icon className="w-5 h-5 text-[#c4a06a] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a1018] mb-3 group-hover:text-[#c4a06a] transition-colors" style={{ fontFamily: "'Lora', serif" }}>{f.title}</h3>
                  <p className="text-sm text-[#1a1018]/38 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4a06a] mb-4">Portfolio</div>
            <h2 className="text-4xl font-bold text-[#1a1018]" style={{ fontFamily: "'Lora', serif" }}>Des instants <span className="italic text-[#c4a06a]">inoubliables.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-3 gap-3 h-[65vh] min-h-[420px]">
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=85&w=600" alt="Mariage" /></div>
            <div className="row-span-2 relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=85&w=800" alt="Décoration florale" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=85&w=600" alt="Couple" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=85&w=600" alt="Table de mariage" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=85&w=600" alt="Gâteau" /></div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-[#fdfaf7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4a06a] mb-4">Ils ont dit oui</div>
            <h2 className="text-4xl font-bold text-[#1a1018]" style={{ fontFamily: "'Lora', serif" }}>Leurs <span className="italic text-[#c4a06a]">mots.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Élise a compris notre vision dès la première consultation. Le jour J, tout était parfait — au millimètre — et on n'a eu à penser à rien. Un soulagement absolu.", n: "Claire & Antoine", l: "Mariage à Antibes · Juin 2025" },
              { q: "180 invités, deux cultures différentes, budget serré. Élise a tout orchestré avec classe et a même négocié -15% sur le traiteur. Elle mérite bien plus que 5 étoiles.", n: "Nadia & Rayan", l: "Mariage à Nice · Septembre 2025" },
              { q: "Organisation complète de notre cocktail corporate pour 250 personnes. Livraison en 3 semaines, sans aucun stress de notre côté. Partenaires impeccables, ambiance mémorable.", n: "Sylvie D.", l: "DRH · Agence Azur Events" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-[#f0e6dc] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c4a06a] text-[#c4a06a]" />)}
                  </div>
                  <p className="text-sm text-[#1a1018]/40 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f0e6dc]">
                    <div className="font-bold text-[#1a1018] text-sm" style={{ fontFamily: "'Lora', serif" }}>{t.n}</div>
                    <div className="text-[10px] text-[#c4a06a] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" className="py-28 bg-[#1a1018] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-16 bg-[#c4a06a]/30" />
              <Heart className="w-4 h-4 text-[#c4a06a]/40" />
              <div className="h-[1px] w-16 bg-[#c4a06a]/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#fdfaf7] mb-5" style={{ fontFamily: "'Lora', serif" }}>
              Votre histoire<br /><span className="italic text-[#c4a06a]">commence ici.</span>
            </h2>
            <p className="text-[#fdfaf7]/28 mb-10 text-sm">Consultation gratuite · Nice & Côte d'Azur · Déplacements France entière & étranger</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#c4a06a] text-white font-bold text-[10px] uppercase tracking-[0.28em] hover:bg-[#a88550] transition-colors">
                Consultation gratuite
              </button>
              <a href={`tel:${fd?.phone ?? "0493567890"}`} className="flex items-center gap-3 px-10 py-4 border border-[#fdfaf7]/12 text-[#fdfaf7]/35 font-bold text-[10px] uppercase tracking-widest hover:border-[#c4a06a]/40 hover:text-[#c4a06a] transition-all">
                <Phone className="w-4 h-4" /> 04 93 56 78 90
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#100b0f] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-[#fdfaf7] text-sm tracking-[0.18em] mb-1 uppercase" style={{ fontFamily: "'Lora', serif" }}>Maison Élise</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#c4a06a]/40 mb-5">Wedding Planner · Nice</div>
            <p className="text-[#fdfaf7]/15 text-sm leading-relaxed">Organisation mariages et événements sur la Côte d'Azur. Coordination, clé en main, floral, corporate.</p>
          </div>
          {[
            { t: "Formules", ls: ["Coordination jour J", "Clé en main", "Conception florale", "Mise en scène & styling", "Événements corporate"] },
            { t: "Infos", ls: ["L'équipe", "Notre philosophie", "Portfolio", "Blog mariages", "FAQ"] },
            { t: "Contact", ls: ["04 93 56 78 90", "hello@maison-elise.fr", "Nice & Riviera", "France entière & étranger", "Consultation gratuite"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c4a06a]/35 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#fdfaf7]/15 text-sm hover:text-[#fdfaf7]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#fdfaf7]/8">
          <span>© 2026 Maison Élise · SIRET 678 901 234 00055 · Nice (06)</span>
          <span className="text-[#c4a06a]/18">Wedding Planner · Côte d'Azur</span>
        </div>
      </footer>
    </div>
  )
}
