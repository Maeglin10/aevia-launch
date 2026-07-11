"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Volume2, Music, Mic2, Disc, Waves, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Headphones, Radio, Settings2, Play, Speaker, Zap, Activity, Info, Share2, Heart, Search, ShoppingBag } from "lucide-react"

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const COLLECTIONS = [
  { 
    id: 1, 
    name: "Aether One", 
    category: "Reference Monitors", 
    price: "$12,500 / pair",
    desc: "Electrostatic drivers paired with a vacuum-tube crossover for unparalleled transient response.",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&q=80"
  },
  { 
    id: 2, 
    name: "Vortex Amp", 
    category: "Amplification", 
    price: "$8,200",
    desc: "Pure Class-A amplification with zero negative feedback, housed in a monolithic copper chassis.",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
  },
  { 
    id: 3, 
    name: "Sonic Prism", 
    category: "Digital Source", 
    price: "$6,800",
    desc: "R2R ladder DAC with femto-second clocking for the most natural digital-to-analog conversion.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80"
  },
];

const ENGINEERING = [
  { 
    title: "Acoustic Geometry", 
    desc: "Every enclosure is CNC-milled from solid blocks of aeronautical aluminum to eliminate internal resonances.",
    icon: Speaker
  },
  { 
    title: "Signal Purity", 
    desc: "Point-to-point hand-wiring with 6N silver conductors ensuring zero phase distortion across the spectrum.",
    icon: Waves
  },
  { 
    title: "Harmonic Integrity", 
    desc: "Proprietary DSP algorithms that preserve the 'breath' of live recordings while managing room acoustics.",
    icon: Activity
  },
];

