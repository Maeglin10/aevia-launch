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
import { Plane, Globe, Clock, ShieldCheck, Zap, Mail, Phone, ChevronRight, ArrowRight, X, Menu, Compass, Navigation, MapPin, Gauge, Users, Award, Calendar, Wind, Star } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const FLEET = [
  {
    id: 1,
    name: "Global 7500",
    class: "Ultra Long Range",
    range: "7,700 nm",
    pax: "19",
    speed: "Mach 0.925",
    img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    desc: "The world's largest and longest-range business jet. A masterclass in luxury and range.",
  },
  {
    id: 2,
    name: "Gulfstream G650ER",
    class: "Long Range",
    range: "7,500 nm",
    pax: "16",
    speed: "Mach 0.90",
    img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    desc: "Speed and range redefined. The industry standard for international executive travel.",
  },
  {
    id: 3,
    name: "Cessna Citation Longitude",
    class: "Super-Midsize",
    range: "3,500 nm",
    pax: "12",
    speed: "Mach 0.84",
    img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    desc: "Revolutionary comfort with the lowest cabin altitude in its class.",
  },
];

const VALUES = [
  {
    icon: Clock,
    title: "Zero Wait Time",
    desc: "Arrive 15 minutes before take-off. Skip the queues, the security, and the compromise.",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Access 5,000+ airports worldwide, including those inaccessible to commercial airlines.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Safety",
    desc: "Wyvern Wingman and ARGUS Gold rated. Every flight exceeds FAA Part 135 standards.",
  },
  {
    icon: Zap,
    title: "Instant Logistics",
    desc: "Charter a jet in as little as 4 hours. Our global fleet is always on standby for you.",
  },
];

const FLIGHT_LOGS = [
  { label: "Total Flights", value: "14,200+" },
  { label: "Countries Served", value: "120" },
  { label: "Fleet Availability", value: "99.8%" },
  { label: "Safety Rating", value: "Platinum" },
];

