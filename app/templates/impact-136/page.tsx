"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, Maximize, X, Globe, ArrowDown, Sparkles, Command, Eye, Code } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const WORKS = [
  {
    id: "01",
    client: "Aura Skincare",
    category: "E-Commerce",
    year: "2025",
    desc: "A sensory digital experience focusing on fluid webgl interactions to mirror the viscosity of premium serums.",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "02",
    client: "Nexus Fintech",
    category: "Product Design",
    year: "2024",
    desc: "Redefining institutional trading platforms through brutalist UI and micro-latency data visualization.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "03",
    client: "Vanguard Auto",
    category: "Immersive 3D",
    year: "2024",
    desc: "Real-time browser-based car configurator utilizing WebGPU for photorealistic ray tracing.",
    image:
      "https://images.unsplash.com/photo-1618361853818-a6d1a92e1066?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "04",
    client: "Maison Archive",
    category: "Editorial",
    year: "2023",
    desc: "Digital archive for a legacy fashion house, utilizing typographic scroll-jacking to tell historical narratives.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
  },
];

const SERVICES = [
  {
    title: "Digital Platforms",
    desc: "We build flagship websites and web applications that serve as the digital epicenter of your brand. Focusing on conversion, performance, and aesthetic dominance.",
    icon: <GlobeIcon />,
  },
  {
    title: "Creative Development",
    desc: "Pushing the boundaries of what a browser can render. WebGL, Three.js, and custom shader pipelines that turn ordinary scroll into cinematic experiences.",
    icon: <CodeIcon />,
  },
  {
    title: "Brand Identity",
    desc: "Crafting visual systems that scale from a smartwatch screen to a billboard. Typography, color theory, and motion guidelines.",
    icon: <Eye />,
  },
  {
    title: "Product Strategy",
    desc: "Data-driven UX architecture designed to reduce friction and elevate user retention. We map the entire user journey before writing a line of code.",
    icon: <Command />,
  },
];

