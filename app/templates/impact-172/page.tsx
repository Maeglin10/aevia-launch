"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Scale, Shield, Briefcase, Users, Building, FileText, Phone, Mail, MapPin, ChevronRight, Award, Globe } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-legrand"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const DOMAINS = [
  {
    id: "corporate",
    icon: Building,
    label: "Droit des affaires",
    desc: "Fusions-acquisitions, due diligences, structuration d'opérations complexes, capital-investissement et gouvernance d'entreprise. Notre équipe accompagne les groupes dans leurs opérations stratégiques.",
    expertise: ["Fusions & Acquisitions", "Droit des sociétés", "Capital-investissement", "Joint-ventures"],
  },
  {
    id: "litigation",
    icon: Scale,
    label: "Contentieux",
    desc: "Gestion des litiges commerciaux, arbitrages internationaux, procédures collectives et contentieux réglementaires devant l'ensemble des juridictions françaises et européennes.",
    expertise: ["Arbitrage international", "Litiges commerciaux", "Procédures collectives", "Contentieux pénal des affaires"],
  },
  {
    id: "tax",
    icon: FileText,
    label: "Fiscalité",
    desc: "Conseil fiscal des entreprises et des particuliers fortunés, structuration patrimoniale, prix de transfert, fiscalité internationale et contentieux fiscal.",
    expertise: ["Fiscalité internationale", "Prix de transfert", "Structuration patrimoniale", "Contentieux fiscal"],
  },
  {
    id: "employment",
    icon: Users,
    label: "Droit social",
    desc: "Droit individuel et collectif du travail, négociations collectives, restructurations sociales, contentieux prud'homal et accompagnement des dirigeants.",
    expertise: ["Relations collectives", "Restructurations", "Contentieux prud'homal", "Protection des dirigeants"],
  },
  {
    id: "ip",
    icon: Shield,
    label: "Propriété intellectuelle",
    desc: "Stratégies de protection et de valorisation des actifs immatériels, contentieux en contrefaçon, licences et transferts de technologie.",
    expertise: ["Marques & Brevets", "Contentieux contrefaçon", "Licences & transferts", "Droit du numérique"],
  },
]

