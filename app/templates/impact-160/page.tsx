"use client";
// @ts-nocheck
/*
  impact-160 — Maison V Lookbook · Rennes. Le data-center brutaliste devient
  la maison de mode qu'on vendait : même densité monochrome, mêmes filets,
  mais le registre des nœuds est désormais le vestiaire, les métriques
  l'atelier, la console un essayage privé.
  Geste : GhostSolid — la première ligne du titre en contour, la seconde
  pleine dans l'os ; le monolithe du héros reste un aplomb typographique.
  Fontes P6 Archivo + Inter · palette #0d0d0f / #e8e4da.
*/

import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Scissors, Ruler, Feather, ChevronRight,
  ArrowRight, ExternalLink, Phone, Mail, MapPin, Hash
} from "lucide-react"
import { GhostSolid } from "@/lib/templates/hero-kit-2";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { resolveList } from "@/lib/templates/resolveList";
import {
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
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ==========================================================================
   LE VESTIAIRE — la démonstration de la maison
   ========================================================================== */

const VESTIAIRE_DEMO = [
  {
    id: "ligne-vestiaire",
    name: "Le Vestiaire",
    matiere: "Laine froide & popeline",
    coupe: "Droite, épaule construite",
    serie: "Série de 40",
    prix: "180 — 520 €",
    desc: "Tailleur, chemise, pantalon : la base raisonnée qui se porte dix ans.",
    statut: "En boutique"
  },
  {
    id: "ligne-maille",
    name: "La Maille",
    matiere: "Mérinos & mohair français",
    coupe: "Ample, finitions main",
    serie: "Série de 25",
    prix: "120 — 340 €",
    desc: "Tricotée à plat, remaillée main — la pièce qui ne se déforme pas.",
    statut: "En boutique"
  },
  {
    id: "ligne-editions",
    name: "Les Éditions",
    matiere: "Fins de rouleaux choisies",
    coupe: "Pièce unique numérotée",
    serie: "Série de 8",
    prix: "Sur demande",
    desc: "Huit exemplaires par saison, numérotés au fer — jamais réédités.",
    statut: "Sur rendez-vous"
  }
]

const ATELIER_DEMO = [
  { label: "Pièces par collection", value: "68", trend: "Pas une de plus" },
  { label: "Part façonnée en France", value: "92 %", trend: "Ateliers partenaires" },
  { label: "Retouches offertes", value: "2 ans", trend: "Sur chaque pièce" },
  { label: "Réassort", value: "0", trend: "Série close" }
]

/* ==========================================================================
   COMPOSANTS TECHNIQUES
   ========================================================================== */

function Reveal({ children, delay = 0, y = 40, x = 0 }: { children: React.ReactNode, delay?: number, y?: number, x?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[size:96px_96px]" />
    </div>
  )
}

/* ==========================================
   MAISON V — INTERFACE PRINCIPALE
   ========================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}
export default function MaisonVLookbook() {
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

  const VESTIAIRE = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...VESTIAIRE_DEMO[i % VESTIAIRE_DEMO.length],
      name: s.title,
      desc: s.desc || VESTIAIRE_DEMO[i % VESTIAIRE_DEMO.length].desc,
      ...(s.price ? { prix: s.price } : {}),
    })),
    VESTIAIRE_DEMO,
  );
  const ATELIER = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({ ...ATELIER_DEMO[i % ATELIER_DEMO.length], value: s.value, label: s.label })),
    ATELIER_DEMO,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
    [
      { text: "Une veste essayée un samedi, reprise aux épaules, rendue le jeudi. Elle tombe comme un gant depuis trois hivers.", author: "Élise R.", detail: "le vestiaire" },
      { text: "Le pull en série de vingt-cinq : personne d'autre ne l'a, et il n'a pas bougé d'une maille.", author: "Camille G.", detail: "la maille" },
      { text: "La pièce numérotée 4/8 de la saison dernière. On m'arrête encore dans la rue pour elle.", author: "Anna S.", detail: "les éditions" },
    ],
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [isCabineOpen, setIsCabineOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Effets brutalistes au défilement — l'aplomb grandit, le texte glisse.
  const monolithScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5])
  const monolithRotate = useTransform(scrollYProgress, [0, 1], [0, 45])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textX = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  const ville = clientCity(sessionData) ?? "Rennes";
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "02 99 45 12 08";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "bonjour@maison-v.fr";

return (
    <div ref={containerRef} className="i160 bg-[#0d0d0f] text-[#e8e4da] selection:bg-[#e8e4da] selection:text-black min-h-dvh overflow-x-clip" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,700;0,800;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');
        .i160 h1, .i160 h2, .i160 h3, .i160 h4, .i160 h5, .i160 .titre { font-family: 'Archivo', Inter, sans-serif; }
      `}</style>

      {/* CADRE HUD — les coins du lookbook */}
      <HUD_Overlay />

      <main>
        {/* ==========================================
            1. LE FRONTISPICE (HERO) — GhostSolid
            ========================================== */}
        <section id="hero" className="relative h-dvh flex flex-col justify-center items-center px-8 md:px-24 overflow-hidden pt-20">
          <GridBackground />

          {/* L'aplomb — un pan de tissu dressé, dessiné, pas photographié. */}
          <motion.div style={{ scale: monolithScale, rotate: monolithRotate, opacity: heroOpacity }} className="absolute z-0 pointer-events-none" aria-hidden>
             <div className="w-[60vw] h-[80vh] bg-gradient-to-br from-[#1a1a1c] to-black border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 7px, rgba(232,228,218,0.05) 7px 8px)" }} />
                <div className="absolute top-1/4 left-0 w-full h-px bg-white/5" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
                <div className="absolute top-3/4 left-0 w-full h-px bg-white/5" />
             </div>
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl">
             <Reveal>
                <motion.h1 style={{ x: textX }} className="text-7xl md:text-[15vw] font-black tracking-tighter uppercase mb-16 leading-[0.8] italic">
                  <GhostSolid
                    ghost={clientHeroLine(sessionData, 0, 2, 9) ?? "Maison"}
                    solid={clientHeroLine(sessionData, 1, 2, 9) ?? "V."}
                    accent="#e8e4da"
                  />
                </motion.h1>
                <div className="grid md:grid-cols-3 gap-12 md:gap-24 text-left max-w-6xl mx-auto border-t border-white/5 pt-16">
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">{clientEyebrow(sessionData) ?? `Prêt-à-porter · ${ville}`}</h3>
                      <p className="text-[11px] text-white/25 leading-loose uppercase tracking-[0.4em] font-bold italic">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                         Vestiaire raisonné, séries courtes, atelier en ville. Les pièces sont numérotées, jamais rééditées.
                      </>}</p>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-6xl font-black tracking-tighter italic text-white/40 leading-none mb-2 titre">3 / an</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Collections, série close</span>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-6xl font-black tracking-tighter italic text-white/40 leading-none mb-2 titre">N° 1—68</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Pièces numérotées au fer</span>
                   </div>
                </div>
             </Reveal>
          </div>

          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-stretch md:items-end gap-4">
             <div className="flex flex-col sm:flex-row gap-4 md:gap-12">
                <Link href="#vestiaire" className="px-6 md:px-12 py-4 md:py-6 bg-[#e8e4da] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 italic">
                   <Hash className="w-4 h-4" /> Voir le vestiaire
                </Link>
                <button
                  onClick={() => setIsCabineOpen(!isCabineOpen)}
                  className="px-6 md:px-12 py-4 md:py-6 border border-white/10 text-[#e8e4da] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-4 italic"
                >
                   <Ruler className="w-4 h-4" /> Essayage privé
                </button>
             </div>
             <div className="text-right hidden md:block">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic">Faire_Défiler_Pour_Ouvrir_Le_Lookbook</span>
             </div>
          </div>
        </section>

        {/* ==========================================
            2. LE VESTIAIRE (GRILLE BRUTALISTE)
            ========================================== */}
        <section id="vestiaire" className="py-60 bg-[#0a0a0c] relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-24">
              <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-12">
                 <Reveal>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 block mb-6 italic underline underline-offset-8 decoration-white/10">Collection // Série close</span>
                    <h2 className="text-6xl md:text-[10vw] font-black uppercase tracking-tighter italic leading-none text-[#e8e4da]">{/* TEXTE_SECTION */ clientText(sessionData, "vestiaire.titre") ?? (<>Vestiaire.</>)}</h2>
                 </Reveal>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-4 italic">Trois lignes // Une exigence</span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Le poids du tissu, pas du logo</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
                 {VESTIAIRE.map((ligne, i) => (
                   <Reveal key={ligne.id ?? i} delay={i * 0.1}>
                      <div className="bg-[#0d0d0f] p-12 lg:p-20 flex flex-col h-full hover:bg-white/[0.02] transition-all group border-white/5 border-r last:border-r-0">
                         <div className="flex justify-between items-start mb-16">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#e8e4da] group-hover:text-black transition-all duration-500">
                               <Scissors className="w-8 h-8" />
                            </div>
                            <span className="px-4 py-2 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{ligne.statut}</span>
                         </div>

                         <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 italic text-[#e8e4da] group-hover:translate-x-4 transition-transform">{ligne.name}</h3>
                         <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] leading-loose mb-12">{ligne.desc}</p>

                         <div className="space-y-8 mb-20 border-l border-white/10 pl-8">
                            <div className="flex justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Matière</span>
                               <span className="text-[#e8e4da] text-right">{ligne.matiere}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Coupe</span>
                               <span className="text-[#e8e4da] text-right">{ligne.coupe}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Série</span>
                               <span className="text-[#e8e4da] text-right">{ligne.serie}</span>
                            </div>
                         </div>

                         <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center gap-4">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{ligne.prix}</span>
                            <Link href="#contact" className="text-[10px] font-black uppercase text-white/40 flex items-center gap-4 group-hover:text-[#e8e4da] transition-all whitespace-nowrap">
                               En cabine <ChevronRight className="w-5 h-5" />
                            </Link>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. L'ATELIER (CHIFFRES)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center">
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 block mb-12 italic underline underline-offset-8 decoration-white/10">Atelier // Méthode</span>
                       <h2 className="text-7xl md:text-[9vw] font-light italic leading-none text-[#e8e4da] mb-16 uppercase tracking-tighter">{/* TEXTE_SECTION */ clientText(sessionData, "atelier.titre") ?? (<>
                          Peu, <br/> <span className="not-italic font-black text-white/5 italic">mais juste.</span>
                       </>)}</h2>
                       <p className="text-2xl font-light text-white/25 leading-relaxed mb-24 italic uppercase tracking-[0.2em] max-w-xl">{c?.aboutText ?? <>
                          Chaque série est close le jour où elle est coupée. Pas de réassort, pas de solde — des pièces suivies, retouchées, portées longtemps.
                       </>}</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-8 shadow-2xl">
                          {ATELIER.map((metric, i) => (
                            <div key={i} className="p-10 lg:p-16 bg-[#0a0a0c] group hover:bg-white/[0.02] transition-all border-r border-b last:border-r-0 border-white/5">
                               <div className="text-[10px] font-black uppercase text-white/20 mb-6 tracking-[0.4em]">{metric.label}</div>
                               <div className="text-5xl font-black text-[#e8e4da] italic mb-6 tracking-tighter group-hover:translate-x-2 transition-transform titre">{metric.value}</div>
                               <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">
                                  <Feather className="w-4 h-4 text-[#e8e4da]/60" /> {metric.trend}
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>

                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-[#0a0a0c] border border-white/10 p-12 lg:p-20 flex flex-col justify-between relative group overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-80 bg-white opacity-[0.02] blur-[150px] rounded-full group-hover:opacity-[0.05] transition-opacity" aria-hidden />

                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Cahier // de coupe</span>
                                <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em]">Saison en cours</span>
                             </div>
                             <Scissors className="w-6 h-6 text-white/20" />
                          </div>

                          {/* Le mètre ruban — dessiné, en rotation lente. */}
                          <div className="relative z-10 flex flex-col items-center justify-center h-full">
                             <div className="w-48 h-48 border border-white/5 rounded-full flex items-center justify-center relative">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 border-t-2 border-[#e8e4da]/25 rounded-full"
                                />
                                <motion.div
                                  animate={{ rotate: -360 }}
                                  transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-4 border-b-2 border-white/10 rounded-full"
                                />
                                <Ruler className="w-16 h-16 text-white/10" />
                             </div>
                             <div className="mt-16 text-center space-y-6">
                                <div className="text-4xl font-black italic tracking-tighter text-white/40 titre uppercase">Toile · Coupe · Série</div>
                                <span className="text-[11px] font-bold text-white/20 uppercase tracking-[0.6em] block">Atelier — {ville}</span>
                             </div>
                          </div>

                          <div className="relative z-10 flex gap-6">
                             <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                <motion.div
                                   animate={{ x: ["-100%", "100%"] }}
                                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-[#e8e4da]/25"
                                />
                             </div>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            4. LE LOOKBOOK & LE SAVOIR-FAIRE
            ========================================== */}
        <section className="py-60 bg-[#0d0d0f] relative overflow-hidden border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center">
                 <div className="relative aspect-[3/4] overflow-hidden group border border-white/5 shadow-2xl">
                    <Image
                       src={photo(0, "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop")}
                       alt="Silhouette de la collection"
                       fill
                       className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-white/5 mix-blend-color group-hover:opacity-0 transition-opacity" />
                    <div className="absolute inset-0 p-10 lg:p-20 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                       <div className="text-[#e8e4da]">
                          <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 mb-8 block italic underline underline-offset-8 decoration-white/10">Lookbook // Silhouette 01</span>
                          <h4 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic mb-12">La tenue <br/> entière.</h4>
                          <Link href="#contact" className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/20 pb-4 hover:border-[#e8e4da] transition-all group w-fit">
                             Réserver l'essayage <ExternalLink className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                          </Link>
                       </div>
                    </div>
                 </div>

                 <div>
                    <Reveal>
                       <div className="mb-24 text-left">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mb-8 block italic">Savoir-faire // De la toile à la pièce</span>
                          <h2 className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase text-[#e8e4da] italic leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "savoir.titre") ?? (<>La main.</>)}</h2>
                       </div>
                       <p className="text-2xl font-light text-white/25 leading-relaxed italic mb-20 uppercase tracking-[0.2em]">{/* TEXTE_SECTION */ clientText(sessionData, "savoir.texte") ?? (<>
                          Une pièce n'entre au vestiaire qu'après trois passages : le dessin, la toile essayée sur corps, la série coupée d'un seul tissu.
                       </>)}</p>
                       <div className="space-y-12 lg:space-y-20">
                          {[
                            { t: "Le dessin", d: "Chaque silhouette naît à la main, à l'encre, dans le cahier de saison — pas dans un logiciel de tendances." },
                            { t: "La toile", d: "Essayée, reprise, réessayée sur corps vivants — la coupe est arrêtée quand elle tombe, pas quand c'est l'heure." },
                            { t: "La série", d: "Coupée d'un seul tissu, numérotée au fer, close pour toujours. Votre numéro reste le vôtre." }
                          ].map((step, i) => (
                            <div key={i} className="group flex gap-8 lg:gap-12 border-b border-white/5 pb-10 lg:pb-16 hover:border-white/20 transition-all cursor-default">
                               <div className="text-6xl font-black text-white/5 group-hover:text-white/20 transition-colors italic leading-none titre">0{i+1}</div>
                               <div>
                                  <h5 className="text-3xl font-black uppercase tracking-tight text-[#e8e4da] mb-6 italic group-hover:translate-x-2 transition-transform">{step.t}</h5>
                                  <p className="text-[12px] text-white/25 uppercase tracking-[0.3em] font-bold leading-loose italic">{step.d}</p>
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
            5. LES CLIENTES (AVIS)
            ========================================== */}
        <section className="py-60 bg-black relative border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <Reveal>
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 block mb-6 italic underline underline-offset-8 decoration-white/10">Portées // En ville</span>
                 <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter italic leading-none text-[#e8e4da] mb-32">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Elles la portent.</>)}</h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                 {AVIS.map((a: any, i: number) => (
                   <Reveal key={i} delay={i * 0.1}>
                     <figure className="bg-[#0d0d0f] p-12 lg:p-16 h-full flex flex-col hover:bg-white/[0.02] transition-all">
                        <blockquote className="text-xl font-light italic text-white/50 leading-relaxed mb-12 flex-1 normal-case">« {a.text} »</blockquote>
                        <figcaption className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 border-t border-white/5 pt-8">
                           {a.author}{a.detail ? <span className="block mt-2 text-[#e8e4da]/50">{a.detail}</span> : null}
                        </figcaption>
                     </figure>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            6. LA BOUTIQUE (CONTACT)
            ========================================== */}
        <section id="contact" className="py-60 bg-[#0a0a0c] relative border-t border-white/5">
           <div className="max-w-[1000px] mx-auto px-8 md:px-24 text-center">
              <Reveal>
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 block mb-8 italic">Boutique // Cabine // Atelier</span>
                 <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter italic leading-none text-[#e8e4da] mb-16">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Passer<br/>la porte.</>)}</h2>
                 <p className="text-xl font-light text-white/30 italic uppercase tracking-[0.2em] mb-20 max-w-xl mx-auto">
                    Essayage libre en boutique, cabine privée sur rendez-vous — la retouche est prise sur place, à l'atelier.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                    <a href={telHref} className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#e8e4da] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all italic">
                       <Phone className="w-4 h-4" /> {tel}
                    </a>
                    <a href={`mailto:${mail}`} className="inline-flex items-center justify-center gap-4 px-12 py-6 border border-white/10 text-[#e8e4da] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all italic">
                       <Mail className="w-4 h-4" /> Écrire
                    </a>
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 flex items-center justify-center gap-3">
                    <MapPin className="w-4 h-4" /> {clientCodePostalVille(sessionData, "35000", "Rennes")}
                 </div>
              </Reveal>
           </div>
        </section>

        {/* MEGA FOOTER */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-24 relative z-50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-32 mb-40 text-[#e8e4da]">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-6 mb-16">
                    {fd?.logoBase64 ? (
                      // Client logo (uploaded in the brief) replaces the placeholder mark
                      <img
                        src={fd.logoBase64}
                        alt={fd?.businessName ?? 'logo'}
                        style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-[#e8e4da] flex items-center justify-center">
                          <Scissors className="w-10 h-10 text-black" />
                        </div>
                        <span className="text-4xl font-black uppercase tracking-tighter italic titre">
                          {fd?.businessName ? fd.businessName : <>MAISON<span className="text-white/20">V.</span></>}
                        </span>
                      </>
                    )}
                 </div>
                 <p className="text-white/25 text-[11px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mb-20 italic">
                    « Une garde-robe courte, coupée juste, portée longtemps. »
                 </p>
                 <div className="flex flex-wrap gap-8 lg:gap-16">
                    {[["Vestiaire", "#vestiaire"], ["Essayage", "#contact"], ["Instagram", "#contact"]].map(([s, a]) => (
                      <Link key={s} href={a} className="text-[11px] font-black uppercase tracking-widest text-white/25 hover:text-[#e8e4da] transition-colors italic underline underline-offset-8 decoration-white/5">{s}</Link>
                    ))}
                 </div>
              </div>

              {[
                { t: "LA MAISON", l: [["Le vestiaire", "#vestiaire"], ["L'atelier", "#hero"], ["Le savoir-faire", "#hero"], ["Les clientes", "#hero"]] },
                { t: "PRATIQUE", l: [["Essayage privé", "#contact"], ["Retouches", "#contact"], ["Nous trouver", "#contact"]] },
                { t: "CONTACT", l: [[tel, telHref], [mail, `mailto:${mail}`], [clientCodePostalVille(sessionData, "35000", "Rennes"), "#contact"]] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                  <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic">{col.t}</h4>
                  <ul className="flex flex-col gap-8">
                    {col.l.map(([link, href]) => (
                      <li key={link}><a href={href} className="text-[11px] font-bold text-white/25 hover:text-[#e8e4da] transition-colors uppercase tracking-[0.3em] italic break-all">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
              <span>© {clientName(sessionData) ?? "Maison V"}{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""} · Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
              <div className="flex gap-8 lg:gap-16">
                 <Link href="#contact" className="hover:text-[#e8e4da] transition-colors">Mentions légales</Link>
                 <Link href="#contact" className="hover:text-[#e8e4da] transition-colors">CGV</Link>
              </div>
           </div>
        </footer>
      </main>

      {/* CABINE PRIVÉE (MODALE) */}
      <AnimatePresence>
        {isCabineOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-2xl w-full border border-white/10 p-10 lg:p-16 relative bg-[#0a0a0c] shadow-2xl">
                <button onClick={() => setIsCabineOpen(false)} aria-label="Fermer" className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center text-white/20 hover:text-white transition-colors">
                   <X className="w-10 h-10" />
                </button>
                <div className="flex flex-col gap-12">
                   <div className="flex items-center gap-6">
                      <Ruler className="w-10 h-10 text-[#e8e4da]" />
                      <div>
                         <h2 className="text-3xl font-black uppercase tracking-tighter italic text-[#e8e4da] leading-none">Essayage privé</h2>
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Cabine — sur rendez-vous</span>
                      </div>
                   </div>
                   <div className="bg-white/5 p-8 text-[11px] leading-loose text-white/60 uppercase tracking-[0.2em] border border-white/5 font-bold">
                      <div className="text-[#e8e4da] mb-4 underline underline-offset-4 decoration-white/20 font-black">Comment ça se passe :</div>
                      <div>Une heure, la boutique fermée pour vous.</div>
                      <div>Les trois lignes préparées à votre taille.</div>
                      <div>Retouches épinglées sur place, sans frais.</div>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-6">
                      <a href={telHref} className="flex-1 py-6 bg-[#e8e4da] text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all italic text-center">{tel}</a>
                      <a href={`mailto:${mail}`} className="flex-1 py-6 border border-white/10 text-[#e8e4da] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all italic text-center">Écrire</a>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ==========================================
   SOUS-COMPOSANTS
   ========================================== */

function HUD_Overlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
       {/* Les coins du lookbook — le cadre de la page imprimée. */}
       <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-white/10" />
       <div className="absolute top-12 right-12 w-20 h-20 border-t-2 border-r-2 border-white/10" />
       <div className="absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 border-white/10" />
       <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-white/10" />

       {/* Bandeau de saison — masqué sous md, comme l'original. */}
       <div className="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 items-center gap-20 bg-black/60 backdrop-blur-2xl px-12 py-4 border border-white/10 rounded-none">
          <div className="flex items-center gap-6 text-[#e8e4da]">
             <div className="w-3 h-3 bg-[#e8e4da] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Collection en cours // Séries closes</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-6 text-white/25">
             <Scissors className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Retouches offertes — 2 ans</span>
          </div>
       </div>

       {/* Tranche verticale droite */}
       <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden lg:block">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/5 italic">Vestiaire_Raisonné_Séries_Courtes_Numérotées_Au_Fer_Jamais_Rééditées</span>
       </div>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
