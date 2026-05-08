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
  Radar, Orbit, Atom, Search, Cpu, Globe,
  ShieldCheck, Binary, Code2, Database,
  Gauge, Thermometer, FlaskConical, Sun, Moon,
  Star, Sparkles, CircleDot, ArrowUpRight,
  ArrowDownLeft, Expand, Shrink, MousePointer2,
  HardDrive, Key, Lock, Unlock, Shield, ShieldAlert,
  Laptop, Server, Network, Wifi, Bluetooth, Radio,
  Droplets, Pickaxe, Mountain, Gem, Drill,
  Telescope, MilestoneIcon, Layout, Smartphone,
  PenTool, Camera, Film, Palette, MessageSquare,
  Send, ZapOff, Anchor, Ship, Truck, Train, Bus,
  Car, Bike, Eye, ScanEye, EyeOff, KeyRound,
  Fingerprint as FingerprintIcon, Navigation,
  Navigation2, Wind as WindIcon, Biohazard,
  Crosshair, Focus, Bug, ShieldAlert as ShieldAlertIcon,
  Skull, Scan as ScanIcon, Aperture, Cast, 
  Ghost, Headphones, Mic, Music, Speaker,
  Video, Volume2, WifiOff, Code, Braces,
  Cpu as CpuIcon, Share, Satellite, Magnet
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   MAGNETIC HUD DATASET (ULTRA DENSITY)
   ========================================================================== */

const PROTOCOLS = [
  {
    id: "prot-01",
    title: "Mesh Synapse",
    desc: "Connexion de nœuds de données disparates dans un environnement réactif unifié. Chaque point de données devient une extension de l'intelligence système.",
    status: "SYNC",
    load: "92%"
  },
  {
    id: "prot-08",
    title: "Entropy Zero",
    desc: "Réduction agressive du bruit système pour une clarté computationnelle absolue. Nous purifions le flux d'informations pour une performance optimale.",
    status: "READY",
    load: "96%"
  },
  {
    id: "prot-15",
    title: "Fidelity Push",
    desc: "Délivrance de sorties visuelles et de données haute fidélité sur tous les nœuds périphériques. Une intégrité totale de l'interface utilisateur.",
    status: "ACTIVE",
    load: "100%"
  }
]

const HUD_METRICS = [
  { label: "Node Load", value: "12%", trend: "Stable", detail: "Node v7.4.2 Verified" },
  { label: "Telemetry Sync", value: "99.9%", trend: "High", detail: "Global Sync Active" },
  { label: "Entropy Level", value: "Zero", trend: "Pure", detail: "Magnetic Field Clarity" },
  { label: "Fidelity", value: "8K Native", trend: "Max", detail: "Visual Integrity Audit" }
]

const TELEMETRY_LOGS = [
  { time: "22:12:08", event: "MAGNETIC_INIT", status: "PASS", detail: "Shell_Enclave_01" },
  { time: "22:15:32", event: "NODE_VERIFY", status: "PASS", detail: "v7.4.2_Core" },
  { time: "22:22:15", event: "TELEMETRY_SYNC", status: "ACTIVE", detail: "Global_Node_7" }
]

