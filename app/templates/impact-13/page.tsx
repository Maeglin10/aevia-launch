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
  Radar, Orbit, Atom, Search, Cpu, Clock, Watch,
  Compass, Gauge, Disc, Waves, ShieldCheck,
  Thermometer, FlaskConical, Sun, Moon, Star,
  Sparkles, CircleDot, ArrowUpRight, ArrowDownLeft,
  Expand, Shrink, MousePointer2, HardDrive, Key,
  Lock, Unlock, Shield, ShieldAlert, Laptop,
  Server, Network, Wifi, Bluetooth, Radio,
  Droplets, Pickaxe, Mountain, Gem, Drill,
  Telescope, MilestoneIcon, Globe, Layout,
  Smartphone, PenTool, Camera, Film, Palette,
  MessageSquare, Send, ZapOff, Anchor, Ship,
  Truck, Train, Bus, Car, Bike, Eye, ScanEye,
  EyeOff, KeyRound, Fingerprint as FingerprintIcon
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   CHRONOS ATELIER DATASET (ULTRA DENSITY)
   ========================================================================== */

const COLLECTIONS = [
  {
    id: "ch-imp-01",
    name: "The Imperial",
    calibre: "Cal. V.01",
    power: "72h Reserve",
    vph: "28,800 VPH",
    desc: "L'apogée de la complication classique. Boîtier en platine massif et cadran en émail grand feu, abritant notre premier calibre manufacture.",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1600&q=80",
    color: "#d4af37"
  },
  {
    id: "ch-gra-08",
    name: "Gravity Tourbillon",
    calibre: "Cal. T.08",
    power: "48h Reserve",
    vph: "21,600 VPH",
    desc: "Un défi à la physique. Un tourbillon volant tri-axial suspendu dans un boîtier saphir intégral pour une visibilité totale sur le mouvement.",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?w=1600&q=80",
    color: "#c0c0c0"
  },
  {
    id: "ch-obs-15",
    name: "Obsidian GMT",
    calibre: "Cal. G.15",
    power: "60h Reserve",
    vph: "28,800 VPH",
    desc: "Le compagnon ultime du voyageur. Titane grade 5 sablé et lunette en céramique obsidian pour une résistance extrême.",
    img: "https://images.unsplash.com/photo-1619229666797-25bc91f9c0bc?w=1600&q=80",
    color: "#1a1a1a"
  }
]

const CALIBRE_SPECS = [
  { label: "Oscillation", value: "28,800", trend: "High-Beat", detail: "Frequency // VPH" },
  { label: "Power Reserve", value: "72h", trend: "Extended", detail: "Double Barrel Sync" },
  { label: "Jewels", value: "35 Rubies", trend: "Frictionless", detail: "Pivot Points" },
  { label: "Thickness", value: "3.2mm", trend: "Ultra-Thin", detail: "Casing Volume" }
]

const HERITAGE = [
  { year: "1892", event: "Origins", desc: "Fondation de l'atelier à La Chaux-de-Fonds par Émile Chronos." },
  { year: "1924", event: "Masterpiece", desc: "Brevet du premier chronographe monopoussoir à rattrapante." },
  { year: "1960", event: "Evolution", desc: "Introduction du Calibre V.01, standard de précision absolue." },
  { year: "2024", event: "Legacy", desc: "Inauguration de la manufacture 100% autonome et neutre en carbone." }
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

function GearMotionBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
       <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
       {[...Array(5)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute border border-[#d4af37] rounded-full flex items-center justify-center"
             style={{ 
                width: 200 + i * 150, 
                height: 200 + i * 150,
                top: `${10 + i * 15}%`,
                left: `${-10 + i * 10}%`
             }}
             animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
             transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
          >
             <div className="w-full h-full border-t-2 border-[#d4af37]/20 rounded-full" />
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#d4af37]/10" />
          </motion.div>
       ))}
    </div>
  )
}

function HUD_Chronos() {
   return (
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-end pointer-events-none">
         <div className="flex flex-col gap-4 items-end">
            <div className="w-1 h-32 bg-[#d4af37]/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
               />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] vertical-text text-[#d4af37]">Calibre_Sync_V.01</span>
         </div>
         <div className="flex flex-col gap-4">
            <div className="w-12 h-12 border border-[#d4af37]/20 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full">
               <Clock className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-full">
               <Settings className="w-5 h-5 text-white/40 animate-spin-slow" />
            </div>
         </div>
      </div>
   )
}

