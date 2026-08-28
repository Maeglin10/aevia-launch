"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight, Menu, Star, Shield, Key, Home, Building2, Map, ChevronRight, Maximize2, MoveRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DWELL, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2"
import { PushBlur } from "@/lib/templates/hero-kit-3"
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
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les avis, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const AVIS_INLINE_SOURCE = [
  { quote: "Notre hôtel particulier a été trouvé entièrement hors marché. Un réseau que nous n'avions rencontré nulle part ailleurs.", name: "H. de Brissac", origin: "Bordeaux · 2,4 M€" },
                { quote: "Une discrétion absolue du premier appel à la signature. Un seul interlocuteur, et une transaction sans une seule friction.", name: "A. Reinhardt", origin: "Annecy · 1,85 M€" },
                { quote: "Ils ne vendent pas des mètres carrés : ils comprennent la vie qu'on veut y mener. Nous avions acheté deux fois la mauvaise maison avant eux.", name: "S. Marchetti", origin: "Cap-Ferret · 3,1 M€" }
];
let AVIS_INLINE = AVIS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

function PROPERTIES_DEMO_SOURCE_LIVE() {
  return [
  { name: "Le Penthouse Obsidienne", loc: (clientCity(sessionData) ?? "Bordeaux"), price: "2 450 000 €", img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200") },
  { name: "La Villa des Falaises", loc: "Cap-Ferret", price: "3 100 000 €", img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200") },
  { name: "Le Domaine Véridian", loc: "Entre-deux-Mers", price: "1 850 000 €", img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200") },
];
}
let PROPERTIES_DEMO_SOURCE = PROPERTIES_DEMO_SOURCE_LIVE();
let PROPERTIES_DEMO = PROPERTIES_DEMO_SOURCE;
let PROPERTIES = PROPERTIES_DEMO;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ArcaneRealtyPage() {
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
  PROPERTIES_DEMO_SOURCE = PROPERTIES_DEMO_SOURCE_LIVE();

  PROPERTIES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...PROPERTIES_DEMO_SOURCE[i % PROPERTIES_DEMO_SOURCE.length], name: s.title, price: s.price ?? PROPERTIES_DEMO_SOURCE[i % PROPERTIES_DEMO_SOURCE.length].price })),
    PROPERTIES_DEMO_SOURCE,
  );

  AVIS_INLINE = resolveList(

    clientReviews(session)?.map((r: any, i: number) => ({

      ...AVIS_INLINE_SOURCE[i % AVIS_INLINE_SOURCE.length],

      quote: r.text, name: r.author,

    })),

    AVIS_INLINE_SOURCE,

  );
  PROPERTIES = PROPERTIES_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[0 + i] || row.img,
  }));

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [PROPERTIES];
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

  const { i: scene } = useSlides(3, DWELL.slow);
  const SCENES = [
    { name: "Le Penthouse Obsidienne", l1: "Biens", l2: "rares.", sub: "Les adresses que l'on ne voit jamais en vitrine, réservées à ceux qui savent attendre la bonne.", img: photo(3, "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2400") },
    { name: "La Villa des Falaises", l1: "Hors", l2: "marché.", sub: "La plupart de nos ventes se signent sans annonce : le réseau d'abord, la discrétion toujours.", img: photo(4, "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200") },
    { name: "Le Domaine Véridian", l1: "Un seul", l2: "conseiller.", sub: "De l'estimation à l'acte, un interlocuteur unique, joignable, qui connaît le dossier par cœur.", img: photo(3, "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2400") },
  ];

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  return (
    <div className="bg-[#0a0a0a] text-white font-sans min-h-dvh selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-700">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">{/* NOM_LOGO */ clientName({ formData: fd }) ?? (<>Arcane <span className="font-light text-white/40">Immobilier</span></>)}</span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            {[["Les biens", "#biens"], ["Conciergerie", "#contact"], ["Les voix", "#avis"], ["Contact", "#realisations"]].map(([l, h]) => (
              <Link key={l} href={h} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Espace vendeur</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-transparent hover:text-white hover:border-white border border-transparent transition-all duration-700">Demander une visite</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Les biens", "Conciergerie", "La maison", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-3xl font-light uppercase tracking-widest hover:text-white transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO — PushBlur : toute la composition part sur le côté,
            photographie et titre ensemble, avec un flou directionnel pendant
            le déplacement. Un seul index pour la scène, la légende et le
            compteur. Fond de repli sombre : la page tient sans photo. ── */}
        <section id="hero" className="relative h-dvh overflow-hidden pt-24 md:pt-0 bg-[#0a0a0a]">
          <PushBlur index={clientHeroLine(sessionData, 0, 2, 9) ? "client" : scene} amount={18} style={{ position: "absolute", inset: 0 }}>
            <div className="relative h-dvh flex items-center justify-center">
              <div className="absolute inset-0">
                 <Image src={SCENES[scene].img} alt={SCENES[scene].name} fill className="object-cover opacity-50 scale-105" priority />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                 <div className="absolute inset-0 bg-black/30" />
              </div>
              <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tighter leading-[0.8] text-white mb-12 uppercase break-words">{<>{clientHeroLine(sessionData, 0, 2, 9) ?? SCENES[scene].l1}<br/> <span className="font-bold italic">{clientHeroLine(sessionData, 1, 2, 9) ?? SCENES[scene].l2}</span>
                </>}</h1>
                <p className="text-xl text-white/40 font-light max-w-xl mx-auto leading-relaxed italic">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? SCENES[scene].sub}</p>
              </div>
            </div>
          </PushBlur>

          <div className="absolute inset-x-0 bottom-0 z-10 pb-12 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-10">
              <div className="flex flex-wrap justify-center gap-8">
                <a href="#biens" className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700">
                  Voir les biens
                </a>
                <a href="#realisations" className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                  <Map className="w-3 h-3" /> Confier un bien
                </a>
              </div>
              <div className="w-full flex justify-between items-end">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 flex items-center gap-3"><MapPin className="w-3 h-3" /> {clientEyebrow(sessionData) ?? `Immobilier d'exception · ${clientCity(sessionData) ?? "Bordeaux"}`}</div>
                <SlideIndex i={scene} total={SCENES.length} variant="fraction" color="rgba(255,255,255,0.35)" className="" />
              </div>
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO ─────────────── */}
        <section id="biens" className="py-40 bg-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-4">À la vente</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "biens.titre") ?? (<>Des espaces <span className="italic font-bold">choisis.</span></>)}</h2>
                </div>
                <Link href="#hero" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-white text-white/40 transition-colors group italic">
                  Le portefeuille privé <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {PROPERTIES.map((p, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] mb-10 overflow-hidden bg-white/[0.02]">
                      <ParallaxImg src={p.img} alt={p.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute top-8 left-8 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Disponible</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 italic flex items-center gap-2"><MapPin className="w-3 h-3" /> {p.loc}</div>
                          <h3 className="text-3xl font-bold uppercase tracking-widest text-white">{p.name}</h3>
                       </div>
                       <div className="text-xl font-light tracking-tighter text-white/60">{p.price}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONCIERGE ─────────────── */}
        <section id="contact" className="py-40 relative bg-black overflow-hidden border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div>
                  <Reveal>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 block mb-8">L'accompagnement</span>
                    <h2 className="text-5xl md:text-8xl font-light uppercase tracking-tighter text-white italic mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Gants <br/> <span className="not-italic font-bold">blancs.</span></>)}</h2>
                    <div className="space-y-12">
                       {[
                         { icon: Shield, t: "Confidentialité stricte", d: "Accord de confidentialité dès le premier contact. Carte professionnelle (loi Hoguet), garantie financière, séquestre notarié." },
                         { icon: Key, t: "Clés en main", d: "Conciergerie complète : déménagement, notaire, gestion locative, travaux — un seul fil conducteur." },
                         { icon: Star, t: "Avant-premières privées", d: "Accès en premier aux biens hors marché, avant toute diffusion publique." }
                       ].map((f, i) => (
                         <div key={i} className="flex gap-8 group">
                            <div className="w-16 h-16 shrink-0 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700">
                               <f.icon className="w-5 h-5 text-white/40 group-hover:text-black transition-colors" />
                            </div>
                            <div>
                               <h4 className="text-xl font-bold uppercase tracking-widest mb-2 italic">{f.t}</h4>
                               <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </Reveal>
               </div>
               <Reveal delay={0.2}>
                  <div className="relative aspect-square grayscale hover:grayscale-0 transition-all duration-1000 p-2 bg-white/[0.02]">
                     <ParallaxImg src={photo(4, "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200")} alt="Estate Interior" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 rotate-45" />
                  </div>
               </Reveal>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section id="avis" className="py-40 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-4">Ils ont signé</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Avec leurs <span className="italic font-bold">mots.</span></>)}</h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {AVIS_INLINE.map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="bg-[#0a0a0a] p-16 flex flex-col gap-8 group hover:bg-black transition-colors duration-500">
                    <div className="text-5xl text-white/10 font-serif leading-none">&ldquo;</div>
                    <p className="text-lg text-white/40 font-light leading-relaxed italic flex-1">{t.quote}</p>
                    <div className="border-t border-white/5 pt-8">
                      <div className="text-sm font-bold text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-[10px] text-white/25 font-mono tracking-widest mt-2">{t.origin}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADVISORS ──────────────── */}
        <section className="py-40 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-24 border-b border-white/5 pb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-4">Le cabinet</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "conseil.titre") ?? (<>Le <span className="italic font-bold">conseil.</span></>)}</h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Margaux Delbos", role: "Directrice — Ventes", markets: [(clientCity(sessionData) ?? "Bordeaux"), "Cap-Ferret"], yrs: "19 ans" },
                { name: "Elara Voss", role: "Acquisitions", markets: ["Rive gauche", "Bassin"], yrs: "16 ans" },
                { name: "Thomas Reinier", role: "Domaines & vignobles", markets: ["Entre-deux-Mers", "Médoc"], yrs: "11 ans" },
                { name: "Nadia Alaoui", role: "Gestion & location", markets: ["Centre", "Littoral"], yrs: "13 ans" },
              ].map((a, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-default">
                    <div className="aspect-[3/4] bg-white/[0.02] border border-white/5 mb-6 flex items-end p-8 group-hover:border-white/15 transition-colors duration-700 overflow-hidden relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] font-black text-white/[0.03] uppercase">{a.name.split(" ").map((n: string) => n[0]).join("")}</div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-1">{a.yrs}</div>
                        {a.markets.map(m => <span key={m} className="text-[10px] font-mono text-white/20 mr-3">/{m}/</span>)}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-1">{a.name}</h3>
                    <p className="text-[10px] font-light text-white/30 uppercase tracking-wider italic">{a.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="realisations" className="py-40 bg-white text-black text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-6xl md:text-[10rem] font-light uppercase tracking-tighter leading-[0.8] mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "cta.titre") ?? c?.aboutTitle ?? <>
                Commencer <br/> <span className="font-bold italic">l'acquisition.</span>
              </>}</h2>
              <p className="text-xl text-black/60 font-light mb-16 leading-relaxed italic">{/* TEXTE_SECTION */ clientText(sessionData, "cta.texte") ?? c?.aboutText ?? <>
                Nos conseillers écoutent d'abord la vie que vous cherchez. Nous ne trouvons pas des maisons : nous installons des histoires.
              </>}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic">
                   Demander une estimation
                </button>
                <button className="px-16 py-6 border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                   Voir les biens
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">{fd?.businessName ?? clientName(sessionData) ?? <>Arcane <span className="font-light text-white/40">Immobilier</span></>}</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-8 text-sm font-light italic">
              « Nous ne vendons pas des mètres carrés : nous installons des histoires. »
            </p>
            <div className="space-y-2 text-sm text-white/40 mb-8">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-white/40" /> {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "33000", "Bordeaux")}</div>
              <a href={`tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33556000000").replace(/\s/g, "")}`} className="block hover:text-white transition-colors">{clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "05 56 00 00 00"}</a>
              <a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "contact@arcane-immobilier.fr"}`} className="block hover:text-white transition-colors">{clientEmail(sessionData) ?? fd?.email ?? "contact@arcane-immobilier.fr"}</a>
            </div>
          </div>
          
          {[
            { t: "Les biens", l: ["Résidentiel", "Domaines", "Hors marché", "Archives"] },
            { t: "Services", l: ["Acquisition", "Gestion", "Conciergerie", "Estimation"] },
            { t: "La maison", l: ["Notre histoire", "Le conseil", "Contact", "Le journal"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-xs text-white/30 hover:text-white transition-colors italic font-light"><Link href="#contact">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 {fd?.businessName ?? clientName(sessionData) ?? "Arcane Immobilier"}{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — {clientTrade(sessionData) ?? "Immobilier d'exception"} · carte professionnelle CPI</span>
          <div className="flex gap-8 normal-case tracking-normal not-italic">
             <span>Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
             <span>Éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