/* ==========================================
   TECHNICAL COMPONENTS (MAGNETIC / HUD)
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

function MagneticFieldBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,91,247,0.05)_0%,transparent_70%)]" />
       <svg width="100%" height="100%" className="w-full h-full opacity-30">
          <defs>
             <pattern id="magnetic-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="#5b5bf7" opacity="0.3" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#5b5bf7" strokeWidth="0.5" opacity="0.1" />
             </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#magnetic-grid)" />
       </svg>
       {[...Array(15)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute h-px bg-gradient-to-r from-transparent via-[#5b5bf7] to-transparent"
             style={{ 
                left: -500, 
                top: `${i * 7}%`,
                width: 1000,
                rotate: i % 2 === 0 ? 5 : -5
             }}
             animate={{ 
                left: ['-50%', '150%'],
                opacity: [0, 1, 0]
             }}
             transition={{ 
                duration: 6 + Math.random() * 8, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
             }}
          />
       ))}
    </div>
  )
}

function HUD_Magnetic() {
   return (
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-[#5b5bf7]/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-[#5b5bf7] shadow-[0_0_20px_rgba(91,91,247,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-[#5b5bf7]">Field_Flow</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-[#5b5bf7]/20 bg-[#5b5bf7]/5 backdrop-blur-md rounded-sm">
               <Magnet className="w-6 h-6 text-[#5b5bf7]" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm">
               <Activity className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function ProtocolCard({ prot, index }: { prot: any, index: number }) {
  return (
    <div className="group relative p-16 border border-[#5b5bf7]/10 bg-[#020208] hover:bg-[#5b5bf7]/5 transition-all h-[550px] flex flex-col justify-between overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Terminal className="w-48 h-48 text-[#5b5bf7]" />
       </div>
       
       <div>
          <div className="flex justify-between items-center mb-12">
             <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5b5bf7]">{prot.id} // SECURE</div>
             <div className="px-4 py-1 border border-[#5b5bf7]/30 rounded-full text-[8px] font-black text-[#5b5bf7] uppercase tracking-widest">
                {prot.status}
             </div>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700 text-white">
             {prot.title}
          </h3>
       </div>

       <div className="relative z-10">
          <p className="text-xs text-white/30 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
             {prot.desc}
          </p>
          <div className="space-y-4">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>Field_Affinity</span>
                <span className="text-[#5b5bf7]">{prot.load}</span>
             </div>
             <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                   className="absolute inset-y-0 left-0 bg-[#5b5bf7]"
                   initial={{ width: 0 }}
                   whileInView={{ width: prot.load }}
                   transition={{ duration: 1.5 }}
                />
             </div>
          </div>
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: MAGNETIC HUD (TELEMETRY INTELLIGENCE)
   ========================================================================== */