const NAV_LINKS = [
  { label: "Fleet", href: "#fleet" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
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
export default function VelocityJetsPage() {
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
  const [activeJet, setActiveJet] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
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

  return (
    <div className="premium-theme min-h-dvh bg-[#050505] text-[#ffffff] font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-black/80 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="relative">
                  <Plane className="w-8 h-8 text-[#00f2ff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter uppercase leading-none italic">
                    Velocity
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#00f2ff] -mt-1">
                    Jet Charter
                  </span>
                </div>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#00f2ff] transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#00f2ff] transition-colors">
                Track_Flight
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-[#00f2ff] group-hover:text-[#00f2ff] transition-all">
                <Navigation className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#00f2ff]"
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
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-black p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-[#00f2ff]"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-6 text-5xl font-black italic uppercase text-white/5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  {link.label}
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
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&q=80"
            alt="Private Jet"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <Badge className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-sm">
              Next-Generation Aviation // Mach 0.9+
            </Badge>
            <h1 className="text-6xl md:text-[9rem] font-black italic leading-[0.8] tracking-tighter mb-10 uppercase">{c?.heroHeadline ?? <>
              Redefining <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-white to-[#00f2ff]">
                Air Superiority.
              </span>
            </>}</h1>
            <p className="max-w-2xl text-lg text-white/40 leading-relaxed font-light italic mb-12">{c?.heroSubline ?? fd?.tagline ?? <>
              Access the world's most advanced fleet of private aircraft. From
              rapid super-midsize charters to ultra-long-range executive suites.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="#contact">
                <MagneticBtn className="px-12 py-5 bg-[#00f2ff] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white transition-all cursor-pointer shadow-2xl shadow-[#00f2ff]/20">
                  Instant_Quote
                </MagneticBtn>
              </Link>
              <Link
                href="#fleet"
                className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                Explore The Fleet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-6">
          {FLIGHT_LOGS.map((log, i) => (
            <div key={i} className="text-right">
              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                {log.label}
              </div>
              <div className="text-2xl font-black text-white italic">
                {log.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES SECTION ── */}
      <section id="services" className="py-32 px-6 md:px-12 border-y border-white/5 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-4 block">
                The Velocity Standard
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                Aerodynamic{" "}
                <span className="not-italic font-thin text-white">
                  Efficiency.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {VALUES.map((v, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-10 border border-white/5 bg-black/40 hover:border-[#00f2ff]/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-[#00f2ff]/10 transition-colors">
                    <v.icon className="w-24 h-24" />
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] mb-8 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-4 italic tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light italic mb-8">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#050505] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">
              Velocity Creed
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">{c?.aboutTitle ?? fd?.businessName ?? <>
              Aviation Engineered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-white to-[#00f2ff]">
                For Absolute Freedom.
              </span>
            </>}</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8 font-light italic">
              Velocity was founded on a simple insight: time is the ultimate non-renewable asset.
            </p>
            <p className="text-white/30 text-sm leading-relaxed mb-12 font-light">{c?.aboutText ?? <>
              By combining machine-learning flight dispatch systems with an elite fleet of modern business jets, we bypass the bottlenecks of modern commercial terminals. We operate on your schedule, coordinating flight paths to 5,000+ global airstrips, ensuring you land closer to your destination, securely and ahead of time.
            </>}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-black text-[#00f2ff] font-mono italic">04 HRS</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">DISPATCH READY</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono italic">WYVERN</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">SAFETY RATED</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono italic">2,800 +</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">GLOBAL BUFFERS</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative aspect-video lg:aspect-[4/3] bg-neutral-950 border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80"
                alt="Velocity Jet Hangar"
                fill
                className="object-cover opacity-60"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] animate-ping" />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#00f2ff]">
                  HANGAR ALPHA // OPERATIONS ACTIVE
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FLEET SECTION ── */}
      <section id="fleet" className="py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-6 uppercase">
                  The <br /> <span className="text-[#00f2ff]">Fleet.</span>
                </h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Curated Aircraft for Global Reach
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-4 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all">
                  Download_Spec_Sheets
                </button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {FLEET.map((jet, i) => (
              <Reveal key={jet.id} delay={i * 0.1}>
                <div
                  className="group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer border border-white/5"
                  onMouseEnter={() => setActiveJet(jet.id)}
                  onMouseLeave={() => setActiveJet(null)}
                >
                  <Image
                    src={jet.img}
                    alt={jet.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff] mb-2">
                      {jet.class}
                    </span>
                    <h3 className="text-4xl font-black italic uppercase mb-8 tracking-tighter leading-none">
                      {jet.name}
                    </h3>

                    <AnimatePresence>
                      {activeJet === jet.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="space-y-8 pt-8 border-t border-white/10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">
                                Max_Speed
                              </div>
                              <div className="text-lg font-black text-white italic">
                                {jet.speed}
                              </div>
                            </div>
                            <div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">
                                Range
                              </div>
                              <div className="text-lg font-black text-white italic">
                                {jet.range}
                              </div>
                            </div>
                            <div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">
                                Capacity
                              </div>
                              <div className="text-lg font-black text-white italic">
                                {jet.pax} PAX
                              </div>
                            </div>
                            <div className="flex items-end justify-end">
                              <button className="w-10 h-10 rounded-full bg-[#00f2ff] flex items-center justify-center text-black">
                                <ArrowRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-white/40 italic leading-relaxed">
                            {jet.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section id="testimonials" className="py-32 px-6 md:px-12 bg-[#080808] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-4 block">
                Telemetry of Trust
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                Endorsed by <br />
                <span className="not-italic font-thin text-white">Global Operators.</span>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Velocity has transformed how we manage our global board meetings. The ability to launch a jet in under four hours is a game-changer.",
                author: "Chief Executive Officer",
                location: "Tech Conglomerate",
              },
              {
                quote: "The cabin comfort on the Global 7500 was exceptional, and the crew's attention to detail was flawless. Highly recommended.",
                author: "Private Collector",
                location: "Los Angeles",
              },
              {
                quote: "Wyvern Wingman safety rating and top-tier aircraft maintenance. Velocity gives me absolute peace of mind on every journey.",
                author: "Logistics Director",
                location: "London",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 border border-white/5 bg-black/40 hover:border-[#00f2ff]/30 transition-all relative">
                  <div className="text-5xl text-[#00f2ff]/20 font-serif absolute top-6 left-8 font-black leading-none">“</div>
                  <p className="text-sm text-white/50 leading-relaxed font-light italic mb-8 relative z-10 pt-4">
                    {t.quote}
                  </p>
                  <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff]">
                      {t.author}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                      {t.location}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE HUD ── */}
      <section id="realisations" className="py-32 bg-[#00f2ff] text-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40 mb-8 block">
              Live Network Status
            </span>
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.8] mb-10 uppercase">
              Terminal <br /> <span className="text-white">Telemetry.</span>
            </h2>
            <p className="text-black/60 text-lg leading-relaxed mb-12 italic font-light">
              Our proprietary dispatch AI monitors 2,800 aircraft across 5
              partner networks to ensure 100% mission readiness at any
              coordinate.
            </p>
            <div className="space-y-6">
              {[
                { label: "Dispatch Reliability", val: "99.8%" },
                { label: "Avg_Activation_Time", val: "4.2 Hours" },
                { label: "Safety_Audit_Pass_Rate", val: "100%" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex justify-between items-end border-b border-black/10 pb-4"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </span>
                  <span className="text-3xl font-black italic">{stat.val}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative aspect-video bg-black rounded-sm overflow-hidden p-1 border border-white/10 group">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,242,255,0.05)_50%,transparent_100%)] bg-[length:200%_100%] animate-pulse" />
              <div className="relative z-10 h-full flex flex-col justify-between p-8">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#00f2ff]">
                      Network_Feed_Live
                    </span>
                    <span className="text-[12px] font-black text-white/50 tracking-tighter font-mono italic">
                      ALPHA_SECTOR_GRID_4.2
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                    <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Gauge className="w-32 h-32 text-[#00f2ff] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-1 bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: i * 0.5,
                        }}
                        className="h-full bg-[#00f2ff]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="py-32 px-6 md:px-12 bg-[#050505] border-b border-white/5">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-4 block">
                Aviation Operations FAQ
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Frequently <br />
                <span className="not-italic font-thin text-white">Asked Questions.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  q: "How quickly can a flight be activated?",
                  a: "Our global dispatch desk can activate an aircraft and have it ready for take-off in as little as 4 hours from booking confirmation.",
                },
                {
                  q: "What are your safety standards?",
                  a: "We hold Wyvern Wingman and ARGUS Gold safety ratings. Every operator in our network is audited to meet and exceed FAA Part 135 regulations.",
                },
                {
                  q: "Can I choose specific catering and cabin configurations?",
                  a: "Absolutely. All flights can be customized with bespoke catering, specific cabin layouts, and security personnel upon request.",
                },
                {
                  q: "What is your cancellation policy?",
                  a: "Cancellation terms depend on the aircraft class and flight route. Detailed terms are provided during the instant quote process.",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-white/5 bg-black/40 px-6 rounded-sm">
                  <AccordionTrigger className="text-[11px] font-bold uppercase tracking-widest text-[#00f2ff] hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/40 text-sm font-light italic leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" className="py-32 px-6 md:px-12 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">
              Flight Dispatch Desk
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">
              Request <br />
              <span className="not-italic font-thin text-white">A Quote.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-12 font-light italic">
              Contact our operations desk to coordinate your next flight. Instant logistics mapping for any destination worldwide.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#00f2ff]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">OPERATIONS EMAIL</div>
                  <div className="text-sm font-bold">{fd?.email ?? "ops@velocityjets.com"}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#00f2ff]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">DISPATCH VOICE</div>
                  <div className="text-sm font-bold">+1 (800) 555-FLIGHT</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#00f2ff]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">PRINCIPAL HANGAR</div>
                  <div className="text-sm font-bold">Teterboro Airport (KTEB), NJ</div>
                </div>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="p-12 border border-white/5 bg-black/40">
              {contactSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full border border-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] mx-auto mb-6 bg-[#00f2ff]/5">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">FLIGHT INQUIRY REGISTERED</h3>
                  <p className="text-sm text-white/40 font-light italic">
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">DEPARTURE AIRPORT</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm"
                        placeholder="KTEB or New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">ARRIVAL AIRPORT</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm"
                        placeholder="LSGG or Geneva"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">SECURE EMAIL</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm"
                        placeholder="client@confidential.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">PHONE NUMBER</label>
                      <input
                        type="tel"
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm"
                        placeholder="+1 (555) 019-2834"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">AIRCRAFT CLASS</label>
                    <select
                      className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white/60 focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm"
                    >
                      <option value="ultra">Ultra Long Range (e.g. Global 7500)</option>
                      <option value="long">Long Range (e.g. Gulfstream G650)</option>
                      <option value="mid">Super-Midsize (e.g. Citation Longitude)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">ADDITIONAL LOGISTICS</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-colors rounded-sm resize-none"
                      placeholder="Catering preferences, ground transport coordination..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#00f2ff] text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    REQUEST INSTANT TELEMETRY
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-24 mb-32">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <Plane className="w-10 h-10 text-[#00f2ff]" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter uppercase leading-none italic">
                    Velocity
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-[#00f2ff] -mt-1">
                    Jet Charter
                  </span>
                </div>
              </div>
              <p className="text-white/20 max-w-sm mb-12 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed italic">
                The edge of aviation. Unlocking global movement with precision,
                speed, and absolute discretion.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Globe].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-[#00f2ff] hover:text-black transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff] mb-10">
              Capabilities
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Charter_Search
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Empty_Leg_Deals
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Group_Charters
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Medical_Evac
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff] mb-10">
              Experience
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Jet_Card_Login
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Concierge_Desk
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Catering_Menu
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Ground_Logistics
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff] mb-10">
              Institutional
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Safety_Audit
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Our_Team
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <div className="flex items-center gap-10">
            <span>
              &copy; {new Date().getFullYear()} VELOCITY AVIATION GROUP.
            </span>
            <div className="flex gap-6">
              <span>ICAO_REGULATORY_SYNC</span>
              <span>PLATINUM_ARGUS_SAFETY</span>
            </div>
          </div>
          <div className="flex gap-10">
            <Link href="#contact" className="hover:text-[#00f2ff] transition-colors">Mentions Légales</Link>
            <Link href="#contact" className="hover:text-[#00f2ff] transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-[#00f2ff] transition-colors">CGU</Link>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#050505}
        ::-webkit-scrollbar-thumb{background:#00f2ff}
      `}</style>
    </div>
  );
}
