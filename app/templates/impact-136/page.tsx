"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck
/*
  impact-136 — Studio de décoration. L'agence web devient le studio
  d'intérieurs qu'on vendait, et garde son text-mask : le titre en réserve
  blanche s'ouvre au défilement sur la photo du lieu.
  Geste : DifferentialExit — dans le manifeste, le titre, les paragraphes et
  le numéro fantôme ne partent pas à la même vitesse (trois plans, trois
  rythmes ; application distincte de 316 qui le porte sur son héros).
  Fontes P9 Syne + Work Sans · palette #f5f3ef / #8a5a3c.
*/

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";

import "../premium.css";
import { DifferentialExit } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import {
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
  clientText,
  clientWorks,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ==========================================================================
   DONNÉES DE DÉMONSTRATION — le studio
   ========================================================================== */

function WORKS_DEMO_LIVE() {
  return [
  {
    id: "01",
    client: "Appartement Haussmann",
    category: "Rénovation complète",
    year: "2025",
    desc: "Cent dix mètres carrés rendus à leur hauteur sous plafond, moulures restaurées, cuisine ouverte dessinée sur mesure.",
    image:
      (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop"),
  },
  {
    id: "02",
    client: "Maison de ville",
    category: "Décoration & mobilier",
    year: "2024",
    desc: "Palette minérale, lin lavé et noyer : une maison de famille apaisée sans rien effacer de son histoire.",
    image:
      (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"),
  },
  {
    id: "03",
    client: "Loft des Chartrons",
    category: "Agencement sur mesure",
    year: "2024",
    desc: "Une verrière d'atelier, une bibliothèque de neuf mètres et des rangements invisibles pour un plateau sans cloison.",
    image:
      (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop"),
  },
  {
    id: "04",
    client: "Cabinet médical",
    category: "Espaces professionnels",
    year: "2023",
    desc: "Une salle d'attente qui n'angoisse personne : acoustique traitée, lumière indirecte, matières chaleureuses.",
    image:
      (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"),
  },
];
}
let WORKS_DEMO = WORKS_DEMO_LIVE();
let WORKS = WORKS_DEMO;

const SERVICES_SOURCE = [
  {
    title: "Conseil & direction artistique",
    desc: "Une visite, un relevé, un cahier de recommandations chiffré : la direction claire avant d'engager le moindre travaux.",
    prix: "dès 390 €",
  },
  {
    title: "Rénovation complète",
    desc: "Plans, choix des artisans, suivi de chantier hebdomadaire et réception : un seul interlocuteur du premier croquis aux clés.",
    prix: "sur devis",
  },
  {
    title: "Agencement sur mesure",
    desc: "Bibliothèques, dressings, claustras et cuisines dessinés au millimètre, fabriqués par nos ébénistes partenaires.",
    prix: "sur devis",
  },
  {
    title: "Décoration & stylisme",
    desc: "Palette, mobilier, luminaires, rideaux : la couche finale qui fait tenir l'ensemble — posée en une semaine.",
    prix: "dès 90 €/m²",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_DEMO;

const PROCESS = [
  {
    phase: "01. L'écoute & le relevé",
    detail:
      "Comment vous vivez, ce qui coince, ce qui doit rester. On mesure tout, on photographie tout, on n'invente rien.",
  },
  {
    phase: "02. L'esquisse",
    detail:
      "Deux directions dessinées, pas dix. Plans, volumes et budget posés noir sur blanc avant tout engagement.",
  },
  {
    phase: "03. La direction artistique",
    detail:
      "Matières, teintes, mobilier, lumière : un carnet unique qui sert de loi au chantier — et vous évite mille décisions.",
  },
  {
    phase: "04. Le chantier & la réception",
    detail:
      "Artisans coordonnés, passage hebdomadaire, réserves levées. Vous entrez dans un lieu terminé, pas dans une promesse.",
  },
];

/* ==========================================================================
   COMPOSANTS UTILITAIRES
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   PAGE PRINCIPALE
   ========================================================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}
export default function TextRevealPage() {
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
  WORKS_DEMO = WORKS_DEMO_LIVE();

  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      title: s.title,
      desc: s.desc || SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
      ...(s.price ? { prix: s.price } : {}),
    })),
    SERVICES_SOURCE,
  );
  WORKS = /* REALISATIONS */ resolveList(
    clientWorks(sessionData)?.map((o: any, i: number) => ({
      ...WORKS_DEMO[i % WORKS_DEMO.length],
      client: o.title,
      ...(o.detail ? { category: o.detail } : {}),
      ...(o.imageUrl ? { image: o.imageUrl } : {}),
    })),
    WORKS_DEMO.map((row, i) => ({
      ...row,
      image: clientPhotos(session)[0 + i] || row.image,
    })),
  );
  SERVICES = SERVICES_DEMO;
  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
    [
      { text: "Le studio a vu en une visite ce qu'on ne voyait plus depuis dix ans. Le chantier a duré ce qui était écrit.", author: "Hélène & Marc", detail: "rénovation complète" },
      { text: "Un carnet de direction artistique si précis que même le carreleur en parlait. Le résultat est exactement le dessin.", author: "Sophie L.", detail: "maison de ville" },
      { text: "La bibliothèque sur mesure a réconcilié le salon avec ses 4 mètres sous plafond.", author: "Julien P.", detail: "agencement" },
    ],
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Le text-mask : un rectangle blanc à texte noir, multiplié sur la photo.
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 5]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1.2, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ville = clientCity(sessionData) ?? "Bordeaux";
  const tel = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "05 56 81 44 07";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "bonjour@studio-interieur.fr";

  return (
    <div className="i136 premium-theme min-h-dvh bg-[#f5f3ef] text-[#221b14] selection:bg-[var(--brand,#8a5a3c)] selection:text-white" style={{ fontFamily: "'Work Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        .i136 h1, .i136 h2, .i136 h3, .i136 h4, .i136 .titre { font-family: 'Syne', 'Work Sans', sans-serif; }
      `}</style>
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#f5f3ef]/85 backdrop-blur-md py-4 border-b border-[#221b14]/10" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between mix-blend-difference text-white">
          <Link
            href="#hero"
            className="text-xl md:text-2xl font-bold tracking-tighter uppercase flex items-center gap-2 titre"
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>{clientName({ formData: fd }) ?? "Studio Intérieur"}</>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#realisations-liste" className="hover:opacity-60 transition-opacity">
              Réalisations
            </Link>
            <Link href="#prestations" className="hover:opacity-60 transition-opacity">
              Prestations
            </Link>
            <Link href="#methode" className="hover:opacity-60 transition-opacity">
              La méthode
            </Link>
          </div>

          <a href={`mailto:${mail}`} className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
            Parler de votre projet <ArrowRight className="w-4 h-4" />
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#f5f3ef]/95 backdrop-blur-md border-t border-[#221b14]/10 px-6 py-6 flex flex-col gap-6">
            <Link href="#realisations-liste" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-[#221b14]/70 hover:text-[#221b14]">Réalisations</Link>
            <Link href="#prestations" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-[#221b14]/70 hover:text-[#221b14]">Prestations</Link>
            <Link href="#methode" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-[#221b14]/70 hover:text-[#221b14]">La méthode</Link>
            <Link href="#contact" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-[#221b14]/70 hover:text-[#221b14]">Parler de votre projet</Link>
          </div>
        )}
      </nav>

      {/* ==========================================
          1. LE TEXT-MASK — conservé tel quel
          ========================================== */}
      <section id="hero" ref={containerRef} className="relative w-full h-[200vh]">
        <div className="sticky top-0 w-full h-dvh overflow-hidden bg-[#221b14] flex items-center justify-center">
          {/* La photo du lieu, révélée à travers le titre */}
          <motion.div
            style={{ scale: bgScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={photo(4, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop")}
              alt="Intérieur signé par le studio"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            {/* Repli sans photo : un dégradé terre, jamais un trou noir. */}
            <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(160deg, #2c221a 0%, #4a382b 55%, #8a5a3c 130%)" }} />
          </motion.div>

          {/* Le calque-masque */}
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply bg-white"
          >
            <div className="w-full h-full bg-white flex items-center justify-center">
              <h1 className="text-[15vw] font-black tracking-tighter text-black leading-none text-center uppercase">{<>{clientHeroLine(sessionData, 0, 2, 8) ?? "Habiter"}<br />{clientHeroLine(sessionData, 1, 2, 10) ?? "Autrement"}</>}</h1>
            </div>
          </motion.div>

          {/* Indicateur de défilement */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 text-white"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Faites défiler pour entrer
            </span>
            <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          2. LE MANIFESTE — DifferentialExit, trois plans
          ========================================== */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-[#f5f3ef] relative z-20 -mt-[50vh] overflow-hidden">
        {/* Le numéro fantôme — l'arrière-plan, part lentement. */}
        <DifferentialExit depth={0.05} style={{ position: "absolute", right: "-2%", top: "6%", pointerEvents: "none", zIndex: 0 }}>
          <span aria-hidden className="titre font-extrabold leading-none select-none" style={{ fontSize: "clamp(180px,30vw,420px)", color: "rgba(138,90,60,0.07)" }}>01</span>
        </DifferentialExit>
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* H4 éditorial décalé : le titre démarre en retrait, la 2e ligne revient. */}
          <DifferentialExit depth={0.9}>
            <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-semibold leading-[1.05] tracking-tight mb-16 md:pl-[12%]">{/* TEXTE_SECTION */ clientText(sessionData, "manifeste.titre") ?? (<>
              Nous dessinons des intérieurs{" "}
              <span className="block md:-ml-[12%] text-[var(--brand,#8a5a3c)]">
                qui ne s'oublient pas.
              </span>
            </>)}</h2>
          </DifferentialExit>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#5d5347] text-xl font-light leading-relaxed md:pl-[12%]">
            <DifferentialExit depth={0.55}>
              <p>{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                Un lieu réussi ne se décrète pas sur un moodboard : il se
                relève au mètre, se dessine, se chiffre — puis se tient. Le
                studio conduit tout, du premier croquis à la réception.
              </>}</p>
            </DifferentialExit>
            <DifferentialExit depth={0.35}>
              <p>{c?.aboutText ?? <>
                Nous travaillons les volumes avant les objets, la lumière avant
                les couleurs, et nous n'achetons rien qui ne serve la façon
                dont vous vivez vraiment.
              </>}</p>
            </DifferentialExit>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. RÉALISATIONS (liste à survol)
          ========================================== */}
      <section id="realisations-liste" className="py-24 bg-[#efeae2] border-y border-[#221b14]/10 relative">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20 flex justify-between items-end">
          <Reveal>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8a7a68] block mb-4">
              Archives du studio
            </span>
            <h2 className="text-5xl font-semibold tracking-tight">{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>
              Lieux livrés
            </>)}</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="#contact" className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-1 border-b border-[#221b14]/20 hover:border-[#221b14] transition-colors">
              Visiter sur rendez-vous <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        <div className="border-t border-[#221b14]/10">
          {WORKS.map((work, i) => (
            <div
              key={work.id ?? i}
              className="group relative border-b border-[#221b14]/10"
              onMouseEnter={() => setHoveredWork(work.id)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              {/* La photo du lieu, révélée au survol (bureau) */}
              <div
                className={`absolute inset-0 z-0 overflow-hidden hidden md:block transition-opacity duration-500 ${hoveredWork === work.id ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={work.image}
                  alt={work.client}
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-[#f5f3ef]/40 backdrop-blur-[2px]" />
              </div>

              <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 cursor-pointer">
                <div className="flex items-center gap-8 md:gap-16 md:w-1/2">
                  <span className="font-mono text-[#a3937f] text-sm">
                    {work.id}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-semibold tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                    {work.client}
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-16 w-full md:w-1/2 text-sm text-[#6b6257]">
                  <span className="uppercase tracking-widest">
                    {work.category}
                  </span>
                  <span className="font-mono">{work.year}</span>
                  <div className="w-12 h-12 rounded-full border border-[#221b14]/20 flex items-center justify-center group-hover:bg-[var(--brand,#8a5a3c)] group-hover:text-white group-hover:border-[var(--brand,#8a5a3c)] transition-all duration-300 md:ml-auto">
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>

                {/* Photo visible en mobile */}
                <div className="w-full aspect-[21/9] relative rounded-lg overflow-hidden md:hidden mt-4 bg-[#e4dccf]">
                  <Image
                    src={work.image}
                    alt={work.client}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. PRESTATIONS
          ========================================== */}
      <section id="prestations" className="py-32 bg-[#f5f3ef]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>
              Ce que le studio prend en charge
            </>)}</h2>
            <p className="text-[#6b6257] text-lg">
              Quatre façons de travailler ensemble — du simple conseil à la
              maison entière, toujours au prix écrit d'avance.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#221b14]/10 rounded-2xl bg-white/60 hover:bg-white transition-colors h-full flex flex-col">
                  <span className="titre text-4xl font-bold text-[var(--brand,#8a5a3c)]/30 mb-8">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-[#6b6257] text-sm leading-relaxed flex-1">
                    {service.desc}
                  </p>
                  <div className="mt-8 pt-4 border-t border-[#221b14]/10 text-[11px] font-bold uppercase tracking-widest text-[var(--brand,#8a5a3c)]">
                    {service.prix}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4.5 LA CONVICTION + AVIS
          ========================================== */}
      <section id="contact" className="py-32 bg-[#efeae2] relative overflow-hidden border-y border-[#221b14]/10">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8a7a68] block mb-8">
              La conviction du studio
            </span>
            <h2 className="text-3xl md:text-5xl font-light leading-snug text-[#3d3428] mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "conviction.titre") ?? (<>
              « Un intérieur réussi ne se voit pas d'abord :{" "}
              <span className="text-[var(--brand,#8a5a3c)] font-medium">il se ressent</span>. La
              lumière tombe juste, les gestes du quotidien{" "}
              <span className="text-[var(--brand,#8a5a3c)] font-medium">trouvent leur place</span>,
              et l'on ne saurait plus dire pourquoi. »
            </>)}</h2>
            <div className="flex flex-col items-center gap-4 mb-24">
              <div className="w-16 h-16 rounded-full overflow-hidden relative bg-[#ddd2c2]">
                <Image
                  src={photo(5, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop")}
                  alt="La fondatrice du studio"
                  fill
                  className="object-cover grayscale"
                />
              </div>
              <div>
                <span className="text-sm font-bold block">
                  Claire Aubert
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#8a7a68]">
                  Fondatrice & directrice artistique
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {AVIS.map((a: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="h-full flex flex-col border-l-2 border-[var(--brand,#8a5a3c)]/30 pl-6">
                  <blockquote className="text-base font-light italic text-[#5d5347] leading-relaxed mb-6 flex-1">« {a.text} »</blockquote>
                  <figcaption className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a68]">
                    {a.author}{a.detail ? ` — ${a.detail}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. LA MÉTHODE
          ========================================== */}
      <section id="methode" className="py-32 bg-[#f5f3ef] overflow-hidden">
        {/* Marquee géant */}
        <div className="relative flex whitespace-nowrap mb-32 opacity-[0.06] pointer-events-none" aria-hidden>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 px-6"
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="titre text-[12rem] font-extrabold tracking-tighter leading-none text-[var(--brand,#8a5a3c)]"
              >
                MÉTHODE
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 -mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <h2 className="text-4xl font-semibold mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>Quatre temps, pas un de plus</>)}</h2>
                <p className="text-[#6b6257]">
                  Le même déroulé pour un salon ou une maison entière — c'est
                  lui qui tient les délais et le budget.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {PROCESS.map((p, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="border-t border-[#221b14]/15 pt-6">
                      <h4 className="text-xl font-semibold mb-4">{p.phase}</h4>
                      <p className="text-[#6b6257] text-sm leading-relaxed">
                        {p.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. PIED DE PAGE & CONTACT
          ========================================== */}
      <footer className="bg-[#221b14] text-[#f5f3ef] pt-32 pb-12 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--brand,#8a5a3c)]/15 blur-[150px] rounded-t-full pointer-events-none" aria-hidden />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div>
              <Reveal>
                <h2 className="text-6xl md:text-[7rem] font-semibold tracking-tighter leading-[0.95] mb-8">
                  Parlons de <br />
                  <span className="text-[var(--brand,#c89b78)]">votre intérieur.</span>
                </h2>
                <a
                  href={`mailto:${mail}`}
                  className="text-2xl md:text-4xl font-light hover:text-[#c89b78] transition-colors border-b border-white/20 pb-2 break-all"
                >
                  {mail}
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex flex-col gap-6 text-sm text-[#f5f3ef]/70">
              <a href={telHref} className="flex items-center gap-3 hover:text-white transition-colors"><Phone className="w-4 h-4 text-[var(--brand,#c89b78)]" /> {tel}</a>
              <span className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[var(--brand,#c89b78)]" /> {clientCodePostalVille(sessionData, "33000", "Bordeaux")}</span>
              <a href={`mailto:${mail}`} className="flex items-center gap-3 hover:text-white transition-colors"><Mail className="w-4 h-4 text-[var(--brand,#c89b78)]" /> Sur rendez-vous, à l'atelier</a>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-white/10 mb-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#f5f3ef]/40 mb-6">
                L'atelier
              </h4>
              <ul className="space-y-4 text-sm text-[#f5f3ef]/70">
                <li>
                  <strong className="text-white block mb-1">{clientName(sessionData) ?? "Studio Intérieur"}</strong>{" "}
                  {clientCodePostalVille(sessionData, "33000", "Bordeaux")}
                </li>
                <li className="pt-2">
                  Reçoit sur rendez-vous,<br /> du mardi au samedi.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#f5f3ef]/40 mb-6">
                Suivre le studio
              </h4>
              <ul className="space-y-4 text-sm text-[#f5f3ef]/70">
                <li>
                  <Link href="#hero" className="hover:text-white transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#hero" className="hover:text-white transition-colors">
                    Pinterest
                  </Link>
                </li>
                <li>
                  <Link href="#realisations-liste" className="hover:text-white transition-colors">
                    Les réalisations
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#f5f3ef]/40 mb-6">
                Le carnet du studio
              </h4>
              <p className="text-sm text-[#f5f3ef]/70 mb-4">
                Un lieu livré par saison, raconté du relevé à la réception —
                photos, choix, budget.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre courriel"
                  className="bg-transparent border-b border-white/20 px-0 py-3 flex-1 text-sm focus:outline-none focus:border-white text-white transition-colors"
                />
                <button
                  type="submit"
                  className="border-b border-white/20 px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:text-white text-[#f5f3ef]/50 transition-colors"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#f5f3ef]/40">
            <span>
              © {clientName(sessionData) ?? "Studio Intérieur"}{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""} · Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <div className="flex gap-6">
              <Link href="#contact" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="#contact" className="hover:text-white transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
