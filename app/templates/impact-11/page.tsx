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
  Radar, Orbit, Atom, Search, Cpu, Building, 
  Building2, Home, Layout, Compass, PenTool, 
  Camera, Film, Palette, Image as ImageIcon, 
  Maximize, Minimize, Plus, Minus, Check, 
  ShieldCheck, Globe, Database, Binary, Code2,
  Waves, Gauge, Thermometer, FlaskConical,
  Sun, Moon, Star, Sparkles, CircleDot,
  ArrowUpRight, ArrowDownLeft, Expand, Shrink
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   AETHER VISUALS DATASET (ULTRA DENSITY)
   ========================================================================== */

const PROJECTS = [
  {
    id: "ae-prj-01",
    name: "The Glass Monolith",
    location: "Zurich, CH",
    year: "2025",
    type: "Commercial Synthesis",
    desc: "Une exploration de la transparence radicale et de l'intégration structurelle. Rendu en 12k natif avec simulation de réfraction volumétrique.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92fb1ab?w=1600&q=80",
    color: "#c9a84c"
  },
  {
    id: "ae-prj-08",
    name: "Entropy Residence",
    location: "Aspen, US",
    year: "2024",
    type: "Residential Twin",
    desc: "Jumeau numérique haute fidélité permettant une analyse thermique en temps réel et une simulation acoustique pour une isolation parfaite.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
    color: "#2d4a2d"
  },
  {
    id: "ae-prj-15",
    name: "Vertical Atrium",
    location: "Tokyo, JP",
    year: "2026",
    type: "Atmospheric Render",
    desc: "Étude sur la diffusion de la lumière naturelle dans les espaces confinés. Simulation de 400 types de verre et textures organiques.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    color: "#1a1a1a"
  }
]

const WORKFLOW = [
  {
    id: "01",
    title: "Geometry Ingestion",
    desc: "Deep analysis of CAD/BIM data for structural fidelity. Conversion vers des maillages haute densité optimisés pour le Ray Tracing.",
    icon: Box
  },
  {
    id: "02",
    title: "Material Synthesis",
    desc: "Creation of physical-based shaders following real-world specs. Utilisation de la photogrammétrie pour des textures réalistes au micron.",
    icon: Layers
  },
  {
    id: "03",
    title: "Atmospheric Simulation",
    desc: "Dynamic lighting based on GPS coordinates and time-series data. Simulation volumétrique des particules d'air et de l'humidité.",
    icon: Wind
  }
]

const ATELIER_METRICS = [
  { label: "Render Nodes", value: "124", trend: "Scalable", detail: "Vulcan Cluster v2" },
  { label: "Encryption", value: "AES-512", trend: "Secure", detail: "End-to-End Bridge" },
  { label: "Resolution", value: "12k", trend: "Native", detail: "Ultra-High Definition" },
  { label: "BIM Sync", value: "Real-time", trend: "Live", detail: "Data-Driven Renders" }
]

/* ==========================================
   TECHNICAL COMPONENTS (SLIDER REVOLUTION)
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

function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] select-none">
       <div className="h-full w-full grid grid-cols-12 gap-0 border-x border-white">
          {[...Array(11)].map((_, i) => (
             <div key={i} className="h-full border-r border-white" />
          ))}
       </div>
    </div>
  )
}

function HUD_Atelier() {
   return (
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-end pointer-events-none">
         <div className="flex flex-col gap-4 items-end">
            <div className="w-1 h-32 bg-[#c9a84c]/20 relative">
               <motion.div 
                  className="absolute bottom-0 left-0 w-full bg-[#c9a84c]"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
               />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] vertical-text text-[#c9a84c]">Atelier_Sync_v4</span>
         </div>
         <div className="flex flex-col gap-4">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md">
               <Camera className="w-5 h-5 text-white/40" />
            </div>
            <div className="w-12 h-12 border border-[#c9a84c]/30 flex items-center justify-center bg-[#c9a84c]/5 backdrop-blur-md">
               <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            </div>
         </div>
      </div>
   )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <div className="min-w-[85vw] md:min-w-[65vw] lg:min-w-[50vw] h-[75vh] relative group overflow-hidden border border-white/5 bg-[#0a0a0a] snap-center">
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
       <motion.img 
          src={project.img} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          alt={project.name}
       />
       
       <div className="absolute top-12 left-12 z-20">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9a84c] mb-4">{project.id} // {project.year}</div>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic group-hover:translate-x-8 transition-transform duration-1000">
             {project.name}
          </h3>
       </div>

       <div className="absolute bottom-12 left-12 right-12 z-20">
          <p className="text-sm md:text-base text-white/40 leading-relaxed font-light uppercase italic mb-12 max-w-lg tracking-widest">
             {project.desc}
          </p>
          <div className="flex justify-between items-end border-t border-white/10 pt-12">
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Location</div>
                   <div className="text-lg font-black italic">{project.location}</div>
                </div>
                <div>
                   <div className="text-[8px] text-white/20 uppercase mb-2">Synthesis Type</div>
                   <div className="text-lg font-black italic">{project.type}</div>
                </div>
             </div>
             <button className="px-12 py-6 border-2 border-[#c9a84c] text-[#c9a84c] text-[10px] font-black uppercase tracking-widest hover:bg-[#c9a84c] hover:text-black transition-all italic flex items-center gap-4">
                Explore Twin <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
       </div>
       
       {/* Background Number Accent */}
       <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[30vw] font-black text-white/[0.02] pointer-events-none select-none italic translate-x-1/2">
          {index + 1}
       </div>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE: AETHER VISUALS (LUXURY ARCHITECTURAL)
   ========================================================================== */

