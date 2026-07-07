"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wrench, Car, Settings, Zap, Shield, Clock, Star, Phone, MapPin, CheckCircle, AlertTriangle, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   AUTO EXPERT — Garage & carrosserie automobile (Rennes)
   Palette : acier sombre #0e1117 / rouge précision #dc2626 / gris métal #3a3f4a / blanc tech #f1f3f5
   Fonts : Space Grotesk (titres tech) + Inter
   Style : industriel premium, précis, performance, confiance mécanique
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SERVICES = [
  { icon: Wrench, title: "Entretien & révision", desc: "Vidange, filtres, distribution, embrayage, freins. Contrôle multi-points offert à chaque révision. Respect carnet entretien constructeur." },
  { icon: Car, title: "Carrosserie & peinture", desc: "Débosselage, remplacement pièces, peinture teintée en cabine UV. Assurance prise en charge directe. Devis gratuit 30 min." },
  { icon: Settings, title: "Diagnostic électronique", desc: "Valise OBD dernière génération, tous constructeurs. Lecture et effacement codes erreur, mise à jour logiciels, diagnostic complet." },
  { icon: Zap, title: "Véhicules électriques & hybrides", desc: "Agrément constructeur Tesla, Renault Zoe, Peugeot e-208. Révision batterie HV, diagnostic BMS, entretien freinage régénératif." },
  { icon: Shield, title: "Contrôle technique", desc: "Contre-visite rapide, mise en conformité avant CT, préparation complète. Partenaire Sécuritest sur place. Sans rendez-vous pour vérification rapide." },
  { icon: AlertTriangle, title: "Dépannage & remorquage", desc: "Intervention 7j/7 en Ille-et-Vilaine. Crevaison, panne, accident. Dépanneuse disponible sous 45 min. Convoyage vers atelier inclus." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AutoExpertPage() {
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
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

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
    <div className="bg-[#0e1117] text-[#f1f3f5] overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0e1117]/97 backdrop-blur-xl py-3 border-b border-[#dc2626]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-7 h-7 bg-[#dc2626] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-[#f1f3f5] tracking-wide text-sm">AUTO<span className="text-[#dc2626]">EXPERT</span></span>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f1f3f5]/25">
            {["Services", "Devis rapide", "Véhicules élec.", "Équipe", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#dc2626] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0299345678"}`} className="hidden md:flex items-center gap-2 text-[#dc2626] font-bold text-sm">
              <Phone className="w-4 h-4" /> 02 99 34 56 78
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-[#c01f1f] transition-colors">
              Devis gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#f1f3f5]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#141820] border-[#dc2626]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Devis rapide", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-bold text-[#f1f3f5] hover:text-[#dc2626] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0299345678"}`} className="flex items-center gap-3 text-[#dc2626] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 02 99 34 56 78</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=88&w=2400" alt="Garage automobile moderne" fill className="object-cover object-center" priority style={{ filter: "brightness(0.3) saturate(0.7)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1117] via-[#0e1117]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1117]/80 to-transparent" />
          {/* Red accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#dc2626]/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[2px] bg-[#dc2626]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#dc2626]/70">Garage & carrosserie · Rennes</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-8 text-[#f1f3f5]">{c?.heroHeadline ?? <>
            Votre voiture<br />entre <span className="text-[#dc2626]">de bonnes mains.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-[#f1f3f5]/30 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Garage multimarque à Rennes. Entretien, carrosserie, diagnostic électronique, VE & hybrides. Devis gratuit sous 30 min. Prise en charge assurance directe.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-4 mb-8">
            <button className="px-9 py-4 bg-[#dc2626] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#c01f1f] transition-colors">{c?.ctaText ?? <>
              Devis gratuit 30 min
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0299345678"}`} className="flex items-center gap-3 px-9 py-4 border border-[#f1f3f5]/10 text-[#f1f3f5]/40 font-bold text-[10px] uppercase tracking-widest hover:border-[#dc2626]/40 hover:text-[#dc2626] transition-all">
              <Phone className="w-4 h-4" /> 02 99 34 56 78
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-5">
            {["Devis gratuit", "Prise en charge assurance", "Agrément VE"].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#dc2626]" />
                <span className="text-[10px] font-bold text-[#f1f3f5]/25 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#dc2626]/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#141820] border-y border-[#dc2626]/8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "28 ans", l: "D'expertise mécanique" },
            { v: "12 000+", l: "Véhicules révisés" },
            { v: "4.8★", l: "Note Google" },
            { v: "J+1", l: "Délai moyen entretien" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-[#dc2626] mb-1">{s.v}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#f1f3f5]/20">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#0e1117]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#dc2626]/60 mb-4">— Nos expertises</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#f1f3f5]">Tout pour<br /><span className="text-[#dc2626]">votre véhicule.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-7 border border-[#f1f3f5]/5 hover:border-[#dc2626]/30 hover:bg-[#141820] transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#dc2626]/10 flex items-center justify-center mb-5 group-hover:bg-[#dc2626] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#dc2626] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#f1f3f5] mb-3 group-hover:text-[#dc2626] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#f1f3f5]/25 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVIS RAPIDE BAND ── */}
      <div className="py-10 bg-[#dc2626]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-bold text-white text-lg mb-1">Devis gratuit en 30 minutes</div>
            <p className="text-white/65 text-sm">Décrivez votre panne ou votre besoin. On vous rappelle avec une estimation claire, sans surprise.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="px-7 py-3.5 bg-white text-[#dc2626] font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#f1f3f5] transition-colors whitespace-nowrap">
              Demander un devis
            </button>
            <a href={`tel:${fd?.phone ?? "0299345678"}`} className="flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:border-white transition-all whitespace-nowrap">
              <Phone className="w-4 h-4" /> Appeler
            </a>
          </div>
        </div>
      </div>

      {/* ── TÉMOIGNAGES ── */}
      <section id="tarifs" className="py-28 bg-[#141820]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#dc2626]/50 mb-4">— Avis clients</div>
            <h2 className="text-4xl font-bold text-[#f1f3f5]">Ils nous <span className="text-[#dc2626]">font confiance.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "Devis transparent, délai respecté à la journée. Ma Megane 4 révisée + plaquettes changées en une journée. Propre, professionnel, prix juste. Je reviens.", n: "Sébastien P.", l: "Rennes Villejean" },
              { q: "Carrosserie après accrochage prise en charge à 100% par mon assurance. Voiture comme neuve en 4 jours. La couleur est identique, on ne voit rien. Merci !", n: "Nathalie L.", l: "Cesson-Sévigné (35)" },
              { q: "Seul garage du coin qui accepte les Tesla Model 3. Diagnostic précis, pièces d'origine, et personnel vraiment compétent sur les EV. Une adresse à garder.", n: "Kevin T.", l: "Saint-Grégoire (35)" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#f1f3f5]/5 hover:border-[#dc2626]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#dc2626] text-[#dc2626]" />)}
                  </div>
                  <p className="text-sm text-[#f1f3f5]/28 leading-relaxed flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f1f3f5]/5">
                    <div className="font-bold text-[#f1f3f5] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#dc2626] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[#0e1117] border-t border-[#dc2626]/10">
        <Reveal>
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#dc2626]/40 mb-6">Intervention rapide</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f1f3f5] mb-5">
              Un problème<br /><span className="text-[#dc2626]">avec votre auto ?</span>
            </h2>
            <p className="text-[#f1f3f5]/25 mb-10 text-sm">Devis gratuit 30 min · Dépannage 7j/7 · Rennes & agglomération</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#dc2626] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#c01f1f] transition-colors">
                Devis gratuit maintenant
              </button>
              <a href={`tel:${fd?.phone ?? "0299345678"}`} className="flex items-center gap-3 px-10 py-4 border border-[#f1f3f5]/10 text-[#f1f3f5]/35 font-bold text-[10px] uppercase tracking-widest hover:border-[#dc2626]/40 hover:text-[#dc2626] transition-all">
                <Phone className="w-4 h-4" /> 02 99 34 56 78
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#070c12] pt-16 pb-8 px-6 border-t border-[#dc2626]/6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-6 bg-[#dc2626] flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
              <span className="font-bold text-[#f1f3f5] text-sm">AutoExpert</span>
            </div>
            <p className="text-[#f1f3f5]/15 text-sm leading-relaxed">Garage multimarque à Rennes. Entretien, carrosserie, VE & hybrides. Agréé constructeur.</p>
          </div>
          {[
            { t: "Services", ls: ["Entretien & révision", "Carrosserie & peinture", "Diagnostic électronique", "Véhicules électriques", "Dépannage 7j/7"] },
            { t: "Infos", ls: ["Qui sommes-nous", "Nos agréments", "Prise en charge assurance", "Tarifs", "FAQ"] },
            { t: "Adresse", ls: ["45 zone Industrielle Nord", "35000 Rennes", "Lun-Ven 8h-18h30", "Sam 8h-17h", "02 99 34 56 78"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#dc2626]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#services" className="text-[#f1f3f5]/15 text-sm hover:text-[#f1f3f5]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#f1f3f5]/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#f1f3f5]/8">
          <span>© 2026 AutoExpert Rennes · SIRET 345 678 901 00022 · FCA · Rennes (35)</span>
          <span className="text-[#dc2626]/15">Garage multimarque Rennes</span>
        </div>
      </footer>
    </div>
  )
}