const STATS = [
  { label: "Frequency Range", value: "8Hz - 120kHz" },
  { label: "Signal-to-Noise", value: "142dB" },
  { label: "Master Craftsmen", value: "12" },
  { label: "Countries Served", value: "45" },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function MagneticBtn({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  }, [x, y]);

  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }} onClick={onClick} className={className}>
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
export default function AetherSoundPage() {
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
    <div className="premium-theme min-h-screen bg-[#080808] text-[#d4d4d4] font-sans selection:bg-[#c9a84c] selection:text-black overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-center">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
             <span className="text-3xl font-black tracking-[0.1em] uppercase leading-none italic">Aether</span>
             <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#c9a84c] -mt-1 ml-1">Sound Labs</span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Reference", "Amplification", "Source", "Consultation", "Archives"].map(link => (
              <Link key={link} href={`/templates/impact-07/${link.toLowerCase()}`} className="hover:text-[#c9a84c] transition-colors cursor-pointer">{link}</Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
             <Link href="/templates/impact-07/client-lounge" className="hidden md:flex items-center gap-3 group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#c9a84c] transition-colors">Client_Lounge</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#c9a84c] group-hover:text-black group-hover:border-[#c9a84c] transition-all">
                   <Volume2 className="w-4 h-4" />
                </div>
             </Link>
             <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[#c9a84c]"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-black p-12 flex flex-col justify-center gap-10">
             <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40 hover:text-[#c9a84c]"><X className="w-10 h-10"/></button>
             <div className="flex flex-col gap-6 text-6xl font-black uppercase italic text-white/5">
                {["System", "Engineering", "Consult", "About"].map(l => (
                   <Link key={l} href={`/templates/impact-07/${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="hover:text-[#c9a84c] transition-all">{l}</Link>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1600&q=80" alt="Audio Studio" fill className="object-cover opacity-40 mix-blend-luminosity grayscale contrast-150" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <Reveal>
             <Badge className="bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
                Berlin, Germany // Established 1994
             </Badge>
             <h1 className="text-8xl md:text-[14rem] font-black leading-[0.75] tracking-tighter mb-12 uppercase text-white italic">{c?.heroHeadline ?? <>
               The <br/> <span className="text-[#c9a84c] not-italic">Silence.</span>
             </>}</h1>
             <p className="max-w-md text-xl text-white/30 leading-relaxed font-light mb-12 uppercase tracking-widest italic">{c?.heroSubline ?? fd?.tagline ?? <>
               Redefining the threshold of hearing. Precision sonic instruments for the world's most discerning ears.
             </>}</p>
             <div className="flex flex-col sm:flex-row gap-6">
                <MagneticBtn className="px-12 py-5 bg-[#c9a84c] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(201,168,76,0.3)]">
                  Request Audition
                </MagneticBtn>
                <Link href="/templates/impact-07/current-collection" className="px-12 py-5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                  Current Collection <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </Reveal>

          <div className="hidden lg:flex justify-end pr-12 relative">
             <Reveal delay={0.4}>
                <div className="relative w-96 h-96 rounded-full border border-white/5 flex items-center justify-center">
                   <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 border border-[#c9a84c] rounded-full" />
                   <div className="text-center">
                      <span className="text-5xl font-black italic block text-[#c9a84c]">-142dB</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Signal To Noise Ratio</span>
                   </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#c9a84c] rounded-full blur-2xl opacity-20 animate-pulse" />
             </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {STATS.map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="text-center md:text-left">
                      <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c9a84c] mb-2">{stat.label}</div>
                      <div className="text-5xl font-black italic text-white">{stat.value}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── REFERENCE ── */}
      <section id="reference" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
               <div>
                  <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">The <br/> <span className="text-[#c9a84c]">Line.</span></h2>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Reference Manifest // Hand-Crafted // Series 07</p>
               </div>
               <Link href="/templates/impact-07/technical-archive" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a84c] border-b border-[#c9a84c] pb-2 hover:text-white hover:border-white transition-all">Download Technical Archive</Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {COLLECTIONS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                 <div className="group space-y-10 cursor-pointer" onMouseEnter={() => setActiveItem(item.id)} onMouseLeave={() => setActiveItem(null)}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                       <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-125" />
                       <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-700" />
                       
                       <div className="absolute top-6 left-6">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                             {item.category}
                          </Badge>
                       </div>

                       <AnimatePresence>
                          {activeItem === item.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-[#c9a84c]/10 backdrop-blur-[2px]">
                               <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">Acoustic Specs</button>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-baseline">
                          <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#c9a84c] transition-colors">{item.name}</h3>
                          <span className="text-lg font-black text-[#c9a84c] tracking-tighter">{item.price}</span>
                       </div>
                       <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic leading-loose">{item.desc}</p>
                       <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <Settings2 className="w-5 h-5 text-white/10 group-hover:text-[#c9a84c] transition-all" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGINEERING PHILOSOPHY ── */}
      <section className="py-40 bg-[#0a0a0a] overflow-hidden relative border-t border-white/5">
         <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-[#c9a84c]/5 blur-[120px] rounded-full" />
         <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
               <div className="text-center mb-32">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] mb-8 block">Sonic Integrity</span>
                  <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">Physical <span className="text-[#c9a84c] not-italic">Acoustics.</span></h2>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {ENGINEERING.map((s, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#c9a84c]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#c9a84c] mb-10 group-hover:bg-[#c9a84c] group-hover:text-black transition-all duration-500">
                          <s.icon className="w-8 h-8" />
                       </div>
                       <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">{s.title}</h3>
                       <p className="text-sm text-white/30 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic leading-loose">{s.desc}</p>
                       <button className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#c9a84c] group-hover:gap-6 transition-all">
                          Read Whitepaper <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── THE ATELIER ── */}
      <section className="py-40 px-6 md:px-12 bg-black">
         <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <Reveal>
               <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
                  <Image src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop" alt="Audio Engineering" fill className="object-cover group-hover:scale-110 transition-all duration-[3s] grayscale hover:grayscale-0 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-16 left-16 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[#c9a84c]">The Atelier</span>
                     <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Vacuum Tube <br/> Architecture.</h4>
                  </div>
               </div>
            </Reveal>

            <Reveal delay={0.2}>
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] mb-8 block">The Protocol</span>
               <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">{c?.aboutTitle ?? fd?.businessName ?? <>
                 Pure <br/> <span className="text-[#c9a84c] not-italic">Sync.</span>
               </>}</h2>
               <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">{c?.aboutText ?? <>
                 Beyond the measurement. We design sonic instruments that merge the mathematical precision of modern electronics with the emotional warmth of vintage analog philosophy.
               </>}</p>
               <div className="grid grid-cols-2 gap-12">
                  {[
                    { icon: Mic2, label: "Studio_Reference", desc: "1:1 Accuracy" },
                    { icon: Radio, label: "Analog_Warmth", desc: "Zero phase drift" },
                    { icon: Disc, label: "Source_Purity", desc: "R2R Ladder DAC" },
                    { icon: Zap, label: "Instant_Response", desc: "0.2ms Transient" },
                  ].map((val, i) => (
                    <div key={i} className="space-y-4">
                       <val.icon className="w-6 h-6 text-[#c9a84c]" />
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{val.label}</h4>
                       <p className="text-[10px] font-light text-white/30 uppercase tracking-widest leading-loose">{val.desc}</p>
                    </div>
                  ))}
               </div>
               <MagneticBtn className="mt-20 px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#c9a84c] hover:text-white transition-all shadow-2xl">
                  Schedule Listening Session
               </MagneticBtn>
            </Reveal>
         </div>
      </section>

      {/* ── HERITAGE & ORIGIN ── */}
      <section id="realisations" className="py-40 bg-black relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-[#c9a84c]/5 blur-[180px] rounded-full" />
         <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] mb-8 block">The Chronology</span>
                  <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">
                    Three <br/> <span className="text-[#c9a84c] not-italic">Decades.</span>
                  </h2>
                  <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic leading-loose">
                    Since 1994, Aether has operated at the intersection of material science and auditory emotion. Our journey began in a small workshop in Kreuzberg and has evolved into a global benchmark for reference sound.
                  </p>
                  <div className="space-y-12">
                     {[
                       { year: "1994", event: "The Aether Lab is founded. Initial research into electrostatic driver stability begins." },
                       { year: "2005", event: "Launch of the Vortex Series. First implementation of pure Class-A copper chassis amplification." },
                       { year: "2018", event: "Aether One is released. Redefining the frequency response limit for commercial monitors." },
                       { year: "2024", event: "Integration of femto-clocking across the entire digital source lineup." },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-12 group">
                           <span className="text-3xl font-black italic text-[#c9a84c] opacity-40 group-hover:opacity-100 transition-opacity">{item.year}</span>
                           <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 leading-loose">{item.event}</p>
                        </div>
                     ))}
                  </div>
               </Reveal>
               <Reveal delay={0.2}>
                  <div className="relative aspect-square grayscale opacity-50 hover:opacity-100 transition-opacity duration-1000 border border-white/5">
                     <Image src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop" alt="Vintage Audio" fill className="object-cover" />
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── TECHNICAL SPECIFICATIONS ── */}
      <section className="py-40 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] mb-8 block">Acoustic Manifest</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">Full <br/> <span className="text-[#c9a84c] not-italic">Spectrum.</span></h2>
              </div>
           </Reveal>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10">
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Specification</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Aether_One</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Vortex_Amp</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Sonic_Prism</th>
                    </tr>
                 </thead>
                 <tbody className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    {[
                      { s: "Frequency Response", v1: "8Hz - 120kHz", v2: "1Hz - 250kHz", v3: "DC - 96kHz" },
                      { s: "Total Harmonic Dist.", v1: "< 0.001%", v2: "< 0.0005%", v3: "< 0.0002%" },
                      { s: "Output Impedance", v1: "4 - 16 Ohms", v2: "0.01 Ohms", v3: "50 Ohms" },
                      { s: "Chassis Material", v1: "T6 Aluminum", v2: "C110 Copper", v3: "Aircraft Grade Ti" },
                      { s: "Weight (KG)", v1: "85kg / unit", v2: "42kg", v3: "18kg" },
                    ].map((row, i) => (
                       <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-8 text-white/40 italic">{row.s}</td>
                          <td className="py-8 text-white">{row.v1}</td>
                          <td className="py-8 text-white">{row.v2}</td>
                          <td className="py-8 text-white">{row.v3}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* ── ARTISAN PROFILES ── */}
      <section className="py-40 bg-black">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32 text-center">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] mb-8 block">The Craftsmen</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">Human <span className="text-[#c9a84c] not-italic">Element.</span></h2>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
              {[
                { name: "Dieter Klaus", role: "Master Luthier & Cabinetist", text: "Wood is a living resonator. We treat our speaker enclosures like cellos—carefully aged, meticulously tensioned, and finished with organic oils to preserve the wood's natural breath.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                { name: "Elena Volkov", role: "Senior Analog Engineer", text: "Silicon has its place, but for pure emotional transmission, vacuum tubes remain the gold standard. We design circuits that respect the soul of the signal while pushing the limits of modern stability.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.2}>
                   <div className="space-y-12">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden grayscale border border-[#c9a84c]/30">
                         <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <blockquote className="text-3xl font-light italic text-white/60 leading-relaxed uppercase tracking-widest leading-loose">
                         "{item.text}"
                      </blockquote>
                      <div>
                         <span className="text-xl font-black text-white italic block mb-1">{item.name}</span>
                         <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a84c]">{item.role}</span>
                      </div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="contact" className="py-40 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
           <Reveal>
              <div className="mb-24 text-center">
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-8">Sonic <span className="text-[#c9a84c] not-italic">Dialogues.</span></h2>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Acquisition // Setup // Integrity</p>
              </div>
           </Reveal>

           <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "What is the lead time for Aether One monitors?", a: "Due to the hand-crafted nature of our electrostatic drivers and CNC-milled enclosures, current lead time is 12 to 16 weeks from order confirmation." },
                { q: "Do you offer on-site acoustic calibration?", a: "Every reference system includes a 3-day on-site calibration visit by an Aether Senior Engineer to optimize room acoustics and system alignment." },
                { q: "Is the system compatible with digital streamers?", a: "While we advocate for pure analog sources, our Sonic Prism DAC is engineered specifically to provide a bridge between modern high-res streaming and traditional hi-fi warmth." },
                { q: "What is the warranty on vacuum-tube components?", a: "We provide a 5-year comprehensive warranty on all chassis and circuitry, and a 1-year performance guarantee on all selected premium vacuum tubes." },
                { q: "Can I audition the systems in person?", a: "Auditions are available strictly by appointment at our Berlin Atelier or through our select private partners in London, Tokyo, and New York." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-8 rounded-sm">
                   <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#c9a84c] py-8 no-underline italic">
                      {item.q}
                   </AccordionTrigger>
                   <AccordionContent className="text-[11px] font-light text-white/30 tracking-widest uppercase italic leading-loose pb-8">
                      {item.a}
                   </AccordionContent>
                </AccordionItem>
              ))}
           </Accordion>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080808] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
           
           <div className="lg:col-span-6">
              <Reveal>
                 <div className="flex flex-col mb-12">
                    <span className="text-4xl font-black tracking-[0.1em] uppercase leading-none italic">Aether</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a84c] -mt-1 ml-1">Sound Labs</span>
                 </div>
                 <p className="text-white/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                    The absolute mastery of acoustic engineering. Engineered for the evolutionary audiophile in our Berlin sanctuary.
                 </p>
                 <div className="flex gap-6">
                    {[Globe, Globe, Mail].map((Icon, i) => (
                      <button key={i} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#c9a84c] hover:text-black hover:border-[#c9a84c] transition-all">
                         <Icon className="w-5 h-5" />
                      </button>
                    ))}
                 </div>
              </Reveal>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c9a84c] mb-12">Instruments</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="/templates/impact-07/aether-one" className="hover:text-white transition-colors">Aether_One</Link></li>
                 <li><Link href="/templates/impact-07/vortex-amplification" className="hover:text-white transition-colors">Vortex_Amplification</Link></li>
                 <li><Link href="/templates/impact-07/sonic-prism-dac" className="hover:text-white transition-colors">Sonic_Prism_DAC</Link></li>
                 <li><Link href="/templates/impact-07/legacy-support" className="hover:text-white transition-colors">Legacy_Support</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c9a84c] mb-12">Engineering</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="/templates/impact-07/the-process" className="hover:text-white transition-colors">The_Process</Link></li>
                 <li><Link href="/templates/impact-07/material-science" className="hover:text-white transition-colors">Material_Science</Link></li>
                 <li><Link href="/templates/impact-07/room-correction" className="hover:text-white transition-colors">Room_Correction</Link></li>
                 <li><Link href="/templates/impact-07/consultation" className="hover:text-white transition-colors">Consultation</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c9a84c] mb-12">Studio</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="/templates/impact-07/the-maison" className="hover:text-white transition-colors">The_Maison</Link></li>
                 <li><Link href="/templates/impact-07/global-units" className="hover:text-white transition-colors">Global_Units</Link></li>
                 <li><Link href="/templates/impact-07/technical-kit" className="hover:text-white transition-colors">Technical_Kit</Link></li>
                 <li><Link href="/templates/impact-07/archives" className="hover:text-white transition-colors">Archives</Link></li>
              </ul>
           </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
           <div className="flex items-center gap-12">
              <span>&copy; {new Date().getFullYear()} AETHER SOUND LABS GROUP.</span>
              <div className="flex gap-8">
                <span>HI_RES_AUDIO_CERTIFIED</span>
                <span>BERLIN_ENGINEERED</span>
              </div>
           </div>
           <div className="flex gap-12 font-mono">
              <span>DB_FLOOR_-142</span>
              <span>SAMPLING_768KHZ_NOMINAL</span>
           </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#080808}
        ::-webkit-scrollbar-thumb{background:#c9a84c}
      `}</style>
    </div>
  );
}
