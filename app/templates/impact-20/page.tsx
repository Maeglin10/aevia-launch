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
  Radar, Orbit, Atom, Search, Cpu, Crown,
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
  Skull, Scan as ScanIcon, History, Gem as GemIcon,
  Compass, Diamond, Scissors, Pen, Glasses, Watch
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   HERITAGE GOLD DATASET (ULTRA DENSITY)
   ========================================================================== */

const ARTIFACTS = [
  {
    id: "art-01",
    name: "Solar Chronos",
    sector: "Time Synthesis",
    purity: "24K Auric",
    value: "[CLASSIFIED]",
    desc: "Synthèse de modèles chronométriques ancestraux et d'optique neurale. Une pièce de fonderie orbitale unique.",
    img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1600&q=80",
    color: "#d4af37"
  },
  {
    id: "art-08",
    name: "Lunar Cuff",
    sector: "Anatomy Sync",
    purity: "22K White Gold",
    value: "[CLASSIFIED]",
    desc: "Cuff architectural fusionnant le titane grade 5 et l'or blanc. Ergonomie spatiale optimisée par IA.",
    img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1600&q=80",
    color: "#e5e5e5"
  },
  {
    id: "art-15",
    name: "Stellar Band",
    sector: "Molecular Bond",
    purity: "24K Pure Auric",
    value: "[CLASSIFIED]",
    desc: "Alliance moléculaire sans soudure visible. Cristallisation contrôlée en apesanteur.",
    img: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1600&q=80",
    color: "#d4af37"
  }
]

const AURIC_METRICS = [
  { label: "Alloy Purity", value: "24K Native", trend: "Pure", detail: "Molecular Integrity Scan" },
  { label: "Facet Precision", value: "±0.01nm", trend: "Perfect", detail: "Light Refraction Sync" },
  { label: "Refraction Sync", value: "99.9%", trend: "Max", detail: "Atmospheric Optics" },
  { label: "Forge Temp", value: "1064°C", trend: "Steady", detail: "Plasma Forge Protocol" }
]

const FORGE_LOGS = [
  { time: "11:22:04", event: "ALLOY_SYNTH", status: "PASS", detail: "Matrix_Forge_G7" },
  { time: "11:25:32", event: "MOLECULAR_BOND", status: "DONE", detail: "Laser_Sync_Array_2" },
  { time: "11:28:48", event: "REFRACTION_PASS", status: "SYNC", detail: "Optical_Vault_V4" }
]

/* ==========================================
   TECHNICAL COMPONENTS (AURIC / HUD)
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

function AuricFlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
       {[...Array(15)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
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

function HUD_Auric() {
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
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-[#d4af37]">Auric_Scan</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-[#d4af37]/20 bg-white/5 backdrop-blur-md rounded-full">
               <GemIcon className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-full">
               <ScanIcon className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function ArtifactCard({ artifact, index }: { artifact: any, index: number }) {
  return (
    <div className="min-w-[85vw] md:min-w-[65vw] lg:min-w-[45vw] h-[70vh] relative group overflow-hidden border border-[#d4af37]/10 bg-[#050505] snap-center">
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
       <motion.img 
          src={artifact.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100 opacity-30 group-hover:opacity-100"
          alt={artifact.name}
       />
       
       <div className="absolute top-12 left-12 z-20">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37]/40 mb-4">{artifact.id} // HERITAGE</div>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic group-hover:translate-x-8 transition-transform duration-1000 text-white">
             {artifact.name}
          </h3>
       </div>

       <div className="absolute bottom-12 left-12 right-12 z-20">
          <p className="text-sm md:text-base text-[#d4af37]/60 leading-relaxed font-light uppercase italic mb-12 max-w-lg tracking-widest leading-loose">
             {artifact.desc}
          </p>
          <div className="flex justify-between items-end border-t border-[#d4af37]/10 pt-12">
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <div className="text-[8px] text-[#d4af37]/20 uppercase mb-2">Purity_Native</div>
                   <div className="text-lg font-black italic text-white">{artifact.purity}</div>
                </div>
                <div>
                   <div className="text-[8px] text-[#d4af37]/20 uppercase mb-2">Valuation</div>
                   <div className="text-lg font-black italic text-white">{artifact.value}</div>
                </div>
             </div>
             <button className="px-12 py-6 border-2 border-[#d4af37] text-[#d4af37] text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all italic flex items-center gap-4">
                View Dossier <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
       
       <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[30vw] font-black text-[#d4af37]/[0.03] pointer-events-none select-none italic translate-x-1/2">
          {index + 1}
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: HERITAGE GOLD (AURIC ENGINEERING)
   ========================================================================== */

