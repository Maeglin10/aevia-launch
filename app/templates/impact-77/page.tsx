"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Watch, ArrowUpRight, Mail } from "lucide-react";
import { Reveal, MagneticBtn, TiltCard, Counter } from "./shared";

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

const GRID_PHOTOS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    category: "Landscape",
    title: "Alpine Meridian",
    aspect: "aspect-[3/4]",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    category: "Portrait",
    title: "Identity Study I",
    aspect: "aspect-[3/4]",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    category: "Architecture",
    title: "Glass Tension",
    aspect: "aspect-square",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop",
    category: "Landscape",
    title: "Desert Void",
    aspect: "aspect-[4/3]",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop",
    category: "Commercial",
    title: "Product Noir",
    aspect: "aspect-square",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    category: "Portrait",
    title: "Luminance",
    aspect: "aspect-[3/4]",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    category: "Architecture",
    title: "Vertical Logic",
    aspect: "aspect-[4/3]",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop",
    category: "Landscape",
    title: "Horizon Line",
    aspect: "aspect-[4/3]",
  },
];

const CATEGORIES = ["All", "Landscape", "Portrait", "Architecture", "Commercial"];

const SERVICES = [
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

const CLIENTS = ["Vogue", "Wallpaper*", "Dezeen", "Monocle", "Dior"];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
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

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

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
        className="relative w-full h-[115vh] min-h-[900px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=85&w=2400&auto=format&fit=crop"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 text-stone-400 text-[9px] font-bold uppercase tracking-widest mb-10">
              <Watch className="w-3 h-3" />
              Institutional Photography · Editorial & Commercial · Since 1924
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[10.5rem] font-black leading-[0.88] tracking-tighter mb-10 uppercase"
          >{c?.heroHeadline ?? <>
            Mastery of<br />
            <span className="text-stone-600 italic">Duration.</span>
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-base text-white/30 leading-relaxed font-light mb-12 uppercase tracking-widest italic"
            style={{ fontSize: "0.82rem" }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Advanced visual storytelling for the discerning collector.
            Editorial, commercial, fine art — calibrated to perfection.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/templates/impact-77/collection">
              <button className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-stone-200 transition-all">
                Browse Archive
              </button>
            </Link>
            <Link href="/templates/impact-77/boutique">
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                View Manifesto
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/15">scroll</span>
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
          <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
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
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-12 pb-2 leading-[1.1]">
              Work.
            </h2>
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
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-1">
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
                  src="https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop"
                  alt="Photographer portrait"
                  fill
                  className="object-cover grayscale-[0.4] brightness-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.5em]">
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
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 italic">
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
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
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
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">
              Services.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-[#080808] p-10 group hover:bg-[#0a0a0a] transition-colors">
                  <span className="text-[9px] font-black text-stone-600/50 uppercase tracking-[0.5em] mb-6 block">
                    {svc.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-5">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">
                    {svc.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-stone-600/50 group-hover:text-stone-500 transition-colors">
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
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Exhibitions.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { year: "2025", title: "Duration & Void", venue: "Foam Amsterdam" },
                  { year: "2024", title: "Calibration Series", venue: "Galerie Perrotin, Paris" },
                  { year: "2024", title: "Meridian Light", venue: "ICP New York" },
                  { year: "2023", title: "Alpine Grammar", venue: "C/O Berlin" },
                  { year: "2022", title: "The Silent Hour", venue: "Musée de l'Élysée, Lausanne" },
                  { year: "2021", title: "Identity Studies I–VII", venue: "Taka Ishii Gallery, Tokyo" },
                ].map((ex, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-5 flex items-center gap-6 group">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{ex.year}</span>
                      <div className="flex-1">
                        <div className="text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{ex.title}</div>
                        <div className="text-[9px] font-bold text-white/15 uppercase tracking-widest mt-1">{ex.venue}</div>
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
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{a.year}</span>
                      <div className="flex-1 text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{a.title}</div>
                      <span className="text-[9px] font-bold text-stone-600/50 uppercase tracking-widest flex-shrink-0">{a.cat}</span>
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
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">They said.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { quote: "Luca's ability to extract the essential from a scene is unlike anything we have encountered. His Vogue campaign doubled our newsstand numbers.", name: "Claire Deschamps", role: "Art Director, Vogue Paris" },
              { quote: "Working with Luca on the Wallpaper* architecture series was a revelation. He sees in geometry where others see in light.", name: "Tony Chambers", role: "Editorial Director, Wallpaper*" },
              { quote: "The Dior campaign we produced together remains the most-shared in our history. His eye for temporal precision is extraordinary.", name: "Olivier Bialobos", role: "CMO, Dior Parfums" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#080808] p-10 h-full flex flex-col">
                  <div className="w-8 h-[1px] bg-stone-600 mb-8" />
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic flex-1 mb-8">"{t.quote}"</p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{t.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-stone-600/60 italic">{t.role}</p>
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
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">Collect.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { tier: "Archive Print", size: "30 × 40 cm", edition: "Edition of 50", price: "€ 1,200", detail: "Museum-grade Baryta paper · signed & numbered · certificate of authenticity" },
              { tier: "Studio Edition", size: "50 × 70 cm", edition: "Edition of 25", price: "€ 2,800", detail: "Hahnemühle Photo Rag · hand-signed · archival box included" },
              { tier: "Collector's Piece", size: "80 × 100 cm", edition: "Edition of 10", price: "€ 6,500", detail: "Platinum print on aluminium · bespoke framing · white-glove delivery worldwide" },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#050505] p-10 group hover:bg-[#080808] transition-colors border-t-2 border-transparent hover:border-stone-600 h-full flex flex-col">
                  <span className="text-[9px] font-black text-stone-600/50 uppercase tracking-[0.5em] mb-6 block">{p.tier}</span>
                  <div className="text-4xl font-black text-white tracking-tighter mb-2">{p.price}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-6">{p.size} · {p.edition}</div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic flex-1 mb-8">{p.detail}</p>
                  <button className="w-full py-4 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
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
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[1.05] mb-12 pb-4">
              Work<br />
              <span className="text-stone-600">together.</span>
            </h2>
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
