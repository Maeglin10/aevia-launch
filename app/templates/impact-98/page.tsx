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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Watch, Zap, Diamond, ShieldCheck, Star, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Clock, Activity, Maximize, Settings, Compass, Shield, Award, Focus, Frame, Monitor, Share2, Lock, Search, ShoppingBag } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const COLLECTIONS = [
  {
    id: 1,
    name: "Astra Chrono",
    category: "Complications",
    price: "From CHF 125,000",
    desc: "A tourbillon masterpiece featuring a hand-finished skeleton dial and 72-hour power reserve.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
  },
  {
    id: 2,
    name: "Deep Horizon",
    category: "Professional",
    price: "From CHF 18,500",
    desc: "Titanium grade 5 case, water-resistant to 1000m with a helium escape valve and ceramic bezel.",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80",
  },
  {
    id: 3,
    name: "Legacy Perpetual",
    category: "Heritage",
    price: "From CHF 85,000",
    desc: "Rose gold moonphase calendar that requires no adjustment for the next 122 years.",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80",
  },
];

const CRAFTSMANSHIP = [
  {
    title: "Hand-Finished Calibers",
    desc: "Every bridge is beveled by hand and every gear is polished to a mirror finish in our Swiss workshops.",
    icon: Settings,
  },
  {
    title: "Metallurgical Mastery",
    desc: "Our proprietary gold and titanium alloys are engineered for eternal luster and scratch resistance.",
    icon: Diamond,
  },
  {
    title: "Chronometric Precision",
    desc: "Testing standards that exceed COSC certification by 300% for absolute timekeeping integrity.",
    icon: Clock,
  },
];

