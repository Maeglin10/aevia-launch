"use client"

import React, { useState, useEffect, useRef } from "react"
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
  Compass, Map, Wind, Mountain, 
  ArrowRight, Menu, X, Plus, 
  Maximize2, Share2, Download, ExternalLink, 
  Archive, Search, Clock, Hash, 
  Layers, Frame, Droplets, Landmark,
  Award, Star, ShieldCheck, Thermometer,
  CloudRain, MapPin, ChevronRight, Play,
  Lock, Key, BookOpen, PenTool, Radio,
  Activity, Zap, Target, Box, Database,
  Settings, Power, Info, AlertTriangle,
  Wifi, BarChart3, Microscope, Fingerprint, Scan
} from "lucide-react"

/* ==========================================================================
   ATLAS EXPEDITION DATASET (ULTRA DENSITY)
   ========================================================================== */

const EXPEDITIONS = [
  {
    id: "exp-k2",
    name: "K2 North Face",
    region: "Karakoram",
    difficulty: "EXTREME",
    duration: "45 Days",
    coordinates: "35.8800° N, 76.5151° E",
    gear: ["Oxygen v4", "Heated Shell", "Sat-Link"],
    image: "https://images.unsplash.com/photo-1544473244-f6895a69ad0b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "exp-ant",
    name: "Vinson Massif",
    region: "Antarctica",
    difficulty: "HARD",
    duration: "22 Days",
    coordinates: "78.5333° S, 85.6167° W",
    gear: ["Zero-G Tent", "Solar Array", "Beacon"],
    image: "https://images.unsplash.com/photo-1517030330234-94c4fa948ebc?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "exp-andes",
    name: "Aconcagua Trail",
    region: "Andes",
    difficulty: "MODERATE",
    duration: "18 Days",
    coordinates: "32.6532° S, 70.0109° W",
    gear: ["Lite-Pack", "Hydra-System", "Trek-Pro"],
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1200&auto=format&fit=crop"
  }
]

const LIVE_METRICS = [
  { label: "Altitude", value: "6,402m", trend: "Increasing" },
  { label: "Wind Speed", value: "42 km/h", trend: "Stable" },
  { label: "O2 Saturation", value: "88%", trend: "Critical" },
  { label: "Heart Rate", value: "114 bpm", trend: "Elevated" }
]

/* ==========================================================================
   TECHNICAL COMPONENTS
   ========================================================================== */

function Reveal({ children, delay = 0, y = 40, x = 0 }: { children: React.ReactNode, delay?: number, y?: number, x?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function TopoLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.1 }}
      transition={{ duration: 3, delay, ease: "easeInOut" }}
      className="absolute inset-0 pointer-events-none"
    >
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 500C200 450 300 600 500 500C700 400 800 550 1000 500" stroke="white" strokeWidth="0.5" />
        <path d="M0 600C250 550 350 700 550 600C750 500 850 650 1000 600" stroke="white" strokeWidth="0.5" />
        <path d="M0 400C150 350 250 500 450 400C650 300 750 450 1000 400" stroke="white" strokeWidth="0.5" />
      </svg>
    </motion.div>
  )
}

/* ==========================================================================
   THE ATLAS EXPEDITIONS - MAIN APPLICATION
   ========================================================================== */

