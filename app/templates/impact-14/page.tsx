"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView, 
  useSpring,
  useMotionValue
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Zap, Activity, Target, Layers, Box, Hexagon, 
  Terminal, Settings, Power, Info, 
  AlertTriangle, ChevronRight, ArrowRight, 
  Share2, Maximize2, Download, ExternalLink, 
  Archive, Hash, BarChart3, Fingerprint, Scan, 
  Briefcase, Wind, Timer, Lightbulb, Command, Grid, 
  Radar, Orbit, Atom, Search, Cpu, Anchor, Ship, 
  Waves, Gauge, Compass, Map, Radio, Disc, 
  ShieldCheck, Thermometer, FlaskConical, Sun, 
  Moon, Star, Sparkles, CircleDot, ArrowUpRight, 
  ArrowDownLeft, Expand, Shrink, MousePointer2, 
  HardDrive, Key, Lock, Unlock, Shield, ShieldAlert, 
  Laptop, Server, Network, Wifi, Bluetooth,
  Droplets, Pickaxe, Mountain, Gem, Drill,
  Telescope, MilestoneIcon, Globe, Layout,
  Smartphone, PenTool, Camera, Film, Palette,
  MessageSquare, Send, ZapOff, Truck, Train, 
  Bus, Car, Bike, Eye, ScanEye, EyeOff, 
  KeyRound, Fingerprint as FingerprintIcon,
  Navigation, Navigation2, Wind as WindIcon,
  Sailboat, LifeBuoy, Fish, Waves as WaveIcon
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   AETHEL MARITIME DATASET (ULTRA DENSITY)
   ========================================================================== */

const FLEET = [
  {
    id: "ae-fl-01",
    name: "Aethel 01",
    type: "Explorer Yacht",
    length: "85m",
    speed: "22 Knots",
    range: "6000 nm",
    desc: "Un navire d'exploration sans compromis. Coque renforcée pour la glace et système de propulsion hybride pour une autonomie mondiale.",
    img: "https://images.unsplash.com/photo-1544462242-94585e5ca8d2?w=1600&q=80",
    color: "#0c4a6e"
  },
  {
    id: "ae-fl-08",
    name: "Command X",
    type: "Performance Cruiser",
    length: "42m",
    speed: "45 Knots",
    range: "1200 nm",
    desc: "La suprématie de la vitesse. Utilisation massive de fibre de carbone et d'hydrofoils pour une navigation aérienne au-dessus des vagues.",
    img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600&q=80",
    color: "#38bdf8"
  },
  {
    id: "ae-fl-15",
    name: "Deep Sea Twin",
    type: "Digital Research Vessel",
    length: "110m",
    speed: "18 Knots",
    range: "Global",
    desc: "Laboratoire flottant ultra-connecté. Équipé de jumeaux numériques en temps réel pour l'analyse océanographique profonde.",
    img: "https://images.unsplash.com/photo-1499244015948-ac7508999715?w=1600&q=80",
    color: "#020617"
  }
]

const MARITIME_METRICS = [
  { label: "Displacement", value: "2,400 T", trend: "Stable", detail: "Active Ballast Sync" },
  { label: "Hydrodynamics", value: "0.18 Cd", trend: "Optimal", detail: "Hull Flow Analysis" },
  { label: "Draft Depth", value: "5.2m", trend: "Variable", detail: "Dynamic Positioning" },
  { label: "Engine Load", value: "64%", trend: "Efficient", detail: "Hydrogen Hybrid" }
]

const COMMAND_LOGS = [
  { time: "04:12:08", node: "Monaco_HQ", task: "Course_Sync", status: "OK", wind: "12kts NE" },
  { time: "04:15:32", node: "Aethel_01", task: "Ballast_Adj", status: "SYNC", wind: "14kts N" },
  { time: "04:22:15", node: "Global_SAT", task: "Depth_Scan", status: "PASS", wind: "08kts E" }
]