function CollectionCard({ item, index }: { item: any, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <div className="min-w-[85vw] md:min-w-[65vw] lg:min-w-[45vw] h-[75vh] relative group overflow-hidden border border-white/5 bg-[#0a0a0a] snap-center">
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
       <motion.img 
          src={item.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          alt={item.name}
       />
       
       <div className="absolute top-12 left-12 z-20">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] mb-4">{item.calibre} // SWISS MADE</div>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic group-hover:translate-x-8 transition-transform duration-1000">
             {item.name}
          </h3>
       </div>

       <div className="absolute bottom-12 left-12 right-12 z-20">
          <p className="text-sm md:text-base text-white/40 leading-relaxed font-light uppercase italic mb-12 max-w-lg tracking-widest">
             {item.desc}
          </p>
          <div className="flex justify-between items-end border-t border-white/10 pt-12">
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Frequency</div>
                   <div className="text-lg font-black italic">{item.vph}</div>
                </div>
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Power Reserve</div>
                   <div className="text-lg font-black italic">{item.power}</div>
                </div>
             </div>
             <button className="px-12 py-6 border-2 border-[#d4af37] text-[#d4af37] text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all italic flex items-center gap-4">
                Explore Calibre <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
       
       <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[30vw] font-black text-white/[0.02] pointer-events-none select-none italic translate-x-1/2">
          {index + 1}
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: CHRONOS ATELIER (HIGH HOROLOGY)
   ========================================================================== */

export default function ChronosAtelierPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const shipScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#f0f0f0] font-sans selection:bg-[#d4af37]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <GearMotionBackground />
      <HUD_Chronos />
      
      {/* 1. NAVIGATION (LUXURY HOROLOGY) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-12 border-b border-[#d4af37]/10 bg-black/60 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Clock className="w-10 h-10 text-[#d4af37] group-hover:rotate-180 transition-transform duration-1000" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[0.2em] uppercase leading-none italic">Chronos <span className="text-[#d4af37]">Atelier.</span></span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/20 -mt-1 ml-1">Swiss Made // Since 1892</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#collections" className="hover:text-[#d4af37] transition-colors relative group">
               [ Collections ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
            <a href="#calibre" className="hover:text-[#d4af37] transition-colors relative group">
               [ Calibre_R&D ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
            <a href="#heritage" className="hover:text-[#d4af37] transition-colors relative group">
               [ Heritage ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest">Precision_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest">28,800_VPH</div>
            </div>
            <button className="px-8 py-4 border border-[#d4af37] text-[#d4af37] text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all italic">
               Bespoke Inquiry
            </button>
         </div>
      </nav>

      <main>
        {/* 2. CHRONOS IGNITION (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#d4af37]/30 bg-[#d4af37]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-16 italic">
                    <Compass className="w-4 h-4" /> Manufacture_Status: NOMINAL // CALIBRE_01_PASS
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: shipScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Mastery of</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Time.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#d4af37]/20 pl-12">
                       Chaque garde-temps Chronos est un sanctuaire de précision mécanique. Nous fusionnons l'artisanat ancestral et la logique des matériaux de pointe pour défier les siècles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center gap-4 italic group">
                          Explore Collections <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Background Overlay */}
           <div className="absolute inset-0 z-0 opacity-5 grayscale pointer-events-none select-none">
              <img src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=1600&q=80" className="w-full h-full object-cover" alt="Heritage" />
           </div>
        </section>

        {/* 3. COLLECTIONS (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="collections" className="py-64 px-12 border-y border-white/5 relative overflow-hidden">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-8">Current_Archives</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    The <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Masterpieces.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#d4af37]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Limited Editions // 1 of 1 // Tourbillon</p>
              </div>
           </div>

           <div className="flex gap-16 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {COLLECTIONS.map((item, i) => (
                 <CollectionCard key={item.id} item={item} index={i} />
              ))}
           </div>
        </section>

        {/* 4. CALIBRE R&D (HUD INTERFACE) */}
        <section id="calibre" className="py-64 px-12 bg-zinc-950 relative overflow-hidden">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-8">Manufacture_Logic</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                       Internal <br/> <span className="opacity-10">Motion.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {CALIBRE_SPECS.map((spec, i) => (
                          <div key={i} className="p-12 border border-white/5 bg-white/[0.02] hover:border-[#d4af37]/50 transition-all group relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Settings className="w-6 h-6 animate-spin-slow" />
                             </div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-6">{spec.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left">{spec.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
                                <span>{spec.detail}</span>
                                <span className="text-[#d4af37]">{spec.trend}</span>
                             </div>
                             <div className="mt-8 h-1 bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#d4af37]"
                                   initial={{ width: 0 }}
                                   whileInView={{ width: '90%' }}
                                   transition={{ duration: 1.5, delay: i * 0.1 }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-5">
                 <Reveal delay={0.4}>
                    <div className="relative aspect-square border-[20px] border-white/5 rounded-full p-20 flex items-center justify-center group overflow-hidden">
                       <div className="absolute inset-0 animate-spin-slow opacity-10">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#d4af37] stroke-[0.2] fill-none">
                             <circle cx="50" cy="50" r="48" strokeDasharray="5 2" />
                             <circle cx="50" cy="50" r="40" strokeDasharray="1 1" />
                          </svg>
                       </div>
                       <div className="relative z-10 text-center">
                          <Clock className="w-24 h-24 text-[#d4af37]/40 mb-8 mx-auto animate-pulse" />
                          <div className="text-4xl font-black italic tracking-tighter uppercase">Syncing...</div>
                          <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mt-2">Calibre_V.01_Active</div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 5. HERITAGE LEDGER (EDITORIAL TIMELINE) */}
        <section id="heritage" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-8">Ancestral_Roots</div>
                    <h2 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter italic mb-8">Heritage <span className="opacity-20">Ledger.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 italic">La Chaux-de-Fonds // Swiss Made // MMXXIV</p>
                 </div>
              </Reveal>

              <div className="space-y-px bg-[#d4af37]/10 border border-[#d4af37]/10">
                 {HERITAGE.map((item, i) => (
                    <Reveal key={item.year} delay={i * 0.1}>
                       <div className="bg-white p-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center group hover:bg-[#d4af37]/5 transition-colors cursor-default">
                          <div className="md:col-span-3">
                             <span className="text-7xl font-black italic text-black group-hover:text-[#d4af37] transition-colors">{item.year}</span>
                          </div>
                          <div className="md:col-span-4">
                             <h3 className="text-2xl font-black uppercase tracking-[0.2em] italic text-black">{item.event}</h3>
                          </div>
                          <div className="md:col-span-5">
                             <p className="text-black/40 text-base font-light italic leading-loose uppercase tracking-widest">{item.desc}</p>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* 6. BESPOKE PORTAL (CTA) */}
        <section className="py-64 px-12 bg-black relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10 text-center">
              <Reveal>
                 <span className="text-[10px] font-black uppercase tracking-[1em] text-[#d4af37]/50 mb-16 block italic">One of One</span>
                 <h2 className="text-7xl md:text-[15vw] font-black italic tracking-tighter leading-[0.8] uppercase mb-20">
                    Bespoke <br/> <span className="text-white/10 not-italic">Atelier.</span>
                 </h2>
                 <div className="flex flex-wrap justify-center gap-12">
                    <button className="px-20 py-10 bg-[#d4af37] text-black font-black uppercase text-sm tracking-[0.4em] hover:bg-white transition-all italic shadow-[0_0_60px_rgba(212,175,55,0.4)]">
                       Initiate_Inquiry
                    </button>
                    <button className="px-20 py-10 border-2 border-white/10 text-white font-black uppercase text-sm tracking-[0.4em] hover:bg-white/5 transition-all italic">
                       Visit_Manufacture
                    </button>
                 </div>
              </Reveal>
           </div>
           
           {/* Background Gear Background */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.01] pointer-events-none select-none italic z-0 animate-spin-slow">
              CHRONOS
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-20 px-12 md:px-24 border-t-8 border-[#d4af37]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic">Chronos.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-[#d4af37] ml-2">Swiss Made Manufacture</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La préservation de l'art du temps mécanique à travers l'artisanat ancestral et la logique technologique.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-[#d4af37]/30 hover:text-[#d4af37] transition-all cursor-pointer" />
                             <Settings className="w-7 h-7 text-[#d4af37]/30 hover:text-[#d4af37] transition-all cursor-pointer" />
                             <Clock className="w-7 h-7 text-[#d4af37]/30 hover:text-[#d4af37] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] mb-16 border-b border-[#d4af37]/20 pb-4">Collections</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> The_Imperial
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Gravity_Tourbillon
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Obsidian_GMT
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] mb-16 border-b border-[#d4af37]/20 pb-4">Atelier</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Calibre_R&D
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Heritage
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Manufacture
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 CHRONOS ATELIER SA.</span>
                    <span className="hidden md:inline">//</span>
                    <span>SWISS_MADE_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#d4af37]/30">
                    <span>28,800_VPH_SYNC</span>
                    <span>72H_RESERVE_STABLE</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #050505; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 60s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
