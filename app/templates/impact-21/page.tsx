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
  Radar, Orbit, Atom, Search, Cpu, Box as BoxIcon,
  ShieldCheck, Binary, Code2, Globe, Database,
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
  Skull, Scan as ScanIcon, Ruler, Construction,
  Hammer, Pencil, Shapes, Warehouse, Building,
  Factory, HardHat, LandPlot, MapPin, Pipette,
  Layers as LayersIcon
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   NEO OBJECT DATASET (ULTRA DENSITY)
   ========================================================================== */

const SEQUENCE = [
  {
    id: "seq-01",
    title: "Sectional Audit",
    desc: "Découpe rigoureuse de volumes complexes pour révéler le potentiel spatial du matériau. Chaque section est une étude de la densité et du vide.",
    status: "SYNC",
    load: "Titanium G5"
  },
  {
    id: "seq-08",
    title: "Stress Simulation",
    desc: "Analyse de la performance de l'objet sous des charges structurelles et domestiques extrêmes. Nous testons les limites de la gravité matérielle.",
    status: "READY",
    load: "8000N/m²"
  },
  {
    id: "seq-15",
    title: "Aging Protocol",
    desc: "Surveillance de l'interaction des alliages bruts avec l'oxydation multigénérationnelle. La patine devient une archive temporelle.",
    status: "ACTIVE",
    load: "VERIFIED"
  }
]

const MATERIAL_METRICS = [
  { label: "Alloy Density", value: "8K Native", trend: "Max", detail: "Molecular Integrity Scan" },
  { label: "Forge Latency", value: "0.1ms", trend: "Nano", detail: "Real-time Thermal Sync" },
  { label: "Vacuum Integrity", value: "99.9%", trend: "Pure", detail: "Zero-Air Entrapment" },
  { label: "Stress Tolerance", value: "Extreme", trend: "High", detail: "Structural Gravity Audit" }
]

const FORGE_LOGS = [
  { time: "10:12:04", event: "VACUUM_CAST", status: "PASS", detail: "Forge_Arm_Alpha" },
  { time: "10:15:32", event: "TITANIUM_BOND", status: "DONE", detail: "Laser_Enclave_2" },
  { time: "10:22:15", event: "FORGE_VERIFIED", status: "PASS", detail: "Material_Core_V4" }
]

/* ==========================================
   TECHNICAL COMPONENTS (INDUSTRIAL / HUD)
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

function AlloyFlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)]" />
       {[...Array(15)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute border border-black/10 rounded-full"
             style={{ 
                width: 400 + i * 200, 
                height: 400 + i * 200,
                top: `${i * 8}%`,
                left: `${-15 + i * 4}%`
             }}
             animate={{ 
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.05, 1]
             }}
             transition={{ 
                duration: 25 + i * 12, 
                repeat: Infinity, 
                ease: "linear"
             }}
          >
             <div className="w-full h-full border-t border-black/5" />
          </motion.div>
       ))}
    </div>
  )
}

function HUD_Industrial() {
   return (
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-black/10 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-black shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-black">Forge_Flow</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-black/10 bg-black/5 backdrop-blur-md rounded-sm">
               <Factory className="w-6 h-6 text-black" />
            </div>
            <div className="p-4 border border-black/5 bg-black/5 backdrop-blur-md rounded-sm">
               <Ruler className="w-6 h-6 text-black/40" />
            </div>
         </div>
      </div>
   )
}

function SequenceCard({ seq, index }: { seq: any, index: number }) {
  return (
    <div className="group relative p-16 border border-black/5 bg-zinc-50 hover:bg-zinc-100 transition-all h-[550px] flex flex-col justify-between overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Warehouse className="w-48 h-48 text-black" />
       </div>
       
       <div>
          <div className="flex justify-between items-center mb-12">
             <div className="text-[10px] font-black uppercase tracking-[0.6em] text-black/40">{seq.id} // INDUSTRIAL</div>
             <div className="px-4 py-1 border border-black/30 rounded-full text-[8px] font-black text-black uppercase tracking-widest">
                {seq.status}
             </div>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700 text-black">
             {seq.title}
          </h3>
       </div>

       <div className="relative z-10">
          <p className="text-xs text-black/40 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
             {seq.desc}
          </p>
          <div className="space-y-4">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-black/20">
                <span>Material_Load</span>
                <span className="text-black">{seq.load}</span>
             </div>
             <div className="w-full h-[1px] bg-black/10 relative overflow-hidden">
                <motion.div 
                   className="absolute inset-y-0 left-0 bg-black"
                   initial={{ width: 0 }}
                   whileInView={{ width: seq.load.includes('G5') ? '85%' : '100%' }}
                   transition={{ duration: 1.5 }}
                />
             </div>
          </div>
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: NEO OBJECT (MATERIAL SUPREMACY)
   ========================================================================== */