/* ==========================================
   TECHNICAL COMPONENTS (FLUID DYNAMICS / KORR)
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

function OceanicFluidBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
       <svg width="100%" height="100%" className="w-full h-full">
          <defs>
             <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
             </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => (
             <motion.path 
                key={i}
                d={`M -200 ${i * 100} Q 400 ${i * 100 - 50} 1000 ${i * 100} T 2200 ${i * 100}`}
                stroke="url(#wave-grad)" 
                strokeWidth="2" 
                fill="none"
                animate={{ 
                   d: [
                      `M -200 ${i * 100} Q 400 ${i * 100 - 50} 1000 ${i * 100} T 2200 ${i * 100}`,
                      `M -200 ${i * 100} Q 400 ${i * 100 + 50} 1000 ${i * 100} T 2200 ${i * 100}`,
                      `M -200 ${i * 100} Q 400 ${i * 100 - 50} 1000 ${i * 100} T 2200 ${i * 100}`
                   ]
                }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
             />
          ))}
       </svg>
    </div>
  )
}

function HUD_Maritime() {
   return (
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-[#38bdf8]/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-[#38bdf8]">Hull_Stability</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-[#38bdf8]/20 bg-[#38bdf8]/5 backdrop-blur-md rounded-sm">
               <Anchor className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm">
               <Navigation2 className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function FleetCard({ yacht, index }: { yacht: any, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <div className="min-w-[85vw] md:min-w-[65vw] lg:min-w-[50vw] h-[75vh] relative group overflow-hidden border border-white/5 bg-[#0a0a0a] snap-center">
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
       <motion.img 
          src={yacht.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          alt={yacht.name}
       />
       
       <div className="absolute top-12 left-12 z-20">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#38bdf8] mb-4">{yacht.id} // COMMAND CENTER</div>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic group-hover:translate-x-8 transition-transform duration-1000">
             {yacht.name}
          </h3>
       </div>

       <div className="absolute bottom-12 left-12 right-12 z-20">
          <p className="text-sm md:text-base text-white/40 leading-relaxed font-light uppercase italic mb-12 max-w-lg tracking-widest">
             {yacht.desc}
          </p>
          <div className="flex justify-between items-end border-t border-white/10 pt-12">
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Maximum Speed</div>
                   <div className="text-lg font-black italic">{yacht.speed}</div>
                </div>
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Total Length</div>
                   <div className="text-lg font-black italic">{yacht.length}</div>
                </div>
             </div>
             <button className="px-12 py-6 border-2 border-[#38bdf8] text-[#38bdf8] text-[10px] font-black uppercase tracking-widest hover:bg-[#38bdf8] hover:text-white transition-all italic flex items-center gap-4">
                Initiate Protocol <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
       
       <div className="absolute bottom-0 right-0 p-12 text-[15vw] font-black text-white/[0.02] pointer-events-none select-none italic">
          {index + 1}
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: AETHEL MARITIME (HYDRODYNAMIC SUPREMACY)
   ========================================================================== */

