"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, ShieldCheck, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, AlertTriangle, Wind, Menu } from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   TOIT & PIERRE PISCINES — Pisciniste / Constructeur de piscines (Nantes)
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

const SERVICE_ICONS = [Home, Wrench, Wind, AlertTriangle, ShieldCheck, Home]
const SERVICES_DEMO = [
  { icon: Home, title: "Construction de piscine", desc: "Piscine enterrée béton, coque polyester ou bloc à bancher. Terrassement, structure, étanchéité, margelles et plage — de l'étude au remplissage." },
  { icon: Wrench, title: "Rénovation de bassin", desc: "Changement de liner, réfection d'étanchéité, remise à neuf des margelles et de la filtration. Redonnez une seconde vie à votre piscine." },
  { icon: Wind, title: "Couverture & abri", desc: "Volets immergés, bâches à barres, abris bas ou hauts. Protection thermique, sécurité et propreté du bassin toute l'année." },
  { icon: AlertTriangle, title: "Recherche de fuite", desc: "Détection non destructive par colorant, pression et caméra. Localisation précise des fuites de bassin et de canalisation." },
  { icon: ShieldCheck, title: "Sécurité aux normes", desc: "Barrières, alarmes immergées et abris conformes à la loi NF P90. Mise en conformité de votre installation existante." },
  { icon: Home, title: "Entretien & hivernage", desc: "Contrat saisonnier, mise en hivernage, remise en route, traitement de l'eau et nettoyage. Une eau limpide sans effort." },
]

const REALISATIONS_DEMO = [
  { title: "Piscine béton 9×4 m · Villa", tag: "Construction sur-mesure", img: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=1200" },
  { title: "Rénovation liner & plage", tag: "Rénovation complète", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200" },
  { title: "Couloir de nage · Contemporain", tag: "Bassin à débordement", img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ToitPierrePiscinesPage() {
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
    businessProfile?: any;
  } | null>(null);

  const bpLocal: any = session?.businessProfile;
  const SERVICES = resolveList(
    bpLocal?.services?.map((s: any, i: number) => ({
      icon: SERVICE_ICONS[i % SERVICE_ICONS.length],
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    SERVICES_DEMO
  );
  const REALISATIONS = resolveList(
    bpLocal?.beforeAfter?.map((b: any, i: number) => ({
      title: b.caption ?? REALISATIONS_DEMO[i % REALISATIONS_DEMO.length].title,
      tag: "Réalisation",
      img: b.afterUrl ?? b.beforeUrl ?? REALISATIONS_DEMO[i % REALISATIONS_DEMO.length].img,
    })),
    REALISATIONS_DEMO
  );
  const AVIS = resolveList(
    bpLocal?.reputation?.featuredReviews?.map((r: any) => ({
      q: r.text ?? r.quote,
      n: r.name ?? r.author,
      l: r.location ?? r.context ?? "",
      s: r.stars ?? r.rating ?? 5,
    })),
    [
      { q: "Notre piscine béton a été livrée en respectant chaque délai. Chantier propre, équipe à l'écoute, finitions impeccables. Un vrai savoir-faire d'artisan.", n: "Sandrine M.", l: "Nantes", s: 5 },
      { q: "Rénovation complète de notre bassin : liner, margelles et filtration. Le résultat dépasse nos attentes. On profite enfin de notre piscine.", n: "Patrick & Aurélie F.", l: "Saint-Herblain", s: 5 },
      { q: "Installation d'un volet immergé et mise aux normes de sécurité. Travail soigné, conseils précieux. Je recommande sans hésiter.", n: "Luc B.", l: "Rezé", s: 5 },
    ]
  );

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
    let n = 1;
    const _photoArrays: any[] = [REALISATIONS_DEMO];
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
  bp = bpLocal;
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
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#f9f8f6] text-[#1f2937] overflow-x-hidden" style={{ fontFamily: "'Raleway', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f9f8f6]/97 backdrop-blur-xl py-3 border-b border-slate-200 shadow-sm" : "bg-transparent py-7"}`}>
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
                <div className="w-8 h-8 bg-[#374151] flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-[#1f2937] text-base tracking-wide">{fd?.businessName ?? <>Toit <span className="text-[#b91c1c]">&</span> Pierre</>}</span>
              </>
            )}
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
          <Image src={photo(0, "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=85&w=2400")} alt="Piscine sur-mesure" fill className="object-cover" priority style={{ filter: "brightness(0.55)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937] via-[#1f2937]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2937]/50 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-7">
              <div className="w-10 h-[2px] bg-[#b91c1c]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#fca5a5]">Pisciniste qualifié · Pays de la Loire</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-9 text-white">{c?.heroHeadline ?? <>
            La piscine de vos<br />rêves, entre<br /><span className="text-[#fca5a5]">de bonnes mains.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Construction, rénovation, sécurité, couverture et entretien de piscines. Pisciniste qualifié depuis 20 ans. Devis gratuit, garantie décennale.
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
            { v: "1 800+", l: "Piscines réalisées" },
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
            {AVIS.map((t: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-slate-100 hover:border-[#374151]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.s ?? 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#b91c1c] text-[#b91c1c]" />)}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="font-bold text-[#1f2937] text-sm">{t.n}</div>
                    {t.l && <div className="text-[10px] text-[#b91c1c] mt-1"><MapPin className="w-3 h-3 inline mr-1" />{t.l}</div>}
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Un projet de piscine ?<br /><span className="text-[#fca5a5]">Parlons-en.</span></h2>
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
              <span className="font-bold text-white text-sm">{fd?.businessName ?? "Toit & Pierre Piscines"}</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">Pisciniste qualifié · Pays de la Loire. Construction, rénovation et entretien de piscines depuis 2004.</p>
          </div>
          {[
            { t: "Prestations", ls: ["Construction sur-mesure", "Rénovation de bassin", "Sécurité & couverture", "Recherche de fuite", "Local technique", "Entretien & hivernage"] },
            { t: "Matériaux", ls: ["Béton projeté", "Coque polyester", "Bloc à bancher", "Liner armé", "Carrelage & mosaïque"] },
            { t: "Contact", ls: ["02 40 12 34 56", "devis@toitpierre.fr", "Pays de la Loire", "Étude 3D offerte", "Devis gratuit sous 48h"] },
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
          <span>© 2026 {fd?.businessName ?? "Toit & Pierre Piscines"} · SIRET 456 789 012 00067 · Garantie Décennale · Assurance RC Pro</span>
          <span className="text-[#b91c1c]/30">Pisciniste certifié · Pays de la Loire</span>
        </div>
      </footer>
    </div>
  )
}
