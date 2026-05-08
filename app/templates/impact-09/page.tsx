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
  Radar, Orbit, Atom, Search, Cpu, Rocket, PlaneTakeoff, 
  Compass, Map, Radio, Gauge, Disc, Waves, ShieldCheck, 
  Thermometer, Flame, Battery, Signal, Milestone, 
  FlaskConical, Microscope, Ghost, Binary, Database, 
  CircleDot, Waves as WaveIcon, Pickaxe, Mountain, Gem, 
  Drill, Telescope, MilestoneIcon, Globe, Layout, 
  Smartphone, PenTool, Camera, Music, Film, Palette, 
  MessageSquare, Send, ZapOff, Sun, Moon, Cloud, 
  CloudLightning, CloudRain, CloudSnow, Wind as WindIcon, 
  Droplets, ThermometerSnowflake, ThermometerSun, 
  Navigation, Navigation2, Anchor, Ship, Truck, Train, 
  Bus, Car, Bike, Shield, Eye, ScanEye, EyeOff, 
  Lock, Unlock, Key, KeyRound, Fingerprint as FingerprintIcon
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   ASTRUM REACH ORBITAL DATASET (ULTRA DENSITY)
   ========================================================================== */

const MISSIONS = [
  {
    id: "mis-lh-01",
    name: "Lunar Descent",
    target: "Moon // Shackleton Crater",
    duration: "12 Days",
    payload: "Scientific Relay",
    risk: "Medium",
    desc: "Une mission de précision visant à établir un relais de communication permanent au pôle sud lunaire. Exploitation de la glace d'eau pour le support de vie.",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80",
    color: "#6366f1"
  },
  {
    id: "mis-oh-08",
    name: "Orbital Halo",
    target: "LEO // Station Alpha",
    duration: "45 Days",
    payload: "Bio-Synthetic Labs",
    risk: "Low",
    desc: "Station de recherche en microgravité dédiée à la synthèse moléculaire et aux tests de biocompatibilité pour les futurs colons martiens.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    color: "#a855f7"
  },
  {
    id: "mis-mc-15",
    name: "Mars Catalyst",
    target: "Mars // Jezero",
    duration: "180 Days",
    payload: "Terraforming Core",
    risk: "Extreme",
    desc: "L'engagement le plus ambitieux. Déploiement du premier réacteur à fusion pour l'épaississement de l'atmosphère martienne.",
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&q=80",
    color: "#f43f5e"
  }
]

const CRAFT_SPECS = [
  { label: "Shield Integrity", value: "98.4%", trend: "Stable", detail: "Liquid-Graphene Layer" },
  { label: "Orbital Stability", value: "±0.002m", trend: "Nominal", detail: "AI Corrected Thrusters" },
  { label: "Propulsion Load", value: "42%", trend: "Efficient", detail: "Ion Drive Pulse" },
  { label: "Life Support", value: "NOMINAL", trend: "Safe", detail: "Bio-Filtered Cycle" }
]

const TELEMETRY_LOGS = [
  { time: "T+14:22:01", event: "STAGE_2_SEP", code: "OK", value: "14,200 km/h" },
  { time: "T+14:22:15", event: "ORBIT_INSERT", code: "SYNC", value: "LEO_ALT_400km" },
  { time: "T+14:22:48", event: "THERMAL_SHIELD", code: "ACTIVE", value: "1,240°C" }
]

/* ==========================================
   TECHNICAL COMPONENTS (SLIDER REVOLUTION)
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

function StarfieldBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020205]">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
       {[...Array(100)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute w-1 h-1 bg-white rounded-full"
             style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
             }}
             animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
             }}
             transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity,
                delay: Math.random() * 5
             }}
          />
       ))}
       {/* Orbital Path Rings */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-indigo-500/10 rounded-full animate-spin-slow pointer-events-none" />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-purple-500/5 rounded-full animate-reverse-slow pointer-events-none" />
    </div>
  )
}

