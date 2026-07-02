"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Phone, Star, MapPin, Clock, CheckCircle, Stethoscope, Scissors, Dog, Cat, Calendar, Shield, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   CLINIQUE DU BOIS VERT — Vétérinaire (Toulouse)
   Palette : blanc chaud #fdfaf6 / vert nature #3a7d44 / vert clair #e8f5eb / brun doux #4a3728
   Fonts : Lora (serif chaleureux titres) + Source Sans 3 (corps)
   Style : chaleureux, naturel, confiance, bienveillant
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-55px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SOINS = [
  { icon: Stethoscope, title: "Consultations & bilans", desc: "Consultations de routine, bilans de santé annuels, suivi des maladies chroniques. Écoute, examen clinique approfondi, diagnostic précis." },
  { icon: Shield, title: "Vaccinations & prévention", desc: "Protocoles vaccinaux chats et chiens selon les recommandations WSAVA. Antiparasitaires, rappels, carnets de santé à jour." },
  { icon: Heart, title: "Chirurgie", desc: "Stérilisation, chirurgie des tissus mous, orthopédie. Bloc opératoire équipé, monitoring anesthésique, réveil accompagné." },
  { icon: Scissors, title: "Toilettage vétérinaire", desc: "Bain, coupe, entretien pelage, coupe des griffes, nettoyage oreilles. Réalisé par nos assistants vétérinaires sur rendez-vous." },
  { icon: Dog, title: "Médecine d'urgence", desc: "Prise en charge urgences 7j/7 jusqu'à 20h. Trauma, intoxication, difficultés respiratoires — vous êtes toujours reçus." },
  { icon: Cat, title: "Imagerie & analyses", desc: "Radio numérique, échographie en cabinet. Analyses sanguines et urinaires en labo partenaire avec résultats sous 2h–24h." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function CliniqueBoisVertPage() {
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
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
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
    <div className="bg-[#fdfaf6] text-[#2d2318] overflow-x-hidden" style={{ fontFamily: "'Source Sans 3', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#fdfaf6]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#3a7d44]/10" : "bg-[#fdfaf6]/95 backdrop-blur-md py-5 border-b border-[#3a7d44]/5"}`}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3a7d44] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-[#2d2318] text-sm leading-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>Clinique du Bois Vert</div>
              <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#3a7d44]/60">Vétérinaire · Toulouse</div>
            </div>
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2318]/30">
            {["Soins", "L'équipe", "Urgences", "Tarifs", "Nous trouver"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#3a7d44] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0561789012"}`} className="hidden md:flex items-center gap-2 text-[#3a7d44] font-bold text-sm">
              <Phone className="w-4 h-4" /> 05 61 78 90 12
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#3a7d44] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2e6337] transition-colors rounded-xl">
              Prendre RDV
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#fdfaf6] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Soins", "L'équipe", "Urgences"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#2d2318] hover:text-[#3a7d44] transition-colors" style={{ fontFamily: "'Lora', serif" }}>{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0561789012"}`} className="flex items-center gap-3 text-[#3a7d44] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 05 61 78 90 12</a>
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
          <Image src="https://images.unsplash.com/photo-1559190394-df5a28aab5c5?auto=format&fit=crop&q=85&w=2400" alt="Vétérinaire avec animal" fill className="object-cover object-center" priority style={{ filter: "brightness(0.4)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a1c] via-[#1a2a1c]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a1c]/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1300px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[1px] bg-[#3a7d44]/70" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#6bbf78]">Clinique vétérinaire · Toulouse Rangueil</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-7 text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>{c?.heroHeadline ?? <>
            Prendre soin<br />de ceux qu'ils <span className="text-[#6bbf78] italic">aiment.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-white/35 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Clinique vétérinaire à Toulouse. Consultations, chirurgie, urgences 7j/7 jusqu'à 20h. Une équipe bienveillante pour vos compagnons chats, chiens et NAC.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-3 mb-8">
            <button className="px-8 py-4 bg-[#3a7d44] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#2e6337] transition-colors rounded-xl">{c?.ctaText ?? <>
              Prendre rendez-vous
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0561789012"}`} className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#6bbf78]/50 hover:text-[#6bbf78] transition-all rounded-xl">
              <Phone className="w-4 h-4" /> 05 61 78 90 12
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-5">
            {["Urgences 7j/7 jusqu'à 20h", "Radio & écho en cabinet", "3 vétérinaires"].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#3a7d44]" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#3a7d44]/60 to-transparent" />
        </div>
      </section>

      {/* ── URGENCES BAND ── */}
      <div className="py-9 bg-[#3a7d44] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-white/70 shrink-0" />
            <span className="font-bold text-sm">Urgences vétérinaires 7j/7 — Lun-Sam jusqu'à 20h, Dim jusqu'à 18h</span>
          </div>
          <a href={`tel:${fd?.phone ?? "0561789012"}`} className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#3a7d44] font-bold text-sm rounded-xl hover:bg-[#f0f9f1] transition-colors whitespace-nowrap">
            <Phone className="w-4 h-4" /> 05 61 78 90 12
          </a>
        </div>
      </div>

      {/* ── SOINS ── */}
      <section className="py-28 bg-[#fdfaf6]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a7d44] mb-4">Nos soins</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2d2318]" style={{ fontFamily: "'Lora', serif" }}>
                Tout ce dont votre<br /><span className="text-[#3a7d44]">animal a besoin.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOINS.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 rounded-2xl bg-white border border-[#e8f5eb] hover:border-[#3a7d44]/30 hover:shadow-lg hover:shadow-[#3a7d44]/5 transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#e8f5eb] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#3a7d44] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#3a7d44] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#2d2318] mb-3" style={{ fontFamily: "'Lora', serif" }}>{s.title}</h3>
                  <p className="text-sm text-[#2d2318]/40 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-[#e8f5eb]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "22 ans", l: "De médecine vétérinaire" },
            { v: "4 200+", l: "Animaux suivis / an" },
            { v: "4.9★", l: "Avis Google" },
            { v: "3", l: "Vétérinaires diplômés" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-[#3a7d44] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#2d2318]/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="services" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a7d44] mb-4">Ils nous font confiance</div>
            <h2 className="text-4xl font-bold text-[#2d2318]" style={{ fontFamily: "'Lora', serif" }}>Nos patients <span className="text-[#3a7d44]">& leurs familles.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Luna a été opérée en urgence un dimanche matin. L'équipe était calme, rassurante, hyper compétente. Aujourd'hui elle galope comme avant. Merci du fond du cœur.", n: "Camille V.", l: "Toulouse · Luna, labrador" },
              { q: "Mon chat de 14 ans a une maladie rénale chronique. Le Dr. Martin le suit depuis 3 ans avec une patience et une expertise remarquables. On ne changerait pour rien.", n: "Élisabeth M.", l: "Ramonville · Sushi, chat persan" },
              { q: "Super clinique, accueil top, salle d'attente propre avec espaces chats/chiens séparés. Et nos deux teckels adorent le Dr. Bouchard (ce qui n'est pas commun pour des chiens de véto).", n: "Thomas & Julie K.", l: "Colomiers (31)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl bg-[#fdfaf6] border border-[#e8f5eb] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#3a7d44] text-[#3a7d44]" />)}
                  </div>
                  <p className="text-sm text-[#2d2318]/45 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8f5eb]">
                    <div className="font-bold text-[#2d2318] text-sm" style={{ fontFamily: "'Lora', serif" }}>{t.n}</div>
                    <div className="text-[10px] text-[#3a7d44] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[#3a7d44] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-6">Rendez-vous</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Lora', serif" }}>
              Votre compagnon<br /><span className="italic">mérite le meilleur.</span>
            </h2>
            <p className="text-white/50 mb-10 text-sm">Consultation en ligne ou par téléphone · Urgences 7j/7 · Toulouse Rangueil</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#3a7d44] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f0f9f1] transition-colors rounded-xl shadow-lg">
                Prendre rendez-vous
              </button>
              <a href={`tel:${fd?.phone ?? "0561789012"}`} className="flex items-center gap-3 px-10 py-4 border border-white/25 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl">
                <Phone className="w-4 h-4" /> 05 61 78 90 12
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a2a1c] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 bg-[#3a7d44] rounded-full flex items-center justify-center"><Heart className="w-3.5 h-3.5 text-white" /></div>
              <span className="font-bold text-white text-sm" style={{ fontFamily: "'Lora', serif" }}>Clinique du Bois Vert</span>
            </div>
            <p className="text-white/20 text-sm leading-relaxed">Vétérinaire à Toulouse. Consultations, chirurgie, urgences 7j/7. Chats, chiens, NAC.</p>
          </div>
          {[
            { t: "Soins", ls: ["Consultations & bilans", "Vaccinations", "Chirurgie", "Toilettage", "Urgences", "Imagerie & analyses"] },
            { t: "Cabinet", ls: ["L'équipe", "Nos équipements", "Tarifs", "Avis clients", "Accès & parkings"] },
            { t: "Infos", ls: ["12 allée des Pins", "31400 Toulouse", "Lun-Sam 8h-20h", "Dim 9h-18h", "05 61 78 90 12"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#3a7d44]/60 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href={col.t === "Soins" ? "#services" : "#contact"} className="text-white/20 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 Clinique du Bois Vert · SIRET 012 345 678 00090 · Ordre National des Vétérinaires</span>
          <span className="text-[#3a7d44]/25">Clinique vétérinaire · Toulouse</span>
        </div>
      </footer>
    </div>
  )
}
