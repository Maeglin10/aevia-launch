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
  Radar, Orbit, Atom, Search, Cpu, Sun,
  ShieldCheck, Binary, Code2, Globe, Database,
  Gauge, Thermometer, FlaskConical, Moon,
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
  Video, Volume2, WifiOff
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   LUMINA ARCHIVE DATASET (ULTRA DENSITY)
   ========================================================================== */

const SEQUENCE = [
  {
    id: "seq-01",
    title: "Photon Mapping",
    desc: "Simulation haute densité de l'interaction de la lumière avec les particules atmosphériques. Nous cartographions chaque trajectoire photonique pour une fidélité absolue.",
    status: "SYNC",
    intensity: "88%"
  },
  {
    id: "seq-08",
    title: "Structural Audit",
    desc: "Analyse de la géométrie architecturale pour optimiser les rebonds lumineux et les enclaves d'ombre. La lumière devient une extension de la structure.",
    status: "READY",
    intensity: "94%"
  },
  {
    id: "seq-15",
    title: "Emission Control",
    desc: "Calibration de précision des matrices laser et LED pour une réponse à latence nulle. Un contrôle total sur le spectre d'émission visible et invisible.",
    status: "ACTIVE",
    intensity: "100%"
  }
]

const ATMOSPHERIC_METRICS = [
  { label: "Photon Density", value: "8K Native", trend: "Max", detail: "Atmospheric Saturation" },
  { label: "Retinal Integrity", value: "99.8%", trend: "Pure", detail: "Non-Ionizing Emission" },
  { label: "Spatial Dopamine", value: "Optimal", trend: "High", detail: "Neural Response Sync" },
  { label: "Spectral Shift", value: "Δ 0.02", trend: "Stable", detail: "Color Accuracy Range" }
]

const LIGHT_LOGS = [
  { time: "01:22:04", event: "LIGHT_SYNTH", status: "PASS", detail: "Matrix_Tokyo_G7" },
  { time: "01:25:32", event: "PHOTON_BUFFER", status: "DONE", detail: "Emission_Array_2" },
  { time: "01:28:48", event: "SPECTRAL_SHIFT", status: "SYNC", detail: "Lumina_Core_V4" }
]

/* ==========================================
   TECHNICAL COMPONENTS (PHOTON / HUD)
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

function PhotonFlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20 select-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
       {[...Array(15)].map((_, i) => (
          <motion.div 
             key={i}
             className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
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
                duration: 4 + Math.random() * 6, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
             }}
          />
       ))}
    </div>
  )
}

function HUD_Optics() {
   return (
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-end pointer-events-none">
         <div className="flex flex-col gap-4 items-end">
            <div className="w-1 h-32 bg-white/10 relative">
               <motion.div 
                  className="absolute top-0 left-0 w-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-white">Neural_Optics</span>
         </div>
         <div className="flex flex-col gap-6">
            <div className="p-4 border border-white/20 bg-white/5 backdrop-blur-md rounded-full">
               <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-full">
               <ScanIcon className="w-6 h-6 text-white/40" />
            </div>
         </div>
      </div>
   )
}

function SequenceCard({ seq, index }: { seq: any, index: number }) {
  return (
    <div className="group relative p-16 border border-white/5 bg-[#050505] hover:bg-white/[0.02] transition-all h-[550px] flex flex-col justify-between overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Aperture className="w-48 h-48 text-white" />
       </div>
       
       <div>
          <div className="flex justify-between items-center mb-12">
             <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">{seq.id} // CALIBRATED</div>
             <div className="px-4 py-1 border border-white/30 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                {seq.status}
             </div>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-8 group-hover:translate-x-4 transition-transform duration-700 text-white">
             {seq.title}
          </h3>
       </div>

       <div className="relative z-10">
          <p className="text-xs text-white/30 leading-relaxed font-medium uppercase italic mb-12 h-24 tracking-widest leading-loose">
             {seq.desc}
          </p>
          <div className="space-y-4">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>Emission_Intensity</span>
                <span className="text-white">{seq.intensity}</span>
             </div>
             <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                   className="absolute inset-y-0 left-0 bg-white"
                   initial={{ width: 0 }}
                   whileInView={{ width: seq.intensity }}
                   transition={{ duration: 1.5 }}
                />
             </div>
          </div>
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: LUMINA ARCHIVE (ATMOSPHERIC INTELLIGENCE)
   ========================================================================== */