function OrbitVisualizer() {
   return (
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20">
         <svg viewBox="0 0 500 500" className="w-full h-full">
            <motion.circle 
               cx="250" cy="250" r="100" fill="none" stroke="indigo" strokeWidth="0.5" 
               animate={{ r: [100, 110, 100] }} transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path 
               d="M 250 150 L 250 50 M 250 350 L 250 450 M 150 250 L 50 250 M 350 250 L 450 250" 
               stroke="indigo" strokeWidth="0.5" 
               animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               style={{ originX: "250px", originY: "250px" }}
            />
         </svg>
      </div>
   )
}

function HUD_Sidebar() {
   return (
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-24 bg-indigo-500/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-indigo-500/50">Orbital_Sync</span>
         </div>
         <div className="space-y-4">
            <div className="p-3 border border-indigo-500/20 bg-indigo-500/5 rounded-sm">
               <Orbit className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            </div>
            <div className="p-3 border border-white/10 bg-white/5 rounded-sm">
               <Navigation className="w-4 h-4 text-white/40" />
            </div>
         </div>
      </div>
   )
}

/* ==========================================================================
   MAIN PAGE: ASTRUM REACH ORBITAL (SPACEMAN STYLE)
   ========================================================================== */

export default function AstrumReachPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax effects
  const shipY = useTransform(scrollYProgress, [0, 1], [0, -400])
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div ref={containerRef} className="bg-[#020205] text-[#f0f0f0] font-sans selection:bg-indigo-500/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <StarfieldBackground />
      <HUD_Sidebar />
      
      {/* 1. HEADER (ORBITAL STYLE) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-12 border-b border-white/5 bg-black/40 backdrop-blur-xl">
         <div className="flex flex-col group cursor-pointer">
            <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none group-hover:text-indigo-400 transition-colors">Astrum.</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-indigo-500 -mt-1 ml-1">Reach Orbital Group</span>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#mission" className="hover:text-white transition-colors relative group">
               [ Manifest ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
            <a href="#tech" className="hover:text-white transition-colors relative group">
               [ Engineering ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ The_Maison ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
               <div className="text-[8px] font-black text-indigo-500 uppercase">Pressure_Stable</div>
               <div className="text-[10px] font-bold">1.2G Nominal</div>
            </div>
            <button className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:border-indigo-500 transition-colors">
               <Search className="w-4 h-4" />
            </button>
         </div>
      </nav>

      <main>
        {/* 2. LAUNCH IGNITION (HERO / SPACEMAN STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden">
           <OrbitVisualizer />
           
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-indigo-500/30 bg-indigo-500/5 text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-16 italic">
                    <Rocket className="w-4 h-4 animate-bounce" /> Status: LAUNCH_WINDOW_OPEN // 00:04:12
                 </div>
                 <motion.h1 
                    style={{ scale: textScale, opacity }}
                    className="text-8xl md:text-[15vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Reach the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Beyond.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-widest">
                       Nous maîtrisons le transit orbital commercial. Conçu pour l'élite évolutive, notre service assure une sécurité absolue vers les destinations lointaines.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(99,102,241,0.4)] flex items-center gap-4 italic group">
                          [ Start Mission ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Parallax Ship Layers */}
           <motion.div 
              style={{ y: shipY }}
              className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[80vw] max-w-5xl opacity-40 mix-blend-screen pointer-events-none z-0"
           >
              <img 
                 src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1600&q=80" 
                 className="w-full h-auto grayscale transition-all duration-1000"
                 alt="Starship"
              />
           </motion.div>
        </section>

        {/* 3. MISSION MANIFEST (HORIZONTAL SHOWCASE) */}
        <section id="mission" className="py-64 px-12 bg-[#050508] relative border-y border-white/5">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Mission_Manifest</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    The <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Destinations.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block">
                 <div className="flex gap-4 mb-4">
                    <div className="w-12 h-1 bg-indigo-500" />
                    <div className="w-32 h-1 bg-white/5" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Orbital // Lunar // Martian</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-white/5 overflow-hidden">
              {MISSIONS.map((mission, i) => (
                 <Reveal key={mission.id} delay={i * 0.1}>
                    <div className="group relative p-16 border-r border-white/5 hover:bg-white/[0.02] transition-all h-[700px] flex flex-col justify-between overflow-hidden">
                       <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity">
                          <img src={mission.img} className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-2000" alt={mission.name} />
                       </div>
                       
                       <div className="relative z-10">
                          <div className="flex justify-between items-center mb-12">
                             <div className="text-[8px] font-black uppercase tracking-[0.5em] text-indigo-500">{mission.id}</div>
                             <div className={`px-4 py-1 text-[8px] font-black uppercase tracking-widest border border-white/20 rounded-full ${mission.risk === 'Extreme' ? 'bg-red-500/20 text-red-400' : 'text-white/40'}`}>
                                Risk: {mission.risk}
                             </div>
                          </div>
                          <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 italic group-hover:translate-x-4 transition-transform duration-700">{mission.name}</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
                                <span>Target</span>
                                <span className="text-white">{mission.target}</span>
                             </div>
                             <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
                                <span>Duration</span>
                                <span className="text-white">{mission.duration}</span>
                             </div>
                          </div>
                       </div>

                       <div className="relative z-10">
                          <p className="text-xs text-white/40 leading-relaxed font-medium uppercase italic mb-12 h-20">
                             {mission.desc}
                          </p>
                          <button className="w-full py-8 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-4 group/btn">
                             View Mission Details <Maximize2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </Reveal>
              ))}
           </div>
        </section>

        {/* 4. TECH EXPLORER (HUD INTERFACE / AI GLASSES STYLE) */}
        <section id="tech" className="py-64 px-12">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div>
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Systems_Core</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                       Orbital <br/> <span className="opacity-10">Specs.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {CRAFT_SPECS.map((spec, i) => (
                          <div key={i} className="p-10 border border-white/5 bg-white/[0.02] hover:border-indigo-500/50 transition-colors group">
                             <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">{spec.label}</div>
                             <div className="text-5xl font-black italic mb-4 tracking-tighter group-hover:scale-110 transition-transform origin-left">{spec.value}</div>
                             <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">{spec.detail}</div>
                          </div>
                       ))}
                    </div>
                 </Reveal>
              </div>

              <div className="relative">
                 <Reveal delay={0.4}>
                    <div className="aspect-square border-[20px] border-white/5 rounded-full p-20 relative overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-0 animate-spin-slow opacity-20">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-indigo-500 stroke-[0.2] fill-none">
                             <circle cx="50" cy="50" r="48" strokeDasharray="10 5" />
                             <circle cx="50" cy="50" r="40" strokeDasharray="5 10" />
                          </svg>
                       </div>
                       
                       <div className="relative z-10 w-full h-full bg-indigo-500/5 rounded-full backdrop-blur-2xl border border-indigo-500/20 flex items-center justify-center">
                          <motion.div 
                             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                             transition={{ duration: 10, repeat: Infinity }}
                             className="text-center"
                          >
                             <Radar className="w-32 h-32 text-indigo-500/40 mb-8 mx-auto animate-pulse" />
                             <div className="text-4xl font-black italic tracking-tighter uppercase">Scanning...</div>
                             <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2">v4.0_Telemetrics</div>
                          </motion.div>
                       </div>

                       {/* Interactive Floating Tags */}
                       <motion.div 
                          animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}
                          className="absolute top-20 right-20 px-4 py-2 border border-white/20 bg-black/80 backdrop-blur-md text-[8px] font-black uppercase"
                       >
                          Shield: 100%
                       </motion.div>
                       <motion.div 
                          animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }}
                          className="absolute bottom-20 left-20 px-4 py-2 border border-white/20 bg-black/80 backdrop-blur-md text-[8px] font-black uppercase"
                       >
                          Prop: Active
                       </motion.div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 5. TELEMETRY LOGS (TERMINAL / DATA VIZ) */}
        <section className="py-64 px-12 bg-white text-black">
           <div className="max-w-7xl mx-auto">
              <Reveal>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-8">Ground_Control</div>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                          Real-time <br/> <span className="opacity-20">Link.</span>
                       </h2>
                       <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] max-w-md">
                          Suivez chaque paramètre de vol en temps réel via notre liaison satellite chiffrée. Une transparence totale pour une sérénité maximale.
                       </p>
                    </div>
                    
                    <div className="bg-black text-[#00ff88] p-12 border-8 border-black/10 rounded-2xl font-mono text-xs overflow-hidden shadow-2xl">
                       <div className="flex gap-4 mb-12 border-b border-[#00ff88]/20 pb-4">
                          <CircleDot className="w-4 h-4 animate-pulse" />
                          <span className="font-black uppercase tracking-widest">Astrum_Console_v2.4</span>
                       </div>
                       <div className="space-y-6">
                          {TELEMETRY_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between group cursor-default">
                                <span className="text-[#00ff88]/30 group-hover:text-[#00ff88] transition-colors">{log.time}</span>
                                <span className="font-black italic uppercase tracking-tighter">{log.event}</span>
                                <span className="text-white/40">{log.value}</span>
                                <span className="font-black">[{log.code}]</span>
                             </div>
                          ))}
                          <motion.div 
                             animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}
                             className="pt-8 border-t border-[#00ff88]/20 flex gap-4"
                          >
                             <span>_</span>
                             <span className="uppercase italic tracking-widest">Awaiting flight signal input...</span>
                          </motion.div>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* 6. FAQ (ORBITAL ACCORDION) */}
        <section className="py-64 px-12 relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Mission_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8">FAQ <span className="opacity-10">Atlas.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Safety // Protocols // Logistics</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What level of training is required?", a: "Guests require a 2-week intensive training program at our Tokyo facility, covering zero-G movement and emergency protocols." },
                   { q: "Is commercial space travel safe?", a: "Astrum Reach maintains an AAAA+ safety rating. Every craft is equipped with redundant life-support systems." },
                   { q: "Can I bring personal items aboard?", a: "Allowance is restricted to 2kg per guest. Items must be certified for high-G launch and zero-G containment." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-10 rounded-sm hover:border-indigo-500/30 transition-all">
                      <AccordionTrigger className="text-[12px] font-black uppercase tracking-[0.4em] py-12 no-underline italic">
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
        <footer className="bg-black pt-64 pb-16 px-12 md:px-24 border-t-8 border-indigo-600">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-6">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[12vw] font-black tracking-tighter uppercase leading-[0.7] italic">Astrum.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-indigo-500 ml-2">Reach Orbital Group</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue du transit orbital commercial. Conçu pour l'élite mondiale.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                             <Binary className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                             <Orbit className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-16">Manifest</h4>
                    <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Lunar_Descent
                       </li>
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Orbital_Halo
                       </li>
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Mars_Catalyst
                       </li>
                    </ul>
                 </div>

                 <div className="lg:col-span-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-16">Navigation</h4>
                    <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Fleet_Status
                       </li>
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Bio_Safe_9
                       </li>
                       <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Consultation
                       </li>
                    </ul>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">
                 <div className="flex gap-16">
                    <span>©2026 ASTRUM REACH ORBITAL.</span>
                    <span className="hidden md:inline">//</span>
                    <span>FAA_SPACE_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-indigo-500/30">
                    <span>LAUNCH_NOMINAL</span>
                    <span>PRESSURE_STABLE_1.2G</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020205; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        .animate-reverse-slow { animation: reverse-spin 60s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  )
}
