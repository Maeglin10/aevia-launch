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
  Radar, Orbit, Atom, Search, Cpu, Monitor,
  Database, ShieldCheck, Binary, Code2, Globe,
  Waves, Gauge, Thermometer, FlaskConical,
  Sun, Moon, Star, Sparkles, CircleDot,
  ArrowUpRight, ArrowDownLeft, Expand, Shrink,
  MousePointer2, HardDrive, Key, Lock, Unlock,
  Fingerprint as FingerprintIcon, ScanEye, Eye,
  EyeOff, Shield, ShieldAlert, Laptop, Server,
  Network, Wifi, Bluetooth, Radio
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   ARCHIVE STUDIO DATASET (ULTRA DENSITY)
   ========================================================================== */

const SERVICES = [
  {
    id: "sys-01",
    title: "System Solutions",
    desc: "Architecture de systèmes complexes orientée performance. Nous concevons des écosystèmes numériques capables de supporter des charges critiques avec une latence nulle.",
    icon: Server
  },
  {
    id: "ui-08",
    title: "Interfaces of the Future",
    desc: "Design d'expériences immersives et intuitives. Chaque pixel est une décision, chaque interaction est une intention. Le futur est haptique et spatial.",
    icon: Monitor
  },
  {
    id: "lab-15",
    title: "Digital Supremacy",
    desc: "R&D sur les nouvelles frontières de la technologie. Du rendu 8K natif à l'intégration de l'IA générative au cœur des interfaces métiers.",
    icon: Cpu
  }
]

const TECHNICAL_AUDIT = [
  { label: "Uptime", value: "100%", trend: "Guaranteed", detail: "Active Redundancy" },
  { label: "Speed", value: "<0.8s", trend: "Instant", detail: "Global Edge Nodes" },
  { label: "Fidelity", value: "8K Native", trend: "Ultra", detail: "Pixel-Perfect Mesh" },
  { label: "Security", value: "AES-512", trend: "Military", detail: "Post-Quantum Ready" }
]

const SYSTEM_LOGS = [
  { time: "16:22:04", node: "Core_Alpha", task: "Packet_Synthesis", status: "DONE", load: "12%" },
  { time: "16:22:15", node: "Edge_Tokyo", task: "Buffer_Flush", status: "SYNC", load: "44%" },
  { time: "16:22:48", node: "Secure_Vault", task: "Hash_Rotated", status: "PASS", load: "02%" }
]

/* ==========================================
   TECHNICAL COMPONENTS (SPACEMAN / FLUID)
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

function FloatingDataBlocks() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
       {[...Array(8)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute p-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm"
             style={{ 
                top: `${20 + i * 10}%`, 
                left: `${10 + i * 8}%`,
                width: 120 + i * 20
             }}
             animate={{ 
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 5, -5, 0]
             }}
             transition={{ 
                duration: 8 + i, 
                repeat: Infinity, 
                ease: "easeInOut" 
             }}
          >
             <div className="flex justify-between items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[6px] font-black uppercase text-white/40">Node_{i}</span>
             </div>
             <div className="space-y-1">
                <div className="h-[2px] bg-white/5 w-full" />
                <div className="h-[2px] bg-white/5 w-2/3" />
             </div>
          </motion.div>
       ))}
    </div>
  )
}

function HUD_Console() {
   return (
      <div className="fixed top-32 left-12 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-indigo-500/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-indigo-500">System_Health</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md">
               <Cpu className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md">
               <Terminal className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

/* ==========================================================================
   MAIN PAGE: ARCHIVE STUDIO (DIGITAL SUPREMACY)
   ========================================================================== */