export default function NeoObjectPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const shipScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#f2f2f2] text-black font-sans selection:bg-black selection:text-white min-h-screen overflow-x-hidden">
      
      <AlloyFlowBackground />
      <HUD_Industrial />
      
      {/* 1. NAVIGATION (NEO TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-black/10 bg-white/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <BoxIcon className="w-10 h-10 text-black group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Neo<span className="text-black/20">_</span>Object.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-black/30 -mt-1 ml-1">Material Supremacy Atelier</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
            <a href="#sequence" className="hover:text-black transition-colors relative group">
               [ Sequence ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-black transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-black transition-colors relative group">
               [ Manifesto ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-black/10 pr-6">
               <div className="text-[8px] font-black text-black/40 uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic">Manufacturing_Active</div>
            </div>
            <button className="px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_0_40px_rgba(0,0,0,0.2)] italic">
               Initiate_Access
            </button>
         </div>
      </nav>

      <main>
        {/* 2. MATERIAL SUPREMACY (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-black/5">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-black/30 bg-black/5 text-[10px] font-black uppercase tracking-[0.5em] text-black mb-16 italic">
                    <Factory className="w-4 h-4 animate-pulse" /> Material_Status: NOMINAL // VACUUM_SYNC_PASS
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: shipScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-black"
                 >
                    <span>Own The</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px black" }}>Weight.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-black/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-black/20 pl-12">
                       Sécuriser le futur des objets matériels via des techniques de forge industrielle et une logique de réduction radicale. La densité est notre esthétique.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_0_50px_rgba(0,0,0,0.3)] flex items-center gap-4 italic group">
                          [ Start Commission ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
           </div>
        </section>

        {/* 3. SEQUENCE (DENSE GRID INTERFACE) */}
        <section id="sequence" className="py-64 px-12 bg-zinc-100 relative border-b border-black/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Production_Sequence</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-black">
                    Industrial <br/> <span className="text-black/5" style={{ WebkitTextStroke: "1px black" }}>Forge.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-black/10" />
                    <div className="w-16 h-[1px] bg-black" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 italic">Vacuum // Bond // Protocol</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SEQUENCE.map((seq, i) => (
                 <Reveal key={seq.id} delay={i * 0.1}>
                    <SequenceCard seq={seq} index={i} />
                 </Reveal>
              ))}
           </div>
        </section>

        {/* 4. TECH AUDIT (HUD DATA VIZ) */}
        <section id="metrics" className="py-64 px-12 bg-white relative border-b border-black/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Material_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-black">
                       Structural <br/> <span className="opacity-10">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {MATERIAL_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-black/10 bg-black/5 hover:border-black/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-black">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">
                                <span>{metric.detail}</span>
                                <span className="text-black">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-black/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-black"
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
                    <div className="p-12 bg-black text-white rounded-sm relative group overflow-hidden border border-black/10 shadow-2xl">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic">Forge Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {FORGE_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-white/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-white/40 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Material_Sync...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-black/[0.02] pointer-events-none select-none italic z-0">
              DENSITY
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-black text-white relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-8">Structural_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic text-white">
                       Vacuum <br/> <span className="opacity-20">Casting.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-white/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Notre atelier de Berlin utilise des techniques de fabrication de l'industrie lourde pour la production d'objets à échelle domestique. Nous repoussons les limites de la densité.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Titanium</div>
                          <div className="text-4xl font-black italic">BOND_SYNC</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Precision</div>
                          <div className="text-4xl font-black italic">8K_OBJECT</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-zinc-900 group overflow-hidden border-[20px] border-zinc-800 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1592078615290-033ee584e226?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Neo Object Atelier"
                       />
                       <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (TACTICAL ACCORDION) */}
        <section className="py-64 px-12 bg-[#f8f8f8] relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Technical_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-black">Atelier <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 italic">Commission // Research // Execution</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is your primary design philosophy?", a: "Material supremacy. We believe that the object should reflect its industrial heritage. Every vacuum cast and titanium bond is a deliberate expression of weight and form." },
                   { q: "How do you handle structural safety?", a: "Every volume undergoes a multi-pass stress simulation audit. We operate within extreme performance standards to ensure absolute material stability across generations." },
                   { q: "Do you offer custom industrial fabrication?", a: "Yes. For bespoke domestic enclaves, we design unique alloys and vacuum casting paths that push the limits of traditional product design." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-black/10 bg-black/5 px-10 rounded-sm hover:border-black/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-black">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-black/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-white pt-64 pb-20 px-12 md:px-24 border-t-8 border-black">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-black">Neo<span className="text-black/20">_</span>Object.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-black/40 ml-2">Material Supremacy Atelier</span>
                       </div>
                       <p className="text-black/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de la densité matérielle. Berlin // Global Command Center.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-black/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                             <BoxIcon className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                             <Factory className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-black mb-16 border-b border-black/20 pb-4">Sequence</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-black/30">
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Sectional_Audit
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Stress_Simulation
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Aging_Protocol
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-black mb-16 border-b border-black/20 pb-4">Atelier</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-black/30">
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Manifesto
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Global_Nodes
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> Partners
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-black/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 NEO OBJECT ATELIER AG.</span>
                    <span className="hidden md:inline">//</span>
                    <span>MATERIAL_SUPREMACY_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-black/30">
                    <span>8K_RESOLUTION_OBJECT_NATIVE</span>
                    <span>TITANIUM_BOND_SYNC_LEVEL_5</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #f2f2f2; }
        ::-webkit-scrollbar-thumb { background: #000000; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
