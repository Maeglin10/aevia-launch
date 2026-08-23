"use client";
import { resolveList } from "@/lib/templates/resolveList";
import { CrossPush } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
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
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Disc3, Mic2, Radio, Music2, Maximize2, Headphones, Shuffle, Repeat } from "lucide-react";

import "../premium.css";
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
  clientText,
  clientTrade,
  clientWorks,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

function RELEASES_DEMO_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ title: o.title, year: o.detail || undefined, ...(o.imageUrl ? { image: o.imageUrl } : {}) })), [
  {
    id: "r-01",
    title: "Neon Genesis",
    artist: "Atelier MAO · 15-18 ans",
    year: "2024",
    duration: "4:23",
    image:
      (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/37269693/pexels-photo-37269693.jpeg?auto=compress&cs=tinysrgb&w=1000"),
    color: "#a855f7", // Purple
  },
  {
    id: "r-02",
    title: "Midnight Drive",
    artist: "Le groupe du jeudi soir",
    year: "2023",
    duration: "3:45",
    image:
      (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop"),
    color: "#ec4899", // Pink
  },
  {
    id: "r-03",
    title: "Cybernetic Heart",
    artist: "Classe de chant · duo voix-machines",
    year: "2024",
    duration: "5:12",
    image:
      (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"),
    color: "#8b5cf6", // Violet
  },
]);
}
let RELEASES_DEMO = RELEASES_DEMO_LIVE();
let RELEASES = RELEASES_DEMO;

const TRACKLIST = [
  { num: "01", title: "Overture: The Grid", duration: "2:15", plays: "1 200 écoutes" },
  {
    num: "02",
    title: "Neon Genesis",
    duration: "4:23",
    plays: "3 400 écoutes",
    highlight: true,
  },
  { num: "03", title: "Digital Rain", duration: "3:58", plays: "890 écoutes" },
  { num: "04", title: "Mainframe Breach", duration: "5:01", plays: "2 100 écoutes" },
  { num: "05", title: "Memory Leak", duration: "3:30", plays: "1 500 écoutes" },
  { num: "06", title: "System Shutdown", duration: "6:45", plays: "950 écoutes" },
];

const TOUR_DATES = [
  { date: "12 oct.", city: "Scène ouverte", venue: "L'auditorium de l'école", status: "Complet" },
  { date: "18 oct.", city: "Ateliers MAO", venue: "Restitution du trimestre — studio A", status: "Places" },
  { date: "8 nov.", city: "Café-concert", venue: "Les groupes de l'école en ville", status: "Places" },
  { date: "13 déc.", city: "Concert d'hiver", venue: "La grande salle — toutes classes", status: "Complet" },
  { date: "21 juin", city: "Fête de la musique", venue: "Le parvis, gratuit et ouvert à tous", status: "Places" },
];

/* ==========================================================================
   UTILITY COMPONENTS
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
   MAIN PAGE COMPONENT
   ========================================================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function SonicPlayerPage() {
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
  RELEASES_DEMO = RELEASES_DEMO_LIVE();

  RELEASES = RELEASES_DEMO.map((row, i) => ({
    ...row,
    image: clientPhotos(session)[0 + i] || row.image,
  }));

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 3;
    const _photoArrays: any[] = [RELEASES];
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

  const COURS_DEMO = [
    { nom: "Guitare, basse, batterie — cours individuel", prix: "dès 29 €/sem." },
    { nom: "Chant & coaching scénique", prix: "dès 32 €/sem." },
    { nom: "MAO & production — atelier collectif", prix: "45 €/mois" },
    { nom: "Groupe encadré + studio du trimestre", prix: "60 €/mois" },
  ];
  const COURS = resolveList(
    clientServices(sessionData)?.map((sv: any, n: number) => ({
      ...COURS_DEMO[n % COURS_DEMO.length],
      nom: sv.title ?? COURS_DEMO[n % COURS_DEMO.length].nom,
      prix: sv.price ?? COURS_DEMO[n % COURS_DEMO.length].prix,
    })),
    COURS_DEMO,
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRelease, setActiveRelease] = useState(0);
  const [progress, setProgress] = useState(35); // simulated percentage
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  

  // Simulate progress bar movement if playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentThemeColor = RELEASES[activeRelease].color;

  const nextRelease = () => {
    setActiveRelease((prev) => (prev + 1) % RELEASES.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevRelease = () => {
    setActiveRelease((prev) => (prev - 1 + RELEASES.length) % RELEASES.length);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="premium-theme min-h-dvh bg-[#030014] text-slate-200 font-sans selection:bg-[var(--brand,#a855f7)]/30 selection:text-white overflow-x-hidden">
      {/* Global Background Glow reflecting active release */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${currentThemeColor}, transparent 70%)`,
        }}
      />

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#030014]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="#hero"
            className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2"
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Disc3 className="w-6 h-6" />
                {fd?.businessName ?? clientName(sessionData) ?? <>SONIC<span className="font-light text-slate-500">WAVE</span></>}
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#about" className="hover:text-[var(--brand,#c084fc)] transition-colors">
              L'école
            </Link>
            <Link href="#contact" className="hover:text-[var(--brand,#c084fc)] transition-colors">
              L'équipe
            </Link>
            <Link href="#concerts" className="hover:text-[var(--brand,#c084fc)] transition-colors">
              Les concerts
            </Link>
            <Link href="#about" className="hover:text-[var(--brand,#c084fc)] transition-colors">
              Les cours
            </Link>
          </div>

          <button className="px-6 py-2 border border-[var(--brand,#a855f7)]/30 text-[var(--brand,#c084fc)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--brand,#a855f7)] hover:text-white transition-all rounded-full hidden lg:flex items-center gap-2">
            <Headphones className="w-4 h-4" /> Cours d'essai
          </button>
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 bg-[#030014]/95 backdrop-blur-md border-b border-white/5 flex flex-col gap-6 px-6 py-8 lg:hidden">
          {["L'école", "L'équipe", "Les concerts", "Les cours"].map(item => (
            <a key={item} href="#about" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-[var(--brand,#c084fc)] transition-colors">
              {item}
            </a>
          ))}
          <button className="mt-2 px-6 py-3 border border-[var(--brand,#a855f7)]/30 text-[var(--brand,#c084fc)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--brand,#a855f7)] hover:text-white transition-all rounded-full flex items-center gap-2 w-fit">
            <Headphones className="w-4 h-4" /> Cours d'essai
          </button>
        </div>
      )}

      {/* ==========================================
          1. IMMERSIVE PLAYER HERO
          ========================================== */}
      {/* Geste de signature : CrossPush — les pochettes des élèves se
          croisent plein cadre, pilotées par le même index que le lecteur.
          Le vinyle qui tournait sur sa propre horloge a disparu : ici, rien
          ne bouge sans le doigt ou l'index. Fond sombre : la page tient
          sans photo. */}
      <section id="hero" className="relative w-full min-h-dvh flex items-center pt-24 pb-12 bg-[#030014] overflow-hidden">
        <CrossPush images={RELEASES.map((r: any) => r.image)} index={activeRelease} overlay={0.62} />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#030014] via-transparent to-[#030014]/60" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
          {/* Left: Interactive Player UI */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
            <motion.div
              key={activeRelease}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left w-full"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c084fc)] mb-4">{clientEyebrow(sessionData) ?? `École de musiques actuelles · ${clientCity(sessionData) ?? "Villeurbanne"}`}</div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">{clientHeroLine(sessionData, 0, 1, 28) ?? c?.heroHeadline ?? <>
                {RELEASES[activeRelease].title}
              </>}</h1>
              <h2 className="text-2xl md:text-3xl font-light text-slate-400 mb-12">
                {RELEASES[activeRelease].artist}
              </h2>

              {/* Player Controls */}
              <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--brand,#a855f7)] to-pink-500 rounded-full relative transition-all duration-300 ease-linear"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>1:24</span>
                    <span>{RELEASES[activeRelease].duration}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-white transition-colors">
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevRelease}
                      className="text-white hover:text-[var(--brand,#c084fc)] transition-colors"
                    >
                      <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>
                    <button
                      onClick={nextRelease}
                      className="text-white hover:text-[var(--brand,#c084fc)] transition-colors"
                    >
                      <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                  </div>

                  <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==========================================
          2. TRACKLIST & DETAILS
          ========================================== */}
      <section id="about" className="py-24 bg-[#050318] border-y border-white/5 relative z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--brand,#a855f7)] block mb-4">
                L'école
              </span>
              <h3 className="text-3xl font-bold mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "about.titre") ?? (<>
                On apprend en enregistrant.
              </>)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{/* TEXTE_SECTION */ clientText(sessionData, "about.texte") ?? fd?.tagline ?? c?.heroSubline ?? <>
                Guitare, chant, batterie, MAO : ici, chaque trimestre se termine
                au studio de l'école, et chaque élève repart avec son morceau.
                Ce que vous écoutez sur cette page a été joué, enregistré et
                mixé par les élèves.
              </>}</p>
              {/* Les cours, câblés aux prestations du client. */}
              <div className="flex flex-col gap-3 mb-8">
                {COURS.map((cr: any, n: number) => (
                  <div key={n} className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10">
                    <span className="text-sm font-medium text-slate-200">{cr.nom}</span>
                    <span className="text-sm font-mono text-[var(--brand,#c084fc)] whitespace-nowrap">{cr.prix}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors rounded-sm">
                Réserver un cours d'essai
              </button>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="border border-white/10 rounded-xl bg-[#030014]/50 backdrop-blur-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                  <h4 className="text-xs font-bold uppercase tracking-widest">
                    Enregistré au studio de l'école
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    6 titres • 25:21
                  </span>
                </div>

                <div className="flex flex-col">
                  {TRACKLIST.map((track, i) => (
                    <div
                      key={i}
                      className={`group flex items-center justify-between p-4 px-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${track.highlight ? "bg-[var(--brand,#a855f7)]/10" : ""}`}
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className={`font-mono text-xs ${track.highlight ? "text-[var(--brand,#c084fc)]" : "text-slate-600"} group-hover:hidden`}
                        >
                          {track.num}
                        </span>
                        <Play
                          className={`w-4 h-4 hidden group-hover:block ${track.highlight ? "text-[var(--brand,#c084fc)]" : "text-white"}`}
                        />
                        <span
                          className={`font-medium ${track.highlight ? "text-purple-300" : "text-slate-300"}`}
                        >
                          {track.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-8 text-xs font-mono text-slate-500">
                        <span className="hidden md:block">{track.plays}</span>
                        <span>{track.duration}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-pink-500">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURED ARTISTS (Bento Grid)
          ========================================== */}
      <section id="contact" className="py-32 bg-[#030014]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              L'équipe pédagogique
            </>)}</h2>
            <p className="text-slate-400">
              Des musiciens en activité, qui enseignent ce qu'ils jouent.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Main Artist */}
            <Reveal className="md:col-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src={photo(3, "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1200&auto=format&fit=crop")}
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-[var(--brand,#a855f7)]/20 text-[var(--brand,#c084fc)] text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-[var(--brand,#a855f7)]/30">
                  Guitare & MAO
                </div>
                <h3 className="text-4xl font-bold">Kaelen Vance</h3>
              </div>
            </Reveal>

            {/* Vocalist */}
            <Reveal
              delay={0.2}
              className="relative rounded-2xl overflow-hidden group"
            >
              <Image
                src={photo(4, "https://images.pexels.com/photos/37269693/pexels-photo-37269693.jpeg?auto=compress&cs=tinysrgb&w=800")}
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-pink-500/30">
                  Chant
                </div>
                <h3 className="text-2xl font-bold">Lumina</h3>
              </div>
            </Reveal>

            {/* Studio / Label */}
            <Reveal
              delay={0.4}
              className="relative rounded-2xl overflow-hidden group bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <div className="text-center p-8">
                <Mic2 className="w-12 h-12 text-slate-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">{fd?.businessName ?? clientName(sessionData) ?? <>Studio Gamme</>}</h3>
                <p className="text-sm text-slate-400">{/* TEXTE_SECTION */ clientText(sessionData, "equipe.texte") ?? c?.aboutText ?? <>
                  L'école de musiques actuelles du quartier : cours, ateliers,
                  et un vrai studio où tout s'enregistre.
                </>}</p>
                <button className="mt-6 text-[10px] uppercase tracking-widest font-bold text-[var(--brand,#c084fc)] hover:text-white transition-colors pb-1 border-b border-[var(--brand,#a855f7)]/30 hover:border-white">
                  Le projet pédagogique
                </button>
              </div>
            </Reveal>

            {/* Visual Artist */}
            <Reveal
              delay={0.6}
              className="md:col-span-2 relative rounded-2xl overflow-hidden group"
            >
              <Image
                src={photo(5, "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop")}
                alt="Artist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3 inline-block backdrop-blur-sm border border-blue-500/30">
                  Le studio
                </div>
                <h3 className="text-3xl font-bold">La régie de l'école</h3>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. TOUR DATES
          ========================================== */}
      <section id="concerts" className="py-32 bg-[#050318] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--brand,#a855f7)] block mb-4">
                {/* TEXTE_SECTION */ clientText(sessionData, "concerts.kicker") ?? "La scène"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{/* TEXTE_SECTION */ clientText(sessionData, "concerts.titre") ?? (<>
                Les concerts d'élèves
              </>)}</h2>
            </div>
            <button className="hidden md:block px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
              Toutes les dates
            </button>
          </Reveal>

          <div className="flex flex-col">
            {TOUR_DATES.map((tour, i) => {
              const isSoldOut = tour.status === "Complet";
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 hover:border-[var(--brand,#a855f7)]/50 transition-colors">
                    <div className="flex items-center gap-8 md:w-1/3 mb-4 md:mb-0">
                      <span className="font-mono text-xl text-[var(--brand,#c084fc)] w-24">
                        {tour.date}
                      </span>
                      <h4 className="text-xl font-bold">{tour.city}</h4>
                    </div>
                    <div className="md:w-1/3 text-slate-400 mb-4 md:mb-0">
                      {tour.venue}
                    </div>
                    <div className="md:w-1/3 flex justify-start md:justify-end">
                      {isSoldOut ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-6 py-3 border border-slate-800 rounded-sm">
                          Complet
                        </span>
                      ) : (
                        <button className="text-[10px] font-bold uppercase tracking-widest text-black bg-[var(--brand,#a855f7)] px-6 py-3 rounded-sm hover:bg-[var(--brand,#c084fc)] transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                          Réserver des places
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#02000a] pt-32 pb-12 px-6 md:px-12 border-t border-[var(--brand,#581c87)]/20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand,#9333ea)]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <Link
                href="#hero"
                className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2"
              >
                <Disc3 className="w-6 h-6 text-[var(--brand,#a855f7)]" />
                {fd?.businessName ?? clientName(sessionData) ?? <>SONIC<span className="font-light text-slate-500">WAVE</span></>}
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {clientTrade(sessionData) ?? "École de musiques actuelles"} · {clientCity(sessionData) ?? "Villeurbanne"}
              </p>
              <div className="space-y-2 text-sm text-slate-500 mb-8">
                <div>{clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "69100", "Villeurbanne")}</div>
                <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33472000000").replace(/\s/g, "")}`} className="block hover:text-white transition-colors">{clientPhone(sessionData) ?? fd?.phone ?? "04 72 00 00 00"}</a>
                <a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "hello@studio-gamme.fr"}`} className="block hover:text-white transition-colors">{clientEmail(sessionData) ?? fd?.email ?? "hello@studio-gamme.fr"}</a>
              </div>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Spt
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Apl
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  Ytb
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#a855f7)] mb-6">
                L'école
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Les cours
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Les ateliers
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Le studio
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Les tarifs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#a855f7)] mb-6">
                Pratique
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Inscriptions
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Cours d'essai
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Location de salles
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Bons cadeaux
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#a855f7)] mb-6">
                La lettre de l'école
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                Les dates des concerts d'élèves, les places d'ateliers qui se
                libèrent, les nouvelles du studio.
              </p>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre courriel"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--brand,#a855f7)] text-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-bold text-[var(--brand,#c084fc)] hover:text-white transition-colors"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest font-bold text-slate-600">
            <span>
              &copy; {new Date().getFullYear()} {fd?.businessName ?? clientName(sessionData) ?? "SonicWave"}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
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
