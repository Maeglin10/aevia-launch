"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Zap, Activity, Target, Layers, Box, Hexagon, ArrowUpRight,
  Terminal, Settings, Power, Info, 
  AlertTriangle, ChevronRight, ArrowRight, 
  Share2, Maximize2, Download, ExternalLink, 
  Archive, Hash, BarChart3, Fingerprint, Scan, 
  Briefcase, Wind, Timer, Lightbulb, Command, Grid, 
  Radar, Orbit, Atom, Search, Cpu, Wrench, Hammer, 
  Cog, Hand, Accessibility, Bot, Sparkles, Infinity , 
  Code2, Cloud, HardDrive, Key, MousePointer2, 
  Globe, Layout, Smartphone, PenTool, Camera, 
  Music, Film, Palette, MessageSquare, Send,
  Gauge, Disc, Waves, ShieldCheck, Thermometer, 
  Flame, Battery, Radio, Signal, Milestone, 
  FlaskConical, Microscope, Ghost, Binary, Database,
  Rocket, PlaneTakeoff, Compass, Map, RadioIcon,
  CircleDot, Waves as WaveIcon, Pickaxe, Mountain, Gem,
  Drill, Telescope, MilestoneIcon, Menu
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ==========================================================================
   VULCAN MOTOR GROUP DATASET (ULTRA DENSITY)
   ========================================================================= */

const FLEET = [
  {
    id: "vul-ty-01",
    name: "Tyrant GT",
    class: "Grand Tourer",
    power: "1200 HP",
    torque: "1400 Nm",
    topSpeed: "385 km/h",
    accel: "2.1s",
    desc: "L'apogée du Grand Tourisme. Un moteur V12 bi-turbo couplé à un système hybride de récupération d'énergie issu de la Formule 1.",
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1600&q=80",
    color: "#3b82f6"
  },
  {
    id: "vul-ap-08",
    name: "Apex EVO",
    class: "Track Focused",
    power: "980 HP",
    torque: "1100 Nm",
    topSpeed: "340 km/h",
    accel: "1.9s",
    desc: "Conçue pour la piste. Une carrosserie entièrement en carbone pré-imprégné avec un appui aérodynamique actif de 800kg à 250km/h.",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80",
    color: "#ef4444"
  },
  {
    id: "vul-st-15",
    name: "Stratos E",
    class: "Electric Hypercar",
    power: "2000 HP",
    torque: "2500 Nm",
    topSpeed: "410 km/h",
    accel: "1.7s",
    desc: "Le futur électrique. Quatre moteurs indépendants pilotés par une IA de vectorisation de couple en temps réel.",
    img: "https://images.unsplash.com/photo-1611605645802-c21be743c321?w=1600&q=80",
    color: "#10b981"
  }
]

const PERFORMANCE_METRICS = [
  { label: "Aero Efficiency", value: "0.24 Cd", trend: "Optimal", percent: 92 },
  { label: "Thermal Stability", value: "84°C", trend: "Stable", percent: 88 },
  { label: "Torque Vectoring", value: "Active", trend: "Precise", percent: 96 },
  { label: "G-Force Max", value: "1.8 G", trend: "Extreme", percent: 84 }
]

const ENGINEERING_LOGS = [
  { timestamp: "12:04:12", unit: "Chassis_01", task: "Stress_Test", status: "PASS", load: "98%" },
  { timestamp: "12:05:01", unit: "Propulsion", task: "Cycle_Calibration", status: "ACTIVE", load: "44%" },
  { timestamp: "12:05:48", unit: "Aerodynamics", task: "Wind_Tunnel_Sim", status: "DONE", load: "100%" }
]

type ActivePage = "home" | "fleet" | "engineering" | "atelier" | "support" | "legal";

/* ==========================================
   TECHNICAL COMPONENTS (SLIDER REVOLUTION STANDARD)
   ========================================== */

