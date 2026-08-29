"use client";
// @ts-nocheck
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Utensils, ArrowRight, Menu, Star, Clock, MapPin, Shield, Heart, Compass, ChevronRight, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DWELL, HeldSwap, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
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
} from "@/lib/templates/clientContent";
let sessionData: any = null;
let bp: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
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
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function KuroOmakasePage() {
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
  bp = session?.businessProfile;

  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  const MENUS_DEMO = [
    { tier: fd?.businessName ?? clientName(sessionData) ?? "Kuro Omakase", courses: "12 services", price: "180 €", note: "La progression complète du chef. 3 h 30 au comptoir, ouverture kaiseki de saison.", incl: ["Accord sakés de la maison", "Cérémonie du thé en clôture", "Carte du soir signée"] },
    { tier: "Menu Umi", courses: "8 services", price: "120 €", note: "Le grand large : sashimis, coquillages et pièces iodées.", incl: ["Accord vins possible", "Suppléments à la pièce", "Petit salon privatisable"] },
    { tier: "Menu Tsuki", courses: "5 services", price: "75 €", note: "L'entrée dans la maison — idéal pour une première visite.", incl: ["Accord sans alcool", "Carte allergènes tenue à jour", "Place au comptoir"] },
  ];
  const MENUS = (clientServices(sessionData)?.slice(0, 3).map((sv: any, i: number) => ({
    ...MENUS_DEMO[i % MENUS_DEMO.length],
    tier: sv.title ?? MENUS_DEMO[i % MENUS_DEMO.length].tier,
    price: sv.price ?? MENUS_DEMO[i % MENUS_DEMO.length].price,
    note: sv.description ?? sv.desc ?? MENUS_DEMO[i % MENUS_DEMO.length].note,
  })) ?? MENUS_DEMO);

  const STATS_CHEF = (clientStats(sessionData) ?? [
    { value: "21 ans", label: "De comptoir" },
    { value: "8", label: "Couverts par service" },
    { value: "12", label: "Saisons de carte" },
  ]).slice(0, 3).map((x: any) => ({ v: x.value, l: x.label }));

  // ── La pièce de saison : un seul index pour l'image, la légende, le compteur.
  const { i: piece, next: nextPiece, prev: prevPiece } = useSlides(3, DWELL.slow);
  const PIECES = [
    { t: "Thon rouge de ligne", s: "Méditerranée", d: "Ventrèche persillée, maturée 48 heures dans un shoyu de la maison.", img: photo(2, (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=1200")) },
    { t: "Oursin de pleine mer", s: "Galice", d: "Crémeux, iodé, ouvert à la commande et servi à température du corps.", img: photo(3, (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&q=80&w=1200")) },
    { t: "Ormeau breton", s: "Côtes de Bretagne", d: "Cuit six heures au saké et au dashi de kombu, pour la texture juste.", img: photo(4, (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1200")) },
  ];

  // ── Reservation modal ────────────────────────────────────────────────
  const [reservationOpen, setReservationOpen] = useState(false)
  const [reservationLoading, setReservationLoading] = useState(false)
  const [reservationSent, setReservationSent] = useState(false)
  const [reservationForm, setReservationForm] = useState({ date: "", time: "", party: "2", name: "", email: "", phone: "" })

  useEffect(() => {
    if (!reservationOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeReservationModal() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [reservationOpen]);

  function closeReservationModal() {
    setReservationOpen(false)
    setReservationLoading(false)
    setReservationSent(false)
    setReservationForm({ date: "", time: "", party: "2", name: "", email: "", phone: "" })
  }

  function handleReservationSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReservationLoading(true)
    setTimeout(() => {
      setReservationLoading(false)
      setReservationSent(true)
    }, 1000)
  }

  // Dynamic Services & Testimonials Mutation for Session Data
  return (
    <div className="bg-[#050505] text-[#d1d1d1] font-sans min-h-dvh selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-4 group">
            {/* La barre portait « Kuro Omakase », le nom du modèle, à l'endroit
                le plus visible de la page. Le carré à initiale reste au modèle :
                une initiale prise d'un autre nom ne veut plus rien dire. */}
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : clientName(sessionData) ? (
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white italic">{clientName(sessionData)}</span>
            ) : (
              <>
            <div className="w-8 h-8 bg-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
              <span className="text-black font-black text-sm uppercase">K</span>
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white italic">Kuro <span className="font-bold not-italic">Omakase</span></span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["Le rituel", "La carte", "Réserver", "La maison"].map(l => (
              <Link key={l} href="#contact" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white transition-all">Réserver un couvert</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["L'expérience", "La carte", "Le chef", "Réserver"].map(l => (
                    <Link key={l} href="#contact" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-dvh flex items-center justify-center overflow-hidden pt-24 md:pt-0">
          <div className="absolute inset-0">
             <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=2400"))} alt="Chef Hands" fill className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2000ms] scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
             <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal delay={0.2} y={70}>
              <motion.h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-[0.8] text-white mb-12 uppercase italic">{<>{clientHeroLine(sessionData, 0, 2, 9) ?? "Le geste"}<br/> <span className="font-light not-italic">{clientHeroLine(sessionData, 1, 2, 9) ?? "juste."}</span>
              </>}</motion.h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-white/40 font-light max-w-xl leading-relaxed italic">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                  Huit couverts, un comptoir de cyprès, et le chef qui décide.
                  La pureté du sushi Edomae, au rythme des saisons.
                </>}</p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button
                    onClick={() => setReservationOpen(true)}
                    className="px-16 py-6 min-h-[44px] bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Demander une table
                  </button>
                  <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-4">
                    <Play className="w-3 h-3 fill-current" /> Voir le rituel
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          {/* hidden on mobile: the centered hero content (subline + 2 CTAs)
              can extend down far enough on short viewports to overlap this
              absolutely-positioned label, sitting right on top of the
              "Witness the Ritual" button. */}
          <div className="hidden sm:flex absolute bottom-12 left-12 flex-col gap-2">
             <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Service I — 19 h</div>
             <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Service II — 21 h 30</div>
          </div>
        </section>

        {/* ── THE RITUAL ────────────── */}
        <section className="py-60 bg-[#050505] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <Reveal>
                   <div className="relative aspect-[4/5] p-2 bg-white/[0.02] border border-white/5 overflow-hidden">
                      <ParallaxImg src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=1200"))} alt="Sushi Close-up" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                   </div>
                </Reveal>
                <div>
                   <Reveal>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-12">La philosophie</span>
                      <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none mb-16 italic">{/* TEXTE_SECTION */ clientText(sessionData, "rituel.titre") ?? c?.aboutTitle ?? <>L'élégance <br/> <span className="not-italic font-bold opacity-30">du vide.</span></>}</h2>
                      <p className="text-2xl font-light text-white/60 leading-relaxed mb-20 italic">{/* TEXTE_SECTION */ clientText(sessionData, "rituel.texte") ?? c?.aboutText ?? <>
                         « Pour trouver l'âme du poisson, il faut retirer tout ce qui n'est pas le poisson. » <br/><br/>
                         La maison suit le principe du Ma (間) — l'espace entre, le silence, le vide qui laisse enfin exister la saveur.
                      </>}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         {[
                           { t: "TRADITION EDOMAE", d: "Maturations et salaisons au vinaigre rouge, selon des gestes vieux d'un siècle." },
                           { t: "RIZ D'UNE SEULE FERME", d: "Riz et vinaigre d'une ferme familiale unique, travaillés au cuiseur de cuivre." }
                         ].map((item, i) => (
                           <div key={i} className="group">
                              <h4 className="text-xs font-black uppercase tracking-widest mb-4 italic text-white/40">{item.t}</h4>
                              <p className="text-sm font-light leading-relaxed text-white/20">{item.d}</p>
                           </div>
                         ))}
                      </div>
                   </Reveal>
                </div>
             </div>
          </div>
        </section>

        {/* ── LA PIÈCE DE SAISON — HeldSwap : sortie, un demi-temps de vide
            tenu, entrée. La pièce est posée à plat, on ne l'encadre pas. Les
            flèches pilotent le même index que la légende et le compteur. ── */}
        <section id="contact" className="py-60 bg-black">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">L'arrivage</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">{/* TEXTE_SECTION */ clientText(sessionData, "arrivage.titre") ?? (<>La <span className="font-light not-italic opacity-30 text-white">pièce.</span></>)}</h2>
                    </div>
                    <div className="flex items-center gap-6">
                       <SlideIndex i={piece} total={PIECES.length} variant="fraction" color="rgba(255,255,255,0.4)" className="" />
                       <div className="flex gap-4">
                          <button onClick={prevPiece} aria-label="Pièce précédente" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                          <button onClick={nextPiece} aria-label="Pièce suivante" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5" /></button>
                       </div>
                    </div>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <HeldSwap index={piece} tilt={0}>
                    <div className="aspect-[4/3] relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                       <Image src={PIECES[piece].img} alt={PIECES[piece].t} fill className="object-cover" />
                       <div className="absolute inset-0 bg-black/30" />
                    </div>
                 </HeldSwap>
                 <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-4 italic">{PIECES[piece].s}</div>
                    <h3 className="text-5xl md:text-6xl font-bold uppercase tracking-widest text-white mb-8">{PIECES[piece].t}</h3>
                    <p className="text-lg font-light text-white/40 leading-relaxed italic max-w-md">{PIECES[piece].d}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* ── CHEF PHILOSOPHY ────────── */}
        <section className="py-60 bg-[#050505] border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                 <Reveal>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-8">L'artisan</span>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic mb-16">{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>Chef<br /><span className="font-light not-italic opacity-30">Hiroshi.</span></>)}</h2>
                    <div className="space-y-8">
                       <p className="text-base text-white/40 leading-relaxed font-light italic">
                          {/* TEXTE_SECTION */ clientText(sessionData, "chef.texte") ?? (<>Formé dix ans à Osaka puis à Kyoto, Hiroshi Mori a posé son comptoir ici pour une méditation singulière : la retenue japonaise, aux produits de nos côtes.</>)}
                       </p>
                       <p className="text-base text-white/40 leading-relaxed font-light italic">
                          La carte change avec le calendrier lunaire. Ce que vous goûtez ce soir n'a jamais été servi, et ne le sera plus jamais.
                       </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
                       {STATS_CHEF.map(s => (
                          <div key={s.l} className="bg-[#050505] p-8 text-center">
                             <div className="text-3xl font-black text-white italic">{s.v}</div>
                             <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mt-2">{s.l}</div>
                          </div>
                       ))}
                    </div>
                 </Reveal>
                 <Reveal delay={0.2}>
                    <div className="aspect-[3/4] relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-[2000ms]">
                       <Image src={photo(5, (clientPhotos(sessionData)[5] || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1200"))} alt="Chef" fill className="object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── THE MENU ────────────────── */}
        <section className="py-60 bg-black border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/5 pb-16 gap-8">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">L'expérience</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">{/* TEXTE_SECTION */ clientText(sessionData, "carte.titre") ?? (<>La <span className="font-light not-italic opacity-30">carte.</span></>)}</h2>
                    </div>
                    <div className="text-sm text-white/30 font-light italic max-w-xs leading-relaxed">La carte change chaque soir. Accord vins ou sakés sur réservation.</div>
                 </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {MENUS.map((m, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                       <div className="border border-white/5 p-12 flex flex-col gap-6 hover:border-white/15 transition-colors duration-700">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{m.courses}</div>
                          <h3 className="text-2xl font-bold uppercase tracking-widest text-white italic">{m.tier}</h3>
                          <div className="text-4xl font-light text-white/60">{m.price}</div>
                          <p className="text-sm text-white/30 font-light leading-relaxed italic flex-1">{m.note}</p>
                          <ul className="space-y-2 border-t border-white/5 pt-6">
                             {m.incl.map(f => <li key={f} className="text-xs text-white/25 flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />{f}</li>)}
                          </ul>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#050505] text-center px-6 border-t border-white/5">
           <div className="max-w-4xl mx-auto">
              <Reveal>
                 <div className="w-16 h-16 bg-white mx-auto mb-20 flex items-center justify-center font-black text-black text-2xl uppercase">K</div>
                 <h2 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">{/* TEXTE_SECTION */ clientText(sessionData, "cta.titre") ?? (<>
                    Confiez-vous <br/> <span className="font-light not-italic opacity-30 text-white">à la main.</span>
                 </>)}</h2>
                 <p className="text-xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    {/* TEXTE_SECTION */ clientText(sessionData, "cta.texte") ?? (<>Les réservations ouvrent le premier de chaque mois pour les trente jours suivants. Huit couverts par service — pas un de plus.</>)}
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button
                      onClick={() => setReservationOpen(true)}
                      className="px-16 py-8 min-h-[44px] bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                       Réserver un couvert
                    </button>
                    <button className="px-16 py-8 border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all italic">
                       Privatiser le comptoir
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── LE LIVRE D'OR — trois voix, posées comme le reste : à nu ── */}
        <section className="py-40 bg-black border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-16 italic">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Le livre d'or</>)}</span>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                 {resolveList(
                   clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
                   [
                     { text: "Vingt couverts, aucun menu, aucun choix à faire — et le meilleur repas de mon année.", author: "Claire D.", detail: "novembre" },
                     { text: "Le silence entre les pièces fait partie du repas. On en ressort calmé.", author: "Louis A.", detail: "septembre" },
                     { text: "Le comptoir privatisé pour huit : un service d'une précision rare.", author: "Mathilde R.", detail: "juin" },
                   ],
                 ).map((a: any, i: number) => (
                   <Reveal key={i} delay={i * 0.1}>
                     <figure className="h-full flex flex-col">
                        <blockquote className="text-xl font-light italic text-white/60 leading-relaxed mb-10 flex-1">« {a.text} »</blockquote>
                        <figcaption className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 border-t border-white/5 pt-6">
                           {a.author}{a.detail ? ` — ${a.detail}` : ""}
                        </figcaption>
                     </figure>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="#hero" className="flex items-center gap-4 mb-10 group">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black font-black text-sm uppercase">K</span>
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-white">{fd?.businessName ?? clientName(sessionData) ?? "Kuro Omakase"}</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 « Dans le silence de la salle, la seule histoire racontée est celle de la saison. »
                 <br />
                 {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "75002", "Paris")}
                 {" · "}{clientPhone(sessionData) ?? fd?.phone ?? "01 42 00 00 00"}
                 {" · "}{clientEmail(sessionData) ?? fd?.email ?? "table@kuro-omakase.fr"}
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Le journal", "La presse", "Contact"].map(s => (
                   <Link key={s} href="#contact" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "LA MAISON", l: ["Le chef", "Le rituel", "L'arrivage", "Le comptoir"] },
             { t: "LE SERVICE", l: ["Service du soir", "Privatisation", "Bons cadeaux", "Le journal"] },
             { t: "PRATIQUE", l: ["Annulation", "Confidentialité", "Allergènes", "CGV"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#contact">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 {fd?.businessName ?? clientName(sessionData) ?? "Kuro Omakase"}{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — {clientTrade(sessionData) ?? "Restaurant omakase"}</span>
           <div className="flex gap-8 normal-case tracking-normal not-italic">
              <span>Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
              <span>Éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
           </div>
        </div>
      </footer>

      {/* ── RESERVATION MODAL ─────────── */}
      <AnimatePresence>
        {reservationOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-modal-title"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={closeReservationModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={closeReservationModal}
                aria-label="Close"
                className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>

              <div className="p-8 md:p-12">
                {reservationSent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white mx-auto mb-10 flex items-center justify-center">
                      <span className="text-black font-black text-2xl">&#10003;</span>
                    </div>
                    <h3 className="text-3xl font-light uppercase tracking-widest text-white mb-6 italic">Demande envoyée</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-light italic mb-10">
                      Le maître d'hôtel confirme chaque table sous 24 heures. Surveillez votre boîte mail — huit couverts par service, pas davantage.
                    </p>
                    <button
                      type="button"
                      onClick={closeReservationModal}
                      className="px-12 py-4 min-h-[44px] bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-4">{clientCity(sessionData) ?? "Paris"} — Le comptoir</div>
                    <h3 id="reservation-modal-title" className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white mb-10 italic">Réserver<br /><span className="font-black not-italic">une table.</span></h3>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="res-date" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Date</label>
                          <input
                            id="res-date"
                            type="date"
                            required
                            value={reservationForm.date}
                            onChange={(e) => setReservationForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="res-time" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Service</label>
                          <select
                            id="res-time"
                            required
                            value={reservationForm.time}
                            onChange={(e) => setReservationForm(f => ({ ...f, time: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
                          >
                            <option value="" className="bg-black">Choisir un service</option>
                            <option value="19:00" className="bg-black">Service I — 19 h</option>
                            <option value="21:30" className="bg-black">Service II — 21 h 30</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="res-party" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Nombre de couverts</label>
                        <select
                          id="res-party"
                          required
                          value={reservationForm.party}
                          onChange={(e) => setReservationForm(f => ({ ...f, party: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n} className="bg-black">{n} {n === 1 ? "couvert" : "couverts"}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="res-name" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Nom complet</label>
                        <input
                          id="res-name"
                          type="text"
                          required
                          value={reservationForm.name}
                          onChange={(e) => setReservationForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Camille Moreau"
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="res-email" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Courriel</label>
                          <input
                            id="res-email"
                            type="email"
                            required
                            value={reservationForm.email}
                            onChange={(e) => setReservationForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="vous@mail.fr"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="res-phone" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Téléphone</label>
                          <input
                            id="res-phone"
                            type="tel"
                            required
                            value={reservationForm.phone}
                            onChange={(e) => setReservationForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="06 00 00 00 00"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={reservationLoading}
                      className="w-full mt-10 px-10 py-4 min-h-[44px] bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-3"
                    >
                      {reservationLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Envoi…
                        </>
                      ) : "Envoyer la demande"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