export default function MagneticHUDPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const shipScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#010103] text-[#d1d1f7] font-mono selection:bg-[#5b5bf7]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <MagneticFieldBackground />
      <HUD_Magnetic />
      
      {/* 1. NAVIGATION (MAGNETIC TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-[#5b5bf7]/10 bg-black/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Zap className="w-10 h-10 text-[#5b5bf7] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic text-white">Magnetic<span className="text-[#5b5bf7]/40">_</span>HUD.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#5b5bf7]/30 -mt-1 ml-1">Telemetry Intelligence Atelier</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-[#5b5bf7]/30">
            <a href="#protocols" className="hover:text-white transition-colors relative group">
               [ Protocols ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5b5bf7] group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5b5bf7] group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Manifesto ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5b5bf7] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-[#5b5bf7]/10 pr-6">
               <div className="text-[8px] font-black text-[#5b5bf7] uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic text-white">All_Nodes_Nominal</div>
            </div>
            <button className="px-10 py-5 bg-[#5b5bf7] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(91,91,247,0.2)] italic">
               Initiate_HUD
            </button>
         </div>
      </nav>

      <main>
        {/* 2. TELEMETRY IGNITION (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-[#5b5bf7]/10">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#5b5bf7]/30 bg-[#5b5bf7]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#5b5bf7] mb-16 italic">
                    <Satellite className="w-4 h-4 animate-pulse" /> Telemetry_Status: VERIFIED // NODE_V7.4.2_READY
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: shipScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-white"
                 >
                    <span>Secure the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px #5b5bf7" }}>HUD.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-[#5b5bf7]/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#5b5bf7]/20 pl-12">
                       Sécuriser le futur des systèmes distribués via une orchestration haute fidélité et une clarté computationnelle radicale. L'intelligence est réactive.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#5b5bf7] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(91,91,247,0.3)] flex items-center gap-4 italic group">
                          [ Start Monitoring ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #5b5bf7 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
           </div>
        </section>

        {/* 3. PROTOCOLS (DENSE GRID INTERFACE) */}
        <section id="protocols" className="py-64 px-12 bg-black relative border-b border-[#5b5bf7]/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5b5bf7]/40 mb-8">System_Sequence</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-white">
                    Protocol <br/> <span className="text-[#5b5bf7]/10" style={{ WebkitTextStroke: "1px #5b5bf7" }}>Logic.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#5b5bf7]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5b5bf7]/20 italic">Mesh // Entropy // Fidelity</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROTOCOLS.map((prot, i) => (
                 <Reveal key={prot.id} delay={i * 0.1}>
                    <ProtocolCard prot={prot} index={i} />
                 </Reveal>
              ))}
           </div>
        </section>

        {/* 4. TECH AUDIT (HUD DATA VIZ) */}
        <section id="metrics" className="py-64 px-12 bg-black relative border-b border-[#5b5bf7]/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5b5bf7]/40 mb-8">Telemetry_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                       System <br/> <span className="opacity-10">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {HUD_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-[#5b5bf7]/10 bg-[#5b5bf7]/5 hover:border-[#5b5bf7]/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#5b5bf7]/40 mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-white">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#5b5bf7]/20">
                                <span>{metric.detail}</span>
                                <span className="text-[#5b5bf7]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#5b5bf7]"
                                   initial={{ width: 0 }}
                                   whileInView={{ width: '100%' }}
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
                    <div className="p-12 bg-[#5b5bf7]/5 border border-[#5b5bf7]/20 rounded-sm relative group overflow-hidden shadow-2xl">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">Telemetry Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-[#5b5bf7] animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {TELEMETRY_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-[#5b5bf7]/5 px-2 transition-colors">
                                <span className="text-[#5b5bf7]/30 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-[#5b5bf7]/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-[#5b5bf7]/40 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Telemetry_Inquiry...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-[#5b5bf7]/[0.01] pointer-events-none select-none italic z-0">
              MAGNETIC
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5b5bf7] mb-8">Telemetry_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       System <br/> <span className="opacity-20">Shell.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16 leading-loose">
                       Un environnement de shell unifié pour l'orchestration haute fidélité d'enclaves d'intelligence à l'échelle planétaire. Construit pour ceux qui surveillent les systèmes.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Node</div>
                          <div className="text-4xl font-black italic">VERIFIED</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Telemetry</div>
                          <div className="text-4xl font-black italic">SYNC</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-black/5 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Telemetry Orchestration Interior"
                       />
                       <div className="absolute inset-0 bg-[#5b5bf7]/10 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (TACTICAL ACCORDION) */}
        <section className="py-64 px-12 bg-black relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5b5bf7] mb-8">Technical_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-white">System <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5b5bf7]/20 italic">API // Research // Telemetry</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is your primary system philosophy?", a: "Computational clarity. We believe that a high-performing system should be reflected in its telemetry logic. Every protocol and data flow is a deliberate decision." },
                   { q: "How do you handle telemetry integrity?", a: "Every mesh synapse operates in a memory-only enclave. Post-execution, we perform node-level audits to ensure 100% integrity of the telemetry state." },
                   { q: "Do you offer custom system enclaves?", a: "Yes. For bespoke planetary workflows, we design unique magnetic field topologies and telemetry sequences that synchronize with the global data load." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-[#5b5bf7]/10 bg-[#5b5bf7]/5 px-10 rounded-sm hover:border-[#5b5bf7]/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-white">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-[#5b5bf7]/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-20 px-12 md:px-24 border-t-8 border-[#5b5bf7]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-white">Magnetic<span className="text-[#5b5bf7]/40">_</span>HUD.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-[#5b5bf7]/40 ml-2">Telemetry Intelligence Atelier</span>
                       </div>
                       <p className="text-[#d1d1f7]/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de la télémétrie planétaire. Global // Sync.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-[#5b5bf7]/30 hover:text-[#5b5bf7] transition-all cursor-pointer" />
                             <Magnet className="w-7 h-7 text-[#5b5bf7]/30 hover:text-[#5b5bf7] transition-all cursor-pointer" />
                             <Braces className="w-7 h-7 text-[#5b5bf7]/30 hover:text-[#5b5bf7] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5b5bf7] mb-16 border-b border-[#5b5bf7]/20 pb-4">Protocols</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> Mesh_Synapse
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> Entropy_Zero
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> Fidelity_Push
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5b5bf7] mb-16 border-b border-[#5b5bf7]/20 pb-4">System</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> Node_Audit
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> Global_Sync
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#5b5bf7]" /> API_Access
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 MAGNETIC HUD SYSTEMS.</span>
                    <span className="hidden md:inline">//</span>
                    <span>TELEMETRY_SYNC_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#5b5bf7]/30">
                    <span>8K_RESOLUTION_NATIVE</span>
                    <span>NODE_INTEGRITY_100%</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #010103; }
        ::-webkit-scrollbar-thumb { background: #5b5bf7; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