const PARTNERS = [
  { name: "Philippe Legrand", title: "Associé Fondateur", domain: "Droit des affaires", bar: "Paris, 1991", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Marie-Sophie Renault", title: "Associée", domain: "Contentieux & Arbitrage", bar: "Paris, 1998", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Thomas Vigneron", title: "Associé", domain: "Fiscalité internationale", bar: "Paris, 2003", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Claire Bourgeois", title: "Associée", domain: "Droit social", bar: "Paris & Bruxelles, 2005", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
]

const REFERENCES = [
  { sector: "Énergie & Environnement", ops: "12 opérations M&A", years: "15 ans de relation" },
  { sector: "Technologies & Digital", ops: "8 litiges arbitraux", years: "10 ans de relation" },
  { sector: "Private Equity", ops: "30+ LBO conseillés", years: "18 ans de relation" },
  { sector: "Luxe & Distribution", ops: "20 restructurations", years: "12 ans de relation" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function LegrandPage() {
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [PARTNERS];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDomain, setActiveDomain] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, []);

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
  }, [c]);const ActiveDomainIcon = DOMAINS[activeDomain].icon

  return (
    <div className="min-h-dvh bg-[#F9F6F0] text-[#1A1510]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#C9A855] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#E8E0D0]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#contact" className="flex flex-col">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <span className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Legrand & Associés"}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A855]">Avocats au Barreau de Paris</span>
              </>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm text-[#5A5040]">
            {["Domaines", "Associés", "Cabinet", "Références", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#1A1510] transition-colors duration-200 font-light">{l}</Link>
            ))}
            <Link href="#contact" className="ml-2 px-5 py-2.5 bg-[#1A1510] text-[#F9F6F0] text-xs tracking-widest uppercase hover:bg-[#C9A855] transition-colors duration-300 cursor-pointer">
              Nous contacter
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#1A1510] text-[#F9F6F0] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3020]">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Legrand & Associés"}</span>
              )}
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Domaines", "Associés", "Cabinet", "Références", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#C9A855] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" ref={heroRef} className="relative min-h-dvh overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src={photo(0, "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=85")} alt="Palais de justice" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A06] via-[#0E0A06]/60 to-transparent" />
        </motion.div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-32">
          <Reveal>
            <p className="text-[#C9A855] text-xs tracking-[0.3em] uppercase mb-8">Fondé en 1991 · Paris · Bruxelles · Luxembourg</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.0] text-[#F9F6F0] mb-8 max-w-4xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>{c?.heroHeadline ?? <>
              <em>L&apos;excellence</em><br />juridique au service<br />de vos ambitions
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#C8B89A] text-lg max-w-lg mb-12 font-light leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
              Cabinet d&apos;avocats d&apos;affaires indépendant, Legrand & Associés conseille les entreprises et les institutions dans leurs opérations les plus complexes depuis plus de trente ans.
            </>}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="#domaines" className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A855] text-[#1A1510] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                Nos domaines <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#contact" className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A855]/50 text-[#F9F6F0] font-light text-sm tracking-wide uppercase hover:border-[#C9A855] transition-colors cursor-pointer">
                Prendre contact
              </Link>
            </div>
          </Reveal>
          {/* Stats bar */}
          <div className="mt-20 pt-10 border-t border-[#3A3020] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["33 ans", "D'exercice"], ["6 associés", "Experts"], ["15 pays", "Couverture"], ["Top 50", "Classements"]].map(([val, label]) => (
              <Reveal key={label} delay={0.1}>
                <div>
                  <div className="text-[#C9A855] text-2xl font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{val}</div>
                  <div className="text-xs text-[#8A7860] tracking-wide uppercase">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section id="domaines" className="py-28 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4">Expertise</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  Nos domaines<br />d&apos;<em>intervention</em>
                </>}</h2>
              </Reveal>
            </div>
            <div className="md:col-span-3">
              <Reveal delay={0.1}>
                <p className="text-[#5A5040] leading-relaxed">{c?.aboutText ?? <>
                  Notre cabinet offre une couverture complète du droit des affaires, avec une approche pluridisciplinaire qui permet de traiter les situations les plus complexes en mobilisant les compétences appropriées.
                </>}</p>
              </Reveal>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-0 border border-[#E8E0D0]">
            {/* Sidebar tabs */}
            <div className="lg:col-span-2 border-r border-[#E8E0D0]">
              {DOMAINS.map((d, i) => {
                const Icon = d.icon
                return (
                  <button key={d.id} onClick={() => setActiveDomain(i)}
                    className={`w-full text-left p-6 border-b border-[#E8E0D0] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${activeDomain === i ? "bg-[#1A1510] text-[#F9F6F0]" : "hover:bg-[#F0EAE0]"}`}>
                    <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${activeDomain === i ? "text-[#C9A855]" : "text-[#C9A855]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${activeDomain === i ? "text-[#F9F6F0]" : "text-[#1A1510]"}`}>{d.label}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-colors ${activeDomain === i ? "text-[#C9A855]" : "text-[#C9A855] opacity-0 group-hover:opacity-100"}`} />
                  </button>
                )
              })}
            </div>

            {/* Content panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={activeDomain} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                  className="p-8 md:p-12 h-full">
                  <div className="w-12 h-12 border border-[#C9A855] flex items-center justify-center mb-8">
                    <ActiveDomainIcon className="w-6 h-6 text-[#C9A855]" />
                  </div>
                  <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {DOMAINS[activeDomain].label}
                  </h3>
                  <p className="text-[#5A5040] leading-relaxed mb-10">{DOMAINS[activeDomain].desc}</p>
                  <div className="space-y-3">
                    <p className="text-xs tracking-[0.2em] uppercase text-[#C9A855] mb-4">Domaines d&apos;expertise</p>
                    {DOMAINS[activeDomain].expertise.map(e => (
                      <div key={e} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-[1px] bg-[#C9A855]" />
                        <span className="text-[#3A3020]">{e}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#contact" className="mt-10 inline-flex items-center gap-2 text-sm text-[#C9A855] border-b border-[#C9A855] pb-0.5 hover:text-[#1A1510] hover:border-[#1A1510] transition-colors cursor-pointer">
                    Consulter nos équipes <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="associés" className="py-28 bg-[#1A1510] text-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4">L&apos;équipe dirigeante</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Les <em>associés</em>
              </h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3A3020]">
            {PARTNERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="bg-[#1A1510] group cursor-pointer hover:bg-[#231E14] transition-colors duration-300">
                  {/* Gold line top */}
                  <div className="h-[2px] bg-[#C9A855] relative">
                    <motion.div className="absolute top-0 left-0 h-full bg-[#E0BC70]" initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                  </div>
                  <div className="p-6">
                    <div className="relative aspect-square overflow-hidden mb-6">
                      <Image src={p.image} alt={p.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <h3 className="text-lg font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{p.name}</h3>
                    <p className="text-[#C9A855] text-xs tracking-wide uppercase mb-2">{p.title}</p>
                    <p className="text-sm text-[#8A7860] mb-1">{p.domain}</p>
                    <p className="text-xs text-[#5A5040]">Barreau de {p.bar}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cabinet */}
      <section id="cabinet" className="py-28 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4">Le cabinet</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Trente ans de<br /><em>confiance</em><br />construite
                </h2>
                <p className="text-[#5A5040] leading-relaxed mb-6">
                  Fondé en 1991 par Philippe Legrand, le cabinet s&apos;est construit sur des valeurs d&apos;indépendance, d&apos;excellence et de disponibilité. Nous refusons le gigantisme qui dilue la relation client et préférons une structure à taille humaine, où chaque associé s&apos;engage personnellement.
                </p>
                <p className="text-[#5A5040] leading-relaxed mb-10">
                  Notre indépendance nous permet de défendre avec intégrité les intérêts de nos clients, sans conflit d&apos;intérêt. Nous privilégions des relations durables : nos clients les plus anciens nous font confiance depuis plus de vingt ans.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-[#E8E0D0]">
                  {[{ Icon: Award, text: "Tier 1 Legal 500" }, { Icon: Globe, text: "15 pays couverts" }, { Icon: Briefcase, text: "500+ dossiers/an" }].map(({ Icon, text }) => (
                    <div key={text} className="text-center">
                      <Icon className="w-6 h-6 text-[#C9A855] mx-auto mb-2" />
                      <p className="text-xs text-[#5A5040]">{text}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="relative">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image src={photo(1, "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80")} alt="Cabinet Legrand" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#C9A855] text-[#1A1510] p-6">
                  <div className="text-3xl font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>1991</div>
                  <div className="text-xs uppercase tracking-wide">Fondé à Paris</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* References */}
      <section id="références" className="py-20 bg-[#E8E0D0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4 text-center">Références sectorielles</p>
            <h2 className="text-3xl font-light text-center mb-12" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Des relations au long cours
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-px bg-[#D0C8B8]">
            {REFERENCES.map((r, i) => (
              <Reveal key={r.sector} delay={i * 0.08}>
                <div className="bg-[#E8E0D0] p-8 hover:bg-[#F9F6F0] transition-colors duration-300">
                  <p className="text-xs tracking-widest uppercase text-[#C9A855] mb-3">{r.sector}</p>
                  <p className="text-lg font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{r.ops}</p>
                  <p className="text-xs text-[#8A7860]">{r.years}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-24 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4">Actualités & Publications</p>
            <h2 className="text-3xl font-light mb-12" style={{ fontFamily: "'Libre Baskerville', serif" }}>Dernières analyses</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { cat: "Droit des affaires", title: "Les nouvelles obligations de transparence des sociétés cotées — analyse de la directive CSRD", date: "Novembre 2024" },
              { cat: "Fiscalité", title: "Réforme du régime des prix de transfert : implications pratiques pour les groupes multinationaux", date: "Octobre 2024" },
              { cat: "Contentieux", title: "L'arbitrage international en matière d'investissement : tendances récentes et perspectives", date: "Septembre 2024" },
            ].map((pub, i) => (
              <Reveal key={pub.title} delay={i * 0.08}>
                <div className="border border-[#E8E0D0] p-8 hover:border-[#C9A855] transition-colors duration-300 cursor-pointer group">
                  <p className="text-xs tracking-widest uppercase text-[#C9A855] mb-4">{pub.cat}</p>
                  <h3 className="text-base font-light leading-snug mb-6 group-hover:text-[#C9A855] transition-colors duration-200" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {pub.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#8A7860]">
                    <span>{pub.date}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A855] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-[#1A1510] text-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C9A855] mb-4">Nous contacter</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Votre dossier<br />mérite notre<br /><em>attention</em>
                </h2>
                <p className="text-[#8A7860] leading-relaxed mb-12">
                  Nous répondons à toute demande de premier contact sous 24 heures ouvrées. La confidentialité de vos échanges est garantie dès le premier contact.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-5">
                  {[{ Icon: MapPin, text: "14 avenue Montaigne, 75008 Paris" }, { Icon: Phone, text: "+33 1 44 20 00 00" }, { Icon: Mail, text: "contact@legrand-associes.fr" }, { Icon: Globe, text: "Également à Bruxelles & Luxembourg" }].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm text-[#8A7860]">
                      <Icon className="w-4 h-4 text-[#C9A855] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Prénom", "Nom"].map(f => (
                    <div key={f}>
                      <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">{f}</label>
                      <input className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F9F6F0] focus:outline-none focus:border-[#C9A855] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                {[["Société / Organisation", "text", "Votre société"], ["Email professionnel", "email", "votre@societe.fr"], ["Téléphone", "tel", "+33 1..."]].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">{label}</label>
                    <input type={type} className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F9F6F0] focus:outline-none focus:border-[#C9A855] transition-colors" placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">Nature de la demande</label>
                  <select className="w-full bg-[#231E14] border border-[#3A3020] px-4 py-3 text-sm text-[#F9F6F0] focus:outline-none focus:border-[#C9A855] transition-colors">
                    <option>Droit des affaires</option>
                    <option>Contentieux & Arbitrage</option>
                    <option>Fiscalité</option>
                    <option>Droit social</option>
                    <option>Propriété intellectuelle</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">Description du dossier</label>
                  <textarea rows={4} className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F9F6F0] focus:outline-none focus:border-[#C9A855] transition-colors resize-none" placeholder="Décrivez succinctement votre situation et vos besoins..." />
                </div>
                <button type="submit" className="w-full bg-[#C9A855] text-[#1A1510] py-4 text-xs tracking-widest uppercase font-medium hover:bg-[#E0BC70] transition-colors duration-300 cursor-pointer">
                  Envoyer la demande
                </button>
                <p className="text-xs text-[#5A5040] text-center">Vos informations sont strictement confidentielles et protégées par le secret professionnel.</p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0A06] text-[#5A5040] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="text-[#F9F6F0] font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Legrand & Associés"}</div>
            <div className="text-xs text-[#C9A855] tracking-widest uppercase">Avocats au Barreau de Paris</div>
          </div>
          <div className="flex flex-wrap gap-8 text-xs">
            {["Domaines", "Associés", "Cabinet", "Publications", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#F9F6F0] transition-colors cursor-pointer">{l}</Link>
            ))}
          </div>
          <div className="text-xs">
            <p>© 2024 Legrand & Associés · Tous droits réservés</p>
            <p className="mt-1">Barreau de Paris · SIRET 382 912 847 00025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
