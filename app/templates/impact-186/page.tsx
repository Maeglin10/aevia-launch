"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, Star, MapPin, Clock, CheckCircle, Shield, Smile, Heart, Calendar, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   DR. LÉA FONTAINE — Cabinet dentaire moderne (Nantes)
   Palette : blanc pur / bleu confiance #1d6fa4 / bleu clair #e8f4fd / anthracite #1a2332
   Fonts : Nunito (moderne, humain, arrondi) + Inter
   Style : médical moderne, rassurant, lumineux, accessible
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-55px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SOINS = [
  { icon: Smile, title: "Soins conservateurs", desc: "Détartrage, traitement de caries, obturations composite teintées. Matériaux sans mercure, résultat esthétique invisible." },
  { icon: Heart, title: "Prothèses & couronnes", desc: "Couronnes céramique, bridges, prothèses amovibles. Fabrication sur mesure, teintes naturelles, ajustement précis." },
  { icon: Star, title: "Esthétique dentaire", desc: "Blanchiment LED, facettes porcelaine, correction sourire. Résultat naturel garanti. Simulateur sourire en consultation." },
  { icon: Shield, title: "Implantologie", desc: "Pose d'implants sous anesthésie locale. Suivi complet, implants titanium certifiés. Résultat définitif jusqu'à 25 ans." },
  { icon: CheckCircle, title: "Orthodontie adulte", desc: "Aligneurs transparents Invisalign® ou bagues céramiques. Traitement discret, résultat durable, consultation sans engagement." },
  { icon: Clock, title: "Urgences dentaires", desc: "Créneaux réservés urgences chaque matin dès 8h30. Douleur, fracture, dent cassée — on vous prend en charge le jour même." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function DrFontainePage() {
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
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
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
  }, [c]);return (
    <div className="bg-white text-[#1a2332] overflow-x-hidden" style={{ fontFamily: "'Nunito', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#1d6fa4]/10" : "bg-white/95 backdrop-blur-md py-5 border-b border-[#1d6fa4]/5"}`}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="font-bold text-[#1a2332] text-sm leading-tight">Dr. Léa Fontaine</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1d6fa4]/60">Chirurgien-dentiste · Nantes</div>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a2332]/30">
            {["Soins", "L'équipe", "Urgences", "Tarifs", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#1d6fa4] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0240567890"}`} className="hidden md:flex items-center gap-2 text-[#1d6fa4] font-bold text-sm">
              <Phone className="w-4 h-4" /> 02 40 56 78 90
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#1d6fa4] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#155d8a] transition-colors rounded-xl">
              Prendre RDV
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Soins", "L'équipe", "Urgences", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#1a2332] hover:text-[#1d6fa4] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0240567890"}`} className="flex items-center gap-3 text-[#1d6fa4] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 02 40 56 78 90</a>
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
          <Image src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=85&w=2400" alt="Cabinet dentaire moderne lumineux" fill className="object-cover object-center" priority style={{ filter: "brightness(0.42)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1620]/65 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1300px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[1px] bg-[#1d6fa4]/60" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#7bc3f5]">Chirurgien-dentiste · Nantes Centre</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-7 text-white">{c?.heroHeadline ?? <>
            Votre sourire,<br /><span className="text-[#7bc3f5]">notre priorité.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-white/35 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Cabinet dentaire moderne à Nantes. Soins conservateurs, implants, esthétique et orthodontie. Équipement numérique dernière génération. Prise de RDV en ligne 24h/24.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[#1d6fa4] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#155d8a] transition-colors rounded-xl">{c?.ctaText ?? <>
              Prendre rendez-vous
            </>}</button>
            <button className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7bc3f5]/50 hover:text-[#7bc3f5] transition-all rounded-xl">
              <Phone className="w-4 h-4" /> 02 40 56 78 90
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#1d6fa4]/60 to-transparent" />
        </div>
      </section>

      {/* ── CONFIANCE BAND ── */}
      <section className="py-10 bg-[#e8f4fd]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-6 md:gap-12 justify-center md:justify-between">
            {[
              { v: "18 ans", l: "D'expérience en implantologie" },
              { v: "3 800+", l: "Patients suivis" },
              { v: "4.9★", l: "Note Google (280 avis)" },
              { v: "CEIRD", l: "Formation continue certifiée" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1d6fa4]">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a2332]/40 mt-1">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOINS ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1d6fa4] mb-4">Nos soins</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a2332]">Tous vos besoins<br /><span className="text-[#1d6fa4]">en un seul cabinet.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOINS.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 rounded-2xl border border-[#e8f4fd] hover:border-[#1d6fa4]/25 hover:shadow-lg hover:shadow-[#1d6fa4]/5 bg-white transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#e8f4fd] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#1d6fa4] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#1d6fa4] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a2332] mb-3">{s.title}</h3>
                  <p className="text-sm text-[#1a2332]/40 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCES ── */}
      <section id="about" className="py-16 bg-[#1d6fa4]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-3">Urgences dentaires</div>
            <h2 className="text-2xl font-bold text-white">Douleur, fracture, chute de dent ?<br />Nous vous prenons en charge le jour même.</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={`tel:${fd?.phone ?? "0240567890"}`} className="flex items-center gap-3 px-7 py-4 bg-white text-[#1d6fa4] font-bold text-sm rounded-xl hover:bg-[#e8f4fd] transition-colors whitespace-nowrap">
              <Phone className="w-4 h-4" /> 02 40 56 78 90
            </a>
            <div className="flex items-center gap-2 px-7 py-4 border border-white/20 text-white/60 text-sm rounded-xl whitespace-nowrap">
              <Clock className="w-4 h-4" /> Lun-Sam dès 8h30
            </div>
          </div>
        </div>
      </section>

      {/* ── L'ÉQUIPE ── */}
      <section id="contact" className="py-28 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1d6fa4] mb-4">L'équipe soignante</div>
            <h2 className="text-4xl font-bold text-[#1a2332]">Des praticiens <span className="text-[#1d6fa4]">à votre écoute.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nom: "Dr. Léa Fontaine", sp: "Omnipratique & Esthétique", f: "Diplômée Faculté de Nantes 2006, DU Implantologie Tours 2010" },
              { nom: "Dr. Antoine Merle", sp: "Orthodontie & Invisalign®", f: "Spécialiste orthodontie, formateur Invisalign® Provider certifié" },
              { nom: "Sophie C.", sp: "Assistante dentaire", f: "10 ans d'expérience, spécialisée chirurgie implantaire et accueil patient" },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="p-7 rounded-2xl bg-[#f5faff] border border-[#e8f4fd]">
                  <div className="w-14 h-14 rounded-full bg-[#1d6fa4]/10 flex items-center justify-center mb-5">
                    <span className="text-xl font-bold text-[#1d6fa4]">{p.nom.charAt(0)}{p.nom.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div className="font-bold text-[#1a2332] mb-1">{p.nom}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#1d6fa4] mb-3">{p.sp}</div>
                  <p className="text-sm text-[#1a2332]/40 leading-relaxed">{p.f}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-24 bg-[#f5faff]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1d6fa4] mb-4">Avis patients</div>
            <h2 className="text-3xl font-bold text-[#1a2332]">Ils nous font <span className="text-[#1d6fa4]">confiance.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Enfin un cabinet où on se sent à l'aise ! Le Dr. Fontaine prend le temps d'expliquer chaque soin. Pas de douleur, gestes précis, suivi parfait.", n: "Marie-Claire H.", l: "Nantes" },
              { q: "Implant posé sans douleur ni anxiété grâce à l'équipe super rassurante. Résultat bluffant — on ne voit plus la différence avec la vraie dent.", n: "Philippe T.", l: "Saint-Nazaire" },
              { q: "Aligneurs transparents pour ma fille de 16 ans. En 14 mois, résultat parfait. Suivi régulier, app de suivi, équipe disponible. Très satisfaits.", n: "Nathalie & Lucas B.", l: "Rezé (44)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white rounded-2xl border border-[#e8f4fd] shadow-sm h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#1d6fa4] text-[#1d6fa4]" />)}
                  </div>
                  <p className="text-sm text-[#1a2332]/45 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8f4fd]">
                    <div className="font-bold text-[#1a2332] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#1d6fa4] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="services" className="py-24 bg-[#1a2332] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-6">Prendre soin de vous</div>
            <h2 className="text-4xl font-bold text-white mb-5">Prenez RDV<br /><span className="text-[#7bc3f5]">en moins de 2 minutes.</span></h2>
            <p className="text-white/30 mb-10 text-sm">Disponible en ligne 24h/24 · Confirmation SMS · Rappel automatique 48h avant</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#1d6fa4] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#155d8a] transition-colors rounded-xl">
                Réserver en ligne
              </button>
              <a href={`tel:${fd?.phone ?? "0240567890"}`} className="flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7bc3f5]/40 hover:text-[#7bc3f5] transition-all rounded-xl">
                <Phone className="w-4 h-4" /> 02 40 56 78 90
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111827] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-white mb-1">Dr. Léa Fontaine</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1d6fa4]/60 mb-5">Chirurgien-dentiste · Nantes</div>
            <p className="text-white/20 text-sm leading-relaxed">Cabinet dentaire moderne. Omnipratique, implants, esthétique, orthodontie. Urgences tous les matins.</p>
          </div>
          {[
            { t: "Soins", ls: ["Soins conservateurs", "Implantologie", "Esthétique dentaire", "Orthodontie adulte", "Urgences dentaires"] },
            { t: "Cabinet", ls: ["L'équipe", "Équipement 3D", "Tarifs & devis", "Avis patients", "Accessibilité PMR"] },
            { t: "Adresse", ls: ["14 rue Crébillon", "44000 Nantes", "Lun-Ven 8h30-19h", "Sam 8h30-13h", "02 40 56 78 90"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1d6fa4]/60 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href={col.t === "Soins" ? "#services" : col.t === "Cabinet" ? "#about" : "#contact"} className="text-white/20 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 Dr. Léa Fontaine · RPPS 10234567890 · Secteur 2 · Nantes (44)</span>
          <span className="text-[#1d6fa4]/25">Cabinet dentaire · Nantes</span>
        </div>
      </footer>
    </div>
  )
}
