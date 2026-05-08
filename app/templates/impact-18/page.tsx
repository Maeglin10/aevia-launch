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
  Radar, Orbit, Atom, Search, Cpu, Laptop,
  ShieldCheck, Binary, Code2, Globe, Database,
  Gauge, Thermometer, FlaskConical, Sun, Moon,
  Star, Sparkles, CircleDot, ArrowUpRight,
  ArrowDownLeft, Expand, Shrink, MousePointer2,
  HardDrive, Key, Lock, Unlock, Shield, ShieldAlert,
  Server, Network, Wifi, Bluetooth, Radio,
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
  Video, Volume2, WifiOff, Code, Braces
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   FLUID OS DATASET (ULTRA DENSITY)
   ========================================================================== */

const PROTOCOLS = [
  {
    id: "prot-01",
    title: "Mesh Synapse",
    desc: "Connexion de nœuds de données disparates dans un environnement réactif unifié. Chaque point de données devient une extension de l'intelligence système.",
    status: "SYNC",
    load: "84%"
  },
  {
    id: "prot-08",
    title: "Entropy Zero",
    desc: "Réduction agressive du bruit système pour une clarté computationnelle absolue. Nous purifions le flux d'informations pour une performance optimale.",
    status: "READY",
    load: "92%"
  },
  {
    id: "prot-15",
    title: "Fidelity Push",
    desc: "Délivrance de sorties visuelles et de données haute fidélité sur tous les nœuds périphériques. Une intégrité totale de l'interface utilisateur.",
    status: "ACTIVE",
    load: "100%"
  }
]

const SYSTEM_METRICS = [
  { label: "Kernel Load", value: "12%", trend: "Stable", detail: "Core v2.4.0 Verified" },
  { label: "Mesh Synapse", value: "99.9%", trend: "High", detail: "Global Node Sync" },
  { label: "Entropy Level", value: "Zero", trend: "Pure", detail: "Computational Clarity" },
  { label: "Fidelity", value: "8K Native", trend: "Max", detail: "UI Integrity Audit" }
]

const KERNEL_LOGS = [
  { time: "14:12:08", event: "FLUID_INIT", status: "PASS", detail: "Shell_Enclave_01" },
  { time: "14:15:32", event: "MESH_TOPOLOGY", status: "ACTIVE", detail: "Node_Sync_4" },
  { time: "14:22:15", event: "NEURAL_ENCLAVE", status: "READY", detail: "Kernel_Core_V2" }
]

/* ==========================================
   TECHNICAL COMPONENTS (FLUID / HUD)
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

function MeshFlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(77,77,255,0.05)_0%,transparent_70%)]" />
       <svg width="100%" height="100%" className="w-full h-full opacity-30">
          <defs>
             <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#4d4dff" strokeWidth="0.5" />
             </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
       </svg>
       {[...Array(10)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute w-2 h-2 bg-[#4d4dff] rounded-full blur-[2px]"
             style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`
             }}
             animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2]
             }}
             transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity, 
                ease: "easeInOut"
             }}
          />
       ))}
    </div>
  )
}

function HUD_Fluid() {
   return (
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="w-1 h-32 bg-[#4d4dff]/20 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-[#4d4dff] shadow-[0_0_20px_rgba(77,77,255,0.6)]"
                  animate={{ height: ["10%", "90%", "30%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-[#4d4dff]">System_Flow</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-[#4d4dff]/20 bg-[#4d4dff]/5 backdrop-blur-md rounded-sm">
               <Code className="w-6 h-6 text-[#4d4dff]" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm">
               <Braces className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function ProtocolCard({ prot, index }: { prot: any, index: number }) {
  return (
    <div className="group relative p-16 border border-[#4d4dff]/10 bg-[#050508] hover:bg-[#4d4dff]/5 transition-all h-[550px] flex flex-col justify-between overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Braces className="w-48 h-48 text-[#4d4dff]" />
       </div>
       
       <div>
          <div className="flex justify-between items-center mb-12">
             <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#4d4dff]">{prot.id} // SECURE</div>
             <div className="px-4 py-1 border border-[#4d4dff]/30 rounded-full text-[8px] font-black text-[#4d4dff] uppercase tracking-widest">
                {prot.status}
             </div>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700 text-white">
             {prot.title}
          </h3>
       </div>

       <div className="relative z-10">
          <p className="text-xs text-[#e0e0ff]/30 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
             {prot.desc}
          </p>
          <div className="space-y-4">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>Kernel_Affinity</span>
                <span className="text-[#4d4dff]">{prot.load}</span>
             </div>
             <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                   className="absolute inset-y-0 left-0 bg-[#4d4dff]"
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
   MAIN PAGE: FLUID OS (creative software enclaves)
   ========================================================================== */

