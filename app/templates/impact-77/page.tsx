"use client";
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientPhotos,
  clientReviews,
  clientServices,
  clientText,
  clientWorks,
  memoriserSession,
} from "@/lib/templates/clientContent";
// @ts-nocheck

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  Counter,
  MagneticBtn,
  Reveal,
  TiltCard,
  rafraichirPartage,
} from "./shared";
import { resolveList } from "@/lib/templates/resolveList";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les avis, jusqu'ici écrits dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
function AVIS_INLINE_SOURCE_LIVE() {
  return [
  { quote: "Luca's ability to extract the essential from a scene is unlike anything we have encountered. His Vogue campaign doubled our newsstand numbers.", name: "Claire Deschamps", role: "Art Director, Vogue " + (clientCity(sessionData) ?? "Paris") },
              { quote: "Working with Luca on the Wallpaper* architecture series was a revelation. He sees in geometry where others see in light.", name: "Tony Chambers", role: "Editorial Director, Wallpaper*" },
              { quote: "The Dior campaign we produced together remains the most-shared in our history. His eye for temporal precision is extraordinary.", name: "Olivier Bialobos", role: "CMO, Dior Parfums" }
];
}
let AVIS_INLINE_SOURCE = AVIS_INLINE_SOURCE_LIVE();;
let AVIS_INLINE = AVIS_INLINE_SOURCE;

let c: any = null;
let bp: any = null;
let brand: any = null;

const Instagram = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={props.style}
    width={props.size || 16}
    height={props.size || 16}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

