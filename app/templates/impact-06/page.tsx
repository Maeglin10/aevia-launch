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
import { Zap, Brain, Activity, ShieldCheck, Star, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Cpu, Droplets, FlaskConical, Microscope, Dna, Scan, Binary, Sparkles, ShoppingBag, Heart, Search, Eye } from "lucide-react"

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const PRODUCTS = [
  { 
    id: 1, 
    name: "Neural Link V2", 
    category: "Hardware", 
    price: "$2,450",
    desc: "A sub-dermal haptic relay providing 1:1 sensory mapping between physical and digital environments.",
    img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&q=80"
  },
  { 
    id: 2, 
    name: "Oxy-Flow Serum", 
    category: "Bio-Tech", 
    price: "$450",
    desc: "Synthetic blood enhancement that increases oxygen transport to the prefrontal cortex by 40%.",
    img: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&q=80"
  },
  { 
    id: 3, 
    name: "Prism AR Lens", 
    category: "Optics", 
    price: "$1,800",
    desc: "Retinal projection system with 32k resolution and integrated neural eye-tracking.",
    img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&q=80"
  },
];

const INNOVATIONS = [
  { 
    title: "Molecular Synthesis", 
    desc: "Our lab utilizes 4D molecular printing to create biocompatible materials that evolve with your cellular structure.",
    icon: Dna
  },
  { 
    title: "Neural Bridging", 
    desc: "Achieve sub-millisecond latency in thought-to-command execution with our proprietary bridge protocols.",
    icon: Binary
  },
  { 
    title: "Eco-Biological Cycle", 
    desc: "Every augmentation is 100% recyclable within the human biological loop, ensuring zero systemic residue.",
    icon: Droplets
  },
];

