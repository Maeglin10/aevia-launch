"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Paintbrush, Sparkles, Phone, Star, MapPin, ArrowRight, CheckCircle, Layers, Brush, Shield, Menu } from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientSiret,
  clientName,
  clientAreas,
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientPhotos,
  clientReviews,
  clientServices,
  clientText,
} from "@/lib/templates/clientContent";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   COULEURS & CO PISCINES — Pisciniste / Constructeur de piscines ({clientCity({ formData: fd }) ?? "Lille"})
   Palette : blanc pur / vert sauge #4d7c5f / gris perle #e8e8e4 / encre #1a1a2e
   Fonts : Montserrat (titres) + Nunito (corps)
   Style : frais, propre, coloré, artisanal premium
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
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

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Réalisations", h: "#realisations" },
  { l: "Couleurs", h: "#couleurs" },
  { l: "Zone", h: "#zone" },
  { l: "Contact", h: "#contact" },
];

const SERVICE_ICONS = [Paintbrush, Layers, Brush, Sparkles, Shield, Paintbrush]
const SERVICES_SOURCE = [
  { icon: Paintbrush, title: "Construction de piscine", desc: "Piscine enterrée béton, coque ou bloc à bancher. Terrassement, structure, étanchéité, margelles et plage. De l'étude 3D à la mise en eau." },
  { icon: Layers, title: "Revêtement & finitions", desc: "Liner armé, membrane PVC, carrelage, mosaïque ou béton ciré. Choix de teintes et de matières pour un bassin à votre image." },
  { icon: Brush, title: "Rénovation de piscine", desc: "Réfection d'étanchéité, changement de liner, remise à neuf des margelles et de la plage. Redonnez vie à votre bassin." },
  { icon: Sparkles, title: "Aménagement extérieur", desc: "Plage immergée, terrasse bois, éclairage LED, pool house. Un espace baignade harmonieux et pensé pour durer." },
  { icon: Shield, title: "Sécurité & traitement", desc: "Barrières, volets, alarmes aux normes NF P90. Filtration, électrolyse au sel et régulation automatique du pH." },
  { icon: Paintbrush, title: "Entretien & hivernage", desc: "Contrat saisonnier, hivernage, remise en route, analyse et traitement de l'eau. Une piscine limpide sans souci." },
]
let SERVICES_DEMO = SERVICES_SOURCE;

// "Réalisations" and "Zone" were in the nav with nothing behind them.
const CHANTIERS = [
  { titre: "Piscine miroir 8×4", lieu: "Marcq-en-Barœul", an: "2025", note: "Débordement sur trois côtés, margelles pierre bleue, local technique enterré." },
  { titre: "Rénovation complète", lieu: "Bondues", an: "2025", note: "Liner remplacé, filtration repensée, plage bois exotique reprise à neuf." },
  { titre: "Couloir de nage 12×3", lieu: "Lambersart", an: "2024", note: "Nage à contre-courant, volet immergé, éclairage LED périmétrique." },
  { titre: "Bassin familial 7×3,5", lieu: "Wasquehal", an: "2024", note: "Escalier d'angle, plage immergée, abri télescopique bas." },
];

function ZONES_DEMO_LIVE() {
  return [
  { ville: (clientCity({ formData: fd }) ?? "Lille"), detail: "Métropole et première couronne" },
  { ville: "Roubaix · Tourcoing", detail: "Intervention sous 48 h" },
  { ville: "Villeneuve-d'Ascq", detail: "Entretien hebdomadaire possible" },
  { ville: "Armentières", detail: "Devis déplacement offert" },
  { ville: "Seclin · Douai", detail: "Sur rendez-vous" },
  { ville: "Béthune", detail: "Chantiers neufs uniquement" },
];
}
let ZONES_DEMO = ZONES_DEMO_LIVE();
let ZONES = ZONES_DEMO;

const COULEURS = [
  { name: "Bleu Lagon", hex: "#2a9db5", desc: "Liner clair" },
  { name: "Gris Perle", hex: "#9aa7ab", desc: "Élégance contemporaine" },
  { name: "Bleu Nuit", hex: "#22415e", desc: "Effet miroir & profondeur" },
  { name: "Sable", hex: "#d8c7a8", desc: "Ambiance lagon naturel" },
]


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function CouleursCOPiscinesPage() {
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
    clientServices(session)?.map((sv: any, i: number) => ({
      icon: SERVICE_ICONS[i % SERVICE_ICONS.length],
      title: sv.title ?? sv.name,
      desc: sv.description ?? sv.desc,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    clientReviews(session)?.map((r: any) => ({
      q: r.text ?? r.quote,
      n: r.name ?? r.author,
      l: r.location ?? r.context ?? "",
    })),
    [
      { q: "Notre piscine béton avec liner bleu lagon est une réussite totale. Conseils précieux sur les finitions, chantier propre, délais tenus. Bluffés.", n: "Amélie B.", l: (clientCity({ formData: fd }) ?? "Lille") + " (59)" },
      { q: "Rénovation complète : nouveau liner, margelles et filtration au sel. La piscine a retrouvé une seconde jeunesse. Rapport qualité-prix excellent.", n: "Paul & Martine G.", l: "Roubaix (59)" },
      { q: "Construction d'un couloir de nage avec plage immergée et éclairage LED. Résultat magnifique, livré dans les temps. Très pro et à l'écoute.", n: "Karim D.", l: "Tourcoing (59)" },
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
  sessionData = session;
  bp = session?.businessProfile;
  c = session?.generatedContent;
  ZONES_DEMO = ZONES_DEMO_LIVE();



  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], title: s.title })),
    SERVICES_SOURCE,
  );
  ZONES = resolveList(
    clientAreas(session)?.map((z, i) => ({ ...ZONES_DEMO[i % ZONES_DEMO.length], ville: z })),
    ZONES_DEMO,
  );
  bp = bpLocal;
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
    return () => window.removeEventListener("scroll", h)
  }, []);