export default function LuminaArchivePremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const shipScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#020202] text-white font-sans selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
      
      <PhotonFlowBackground />
      <HUD_Optics />
      
      {/* 1. NAVIGATION (LUMINA TACTICAL) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-10 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <Sun className="w-10 h-10 text-white group-hover:rotate-90 transition-transform duration-700" />
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Lumina<span className="text-white/20">_</span>Archive.</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/30 -mt-1 ml-1">Atmospheric Intelligence Group</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#sequence" className="hover:text-white transition-colors relative group">
               [ Sequence ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all" />
            </a>
            <a href="#metrics" className="hover:text-white transition-colors relative group">
               [ Tech_Audit ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all" />
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
               [ Manifesto ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Global_Status</div>
               <div className="text-[10px] font-bold uppercase tracking-widest italic">All_Arrays_Online</div>
            </div>
            <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/80 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] italic">
               Initiate_Dialogue
            </button>
         </div>
      </nav>

      <main>
        {/* 2. ATMOSPHERIC SYNTHESIS (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden border-b border-white/5">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-white/30 bg-white/5 text-[10px] font-black uppercase tracking-[0.5em] text-white mb-16 italic">
                    <Activity className="w-4 h-4 animate-pulse" /> Photon_Status: OPTIMIZED // RETINAL_SYNC_PASS
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: shipScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col text-white"
                 >
                    <span>Command</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>The Light.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-[0.15em] border-l-2 border-white/20 pl-12">
                       Ingénierie du futur de l'intelligence atmosphérique via une synthèse photonique haute fidélité et une optique neurale. La lumière est notre média, l'espace notre canevas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/80 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center gap-4 italic group">
                          [ Start Synthesis ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Background Accents */}
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
           </div>
        </section>

        {/* 3. SEQUENCE (DENSE GRID INTERFACE) */}
        <section id="sequence" className="py-64 px-12 bg-black relative border-b border-white/10">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">Emission_Sequence</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic text-white">
                    Light <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Archives.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-white" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Photon // Mapping // Audit</p>
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
        <section id="metrics" className="py-64 px-12 bg-black relative border-b border-white/10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center relative z-10">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">Spectral_Data</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                       Optical <br/> <span className="opacity-10">Stats.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {ATMOSPHERIC_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-white/10 bg-white/5 hover:border-white/50 transition-all group relative overflow-hidden">
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left text-white">{metric.value}</div>
                             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
                                <span>{metric.detail}</span>
                                <span className="text-white">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-[2px] bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-white"
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
                    <div className="p-12 bg-white/5 border border-white/20 rounded-sm relative group overflow-hidden">
                       <div className="flex justify-between items-center mb-12">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">Light Logs</h4>
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                       </div>
                       <div className="space-y-6 font-mono text-[10px]">
                          {LIGHT_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/10 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-white font-black">{log.event}</span>
                                <span className="text-white/40 italic">{log.detail}</span>
                                <span className="font-black text-white">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase text-white/40 animate-pulse">
                          <Aperture className="w-4 h-4" /> Awaiting_Array_Emission...
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>

           {/* Background Overlay Large Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.01] pointer-events-none select-none italic z-0">
              PHOTON
           </div>
        </section>

        {/* 5. MANIFESTO (EDITORIAL LAYOUT) */}
        <section id="about" className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black mb-8">Optical_Doctrine</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Neural <br/> <span className="opacity-20">Optics.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Nos recherches explorent la réponse biologique à la luminosité contrôlée. Nous utilisons des émissions photoniques haute fidélité pour remodeler la perception spatiale psychologique.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Retinal</div>
                          <div className="text-4xl font-black italic">INTEGRITY</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20 uppercase tracking-widest">Spatial</div>
                          <div className="text-4xl font-black italic">DOPAMINE</div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-video bg-black group overflow-hidden border-[20px] border-black/5 shadow-2xl">
                       <img 
                          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Optical Lab"
                       />
                       <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (ARCHIVE ACCORDION) */}
        <section className="py-64 px-12 bg-black relative overflow-hidden">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">Technical_Briefing</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8 text-white">Lumina <span className="opacity-10">Vault.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Acquisition // Research // Deployment</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is the primary design philosophy?", a: "Performance is our aesthetic. We believe that light is the most powerful tool for spatial manipulation. Every photon emission is a deliberate architectural decision." },
                   { q: "How do you handle retinal safety?", a: "Every array undergoes a multi-layered retinal integrity audit. We operate within non-ionizing emission standards to ensure absolute safety for biological observers." },
                   { q: "Do you offer custom emission arrays?", a: "Yes. For bespoke architectural enclaves, we design unique spectral profiles and emission patterns that synchronize with the neural response of the occupants." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/5 px-10 rounded-sm hover:border-white/40 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left text-white">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] font-medium text-white/40 tracking-[0.1em] uppercase italic leading-loose pb-12">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-20 px-12 md:px-24 border-t-8 border-white">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-white">Lumina<span className="text-white/20">_</span>Archive.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-white/40 ml-2">Atmospheric Intelligence Group</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de la synthèse photonique. Tokyo // Global Command Center.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/30 hover:text-white transition-all cursor-pointer" />
                             <Sun className="w-7 h-7 text-white/30 hover:text-white transition-all cursor-pointer" />
                             <Aperture className="w-7 h-7 text-white/30 hover:text-white transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white mb-16 border-b border-white/20 pb-4">Sequence</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Photon_Mapping
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Structural_Audit
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Emission_Control
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white mb-16 border-b border-white/20 pb-4">Archive</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Manifesto
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Global_Nodes
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" /> Contact
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 LUMINA ARCHIVE GROUP.</span>
                    <span className="hidden md:inline">//</span>
                    <span>PHOTON_SYNTHESIS_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-white/30">
                    <span>RETINAL_INTEGRITY_99.8%</span>
                    <span>LATENCY_ZERO_EMISSION</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #020202; }
        ::-webkit-scrollbar-thumb { background: #ffffff; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
