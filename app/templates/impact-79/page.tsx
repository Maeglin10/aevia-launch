"use client";
// @ts-nocheck

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Flame, Droplets, Thermometer, Wind, Zap, Globe, Activity, Terminal, Box, Share2, Layers, Maximize, Monitor, MousePointer2, Navigation, Wifi, Shield, ShoppingBag, Search, Star, Mail, Phone, Check, Menu, X, MapPin, Clock, Lock, Plus, Bell, Settings, ArrowRight, ArrowUpRight, ChevronRight, UtensilsCrossed, Wheat } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "THE_VOID_LOAF",
    category: "Sourdough",
    price: "€8.50",
    desc: "48-hour fermentation. Charcoal-infused crust. Ancient grain blend.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "SOLAR_CROISSANT",
    category: "Viennoiserie",
    price: "€4.20",
    desc: "AOP butter. 256 layers. Golden honeycomb structure.",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
  },
  {
    id: 3,
    name: "LUNAR_BAGUETTE",
    category: "Tradition",
    price: "€2.80",
    desc: "High hydration. Stone-baked. Intense caramelization.",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
  },
  {
    id: 4,
    name: "NEBULA_TART",
    category: "Patisserie",
    price: "€6.50",
    desc: "Seasonal fruit reduction. Vanilla bean emulsion. Shortcrust.",
    img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
  },
];

