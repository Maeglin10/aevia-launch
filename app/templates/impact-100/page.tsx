// @ts-nocheck
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Compass, Layout, Maximize, Ruler, Sparkles, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Box, Home, Layers, PencilLine, Focus, Frame, Monitor, Share2, Lock, Search, ShoppingBag } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const PROJECTS = [
  {
    id: 1,
    name: "The Obsidian Loft",
    category: "Residential",
    location: "London, UK",
    desc: "A study in monochromatic minimalism, utilizing raw concrete and reclaimed oak to create a silent sanctuary.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },
  {
    id: 2,
    name: "Lumière Office HQ",
    category: "Commercial",
    location: "Paris, FR",
    desc: "Redefining workspace through glass-brick acoustics and architectural light channeling.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  },
  {
    id: 3,
    name: "Aura Boutique Hotel",
    category: "Hospitality",
    location: "Kyoto, JP",
    desc: "Merging traditional Japanese spatial philosophy with brutalist structural integrity.",
    img: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&q=80",
  },
];

const PHILOSOPHY = [
  {
    title: "Spatial Psychology",
    desc: "We design for the subconscious, utilizing negative space to reduce cognitive load and enhance focus.",
    icon: Layout,
  },
  {
    title: "Material Integrity",
    desc: "Zero-compromise sourcing of raw elements. We let the stone, wood, and metal speak for themselves.",
    icon: Box,
  },
  {
    title: "Luminous Strategy",
    desc: "Lighting isn't a feature; it's the primary architectural material. We sculpt with photon paths.",
    icon: Sparkles,
  },
];

const STATS = [
  { label: "Spaces Transformed", value: "140+" },
  { label: "Design Awards", value: "24" },
  { label: "Material Partnerships", value: "85" },
  { label: "Client Retention", value: "98%" },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticBtn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================= */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function NovaSpacesPage() {
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

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    
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
return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#f7f7f7] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-white/90 backdrop-blur-2xl py-4 border-b border-black/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-center">
            <span className="text-3xl font-light tracking-[0.3em] uppercase leading-none">
              Nova
            </span>
            <span className="text-[7px] font-bold uppercase tracking-[0.8em] text-black/30 -mt-1 ml-1">
              Spatial Design
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[9px] font-bold uppercase tracking-[0.4em] text-black/40">
            {["The_Work", "Atelier", "Method", "Bespoke", "Contact"].map(
              (link) => (
                <Link
                  key={link}
                  href="#work"
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  {link}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[9px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
                Start_Project
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-black"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            className="fixed inset-0 z-[100] bg-[#f7f7f7] p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-black/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-4 text-7xl font-light uppercase text-black/10">
              {["Work", "Method", "Contact"].map((l) => (
                <Link
                  key={l}
                  href="#work"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-black hover:translate-x-4 transition-all"
                >
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80"
            alt="Architectural Minimal"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f7f7] via-[#f7f7f7]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <Badge className="bg-black/5 text-black border border-black/10 text-[9px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
              Global Architectural Collective // NYC - TOKYO
            </Badge>
            <h1 className="text-8xl md:text-[14rem] font-light leading-[0.85] tracking-tighter mb-12 uppercase text-black">{c?.heroHeadline ?? <>
              The Silence <br />{" "}
              <span className="font-black italic">Of Space.</span>
            </>}</h1>
            <p className="max-w-md text-xl text-black/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">{c?.heroSubline ?? fd?.tagline ?? <>
              Sculpting void into atmosphere through architectural precision and
              material truth.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer">
                Explore The Portfolio
              </MagneticBtn>
              <Link
                href="#work"
                className="px-12 py-5 border border-black/20 text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
              >
                The Method <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-2 text-black/20">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">
            Vertical_Axis_Aligned
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">
            Spatial_Purity_Index_0.98
          </span>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="realisations" className="py-24 border-y border-black/5 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-5xl font-light italic text-black">
                    {stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE WORK ── */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-none mb-6 uppercase text-black">
                  The <br /> <span className="font-black italic">Form.</span>
                </h2>
                <p className="text-black/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Project Index // Interior Architecture // 2024
                </p>
              </div>
              <Link
                href="#work"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-2 hover:text-black/40 hover:border-black/40 transition-all"
              >
                Download Press Archive
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PROJECTS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  className="group space-y-10 cursor-pointer"
                  onMouseEnter={() => setActiveProject(item.id)}
                  onMouseLeave={() => setActiveProject(null)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1.5s]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-[#f7f7f7]/30 group-hover:bg-transparent transition-colors duration-700" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/60 backdrop-blur-md text-black border-black/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                        {item.category}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeProject === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]"
                        >
                          <button className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">
                            View Space
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-4xl font-light uppercase tracking-tighter text-black italic group-hover:translate-x-2 transition-transform">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">
                        {item.location}
                      </span>
                    </div>
                    <p className="text-sm text-black/40 font-light leading-relaxed uppercase tracking-widest italic leading-loose">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-black/5" />
                      <Ruler className="w-5 h-5 text-black/10 group-hover:text-black transition-all" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ── */}
      <section id="contact" className="py-40 bg-white overflow-hidden relative border-t border-black/5">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-black/5 blur-[120px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-8 block">
                The Methodology
              </span>
              <h2 className="text-6xl md:text-8xl font-light italic tracking-tighter uppercase">
                Spatial{" "}
                <span className="font-black not-italic text-black">
                  Refinement.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {PHILOSOPHY.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-16 border border-black/5 bg-black/[0.01] hover:border-black/30 transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/40 mb-10 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-light uppercase mb-6 tracking-tighter text-black group-hover:translate-x-2 transition-transform">
                    {s.title}
                  </h3>
                  <p className="text-sm text-black/40 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic leading-loose">
                    {s.desc}
                  </p>
                  <button className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-black/60 group-hover:text-black group-hover:gap-6 transition-all">
                    Read Principle <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ATELIER ── */}
      <section className="py-40 px-6 md:px-12 bg-[#f7f7f7]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-black/5">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                alt="Atelier"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-[3s] grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f7f7f7] via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 text-black">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-black/40">
                  The Atelier
                </span>
                <h4 className="text-5xl font-light italic uppercase tracking-tighter leading-none">
                  Architectural <br /> Integrity.
                </h4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-8 block">
              Project Process
            </span>
            <h2 className="text-6xl md:text-9xl font-light italic tracking-tighter leading-[0.8] mb-12 uppercase text-black">{c?.aboutTitle ?? fd?.businessName ?? <>
              Primal <br />{" "}
              <span className="font-black not-italic">Order.</span>
            </>}</h2>
            <p className="text-black/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">{c?.aboutText ?? <>
              Beyond decoration. We re-engineer the fundamental structure of
              living, creating environments that align with the human cadence.
            </>}</p>
            <div className="grid grid-cols-2 gap-12">
              {[
                {
                  icon: Compass,
                  label: "Navigation",
                  desc: "Orientation study",
                },
                {
                  icon: PencilLine,
                  label: "Bespoke",
                  desc: "Custom furniture",
                },
                { icon: Home, label: "Residential", desc: "Private enclaves" },
                { icon: Layers, label: "Layers", desc: "Texture mapping" },
              ].map((val, i) => (
                <div key={i} className="space-y-4">
                  <val.icon className="w-6 h-6 text-black/30" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {val.label}
                  </h4>
                  <p className="text-[9px] font-light text-black/30 uppercase tracking-widest leading-loose">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
            <MagneticBtn className="mt-20 px-14 py-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all shadow-2xl">
              Schedule Spatial Audit
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-40 pb-16 px-6 md:px-12 border-t border-black/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-col mb-12">
                <span className="text-4xl font-light tracking-[0.3em] uppercase leading-none">
                  Nova
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 -mt-1 ml-1">
                  Spatial Design
                </span>
              </div>
              <p className="text-black/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                A global spatial design atelier dedicated to the pursuit of
                architectural purity and the silent power of minimalism.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              Projects
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/20">
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Hospitality
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Furniture
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              Method
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/20">
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Spatial_Logic
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Material_Sourcing
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Light_Sculpting
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              Atelier
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/20">
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  The_Studio
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Press_Archive
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-black transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10">
          <div className="flex items-center gap-12">
            <span>
              &copy; {new Date().getFullYear()} NOVA SPATIAL DESIGN COLLECTIVE.
            </span>
            <div className="flex gap-8">
              <span>RIBA_CHARTERED_PRACTICE</span>
              <span>AIA_VERIFIED_STUDIO</span>
            </div>
          </div>
          <div className="flex gap-12 font-mono">
            <span>GRID_STATUS_LOCKED</span>
            <span>VOID_RATIO_OPTIMAL</span>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#f7f7f7}
        ::-webkit-scrollbar-thumb{background:#1a1a1a}
      `}</style>
    </div>
  );
}