export default function AetherVisualsPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#f0f0f0] font-sans selection:bg-[#c9a84c]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <GridOverlay />
      <HUD_Atelier />
      
      {/* 1. NAVIGATION (LUXURY ATELIER) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-12 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
         <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
               <div className="w-6 h-6 border-2 border-black rotate-45" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Aether <span className="text-[#c9a84c]">Visuals.</span></span>
               <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/20 -mt-1 ml-1">Architectural Synthesis Atelier</span>
            </div>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#projects" className="hover:text-[#c9a84c] transition-colors relative group">
               [ Projects ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a84c] group-hover:w-full transition-all" />
            </a>
            <a href="#workflow" className="hover:text-[#c9a84c] transition-colors relative group">
               [ Workflow ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a84c] group-hover:w-full transition-all" />
            </a>
            <a href="#atelier" className="hover:text-[#c9a84c] transition-colors relative group">
               [ The_Atelier ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a84c] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-[#c9a84c] uppercase">Render_Nodes</div>
               <div className="text-[10px] font-bold uppercase tracking-widest">124_Active</div>
            </div>
            <button className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#c9a84c] transition-all italic rounded-full">
               Bespoke Portal
            </button>
         </div>
      </nav>

      <main>
        {/* 2. SYNTHESIS IGNITION (HERO / LUXURY STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden">
           <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a84c] mb-16 italic">
                    <Sparkles className="w-4 h-4" /> Atelier_Status: SYNTHESIZING // VULCAN_NODES_MAX
                 </div>
                 <motion.h1 
                    style={{ y: heroY, scale: textScale, opacity: heroOpacity }}
                    className="text-8xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Atomic</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Precision.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end text-left max-w-5xl mx-auto">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-[0.15em]">
                       Nous fusionnons l'art CGI et les données BIM pour créer des jumeaux numériques d'une fidélité absolue. La réalité n'est plus une limite, c'est notre point de départ.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#c9a84c] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(201,168,76,0.3)] flex items-center gap-4 italic group rounded-sm">
                          Explore Archives <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Background Image Parallax */}
           <div className="absolute inset-0 z-0 opacity-10 grayscale select-none">
              <img src="https://images.unsplash.com/photo-1518005020250-68a377a747e9?w=1600&q=80" className="w-full h-full object-cover" alt="Background Arch" />
           </div>
        </section>

        {/* 3. PROJECT SYNTHESIS (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="projects" className="py-64 px-12 border-y border-white/5 relative overflow-hidden">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a84c] mb-8">Atelier_Portfolio</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    Recent <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Syntheses.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-48 h-[1px] bg-white/10" />
                    <div className="w-16 h-[1px] bg-[#c9a84c]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Zurich // Tokyo // Aspen</p>
              </div>
           </div>

           <div className="flex gap-16 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {PROJECTS.map((project, i) => (
                 <ProjectCard key={project.id} project={project} index={i} />
              ))}
           </div>
        </section>

        {/* 4. ATOMIC WORKFLOW (GRID DENSITY) */}
        <section id="workflow" className="py-64 px-12 bg-zinc-950">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-start">
              <div className="lg:col-span-5">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a84c] mb-8">Process_Logic</div>
                    <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12 italic">
                       The <br/> <span className="opacity-20">Cycle.</span>
                    </h2>
                    <p className="text-lg font-light italic text-white/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Chaque projet traverse un cycle de synthèse rigoureux, transformant des données brutes en expériences visuelles immersives et techniquement précises.
                    </p>
                    <div className="p-12 border border-white/5 bg-white/[0.02] space-y-8">
                       <div className="flex items-center gap-6">
                          <Terminal className="w-6 h-6 text-[#c9a84c]" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">Core_Synthesis_v4</span>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] uppercase text-white/20 italic">
                             <span>Processing Speed</span>
                             <span className="text-[#c9a84c]">1.2 TB/h</span>
                          </div>
                          <div className="w-full h-1 bg-white/5">
                             <motion.div className="h-full bg-[#c9a84c]" initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 2 }} />
                          </div>
                       </div>
                    </div>
                 </Reveal>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {WORKFLOW.map((step, i) => (
                    <Reveal key={step.id} delay={i * 0.1} y={80}>
                       <div className="p-12 border border-white/5 hover:border-[#c9a84c]/50 bg-black transition-all group h-full">
                          <div className="flex justify-between items-start mb-12">
                             <div className="w-16 h-16 border border-[#c9a84c]/30 flex items-center justify-center group-hover:bg-[#c9a84c]/10 transition-all">
                                <step.icon className="w-8 h-8 text-[#c9a84c]" />
                             </div>
                             <span className="text-4xl font-black italic text-white/[0.05] group-hover:text-[#c9a84c]/20 transition-colors">{step.id}</span>
                          </div>
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-6 group-hover:text-[#c9a84c] transition-colors">{step.title}</h4>
                          <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic">
                             {step.desc}
                          </p>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* 5. ATELIER METRICS (HUD INTERFACE) */}
        <section id="atelier" className="py-64 px-12 relative overflow-hidden">
           <div className="max-w-7xl mx-auto">
              <Reveal>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
                    <div className="max-w-2xl">
                       <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a84c] mb-8">Laboratory_Status</div>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                          Twin <br/> <span className="opacity-10">Specs.</span>
                       </h2>
                    </div>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 border-2 border-white/5 bg-white/5">
                 {ATELIER_METRICS.map((metric, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                       <div className="bg-[#050505] p-16 h-full group hover:bg-[#c9a84c]/5 transition-all">
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c] mb-8">{metric.label}</div>
                          <div className="text-6xl font-black italic mb-8 tracking-tighter group-hover:scale-110 transition-transform origin-left">{metric.value}</div>
                          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
                             <span>{metric.detail}</span>
                             <span className="text-[#c9a84c]">{metric.trend}</span>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* 6. FAQ (LUXURY ACCORDION) */}
        <section className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a84c] mb-8">Studio_Inquiry</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8">Atelier <span className="opacity-20">Q&A.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 italic">Process // Delivery // Technology</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is the typical project duration?", a: "Depending on scale and complexity, a full architectural synthesis typically requires between 4 to 12 weeks from data ingestion to final twin delivery." },
                   { q: "Do you integrate real-time sensor data?", a: "Yes. Our Digital Twins can be connected to on-site IoT sensors for live performance monitoring and predictive maintenance simulations." },
                   { q: "What hardware is required for local playback?", a: "While we provide cloud-based streaming for twins, local playback requires an NVIDIA RTX 4090 class GPU for optimal 12k real-time performance." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border-2 border-black/5 bg-black/[0.02] px-12 rounded-sm hover:border-black/20 transition-all">
                      <AccordionTrigger className="text-[14px] font-black uppercase tracking-[0.3em] py-14 no-underline italic text-left">
                         {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[12px] font-medium text-black/50 tracking-[0.1em] uppercase italic leading-loose pb-14">
                         {item.a}
                      </AccordionContent>
                   </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>

        {/* 7. FOOTER (HIGH FIDELITY) */}
        <footer className="bg-black pt-64 pb-16 px-12 md:px-24 border-t-8 border-[#c9a84c]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-[#c9a84c]">Aether.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-white/20 ml-2">Architectural Synthesis Atelier</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La synthèse ultime de l'architecture et du numérique. Zurich, Suisse.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/20 hover:text-[#c9a84c] transition-all cursor-pointer" />
                             <Camera className="w-7 h-7 text-white/20 hover:text-[#c9a84c] transition-all cursor-pointer" />
                             <Binary className="w-7 h-7 text-white/20 hover:text-[#c9a84c] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9a84c] mb-16 border-b border-[#c9a84c]/20 pb-4">Synthesis</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> CGI_Visuals
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> BIM_Layering
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> Digital_Twins
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c9a84c] mb-16 border-b border-[#c9a84c]/20 pb-4">Atelier</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> Philosophy
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> Lab_Reports
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c9a84c]" /> Archives
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 AETHER VISUALS ATELIER.</span>
                    <span className="hidden md:inline">//</span>
                    <span>PHOTOREALISM_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#c9a84c]/30">
                    <span>VULCAN_LINK_STABLE</span>
                    <span>RENDER_NODES_124_ACTIVE</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #050505; }
        ::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