const PROCESS = [
  {
    phase: "01. Discovery",
    detail:
      "Deep dive into your industry, competitors, and technical constraints. We define the baseline metrics for success.",
  },
  {
    phase: "02. Wireframing",
    detail:
      "Structural architecture. We establish the skeleton of the product without the distraction of visual design.",
  },
  {
    phase: "03. Art Direction",
    detail:
      "Exploring typography, motion, and visual paradigms. Creating the moodboards that define the final aesthetic.",
  },
  {
    phase: "04. Production",
    detail:
      "Pixel-perfect execution. Bridging the gap between design and development with fluid animations.",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function GlobeIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // For the massive text mask effect
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth the scroll progress for the clip-path
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  // Transform scroll progress to CSS clip-path inset values
  // Start with a small rectangle in the center (text mask), expand to full screen (inset(0%))
  // We simulate the text mask expansion by scaling a background element and fading text
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 5]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1.2, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between mix-blend-difference text-white">
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
                <Sparkles className="w-5 h-5" /> REVEAL
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#hero" className="hover:opacity-60 transition-opacity">
              Work
            </Link>
            <Link href="#hero" className="hover:opacity-60 transition-opacity">
              Studio
            </Link>
            <Link href="#hero" className="hover:opacity-60 transition-opacity">
              Journal
            </Link>
          </div>

          <button className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
            Start a Project <ArrowRight className="w-4 h-4" />
          </button>

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
          <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 px-6 py-6 flex flex-col gap-6">
            <Link href="#hero" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white">Work</Link>
            <Link href="#hero" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white">Studio</Link>
            <Link href="#hero" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white">Journal</Link>
            <Link href="#hero" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white">Start a Project</Link>
          </div>
        )}
      </nav>

      {/* ==========================================
          1. TEXT MASK SCROLL HERO
          ========================================== */}
      <section id="hero" ref={containerRef} className="relative w-full h-[200vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
          {/* Background Image that reveals */}
          <motion.div
            style={{ scale: bgScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
              alt="Abstract background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* The Text Mask Layer */}
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply bg-white"
          >
            {/* The white background with black text creates the mask effect via mix-blend-multiply */}
            <div className="w-full h-full bg-white flex items-center justify-center">
              <h1 className="text-[15vw] font-black tracking-tighter text-black leading-none text-center">{c?.heroHeadline ?? <>
                DIGITAL
                <br />
                REALITY
              </>}</h1>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 text-white"
          >
            <span className="text-[9px] uppercase tracking-widest font-bold">
              Scroll to Expand
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
          2. MANIFESTO
          ========================================== */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-[#0a0a0a] relative z-20 -mt-[50vh]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-medium leading-[1.1] tracking-tight mb-16">
              We design digital experiences that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-600">
                refuse to be ignored.
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-400 text-xl font-light leading-relaxed">
            <Reveal delay={0.2}>
              <p>{c?.heroSubline ?? fd?.tagline ?? <>
                In a sea of templates and infinite scrolling, user attention is
                the most valuable currency. We believe that true digital luxury
                isn't about minimalism—it's about intentional friction and
                memorable interactions.
              </>}</p>
            </Reveal>
            <Reveal delay={0.4}>
              <p>{c?.aboutText ?? <>
                By combining brutalist architectural principles with hyper-fluid
                WebGL rendering, we construct platforms that don't just inform
                users; they make them feel something.
              </>}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SELECTED WORKS (Hover Reveal Grid)
          ========================================== */}
      <section className="py-24 bg-[#050505] border-y border-white/5 relative">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20 flex justify-between items-end">
          <Reveal>
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-4">
              Archive
            </span>
            <h2 className="text-5xl font-medium tracking-tight">
              Selected Works
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <button className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-1 border-b border-white/20 hover:border-white transition-colors">
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        </div>

        <div className="border-t border-white/10">
          {WORKS.map((work, i) => (
            <div
              key={work.id}
              className="group relative border-b border-white/10"
              onMouseEnter={() => setHoveredWork(work.id)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              {/* Background Hover Image Reveal (Desktop) */}
              <div
                className={`absolute inset-0 z-0 overflow-hidden hidden md:block transition-opacity duration-500 ${hoveredWork === work.id ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={work.image}
                  alt={work.client}
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              </div>

              <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 cursor-pointer">
                <div className="flex items-center gap-8 md:gap-16 md:w-1/2">
                  <span className="font-mono text-zinc-600 text-sm">
                    {work.id}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                    {work.client}
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-16 w-full md:w-1/2 text-sm text-zinc-400">
                  <span className="uppercase tracking-widest">
                    {work.category}
                  </span>
                  <span className="font-mono">{work.year}</span>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 md:ml-auto">
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>

                {/* Mobile Image (Visible only on mobile) */}
                <div className="w-full aspect-[21/9] relative rounded-lg overflow-hidden md:hidden mt-4">
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
          4. SERVICES & EXPERTISE
          ========================================== */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Capabilities
            </h2>
            <p className="text-zinc-400 text-lg">
              We operate as an extension of your internal team, providing the
              specialized firepower needed to execute ambitious digital
              transformations.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-medium mb-4">{service.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                    {service.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4.5 MANIFESTO / VISION
          ========================================== */}
      <section id="contact" className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-8">
              The Reveal Doctrine
            </span>
            <h2 className="text-3xl md:text-5xl font-light leading-relaxed text-zinc-300 mb-12">
              "A brand is no longer just a logo or a color palette. In the
              digital age, a brand is defined by how it{" "}
              <span className="text-white font-medium">behaves</span>, how it{" "}
              <span className="text-white font-medium">moves</span>, and the{" "}
              <span className="text-white font-medium">friction</span> it
              introduces to force engagement."
            </h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                  alt="Founder"
                  fill
                  className="object-cover grayscale"
                />
              </div>
              <div>
                <span className="text-sm font-bold block text-white">
                  Alexander Chen
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Founder & Creative Director
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          5. PROCESS MARQUEE & LIST
          ========================================== */}
      <section id="realisations" className="py-32 bg-[#050505] border-y border-white/5 overflow-hidden">
        {/* Giant Marquee */}
        <div className="relative flex whitespace-nowrap mb-32 opacity-10 pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 px-6"
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="text-[12rem] font-black tracking-tighter leading-none"
              >
                METHODOLOGY
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 -mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <h2 className="text-4xl font-medium mb-6">Our Approach</h2>
                <p className="text-zinc-400">
                  A rigorous, battle-tested framework designed to eliminate
                  ambiguity and deliver exceptional results on timeline.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {PROCESS.map((p, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="border-t border-zinc-800 pt-6">
                      <h4 className="text-xl font-medium mb-4">{p.phase}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">
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
          6. MEGA FOOTER CTA
          ========================================== */}
      <footer className="bg-[#0a0a0a] pt-32 pb-12 px-6 md:px-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-800/20 blur-[150px] rounded-t-full pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div>
              <Reveal>
                <h2 className="text-6xl md:text-[8rem] font-medium tracking-tighter leading-[0.9] mb-8">
                  Let's <br />
                  <span className="text-zinc-500">Collaborate.</span>
                </h2>
                <a
                  href="mailto:hello@reveal.studio"
                  className="text-2xl md:text-4xl font-light hover:text-zinc-400 transition-colors border-b border-zinc-700 pb-2"
                >
                  hello@reveal.studio
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex gap-4">
              <a
                href="/templates/impact-136"
                className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="/templates/impact-136"
                className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="/templates/impact-136"
                className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </a>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-zinc-900 mb-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-6">
                Offices
              </h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li>
                  <strong className="text-white block mb-1">New York</strong>{" "}
                  100 Broadway, NY 10005
                </li>
                <li className="pt-2">
                  <strong className="text-white block mb-1">London</strong> 12
                  Shoreditch High St.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-6">
                Socials
              </h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Globe
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Globe (X)
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Awwwards
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-6">
                Newsletter
              </h4>
              <p className="text-sm text-zinc-400 mb-4">
                A monthly digest of design trends, WebGL experiments, and studio
                news.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-b border-zinc-800 px-0 py-3 flex-1 text-sm focus:outline-none focus:border-white text-white transition-colors"
                />
                <button
                  type="submit"
                  className="border-b border-zinc-800 px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:text-white text-zinc-500 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
            <span>
              &copy; {new Date().getFullYear()} Reveal Studio. All rights
              reserved.
            </span>
            <div className="flex gap-6">
              <Link href="#contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#contact" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
