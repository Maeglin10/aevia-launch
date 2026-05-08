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
  Radar, Orbit, Atom, Search, Cpu, Ghost,
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
  Skull, Scan as ScanIcon
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   GHOST SHELL DATASET (ULTRA DENSITY)
   ========================================================================== */

const VECTORS = [
  {
    id: "vec-01",
    title: "Ingress Scrub",
    desc: "Filtrage neural multi-couche de tout le trafic entrant. Chaque bit est inspecté avant d'atteindre le noyau système via nos stations de nettoyage tactique.",
    status: "ACTIVE",
    load: "12%"
  },
  {
    id: "vec-08",
    title: "Shadow Execution",
    desc: "Exécution de processus critiques dans des enclaves de mémoire éphémère chiffrées. Aucune trace résiduelle n'est laissée après l'exécution.",
    status: "STEALTH",
    load: "44%"
  },
  {
    id: "vec-15",
    title: "Trace Erasure",
    desc: "Surécriture active au niveau de l'octet de toutes les données de session après chaque transaction. Doctrine zéro-empreinte post-opérationnelle.",
    status: "PASS",
    load: "02%"
  }
]

const SYSTEM_METRICS = [
  { label: "Neural Scrubbing", value: "100%", trend: "Pure", detail: "Multi-Layer Filtration" },
  { label: "AES Synthesis", value: "512-bit", trend: "Quantum", detail: "End-to-End Enclave" },
  { label: "Threat Mitigation", value: "Zero", trend: "Stable", detail: "Active Cascade Prot" },
  { label: "Latency Offset", value: "0.1ms", trend: "Instant", detail: "Edge Node Buffer" }
]

const TERMINAL_LOGS = [
  { time: "22:04:12", event: "PACKET_SCRUB", status: "PASS", detail: "Node_Alpha_14" },
  { time: "22:05:32", event: "ENCLAVE_SYNC", status: "DONE", detail: "Memory_Vault_7" },
  { time: "22:08:48", event: "HASH_ROTATE", status: "SYNC", detail: "Protocol_Ghost" }
]

/* ==========================================
   TECHNICAL COMPONENTS (CYBER / HUD)
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

function FallingCodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05)_0%,transparent_70%)]" />
       {[...Array(20)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute text-[8px] font-mono text-[#00ff41] whitespace-nowrap"
             style={{ 
                left: `${i * 5}%`, 
                top: -100,
                writingMode: 'vertical-rl'
             }}
             animate={{ 
                top: ['0%', '100%'],
                opacity: [0, 1, 0]
             }}
             transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
             }}
          >
             {Array(50).fill(0).map(() => Math.round(Math.random())).join('')}
          </motion.div>
       ))}
    </div>
  )
}

function HUD_Cyber() {
   return (
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-[#00ff41]/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-[#00ff41]">Neural_Scan</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-[#00ff41]/20 bg-[#00ff41]/5 backdrop-blur-md rounded-sm">
               <FingerprintIcon className="w-6 h-6 text-[#00ff41]" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm">
               <ScanIcon className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function VectorCard({ vector, index }: { vector: any, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <div className="group relative p-16 border border-white/5 bg-[#050505] hover:bg-white/[0.02] transition-all h-[550px] flex flex-col justify-between overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Terminal className="w-48 h-48 text-[#00ff41]" />
       </div>
       
       <div>
          <div className="flex justify-between items-center mb-12">
             <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00ff41]">{vector.id} // SECURE</div>
             <div className="px-4 py-1 border border-[#00ff41]/30 rounded-full text-[8px] font-black text-[#00ff41] uppercase tracking-widest">
                {vector.status}
             </div>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700 text-white">
             {vector.title}
          </h3>
       </div>

       <div className="relative z-10">
          <p className="text-xs text-[#00ff41]/40 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
             {vector.desc}
          </p>
          <div className="space-y-4">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>Node_Load</span>
                <span className="text-[#00ff41]">{vector.load}</span>
             </div>
             <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                   className="absolute inset-y-0 left-0 bg-[#00ff41]"
                   initial={{ width: 0 }}
                   whileInView={{ width: vector.load }}
                   transition={{ duration: 1.5 }}
                />
             </div>
          </div>
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: GHOST SHELL (CYBER DEFENSE)
   ========================================================================== */