return (
    <div className="bg-[#fefefe] text-[#1a1a2e] overflow-x-hidden" style={{ fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/97 backdrop-blur-xl py-3 shadow-sm border-b border-[var(--brand,#4d7c5f)]/10" : "bg-transparent py-7"}`}>
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
                <Paintbrush className="w-5 h-5 text-[var(--brand,#4d7c5f)]" />
                <span className={`font-bold ${scrolled ? "text-[#1a1a2e]" : "text-white"} text-base tracking-tight`}>{fd?.businessName ?? <>Couleurs <span className={scrolled ? "text-[var(--brand,#4d7c5f)]" : "text-[#a8d5ba]"}>&amp; Co</span></>}</span>
              </>
            )}
          </div>
          <div className={`hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] ${scrolled ? "text-[#1a1a2e]/35" : "text-white/70"}`}>
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#4d7c5f)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0320456789"}`} className={`hidden md:flex items-center gap-2 font-bold text-sm ${scrolled ? "text-[var(--brand,#4d7c5f)]" : "text-white"}`}>
              <Phone className="w-4 h-4" /> {fd?.phone ?? "03 20 45 67 89"}
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[var(--brand,#4d7c5f)] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3d6b50] transition-colors rounded-sm">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className={`w-5 h-5 ${scrolled ? "text-[#1a1a2e]" : "text-white"}`} /></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#1a1a2e] hover:text-[var(--brand,#4d7c5f)] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0320456789"}`} className="flex items-center gap-3 text-[var(--brand,#4d7c5f)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {fd?.phone ?? "03 20 45 67 89"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=85&w=2400"))} alt="Piscine sur-mesure" fill className="object-cover" priority style={{ filter: "brightness(0.55)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/55 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 text-white">{<>{clientHeroLine(sessionData, 0, 3, 10) ?? "La piscine"}<br />{clientHeroLine(sessionData, 1, 3, 10) ?? "qui change"}{" "}<span className="text-[#7db88f]">{clientHeroLine(sessionData, 2, 3, 10) ?? "tout."}</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
            Construction, rénovation, sécurité et entretien de piscines. Pisciniste qualifié, conseils personnalisés sur les finitions, chantiers soignés. Devis gratuit sous 48h.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[var(--brand,#4d7c5f)] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#3d6b50] transition-colors rounded-sm">
              Devis gratuit sous 24h
            </button>
            <a href={`tel:${fd?.phone ?? "0320456789"}`} className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7db88f]/50 hover:text-[#7db88f] transition-all">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "03 20 45 67 89"}
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#4d7c5f)]/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-[#e8e8e4]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "14 ans", l: "D'expérience" },
            { v: "600+", l: "Chantiers réalisés" },
            { v: "4.9★", l: "Avis Google" },
            { v: "5 ans", l: "Garantie travaux" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-[var(--brand,#4d7c5f)] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a2e]/40">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#4d7c5f)] mb-4">Nos prestations</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a2e]">{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Ce qu'on <span className="text-[var(--brand,#4d7c5f)]">maîtrise.</span></>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 border border-[#e8e8e4] hover:border-[var(--brand,#4d7c5f)]/30 hover:shadow-lg transition-all duration-500">
                  <div className="w-11 h-11 bg-[var(--brand,#4d7c5f)]/8 flex items-center justify-center mb-6 group-hover:bg-[var(--brand,#4d7c5f)] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[var(--brand,#4d7c5f)] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] mb-3 group-hover:text-[var(--brand,#4d7c5f)] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#1a1a2e]/45 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PALETTE TENDANCES ── */}
      <section id="couleurs" className="py-20 bg-[#f5f5f0]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#4d7c5f)] mb-4">Palette 2025-2026</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">{/* TEXTE_SECTION */ clientText(sessionData, "couleurs.titre") ?? (<>Finitions <span className="text-[var(--brand,#4d7c5f)]">& teintes.</span></>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COULEURS.map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group cursor-default">
                  <div className="aspect-square rounded-lg mb-3 transition-transform duration-500 group-hover:scale-105" style={{ background: c.hex }} />
                  <div className="font-bold text-[#1a1a2e] text-sm mb-0.5">{c.name}</div>
                  <div className="text-[10px] text-[#1a1a2e]/40">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-8 text-sm text-[#1a1a2e]/40 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>{c?.aboutText ?? <>
              Nous proposons un service de conseil couleur gratuit. Apportez vos photos, votre mobilier, vos envies — on trouve ensemble la teinte parfaite.
            </>}</p>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      {/* ── RÉALISATIONS ── */}
      <section id="realisations" className="py-28 bg-[#f5f5f0]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#4d7c5f)] mb-4">Nos chantiers</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>Ce que nous avons <span className="text-[var(--brand,#4d7c5f)]">construit.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHANTIERS.map((c, i) => (
              <Reveal key={c.titre} delay={i * 0.08}>
                <div className="p-8 bg-white border border-[#e8e8e4] hover:border-[var(--brand,#4d7c5f)]/25 transition-colors h-full">
                  <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{c.titre}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--brand,#4d7c5f)]">{c.an}</span>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a2e]/35 mb-4">
                    <MapPin className="w-3 h-3 inline mr-1" />{c.lieu}
                  </div>
                  <p className="text-sm text-[#1a1a2e]/50 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE ── */}
      <section id="zone" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#4d7c5f)] mb-4">Zone d’intervention</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">{/* TEXTE_SECTION */ clientText(sessionData, "zone.titre") ?? (<>Où nous <span className="text-[var(--brand,#4d7c5f)]">nous déplaçons.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8e4] border border-[#e8e8e4]">
            {ZONES.map((z, i) => (
              <Reveal key={z.ville} delay={i * 0.05}>
                <div className="bg-white p-7 h-full">
                  <div className="font-bold text-[#1a1a2e] mb-2">{z.ville}</div>
                  <p className="text-sm text-[#1a1a2e]/45" style={{ fontFamily: "'Nunito', sans-serif" }}>{z.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="avis" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#4d7c5f)] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1a1a2e]">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ils adorent <span className="text-[var(--brand,#4d7c5f)]">le résultat.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVIS.map((t: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#e8e8e4] hover:border-[var(--brand,#4d7c5f)]/25 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#4d7c5f)] text-[var(--brand,#4d7c5f)]" />)}
                  </div>
                  <p className="text-[#1a1a2e]/45 text-sm leading-relaxed italic flex-1" style={{ fontFamily: "'Nunito', sans-serif" }}>{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8e8e4]">
                    <div className="font-bold text-[#1a1a2e] text-sm">{t.n}</div>
                    {t.l && <div className="text-[10px] text-[var(--brand,#4d7c5f)] mt-1"><MapPin className="w-3 h-3 inline mr-1" />{t.l}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-28 bg-[var(--brand,#4d7c5f)] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-6">Votre projet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Une pièce à<br />transformer ?</>)}</h2>
            <p className="text-white/60 mb-10 text-sm leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>Devis gratuit sous 24h · Conseil couleur inclus · Travaux garantis 5 ans</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[var(--brand,#4d7c5f)] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f0f7f3] transition-colors">
                Demander un devis
              </button>
              <a href={`tel:${fd?.phone ?? "0320456789"}`} className="flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "03 20 45 67 89"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a2e] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Paintbrush className="w-5 h-5 text-[var(--brand,#4d7c5f)]" /><span className="font-bold text-white text-sm">{fd?.businessName ?? "Couleurs & Co Piscines"}</span></div>
            <p className="text-white/25 text-sm leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>Pisciniste qualifié · Nord & Pas-de-Calais. Construction, rénovation et entretien de piscines depuis 2010.</p>
          </div>
          {[
            { t: "Services", ls: ["Construction sur-mesure", "Revêtement & finitions", "Rénovation de bassin", "Aménagement extérieur", "Entretien & hivernage"] },
            { t: "Infos", ls: ["Qui sommes-nous", "Nos réalisations", "Zone d'intervention", "Avis clients", "Conseils piscine"] },
            { t: "Contact", ls: [(fd?.phone ?? "03 20 45 67 89"), (fd?.email ?? "contact@couleurs-co.fr"), (clientCity({ formData: fd }) ?? "Lille") + " Métropole", "Lundi-Vendredi 8h-18h", "Devis gratuit 24h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#4d7c5f)] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 {fd?.businessName ?? "Couleurs & Co Piscines"}{clientSiret(sessionData) ? ` · SIRET ${clientSiret(sessionData)}` : clientName(sessionData) ? "" : " · SIRET 678 901 234 00056"} · Garantie Décennale · Artisan pisciniste{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
          <span className="text-[var(--brand,#4d7c5f)]/40">Pisciniste qualifié · Nord-Pas-de-Calais</span>
        </div>
      </footer>
    </div>
  )
}
