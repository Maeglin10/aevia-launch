"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Key, Lock, Shield, Zap, Clock, Phone, Star, MapPin, CheckCircle, AlertTriangle, Wrench, Home, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   SÉC'URFAST — Serrurier urgence & sécurité (Strasbourg)
   Palette : nuit #0d1524 / acier #1e3a5f / bleu électrique #2563eb / blanc froid #f0f4ff
   Fonts : Exo 2 (moderne, tech, lisible) + Inter
   Style : disponible 24/7, fiable, urgent, bleu nuit professionnel
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

const SERVICES = [
  { icon: AlertTriangle, title: "Urgence & dépannage 24h/24", desc: "Porte claquée, serrure bloquée, intrusion. Intervention sous 30 min sur Strasbourg. Astreinte 7j/7 nuits et jours fériés inclus." },
  { icon: Lock, title: "Changement & installation serrure", desc: "Pose serrure 3 points, blindée, connectée. Toutes marques : Vachette, Fichet, Mul-T-Lock, Abus. Devis transparent avant travaux." },
  { icon: Home, title: "Porte blindée & renforcée", desc: "Fourniture et pose de portes blindées Fichet, Mottura, Fichet Bauche. Conforme norme NF A2P. Financement disponible." },
  { icon: Shield, title: "Contrôle d'accès & visiophonie", desc: "Digicode, badge, lecteur biométrique, interphone vidéo. Système géré par smartphone. Idéal copropriétés et locaux pro." },
  { icon: Key, title: "Reproduction & trousseau", desc: "Reproduction clés plates, cylindres, badges, télécommandes de garage. Gravure sur mesure. Clés en double livrées sous 24h." },
  { icon: Wrench, title: "Coffre-fort & sécurité", desc: "Fourniture, scellement et ouverture de coffres-forts. Gamme domestique et professionnelle. Expertise assurance incluse." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SecurFastPage() {
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
    <div className="bg-[#0d1524] text-[#f0f4ff] overflow-x-hidden" style={{ fontFamily: "'Exo 2', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0d1524]/98 backdrop-blur-xl py-3 border-b border-[#2563eb]/15" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Lock className="w-5 h-5 text-[#2563eb]" />
                <span className="font-bold text-[#f0f4ff] tracking-wide text-sm">SÉC'UR<span className="text-[#2563eb]">FAST</span></span>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0f4ff]/25">
            {["Services", "Urgences", "Tarifs", "Zone", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#2563eb] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0388234567"}`} className="hidden md:flex items-center gap-2 text-[#2563eb] font-bold text-sm">
              <Phone className="w-4 h-4" /> 03 88 23 45 67
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-[#1d4ed8] transition-colors">
              Urgence 24h/24
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#f0f4ff]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#111d30] border-[#2563eb]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Urgences", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#f0f4ff] hover:text-[#2563eb] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0388234567"}`} className="flex items-center gap-3 text-[#2563eb] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 03 88 23 45 67</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── URGENCE TOP BANNER ── */}
      <div className="pt-0 fixed top-0 left-0 right-0 z-40 translate-y-[72px]">
        <div className="bg-[#2563eb] py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white flex items-center justify-center gap-4">
          <Zap className="w-3.5 h-3.5" />
          Disponible 24h/24 — 7j/7 — Intervention sous 30 min à Strasbourg
          <a href={`tel:${fd?.phone ?? "0388234567"}`} className="underline ml-2">03 88 23 45 67</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden pt-16">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=2400" alt="Serrurier professionnel sécurité" fill className="object-cover object-center" priority style={{ filter: "brightness(0.22) saturate(0.6)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1524] via-[#0d1524]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1524]/90 to-transparent" />
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(37,99,235,0.015)_2px,rgba(37,99,235,0.015)_4px)]" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#2563eb]/70">Serrurier agréé · Strasbourg & Bas-Rhin</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.43, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-7 text-[#f0f4ff]">{c?.heroHeadline ?? <>
            Bloqué dehors ?<br /><span className="text-[#2563eb]">On arrive.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-[#f0f4ff]/28 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Serrurier professionnel à Strasbourg. Urgences 24h/24, 7j/7. Ouverture de porte, changement de serrure, porte blindée. Intervention sous 30 min. Devis avant intervention.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-4 mb-8">
            <a href={`tel:${fd?.phone ?? "0388234567"}`} className="flex items-center gap-3 px-9 py-4 bg-[#2563eb] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#1d4ed8] transition-colors">
              <Phone className="w-4 h-4" /> 03 88 23 45 67
            </a>
            <button className="px-9 py-4 border border-[#f0f4ff]/12 text-[#f0f4ff]/40 font-bold text-[10px] uppercase tracking-widest hover:border-[#2563eb]/40 hover:text-[#2563eb] transition-all">
              Devis gratuit en ligne
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-6">
            {["Intervention 30 min", "Devis avant travaux", "Agréé assurances"].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#2563eb]" />
                <span className="text-[10px] font-bold text-[#f0f4ff]/25 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#2563eb]/60 to-transparent" />
        </div>
      </section>

      {/* ── CHIFFRES ── */}
      <section className="py-14 bg-[#111d30] border-y border-[#2563eb]/10">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "< 30 min", l: "Délai intervention moyen" },
            { v: "15 ans", l: "D'expérience" },
            { v: "4.8★", l: "Note Google" },
            { v: "24/7", l: "Disponibilité" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-3">
                <div className="text-2xl font-bold text-[#2563eb] mb-1">{s.v}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#f0f4ff]/20">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 bg-[#0d1524]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#2563eb]/55 mb-4">— Nos interventions</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#f0f4ff]">Sécurité & <span className="text-[#2563eb]">sérénité.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-7 border border-[#f0f4ff]/5 hover:border-[#2563eb]/30 hover:bg-[#111d30] transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#2563eb]/10 flex items-center justify-center mb-5 group-hover:bg-[#2563eb] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#2563eb] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#f0f4ff] mb-3 group-hover:text-[#2563eb] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#f0f4ff]/25 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="services" className="py-24 bg-[#111d30]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#2563eb]/50 mb-4">— Avis clients</div>
            <h2 className="text-4xl font-bold text-[#f0f4ff]">Ils ont pu <span className="text-[#2563eb]">rentrer chez eux.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "Porte claquée à 23h30 avec mes clés à l'intérieur. Arrivée en 25 minutes, ouverture en 10 minutes, porte intacte, facture correcte. Merci pour ce service pro et rapide.", n: "Émilie T.", l: "Strasbourg Hautepierre" },
              { q: "Changement serrure 3 points après perte de clés. Devis donné par téléphone avant tout. Travail propre, serrurier ponctuel et de bon conseil pour la sécurité.", n: "Fabrice M.", l: "Schiltigheim (67)" },
              { q: "Porte blindée installée en 3 heures. Très beau travail, finitions parfaites, prise en charge partielle par mon assurance. L'investissement valait vraiment le coup.", n: "Sandra et Marc O.", l: "Illkirch-Graffenstaden" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#f0f4ff]/5 hover:border-[#2563eb]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#2563eb] text-[#2563eb]" />)}
                  </div>
                  <p className="text-sm text-[#f0f4ff]/28 leading-relaxed flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f0f4ff]/5">
                    <div className="font-bold text-[#f0f4ff] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#2563eb] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="tarifs" className="py-24 bg-[#2563eb] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-5">Urgence · 24h/24 · 7j/7</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Un appel suffit.<br />On s'occupe du reste.</h2>
            <p className="text-white/55 mb-10 text-sm">Intervention sous 30 min · Strasbourg & Bas-Rhin · Devis avant travaux</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={`tel:${fd?.phone ?? "0388234567"}`} className="flex items-center gap-3 px-10 py-4 bg-white text-[#2563eb] font-bold text-sm hover:bg-[#f0f4ff] transition-colors shadow-lg">
                <Phone className="w-5 h-5" /> 03 88 23 45 67
              </a>
              <button className="px-10 py-4 border-2 border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:border-white/60 transition-all">
                Devis en ligne
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#070d18] pt-16 pb-8 px-6 border-t border-[#2563eb]/8">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Lock className="w-4 h-4 text-[#2563eb]" /><span className="font-bold text-[#f0f4ff] text-sm">SÉC'URFAST</span></div>
            <p className="text-[#f0f4ff]/15 text-sm leading-relaxed">Serrurier urgence Strasbourg. Disponible 24h/24. Ouverture porte, serrures, porte blindée, contrôle d'accès.</p>
          </div>
          {[
            { t: "Services", ls: ["Urgence 24h/24", "Changement serrure", "Porte blindée", "Contrôle d'accès", "Coffre-fort"] },
            { t: "Infos", ls: ["Agréments & certifications", "Zone d'intervention", "Tarifs & devis", "Avis clients", "FAQ"] },
            { t: "Contact", ls: ["03 88 23 45 67", "contact@securfast.fr", "Strasbourg & 67", "24h/24 — 7j/7", "Devis gratuit"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#2563eb]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f0f4ff]/15 text-sm hover:text-[#f0f4ff]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#f0f4ff]/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#f0f4ff]/8">
          <span>© 2026 SÉC'URFAST · SIRET 567 890 123 00044 · Agréé assurances · Strasbourg (67)</span>
          <span className="text-[#2563eb]/20">Serrurier urgence · 24h/24</span>
        </div>
      </footer>
    </div>
  )
}