export default function GhostShellPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <div ref={containerRef} className="bg-[#020202] text-[#00ff41] font-mono selection:bg-[#00ff41]/40 selection:text-black min-h-screen overflow-x-hidden">
      
      <FallingCodeBackground />
      <HUD_Cyber />
      
      {/* 1. NAVIGATION (CYBER TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-[#00ff41]/10 bg-black/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Ghost className="w-10 h-10 text-[#00ff41] group-hover:animate-pulse" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic text-white">Ghost<span className="text-[#00ff41]/40">_</span>Shell.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#00ff41]/30 -mt-1 ml-1">Secure Tactical Enclave</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff41]/30">
            <a href="#vectors" className="hover:text-white transition-colors relative group">
               [ Vectors ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00ff41] group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00ff41] group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Doctrine ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00ff41] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-[#00ff41]/10 pr-6">
               <div className="text-[8px] font-black text-[#00ff41] uppercase tracking-widest">Enclave_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic text-white">NOMINAL_01</div>
            </div>
            <button className="px-10 py-5 bg-[#00ff41] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(0,255,65,0.2)] italic">
               Initiate_Access
            </button>
         </div>
      </nav>

      <main>
        {/* 2. NEURAL SCRUBBING (HERO / CYBER STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-[#00ff41]/10">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#00ff41]/30 bg-[#00ff41]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41] mb-16 italic">
                    <Activity className="w-4 h-4 animate-pulse" /> Threat_Level: ZERO // Neural_Sync: NOMINAL
                 </div>
                 <motion.h1 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-white"
                 >
                    <span>Secure the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px #00ff41" }}>Phantom.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-[#00ff41]/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#00ff41]/20 pl-12">
                       Nous sécurisons les enclaves à haute valeur via une doctrine opérationnelle zéro-empreinte et une synthèse cryptographique post-quantique. Discrétion absolue.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#00ff41] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,65,0.3)] flex items-center gap-4 italic group">
                          [ Start Vetting ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Background Grid Accent */}
           <motion.div 
              style={{ scale: gridScale }}
              className="absolute inset-0 z-0 opacity-5 pointer-events-none select-none"
           >
              <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           </motion.div>
        </section>

        {/* 3. VECTORS (DENSE INTERFACE) */}
        <section id="vectors" className="py-64 px-12 bg-black relative border-b border-[#00ff41]/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41] mb-8">System_Vectors</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-white">
                    Ghost <br/> <span className="text-[#00ff41]/10" style={{ WebkitTextStroke: "1px #00ff41" }}>Protocols.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#00ff41]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00ff41]/20 italic">Scrub // Shadow // Erasure</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VECTORS.map((vector, i) => (
                 <Reveal key={vector.id} delay={i * 0.1}>
                    <VectorCard vector={vector} index={i} />
                 </Reveal>
              ))}
           </div>
        </section>

        {/* 4. TECH AUDIT (HUD DATA VIZ) */}
        <section id="metrics" className="py-64 px-12 bg-black relative border-b border-[#00ff41]/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41] mb-8">Operation_Metrics</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                       Kernel <br/> <span className="opacity-10">Specs.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {SYSTEM_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-[#00ff41]/10 bg-[#00ff41]/5 hover:border-[#00ff41]/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#00ff41] mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-white">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#00ff41]/40">
                                <span>{metric.detail}</span>
                                <span className="text-[#00ff41]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#00ff41]"
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
                    <div className="p-12 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-sm relative group overflow-hidden">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">Terminal Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {TERMINAL_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-[#00ff41]/10 pb-2 group/log hover:bg-[#00ff41]/5 px-2 transition-colors">
                                <span className="text-[#00ff41]/30 group-hover/log:text-[#00ff41] transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-[#00ff41]/40 italic">{log.detail}</span>
                                <span className="font-black text-[#00ff41]">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-[#00ff41] animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Packet_Ingress...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 5. DOCTRINE (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41] mb-8">Tactical_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Zero <br/> <span className="opacity-20">Footprint.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Toute action système est vérifiée contre le registre immuable de Ghost Shell. Toute déviation déclenche un protocole de verrouillage immédiat Cascade Protocol.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Enclave</div>
                          <div className="text-4xl font-black italic">POST_Q</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Protocol</div>
                          <div className="text-4xl font-black italic">CASCADE</div>
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
                          alt="Datacenter Enclave"
                       />
                       <div className="absolute inset-0 bg-[#00ff41]/10 mix-blend-overlay" />
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
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41] mb-8">Vetting_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-white">Atlas <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ff41]/20 italic">Access // Research // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is the primary design philosophy?", a: "Performance is our aesthetic. Every bit of data must serve a purpose, and security is the ultimate performance metric. We eliminate the noise to reveal the ghost." },
                   { q: "How do you handle data security?", a: "Every session operates in a memory-only enclave. Post-execution, we perform multi-pass overwrites at the physical byte level to ensure zero trace." },
                   { q: "Is vetting mandatory for access?", a: "Yes. All access requests undergo a multi-layered neural vetting process. We do not dialogue with unverified nodes." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-[#00ff41]/10 bg-[#00ff41]/5 px-10 rounded-sm hover:border-[#00ff41]/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-white">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-[#00ff41]/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-20 px-12 md:px-24 border-t-8 border-[#00ff41]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-white">Ghost<span className="text-[#00ff41]/40">_</span>Shell.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-[#00ff41]/40 ml-2">Secure Tactical Enclave</span>
                       </div>
                       <p className="text-[#00ff41]/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de la synthèse tactique. Doctrine zéro-empreinte. [CLASSIFIÉ].
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-[#00ff41]/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-[#00ff41]/30 hover:text-[#00ff41] transition-all cursor-pointer" />
                             <Terminal className="w-7 h-7 text-[#00ff41]/30 hover:text-[#00ff41] transition-all cursor-pointer" />
                             <ShieldAlert className="w-7 h-7 text-[#00ff41]/30 hover:text-[#00ff41] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00ff41] mb-16 border-b border-[#00ff41]/20 pb-4">Vectors</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-[#00ff41]/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Ingress_Scrub
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Shadow_Exec
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Trace_Erasure
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00ff41] mb-16 border-b border-[#00ff41]/20 pb-4">Enclave</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-[#00ff41]/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Manifesto
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Global_Nodes
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00ff41]" /> Access
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-[#00ff41]/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff41]/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 GHOST SHELL SYSTEMS.</span>
                    <span className="hidden md:inline">//</span>
                    <span>POST_QUANTUM_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#00ff41]/30">
                    <span>UPTIME_100%_GUARANTEED</span>
                    <span>THREAT_LEVEL_ZERO</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020202; }
        ::-webkit-scrollbar-thumb { background: #00ff41; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
