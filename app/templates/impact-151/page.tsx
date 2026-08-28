"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView, 
  useSpring 
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  GlassWater, Map, Wind, Sun, 
  ArrowRight, Menu, X, Plus, 
  Maximize2, Share2, Download, ExternalLink, 
  Archive, Search, Clock, Hash, 
  Layers, Frame, Droplets, Landmark,
  Award, Star, ShieldCheck, Thermometer,
  CloudRain, MapPin, ChevronRight, Play,
  Lock, Key, BookOpen, PenTool
} from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DWELL, LineMask, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2"
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import {
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
  clientWorks,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* ==========================================================================
   THE AETHELGARD DATASET (PREMIUM DENSITY)
   ========================================================================== */

function VINTAGES_DEMO_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ name: o.title, type: o.detail || undefined, ...(o.imageUrl ? { image: o.imageUrl } : {}) })), [
  {
    id: "v-2022",
    name: "Sillage",
    type: "Bague or jaune & saphir",
    notes: ["Or 750", "Saphir de Ceylan", "Serti grain"],
    score: "pièce unique",
    stock: "À l'atelier",
    image: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=1200&auto=format&fit=crop")
  },
  {
    id: "v-2024",
    name: "Lune Blanche",
    type: "Collier or blanc & diamants",
    notes: ["Or blanc", "Diamants tracés", "Maille forçat"],
    score: "sur commande",
    stock: "Sur commande",
    image: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=1200&auto=format&fit=crop")
  },
  {
    id: "s-spirit",
    name: "Calibre 12",
    type: "Montre d'atelier, remontage manuel",
    notes: ["Réserve 48 h", "Verre saphir", "Numérotée"],
    score: "série de 12",
    stock: "En vitrine",
    image: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=1200&auto=format&fit=crop")
  }
]);
}
let VINTAGES_DEMO = VINTAGES_DEMO_LIVE();

const TERROIR_DATA_SOURCE = [
  { label: "Établis à l'atelier", value: "4", icon: <Layers className="w-4 h-4" /> },
  { label: "Titre de l'or", value: "750 ‰ poinçonné", icon: <Award className="w-4 h-4" /> },
  { label: "Marche des montres", value: "±2 s/jour", icon: <Clock className="w-4 h-4" /> },
  { label: "Pierres", value: "Tracées, certifiées", icon: <ShieldCheck className="w-4 h-4" /> }
]
let TERROIR_DATA = TERROIR_DATA_SOURCE;

/* ==========================================================================
   ANIMATION COMPONENTS
   ========================================================================== */

function Reveal({ children, delay = 0, y = 50 }: { children: React.ReactNode, delay?: number, y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ subtitle, title, alignment = "center" }: { subtitle: string, title: React.ReactNode, alignment?: "center" | "left" }) {
  return (
    <div className={`mb-32 ${alignment === "center" ? "text-center" : "text-left"}`}>
       <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--brand,#c4a661)] mb-8 block italic underline underline-offset-8">
             {subtitle}
          </span>
          <h2 className="text-6xl md:text-8xl font-light italic leading-none tracking-tighter uppercase text-white" style={{ fontFamily: "serif" }}>
             {title}
          </h2>
       </Reveal>
    </div>
  )
}

