"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, Sun, Trees, Flower, Phone, Star, MapPin, Clock, CheckCircle, Scissors, Sprout, Droplets, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientSiret,
  clientAreas,
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   JARDINS VIVANTS — {clientTrade(sessionData) ?? "Paysagiste"} & entretien espaces verts ({clientCity({ formData: fd }) ?? "Annecy"})
   Palette : blanc naturel #fafaf7 / vert profond #2d5a27 / vert clair #a8d5a0 / terre #6b4226
   Fonts : Cardo (titres serif organique) + Source Sans 3
   Style : vivant, naturel, organique, expertise végétale
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
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
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

// Demo content — real data (businessProfile) replaces this wholesale via
// resolveList when the client provided it; each field access below falls
// back with `??` so the same JSX renders either shape.
// Explicit anchors: the slug generator gave "#zone" no target and the ids
// sat on the wrong blocks (#realisations was on the closing CTA).
const NAV = [
  { l: "Prestations", h: "#prestations" },
  { l: "Réalisations", h: "#realisations" },
  { l: "Devis", h: "#devis" },
  { l: "Zone", h: "#zone" },
  { l: "Contact", h: "#contact" },
];

const DEVIS_ETAPES = [
  { t: "Visite sur le terrain", d: "Gratuite et sans engagement, sous huit jours. On regarde l'exposition, la nature du sol et l'accès aux engins." },
  { t: "Plan et chiffrage", d: "Croquis coté, liste des végétaux avec leur nom latin, prix détaillé poste par poste. Rendu sous deux semaines." },
  { t: "Deux allers-retours inclus", d: "Vous ajustez, on redessine. Sans supplément, jusqu'à ce que le projet corresponde à ce que vous voulez." },
  { t: "Planning ferme", d: "Date de début, durée, et ce qui reste à votre charge (arrosage, évacuation). Écrit avant la signature." },
];

function ZONES_DEMO_LIVE() {
  return [
  { v: (clientCity({ formData: fd }) ?? "Annecy"), d: "Et communes du lac : Veyrier, Menthon, Talloires, Sévrier" },
  { v: (clientCity({ formData: fd }) ?? "Annecy") + "-le-Vieux · Cran-Gevrier", d: "Entretien hebdomadaire et création" },
  { v: "La Roche-sur-Foron", d: "Création et élagage, sur planning" },
  { v: "Rumilly · Alby", d: "Déplacement compris dans le devis" },
  { v: "Thônes · Vallée de Manigod", d: "Terrains en pente, accès étudié au cas par cas" },
  { v: "Genève et Pays de Gex", d: "Sur étude, à partir de 3 jours de chantier" },
];
}
let ZONES_DEMO = ZONES_DEMO_LIVE();;
let ZONES = ZONES_DEMO;

const PRESTATIONS_SOURCE = [
  { icon: Flower, title: "Création jardin", desc: "Étude, plan 3D, terrassement, plantations, dallage, éclairage, arrosage automatique. Conception sur mesure de A à Z, du 10m² au 2 hectares." },
  { icon: Scissors, title: "Entretien régulier", desc: "Tonte, taille des haies et arbustes, désherbage, arrosage. Passage hebdomadaire, bihebdomadaire ou mensuel selon saison et superficie." },
  { icon: Trees, title: "Élagage & abattage", desc: "Élagage raisonné, recépage, abattage contrôlé de grands arbres. Matériel nacelle jusqu'à 28m. Broyage et évacuation des déchets végétaux." },
  { icon: Sprout, title: "Potager & verger", desc: "Création et entretien potager surélevé, verger, haie fruitière. Choix variétés adaptées au climat alpin, récoltes abondantes garanties." },
  { icon: Droplets, title: "Arrosage automatique", desc: "Études, installation et maintenance. Goutte-à-goutte, asperseurs, drip line, commande connectée. Économie d'eau jusqu'à 60% vs arrosage manuel." },
  { icon: Sun, title: "Massifs & vivaces", desc: "Composition massifs 4 saisons, rocailles, prairie fleurie, plantes locales et résistantes. Entretien minimal garanti, floraison continue d'avril à octobre." },
]
let PRESTATIONS_DEMO = PRESTATIONS_SOURCE;

