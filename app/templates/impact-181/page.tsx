// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, ShieldCheck, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, AlertTriangle, Wind, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   TOIT & PIERRE — Couvreur professionnel (Nantes)
   Palette : blanc cassé / ardoise profonde #374151 / rouge tuile #b91c1c
   Fonts : Raleway (titres) + Inter (corps)
   Style : artisanal premium, solide, fiable
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
  { icon: Home, title: "Pose de toiture neuve", desc: "Tuiles, ardoise naturelle, zinc, bac acier. De la charpente à la couverture. Toutes surfaces, maison individuelle ou bâtiment industriel." },
  { icon: Wrench, title: "Réfection de toiture", desc: "Remplacement de tuiles cassées, démoussage, hydrofugation. Toiture entière ou réparation partielle selon diagnostic." },
  { icon: Wind, title: "Charpente & zinguerie", desc: "Rénovation et remplacement de charpente traditionnelle ou industrielle. Gouttières, descentes, noues, faîtage, chatière." },
  { icon: AlertTriangle, title: "Urgence fuite de toit", desc: "Infiltration, tuile manquante après tempête — bâche et mise hors d'eau rapide. Intervention sur devis dans les 24h." },
  { icon: ShieldCheck, title: "Isolation par l'extérieur", desc: "Sarking (isolation sous toiture), primes CEE et MaPrimeRénov' disponibles. Amélioration énergétique garantie." },
  { icon: Home, title: "Velux & fenêtres de toit", desc: "Pose et remplacement de fenêtres de toit Velux et Roto. Intégration soignée, étanchéité garantie 10 ans." },
]

