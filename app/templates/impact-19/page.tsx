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
  Radar, Orbit, Atom, Search, Cpu, TrendingUp,
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
  Skull, Scan as ScanIcon, PieChart, ArrowRightCircle,
  Coins, Landmark, Wallet, Briefcase as BriefcaseIcon,
  Presentation, BarChart, LineChart, CandlestickChart
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   AEVIA CAPITAL DATASET (ULTRA DENSITY)
   ========================================================================== */

const VENTURES = [
  {
    id: "ven-01",
    name: "FinTech Core",
    sector: "Algorithmic Finance",
    alpha: "14.8%",
    capital: "$450M",
    desc: "Synthèse de modèles prédictifs haute fréquence et d'intuition d'opérateurs chevronnés. La référence du trading algorithmique.",
    img: "https://images.unsplash.com/photo-1611974714851-eb607737421c?w=1600&q=80",
    color: "#1a1a1a"
  },
  {
    id: "ven-08",
    name: "BioGen Enclave",
    sector: "Bio-Engineering",
    alpha: "22.4%",
    capital: "$820M",
    desc: "Laboratoire de recherche en synthèse génétique et longévité. Nous finançons les frontières de la biologie computationnelle.",
    img: "https://images.unsplash.com/photo-1532187875605-1ef6c237f1f0?w=1600&q=80",
    color: "#f8f9fa"
  },
  {
    id: "ven-15",
    name: "NeoTransit",
    sector: "Orbital Logistics",
    alpha: "18.2%",
    capital: "$1.2B",
    desc: "Solutions de transit orbital et logistique spatiale profonde. Redéfinir les chaînes d'approvisionnement interplanétaires.",
    img: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1600&q=80",
    color: "#000000"
  }
]

const ALPHA_METRICS = [
  { label: "Venture Alpha", value: "8K Native", trend: "Max", detail: "Algorithmic Precision" },
  { label: "Risk Insulation", value: "Zero Exp", trend: "Stable", detail: "High-Fidelity Hedging" },
  { label: "Strategic Depth", value: "Infinite", trend: "High", detail: "Network Synergy Enclave" },
  { label: "Equity Integrity", value: "100%", trend: "Pure", detail: "Ledger-Verified Assets" }
]

const ALPHA_LOGS = [
  { time: "09:12:04", event: "ALGO_SYNTH", status: "PASS", detail: "Core_Model_X" },
  { time: "09:15:32", event: "CAPITAL_DEPLOY", status: "DONE", detail: "Venture_Enclave_2" },
  { time: "09:22:15", event: "ALPHA_VERIFIED", status: "SYNC", detail: "Equity_Ledger_V4" }
]

/* ==========================================
   TECHNICAL COMPONENTS (ALPHA / HUD)
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

function CapitalFlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,26,26,0.05)_0%,transparent_70%)]" />
       <svg width="100%" height="100%" className="w-full h-full opacity-30">
          <defs>
             <pattern id="financial-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
             </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#financial-grid)" />
       </svg>
       {[...Array(8)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute h-px bg-black/10 w-full"
             style={{ top: `${i * 12.5}%` }}
             animate={{ opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 4 + i, repeat: Infinity }}
          />
       ))}
    </div>
  )
}

function HUD_Alpha() {
   return (
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-end pointer-events-none">
         <div className="flex flex-col gap-4 items-end">
            <div className="w-1 h-32 bg-black/10 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-black shadow-[0_0_20px_rgba(26,26,26,0.6)]"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-black">Alpha_Scan</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-black/10 bg-white/40 backdrop-blur-md rounded-full">
               <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div className="p-4 border border-black/5 bg-white/20 backdrop-blur-md rounded-full">
               <LineChart className="w-6 h-6 text-black/40" />
            </div>
         </div>
      </div>
   )
}

function VentureCard({ venture, index }: { venture: any, index: number }) {
  return (
    <div className="min-w-[85vw] md:min-w-[65vw] lg:min-w-[45vw] h-[70vh] relative group overflow-hidden border border-black/5 bg-white snap-center">
       <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
       <motion.img 
          src={venture.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100 opacity-20 group-hover:opacity-100"
          alt={venture.name}
       />
       
       <div className="absolute top-12 left-12 z-20">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-black/40 mb-4">{venture.id} // PORTFOLIO</div>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic group-hover:translate-x-8 transition-transform duration-1000">
             {venture.name}
          </h3>
       </div>

       <div className="absolute bottom-12 left-12 right-12 z-20">
          <p className="text-sm md:text-base text-black/60 leading-relaxed font-light uppercase italic mb-12 max-w-lg tracking-widest leading-loose">
             {venture.desc}
          </p>
          <div className="flex justify-between items-end border-t border-black/10 pt-12">
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <div className="text-[8px] text-black/20 uppercase mb-2">Alpha Yield</div>
                   <div className="text-lg font-black italic">{venture.alpha}</div>
                </div>
                <div>
                   <div className="text-[8px] text-black/20 uppercase mb-2">Capital Pool</div>
                   <div className="text-lg font-black italic">{venture.capital}</div>
                </div>
             </div>
             <button className="px-12 py-6 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all italic flex items-center gap-4">
                View Ledger <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
       
       <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[30vw] font-black text-black/[0.02] pointer-events-none select-none italic translate-x-1/2">
          {index + 1}
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: AEVIA CAPITAL (STRATEGIC ALPHA)
   ========================================================================== */

