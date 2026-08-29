"use client";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Compass, Calendar, Users, Star, ArrowLeft, Globe, Sun, Cloud, Wind, Search, Menu, X, Plane, Coffee, Camera } from "lucide-react";

import "../premium.css";
import { resolveList } from "@/lib/templates/resolveList";
import { PortalZoom } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import {
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
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
   DATA STRUCTURES
   ========================================================================== */

function DESTINATIONS_DEMO_LIVE() {
  return [
  {
    id: "dst-01",
    title: "La Suite Horizon",
    country: "Vue mer",
    price: "420 €",
    days: "48 m²",
    desc: "Le dernier étage, une baie à 180° sur la Méditerranée, et le petit-déjeuner servi en terrasse au lever du jour.",
    image:
      (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/18386168/pexels-photo-18386168.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    color: "var(--brand,#d97736)",
  },
  {
    id: "dst-02",
    title: "La Chambre des Pins",
    country: "Côté jardin",
    price: "240 €",
    days: "28 m²",
    desc: "Le calme du jardin de pins, un lit à la française et la lumière du matin filtrée par les persiennes.",
    image:
      (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/20873970/pexels-photo-20873970.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    color: "#b45309",
  },
  {
    id: "dst-03",
    title: "La Suite du Cap",
    country: "Angle sud",
    price: "340 €",
    days: "36 m²",
    desc: "Deux expositions, un salon d'angle, et le soleil du soir jusqu'à la dernière minute.",
    image:
      (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/6173322/pexels-photo-6173322.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    color: "#c2410c",
  },
  {
    id: "dst-04",
    title: "La Villa du Jardin",
    country: "Indépendante",
    price: "560 €",
    days: "64 m²",
    desc: "Une maison dans la maison : entrée privée, terrasse plantée, et le service de l'hôtel à portée de sonnette.",
    image:
      (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=1600&auto=format&fit=crop"),
    color: "#9a3412",
  },
];
}
let DESTINATIONS_DEMO = DESTINATIONS_DEMO_LIVE();

function EXPERIENCES_DEMO_LIVE() {
  return [
  {
    title: "Le spa & les bains",
    icon: <Compass className="w-6 h-6 text-amber-500" />,
    desc: "Bassin intérieur, hammam et cabines de soin — réservés aux hôtes, du matin au soir.",
  },
  {
    title: "La table d'hôtes",
    icon: <Plane className="w-6 h-6 text-amber-500" />,
    desc: "Une carte courte, le marché du jour, et le dîner servi en terrasse dès les premiers soirs doux.",
  },
  {
    title: "La conciergerie",
    icon: <Coffee className="w-6 h-6 text-amber-500" />,
    desc: "Tables introuvables, criques sans nom, chauffeur, bateau — demandez d'abord, on s'occupe du reste.",
  },
  {
    title: "Le rooftop",
    icon: <Camera className="w-6 h-6 text-amber-500" />,
    desc: "Le toit de " + (clientCity(sessionData) ?? "Nice") + " pour vous seuls : bar au coucher du soleil, séances de yoga à l'aube.",
  },
];
}
let EXPERIENCES_DEMO = EXPERIENCES_DEMO_LIVE();

const REVIEWS_SOURCE = [
  {
    text: "La Suite Horizon tient sa promesse : on ouvre les rideaux et la mer entre dans la chambre. Petit-déjeuner en terrasse inoubliable.",
    author: "Marc T.",
    role: "Séjour de mai",
  },
  {
    text: "La conciergerie nous a trouvé une table le samedi soir et un bateau le dimanche matin. Tout, sans une seule friction.",
    author: "Elena R.",
    role: "Week-end en amoureux",
  },
  {
    text: "On ne vend pas des nuits ici, on compose des séjours. Le spa à 7 h du matin, seuls au monde — ça n'a pas de prix.",
    author: "Julian S.",
    role: "Habitué de la maison",
  },
];
let REVIEWS_DEMO = REVIEWS_SOURCE;

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function WanderlustPage() {
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
  EXPERIENCES_DEMO = EXPERIENCES_DEMO_LIVE();
  DESTINATIONS_DEMO = DESTINATIONS_DEMO_LIVE();

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 1;
    const _photoArrays: any[] = [DESTINATIONS_DEMO];
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
  REVIEWS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...REVIEWS_SOURCE[i % REVIEWS_SOURCE.length], author: r.author, text: r.text })),
    REVIEWS_SOURCE,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const DESTINATIONS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      id: DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].id,
      title: s.title ?? s.name,
      country: DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].country,
      price: s.price ?? DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].price,
      days: DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].days,
      desc: s.description ?? s.desc ?? DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].desc,
      image: DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].image,
      color: DESTINATIONS_DEMO[i % DESTINATIONS_DEMO.length].color,
    })),
    DESTINATIONS_DEMO
  );
  const EXPERIENCES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      title: s.title ?? s.name,
      icon: EXPERIENCES_DEMO[i % EXPERIENCES_DEMO.length].icon,
      desc: s.description ?? s.desc ?? EXPERIENCES_DEMO[i % EXPERIENCES_DEMO.length].desc,
    })),
    EXPERIENCES_DEMO
  );
  const REVIEWS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      text: r.text ?? REVIEWS_DEMO[i % REVIEWS_DEMO.length].text,
      author: r.name ?? REVIEWS_DEMO[i % REVIEWS_DEMO.length].author,
      role: r.location ?? REVIEWS_DEMO[i % REVIEWS_DEMO.length].role,
    })),
    REVIEWS_DEMO
  );

  const [activeDst, setActiveDst] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextDst = () =>
    setActiveDst((prev) => (prev + 1) % DESTINATIONS.length);
  const prevDst = () =>
    setActiveDst(
      (prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length,
    );

  return (
    <div className="premium-theme min-h-dvh bg-[#0c0a09] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0a09]/90 backdrop-blur-md py-4 border-b border-amber-900/20" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="#hero"
            className="text-xl md:text-2xl font-bold tracking-tighter uppercase flex items-center gap-2"
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                {fd?.businessName ?? clientName(sessionData) ?? <>Wander<span className="text-amber-500">Lust.</span></>}
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#hero" className="hover:text-amber-500 transition-colors">
              Chambres & suites
            </Link>
            <Link href="#apropos" className="hover:text-amber-500 transition-colors">
              Les expériences
            </Link>
            <Link href="#contact" className="hover:text-amber-500 transition-colors">
              La suite signature
            </Link>
            <Link href="#contact" className="hover:text-amber-500 transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-stone-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="px-6 py-2.5 bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm">
              Réserver un séjour
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-stone-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#0c0a09] p-6 pt-24 flex flex-col"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-6 text-stone-400"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-8 text-3xl font-light">
              <Link href="#hero" onClick={() => setMenuOpen(false)}>
                Chambres & suites
              </Link>
              <Link href="#apropos" onClick={() => setMenuOpen(false)}>
                Les expériences
              </Link>
              <Link href="#contact" onClick={() => setMenuOpen(false)}>
                La suite signature
              </Link>
              <Link href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
            <div className="mt-auto mb-8">
              <button className="w-full py-4 bg-amber-500 text-[#0c0a09] text-xs font-bold uppercase tracking-widest rounded-sm">
                Réserver un séjour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO CAROUSEL
          ========================================== */}
      <section id="hero" className="relative w-full h-[100svh] overflow-hidden bg-[#0c0a09]">
        {/* Le geste : PortalZoom — on traverse la BAIE VITRÉE de la chambre
            pour entrer dans la suivante. La baie (angles arrondis, large) se
            distingue de la fenêtre de château d'impact-369 et de la voûte de
            cave d'impact-381. Le fond sombre porte la scène sans photo. */}
        <PortalZoom
          images={DESTINATIONS.map((d: any) => d.image)}
          index={activeDst}
          portal="inset(16% 26% 0% 26% round 28px 28px 0 0)"
          overlay={0.35}
        />
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-24 md:pb-32 pt-32 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
            {/* Left Info */}
            <div className="lg:col-span-8 pointer-events-auto">
              <motion.div
                key={`info-${activeDst}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 mb-5">{clientEyebrow(sessionData) ?? `Hôtel & maison de bord de mer · ${clientCity(sessionData) ?? "Nice"}`}</div>
                <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-6">{clientHeroLine(sessionData, 0, 1, 28) ?? c?.heroHeadline ?? <>
                  {DESTINATIONS[activeDst % DESTINATIONS.length].title}
                </>}</h1>
                <p className="text-lg md:text-xl text-stone-300 max-w-2xl leading-relaxed mb-8 font-light">{fd?.tagline ?? c?.heroSubline ?? <>
                  {DESTINATIONS[activeDst % DESTINATIONS.length].desc}
                </>}</p>
                <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />{" "}
                    {DESTINATIONS[activeDst % DESTINATIONS.length].days}
                  </div>
                  <div className="flex items-center gap-2 text-amber-500">
                    {DESTINATIONS[activeDst % DESTINATIONS.length].price}{" "}
                    <span className="text-stone-500">/nuit</span>
                  </div>
                </div>
                <button className="mt-10 px-8 py-4 bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm flex items-center gap-3">
                  Voir la chambre <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Right Controls & Thumbnails */}
            <div className="lg:col-span-4 flex flex-col items-end gap-8 pointer-events-auto hidden md:flex">
              <div className="flex gap-4">
                <button
                  onClick={prevDst}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextDst}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                {DESTINATIONS.map((dst, i) => (
                  <button
                    key={dst.id}
                    onClick={() => setActiveDst(i)}
                    className={`relative w-24 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${activeDst === i ? "border-amber-500 scale-110" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    <Image
                      src={dst.image}
                      alt={dst.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. METRICS / STATS
          ========================================== */}
      <section className="py-12 bg-amber-500 text-[#0c0a09] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-amber-600/30">
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">{clientStats(sessionData)?.[0]?.value ?? "1927"}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{clientStats(sessionData)?.[0]?.label ?? "La maison, depuis"}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">{clientStats(sessionData)?.[1]?.value ?? "34"}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{clientStats(sessionData)?.[1]?.label ?? "Chambres et suites"}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">{clientStats(sessionData)?.[2]?.value ?? "4,9/5"}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{clientStats(sessionData)?.[2]?.label ?? "Note des voyageurs"}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">{clientStats(sessionData)?.[3]?.value ?? "7 j/7"}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{clientStats(sessionData)?.[3]?.label ?? "Conciergerie"}</div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. EXPERIENCES GRID
          ========================================== */}
      <section id="apropos" className="py-32 bg-[#0c0a09] border-y border-stone-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-bold block mb-4">
              La maison
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "maison.titre") ?? c?.aboutTitle ?? <>
              L'art de recevoir, face à la mer.
            </>}</h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">{/* TEXTE_SECTION */ clientText(sessionData, "maison.texte") ?? c?.aboutText ?? <>
              Une maison de 1927, réveillée pièce par pièce : le spa dans les
              anciennes citernes, la table sous la pergola, et des chambres où
              rien ne sonne, rien ne clignote.
            </>}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-2xl bg-stone-900/30 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900/80 transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-[#0c0a09] border border-stone-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {exp.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{exp.title}</h3>
                  <p className="text-stone-400 leading-relaxed font-light">
                    {exp.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. FEATURED ITINERARY (Split Layout)
          ========================================== */}
      <section id="contact" className="py-32 bg-[#0a0807] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal className="relative aspect-[4/5] rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src={photo(4, "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200&auto=format&fit=crop")}
                alt="La suite signature au dernier étage"
                fill
                className="object-cover hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm">
                    Dernier étage
                  </span>
                  <span className="px-3 py-1 bg-black/40 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm">
                    64 m²
                  </span>
                </div>
                <h3 className="text-3xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "signature.legende") ?? (<>La Suite Signature</>)}</h3>
              </div>
            </Reveal>

            <div className="order-1 lg:order-2">
              <Reveal>
                <span className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-bold block mb-4">
                  La suite signature
                </span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                  {/* TEXTE_SECTION */ clientText(sessionData, "signature.titre") ?? (<>Dormir au-dessus de la ville.</>)}
                </h2>
                <p className="text-stone-400 text-lg leading-relaxed font-light mb-10">
                  {/* TEXTE_SECTION */ clientText(sessionData, "signature.texte") ?? (<>Tout le dernier étage, une terrasse plantée qui fait le tour, et la
                  Méditerranée pour seul vis-à-vis. La suite se réserve tôt —
                  elle est seule de son espèce.</>)}
                </p>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Star className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        La terrasse à 360°
                      </h4>
                      <p className="text-sm text-stone-500">
                        Petit-déjeuner au soleil levant, dîner au couchant — sans quitter l'étage.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        Le service dédié
                      </h4>
                      <p className="text-sm text-stone-500">
                        Une gouvernante et la conciergerie en ligne directe, de l'arrivée au départ.
                      </p>
                    </div>
                  </li>
                </ul>

                <button className="px-8 py-4 border border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-[#0c0a09] transition-colors rounded-sm">
                  Réserver la suite
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS MARQUEE
          ========================================== */}
      <section className="py-32 bg-[#0c0a09] border-y border-stone-800/50 overflow-hidden">
        <div className="mb-16 text-center px-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-4">
            Le livre d'or
          </span>
          <h2 className="text-4xl font-bold tracking-tighter">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
            Des séjours qui restent
          </>)}</h2>
        </div>

        <div className="relative flex whitespace-nowrap">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0c0a09] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0c0a09] to-transparent z-10" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 px-4"
          >
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div
                key={i}
                className="w-[400px] md:w-[500px] border border-stone-800 p-10 bg-[#0a0807] whitespace-normal shrink-0 rounded-xl"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-lg italic text-stone-300 leading-relaxed mb-8 font-light">
                  "{r.text}"
                </p>
                <div>
                  <div className="font-bold text-stone-100">{r.author}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest">
                    {r.role}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          6. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#0a0807] pt-32 pb-12 px-6 md:px-12 border-t border-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div>
              <Reveal>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                  {/* TEXTE_SECTION */ clientText(sessionData, "cta.titre") ?? (<>Prêts pour <br /><span className="text-amber-500">le large ?</span></>)}
                </h2>
                <p className="text-stone-400 text-lg max-w-md">
                  {/* TEXTE_SECTION */ clientText(sessionData, "cta.texte") ?? (<>La réception répond à toute heure, et la maison se réserve tôt en saison.</>)}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <button className="px-10 py-5 bg-amber-500 text-stone-900 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm flex items-center gap-3">
                Réserver un séjour <ArrowRight className="w-5 h-5" />
              </button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-stone-800 mb-16">
            <div className="lg:col-span-1">
              <Link
                href="#hero"
                className="text-2xl font-bold tracking-tighter uppercase mb-6 block"
              >
                {fd?.businessName ?? clientName(sessionData) ?? <>Wander<span className="text-amber-500">Lust.</span></>}
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Hôtel & maison de bord de mer · {clientCity(sessionData) ?? "Nice"}
              </p>
              <div className="space-y-2 text-sm text-stone-500">
                <div>{clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "06000", "Nice")}</div>
                <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33493000000").replace(/\s/g, "")}`} className="block hover:text-amber-500 transition-colors">{clientPhone(sessionData) ?? fd?.phone ?? "04 93 00 00 00"}</a>
                <a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "sejour@wanderlust-hotel.fr"}`} className="block hover:text-amber-500 transition-colors">{clientEmail(sessionData) ?? fd?.email ?? "sejour@wanderlust-hotel.fr"}</a>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                La maison
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Chambres & suites
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    La table d'hôtes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Le spa & les bains
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Le rooftop
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                Pratique
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Notre histoire
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Accès & parking
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Le journal de la maison
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                La lettre de la maison
              </h4>
              <p className="text-sm text-stone-400 mb-4">
                Les dates d'ouverture, les soirées de la table, les offres de
                basse saison.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre courriel"
                  className="bg-transparent border-b border-stone-700 px-0 py-3 flex-1 text-sm focus:outline-none focus:border-amber-500 text-white transition-colors"
                />
                <button
                  type="submit"
                  className="border-b border-stone-700 px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:text-amber-500 text-stone-500 transition-colors"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-stone-800 text-[10px] uppercase tracking-widest font-bold text-stone-600">
            <span>
              &copy; {new Date().getFullYear()} {fd?.businessName ?? clientName(sessionData) ?? "Wanderlust"}
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <div className="flex gap-6 normal-case tracking-normal">
              <span>Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
              <span>Éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