function Reveal({ children, delay = 0, y = 40, x = 0, scale = 1 }: { children: React.ReactNode, delay?: number, y?: number, x?: number, scale?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x, scale }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FluidAeroVisualizer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
       <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <linearGradient id="aero-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <motion.path 
               key={i}
               d={`M -100 ${i * 50} Q 500 ${i * 50 + 100} 2000 ${i * 50}`}
               stroke="url(#aero-grad)" 
               strokeWidth="1" 
               fill="none"
               animate={{ 
                  d: `M -100 ${i * 50} Q ${mousePos.x} ${mousePos.y + (i - 10) * 20} 2000 ${i * 50}`,
                  opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ type: "spring", damping: 50, stiffness: 30 }}
            />
          ))}
          {[...Array(50)].map((_, i) => (
             <motion.circle
                key={`p-${i}`}
                cx={Math.random() * 2000}
                cy={Math.random() * 1000}
                r="1"
                fill="#3b82f6"
                animate={{
                   x: [0, 2000],
                   opacity: [0, 1, 0]
                }}
                transition={{
                   duration: Math.random() * 2 + 1,
                   repeat: 999999 ,
                   delay: Math.random() * 5,
                   ease: "linear"
                }}
             />
          ))}
       </svg>
    </div>
  )
}

function HUD_Telemetry() {
  return (
    <div className="fixed top-24 right-12 z-40 hidden xl:flex flex-col gap-8 items-end pointer-events-none">
       <div className="flex flex-col items-end border-r-2 border-blue-500/30 pr-6 py-2">
          <div className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-2">Vulcan_System_V4.2</div>
          <div className="text-2xl font-mono text-white tracking-tighter">44.12.08</div>
          <div className="text-[8px] font-bold text-white/30 uppercase mt-1">Modena // Italy</div>
       </div>
       <div className="space-y-4">
          {[1, 0.8, 1.2, 0.6].map((h, i) => (
             <div key={i} className="flex gap-1 items-end h-12">
                <motion.div 
                  className="w-1 bg-blue-500/40"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 2, repeat: 999999 , delay: i * 0.2 }}
                />
             </div>
          ))}
       </div>
    </div>
  )
}

function VehicleCard({ vehicle, goTo }: { vehicle: any, goTo: (p: ActivePage) => void }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <motion.div 
      ref={ref}
      className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[45vw] h-[70vh] relative group overflow-hidden border border-white/5 bg-zinc-950"
    >
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
       <img 
          src={vehicle.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          alt={vehicle.name}
       />
       
       <div className="absolute bottom-0 left-0 p-12 z-20 w-full">
          <div className="flex justify-between items-end">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-4">{vehicle.class} // {vehicle.id}</div>
                <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 group-hover:translate-x-4 transition-transform duration-700">
                   {vehicle.name}
                </h3>
             </div>
             <div className="text-right pb-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Power_Output</div>
                <div className="text-4xl font-black italic">{vehicle.power}</div>
             </div>
          </div>
          
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: "auto", opacity: 1 } : {}}
            className="overflow-hidden"
          >
             <p className="max-w-xl text-sm text-white/40 leading-relaxed font-medium uppercase italic mb-8">
                {vehicle.desc}
             </p>
             <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Top Speed</div>
                   <div className="text-lg font-bold italic">{vehicle.topSpeed}</div>
                </div>
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Torque</div>
                   <div className="text-lg font-bold italic">{vehicle.torque}</div>
                </div>
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">0-100 km/h</div>
                   <div className="text-lg font-bold italic">{vehicle.accel}</div>
                </div>
             </div>
          </motion.div>
       </div>
       
       <div className="absolute top-12 right-12 z-20 flex gap-4">
          <button onClick={() => goTo("fleet")} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-md hover:bg-blue-500 transition-colors group/btn">
             <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
          </button>
       </div>
    </motion.div>
  )
}