function TEMOIGNAGES_DEMO_LIVE() {
  return [
  { q: "Notre terrain en friche transformé en jardin à la française en 3 semaines. Plan proposé en 48h, devis clair, exécution irréprochable. On est bluffés.", n: "Marie-Claire & Paul G.", l: (clientCity({ formData: fd }) ?? "Annecy") + "-le-Vieux" },
  { q: "Élagage d'un grand chêne de 20m de haut réalisé en sécurité totale. Pas une fleur touchée dans le jardin. Équipe pro, rapide, nettoyage parfait.", n: "Hervé T.", l: "Thônes (74)" },
  { q: "Suivi entretien mensuel depuis 2 ans. Le jardin est toujours magnifique, même en mon absence. Ponctualité parfaite, conseils précieux sur les plantations.", n: "Charlotte S.", l: "Megève (74)" },
];
}
let TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function JardinsVivantsPage() {
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

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  sessionData = session;
  c = session?.generatedContent;
  TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();
  ZONES_DEMO = ZONES_DEMO_LIVE();



  PRESTATIONS_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...PRESTATIONS_SOURCE[i % PRESTATIONS_SOURCE.length], title: s.title })),
    PRESTATIONS_SOURCE,
  );
  ZONES = resolveList(
    clientAreas(session)?.map((z, i) => ({ ...ZONES_DEMO[i % ZONES_DEMO.length], v: z })),
    ZONES_DEMO,
  );
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

  // Real business data (resolveList) replaces demo content wholesale when
  // present — see the DEMO consts above for the shape each section falls
  // back to. Field access in JSX uses `??` chains so both shapes render.
  // Note: businessProfile is a sibling of formData on SessionData, not
  // nested inside it — read from `session`, not `fd`.
  const bp = session?.businessProfile;
  const prestations = resolveList(clientServices(session), PRESTATIONS_DEMO);
  const temoignages = resolveList(clientReviews(session)?.map((r: any) => ({ q: r.text, n: r.author, l: r.detail })), TEMOIGNAGES_DEMO);

  return (
    <div className="bg-[#fafaf7] text-[#1e2a1c] overflow-x-hidden" style={{ fontFamily: "'Source Sans 3', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#fafaf7]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[var(--brand,#2d5a27)]/10" : "bg-transparent py-7"}`}>
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
                <Leaf className="w-5 h-5 text-[var(--brand,#2d5a27)]" />
                <div>
                  <div className="font-bold text-[#1e2a1c] text-sm leading-tight" style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)",  fontFamily: "'Cardo', Georgia, serif" }}>{clientName({ formData: fd }) ?? "Jardins Vivants"}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#2d5a27)]/50">{clientTrade(sessionData) ?? "Paysagiste"} · {clientCity({ formData: fd }) ?? "Annecy"}</div>
                </div>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1e2a1c]/30">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#2d5a27)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0450123456"}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#2d5a27)] font-bold text-sm">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "04 50 12 34 56"}
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[var(--brand,#2d5a27)] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1f3e1b] transition-colors rounded-lg">
              Devis gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#fafaf7] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#1e2a1c] hover:text-[var(--brand,#2d5a27)] transition-colors" style={{ fontFamily: "'Cardo', serif" }}>{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0450123456"}`} className="flex items-center gap-3 text-[var(--brand,#2d5a27)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {fd?.phone ?? "04 50 12 34 56"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=88&w=2400"))} alt="Jardin paysagé luxuriant" fill className="object-cover object-center" priority style={{ filter: "brightness(0.38)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101a0e] via-[#101a0e]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101a0e]/70 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[#a8d5a0]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#a8d5a0]">{clientTrade(sessionData) ?? "Paysagiste"} & espaces verts · {clientCity({ formData: fd }) ?? "Annecy"} & Haute-Savoie</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-8 text-white" style={{ fontFamily: "'Cardo', Georgia, serif" }}>{<>{clientHeroLine(sessionData, 0, 2, 15) ?? "Un jardin qui"}<br /><span className="text-[#a8d5a0] italic">{clientHeroLine(sessionData, 1, 2, 15) ?? "vous ressemble."}</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-md text-sm text-white/33 leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
            Création et entretien de jardins en Haute-Savoie. Paysagiste qualifié, 100% local, devis gratuit sous 48h. De la terrasse au grand parc — chaque espace mérite de vivre.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4 mb-8">
            <button className="px-9 py-4 bg-[var(--brand,#2d5a27)] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#1f3e1b] transition-colors rounded-lg">{c?.ctaText ?? <>
              Devis gratuit 48h
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0450123456"}`} className="flex items-center gap-3 px-9 py-4 border border-white/12 text-white/45 font-bold text-[10px] uppercase tracking-widest hover:border-[#a8d5a0]/40 hover:text-[#a8d5a0] transition-all rounded-lg">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "04 50 12 34 56"}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-6">
            {/* LISTE_LIBELLES */ (clientList(sessionData, "hero.liste1") ?? ["Création & entretien", "Élagage certifié", "Arrosage automatique"]).map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--brand,#2d5a27)]" />
                <span className="text-[10px] font-bold text-white/28 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#2d5a27)]/70 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-[#e8f5e5]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "19 ans", l: "D'expertise végétale" },
            { v: "850+", l: "Jardins créés" },
            { v: "4.9★", l: "Note Google" },
            { v: "70+", l: "Communes d'intervention" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-5 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-[var(--brand,#2d5a27)] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e2a1c]/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section id="prestations" className="py-28 bg-[#fafaf7]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#2d5a27)] mb-4">Ce qu'on sait faire</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e2a1c]" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>
                De la graine<br /><span className="text-[var(--brand,#2d5a27)] italic">au paradis vert.</span>
              </>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {prestations.map((p: any, i: number) => (
              <Reveal key={p.title ?? p.name ?? i} delay={i * 0.07}>
                <div className="group p-8 bg-white rounded-xl border border-[#e8f5e5] hover:border-[var(--brand,#2d5a27)]/25 hover:shadow-lg hover:shadow-[var(--brand,#2d5a27)]/5 transition-all duration-500 h-full">
                  {p.icon && (
                    <div className="w-10 h-10 bg-[#e8f5e5] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[var(--brand,#2d5a27)] transition-colors duration-500">
                      <p.icon className="w-5 h-5 text-[var(--brand,#2d5a27)] group-hover:text-white transition-colors" />
                    </div>
                  )}
                  <h3 className="font-bold text-[#1e2a1c] mb-3 group-hover:text-[var(--brand,#2d5a27)] transition-colors" style={{ fontFamily: "'Cardo', serif" }}>{p.title ?? p.name}</h3>
                  <p className="text-sm text-[#1e2a1c]/40 leading-relaxed">{p.desc ?? p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section id="realisations" className="py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#2d5a27)] mb-4">Portfolio</div>
            <h2 className="text-4xl font-bold text-[#1e2a1c]" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>Nos <span className="text-[var(--brand,#2d5a27)] italic">créations.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 h-[65vh] min-h-[420px]">
            <div className="col-span-2 relative overflow-hidden rounded-xl"><ParallaxImg src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=1200"))} alt="Jardin créé" /></div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 relative overflow-hidden rounded-xl"><ParallaxImg src={photo(2, (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1500993855538-c6a99f437aa7?auto=format&fit=crop&q=85&w=600"))} alt="Potager" /></div>
              <div className="flex-1 relative overflow-hidden rounded-xl"><ParallaxImg src={photo(3, (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=85&w=600"))} alt="Massif fleurs" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVIS ── */}
      <section id="devis" className="py-28 bg-[#f2f5ef]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#2d5a27)] mb-4">Devis</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e2a1c]" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "devis.titre") ?? (<>Comment on <span className="italic text-[var(--brand,#2d5a27)]">chiffre.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DEVIS_ETAPES.map((e, i) => (
              <Reveal key={e.t} delay={i * 0.07}>
                <div className="bg-white p-8 h-full">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#1e2a1c]/30 mb-3">Étape {i + 1}</div>
                  <div className="text-lg font-bold text-[#1e2a1c] mb-3" style={{ fontFamily: "'Cardo', serif" }}>{e.t}</div>
                  <p className="text-sm text-[#1e2a1c]/50 leading-relaxed">{e.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE ── */}
      <section id="zone" className="py-28 bg-[#1e2a1c] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#7cb342)] mb-4">Zone d'intervention</div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "zone.titre") ?? (<>Jusqu'où on <span className="italic text-[var(--brand,#7cb342)]">se déplace.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {ZONES.map((z, i) => (
              <Reveal key={z.v} delay={i * 0.05}>
                <div className="bg-[#1e2a1c] p-7 h-full">
                  <div className="font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Cardo', serif" }}>
                    <MapPin className="w-4 h-4 text-[var(--brand,#7cb342)]" />{z.v}
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">{z.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-28 bg-[#fafaf7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#2d5a27)] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1e2a1c]" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ils ont un <span className="text-[var(--brand,#2d5a27)] italic">jardin dont ils sont fiers.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {temoignages.map((t: any, i: number) => (
              <Reveal key={t.n ?? t.author ?? i} delay={i * 0.1}>
                <div className="p-8 bg-white rounded-xl border border-[#e8f5e5] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating ?? 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#2d5a27)] text-[var(--brand,#2d5a27)]" />)}
                  </div>
                  <p className="text-sm text-[#1e2a1c]/42 leading-relaxed italic flex-1">{`"${t.q ?? t.text}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8f5e5]">
                    <div className="font-bold text-[#1e2a1c] text-sm">{t.n ?? t.author}</div>
                    {(t.l ?? t.source) && (
                      <div className="text-[10px] text-[var(--brand,#2d5a27)] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l ?? t.source}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[var(--brand,#2d5a27)] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-6">Votre projet</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Cardo', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Et si votre jardin<br /><span className="italic">devenait vivant ?</span>
            </>)}</h2>
            <p className="text-white/50 mb-10 text-sm">Devis gratuit sous 48h · {clientCity({ formData: fd }) ?? "Annecy"} & Haute-Savoie · {clientTrade(sessionData) ?? "Paysagiste"} qualifié RGE</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[var(--brand,#2d5a27)] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f0f7f0] transition-colors rounded-lg shadow-lg">
                Demander un devis
              </button>
              <a href={`tel:${fd?.phone ?? "0450123456"}`} className="flex items-center gap-3 px-10 py-4 border border-white/25 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all rounded-lg">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "04 50 12 34 56"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#101a0e] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Leaf className="w-5 h-5 text-[var(--brand,#2d5a27)]" /><span className="font-bold text-white text-sm" style={{ fontFamily: "'Cardo', serif" }}>Jardins Vivants</span></div>
            <p className="text-white/20 text-sm leading-relaxed">{clientTrade(sessionData) ?? "Paysagiste"} & entretien espaces verts · Haute-Savoie. Création, entretien, élagage, arrosage automatique.</p>
          </div>
          {[
            { t: "Prestations", ls: ["Création jardin", "Entretien régulier", "Élagage & abattage", "Potager & verger", "Arrosage automatique"] },
            { t: "Infos", ls: ["Qui sommes-nous", "Portfolio réalisations", "Zone d'intervention", "Tarifs", "Blog jardinage"] },
            { t: "Contact", ls: [(fd?.phone ?? "04 50 12 34 56"), (fd?.email ?? "contact@jardins-vivants.fr"), (clientCity({ formData: fd }) ?? "Annecy") + " & Haute-Savoie", "Lun-Sam 7h30-18h", "Devis gratuit 48h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#2d5a27)]/60 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/20 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 {clientName(sessionData) ?? "Jardins Vivants"}{clientSiret(sessionData) ? ` · SIRET ${clientSiret(sessionData)}` : clientName(sessionData) ? "" : " · SIRET 456 789 012 00033"} · {clientTrade(sessionData) ?? "Paysagiste"} qualifié · {clientCity(sessionData) ?? "Annecy"} (74){/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
          <span className="text-[var(--brand,#2d5a27)]/25">{clientTrade(sessionData) ?? "Paysagiste"} · Haute-Savoie</span>
        </div>
      </footer>
    </div>
  )
}