/* ==========================================================================
   THE AETHELGARD ESTATE - MAIN PAGE
   ========================================================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function AethelgardEstatePremium() {
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

  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  VINTAGES_DEMO = VINTAGES_DEMO_LIVE();
  TERROIR_DATA = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({ ...TERROIR_DATA_SOURCE[i % TERROIR_DATA_SOURCE.length], value: s.value, label: s.label })),
    TERROIR_DATA_SOURCE,
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [VINTAGES_DEMO];
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
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Product vintages ← client's business profile (falls back to demo).
  const VINTAGES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      id: `v-${i}`,
      name: s.title ?? s.name,
      type: s.description ?? VINTAGES_DEMO[i % VINTAGES_DEMO.length].type,
      notes: VINTAGES_DEMO[i % VINTAGES_DEMO.length].notes,
      score: s.price ?? VINTAGES_DEMO[i % VINTAGES_DEMO.length].score,
      stock: VINTAGES_DEMO[i % VINTAGES_DEMO.length].stock,
      image: VINTAGES_DEMO[i % VINTAGES_DEMO.length].image,
    })),
    VINTAGES_DEMO
  );

  const DEVISES = [
    { l1: "Le temps", l2: "se travaille." },
    { l1: "L'or", l2: "se souvient." },
    { l1: "La main", l2: "décide." },
  ];
  const { i: devise } = useSlides(DEVISES.length, DWELL.slow);

  const [activeVintage, setActiveVintage] = useState(0)
  const [memberPortal, setMemberPortal] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax & Transition Effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])
  const bgTransition = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], ["#0a0a0b", "#1a1614", "#2d1b1b", "#0a0a0b"])

return (
    <motion.div 
      ref={containerRef} 
      style={{ backgroundColor: bgTransition }}
      className="text-[#f8f9fa] font-sans selection:bg-[var(--brand,#c4a661)] selection:text-white min-h-dvh overflow-x-hidden transition-colors duration-1000"
    >
      
      {/* ==========================================
          DYNAMIC OVERLAY NAVIGATION
          ========================================== */}
      <nav className="fixed top-0 left-0 w-full h-24 z-[100] px-8 md:px-20 flex items-center justify-between pointer-events-none">
         <div className="pointer-events-auto">
            <Link href="#hero" className="flex flex-col group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
               <span className="text-3xl font-light tracking-[0.4em] uppercase text-white group-hover:text-[var(--brand,#c4a661)] transition-colors">{fd?.businessName ?? clientName(sessionData) ?? "CHRONOS LAB"}</span>
               <span className="text-[10px] font-black tracking-[0.6em] text-[var(--brand,#c4a661)]/40 uppercase italic">{clientTrade(sessionData) ?? "Horlogerie & joaillerie d'atelier"}</span>
            </>
            )}</Link>
         </div>

         <div className="flex items-center gap-3 sm:gap-6 lg:gap-12 pointer-events-auto">
            <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
               <Link href="#terroir" className="hover:text-white transition-colors">La matière</Link>
               <Link href="#cellar" className="hover:text-white transition-colors">Les pièces</Link>
               <Link href="#alchemist" className="hover:text-white transition-colors">L'établi</Link>
               <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <Sheet>
              <SheetTrigger className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[var(--brand,#c4a661)] hover:text-white transition-all shadow-xl bg-black/40 backdrop-blur-xl shrink-0">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0a0b] border-white/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {[["La matière", "#terroir"], ["Les pièces", "#cellar"], ["L'établi", "#alchemist"], ["Contact", "#contact"]].map(([label, href]) => (
                    <Link key={href} href={href} className="text-2xl font-light uppercase tracking-widest text-white hover:text-[var(--brand,#c4a661)] transition-colors">{label}</Link>
                  ))}
                  <Link href="#circle" className="mt-4 px-8 py-4 bg-[var(--brand,#c4a661)] text-black text-center text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                    Rejoindre le cercle
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <button
              onClick={() => setMemberPortal(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[var(--brand,#c4a661)] hover:text-white transition-all shadow-xl bg-black/40 backdrop-blur-xl shrink-0"
              aria-label="Member portal"
            >
               <Menu className="w-5 h-5" />
            </button>
         </div>
      </nav>

      <main>
        {/* ==========================================
            1. THE PROLOGUE (HERO)
            ========================================== */}
        <section id="hero" className="relative h-dvh flex items-center justify-center overflow-hidden pt-24 md:pt-0">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
             <Image 
                src={photo(3, "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2400&auto=format&fit=crop")} 
                alt="L'atelier au petit matin" 
                fill 
                className="object-cover opacity-30 grayscale"
                priority
             />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0b_100%)]" />
          </motion.div>

          <div className="relative z-10 text-center max-w-6xl px-8">
             <Reveal>
                <h1 className="text-7xl md:text-[13vw] font-light italic leading-[0.84] tracking-tighter uppercase mb-16" style={{ fontFamily: "serif" }}>
                  <LineMask lines={[clientHeroLine(sessionData, 0, 2, 14) ?? DEVISES[devise].l1]} index={clientHeroLine(sessionData, 0, 2, 14) ? "client" : devise} />
                  <span className="not-italic font-black text-[var(--brand,#c4a661)]/60 block">
                    <LineMask lines={[clientHeroLine(sessionData, 1, 2, 14) ?? DEVISES[devise].l2]} index={clientHeroLine(sessionData, 1, 2, 14) ? "client" : devise} />
                  </span>
                </h1>
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32">
                   <div className="flex flex-col items-center">
                      <span className="text-4xl font-light tracking-tighter">1987</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">La fondation</span>
                   </div>
                   <div className="w-px h-16 bg-white/10 hidden md:block" />
                   <p className="max-w-xs text-xs text-white/40 leading-loose uppercase tracking-widest font-light italic">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                      Dans le silence de l'atelier, chaque pièce s'écrit à la main — l'or, la pierre et le temps.
                   </>}</p>
                   <div className="w-px h-16 bg-white/10 hidden md:block" />
                   <div className="flex flex-col items-center">
                      <span className="text-4xl font-light tracking-tighter">750 ‰</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Poinçon garanti</span>
                   </div>
                </div>
             </Reveal>
          </div>
        </section>

        {/* ==========================================
            2. THE TERROIR (TECHNICAL DENSITY)
            ========================================== */}
        <section id="terroir" className="py-60 relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre I // La matière" title={/* TEXTE_SECTION */ clientText(sessionData, "matiere.titre") ?? (<>Ce qui entre à l'atelier.</>)} alignment="left" />
              
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
                    {TERROIR_DATA.map((data, i) => (
                      <Reveal key={i} delay={i * 0.1}>
                         <div className="bg-black/20 backdrop-blur-3xl p-12 hover:bg-[var(--brand,#c4a661)] hover:text-black transition-all group">
                            <div className="mb-8 opacity-40 group-hover:opacity-100">{data.icon}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 mb-2">{data.label}</div>
                            <div className="text-3xl font-light tracking-tighter">{data.value}</div>
                         </div>
                      </Reveal>
                    ))}
                 </div>

                 <div className="space-y-12">
                    <Reveal delay={0.3}>
                       <p className="text-2xl font-light text-white/60 leading-relaxed italic">{/* TEXTE_SECTION */ clientText(sessionData, "matiere.texte") ?? c?.aboutText ?? <>
                          « L'or est fondu et allié ici, les pierres arrivent tracées et certifiées : la matière décide, la main dispose. »
                       </>}</p>
                       <div className="h-px w-32 bg-[var(--brand,#c4a661)] my-12" />
                       <div className="space-y-8">
                          {[
                            { t: "La fonte à l'atelier", d: "L'or est refondu au creuset, allié et laminé sur place — rien ne part en sous-traitance." },
                            { t: "La traçabilité", d: "Or recyclé et pierres certifiées d'origine, factures et certificats remis avec chaque pièce." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-8 group">
                               <span className="text-[10px] font-black text-[var(--brand,#c4a661)]">0{i+1}</span>
                               <div>
                                  <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">{item.t}</h4>
                                  <p className="text-xs text-white/20 uppercase tracking-widest font-bold leading-relaxed">{item.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            3. THE CELLAR (PRODUCT MATRIX)
            ========================================== */}
        <section id="cellar" className="py-60 bg-black/20 border-y border-white/5">
           <div className="max-w-[1600px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre II // La vitrine" title={/* TEXTE_SECTION */ clientText(sessionData, "pieces.titre") ?? (<>Les pièces d'atelier.</>)} />

              <div className="grid md:grid-cols-3 gap-12">
                 {VINTAGES.map((vin, i) => (
                   <Reveal key={vin.id} delay={i * 0.1}>
                      <div className="group relative bg-white/5 border border-white/5 p-12 overflow-hidden hover:border-[var(--brand,#c4a661)]/50 transition-all duration-700 cursor-pointer">
                         <div className="absolute top-0 right-0 p-40 bg-[var(--brand,#c4a661)] opacity-0 group-hover:opacity-[0.03] blur-[100px] rounded-full transition-opacity" />
                         
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden">
                            <Image 
                               src={vin.image} 
                               alt={vin.name} 
                               fill 
                               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                         </div>

                         <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                               <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[var(--brand,#c4a661)] transition-colors">{vin.name}</h3>
                               <span className="text-[10px] font-black text-[var(--brand,#c4a661)]">{vin.score}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-8">
                               {vin.notes.map(note => (
                                 <span key={note} className="text-[10px] font-black uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1">{note}</span>
                               ))}
                            </div>
                            <div className="flex justify-between items-end border-t border-white/10 pt-8">
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{vin.type}</span>
                               <button className="text-[10px] font-black uppercase tracking-widest text-[var(--brand,#c4a661)] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                  Découvrir <ChevronRight className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            4. THE ALCHEMIST (DISTILLATION STORY)
            ========================================== */}
        <section id="alchemist" className="py-60">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="order-2 lg:order-1">
                    <Reveal>
                       <SectionTitle subtitle="Chapitre III // L'établi" title={/* TEXTE_SECTION */ clientText(sessionData, "etabli.titre") ?? (<>Cent heures par pièce.</>)} alignment="left" />
                       <p className="text-xl font-light text-white/40 leading-relaxed italic mb-16 uppercase tracking-widest">{/* TEXTE_SECTION */ clientText(sessionData, "alchemist.texte") ?? (<>
                          Le temps n'est pas un ennemi, c'est notre principal outil. Chaque pièce naît d'un dessin, d'une fonte et de cent heures d'établi — l'essence même de la patience.
                       </>)}</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {[
                            { label: "La fonte", value: "Creuset à induction" },
                            { label: "Le serti", value: "Grain, griffe, clos" },
                            { label: "La finition", value: "Poli miroir à la main" },
                            { label: "Le contrôle", value: "Binoculaire ×10" }
                          ].map((stat, i) => (
                            <div key={i} className="border-b border-white/10 pb-6">
                               <div className="text-[10px] font-black text-[var(--brand,#c4a661)] uppercase tracking-[0.4em] mb-2">{stat.label}</div>
                               <div className="text-xl font-light text-white italic">{stat.value}</div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <div className="order-1 lg:order-2 relative aspect-square">
                    <Reveal delay={0.3}>
                       <Image 
                          src={photo(4, "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=1200&auto=format&fit=crop")} 
                          alt="L'établi du sertisseur" 
                          fill 
                          className="object-cover grayscale"
                       />
                       <div className="absolute inset-0 border-[30px] border-black/20" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-20 h-20 text-[var(--brand,#c4a661)] opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            4bis. LES VOIX (AVIS) — le chapitre que l'atelier
            n'écrit pas lui-même
            ========================================== */}
        <section className="py-60 bg-black relative">
           <div className="max-w-[1200px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre IV // Les voix" title={/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce qu'on en dit.</>)} alignment="left" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20 -mt-12">
                 {resolveList(
                   clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
                   [
                     { text: "Une montre reprise, réglée, rendue avec son carnet de mesures. Personne d'autre n'y touchera.", author: "H. Delcourt", detail: "révision d'un calibre ancien" },
                     { text: "Du premier dessin à l'écrin, la bague a été pensée pour elle seule. Le sur mesure au sens propre.", author: "M. et A. Ferrand", detail: "création sur mesure" },
                     { text: "L'atelier explique chaque geste, chaque heure passée. On sait ce qu'on paie, et pourquoi.", author: "S. Baron", detail: "transformation d'un héritage" },
                   ],
                 ).map((a: any, i: number) => (
                   <Reveal key={i} delay={i * 0.12}>
                     <figure className="h-full flex flex-col border-l border-[var(--brand,#c4a661)]/30 pl-8">
                        <blockquote className="text-xl font-light italic text-white/60 leading-relaxed mb-10 flex-1">« {a.text} »</blockquote>
                        <figcaption className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25">
                           {a.author}{a.detail ? <span className="block mt-2 text-[var(--brand,#c4a661)]/60 normal-case tracking-widest italic font-light">{a.detail}</span> : null}
                        </figcaption>
                     </figure>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            5. THE CIRCLE (MEMBERSHIP)
            ========================================== */}
        <section id="circle" className="py-60 bg-white text-black relative">
           <div className="max-w-[1200px] mx-auto px-8 md:px-20 text-center">
              <Reveal>
                 <SectionTitle subtitle="Privilège // Adhésion" title={/* TEXTE_SECTION */ clientText(sessionData, "cercle.titre") ?? (<>Rejoindre le cercle.</>)} />
                 <p className="max-w-2xl mx-auto text-xl font-light text-black/40 leading-relaxed italic mb-20">{/* TEXTE_SECTION */ clientText(sessionData, "circle.texte") ?? (<>
                    Accédez aux pièces uniques avant leur mise en vitrine, aux essayages privés à l'atelier et au service sur mesure — du premier dessin à l'écrin.
                 </>)}</p>
                 
                 <form className="max-w-xl mx-auto space-y-12" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Nom</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Moreau" />
                       </div>
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Ville</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Bordeaux" />
                       </div>
                    </div>
                    <div className="border-b border-black/10 py-4 text-left">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Courriel</label>
                       <input type="email" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="vous@mail.fr" />
                    </div>
                    <button className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--brand,#c4a661)] transition-all shadow-2xl">
                       Demander une invitation
                    </button>
                 </form>
              </Reveal>
           </div>
        </section>

        {/* ==========================================
            6. MEGA FOOTER
            ========================================== */}
        <footer id="contact" className="bg-black pt-60 pb-12 px-8 md:px-20 relative z-50 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-[var(--brand,#c4a661)] flex items-center justify-center rounded-sm">
                       <Landmark className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-3xl font-light tracking-[0.4em] uppercase">{fd?.businessName ?? clientName(sessionData) ?? "CHRONOS LAB"}</span>
                 </div>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-10 italic">
                    « Le temps n'est pas un luxe, c'est notre matière première. »
                 </p>
                 {/* Le contact que ce thème n'avait pas : l'atelier se joint. */}
                 <div className="space-y-4 mb-12 text-[11px] tracking-widest text-white/40 normal-case not-italic">
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[var(--brand,#c4a661)]" /> {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "33000", "Bordeaux") + " — atelier sur rendez-vous"}</div>
                    <a href={`tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33556000000").replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white transition-colors"><Clock className="w-4 h-4 text-[var(--brand,#c4a661)]" /> {clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "05 56 00 00 00"} · mar–sam 10h–19h</a>
                    <a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "atelier@chronos-lab.fr"}`} className="flex items-center gap-3 hover:text-white transition-colors"><PenTool className="w-4 h-4 text-[var(--brand,#c4a661)]" /> {clientEmail(sessionData) ?? fd?.email ?? "atelier@chronos-lab.fr"}</a>
                 </div>
              </div>

              {[
                { t: "LA MAISON", l: ["La matière", "Les pièces", "L'établi", "Le cercle"] },
                { t: "SERVICES", l: ["Sur mesure", "Réparations", "Gravure", "Expertise"] },
                { t: "PRATIQUE", l: ["Livraison assurée", "Retours", "CGV", "Contact"] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                   <h4 className="text-[10px] font-black text-[var(--brand,#c4a661)] uppercase tracking-[0.5em] italic">{col.t}</h4>
                   <ul className="flex flex-col gap-6">
                      {col.l.map(link => (
                         <li key={link} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic">{link}</li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic">
              <span>© 2026 {fd?.businessName ?? clientName(sessionData) ?? "Chronos Lab"}{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
              <div className="flex gap-8 normal-case tracking-normal not-italic">
                 <span>Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
                 <span>Éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
              </div>
           </div>
        </footer>
      </main>

      {/* MEMBER PORTAL OVERLAY */}
      <AnimatePresence>
        {memberPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-2xl w-full border border-white/10 p-16 relative bg-[#1a1614]">
                <button onClick={() => setMemberPortal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                </button>
                <div className="flex flex-col items-center gap-12">
                   <SectionTitle subtitle="Espace privé" title="Le portail." />
                   <div className="w-full space-y-8">
                      <div className="border-b border-white/10 pb-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block mb-2">Identifiant</label>
                         <input type="text" className="w-full bg-transparent outline-none text-2xl font-light italic text-white" placeholder="AE-7402-X" />
                      </div>
                      <button className="w-full py-6 bg-[var(--brand,#c4a661)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                         Valider l'accès
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