const TECHNIQUE = [
  {
    step: "01",
    title: "HYDRATION",
    desc: "Precise water-to-flour ratio adjusted daily for humidity.",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    step: "02",
    title: "FERMENTATION",
    desc: "Wild yeast culture maintained since 2026. Slow cold-proof.",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    step: "03",
    title: "BAKING",
    desc: "Custom steam-injection ovens. High-temperature thermal mass.",
    icon: <Flame className="w-5 h-5" />,
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

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
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = to / 70;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setCount(to);
        clearInterval(t);
      } else {
        setCount(Math.floor(cur));
      }
    }, 16);
    return () => clearInterval(t);
  }, [isInView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
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
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
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
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function BoulangerieNoirePage() {
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
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const horizontalRef = useRef(null);
  const { scrollXProgress } = useScroll({ target: horizontalRef });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
    <div
      className="premium-theme min-h-dvh bg-[#0a0a0a] text-[#d6d3d1] font-mono selection:bg-stone-800 selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-black/95 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#collection" className="flex flex-col items-start">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-stone-600 mb-1">
                  Artisanal.
                </span>
                <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">
                  BOULANGERIE<span className="text-stone-800">.NOIRE</span>
                </span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
            <Link
              href="#collection"
              className="hover:text-white transition-colors"
            >
              Collection
            </Link>
            <Link
              href="#technique"
              className="hover:text-white transition-colors"
            >
              Technique
            </Link>
            <Link href="#ovens" className="hover:text-white transition-colors">
              Ovens
            </Link>
            <Link
              href="#subscription"
              className="hover:text-white transition-colors"
            >
              Subscription
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                Fresh Batch
              </span>
              <span className="text-[11px] font-black text-stone-500 flex items-center gap-1">
                READY_NOW <Flame className="w-3 h-3" />
              </span>
            </div>
            <MagneticBtn className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-stone-800 hover:text-white transition-all">
              ORDER_BREAD
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-stone-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black p-8 pt-32 flex flex-col border-l border-white/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-stone-500"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic text-stone-800">
              <Link href="#collection" onClick={() => setMenuOpen(false)}>
                Collection
              </Link>
              <Link href="#technique" onClick={() => setMenuOpen(false)}>
                Technique
              </Link>
              <Link href="#ovens" onClick={() => setMenuOpen(false)}>
                Ovens
              </Link>
              <Link href="#subscription" onClick={() => setMenuOpen(false)}>
                Subscription
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Cinematic Bakery)
          ========================================== */}
      <section id="hero"
        ref={heroRef}
        className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={photo(0, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1600&auto=format&fit=crop")}
            alt="Bakery Hero"
            fill
            className="object-cover brightness-50 contrast-125 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </motion.div>

        {/* SOFT RADIANT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-stone-900/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-stone-900/30 rounded-none border border-white/5 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Wheat className="w-3.5 h-3.5" />
              Ancestral Grains // Slow Fermentation
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-4">{c?.heroHeadline ?? <>
              The Architecture <br />{" "}
              <span className="text-stone-800 italic">of Crust.</span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">{c?.heroSubline ?? fd?.tagline ?? <>
              High-hydration molecular baking. Stone hearth methodology.
              Precision-engineered for the modern palate.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-800 hover:text-white transition-all cursor-pointer shadow-2xl">
                Explore The Batch
              </MagneticBtn>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                Technical_Bake_Log
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block"
        >
          <div className="flex flex-col items-start gap-3">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              BOULANGERIE_NOIRE_SYS // LOG_079
            </span>
            <div className="w-32 h-[1px] bg-stone-900" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. THE COLLECTION (Horizontal Scroll)
          ========================================== */}
      <section
        id="collection"
        className="py-32 bg-[#0a0a0a] border-y border-white/5 overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white italic pb-2">
              The{" "}
              <span className="text-stone-800 not-italic">Daily Batch.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative">
          <div className="flex gap-12 px-6 md:px-12 pb-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveItem(i)}
                  className="group w-[300px] md:w-[450px] flex-shrink-0 snap-start cursor-pointer bg-white/[0.02] border border-white/5 hover:border-stone-800 transition-all rounded-none p-8 shadow-sm"
                >
                  <div className="relative aspect-square mb-10 overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.4] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-stone-900 text-white border-none text-[8px] font-black tracking-widest uppercase px-3 py-1">
                        {p.category}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic mb-4">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-white/30 leading-relaxed font-bold uppercase tracking-widest mb-10 italic">
                    {p.desc}
                  </p>
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-black text-white italic">
                      {p.price}
                    </span>
                    <button className="text-[9px] font-black uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors">
                      Add_To_Bag
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. TECHNIQUE (Process)
          ========================================== */}
      <section id="technique" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-700 mb-6 block">
                  Molecular Gastronomy
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-12 text-white uppercase italic">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Baking <br />{" "}
                  <span className="text-stone-800 not-italic">Protocol.</span>
                </>}</h2>
                <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">{c?.aboutText ?? <>
                  We treat bread as structural engineering. From grain analysis
                  to steam-injection cycles, precision is our only ingredient.
                </>}</p>

                <div className="space-y-10">
                  {[
                    {
                      label: "Hydration Ratio",
                      val: 82,
                      suffix: "%",
                      desc: "Maximizing crumb elasticity through high-hydration dough processing.",
                    },
                    {
                      label: "Cold Fermentation",
                      val: 48,
                      suffix: " HR",
                      desc: "Slow enzymatic breakdown for optimal digestibility and complex flavor profile.",
                    },
                    {
                      label: "Bake Temperature",
                      val: 265,
                      suffix: " °C",
                      desc: "Intense heat burst for maximum oven spring and thin, glass-like crust.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group border-l border-stone-900 pl-8 hover:border-white transition-all"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/40">
                        {item.label}
                      </h4>
                      <div className="text-3xl font-black text-stone-600 mb-2 uppercase italic tabular-nums">
                        <Counter to={item.val} suffix={item.suffix} />
                      </div>
                      <p className="text-[10px] text-white/10 leading-relaxed font-bold uppercase tracking-widest">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TECHNIQUE.map((t, i) => (
                  <div
                    key={i}
                    className="p-10 bg-white/[0.02] border border-white/5 rounded-none hover:border-stone-800 transition-all group"
                  >
                    <div className="text-4xl font-black text-stone-900 mb-8 italic">
                      {t.step}
                    </div>
                    <div className="text-stone-600 mb-6">{t.icon}</div>
                    <h4 className="text-xl font-black uppercase text-white italic mb-4">
                      {t.title}
                    </h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed italic">
                      {t.desc}
                    </p>
                  </div>
                ))}
                <div className="p-10 bg-stone-900/20 border border-stone-800/40 rounded-none flex flex-col justify-center items-center text-center">
                  <Wheat className="w-8 h-8 text-stone-800 mb-6" />
                  <h4 className="text-xl font-black uppercase text-white italic mb-4">
                    Grain Provenance
                  </h4>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed italic">
                    All flours are stone-milled in-house from organic
                    regenerative farms.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. OVENS (Stats)
          ========================================== */}
      <section
        id="ovens"
        className="py-24 bg-[#0a0a0a] border-y border-white/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { label: "Active_Ovens", val: 6, suffix: "" },
            { label: "Loaves_Daily", val: 250, suffix: "" },
            { label: "Artisan_Bakers", val: 4, suffix: "" },
            { label: "Award_Sites", val: 12, suffix: "" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-stone-800 mb-4 italic tabular-nums">
                <Counter to={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. FAQ (The Buffer)
          ========================================== */}
      <section id="subscription" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic text-white">
              Bake_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Do you offer wholesale partnerships?",
                a: "Yes. We supply a limited number of Michelin-starred restaurants and specialty coffee shops. Contact our 'Network Control' for institutional inquiries.",
              },
              {
                q: "How should I store my sourdough?",
                a: "Never refrigerate. Store at room temperature in a paper bag for the first 48 hours, then transition to a cloth bag. Sourdough of this quality matures over time.",
              },
              {
                q: "What is the 'Subscription Box'?",
                a: "Our weekly 'Manifesto' box includes 2 seasonal loaves, 4 viennoiseries, and a jar of our cultured butter. Limited to 100 subscribers per city.",
              },
              {
                q: "Are your products vegan?",
                a: "All our sourdough loaves are 100% plant-based (Flour, Water, Salt). Our viennoiseries utilize high-grade AOP butter and local organic eggs.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-stone-600 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==========================================
          6. MEGA FOOTER (Premium Minimal)
          ========================================== */}
      <footer id="contact" className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                    Artisanal.
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    BOULANGERIE<span className="text-stone-800">.NOIRE</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  The structural infrastructure for the next generation of
                  artisanal baking. Est. 2026. Precision baked. Stone milled.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="JOIN_THE_MANIFESTO"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-800 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-800 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800 mb-10">
                Collection
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="#collection" className="hover:text-white transition-colors">
                    Sourdough_Archive
                  </Link>
                </li>
                <li>
                  <Link href="#collection" className="hover:text-white transition-colors">
                    Viennoiserie_Log
                  </Link>
                </li>
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Patisserie_Units
                  </Link>
                </li>
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Seasonals
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800 mb-10">
                Technique
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Grain_Sourcing
                  </Link>
                </li>
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Fermentation_Sync
                  </Link>
                </li>
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Stone_Hearth_Lab
                  </Link>
                </li>
                <li>
                  <Link href="#subscription" className="hover:text-white transition-colors">
                    Subscription
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800 mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#subscription"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="#subscription"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> X_Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="#subscription"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Headquarters
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} BOULANGERIE NOIRE Systems Ltd.
              </span>
              <Link href="#subscription" className="hover:text-white transition-colors">
                Regulatory_Terms
              </Link>
              <Link href="#subscription" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Paris // Berlin // Tokyo</span>
              <span>In Grain We Trust</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {activeItem !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e11] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-none shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-stone-800 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* IMAGE AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black">
                <Image
                  src={PRODUCTS[activeItem].img}
                  alt="Product"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-black text-white italic">
                    {PRODUCTS[activeItem].name}
                  </h3>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e11] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-800 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-stone-800" />
                    Technical Bake Specification
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      { label: "Fermentation", val: "48 Hours" },
                      { label: "Hydration", val: "82% Water" },
                      { label: "Grain Type", val: "Ancient Emmer" },
                      { label: "Bake Logic", val: "Stone-Hearth" },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-white/5 pb-4"
                      >
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          {spec.label}
                        </span>
                        <span className="text-[10px] font-black text-white uppercase italic">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-tight italic mb-10">
                    {PRODUCTS[activeItem].desc}
                  </p>
                </div>

                <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 hover:text-white transition-all cursor-pointer shadow-xl">
                  ADD_TO_BATCH_ORDER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.05)}
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