export default function AtlasExpeditionPremium() {
  const [activeExp, setActiveExp] = useState(0)
  const [telemetryOpen, setTelemetryOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax effects
  const mountainY = useTransform(scrollYProgress, [0, 0.5], [0, -150])
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2])
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="bg-[#0a0b0d] text-[#e0e2e5] font-sans selection:bg-[#ffcf00] selection:text-black min-h-screen overflow-x-hidden">
      
      {/* GLOBAL HUD OVERLAY */}
      <nav className="fixed top-0 left-0 w-full h-24 z-[100] px-8 md:px-20 flex items-center justify-between border-b border-white/5 bg-[#0a0b0d]/80 backdrop-blur-xl">
         <Link href="/" className="flex flex-col group">
            <span className="text-3xl font-black tracking-tighter uppercase text-white flex items-center gap-3">
               <Compass className="w-8 h-8 text-[#ffcf00] animate-spin-slow" />
               ATLAS<span className="text-[#ffcf00]">.EXP</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.6em] text-white/20 uppercase italic">Extreme Exploration Logistics</span>
         </Link>

         <div className="hidden lg:flex items-center gap-12">
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
               <Link href="#" className="hover:text-white transition-colors">Expeditions</Link>
               <Link href="#" className="hover:text-white transition-colors">The Lab</Link>
               <Link href="#" className="hover:text-white transition-colors">Telemetry</Link>
               <Link href="#" className="hover:text-white transition-colors">Registry</Link>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button 
              onClick={() => setTelemetryOpen(true)}
              className="flex items-center gap-3 px-6 py-2 bg-[#ffcf00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
            >
               <Radio className="w-4 h-4" /> Live Feed
            </button>
         </div>

         <button className="lg:hidden w-10 h-10 flex items-center justify-center border border-white/10">
            <Menu className="w-6 h-6" />
         </button>
      </nav>

      <main>
        {/* ==========================================
            1. THE PEAK (HERO)
            ========================================== */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24">
          <TopoLine />
          <motion.div style={{ y: mountainY }} className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400&auto=format&fit=crop" 
                alt="High Mountain Range" 
                fill 
                className="object-cover opacity-30 grayscale"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-[#0a0b0d]" />
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl px-8">
             <Reveal>
                <div className="inline-flex items-center gap-4 px-4 py-1 border border-[#ffcf00]/30 bg-[#ffcf00]/5 text-[10px] font-bold uppercase tracking-[0.5em] text-[#ffcf00] mb-12">
                   <Target className="w-3 h-3" /> Mission_Status: Ready_for_Deploy
                </div>
                <motion.h1 style={{ scale: textScale }} className="text-7xl md:text-[12vw] font-black tracking-tighter uppercase mb-16 leading-[0.8] italic">
                   Against <br/> <span className="text-white/5 italic">The_Elements.</span>
                </motion.h1>
                <div className="grid md:grid-cols-3 gap-12 md:gap-24 text-left max-w-5xl mx-auto border-t border-white/10 pt-16">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ffcf00]">Our Directive</h3>
                      <p className="text-[11px] text-white/40 leading-loose uppercase tracking-widest font-bold italic">
                         Nous fournissons la logistique, l'équipement et l'expertise pour les expéditions là où aucune erreur n'est permise.
                      </p>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">8.8K</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Max Elevation (m)</span>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">-60°</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Survival Threshold</span>
                   </div>
                </div>
             </Reveal>
          </div>

          <motion.div 
            style={{ opacity: opacityFade }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Scroll_to_Deploy</span>
             <div className="h-20 w-px bg-gradient-to-b from-[#ffcf00] to-transparent" />
          </motion.div>
        </section>

        {/* ==========================================
            2. EXPEDITION MATRIX (DENSE GRID)
            ========================================== */}
        <section className="py-60 bg-[#0c0d0f] relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-20">
              <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-12">
                 <Reveal>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ffcf00] block mb-6 italic underline underline-offset-8">Active // Deployments</span>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">Matrix.</h2>
                 </Reveal>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-4 italic">Registry // Global_Coverage</span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffcf00]">L'Architecture de l'Exploration</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                 {EXPEDITIONS.map((exp, i) => (
                   <Reveal key={exp.id} delay={i * 0.1}>
                      <div className="bg-[#0a0b0d] p-16 flex flex-col h-full hover:bg-white/5 transition-all group cursor-crosshair">
                         <div className="relative aspect-square mb-16 overflow-hidden">
                            <Image 
                               src={exp.image} 
                               alt={exp.name} 
                               fill 
                               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-[#ffcf00]/10 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 left-4">
                               <span className="px-3 py-1 bg-[#ffcf00] text-black text-[9px] font-black uppercase tracking-widest">{exp.difficulty}</span>
                            </div>
                         </div>
                         
                         <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">{exp.name}</h3>
                         <div className="text-[10px] font-black text-[#ffcf00]/60 uppercase tracking-widest mb-8">{exp.region}</div>
                         
                         <div className="space-y-6 mb-16">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                               <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Duration</span>
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">{exp.duration}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                               <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Location</span>
                               <span className="text-[9px] font-black text-[#ffcf00] uppercase tracking-widest">{exp.coordinates}</span>
                            </div>
                         </div>

                         <div className="flex flex-wrap gap-4 mb-16">
                            {exp.gear.map(g => (
                               <span key={g} className="text-[8px] font-black uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1">{g}</span>
                            ))}
                         </div>

                         <div className="mt-auto">
                            <button className="w-full py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcf00] hover:text-black transition-all">
                               Request Briefing
                            </button>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. TELEMETRY (LIVE DATA SIMULATION)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffcf00] block mb-12 italic underline underline-offset-8">Live // Telemetry_Link</span>
                       <h2 className="text-6xl md:text-[8vw] font-light italic leading-none text-white mb-12 uppercase tracking-tighter">
                          The <br/> <span className="not-italic font-black text-white/5 italic">Vital_Stream.</span>
                       </h2>
                       <p className="text-xl font-light text-white/20 leading-relaxed mb-20 italic">
                          Surveillance constante de nos unités sur le terrain. Données biométriques et environnementales transmises par satellite en temps réel.
                       </p>
                       <div className="grid grid-cols-2 gap-8 mb-20">
                          {LIVE_METRICS.map((metric, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10">
                               <div className="text-[8px] font-black uppercase text-[#ffcf00] mb-2 tracking-[0.3em]">{metric.label}</div>
                               <div className="text-3xl font-light text-white mb-4 italic">{metric.value}</div>
                               <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-white/20 italic">
                                  <Activity className="w-3 h-3" /> {metric.trend}
                               </div>
                            </div>
                          ))}
                       </div>
                       <button className="w-full py-6 border-2 border-[#ffcf00] text-[#ffcf00] text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcf00] hover:text-black transition-all">
                          Establish Satellite Handshake
                       </button>
                    </Reveal>
                 </div>
                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-[#0a0b0d] border border-white/10 p-12 flex flex-col justify-between relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-40 bg-[#ffcf00] opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.1] transition-opacity" />
                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Feed_ID // ALFA-7</span>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Environmental_Scan</span>
                             </div>
                             <Wifi className="w-5 h-5 text-[#ffcf00]" />
                          </div>
                          
                          <div className="flex flex-col gap-12 relative z-10">
                             <div className="flex items-center justify-center gap-8">
                                <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center text-[#ffcf00] shadow-[0_0_30px_rgba(255,207,0,0.1)]">
                                   <Activity className="w-12 h-12" />
                                </div>
                             </div>
                             <div className="text-center">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block mb-4 italic">Signal_Strength</span>
                                <div className="text-4xl font-black italic text-[#ffcf00]">92% // SECURE</div>
                             </div>
                          </div>

                          <div className="flex gap-4 relative z-10">
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                   animate={{ x: ["-100%", "100%"] }} 
                                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-[#ffcf00]"
                                />
                             </div>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            4. GEAR LAB (EQUIPMENT FOCUS)
            ========================================== */}
        <section className="py-60 bg-[#0a0b0d] relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="relative aspect-square">
                    <Reveal>
                       <Image 
                          src="https://images.unsplash.com/photo-1522163182402-834f683a876d?q=80&w=1200&auto=format&fit=crop" 
                          alt="Climbing Gear" 
                          fill 
                          className="object-cover grayscale"
                       />
                       <div className="absolute inset-0 bg-[#ffcf00]/20 mix-blend-overlay" />
                    </Reveal>
                 </div>
                 <div>
                    <Reveal delay={0.2}>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffcf00] block mb-12 italic underline underline-offset-8">Equipment // Research</span>
                       <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-12">Gear.</h2>
                       <p className="text-xl font-light text-white/30 leading-relaxed italic mb-16 uppercase tracking-widest">
                          Le matériel est le seul rempart entre vous et l'abîme. Nous testons chaque pièce dans les conditions les plus hostiles de la planète.
                       </p>
                       <div className="space-y-12">
                          {[
                            { t: "Life Support", d: "Systèmes de régulation thermique active pour les environnements à -50°C." },
                            { t: "Sat-Coms", d: "Communication satellite cryptée avec redondance triple pour une liaison sans faille." },
                            { t: "Structural Integrity", d: "Matériaux composites ultra-légers issus de l'aérospatial pour une durabilité maximale." }
                          ].map((feat, i) => (
                            <div key={i} className="group border-l border-white/5 pl-12 hover:border-[#ffcf00] transition-all cursor-pointer">
                               <h5 className="text-2xl font-bold uppercase tracking-tight text-white group-hover:text-[#ffcf00] transition-colors italic mb-4">{feat.t}</h5>
                               <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold leading-relaxed">{feat.d}</p>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* MEGA FOOTER */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-20 relative z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
            <div className="lg:col-span-2">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-[#ffcf00] flex items-center justify-center">
                    <Compass className="w-8 h-8 text-black" />
                  </div>
                  <span className="text-3xl font-black uppercase tracking-tighter italic">ATLAS<span className="text-[#ffcf00]">.EXP</span></span>
               </div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-16 italic">
                  "L'exploration n'est pas une aventure, c'est une science de la préparation." — Archive Atlas V4.2
               </p>
               <div className="flex gap-12">
                  {["Camera", "GlobalMap", "SatLink", "ExpeditionData"].map(s => (
                    <Link key={s} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#ffcf00] transition-colors italic">{s}</Link>
                  ))}
               </div>
            </div>

            {[
              { t: "REGIONS", l: ["Karakoram", "Andes", "Himalayas", "Antarctica"] },
              { t: "SERVICES", l: ["Logistics", "Gear Lab", "Training", "Air Support"] },
              { t: "LEGAL", l: ["Ethics", "Privacy", "Certifications", "Contact"] }
            ].map((col, i) => (
              <div key={i} className="flex flex-col gap-12">
                <h4 className="text-[10px] font-black text-[#ffcf00] uppercase tracking-[0.5em] italic">{col.t}</h4>
                <ul className="flex flex-col gap-6">
                  {col.l.map(link => (
                    <li key={link} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
             <span>© 2026 ATLAS EXPLORATION LOGISTICS GROUP AG. // ALL_RIGHTS_RESERVED</span>
             <div className="flex gap-12">
                <span>SIGNAL: STABLE</span>
                <span>LATENCY: 420ms (SAT)</span>
                <span>v4.2.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* TELEMETRY OVERLAY (SIMULATED) */}
      <AnimatePresence>
        {telemetryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-md w-full border border-[#ffcf00]/30 p-12 relative bg-[#0a0b0d]">
                <button onClick={() => setTelemetryOpen(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                </button>
                <div className="flex flex-col items-center gap-12">
                   <div className="w-20 h-20 bg-[#ffcf00]/10 flex items-center justify-center rounded-full">
                      <Radio className="w-10 h-10 text-[#ffcf00]" />
                   </div>
                   <div className="text-center">
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Establish Sat_Link</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 leading-relaxed">
                         Veuillez entrer votre code d'unité ou scanner votre badge d'accréditation pour accéder aux flux de données en direct.
                      </p>
                   </div>
                   <div className="w-full space-y-4">
                      <input 
                         type="text" 
                         placeholder="UNIT_ID"
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] outline-none focus:border-[#ffcf00] text-white"
                      />
                      <button className="w-full py-4 bg-[#ffcf00] text-black text-[10px] font-black uppercase tracking-widest">
                         Connect to Stream
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}