/* ==========================================================================
   MAIN PAGE: VULCAN MOTOR GROUP MODENA (ULTRA DENSITY)
   ========================================================================= */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VulcanMotorPremium() {
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

  const [page, setPage] = useState<ActivePage>("home")
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const goTo = (p: ActivePage) => {
    setPage(p)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }

  // Parallax & Scroll transforms
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, -400])

  
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
    <div ref={containerRef} className="bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-500/40 selection:text-white min-h-screen overflow-x-clip">
      
      <HUD_Telemetry />
      
      {/* 1. NAVIGATION (HUD STYLE) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/80 backdrop-blur-md">
         <div onClick={() => goTo("home")} className="flex flex-col cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Vulcan</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-blue-500 -mt-1 ml-1">Motor Group Modena</span>
              </>
            )}
         </div>
         <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-white/40">
            {[
              { name: "The Fleet", key: "fleet" },
              { name: "Engineering", key: "engineering" },
              { name: "The Atelier", key: "atelier" },
              { name: "Support", key: "support" }
            ].map(item => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                className={`hover:text-white transition-colors ${page === item.key ? "text-blue-500 font-extrabold" : ""}`}
              >
                [ {item.name.replace(" ", "_")} ]
              </a>
            ))}
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Active_Node</div>
               <div className="text-[10px] font-bold">Modena_01</div>
            </div>
            
            <Sheet>
               <SheetTrigger className="md:hidden p-3 border border-white/10 rounded-full hover:border-blue-500 transition-colors">
                     <Menu className="w-5 h-5 text-white" />
                  </SheetTrigger>
               <SheetContent side="right" className="bg-[#050505] border-white/5 p-12 overflow-y-auto">
                  <div className="flex flex-col gap-8 mt-16 text-left font-mono">
                     {[
                       { name: "Home", key: "home" },
                       { name: "The Fleet", key: "fleet" },
                       { name: "Engineering", key: "engineering" },
                       { name: "The Atelier", key: "atelier" },
                       { name: "Support", key: "support" },
                       { name: "Legal Mentions", key: "legal" }
                     ].map(item => (
                       <a 
                         key={item.key} 
                         href={`#${item.key}`} 
                         onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                         className={`text-xl font-black uppercase tracking-widest hover:text-blue-500 transition-colors ${page === item.key ? "text-blue-500" : "text-white/60"}`}
                       >
                         {item.name.replace(" ", "_")}
                       </a>
                     ))}
                  </div>
               </SheetContent>
            </Sheet>

            <button onClick={() => goTo("atelier")} className="p-3 border border-white/10 rounded-full hover:border-blue-500 transition-colors group">
               <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
         </div>
      </nav>

      <main className="pt-20">
        {page === "home" && (
          <>
            {/* 2. AERODYNAMIC IGNITION (HERO) */}
            <section id="hero" className="relative h-screen flex flex-col justify-center items-center px-8 md:px-24 overflow-hidden pt-20">
              <FluidAeroVisualizer />
              
              <motion.div 
                style={{ y: bgTextY }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0"
              >
                 <h2 className="text-[35vw] font-black uppercase tracking-tighter leading-none italic">VULCAN</h2>
              </motion.div>

              <div className="relative z-10 w-full max-w-7xl">
                 <Reveal>
                    <div className="inline-flex items-center gap-4 px-6 py-2 border border-blue-500/30 bg-blue-500/5 text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-12 italic">
                       Propulsion_Init // Thermal: NOMINAL // Flow: OPTIMAL
                    </div>
                    <motion.h1 
                      style={{ scale: heroScale }}
                      className="text-7xl md:text-[14vw] font-black tracking-tighter uppercase mb-12 leading-[0.7] italic flex flex-col"
                    >{c?.heroHeadline ?? <>
                       <span>Force of</span>
                       <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Nature.</span>
                    </>}</motion.h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                       <p className="max-w-xl text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-widest">{c?.heroSubline ?? fd?.tagline ?? <>
                          Nous ne construisons pas des voitures. Nous domptons la physique. Chaque courbe est dictée par le vent, chaque watt est maîtrisé par l'IA.
                       </>}</p>
                       <div className="flex flex-col sm:flex-row gap-8 md:justify-end">
                          <button onClick={() => goTo("atelier")} className="px-12 py-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-4 italic group">
                             <Zap className="w-5 h-5 group-hover:animate-pulse" /> Configure Your Unit
                          </button>
                          <button onClick={() => goTo("fleet")} className="px-12 py-6 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-4 italic">
                             <Disc className="w-5 h-5" /> View Registry
                          </button>
                       </div>
                    </div>
                 </Reveal>
              </div>

              {/* Bottom HUD Bar */}
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-12">
                 <div className="flex gap-16">
                    {PERFORMANCE_METRICS.slice(0, 2).map((m, i) => (
                       <div key={i}>
                          <div className="text-[8px] text-white/20 uppercase tracking-widest mb-2">{m.label}</div>
                          <div className="text-2xl font-black italic">{m.value}</div>
                          <div className="w-32 h-[2px] bg-white/5 mt-2 overflow-hidden">
                             <motion.div 
                               className="h-full bg-blue-500" 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${m.percent}%` }}
                               transition={{ duration: 2 }}
                             />
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                       <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Wind_Tunnel_Active</div>
                       <div className="text-xs font-bold text-blue-500">v0.24 Cd</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                 </div>
              </div>
            </section>

            {/* 3. THE FLEET (HORIZONTAL SCROLL) */}
            <section className="py-48 px-8 md:px-24 bg-[#0a0a0a] relative overflow-hidden">
               <div className="max-w-7xl mx-auto mb-24 flex justify-between items-end">
                  <Reveal>
                     <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8">Vulcan_Registry</div>
                     <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">{c?.aboutTitle ?? fd?.businessName ?? <>
                        The <br/> <span className="text-white/10">Arsenal.</span>
                     </>}</h2>
                  </Reveal>
                  <div className="hidden md:block">
                     <p className="max-w-xs text-xs text-white/20 leading-relaxed uppercase italic text-right">{c?.aboutText ?? <>
                        Trois modèles. Trois philosophies. Une seule quête de perfection absolue dans l'ingénierie mécanique.
                     </>}</p>
                  </div>
               </div>

               <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
                  {FLEET.map((vehicle, i) => (
                     <div key={vehicle.id} className="snap-center">
                        <VehicleCard vehicle={vehicle} goTo={goTo} />
                     </div>
                  ))}
               </div>
            </section>

            {/* 4. PERFORMANCE TELEMETRY */}
            <section className="py-48 px-8 md:px-24 border-y border-white/5 bg-black relative">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-24 items-center">
                  <div className="lg:col-span-2">
                     <Reveal>
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8">Performance_Matrix</div>
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-16 italic">
                           Advanced <br/> <span className="opacity-20">Dynamics.</span>
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {PERFORMANCE_METRICS.map((metric, i) => (
                              <div key={metric.label} className="border border-white/5 bg-white/[0.02] p-10 backdrop-blur-sm group hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => goTo("engineering")}>
                                 <div className="flex justify-between items-start mb-8">
                                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{metric.label}</div>
                                    <div className="p-2 border border-white/10 text-white/20 group-hover:text-blue-500 group-hover:border-blue-500 transition-colors">
                                       {i === 0 ? <Wind className="w-4 h-4" /> : i === 1 ? <Thermometer className="w-4 h-4" /> : i === 2 ? <Cog className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
                                    </div>
                                 </div>
                                 <div className="text-5xl font-black mb-4 italic tracking-tighter">{metric.value}</div>
                                 <div className="flex items-center gap-3">
                                    <div className="flex-1 h-[2px] bg-white/5 overflow-hidden">
                                       <motion.div 
                                          className="h-full bg-blue-500"
                                          initial={{ width: 0 }}
                                          whileInView={{ width: `${metric.percent}%` }}
                                          transition={{ duration: 1.5, delay: i * 0.1 }}
                                       />
                                    </div>
                                    <div className="text-[10px] text-blue-500 font-black italic">{metric.trend}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </Reveal>
                  </div>

                  <div className="space-y-12">
                     <Reveal delay={0.3}>
                        <div className="bg-blue-600/5 border border-blue-500/20 p-12 cursor-pointer" onClick={() => goTo("engineering")}>
                           <h4 className="text-xl font-black uppercase tracking-tighter mb-6 italic">Carbon Structure</h4>
                           <p className="text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic mb-12">
                              Notre monocoque en carbone pèse seulement 74kg. Une rigidité torsionnelle record de 50,000 Nm/degré assurant une précision chirurgicale en virage.
                           </p>
                           <div className="flex items-center gap-4">
                              <Pickaxe className="w-5 h-5 text-blue-500" />
                              <div className="text-[10px] font-black uppercase tracking-widest italic">T700_Industrial_Grade</div>
                           </div>
                        </div>
                     </Reveal>
                     
                     <Reveal delay={0.4}>
                        <div className="bg-white/5 p-10 border border-white/5">
                           <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-8 flex items-center gap-3">
                              <Terminal className="w-4 h-4" /> Live_Telemetry_Log
                           </div>
                           <div className="space-y-4 font-mono">
                              {ENGINEERING_LOGS.map((log, i) => (
                                 <div key={i} className="flex justify-between text-[10px] border-b border-white/5 pb-2 group hover:bg-white/5 transition-colors px-2">
                                    <span className="text-white/20 group-hover:text-white transition-colors">[{log.timestamp}]</span>
                                    <span className="text-white/60 font-bold">{log.unit}</span>
                                    <span className="text-blue-500">{log.task}</span>
                                    <span className="text-green-500 font-black">{log.status}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </Reveal>
                  </div>
               </div>
            </section>

            {/* 5. THE ATELIER (EDITORIAL LAYOUT) */}
            <section className="py-48 px-8 md:px-24">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                  <div className="lg:col-span-5">
                     <Reveal>
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8">Bespoke_Atelier</div>
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                           Tailored <br/> <span className="opacity-20">Velocity.</span>
                        </h2>
                        <p className="text-lg font-light italic text-white/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                           Votre Vulcan est unique. Notre programme de personnalisation permet de choisir chaque détail, des textures de carbone aux coutures intérieures, pour refléter votre vision de la performance.
                        </p>
                        <div className="flex gap-12">
                           <div className="flex flex-col gap-4">
                              <div className="text-[10px] font-black text-white/20">Options</div>
                              <div className="text-2xl font-black italic">4,200+</div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <div className="text-[10px] font-black text-white/20">Artisans</div>
                              <div className="text-2xl font-black italic">12</div>
                           </div>
                        </div>
                     </Reveal>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                     <Reveal delay={0.2} scale={0.9}>
                        <div onClick={() => goTo("atelier")} className="aspect-[4/5] bg-zinc-900 border border-white/5 relative overflow-hidden group cursor-pointer">
                           <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt="Material" />
                           <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                              <span className="text-[10px] font-black uppercase tracking-widest italic">Anodized_Alloy</span>
                           </div>
                        </div>
                     </Reveal>
                     <Reveal delay={0.4} scale={0.9} y={100}>
                        <div onClick={() => goTo("atelier")} className="aspect-[4/5] bg-zinc-900 border border-white/5 relative overflow-hidden group mt-12 cursor-pointer">
                           <img src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt="Interior" />
                           <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                              <span className="text-[10px] font-black uppercase tracking-widest italic">Alcantara_Grey</span>
                           </div>
                        </div>
                     </Reveal>
                  </div>
               </div>
            </section>
          </>
        )}

        {page === "fleet" && <FleetPage goTo={goTo} />}
        {page === "engineering" && <EngineeringPage />}
        {page === "atelier" && <AtelierPage />}
        {page === "support" && <SupportPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* 7. CONVERGENCE (FOOTER) */}
      <footer className="bg-black pt-48 pb-16 px-8 md:px-24 border-t-8 border-blue-600">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-48">
               <div className="lg:col-span-7">
                  <Reveal>
                     <div onClick={() => goTo("home")} className="flex flex-col mb-16 cursor-pointer">
                        <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic">Vulcan</span>
                        <span className="text-[12px] font-bold uppercase tracking-[0.8em] text-blue-500 ml-2">Motor Group Modena</span>
                     </div>
                     <p className="text-white/20 max-w-md mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                        L'excellence absolue dans la performance automobile. Conçue pour l'élite mondiale dans notre sanctuaire italien.
                     </p>
                     <div className="flex gap-8 items-center">
                        <div className="w-24 h-[1px] bg-white/10" />
                        <div className="flex gap-8">
                           <Globe className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                           <RadioIcon className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                           <Share2 className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                        </div>
                     </div>
                  </Reveal>
               </div>

               <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                  <div className="space-y-12">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 border-b border-blue-500/20 pb-4">The_Fleet</h4>
                     <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-white/30">
                        {FLEET.map(item => (
                          <li key={item.id} onClick={() => goTo("fleet")} className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                             <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> {item.name.replace(" ", "_")}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-12">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 border-b border-blue-500/20 pb-4">Experience</h4>
                     <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-white/30">
                        <li onClick={() => goTo("atelier")} className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> The_Atelier
                        </li>
                        <li onClick={() => goTo("engineering")} className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> Racing_Dept
                        </li>
                        <li onClick={() => goTo("support")} className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> Support_Logs
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
               <div className="flex flex-wrap gap-8">
                  <span>©2026 VULCAN MOTOR GROUP MODENA.</span>
                  <span className="hidden md:inline">//</span>
                  <a href="#aero-grad" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-blue-500 transition-colors">MENTIONS LEGALES</a>
               </div>
               <div className="flex gap-12 font-mono">
                  <span className="text-blue-500/40">TELEMETRY_LINK_ESTABLISHED</span>
                  <span className="text-blue-500/40">LOAD_0.12%</span>
               </div>
            </div>
         </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #050505; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (HUD / TECHNICAL STYLE)
   ========================================================================= */

function FleetPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  return (
    <section className="py-32 px-8 md:px-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Specification_Register</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
            The <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Fleet.</span>
          </h1>
          <p className="max-w-2xl text-base text-white/40 uppercase font-light italic leading-relaxed">
            Consultez le registre complet de nos trois modèles de haute performance, réglés de manière optimale pour repousser les limites de la force centrifuge et de l'accélération linéaire.
          </p>
        </div>

        <div className="space-y-32">
          {FLEET.map((vehicle, idx) => (
            <div key={vehicle.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-t border-white/5 pt-16">
              <div className="lg:col-span-7 aspect-[16/10] relative overflow-hidden border border-white/10 p-2 bg-[#0c0c0c]">
                <img src={vehicle.img} alt={vehicle.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="lg:col-span-5">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">{vehicle.class} // SYSTEM_ID: {vehicle.id}</div>
                <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">{vehicle.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light uppercase italic mb-8">{vehicle.desc}</p>
                
                <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-6 mb-8 font-mono text-xs">
                  <div className="flex justify-between border-r border-white/10 pr-6"><span className="text-white/20">POWER</span><span className="font-bold">{vehicle.power}</span></div>
                  <div className="flex justify-between pl-6"><span className="text-white/20">TORQUE</span><span className="font-bold">{vehicle.torque}</span></div>
                  <div className="flex justify-between border-r border-white/10 pr-6"><span className="text-white/20">SPEED</span><span className="font-bold">{vehicle.topSpeed}</span></div>
                  <div className="flex justify-between pl-6"><span className="text-white/20">0-100 KM/H</span><span className="font-bold">{vehicle.accel}</span></div>
                </div>

                <button onClick={() => goTo("atelier")} className="w-full py-5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors italic">
                  [ Configure_Unit_{vehicle.name.split(" ")[0].toUpperCase()} ]
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EngineeringPage() {
  const aeroSteps = [
    { title: "Active Aero Coeffs", val: "0.24 - 0.38 Cd", desc: "Ailerons adaptatifs calibrés en millisecondes pour maximiser la force d'appui en courbe tout en maintenant la traînée à son minimum sur les lignes droites." },
    { title: "Silicon Escapement Vectoring", val: "4000 Cycles/sec", desc: "Notre contrôleur central de vectorisation ajuste le couple indépendant sur chaque roue 4000 fois par seconde, éliminant tout sous-virage mécanique." },
    { title: "Dynamic Energy Recovery", val: "800V Architecture", desc: "Système de récupération cinétique au freinage réinjectant instantanément la force stockée dans des supercondensateurs de grade aéronautique." }
  ];

  return (
    <section id="about" className="py-32 px-8 md:px-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Dynamics_Lab</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
            Advanced <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Science.</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-white/40 uppercase font-light italic leading-relaxed">
            Chez Vulcan, la physique n'est pas une limite, c'est notre matière première. Découvrez les innovations qui séparent nos unités du reste de la production mondiale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {aeroSteps.map((step, i) => (
            <div key={i} className="border border-white/5 bg-[#080808] p-10 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">LOG_NODE_0{i+1}</div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">{step.title}</h3>
                <div className="text-3xl font-mono text-[#f0f0f0] font-bold italic mb-6">{step.val}</div>
                <p className="text-xs text-white/40 leading-relaxed uppercase italic font-medium">{step.desc}</p>
              </div>
              <div className="w-12 h-1 bg-blue-500 mt-8" />
            </div>
          ))}
        </div>

        <div className="border border-white/5 bg-zinc-950 p-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 aspect-video relative">
            <img src="https://images.unsplash.com/photo-1611605645802-c21be743c321?w=800&q=80" alt="Aerodynamics tunnel" className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Wind_Tunnel_Report</div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Thermal & Aerodynamic Control</h3>
            <p className="text-sm text-white/40 leading-relaxed uppercase italic font-light mb-8">
              En optimisant les flux sous le châssis via un effet de sol venturi actif, nous avons éliminé la nécessité d'un aileron arrière massif permanent sur le Tyrant GT, préservant ses lignes sculpturales tout en garantissant une stabilité absolue à plus de 380 km/h.
            </p>
            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div><span className="text-white/20 block">AIR_RESISTANCE</span><span className="text-white font-bold">0.24 Cd</span></div>
              <div><span className="text-white/20 block">DOWNFORCE</span><span className="text-white font-bold">850 KG</span></div>
              <div><span className="text-white/20 block">VORTEX_FLOW</span><span className="text-green-500 font-bold">NOMINAL</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AtelierPage() {
  const stages = [
    { name: "Chassis Calibration", details: "Ajustement de la rigidité torsionnelle selon le profil de conduite de l'acquéreur (typé route, mixte ou pure piste)." },
    { name: "Carbon Fiber Finish", details: "Choix de la trame de carbone apparente (satinée, brillante, teintée bleu cobalt ou rouge carmin)." },
    { name: "Cockpit Architecture", details: "Sélection des cuirs Alcantara ignifugés et des pièces métalliques en titane anodisé ou en aluminium brut." },
    { name: "Dynamic Calibration", details: "Session de test sur simulateur et circuit privé à Modena avec notre chef pilote de développement." }
  ];

  return (
    <section className="py-32 px-8 md:px-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Bespoke_Program</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
            The <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Atelier.</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-white/40 uppercase font-light italic leading-relaxed">
            Chaque Vulcan est construite sur mesure à Modena. Notre programme de personnalisation totale vous permet de concevoir une œuvre d'art aérodynamique unique au monde.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-12">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Bespoke Production Stages</h3>
            <div className="space-y-8 border-l-2 border-blue-500/30 pl-8">
              {stages.map((stage, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-black border border-blue-500 flex items-center justify-center">
                     <span className="text-[9px] font-mono text-blue-500">{i+1}</span>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest text-white mb-2">{stage.name}</h4>
                  <p className="text-xs text-white/40 leading-relaxed uppercase italic font-medium">{stage.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/5] bg-zinc-900 border border-white/5 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80" alt="Design sketch" className="w-full h-full object-cover grayscale opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-12 flex flex-col justify-end">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Modena_Atelier_Registry</span>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">4,200+ Combinations</h4>
              <p className="text-xs text-white/40 leading-relaxed uppercase italic font-light mt-2">
                Des jantes forgées ultra-légères aux teintes historiques, les limites de l'Atelier sont celles de votre imagination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SupportPage() {
  return (
    <section className="py-32 px-8 md:px-24 bg-white text-black border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Support_Department</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
            Common <span className="opacity-20">Queries.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 italic">Logistics // Maintenance // Worldwide Assistance</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4 mb-24">
          {[
            { q: "What is the typical wait time for a bespoke unit?", a: "Each Vulcan unit is hand-assembled in Modena. Production typically takes between 14 to 22 months from design freeze." },
            { q: "Do you offer international delivery?", a: "Yes. Every owner is assigned a dedicated Flying Technician and global concierge who manages white-glove transport." },
            { q: "Is the Stratos E road-legal?", a: "The Stratos E is homologated for road use in the EU, UK, and USA. Track-only variants are also available." },
            { q: "What is the maintenance cycle of a Vulcan engine?", a: "A complete diagnostic is performed every 10,000 km or annually by a certified Vulcan Flying Technician, who is dispatched to your private garage anywhere in the world." }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-2 border-black/5 bg-black/[0.02] px-10 rounded-sm hover:border-black/20 transition-all">
               <AccordionTrigger className="text-xs font-black uppercase tracking-[0.3em] py-10 no-underline italic text-left">
                  {item.q}
               </AccordionTrigger>
               <AccordionContent className="text-[11px] font-medium text-black/50 tracking-[0.1em] uppercase italic leading-loose pb-10">
                  {item.a}
               </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="border-2 border-black/10 p-12 bg-black/[0.01]">
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-black">The Flying Technician Program</h3>
          <p className="text-xs text-black/50 leading-relaxed uppercase italic font-medium">
            Pour assurer des performances constantes sans contraindre nos clients à transporter leurs véhicules vers notre usine en Italie, nous disposons d'une équipe de mécaniciens de course d'élite prêts à intervenir directement chez vous sous 48h.
          </p>
        </div>
      </div>
    </section>
  )
}

function LegalPage() {
  return (
    <section id="contact" className="py-32 px-8 md:px-24 bg-[#050505] text-[#f0f0f0] border-t border-white/5 font-mono text-xs">
      <div className="max-w-3xl mx-auto space-y-16">
        <div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 block">Vulcan_Compliance</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-12">Mentions Légales</h1>
        </div>

        <div className="border border-white/10 bg-zinc-950 p-10 space-y-6">
          <div className="border-b border-white/10 pb-4">
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">EDITEUR</div>
             <p className="text-white font-medium uppercase">
                Aevia WS — Valentin Milliand<br />
                Entrepreneur Individuel<br />
                SIREN : 852 546 225<br />
                RCS : Bourg-en-Bresse<br />
                Email : valentinmilliand@aevia.services<br />
                Adresse : Communiquée sur demande
             </p>
          </div>

          <div className="border-b border-white/10 pb-4">
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">HEBERGEUR</div>
             <p className="text-white font-medium uppercase">
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789, USA
             </p>
          </div>

          <div>
             <div className="text-white/30 text-[10px] font-black uppercase mb-2">PROPRIETE INTELLECTUELLE</div>
             <p className="text-white/50 font-medium uppercase leading-relaxed">
                Toutes les marques, images, logos, structures de code et fichiers multimédias présents sur ce site sont la propriété exclusive de Vulcan Motor Group Modena ou de ses représentants autorisés. Toute reproduction sans accord écrit préalable fera l'objet de poursuites pénales.
             </p>
          </div>
        </div>
      </div>
    </section>
  )
}