export default function AeviaCapitalPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#f8f9fa] text-black font-sans selection:bg-black selection:text-white min-h-screen overflow-x-hidden">
      
      <CapitalFlowBackground />
      <HUD_Alpha />
      
      {/* 1. NAVIGATION (AEVIA TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-black/10 bg-white/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <TrendingUp className="w-10 h-10 text-black group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Aevia<span className="text-black/20">_</span>Capital.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-black/30 -mt-1 ml-1">Strategic Alpha Agency</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
            <a href="#ventures" className="hover:text-black transition-colors relative group">
               [ Ventures ]
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
               <div className="text-[10px] font-bold uppercase tracking-widest italic">Alpha_Verified</div>
            </div>
            <button className="px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_0_40px_rgba(0,0,0,0.1)] italic">
               Initiate_Access
            </button>
         </div>
      </nav>

      <main>
        {/* 2. ALPHA IGNITION (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-black/5">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-black/30 bg-black/5 text-[10px] font-black uppercase tracking-[0.5em] text-black mb-16 italic">
                    <PieChart className="w-4 h-4 animate-pulse" /> Alpha_Status: OPTIMIZED // EQUITY_SYNC_PASS
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: textScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-black"
                 >
                    <span>Secure the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px black" }}>Alpha.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-black/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-black/20 pl-12">
                       Sécuriser le futur des entreprises à forte croissance via une synthèse algorithmique de l'alpha et une profondeur stratégique d'opérateurs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_0_50px_rgba(0,0,0,0.2)] flex items-center gap-4 italic group">
                          [ Start Vetting ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
           </div>
        </section>

        {/* 3. VENTURES (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="ventures" className="py-64 px-12 bg-white relative border-b border-black/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Portfolio_Manifest</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-black">
                    Venture <br/> <span className="text-black/5" style={{ WebkitTextStroke: "1px black" }}>Archives.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-black/10" />
                    <div className="w-16 h-[1px] bg-black" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 italic">FinTech // BioGen // Space</p>
              </div>
           </div>

           <div className="flex gap-16 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {VENTURES.map((venture, i) => (
                 <VentureCard key={venture.id} venture={venture} index={i} />
              ))}
           </div>
        </section>

        {/* 4. TECH AUDIT (HUD DATA VIZ) */}
        <section id="metrics" className="py-64 px-12 bg-white relative border-b border-black/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Algorithmic_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-black">
                       Alpha <br/> <span className="opacity-10">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {ALPHA_METRICS.map((metric, i) => (
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
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic">Alpha Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {ALPHA_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-white/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-white/40 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Alpha_Sync...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-black/[0.01] pointer-events-none select-none italic z-0">
              EQUITY
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-black text-white relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-8">Alpha_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic text-white">
                       Strategic <br/> <span className="opacity-20">Alpha.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-white/40 leading-relaxed uppercase tracking-[0.1em] mb-16 leading-loose">
                       Notre portail stratégique offre aux partenaires une visibilité en temps réel sur la performance des entreprises, le déploiement de capital et l'alpha des marchés émergents.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Equity</div>
                          <div className="text-4xl font-black italic">LEDGER_V4</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Risk</div>
                          <div className="text-4xl font-black italic">INSULATION</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-zinc-900 group overflow-hidden border-[20px] border-zinc-800 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Aevia Capital Interior"
                       />
                       <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (TACTICAL ACCORDION) */}
        <section className="py-64 px-12 bg-[#f5f5f5] relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-8">Technical_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-black">Venture <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 italic">Selection // Alpha // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is your primary selection philosophy?", a: "Algorithmic alpha synthesis. We believe that seasoned operator intuition should be synchronized with high-fidelity predictive models for ultimate performance." },
                   { q: "How do you handle risk insulation?", a: "Every venture enclave undergoes a multi-pass risk audit. We operate within high-fidelity hedging standards to ensure absolute capital stability across cycles." },
                   { q: "Do you offer bespoke strategic advisory?", a: "Yes. For select venture partners, we design unique alpha sequences and capital orchestration paths that push the limits of traditional private equity." }
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
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-black">Aevia<span className="text-black/20">_</span>Capital.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-black/40 ml-2">Strategic Alpha Agency</span>
                       </div>
                       <p className="text-black/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de l'alpha financier. Singapour // Global Command Center.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-black/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                             <TrendingUp className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                             <Coins className="w-7 h-7 text-black/30 hover:text-black transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-black mb-16 border-b border-black/20 pb-4">Ventures</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-black/30">
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> FinTech_Core
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> BioGen_Enclave
                          </li>
                          <li className="hover:text-black cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-black" /> NeoTransit_Orbital
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-black mb-16 border-b border-black/20 pb-4">Agency</h4>
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
                    <span>©2026 AEVIA CAPITAL GROUP.</span>
                    <span className="hidden md:inline">//</span>
                    <span>ALGORITHMIC_ALPHA_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-black/30">
                    <span>8K_RESOLUTION_ALPHA</span>
                    <span>100%_EQUITY_INTEGRITY</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #f8f9fa; }
        ::-webkit-scrollbar-thumb { background: #000000; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