export default function HeritageGoldPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#020202] text-white font-serif selection:bg-[#d4af37] selection:text-black min-h-screen overflow-x-hidden">
      
      <AuricFlowBackground />
      <HUD_Auric />
      
      {/* 1. NAVIGATION (AURIC TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-[#d4af37]/10 bg-black/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Crown className="w-10 h-10 text-[#d4af37] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col font-sans">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Heritage<span className="text-[#d4af37]/20">_</span>Gold.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#d4af37]/30 -mt-1 ml-1">Auric Engineering Maison</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37]/30 font-sans">
            <a href="#artifacts" className="hover:text-white transition-colors relative group">
               [ Artifacts ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Manifesto ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12 font-sans">
            <div className="hidden md:flex flex-col items-end border-r border-[#d4af37]/10 pr-6">
               <div className="text-[8px] font-black text-[#d4af37]/40 uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic">All_Forges_Online</div>
            </div>
            <button className="px-10 py-5 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] italic">
               Initiate_Access
            </button>
         </div>
      </nav>

      <main>
        {/* 2. AURIC SUPREMACY (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-[#d4af37]/5">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#d4af37]/30 bg-[#d4af37]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-16 italic font-sans">
                    <Sparkles className="w-4 h-4 animate-pulse" /> Auric_Status: OPTIMIZED // MOLECULAR_BOND_PASS
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: textScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-white"
                 >
                    <span>Cast the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px #d4af37" }}>Immortal.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto font-sans">
                    <p className="text-lg md:text-xl text-[#d4af37]/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#d4af37]/20 pl-12">
                       Préserver le futur de l'excellence aurique via une orfèvrerie ancestrale et une curation haute fidélité. L'or n'est pas qu'un métal, c'est un canevas pour l'éternité.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center gap-4 italic group">
                          [ Start Selection ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #d4af37 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
           </div>
        </section>

        {/* 3. ARTIFACTS (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="artifacts" className="py-64 px-12 bg-black relative border-b border-[#d4af37]/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37]/40 mb-8 font-sans">Curated_Artifacts</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-white">
                    Auric <br/> <span className="text-[#d4af37]/5" style={{ WebkitTextStroke: "1px #d4af37" }}>Archives.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right font-sans">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#d4af37]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/20 italic">Time // Anatomy // Bond</p>
              </div>
           </div>

           <div className="flex gap-16 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {ARTIFACTS.map((artifact, i) => (
                 <ArtifactCard key={artifact.id} artifact={artifact} index={i} />
              ))}
           </div>
        </section>

        {/* 4. TECH AUDIT (HUD DATA VIZ) */}
        <section id="metrics" className="py-64 px-12 bg-black relative border-b border-[#d4af37]/10 font-sans">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37]/40 mb-8">Auric_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                       Optical <br/> <span className="opacity-10">Specs.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {AURIC_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-[#d4af37]/10 bg-[#d4af37]/5 hover:border-[#d4af37]/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]/40 mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-white">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/20">
                                <span>{metric.detail}</span>
                                <span className="text-[#d4af37]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#d4af37]"
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
                    <div className="p-12 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-sm relative group overflow-hidden shadow-2xl">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">Forge Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {FORGE_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-[#d4af37]/5 px-2 transition-colors">
                                <span className="text-[#d4af37]/30 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-[#d4af37]/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-[#d4af37]/40 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Forge_Inquiry...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-[#d4af37]/[0.01] pointer-events-none select-none italic z-0">
              AURIC
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-8 font-sans">Auric_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Auric <br/> <span className="opacity-20">Lineage.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16 leading-loose">
                       Notre archive patrimoniale préserve les formules d'alliages secrets et les techniques de forgeage à la main développées sur six générations. Nous continuons d'ingénier l'or comme un véhicule de valeur spatiale éternelle.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12 font-sans">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Alloy</div>
                          <div className="text-4xl font-black italic">SYNTHESIS</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Forge</div>
                          <div className="text-4xl font-black italic">PROTOCOL</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-zinc-100 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Heritage Gold Interior"
                       />
                       <div className="absolute inset-0 bg-[#d4af37]/10 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (TACTICAL ACCORDION) */}
        <section className="py-64 px-12 bg-[#050505] relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-8 font-sans">Private_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-white">Maison <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/20 italic font-sans">Acquisition // Heritage // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4 font-sans">
                 {[
                   { q: "What is your primary design philosophy?", a: "Auric supremacy. We believe that gold is the ultimate canvas for structural and spatial honesty. Every forge path and light audit is a deliberate expression of eternal value." },
                   { q: "How do you handle alloy integrity?", a: "Every alloy synthesis undergoes a multi-pass molecular integrity scan. We operate within 24K native standards to ensure absolute purity for our bespoke artifacts." },
                   { q: "Do you offer custom auric engineering?", a: "Yes. For select private enclaves, we design unique molecular bonds and refraction sequences that push the limits of traditional luxury goldsmithing." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-[#d4af37]/10 bg-[#d4af37]/5 px-10 rounded-sm hover:border-[#d4af37]/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-white">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-[#d4af37]/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-white pt-64 pb-20 px-12 md:px-24 border-t-8 border-[#d4af37]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16 font-sans">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-black">Heritage<span className="text-[#d4af37]/20">_</span>Gold.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-[#d4af37]/40 ml-2">Auric Engineering Maison</span>
                       </div>
                       <p className="text-black/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic font-sans">
                          La maîtrise absolue de la synthèse aurique. Genève // Global Command Center.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-black/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-[#d4af37]/30 hover:text-black transition-all cursor-pointer" />
                             <GemIcon className="w-7 h-7 text-[#d4af37]/30 hover:text-black transition-all cursor-pointer" />
                             <Crown className="w-7 h-7 text-[#d4af37]/30 hover:text-black transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16 font-sans">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] mb-16 border-b border-[#d4af37]/20 pb-4">Artifacts</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-black/30">
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Solar_Chronos
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Lunar_Cuff
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Stellar_Band
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] mb-16 border-b border-[#d4af37]/20 pb-4">Maison</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-black/30">
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Manifesto
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Global_Nodes
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#d4af37]" /> Private_Access
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-black/10 italic text-center font-sans">
                 <div className="flex gap-16">
                    <span>©2026 HERITAGE GOLD SA.</span>
                    <span className="hidden md:inline">//</span>
                    <span>AURIC_SYNTHESIS_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#d4af37]/30">
                    <span>24K_PURE_AURIC_NATIVE</span>
                    <span>GENÈVE_VAULT_PASS</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020202; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