export default function AethelMaritimePremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#020408] text-[#f0f0f0] font-sans selection:bg-[#38bdf8]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <OceanicFluidBackground />
      <HUD_Maritime />
      
      {/* 1. NAVIGATION (MARITIME ATELIER) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Anchor className="w-10 h-10 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Aethel <span className="text-[#38bdf8]">Maritime.</span></span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/20 -mt-1 ml-1">Monaco // Global Command Center</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#fleet" className="hover:text-[#38bdf8] transition-colors relative group">
               [ The_Fleet ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#38bdf8] group-hover:w-full transition-all" />
            </a>
            <a href="#engineering" className="hover:text-[#38bdf8] transition-colors relative group">
               [ Engineering ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#38bdf8] group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-[#38bdf8] transition-colors relative group">
               [ Command ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#38bdf8] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-[#38bdf8] uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic">All_Units_Online</div>
            </div>
            <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#38bdf8] hover:text-white transition-all shadow-[0_0_40px_rgba(56,189,248,0.2)] italic">
               Initiate_Command
            </button>
         </div>
      </nav>

      <main>
        {/* 2. OCEANIC SUPREMACY (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-white/5">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#38bdf8]/30 bg-[#38bdf8]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#38bdf8] mb-16 italic">
                    <WaveIcon className="w-4 h-4 animate-pulse" /> Command_Status: NOMINAL // HYDRO_OPTIMIZED
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: textScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Command</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>The Deep.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#38bdf8]/20 pl-12">
                       Nous concevons le futur de l'exploration maritime par une ingénierie de haute fidélité et une suprématie architecturale. Chaque navire est un sanctuaire de technologie.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#38bdf8] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(56,189,248,0.4)] flex items-center gap-4 italic group">
                          [ Start Expedition ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute bottom-[-10vw] left-[-10vw] w-[50vw] h-[50vw] border border-white/5 rounded-full opacity-20 pointer-events-none select-none" />
           <div className="absolute top-[20vw] right-[-10vw] w-[40vw] h-[40vw] border border-[#38bdf8]/10 rounded-full opacity-10 pointer-events-none select-none" />
        </section>

        {/* 3. THE FLEET (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="fleet" className="py-64 px-12 bg-black relative overflow-hidden">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#38bdf8] mb-8">Fleet_Manifest</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    Naval <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Icons.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#38bdf8]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Explorer // Cruiser // Research</p>
              </div>
           </div>

           <div className="flex gap-16 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {FLEET.map((yacht, i) => (
                 <FleetCard key={yacht.id} yacht={yacht} index={i} />
              ))}
           </div>
        </section>

        {/* 4. ENGINEERING (HUD DATA VIZ) */}
        <section id="engineering" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#38bdf8] mb-8">Hydrodynamic_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                       Naval <br/> <span className="opacity-20">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {MARITIME_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border-2 border-black/5 bg-black/[0.02] hover:border-[#38bdf8]/30 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">
                                <span>{metric.detail}</span>
                                <span className="text-[#38bdf8]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-1 bg-black/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#38bdf8]"
                                   initial={{ width: 0 }}
                                   whileInView={{ width: '85%' }}
                                   transition={{ duration: 1.5, delay: i * 0.1 }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-5 space-y-16">
                 <Reveal delay={0.4}>
                    <div className="p-12 bg-black text-white rounded-sm relative group overflow-hidden border border-white/10 shadow-2xl">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic">Command Logs</h4>
                          <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/50" />
                             <div className="w-3 h-3 rounded-full bg-[#38bdf8]" />
                          </div>
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {COMMAND_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/5 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-[#38bdf8] font-black">{log.node}</span>
                                <span className="text-white/40 italic">{log.task}</span>
                                <span className="font-black">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-[#38bdf8] animate-pulse">
                          <Compass className="w-4 h-4" /> Sat_Link_Stable...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-black/[0.02] pointer-events-none select-none italic z-0">
              OCEAN
           </div>
        </section>

        {/* 5. INTERIOR ATELIER (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#38bdf8] mb-8">Atmospheric_Atelier</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Private <br/> <span className="opacity-10">Sanctuary.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-white/30 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Nos intérieurs sont conçus comme des sanctuaires privés. Nous utilisons des bois exotiques, des métaux précieux et une isolation acoustique de pointe pour assurer une déconnexion totale.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Acoustic</div>
                          <div className="text-4xl font-black italic">Zero_Zone</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Materials</div>
                          <div className="text-4xl font-black italic">Rare_Audit</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-white/5">
                       <img 
                          src="https://images.unsplash.com/photo-1544462242-94585e5ca8d2?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Yacht Interior"
                       />
                       <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (MARITIME ACCORDION) */}
        <section className="py-64 px-12 bg-zinc-950">
           <div className="max-w-4xl mx-auto">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#38bdf8] mb-8">Secure_Inquiry</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8">Fleet <span className="opacity-10">Q&A.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Acquisition // Charter // Engineering</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is your primary design philosophy?", a: "Hydrodynamic supremacy. We believe that efficiency on the water is the ultimate luxury. Every line is dictated by flow physics." },
                   { q: "Do you offer hydrogen hybrid propulsion?", a: "Yes. Our latest fleet units are equipped with hydrogen-ready fuel cell systems, allowing for silent, zero-emission navigation in protected waters." },
                   { q: "How do you manage global maintenance?", a: "Every yacht is a connected digital twin. We monitor technical status 24/7 from our command center and deploy flying technicians anywhere in the world within 48 hours." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-10 rounded-sm hover:border-[#38bdf8]/30 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-white/30 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-16 px-12 md:px-24 border-t-8 border-[#38bdf8]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-[#38bdf8]">Aethel.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-white/20 ml-2">Maritime Engineering Group</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La suprématie de l'exploration maritime. Monaco // Global.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/20 hover:text-[#38bdf8] transition-all cursor-pointer" />
                             <Anchor className="w-7 h-7 text-white/20 hover:text-[#38bdf8] transition-all cursor-pointer" />
                             <Compass className="w-7 h-7 text-white/20 hover:text-[#38bdf8] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#38bdf8] mb-16 border-b border-[#38bdf8]/20 pb-4">Fleet</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Explorer_Yachts
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Performance_Cruisers
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Research_Vessels
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#38bdf8] mb-16 border-b border-[#38bdf8]/20 pb-4">Command</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Global_HQ
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Fleet_Manifest
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#38bdf8]" /> Engineering
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 AETHEL MARITIME GROUP.</span>
                    <span className="hidden md:inline">//</span>
                    <span>HYDRODYNAMIC_SUPREMACY_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#38bdf8]/30">
                    <span>GLOBAL_SAT_STABLE</span>
                    <span>FLEET_UNITS_ACTIVE</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020408; }
        ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