const REALISATIONS = [
  { title: "Réfection ardoise · Maison 1900", tag: "Toiture ardoise naturelle", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" },
  { title: "Toiture neuve · Pavillon années 70", tag: "Tuile mécanique + isolation", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" },
  { title: "Zinc & cuivre · Immeuble centre-ville", tag: "Zinguerie haut de gamme", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ToitPierrePage() {
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
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"])
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
    <div className="bg-[#f9f8f6] text-[#1f2937] overflow-x-hidden" style={{ fontFamily: "'Raleway', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f9f8f6]/97 backdrop-blur-xl py-3 border-b border-slate-200 shadow-sm" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#374151] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1f2937] text-base tracking-wide">Toit <span className="text-[#b91c1c]">&</span> Pierre</span>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1f2937]/40">
            {["Prestations", "Réalisations", "Matériaux", "Zone d'intervention", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#b91c1c] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0240123456"}`} className="hidden md:flex items-center gap-2 text-[#b91c1c] font-bold text-sm">
              <Phone className="w-4 h-4" /> 02 40 12 34 56
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#374151] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1f2937] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#1f2937]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#f9f8f6] border-slate-200 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Prestations", "Réalisations", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#1f2937] hover:text-[#b91c1c] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0240123456"}`} className="flex items-center gap-3 text-[#b91c1c] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 02 40 12 34 56</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
            {/* Mobile menu placeholder */}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=2400" alt="Couvreur sur toiture en ardoise" fill className="object-cover" priority style={{ filter: "brightness(0.55)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937] via-[#1f2937]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2937]/50 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-7">
              <div className="w-10 h-[2px] bg-[#b91c1c]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#fca5a5]">Couvreur qualifié · Pays de la Loire</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-9 text-white">{c?.heroHeadline ?? <>
            Le toit de votre<br />maison, entre<br /><span className="text-[#fca5a5]">de bonnes mains.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Pose, réfection, zinguerie, isolation et réparation d'urgence. Artisan couvreur qualifié Qualibat depuis 20 ans. Devis gratuit, garantie décennale.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[#b91c1c] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#dc2626] transition-colors">{c?.ctaText ?? <>
              Devis gratuit
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0240123456"}`} className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#fca5a5]/50 hover:text-[#fca5a5] transition-all">
              <Phone className="w-4 h-4" /> 02 40 12 34 56
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#b91c1c]/60 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#374151]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-0">
          {[
            { v: "20+", l: "Ans d'expérience" },
            { v: "1 800+", l: "Toitures réalisées" },
            { v: "Qualibat", l: "Certification artisan" },
            { v: "10 ans", l: "Garantie décennale" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-8 border-r border-white/10 last:border-r-0">
                <div className="text-2xl font-bold text-white mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#f9f8f6]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b91c1c] mb-4">Nos savoir-faire</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937]">Nos <span className="text-[#374151]">prestations.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 bg-white border border-slate-100 hover:border-[#374151]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-11 h-11 bg-[#374151]/8 flex items-center justify-center mb-6 group-hover:bg-[#374151] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#374151] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1f2937] mb-3 group-hover:text-[#b91c1c] transition-colors">{s.title}</h3>
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
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b91c1c] mb-4">Portfolio</div>
            <h2 className="text-4xl font-bold text-[#1f2937]">Chantiers <span className="text-[#374151]">récents.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {REALISATIONS.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ParallaxImg src={r.img} alt={r.title} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#374151] text-white text-[9px] font-bold uppercase tracking-widest">{r.tag}</div>
                  </div>
                  <div className="p-6 border-t border-slate-100">
                    <h3 className="font-bold text-[#1f2937] group-hover:text-[#b91c1c] transition-colors">{r.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-[#f9f8f6]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b91c1c] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1f2937]">La confiance, <span className="text-[#374151]">ça se mérite.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Toiture en ardoise de 1925 entièrement réfaite. Travail soigné, propre, chantier nettoyé. Résultat parfait et garantie 10 ans. Artisan sérieux.", n: "Hélène F.", l: "Nantes (44)" },
              { q: "Après la tempête Domingos, Toit & Pierre ont répondu en moins de 24h. Bâche posée, toiture réparée en 3 jours. Très réactifs et professionnels.", n: "Julien R.", l: "Saint-Nazaire (44)" },
              { q: "Installation de 3 Velux et isolation en sarking. Excellent conseil, pas de mauvaise surprise sur le devis. Je recommande sans hésiter.", n: "Claire & Arnaud M.", l: "La Baule (44)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-slate-100 hover:border-[#374151]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#b91c1c] text-[#b91c1c]" />)}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="font-bold text-[#1f2937] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#b91c1c] mt-1"><MapPin className="w-3 h-3 inline mr-1" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="realisations" className="py-32 bg-[#1f2937] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b91c1c] mb-6">Votre projet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Un projet de toiture ?<br /><span className="text-[#fca5a5]">Parlons-en.</span></h2>
            <p className="text-white/40 mb-10 text-sm leading-relaxed">Devis gratuit et sans engagement · Garantie décennale · Artisan Qualibat</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#b91c1c] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#dc2626] transition-colors">
                Demander un devis gratuit
              </button>
              <a href={`tel:${fd?.phone ?? "0240123456"}`} className="flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#fca5a5]/50 hover:text-[#fca5a5] transition-all">
                <Phone className="w-4 h-4" /> 02 40 12 34 56
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#111827] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 bg-[#374151] flex items-center justify-center"><Home className="w-3.5 h-3.5 text-white" /></div>
              <span className="font-bold text-white text-sm">Toit & Pierre</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">Couvreur qualifié Qualibat · Pays de la Loire. Tuiles, ardoise, zinc, isolation toiture depuis 2004.</p>
          </div>
          {[
            { t: "Prestations", ls: ["Toiture neuve", "Réfection toiture", "Ardoise & tuile", "Zinguerie", "Isolation sarking", "Velux & lucarnes"] },
            { t: "Matériaux", ls: ["Ardoise naturelle", "Tuile mécanique", "Zinc & cuivre", "Bac acier", "Membrane EPDM"] },
            { t: "Contact", ls: ["02 40 12 34 56", "devis@toitpierre.fr", "Pays de la Loire", "Lundi-Vendredi 8h-18h", "Devis gratuit sous 48h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b91c1c] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 Toit & Pierre · SIRET 456 789 012 00067 · Qualibat 3111 · Assurance Décennale AXA</span>
          <span className="text-[#b91c1c]/30">Couvreur certifié · Pays de la Loire</span>
        </div>
      </footer>
    </div>
  )
}
