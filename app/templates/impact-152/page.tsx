"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView, 
  useSpring 
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Cpu, Zap, Radio, Activity, 
  Terminal, Shield, Sword, Target,
  PlayCircle, MousePointer2, Flame,
  Ticket, Box, Database, Layers,
  Frame, Eye, Lock, Crosshair,
  Settings, Power, Info, AlertTriangle,
  ChevronRight, ArrowRight, Share2,
  Maximize2, Download, ExternalLink,
  Archive, Hash, Wifi, BarChart3,
  Microscope, Fingerprint, Scan, Brain
} from "lucide-react"

/* ==========================================================================
   NEURAL FOUNDRY DATA MANIFEST (ULTRA DENSITY)
   ========================================================================== */

const HARDWARE_COMPONENTS = [
  {
    id: "unit-x1",
    name: "Neural Core Alpha",
    type: "Processor",
    specs: { cycles: "14.2 PFLOPS", temp: "22°C", power: "1.2kW" },
    desc: "Noyau de traitement synaptique à latence zéro pour IA de niveau 5.",
    status: "Optimal"
  },
  {
    id: "arm-v4",
    name: "Kinetic Actuator",
    type: "Motorics",
    specs: { torque: "450Nm", precision: "0.001mm", weight: "4.2kg" },
    desc: "Actionneur haute précision pour manipulation de composants nanométriques.",
    status: "Active"
  },
  {
    id: "sen-eye",
    name: "Optic Array v.9",
    type: "Sensing",
    specs: { res: "128K", spectrum: "Full-Band", fps: "10,000" },
    desc: "Capteur visuel multi-spectral avec reconnaissance d'intention intégrée.",
    status: "Standby"
  }
]

const PROTOCOLS = [
  { id: "P-01", title: "Asimov Integrity", status: "Enabled", level: "Lvl 5" },
  { id: "P-04", title: "Neural Drift Limiter", status: "Active", level: "Lvl 9" },
  { id: "P-09", title: "Quantum Encryption", status: "Shielded", level: "Max" }
]

const SYSTEM_LOGS = [
  "[14:02:44] NEURAL_LINK: ESTABLISHED",
  "[14:02:46] CALIBRATION: COMPLETE",
  "[14:02:49] SYNC_INDEX: 99.98%",
  "[14:02:52] TARGET_DETECTED: SITE_VISITOR_402"
]

/* ==========================================================================
   TECHNICAL HUD COMPONENTS
   ========================================================================== */