const STATS = [
  { label: "Components Per Watch", value: "320+" },
  { label: "Master Watchmakers", value: "14" },
  { label: "Hours of Testing", value: "800" },
  { label: "Heritage Years", value: "125" },
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
export default function ZenithWatchesPage() {
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
  const [activeWatch, setActiveWatch] = useState<number | null>(null);

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
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#d4af37] selection:text-white overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-center">
            <span className="text-3xl font-black tracking-[0.2em] uppercase leading-none italic">
              Zenith
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#d4af37] -mt-1 ml-1">
              Swiss Horology
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {[
              "Collections",
              "Grand_Complications",
              "Savoir-Faire",
              "Heritage",
              "Concierge",
            ].map((link) => (
              <Link
                key={link}
                href="#collections"
                className="hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#d4af37] transition-colors">
                Ownership_Portal
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#d4af37] group-hover:text-black group-hover:border-[#d4af37] transition-all">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#d4af37]"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40 hover:text-[#d4af37]"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-4 text-7xl font-black uppercase text-white/10">
              {["Collections", "Complications", "Atelier", "Contact"].map(
                (l) => (
                  <Link
                    key={l}
                    href="#collections"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[#d4af37] hover:translate-x-4 transition-all"
                  >
                    {l}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80"
            alt="Watch Movement"
            fill
            className="object-cover opacity-40 mix-blend-luminosity grayscale contrast-150"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <Reveal>
            <Badge className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
              Le Locle, Switzerland // Since 1899
            </Badge>
            <h1 className="text-8xl md:text-[14rem] font-black leading-[0.75] tracking-tighter mb-12 uppercase text-white italic">{c?.heroHeadline ?? <>
              Taming <br />{" "}
              <span className="text-[#d4af37] not-italic">Entropy.</span>
            </>}</h1>
            <p className="max-w-md text-xl text-white/50 leading-relaxed font-light mb-12 uppercase tracking-wide italic">{c?.heroSubline ?? fd?.tagline ?? <>
              The absolute mechanical mastery of time. Engineered for the next
              millennium.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                The Masterpiece Archive
              </MagneticBtn>
              <Link
                href="#collections"
                className="px-12 py-5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
              >
                Current Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="hidden lg:flex justify-end pr-12 relative">
            <Reveal delay={0.4}>
              <div className="relative w-96 h-96 rounded-full border border-white/5 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-t-2 border-[#d4af37] rounded-full"
                />
                <div className="text-center">
                  <span className="text-5xl font-black italic block text-[#d4af37]">
                    VHP
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Vertical High Precision
                  </span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#d4af37] rounded-full blur-2xl opacity-20 animate-pulse" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="realisations" className="py-24 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-2">
                    {stat.label}
                  </div>
                  <div className="text-5xl font-black italic text-white">
                    {stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section id="collections" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">
                  The <br /> <span className="text-[#d4af37]">Archive.</span>
                </h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Internal Reference // Swiss Quality Index // 2024
                </p>
              </div>
              <Link
                href="#collections"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] border-b border-[#d4af37] pb-2 hover:text-white hover:border-white transition-all"
              >
                Download Technical Deck
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {COLLECTIONS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  className="group space-y-10 cursor-pointer"
                  onMouseEnter={() => setActiveWatch(item.id)}
                  onMouseLeave={() => setActiveWatch(null)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/50 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                        {item.category}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeWatch === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-[#d4af37]/10 backdrop-blur-[2px]"
                        >
                          <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">
                            Caliber Specs
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#d4af37] transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-lg font-black text-[#d4af37] tracking-tighter">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-[#d4af37]/20 transition-all" />
                      <Settings className="w-5 h-5 text-white/10 group-hover:text-[#d4af37] transition-all" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAVOIR-FAIRE ── */}
      <section id="contact" className="py-40 bg-[#0d0d0d] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#d4af37]/5 blur-[120px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] mb-8 block">
                Atelier Excellence
              </span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
                Swiss{" "}
                <span className="text-[#d4af37] not-italic">Savoir-Faire.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {CRAFTSMANSHIP.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#d4af37]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#d4af37] mb-10 group-hover:bg-[#d4af37] group-hover:text-black transition-all duration-500">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic leading-loose">
                    {s.desc}
                  </p>
                  <button className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37] group-hover:gap-6 transition-all">
                    Read Case Study <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE HERITAGE ── */}
      <section className="py-40 px-6 md:px-12 bg-black">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80"
                alt="Vintage Heritage"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-[2s] mix-blend-luminosity grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-16 left-16 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[#d4af37]">
                  Since 1899
                </span>
                <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-none text-[#d4af37]">
                  A Legacy <br /> In Gold.
                </h4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] mb-8 block">
              The Philosophy
            </span>
            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">{c?.aboutTitle ?? fd?.businessName ?? <>
              Eternal <br />{" "}
              <span className="text-[#d4af37] not-italic">Rhythm.</span>
            </>}</h2>
            <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">{c?.aboutText ?? <>
              We don't sell watches. We sell the mastery over the fourth
              dimension. A Zenith is a perpetual heartbeat on your wrist.
            </>}</p>
            <div className="grid grid-cols-2 gap-12">
              {[
                {
                  icon: Compass,
                  label: "Navigation",
                  desc: "Marine chronometer",
                },
                { icon: Shield, label: "Armored", desc: "Durability v2.0" },
                { icon: Globe, label: "Global_Time", desc: "Multi-timezone" },
                { icon: Award, label: "Certified", desc: "METAS/COSC+" },
              ].map((val, i) => (
                <div key={i} className="space-y-4">
                  <val.icon className="w-6 h-6 text-[#d4af37]" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                    {val.label}
                  </h4>
                  <p className="text-[10px] font-light text-white/30 uppercase tracking-widest leading-loose">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
            <MagneticBtn className="mt-20 px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#d4af37] hover:text-white transition-all shadow-2xl">
              Private Boutique Appointment
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-col mb-12">
                <span className="text-5xl font-black tracking-[0.2em] uppercase leading-none italic">
                  Zenith
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] -mt-1 ml-1">
                  Swiss Horology
                </span>
              </div>
              <p className="text-white/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                The absolute mechanical mastery of time. Engineered for the next
                millennium in our Le Locle sanctuary.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] mb-12">
              Collection
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Astra_Series
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Deep_Sea_Units
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Heritage_Line
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Bespoke_Builds
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] mb-12">
              Atelier
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Movement_Lab
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Finishing_Dept
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Certification
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Sourcing
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] mb-12">
              Zenith
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Our_Legacy
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Global_Boutiques
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Ownership_Care
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Press_Archive
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
          <div className="flex items-center gap-12">
            <span>
              &copy; {new Date().getFullYear()} ZENITH HOROLOGY SWITZERLAND.
            </span>
            <div className="flex gap-8">
              <span>METAS_CHRONO_COMPLIANT</span>
              <span>FHH_CERTIFIED_ATELIER</span>
            </div>
          </div>
          <div className="flex gap-12 font-mono">
            <span>SYNC_STATUS_EXTERNAL</span>
            <span>CALIBER_V12_NOMINAL</span>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#050505}
        ::-webkit-scrollbar-thumb{background:#d4af37}
      `}</style>
    </div>
  );
}