const STATS = [
  { label: "Sync Latency", value: "0.8ms" },
  { label: "Biocompatibility", value: "99.9%" },
  { label: "Active Users", value: "125k" },
  { label: "R&D Patents", value: "480" },
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
export default function NeuralisPage() {
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
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

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
    <div className="premium-theme min-h-screen bg-[#020204] text-[#e0e0e0] font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#020204]/90 backdrop-blur-3xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-center">
             {fd?.logoBase64 ? (
               <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
             ) : (
               <>
                 <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none">{fd?.businessName ?? "Neuralis"}</span>
                 <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] -mt-1 ml-1">Augmentation Lab</span>
               </>
             )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Innovations", "Solutions", "Ethics", "Atelier", "Support"].map(link => (
              <Link key={link} href="#solutions" className="hover:text-[#00f2ff] transition-colors cursor-pointer">{link}</Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
             <button className="hidden md:flex items-center gap-3 group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#00f2ff] transition-colors">Client_Portal</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#00f2ff] group-hover:text-black group-hover:border-[#00f2ff] transition-all">
                   <Scan className="w-4 h-4" />
                </div>
             </button>
             <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[#00f2ff]"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[100] bg-[#020204] p-12 flex flex-col justify-center gap-10">
             <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40 hover:text-[#00f2ff]"><X className="w-10 h-10"/></button>
             <div className="flex flex-col gap-6 text-6xl font-black uppercase text-white/5">
                {["Products", "Research", "Labs", "Contact"].map(l => (
                   <Link key={l} href="#solutions" onClick={() => setMenuOpen(false)} className="hover:text-[#00f2ff] transition-all hover:pl-6">{l}</Link>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80" alt="Cyber Grid" fill className="object-cover opacity-20 mix-blend-screen" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
          <Reveal>
             <Badge className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
                Bio-Synthetic Standard // Tier 01
             </Badge>
             <h1 className="text-8xl md:text-[11rem] font-black leading-[0.8] tracking-tighter mb-12 uppercase text-white">{c?.heroHeadline ?? <>
               Tame Your <br/> <span className="text-[#00f2ff]">Biology.</span>
             </>}</h1>
             <p className="max-w-md text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">{c?.heroSubline ?? fd?.tagline ?? <>
               The apex of neuro-synthetic integration. Engineered for the evolutionary elite.
             </>}</p>
             <div className="flex flex-col sm:flex-row gap-6">
                <MagneticBtn className="px-12 py-5 bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_50px_rgba(0,242,255,0.3)]">
                  Enter The Atelier
                </MagneticBtn>
                <Link href="#solutions" className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                  Research Data <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </Reveal>

          <div className="hidden lg:flex justify-end relative">
             <Reveal delay={0.4}>
                <div className="relative w-[500px] h-[500px] rounded-full border border-[#00f2ff]/10 flex items-center justify-center">
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-[#00f2ff] rounded-full opacity-40" />
                   <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-10 border-b-2 border-white/20 rounded-full" />
                   <div className="text-center space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/20 block">Neural_Sync</span>
                      <span className="text-6xl font-black italic text-[#00f2ff]">0.8ms</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 block">Latency Threshold</span>
                   </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#00f2ff] rounded-full blur-[100px] opacity-10 animate-pulse" />
             </Reveal>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 flex flex-col gap-4 text-white/10">
           <div className="flex gap-4 items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest">Status: Nominal</span>
              <div className="w-12 h-[1px] bg-white/10" />
           </div>
           <div className="flex gap-4 items-center font-mono text-[9px]">
              <span>//_X_COORD: 144.2</span>
              <span>//_Y_COORD: 092.1</span>
           </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 border-y border-white/5 bg-[#040408]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {STATS.map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="text-center md:text-left">
                      <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00f2ff] mb-2">{stat.label}</div>
                      <div className="text-5xl font-black italic text-white">{stat.value}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section id="solutions" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
               <div>
                  <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">The <br/> <span className="text-[#00f2ff]">Vault.</span></h2>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Internal Spec // Bio-Sync 8.0 // Q4 2024</p>
               </div>
               <Link href="#solutions" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f2ff] border-b border-[#00f2ff] pb-2 hover:text-white hover:border-white transition-all">View All Research Logs</Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PRODUCTS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                 <div className="group space-y-10 cursor-pointer" onMouseEnter={() => setActiveProduct(item.id)} onMouseLeave={() => setActiveProduct(null)}>
                    <div className="relative aspect-square overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                       <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-125" />
                       <div className="absolute inset-0 bg-[#020204]/40 group-hover:bg-transparent transition-colors duration-700" />
                       
                       <div className="absolute top-6 left-6">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                             {item.category}
                          </Badge>
                       </div>

                       <AnimatePresence>
                          {activeProduct === item.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-[#00f2ff]/10 backdrop-blur-[2px]">
                               <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">Initialize Scan</button>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-baseline">
                          <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#00f2ff] transition-colors">{item.name}</h3>
                          <span className="text-lg font-black text-[#00f2ff] tracking-tighter">{item.price}</span>
                       </div>
                       <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic leading-loose">{item.desc}</p>
                       <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <Sparkles className="w-5 h-5 text-white/10 group-hover:text-[#00f2ff] transition-all" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INNOVATION PHILOSOPHY ── */}
      <section className="py-40 bg-[#040408] overflow-hidden relative border-t border-white/5">
         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#00f2ff]/5 blur-[120px] rounded-full" />
         <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
               <div className="text-center mb-32">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">Molecular Sovereignty</span>
                  <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">Bio-Digital <span className="text-[#00f2ff] not-italic">Synthesis.</span></h2>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {INNOVATIONS.map((s, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#00f2ff]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#00f2ff] mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all duration-500">
                          <s.icon className="w-8 h-8" />
                       </div>
                       <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">{s.title}</h3>
                       <p className="text-sm text-white/30 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic leading-loose">{s.desc}</p>
                       <button className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#00f2ff] group-hover:gap-6 transition-all">
                          Sourcing Integrity <ArrowRight className="w-4 h-4" />
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
                  <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80" alt="Bio Lab" fill className="object-cover group-hover:scale-110 transition-all duration-[3s] mix-blend-screen opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-16 left-16 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[#00f2ff]">The Atelier</span>
                     <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Neural <br/> Architecture.</h4>
                  </div>
               </div>
            </Reveal>

            <Reveal delay={0.2}>
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">The Protocol</span>
               <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">{c?.aboutTitle ?? fd?.businessName ?? <>
                 Pure <br/> <span className="text-[#00f2ff] not-italic">Sync.</span>
               </>}</h2>
               <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">{c?.aboutText ?? <>
                 Beyond the interface. We design biological extensions that merge the raw power of synthetic processing with the elegant complexity of human neurology.
               </>}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[
                    { icon: Brain, label: "Neuro_Mapping", desc: "1:1 Synapse match" },
                    { icon: ShieldCheck, label: "Bio_Safe", desc: "Zero systemic residue" },
                    { icon: Activity, label: "Real_Time", desc: "Sub-ms bridging" },
                    { icon: Sparkles, label: "Augmented", desc: "Cognitive +40%" },
                  ].map((val, i) => (
                    <div key={i} className="space-y-4">
                       <val.icon className="w-6 h-6 text-[#00f2ff]" />
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{val.label}</h4>
                       <p className="text-[10px] font-light text-white/30 uppercase tracking-widest leading-loose">{val.desc}</p>
                    </div>
                  ))}
               </div>
               <MagneticBtn className="mt-20 px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#00f2ff] hover:text-black transition-all shadow-2xl">
                  Request Diagnostic Scan
               </MagneticBtn>
            </Reveal>
         </div>
      </section>

      {/* ── CLINICAL TRIALS & DATA ── */}
      <section className="py-40 bg-[#050508] relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">Empirical Evidence</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">Clinical <br/> <span className="text-[#00f2ff] not-italic">Validation.</span></h2>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {[
                { phase: "Phase III", focus: "Neural Plasticity", result: "94.2% Success", desc: "Long-term study on synaptic bridge stability across 10,000 subjects over a 24-month period." },
                { phase: "Phase II", focus: "Oxy-Flow Bio-Sync", result: "0.02% Rejection", desc: "Biocompatibility testing for synthetic serum integration within pulmonary and cardiovascular systems." },
                { phase: "Phase IV", focus: "Cognitive Load", result: "3.2x Bandwidth", desc: "Real-world testing of Prism AR data visualization during high-stress operational environments." },
              ].map((trial, i) => (
                <div key={i} className="p-12 border border-white/5 bg-white/[0.01] hover:border-[#00f2ff]/20 transition-all group">
                   <Badge className="bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/20 mb-8">{trial.phase}</Badge>
                   <h3 className="text-2xl font-black uppercase italic text-white mb-4 group-hover:text-[#00f2ff] transition-colors">{trial.focus}</h3>
                   <div className="text-4xl font-black text-[#00f2ff] mb-6 italic tracking-tighter">{trial.result}</div>
                   <p className="text-sm text-white/20 font-light tracking-widest uppercase italic leading-loose">{trial.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── NEURAL SECURITY ── */}
      <section id="contact" className="py-40 bg-black">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <Reveal>
              <div className="relative aspect-video rounded-sm overflow-hidden border border-white/5 group">
                 <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80" alt="Security" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-[3s]" />
                 <div className="absolute inset-0 bg-[#00f2ff]/5 animate-pulse" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-24 h-24 text-[#00f2ff]" />
                 </div>
              </div>
           </Reveal>
           <Reveal delay={0.2}>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">Fortress Protocol</span>
              <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">
                Zero <br/> <span className="text-[#00f2ff] not-italic">Trust.</span>
              </h2>
              <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic leading-loose">
                Your brain is the final frontier of privacy. Our Neural Security layer implements hardware-level encryption that physically disconnects the bridge if any external intrusion is detected. No cloud, no backdoors, no exceptions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {[
                   { label: "Encryption", val: "Quantum-Air" },
                   { label: "Fail-Safe", val: "Hardware Kill" },
                   { label: "Auth", val: "Biometric 3.0" },
                   { label: "Audits", val: "Real-Time" },
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 block">{item.label}</span>
                       <span className="text-sm font-black text-white uppercase tracking-widest block">{item.val}</span>
                    </div>
                 ))}
              </div>
           </Reveal>
        </div>
      </section>

      {/* ── GLOBAL NODES ── */}
      <section className="py-40 bg-[#050508] border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32 text-center">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">Operational Grid</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">Global <span className="text-[#00f2ff] not-italic">Nodes.</span></h2>
              </div>
           </Reveal>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { city: "Tokyo", status: "Nominal", latency: "0.2ms" },
                { city: "Berlin", status: "Nominal", latency: "0.4ms" },
                { city: "New York", status: "Peak Load", latency: "0.8ms" },
                { city: "Singapore", status: "Nominal", latency: "0.3ms" },
                { city: "London", status: "Nominal", latency: "0.5ms" },
                { city: "Seoul", status: "Nominal", latency: "0.1ms" },
                { city: "San Francisco", status: "Optimizing", latency: "0.7ms" },
                { city: "Stockholm", status: "Nominal", latency: "0.4ms" },
              ].map((node, i) => (
                 <Reveal key={i} delay={i * 0.05}>
                    <div className="p-8 border border-white/5 bg-white/[0.01] hover:border-[#00f2ff]/30 transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <span className="text-lg font-black text-white italic group-hover:text-[#00f2ff] transition-colors">{node.city}</span>
                          <div className={`w-2 h-2 rounded-full ${node.status === "Nominal" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                             <span>Status</span>
                             <span className="text-white/40">{node.status}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                             <span>Latency</span>
                             <span className="text-[#00f2ff]">{node.latency}</span>
                          </div>
                       </div>
                    </div>
                 </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── ETHICS & GOVERNANCE ── */}
      <section className="py-40 border-y border-white/5 bg-[#020204]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block text-left">The Moral Compass</span>
                 <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white text-left">
                   Neural <br/> <span className="text-[#00f2ff] not-italic">Rights.</span>
                 </h2>
                 <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic leading-loose text-left">
                   At Neuralis, we believe augmentation is a fundamental right. Our governance board ensures every neural bridge is encrypted locally, giving you absolute sovereignty over your own biological data.
                 </p>
                 <div className="space-y-8">
                    {[
                      { q: "Data Sovereignty", a: "Your neural patterns never leave your local bridge. We provide the hardware, you own the thoughts." },
                      { q: "Biological Integrity", a: "Zero-residue materials that can be fully integrated or removed without cellular trauma." },
                      { q: "Cognitive Liberty", a: "No external overrides. Our firmware is open-source and audited by third-party ethics councils." },
                    ].map((item, i) => (
                       <div key={i} className="group border-b border-white/5 pb-8">
                          <h4 className="text-lg font-black uppercase italic text-white mb-4 group-hover:text-[#00f2ff] transition-colors">{item.q}</h4>
                          <p className="text-sm text-white/30 font-light tracking-wide uppercase italic leading-loose">{item.a}</p>
                       </div>
                    ))}
                 </div>
              </Reveal>
              <Reveal delay={0.2}>
                 <div className="relative aspect-square bg-white/[0.02] rounded-sm border border-white/5 p-16 flex flex-col justify-center">
                    <div className="mb-12">
                       <ShieldCheck className="w-16 h-16 text-[#00f2ff] mb-8" />
                       <h3 className="text-4xl font-black uppercase italic text-white mb-4">Certified <br/> Compliance.</h3>
                       <p className="text-sm text-white/20 font-light tracking-widest uppercase italic leading-loose">
                          Every Neuralis bridge is certified by the Global Augmentation Council (GAC) for Safety Class-S integration.
                       </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Audit Status</span>
                          <span className="text-sm font-black text-[#00f2ff] uppercase tracking-widest block">Clean // 2024</span>
                       </div>
                       <div className="space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Encryption</span>
                          <span>Quantum_Resistant</span>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </div>
      </section>

      {/* ── TECHNICAL SPECIFICATIONS ── */}
      <section className="py-40 bg-[#050508]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">Hardware Schematics</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">Full <br/> <span className="text-[#00f2ff] not-italic">Manifesto.</span></h2>
              </div>
           </Reveal>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10">
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Parameter</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Neural_Bridge_V2</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Oxy_Flow_System</th>
                       <th className="py-8 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Prism_AR</th>
                    </tr>
                 </thead>
                 <tbody className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    {[
                      { p: "Processing Power", v1: "128 Petaflops", v2: "N/A (Chemical)", v3: "64 Petaflops" },
                      { p: "Bio-Latency", v1: "0.8ms", v2: "Instant", v3: "1.2ms" },
                      { p: "Battery Life", v1: "Indefinite (Kinetic)", v2: "12 Hours", v3: "24 Hours" },
                      { p: "Material", v1: "Liquid Graphene", v2: "Synthetic Serum", v3: "Refractive Glass" },
                      { p: "Clearance", v1: "Tier 1", v2: "Tier 2", v3: "Tier 1" },
                    ].map((row, i) => (
                       <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-8 text-white/40 italic">{row.p}</td>
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

      {/* ── TESTIMONIALS & CASE STUDIES ── */}
      <section id="realisations" className="py-40 bg-black overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#00f2ff]/5 blur-[150px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
           <Reveal>
              <div className="mb-32 text-center">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-8 block">User Experiences</span>
                 <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white">The <span className="text-[#00f2ff] not-italic">Elite.</span></h2>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
              {[
                { name: "Soren Kvist", role: "Quantum Architect", text: "The Neural Link didn't just improve my workflow; it changed my perception of mathematical structures. I'm no longer visualizing data—I'm inhabiting it.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                { name: "Emi Nakamura", role: "Synthetic Biologist", text: "Oxy-Flow is the first augmentation that feels truly native. The focus is sustained, clinical, and entirely without the jitters of chemical stimulants.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.2}>
                   <div className="space-y-12">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden grayscale border border-[#00f2ff]/30">
                         <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <blockquote className="text-3xl font-light italic text-white/60 leading-relaxed uppercase tracking-widest">
                         "{item.text}"
                      </blockquote>
                      <div>
                         <span className="text-xl font-black text-white italic block mb-1">{item.name}</span>
                         <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00f2ff]">{item.role}</span>
                      </div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="about" className="py-40 bg-[#020204]">
        <div className="max-w-4xl mx-auto px-6">
           <Reveal>
              <div className="mb-24 text-center">
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-8">Common <span className="text-[#00f2ff] not-italic">Queries.</span></h2>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Deployment // Recovery // Integration</p>
              </div>
           </Reveal>

           <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "Is the installation process invasive?", a: "The Neural Link V2 uses a sub-dermal delivery system that requires zero surgical incision. Integration takes approximately 15 minutes with a 2-hour biological sync period." },
                { q: "Can I disable the augmentation at any time?", a: "Yes. Every Neuralis device includes a physical 'Kill-Switch' and a software-based 'Dormant Mode' which can be toggled via your encrypted client portal." },
                { q: "What is the lifespan of the hardware?", a: "Our liquid-graphene bridges are designed to last a lifetime. They evolve with your cellular structure and are powered by your body's own kinetic energy." },
                { q: "Are there any side effects?", a: "During the initial 48-hour calibration, some users report 'lucid dreaming' or increased sensory awareness. These effects normalize once the bridge achieves full synchronization." },
                { q: "How do you handle firmware updates?", a: "Updates are pushed via encrypted neural-burst protocols. You will be notified in your HUD, and updates are only applied with explicit neural authorization." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-8 rounded-sm">
                   <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#00f2ff] py-8 no-underline italic">
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
      <footer className="bg-[#020204] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
           
           <div className="lg:col-span-6">
              <Reveal>
                 <div className="flex flex-col mb-12">
                    <span className="text-4xl font-black tracking-[-0.05em] uppercase leading-none">{fd?.businessName ?? "Neuralis"}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] -mt-1 ml-1">Augmentation Lab</span>
                 </div>
                 <p className="text-white/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                    The absolute mastery of bio-synthetic integration. Engineered for the evolutionary elite in our Tokyo sanctuary.
                 </p>
                 <div className="flex gap-6">
                    {[Globe, Globe, Mail].map((Icon, i) => (
                      <button key={i} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff] transition-all">
                         <Icon className="w-5 h-5" />
                      </button>
                    ))}
                 </div>
              </Reveal>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#00f2ff] mb-12">Innovations</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Neuro_Link_V2</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Oxy_Flow_System</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Prism_Optics</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Provenance</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#00f2ff] mb-12">Experience</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Diagnostic_Scan</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Sync_Portal</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Atelier_Tour</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Boutique</Link></li>
              </ul>
           </div>

           <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#00f2ff] mb-12">Studio</h4>
              <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                 <li><Link href="#solutions" className="hover:text-white transition-colors">The_Maison</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Global_Units</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Research_Kit</Link></li>
                 <li><Link href="#solutions" className="hover:text-white transition-colors">Ethics_Board</Link></li>
              </ul>
           </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
           <div className="flex items-center gap-12">
              <span>&copy; {new Date().getFullYear()} NEURALIS AUGMENTATION LAB.</span>
              <div className="flex gap-8">
                <span>FDA_AUG_CERTIFIED</span>
                <span>BIO_SYNC_NOMINAL</span>
              </div>
           </div>
           <div className="flex gap-12 font-mono">
              <span>SYNC_STABLE</span>
              <span>NEURAL_LOAD_0.12%</span>
           </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#020204}
        ::-webkit-scrollbar-thumb{background:#00f2ff}
      `}</style>
    </div>
  );
}