function Reveal({ children, delay = 0, y = 30, x = 0 }: { children: React.ReactNode, delay?: number, y?: number, x?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function GridLine({ vertical = false, position = "50%" }: { vertical?: boolean, position?: string }) {
  return (
    <div 
      className={`absolute bg-white/5 pointer-events-none ${vertical ? "w-[1px] top-0 bottom-0" : "h-[1px] left-0 right-0"}`}
      style={{ [vertical ? "left" : "top"]: position }}
    />
  )
}

function ScanningLine() {
  return (
    <motion.div
      animate={{ y: ["0%", "100%", "0%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 right-0 h-[2px] bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20 pointer-events-none"
    />
  )
}

/* ==========================================================================
   THE NEURAL FOUNDRY - MAIN INTERFACE
   ========================================================================== */

export default function NeuralFoundryPremium() {
  const [activeLog, setActiveLog] = useState(0)
  const [isPoweringUp, setIsPoweringUp] = useState(true)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // HUD Parallax
  const hudY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2])

  useEffect(() => {
    const timer = setTimeout(() => setIsPoweringUp(false), 2000)
    const interval = setInterval(() => {
      setActiveLog(prev => (prev + 1) % SYSTEM_LOGS.length)
    }, 3000)
    return () => { clearTimeout(timer); clearInterval(interval); }
  }, [])

  return (
    <div ref={containerRef} className="bg-[#050507] text-[#e0e0e0] font-mono selection:bg-cyan-500/30 selection:text-white min-h-screen overflow-x-hidden">
      
      {/* HUD OVERLAY ELEMENTS */}
      <HUD_Overlay activeLog={activeLog} />

      {/* ==========================================
          1. INITIALIZATION (HERO)
          ========================================== */}
      <section className="relative h-screen flex flex-col justify-center items-center px-8 md:px-24 overflow-hidden pt-20">
        <ScanningLine />
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0 flex items-center justify-center">
           <div className="w-[80vw] h-[80vw] border border-white/5 rounded-full animate-spin-slow opacity-20" />
           <div className="absolute w-[60vw] h-[60vw] border border-white/5 rounded-full animate-reverse-spin opacity-10" />
        </motion.div>

        <div className="relative z-10 text-center max-w-6xl">
           <Reveal>
              <div className="inline-flex items-center gap-4 px-4 py-1 border border-cyan-400/30 bg-cyan-400/5 text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-400 mb-12">
                 <Scan className="w-3 h-3" /> System_Boot: v.9.4.0
              </div>
              <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.75] italic">
                Neural <br/> <span className="text-white/5 italic">Foundry.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm md:text-base text-white/30 leading-relaxed uppercase tracking-widest font-light mb-16">
                 Ingénierie neuronale de nouvelle génération. Nous forgeons l'intelligence synthétique qui définira le prochain siècle de l'évolution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                 <button className="px-12 py-5 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] flex items-center gap-3">
                    <Power className="w-4 h-4" /> Initialize Core
                 </button>
                 <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-3">
                    <Database className="w-4 h-4" /> Access Archives
                 </button>
              </div>
           </Reveal>
        </div>

        {/* BOTTOM HUD DATA */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-8">
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                 <div className="w-8 h-px bg-white/10" />
                 Location: Sector_7G_SubLevel
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                 <div className="w-8 h-px bg-white/10" />
                 Coord: 45.2891, -122.6762
              </div>
           </div>
           <div className="text-right flex flex-col items-end gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-cyan-400">Telemetry_Stream</span>
              <div className="flex gap-2 h-8 items-end">
                 {[...Array(12)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-cyan-400/20"
                   />
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ==========================================
          2. HARDWARE REPOSITORY (DENSE DATA)
          ========================================== */}
      <section className="py-60 bg-[#08080a] relative border-y border-white/5">
         <div className="max-w-[1600px] mx-auto px-8 md:px-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-12">
               <Reveal>
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-400 block mb-6 italic underline underline-offset-8">Hardware // Inventory</span>
                  <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">Modules.</h2>
               </Reveal>
               <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-4 italic">Storage // Unit_Registry</span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">L'Architecture du Matériel</p>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
               {HARDWARE_COMPONENTS.map((comp, i) => (
                 <Reveal key={comp.id} delay={i * 0.1}>
                    <div className="bg-[#050507] p-16 flex flex-col h-full hover:bg-white/5 transition-all group cursor-crosshair">
                       <div className="flex justify-between items-start mb-16">
                          <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-cyan-400 transition-all">
                             <Cpu className="w-6 h-6 text-cyan-400 group-hover:text-black" />
                          </div>
                          <span className="text-[10px] font-black text-white/20 group-hover:text-cyan-400 transition-colors">{comp.id}</span>
                       </div>
                       
                       <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">{comp.name}</h3>
                       <div className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest mb-8">{comp.type}</div>
                       <p className="text-sm font-light text-white/40 leading-relaxed uppercase tracking-widest italic mb-12">
                          {comp.desc}
                       </p>

                       <div className="space-y-4 mb-16 relative">
                          <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/10" />
                          {Object.entries(comp.specs).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">{key}</span>
                               <span className="text-white group-hover:text-cyan-400 transition-colors">{val}</span>
                            </div>
                          ))}
                       </div>

                       <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-8">
                          <div className="flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${comp.status === "Optimal" ? "bg-cyan-400" : "bg-yellow-500"} animate-pulse`} />
                             <span className="text-[9px] font-black uppercase tracking-widest">{comp.status}</span>
                          </div>
                          <button className="text-white/20 group-hover:text-cyan-400 transition-colors">
                             <Maximize2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ==========================================
          3. NEURAL ARCHITECTURE (INTERACTIVE)
          ========================================== */}
      <section className="py-60 bg-black relative">
         <div className="max-w-[1400px] mx-auto px-8 md:px-24">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
               <div className="relative aspect-square">
                  <Reveal>
                     <div className="h-full border border-white/10 p-12 flex flex-col justify-between bg-white/5 backdrop-blur-3xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-40 bg-cyan-400 opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.1] transition-opacity" />
                        <div className="flex justify-between items-start z-10">
                           <div className="flex flex-col gap-2">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Interface_ID // N-SYNC</span>
                              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Neural_Flow_Visualizer</span>
                           </div>
                           <Activity className="w-5 h-5 text-cyan-400" />
                        </div>
                        
                        <div className="flex flex-col gap-12 relative z-10">
                           <div className="flex items-center justify-center gap-8">
                              <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                 <Brain className="w-8 h-8" />
                              </div>
                              <motion.div 
                                animate={{ x: [0, 40, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-px flex-1 bg-gradient-to-r from-cyan-400 to-transparent" 
                              />
                              <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center text-white/40">
                                 <Database className="w-8 h-8" />
                              </div>
                           </div>
                           <div className="text-center">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block mb-4">Flow_Efficiency</span>
                              <div className="text-4xl font-black italic text-cyan-400">99.98%</div>
                           </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 relative z-10">
                           {[...Array(12)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0.1, 0.4, 0.1] }}
                               transition={{ duration: 1, delay: i * 0.05, repeat: Infinity }}
                               className="h-1 bg-cyan-400/40"
                             />
                           ))}
                        </div>
                     </div>
                  </Reveal>
               </div>

               <div>
                  <Reveal delay={0.2} x={40}>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-8 block italic underline underline-offset-8">Software // Architecture</span>
                     <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-12">Flows.</h2>
                     <p className="text-xl font-light text-white/30 leading-relaxed italic mb-16 uppercase tracking-widest">
                        Nos architectures neuronales simulent la complexité biologique avec une fiabilité mathématique absolue, permettant une symbiose parfaite homme-machine.
                     </p>
                     <div className="space-y-12">
                        {PROTOCOLS.map((prot) => (
                          <div key={prot.id} className="group border-l border-white/5 pl-12 hover:border-cyan-400 transition-all cursor-pointer">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{prot.id} // {prot.level}</span>
                                <div className="text-[8px] font-black uppercase text-white/20 group-hover:text-white transition-colors">{prot.status}</div>
                             </div>
                             <h5 className="text-2xl font-bold uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors italic">{prot.title}</h5>
                             <div className="w-full h-[1px] bg-white/5 mt-6 group-hover:bg-cyan-400/20 transition-colors" />
                          </div>
                        ))}
                     </div>
                  </Reveal>
               </div>
            </div>
         </div>
      </section>

      {/* ==========================================
          4. ETHICS PROTOCOL (DOCUMENT DENSITY)
          ========================================== */}
      <section className="py-60 bg-[#08080a] relative border-y border-white/5 overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-8 md:px-24">
            <Reveal>
               <div className="flex flex-col md:flex-row gap-20 items-start">
                  <div className="md:w-1/3">
                     <h3 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-12">Ethics_Protocol_v3</h3>
                     <div className="p-8 border border-white/10 bg-white/5">
                        <Fingerprint className="w-12 h-12 text-cyan-400 mb-8" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 leading-relaxed">
                           Toute interaction avec les unités IA de classe S nécessite une accréditation de niveau 9. Toute déviation éthique sera immédiatement signalée au Conseil Central.
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest text-cyan-400 border-b border-cyan-400/30 pb-1">
                           Sign_Security_Accord
                        </button>
                     </div>
                  </div>
                  <div className="md:w-2/3 space-y-16">
                     {[
                       { t: "Neural Integrity", d: "Protection des droits fondamentaux de l'IA et maintien de la stabilité synaptique pour prévenir toute dérive cognitive imprévue." },
                       { t: "Data Sovereignty", d: "Chiffrement bout-en-bout de tous les flux de données neuronales pour garantir une confidentialité absolue des processus de pensée." },
                       { t: "Human Proxy", d: "Obligation de supervision humaine pour toutes les décisions critiques impactant l'infrastructure globale." }
                     ].map((item, i) => (
                       <div key={i} className="group flex gap-12 border-b border-white/5 pb-12">
                          <span className="text-5xl font-black text-white/5 group-hover:text-cyan-400/20 transition-colors italic">0{i+1}</span>
                          <div>
                             <h4 className="text-xl font-black uppercase tracking-widest mb-4 italic group-hover:text-cyan-400 transition-colors">{item.t}</h4>
                             <p className="text-sm text-white/30 leading-relaxed uppercase tracking-widest font-bold">{item.d}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ==========================================
          5. MEGA FOOTER (SYSTEM DATA)
          ========================================== */}
      <footer className="bg-black pt-60 pb-12 px-8 md:px-24 relative z-50">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
            <div className="lg:col-span-2">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-cyan-400 flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-3xl font-black uppercase tracking-tighter italic">NEURAL<span className="text-cyan-400">_FOUNDRY.</span></span>
               </div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-16 italic">
                  "L'intelligence n'est pas un don, c'est une ingénierie de précision." — Archive Foundry V4.0
               </p>
               <div className="flex gap-12">
                  {["LinkedIn", "GitHub", "Vimeo", "MessageSquare"].map(s => (
                    <Link key={s} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors italic">{s}</Link>
                  ))}
               </div>
            </div>

            {[
              { t: "RESEARCH", l: ["Neural Core", "Synthetic Bio", "Quantum AI", "Robotics"] },
              { t: "FACILITY", l: ["Foundry Labs", "Test Chamber", "Archive Access", "Careers"] },
              { t: "LEGAL", l: ["Ethics Protocol", "Data Policy", "Service Log", "Contact"] }
            ].map((col, i) => (
              <div key={i} className="flex flex-col gap-12">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] italic">{col.t}</h4>
                <ul className="flex flex-col gap-6">
                  {col.l.map(link => (
                    <li key={link} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
         </div>

         <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
            <span>© 2026 NEURAL FOUNDRY HEAVY INDUSTRIES LTD. // ALL_RIGHTS_RESERVED</span>
            <div className="flex gap-12">
               <span>SYSTEM: PRESSURIZED</span>
               <span>DATA: ENCRYPTED</span>
               <span>v9.4.0</span>
            </div>
         </div>
      </footer>
    </div>
  )
}

/* ==========================================
   TECHNICAL SUB-COMPONENTS
   ========================================== */

function HUD_Overlay({ activeLog }: { activeLog: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
       {/* Corners */}
       <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-white/10" />
       <div className="absolute top-12 right-12 w-12 h-12 border-t-2 border-r-2 border-white/10" />
       <div className="absolute bottom-12 left-12 w-12 h-12 border-b-2 border-l-2 border-white/10" />
       <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-white/10" />

       {/* Top Hud */}
       <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Core_Active</span>
          </div>
          <div className="h-px w-24 bg-white/10" />
          <div className="flex items-center gap-4">
             <Wifi className="w-3 h-3 text-white/20" />
             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Link_Stable</span>
          </div>
       </div>

       {/* Left Logs */}
       <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 hidden lg:flex">
          {SYSTEM_LOGS.map((log, i) => (
            <motion.div 
              key={i}
              animate={{ opacity: i === activeLog ? 1 : 0.2, x: i === activeLog ? 10 : 0 }}
              className={`text-[8px] font-mono font-bold ${i === activeLog ? "text-cyan-400" : "text-white/20"}`}
            >
              {log}
            </motion.div>
          ))}
       </div>

       {/* Sidebar Info */}
       <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden lg:block">
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10">Scanning_Protocol_X4.0 // Unauthorized_Access_Will_Be_Logged</span>
       </div>
    </div>
  )
}