export default function FluidOSPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const shipScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#020205] text-[#e0e0ff] font-mono selection:bg-[#4d4dff]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <MeshFlowBackground />
      <HUD_Fluid />
      
      {/* 1. NAVIGATION (FLUID TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-[#4d4dff]/10 bg-black/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Activity className="w-10 h-10 text-[#4d4dff] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic text-white">Fluid<span className="text-[#4d4dff]/40">_</span>OS.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#4d4dff]/30 -mt-1 ml-1">Distributed Intelligence Enclave</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-[#4d4dff]/30">
            <a href="#protocols" className="hover:text-white transition-colors relative group">
               [ Protocols ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#4d4dff] group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#4d4dff] group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Manifest ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#4d4dff] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-[#4d4dff]/10 pr-6">
               <div className="text-[8px] font-black text-[#4d4dff] uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic text-white">All_Systems_Nominal</div>
            </div>
            <button className="px-10 py-5 bg-[#4d4dff] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(77,77,255,0.2)] italic">
               Initiate_Shell
            </button>
         </div>
      </nav>

      <main>
        {/* 2. MESH IGNITION (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-[#4d4dff]/10">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#4d4dff]/30 bg-[#4d4dff]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#4d4dff] mb-16 italic">
                    <Braces className="w-4 h-4 animate-pulse" /> System_Status: VERIFIED // CORE_V2.4.0_READY
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: shipScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-white"
                 >
                    <span>Enter the</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px #4d4dff" }}>Mesh.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-[#4d4dff]/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-[#4d4dff]/20 pl-12">
                       Conception de la prochaine ère des enclaves logicielles créatives via une intelligence distribuée et des interfaces haute fidélité. Le futur est unifié.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#4d4dff] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(77,77,255,0.3)] flex items-center gap-4 italic group">
                          [ Request Authorization ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #4d4dff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
           </div>
        </section>

        {/* 3. PROTOCOLS (DENSE GRID INTERFACE) */}
        <section id="protocols" className="py-64 px-12 bg-black relative border-b border-[#4d4dff]/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4d4dff]/40 mb-8">System_Sequence</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-white">
                    Protocol <br/> <span className="text-[#4d4dff]/10" style={{ WebkitTextStroke: "1px #4d4dff" }}>Logic.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#4d4dff]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4d4dff]/20 italic">Mesh // Entropy // Fidelity</p>
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
        <section id="metrics" className="py-64 px-12 bg-black relative border-b border-[#4d4dff]/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4d4dff]/40 mb-8">Mesh_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                       Kernel <br/> <span className="opacity-10">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {SYSTEM_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-[#4d4dff]/10 bg-[#4d4dff]/5 hover:border-[#4d4dff]/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#4d4dff]/40 mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-white">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#4d4dff]/20">
                                <span>{metric.detail}</span>
                                <span className="text-[#4d4dff]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#4d4dff]"
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
                    <div className="p-12 bg-[#4d4dff]/5 border border-[#4d4dff]/20 rounded-sm relative group overflow-hidden shadow-2xl">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">Kernel Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-[#4d4dff] animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {KERNEL_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-[#4d4dff]/5 px-2 transition-colors">
                                <span className="text-[#4d4dff]/30 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-[#4d4dff]/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-[#4d4dff]/40 animate-pulse">
                          <Terminal className="w-4 h-4" /> Awaiting_Kernel_Inquiry...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-[#4d4dff]/[0.01] pointer-events-none select-none italic z-0">
              SHELL
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4d4dff] mb-8">System_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Mesh <br/> <span className="opacity-20">Synapse.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Un environnement de shell unifié pour l'orchestration haute fidélité d'enclaves de données distribuées. Construit pour ceux qui construisent le futur.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Kernel</div>
                          <div className="text-4xl font-black italic">INTEGRITY</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Mesh</div>
                          <div className="text-4xl font-black italic">TOPOLOGY</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-black/5 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Software Enclave Interior"
                       />
                       <div className="absolute inset-0 bg-[#4d4dff]/10 mix-blend-overlay" />
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
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4d4dff] mb-8">Technical_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-white">System <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4d4dff]/20 italic">API // Research // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is the primary design philosophy?", a: "Computational clarity. We believe that a high-performing system should be reflected in its interface. Every protocol and data flow is a deliberate system decision." },
                   { q: "How do you handle data integrity?", a: "Every mesh synapse operates in a memory-only enclave. Post-execution, we perform kernel-level audits to ensure 100% integrity of the system state." },
                   { q: "Do you offer custom API enclaves?", a: "Yes. For bespoke creative workflows, we design unique mesh topologies and protocol sequences that synchronize with the neural load of the developers." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-[#4d4dff]/10 bg-[#4d4dff]/5 px-10 rounded-sm hover:border-[#4d4dff]/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-white">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-[#4d4dff]/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-20 px-12 md:px-24 border-t-8 border-[#4d4dff]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-white">Fluid<span className="text-[#4d4dff]/40">_</span>OS.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-[#4d4dff]/40 ml-2">Distributed Intelligence Enclave</span>
                       </div>
                       <p className="text-[#e0e0ff]/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de l'intelligence distribuée. Global // Mesh.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-[#4d4dff]/30 hover:text-[#4d4dff] transition-all cursor-pointer" />
                             <Cpu className="w-7 h-7 text-[#4d4dff]/30 hover:text-[#4d4dff] transition-all cursor-pointer" />
                             <Braces className="w-7 h-7 text-[#4d4dff]/30 hover:text-[#4d4dff] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#4d4dff] mb-16 border-b border-[#4d4dff]/20 pb-4">Protocols</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> Mesh_Synapse
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> Entropy_Zero
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> Fidelity_Push
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#4d4dff] mb-16 border-b border-[#4d4dff]/20 pb-4">System</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> Kernel_Audit
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> Global_Mesh
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#4d4dff]" /> API_Access
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 FLUID OS SYSTEMS.</span>
                    <span className="hidden md:inline">//</span>
                    <span>DISTRIBUTED_MESH_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#4d4dff]/30">
                    <span>8K_RESOLUTION_NATIVE</span>
                    <span>KERNEL_INTEGRITY_100%</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020205; }
        ::-webkit-scrollbar-thumb { background: #4d4dff; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