function GRID_PHOTOS_DEMO_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ title: o.title, category: o.detail || undefined, ...(o.imageUrl ? { src: o.imageUrl } : {}) })), [
  {
    id: 1,
    src: (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/12869715/pexels-photo-12869715.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    category: "Landscape",
    title: "Alpine Meridian",
    aspect: "aspect-[3/4]",
  },
  {
    id: 2,
    src: (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/7303855/pexels-photo-7303855.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    category: "Portrait",
    title: "Identity Study I",
    aspect: "aspect-[3/4]",
  },
  {
    id: 3,
    src: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"),
    category: "Architecture",
    title: "Glass Tension",
    aspect: "aspect-square",
  },
  {
    id: 4,
    src: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop"),
    category: "Landscape",
    title: "Desert Void",
    aspect: "aspect-[4/3]",
  },
  {
    id: 5,
    src: (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop"),
    category: "Commercial",
    title: "Product Noir",
    aspect: "aspect-square",
  },
  {
    id: 6,
    src: (clientPhotos(sessionData)[5] || "https://images.pexels.com/photos/12277127/pexels-photo-12277127.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    category: "Portrait",
    title: "Luminance",
    aspect: "aspect-[3/4]",
  },
  {
    id: 7,
    src: (clientPhotos(sessionData)[6] || "https://images.pexels.com/photos/12277251/pexels-photo-12277251.jpeg?auto=compress&cs=tinysrgb&w=1600"),
    category: "Architecture",
    title: "Vertical Logic",
    aspect: "aspect-[4/3]",
  },
  {
    id: 8,
    src: (clientPhotos(sessionData)[7] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop"),
    category: "Landscape",
    title: "Horizon Line",
    aspect: "aspect-[4/3]",
  },
]);
}
let GRID_PHOTOS_DEMO = GRID_PHOTOS_DEMO_LIVE();

const CATEGORIES = ["All", "Landscape", "Portrait", "Architecture", "Commercial"];

const SERVICES_SOURCE = [
  {
    code: "SVC_01",
    title: "Editorial",
    desc: "Magazine covers, fashion editorials, and creative direction for high-end publications worldwide.",
  },
  {
    code: "SVC_02",
    title: "Commercial",
    desc: "Product campaigns, brand identity photography, and advertising shoots for luxury clients.",
  },
  {
    code: "SVC_03",
    title: "Events",
    desc: "Private galas, architectural openings, and exclusive cultural events captured in documentary style.",
  },
  {
    code: "SVC_04",
    title: "Fine Prints",
    desc: "Limited-edition archival prints on museum-grade paper. Each piece signed and numbered.",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const CLIENTS = ["Vogue", "Wallpaper*", "Dezeen", "Monocle", "Dior"];


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function HorologsLuxePage() {
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
  const GRID_PHOTOS = resolveList(
    bpLocal?.beforeAfter?.map((b: any, i: number) => ({
      id: i + 1,
      src: b.afterUrl || b.beforeUrl || GRID_PHOTOS_DEMO[i % GRID_PHOTOS_DEMO.length].src,
      category: GRID_PHOTOS_DEMO[i % GRID_PHOTOS_DEMO.length].category,
      title: b.caption ?? GRID_PHOTOS_DEMO[i % GRID_PHOTOS_DEMO.length].title,
      aspect: GRID_PHOTOS_DEMO[i % GRID_PHOTOS_DEMO.length].aspect,
    })),
    GRID_PHOTOS_DEMO
  );
  const SERVICES = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({
      code: SERVICES_DEMO[i % SERVICES_DEMO.length].code,
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    SERVICES_DEMO
  );

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;

  sessionData = session;
  GRID_PHOTOS_DEMO = GRID_PHOTOS_DEMO_LIVE();
  AVIS_INLINE_SOURCE = AVIS_INLINE_SOURCE_LIVE();

  memoriserSession(sessionData);

  rafraichirPartage();
  bp = session?.businessProfile;
  c = session?.generatedContent;




  AVIS_INLINE = resolveList(

    clientReviews(session)?.map((r: any, i: number) => ({

      ...AVIS_INLINE_SOURCE[i % AVIS_INLINE_SOURCE.length],

      quote: r.text, name: r.author,

    })),

    AVIS_INLINE_SOURCE,

  );
  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], title: s.title })),
    SERVICES_SOURCE,
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [GRID_PHOTOS];
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
  bp = bpLocal;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const filtered =
    activeCategory === "All"
      ? GRID_PHOTOS
      : GRID_PHOTOS.filter((p) => p.category === activeCategory);

  return (
    <div className="relative w-full bg-[#050505]">
      {/* ==========================================
          1. HERO (Cinematic Luxury)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100dvh] min-h-[640px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src={photo(8, "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=85&w=2400&auto=format&fit=crop")}
            alt="Horologs — Luxury Photography Studio"
            fill
            className="object-cover brightness-[0.45] grayscale-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 to-transparent" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28"
        >
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-9xl lg:text-[10.5rem] font-black leading-[0.88] tracking-tighter mb-10 uppercase break-words"
          >{<>{clientHeroLine(sessionData, 0, 2, 10) ?? "Mastery of"}<br />
            <span className="text-stone-600 italic">{clientHeroLine(sessionData, 1, 2, 10) ?? "Duration."}</span>
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-base text-white/30 leading-relaxed font-light mb-12 uppercase tracking-widest italic"
            style={{ fontSize: "0.82rem" }}
          >{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
            Hand-assembled manufacture movements for the discerning
            collector. Swiss precision, exceptional finishing — calibrated
            to perfection.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/templates/impact-77/collection">
              <span className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-stone-200 transition-all">
                Browse Archive
              </span>
            </Link>
            <Link href="/templates/impact-77/boutique">
              <span className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                View Manifesto
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — hidden on mobile (overlapped the stacked CTAs) */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/15">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="w-[1px] h-10 bg-gradient-to-b from-stone-500/60 to-transparent"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block z-10"
        >
          <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
            HOROLOGS · V.77 · SERIAL 2026
          </span>
        </motion.div>
      </section>

      {/* ==========================================
          2. PHOTO GRID WITH CATEGORY FILTER
          ========================================== */}
      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">
              VISUAL_ARCHIVE // SERIES_2022–2026
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-12 pb-2 leading-[1.1]">{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>
              Work.
            </>)}</h2>
          </Reveal>

          {/* Filter tabs */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-16">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.4em] rounded-none transition-all border ${
                    activeCategory === cat
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white/30 border-white/10 hover:border-white/30 hover:text-white/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo, i) => (
              <Reveal key={photo.id} delay={i * 0.06}>
                <TiltCard className="break-inside-avoid group cursor-pointer relative overflow-hidden block mb-4">
                  <div className={`relative w-full ${photo.aspect} overflow-hidden`}>
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover brightness-75 grayscale-[0.3] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">
                        {photo.category}
                      </span>
                      <h3 className="text-base font-black uppercase tracking-tighter text-white">
                        {photo.title}
                      </h3>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. ABOUT / PHOTOGRAPHER BIO
          ========================================== */}
      <section className="py-40 bg-[#080808] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={photo(9, "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop")}
                  alt="Photographer portrait"
                  fill
                  className="object-cover grayscale-[0.4] brightness-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">
                    Established 1924 // Geneva, CH
                  </span>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-8 block">
                  THE_PHOTOGRAPHER // ABOUT
                </span>
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-10 leading-[1.1] pb-2">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Luca<br />
                  <span className="text-stone-600">Arantes.</span>
                </>}</h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base text-white/30 font-bold uppercase tracking-widest leading-relaxed italic mb-10">{c?.aboutText ?? <>
                  Based between Geneva and Tokyo, Luca Arantes built his practice
                  on the precision of mechanical time — transposing the watchmaker's
                  obsession with detail into the photographic frame. Every composition
                  is a calibration. Every exposure a deliberate act of structural
                  intelligence. Working exclusively on medium format, his images have
                  appeared in Vogue, Wallpaper*, and Dezeen, and hang in private
                  collections across 12 countries.
                </>}</p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                  {[
                    { v: 340, s: "+", label: "Publications" },
                    { v: 12, s: "", label: "Countries" },
                    { v: 18, s: " ans", label: "D'expérience" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-3xl font-black text-white font-mono mb-1">
                        <Counter to={stat.v} suffix={stat.s} />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                        {stat.label}
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
          4. SELECTED CLIENT LOGOS
          ========================================== */}
      <section className="py-20 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-10">
              <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
                Trusted by
              </span>
              {CLIENTS.map((client, i) => (
                <span
                  key={i}
                  className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white/10 hover:text-white/40 transition-colors cursor-default italic"
                >
                  {client}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          5. SERVICES
          ========================================== */}
      <section className="py-32 bg-[#080808] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">
              SERVICE_LEDGER // ACTIVE
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
              Services.
            </>)}</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-[#080808] p-10 group hover:bg-[#0a0a0a] transition-colors">
                  <span className="text-[10px] font-black text-stone-600/50 uppercase tracking-[0.5em] mb-6 block">
                    {svc.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-5">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">
                    {svc.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600/50 group-hover:text-stone-500 transition-colors">
                    Inquire <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. EXHIBITIONS & AWARDS
          ========================================== */}
      <section className="py-32 bg-[#080808] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">EXHIBITION_LOG // SOLO_SHOWS</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>Exhibitions.</>)}</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { year: "2025", title: "Duration & Void", venue: "Foam Amsterdam" },
                  { year: "2024", title: "Calibration Series", venue: `Galerie Perrotin, ${clientCity(sessionData) ?? "Paris"}` },
                  { year: "2024", title: "Meridian Light", venue: "ICP New York" },
                  { year: "2023", title: "Alpine Grammar", venue: "C/O Berlin" },
                  { year: "2022", title: "The Silent Hour", venue: "Musée de l'Élysée, Lausanne" },
                  { year: "2021", title: "Identity Studies I–VII", venue: "Taka Ishii Gallery, Tokyo" },
                ].map((ex, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-5 flex items-center gap-6 group">
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{ex.year}</span>
                      <div className="flex-1">
                        <div className="text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{ex.title}</div>
                        <div className="text-[10px] font-bold text-white/15 uppercase tracking-widest mt-1">{ex.venue}</div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-stone-500 transition-colors flex-shrink-0" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">RECOGNITION_LOG // AWARDS</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Recognition.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { year: "2025", title: "World Press Photo Award", cat: "Architecture" },
                  { year: "2024", title: "Prix Niépce", cat: "Portrait" },
                  { year: "2024", title: "Hasselblad Foundation Grant", cat: "Landscape" },
                  { year: "2023", title: "Sony World Photography Award", cat: "Commercial" },
                  { year: "2022", title: "Foam Paul Huf Award", cat: "Emerging" },
                  { year: "2021", title: "ICP Infinity Award", cat: "Fine Art" },
                ].map((a, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-5 flex items-center gap-6 group">
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{a.year}</span>
                      <div className="flex-1 text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{a.title}</div>
                      <span className="text-[10px] font-bold text-stone-600/50 uppercase tracking-widest flex-shrink-0">{a.cat}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. TESTIMONIALS
          ========================================== */}
      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">CLIENT_SIGNALS // TESTIMONIALS</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>They said.</>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {AVIS_INLINE.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#080808] p-10 h-full flex flex-col">
                  <div className="w-8 h-[1px] bg-stone-600 mb-8" />
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic flex-1 mb-8">"{t.quote}"</p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{t.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600/60 italic">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FINE PRINTS PRICING
          ========================================== */}
      <section className="py-32 bg-[#080808] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-6 block">FINE_PRINTS // EDITIONS</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">{/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>Collect.</>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {/* TARIFS */ resolveList(clientServices({ formData: fd, businessProfile: bp })?.map((s: any) => ({ tier: s.title, ...(s.price ? { price: s.price } : {}) })), [
              { tier: "Archive Print", size: "30 × 40 cm", edition: "Edition of 50", price: "€ 1,200", detail: "Museum-grade Baryta paper · signed & numbered · certificate of authenticity" },
              { tier: "Studio Edition", size: "50 × 70 cm", edition: "Edition of 25", price: "€ 2,800", detail: "Hahnemühle Photo Rag · hand-signed · archival box included" },
              { tier: "Collector's Piece", size: "80 × 100 cm", edition: "Edition of 10", price: "€ 6,500", detail: "Platinum print on aluminium · bespoke framing · white-glove delivery worldwide" },
            ]).map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#050505] p-10 group hover:bg-[#080808] transition-colors border-t-2 border-transparent hover:border-stone-600 h-full flex flex-col">
                  <span className="text-[10px] font-black text-stone-600/50 uppercase tracking-[0.5em] mb-6 block">{p.tier}</span>
                  <div className="text-4xl font-black text-white tracking-tighter mb-2">{p.price}</div>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-6">{p.size} · {p.edition}</div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic flex-1 mb-8">{p.detail}</p>
                  <button className="w-full py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                    Inquire
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CONTACT CTA
          ========================================== */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 mb-8 block">
              CONTACT_NODE // OPEN
            </span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[1.05] mb-12 pb-4">{/* TEXTE_SECTION */ clientText(sessionData, "section-9.titre") ?? (<>
              Work<br />
              <span className="text-stone-600">together.</span>
            </>)}</h2>
            <p className="max-w-md mx-auto text-[11px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic mb-16">
              Available for editorial, commercial, and fine print commissions. Response within 48 hours.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/templates/impact-77/contact">
                <MagneticBtn className="px-16 py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-200 transition-all cursor-pointer shadow-2xl inline-flex items-center gap-4">
                  Send Inquiry <Mail className="w-4 h-4" />
                </MagneticBtn>
              </Link>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-16 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer inline-flex items-center gap-4"
              >
                Instagram <Instagram className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