export default function ArchiveStudioPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="bg-[#020205] text-[#f0f0f0] font-sans selection:bg-indigo-500/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <FloatingDataBlocks />
      <HUD_Console />
      
      {/* 1. NAVIGATION (STUDIO STYLE) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
         <div className="flex flex-col group cursor-pointer">
            <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none italic group-hover:text-indigo-500 transition-colors">Archive<span className="text-white/20">//</span>Studio</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/20 -mt-1 ml-1">Digital Supremacy Laboratory</span>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#services" className="hover:text-white transition-colors relative group">
               [ Capabilities ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
            <a href="#audit" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Manifesto ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-indigo-500 uppercase">Core_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest">v1.0.4 Optimized</div>
            </div>
            <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] italic">
               Initiate_Project
            </button>
         </div>
      </nav>

      <main>
        {/* 2. DIGITAL SUPREMACY (HERO / SPACEMAN STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-white/5">
           <div className="relative z-10 w-full max-w-7xl">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-indigo-500/30 bg-indigo-500/5 text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-16 italic">
                    <Activity className="w-4 h-4" /> Performance_Primary_Aesthetic // Secure_Node_Active
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Digital</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Supremacy.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-indigo-500/20 pl-12">
                       Nous définissons l'esthétique de la nouvelle ère. Notre laboratoire créatif fusionne brutalité brute et premium numérique pour délivrer les interfaces du futur.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(99,102,241,0.4)] flex items-center gap-4 italic group">
                          [ Start Journey ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating HUD Background */}
           <div className="absolute top-0 right-0 w-[60vw] h-[60vw] opacity-10 pointer-events-none select-none z-0">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-indigo-500 stroke-[0.1] fill-none">
                 <circle cx="50" cy="50" r="48" strokeDasharray="1 1" />
                 <path d="M 50 2 L 50 98 M 2 50 L 98 50" strokeDasharray="2 2" />
                 <motion.circle 
                    cx="50" cy="50" r="30" strokeWidth="0.5" 
                    animate={{ r: [30, 35, 30], opacity: [0.2, 0.5, 0.2] }} 
                    transition={{ duration: 5, repeat: Infinity }}
                 />
              </svg>
           </div>
        </section>

        {/* 3. CAPABILITIES (DENSE GRID INTERFACE) */}
        <section id="services" className="py-64 px-12 bg-[#050508] relative overflow-hidden">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Service_Matrix</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    The <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Solutions.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-indigo-500" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Architectures // Interfaces // R&D</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-white/5">
              {SERVICES.map((s, i) => (
                 <Reveal key={s.id} delay={i * 0.1}>
                    <div className="group relative p-16 border-r border-b border-white/5 hover:bg-white/[0.02] transition-all h-[600px] flex flex-col justify-between overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                          <s.icon className="w-48 h-48" />
                       </div>
                       
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-12">{s.id} // ACTIVE</div>
                          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700">
                             {s.title}
                          </h3>
                       </div>

                       <div className="relative z-10">
                          <p className="text-xs text-white/40 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
                             {s.desc}
                          </p>
                          <div className="flex gap-4">
                             <div className="w-2 h-2 rounded-full bg-indigo-500" />
                             <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-indigo-500/40 transition-colors" />
                             <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-indigo-500/40 transition-colors" />
                          </div>
                       </div>
                    </div>
                 </Reveal>
              ))}
           </div>
        </section>

        {/* 4. TECHNICAL AUDIT (HUD DATA VIZ) */}
        <section id="audit" className="py-64 px-12 border-b border-white/5 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-8">Performance_Metrics</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                       System <br/> <span className="opacity-20">Audit.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {TECHNICAL_AUDIT.map((audit, i) => (
                          <div key={i} className="p-12 border-2 border-black/5 bg-black/[0.02] hover:border-indigo-600/30 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">{audit.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left">{audit.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">
                                <span>{audit.detail}</span>
                                <span className="text-indigo-600">{audit.trend}</span>
                             </div>
                             <div className="mt-8 h-1 bg-black/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-indigo-600"
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
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic">Core Logs</h4>
                          <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/50" />
                             <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {SYSTEM_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/5 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-indigo-500 font-black">{log.node}</span>
                                <span className="text-white/40 italic">{log.task}</span>
                                <span className="font-black">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-indigo-500 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Signal_Packet...
                       </div>
                    </div>
                 </Reveal>
                 <Reveal delay={0.5}>
                    <p className="text-sm text-black/40 font-bold leading-relaxed uppercase tracking-[0.2em] italic">
                       "Le code est notre pinceau, la performance est notre canevas. Nous construisons des architectures monolithiques capables de résister à l'épreuve du temps numérique."
                    </p>
                 </Reveal>
              </div>
           </div>

           {/* Background Large Text Accent */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-black/[0.02] pointer-events-none select-none italic z-0">
              CORE
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Studio_Manifesto</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Brutal <br/> <span className="opacity-10">Premium.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-white/30 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Nous croyons en une esthétique sans compromis. Nos designs sont brutaux dans leur efficacité mais premium dans leur exécution. Pas de superflu, seulement l'essentiel élevé au rang d'art.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Established</div>
                          <div className="text-4xl font-black italic">MMXXIV</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Node</div>
                          <div className="text-4xl font-black italic">01_CH</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-white/5">
                       <img 
                          src="https://images.unsplash.com/photo-1518005020250-68a377a747e9?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Studio Interior"
                       />
                       <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center animate-spin-slow">
                             <Maximize2 className="w-8 h-8 text-white" />
                          </div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (STUDIO ACCORDION) */}
        <section className="py-64 px-12 bg-[#0a0a0a]">
           <div className="max-w-4xl mx-auto">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8">Secure_Inquiry</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8">Lab <span className="opacity-10">Atlas.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Process // Research // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is your primary design philosophy?", a: "Performance is our aesthetic. We believe that a high-performing system is inherently beautiful. We strip away the unnecessary to reveal the core strength." },
                   { q: "How do you handle data security?", a: "Every node in our network is encrypted using AES-512 military-grade protocols. We operate a zero-trust architecture for all client R&D data." },
                   { q: "Do you offer post-deployment audits?", a: "Yes. Every system we deploy is monitored 24/7. We provide quarterly technical audits to ensure peak performance and security fidelity." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-10 rounded-sm hover:border-indigo-500/30 transition-all">
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
        <footer className="bg-black pt-64 pb-16 px-12 md:px-24 border-t-8 border-indigo-600">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic">Archive.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-indigo-500 ml-2">Digital Supremacy Laboratory</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de la synthèse numérique. Zurich // Global Nodes.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                             <Terminal className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                             <Cpu className="w-7 h-7 text-white/20 hover:text-indigo-500 transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-16 border-b border-indigo-500/20 pb-4">Capabilities</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> System_Solutions
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> UI_Supremacy
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> R&D_Lab
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-16 border-b border-indigo-500/20 pb-4">Studio</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Manifesto
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Global_Nodes
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-indigo-500" /> Contact
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 ARCHIVE STUDIO LABS.</span>
                    <span className="hidden md:inline">//</span>
                    <span>CORE_OPTIMIZED_V1.0.4</span>
                 </div>
                 <div className="flex gap-16 font-mono text-indigo-500/30">
                    <span>UPTIME_100%_GUARANTEED</span>
                    <span>AES_512_ENCRYPTED</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020205; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
