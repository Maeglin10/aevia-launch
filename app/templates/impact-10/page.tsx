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
  Radar, Orbit, Atom, Search, Cpu, Leaf, Droplets, 
  FlaskConical, Microscope, Thermometer, Gauge, 
  Waves, ShieldCheck, Sun, Moon, Sparkles, 
  Compass, Map, Radio, Disc, Binary, Database,
  CircleDot, Waves as WaveIcon, Pickaxe, Mountain, Gem,
  Drill, Telescope, MilestoneIcon, Globe, Layout,
  Smartphone, PenTool, Camera, Music, Film, Palette,
  MessageSquare, Send, Flower, Flower2, Sprout,
  Grape, GlassWater, Shovel, Dna, Biohazard,
  Crosshair, Focus, ScanEye
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* ==========================================================================
   VERIDIAN BOTANICAL DATASET (ULTRA DENSITY)
   ========================================================================== */

const STRAINS = [
  {
    id: "ver-go-01",
    name: "Veridian Gold",
    terpenes: "Limonene // Myrcene",
    potency: "98% Retained",
    cure: "Cold-Cure / 14 Days",
    desc: "L'expression ultime de la vigueur solaire. Une synergie de terpènes d'agrumes stabilisée par notre processus de cure à froid propriétaire.",
    img: "https://images.unsplash.com/photo-1536640710159-2f3f144c209d?w=1200&q=80",
    color: "#c4a45e"
  },
  {
    id: "ver-vn-08",
    name: "Velvet Night",
    terpenes: "Linalool // Caryophyllene",
    potency: "99% Retained",
    cure: "Slow-Dry / 21 Days",
    desc: "Une profondeur florale évoquant la sérénité nocturne. Cultivée sous spectre violet pur pour maximiser la production de métabolites secondaires.",
    img: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?w=1200&q=80",
    color: "#5e4b8b"
  },
  {
    id: "ver-ob-15",
    name: "Obsidian Bloom",
    terpenes: "Pinene // Humulene",
    potency: "97.5% Retained",
    cure: "Ice-Preserved",
    desc: "Issue de sols volcaniques enrichis, cette variété offre une structure cristalline unique et une résine d'une densité exceptionnelle.",
    img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80",
    color: "#1a1a1a"
  }
]

const LAB_METRICS = [
  { label: "Terpene Retention", value: "98%", trend: "Optimal", detail: "Nitrogen Sealed" },
  { label: "pH Stability", value: "6.2", trend: "Nominal", detail: "Organic Soil" },
  { label: "Pesticide Analysis", value: "0.00", trend: "Clean", detail: "Bio-Synthetic Control" },
  { label: "Microbial Load", value: "<10 CFU", trend: "Safe", detail: "Cleanroom Class 100" }
]

const ATELIER_LOGS = [
  { time: "08:12:04", unit: "Zone_A", task: "Nutrient_Flow", status: "SYNC", value: "6.2 pH" },
  { time: "08:15:32", unit: "Atelier", task: "Light_Cycle", status: "DAWN", value: "450nm" },
  { time: "08:22:15", unit: "Lab_01", task: "Terpene_Scan", status: "PASS", value: "104 Para" }
]

/* ==========================================
   TECHNICAL COMPONENTS (FLUID DYNAMICS)
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

function FluidOrganicBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
       <svg className="hidden">
          <filter id="gooey">
             <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
             <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
             <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
       </svg>
       
       <div className="w-full h-full" style={{ filter: 'url(#gooey)' }}>
          {[...Array(6)].map((_, i) => (
             <motion.div 
                key={i}
                className="absolute rounded-full"
                style={{ 
                   width: 400 + i * 50, 
                   height: 400 + i * 50,
                   background: i % 2 === 0 ? '#c4a45e' : '#2d4a2d',
                   opacity: 0.4,
                   left: `${10 + i * 15}%`,
                   top: `${20 + i * 10}%`
                }}
                animate={{ 
                   x: [0, 50, 0],
                   y: [0, -40, 0],
                   scale: [1, 1.1, 1]
                }}
                transition={{ 
                   duration: 10 + i * 2, 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                }}
             />
          ))}
       </div>
    </div>
  )
}

function HUD_Microscope() {
   return (
      <div className="fixed top-32 right-12 z-40 hidden xl:flex flex-col gap-8 items-end pointer-events-none">
         <div className="p-8 border border-[#c4a45e]/30 bg-black/40 backdrop-blur-md rounded-full relative group">
            <div className="absolute inset-0 border border-[#c4a45e] rounded-full animate-ping opacity-20" />
            <ScanEye className="w-8 h-8 text-[#c4a45e]" />
            <div className="absolute -top-12 right-0 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.5em] text-[#c4a45e]">
               Micro_Scan_Active
            </div>
         </div>
         <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
               <div key={i} className="w-12 h-1 bg-white/10 relative overflow-hidden">
                  <motion.div 
                     className="absolute inset-0 bg-[#c4a45e]"
                     animate={{ x: ["-100%", "100%"] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
               </div>
            ))}
         </div>
      </div>
   )
}

function StrainCard({ strain, index }: { strain: any, index: number }) {
   return (
      <div className="min-w-[80vw] md:min-w-[50vw] lg:min-w-[40vw] h-[60vh] relative group overflow-hidden border border-white/5 bg-[#0a0a0a] snap-center">
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
         <motion.img 
            src={strain.img} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
            alt={strain.name}
         />
         
         <div className="absolute top-12 left-12 z-20">
            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c4a45e] mb-2">{strain.id}</div>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none group-hover:translate-x-4 transition-transform duration-700">
               {strain.name}
            </h3>
         </div>

         <div className="absolute bottom-12 left-12 right-12 z-20">
            <p className="text-xs text-white/40 leading-relaxed font-medium uppercase italic mb-8 max-w-sm">
               {strain.desc}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div>
                  <div className="text-[8px] text-white/20 uppercase mb-2">Terpene Profile</div>
                  <div className="text-xs font-bold italic">{strain.terpenes}</div>
               </div>
               <div>
                  <div className="text-[8px] text-white/20 uppercase mb-2">Cure Method</div>
                  <div className="text-xs font-bold italic">{strain.cure}</div>
               </div>
            </div>
         </div>
         
         <div className="absolute bottom-12 right-12 z-30 flex flex-col items-center gap-4">
            <div className="text-[8px] font-black uppercase tracking-widest text-[#c4a45e] rotate-90 mb-4 whitespace-nowrap">Potency_Cert</div>
            <div className="w-12 h-12 rounded-full border border-[#c4a45e] flex items-center justify-center text-[10px] font-bold">
               {strain.potency.split(' ')[0]}
            </div>
         </div>
      </div>
   )
}

/* ==========================================================================
   MAIN PAGE: VERIDIAN BOTANICAL ATELIER (FLUID ORGANIC)
   ========================================================================== */

export default function VeridianBotanicalPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <div ref={containerRef} className="bg-[#050805] text-[#f0f0f0] font-sans selection:bg-[#c4a45e]/40 selection:text-white min-h-screen overflow-x-hidden">
      
      <FluidOrganicBackground />
      <HUD_Microscope />
      
      {/* 1. NAVIGATION (ATELIER STYLE) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-12 border-b border-white/5 bg-black/40 backdrop-blur-xl">
         <div className="flex flex-col group cursor-pointer">
            <span className="text-3xl font-black tracking-[0.1em] uppercase leading-none text-[#c4a45e]">Veridian.</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/30 -mt-1 ml-1">Botanical Atelier California</span>
         </div>
         <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#strains" className="hover:text-[#c4a45e] transition-colors relative group">
               [ The_Library ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c4a45e] group-hover:w-full transition-all" />
            </a>
            <a href="#science" className="hover:text-[#c4a45e] transition-colors relative group">
               [ Bio_Science ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c4a45e] group-hover:w-full transition-all" />
            </a>
            <a href="#contact" className="hover:text-[#c4a45e] transition-colors relative group">
               [ Consultation ]
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c4a45e] group-hover:w-full transition-all" />
            </a>
         </div>
         <div className="flex items-center gap-12">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
               <div className="text-[8px] font-black text-[#c4a45e] uppercase">pH_Stability</div>
               <div className="text-[10px] font-bold">6.2 Nominal</div>
            </div>
            <button className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:border-[#c4a45e] transition-colors bg-black/20">
               <Grid className="w-4 h-4" />
            </button>
         </div>
      </nav>

      <main>
        {/* 2. ORGANIC IGNITION (HERO / FLUID STYLE) */}
        <section className="relative h-screen flex flex-col justify-center items-center px-12 pt-32 overflow-hidden">
           <div className="relative z-10 w-full max-w-7xl">
              <Reveal>
                 <div className="inline-flex items-center gap-4 px-6 py-3 border border-[#c4a45e]/30 bg-[#c4a45e]/5 text-[10px] font-black uppercase tracking-[0.5em] text-[#c4a45e] mb-16 italic">
                    <Sprout className="w-4 h-4" /> Synthesis: ACTIVE // Batch_ID: VER_44 // Cleanroom: ON
                 </div>
                 <motion.h1 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="text-7xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.7] italic flex flex-col"
                 >
                    <span>Organic</span>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Mastery.</span>
                 </motion.h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end max-w-5xl">
                    <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light italic uppercase tracking-widest">
                       Nous redéfinissons l'art de la botanique par la science. Chaque bloom est un chef-d'œuvre de bio-ingénierie, conçu pour une pureté absolue et un profil terpénique inégalé.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-end">
                       <button className="px-14 py-8 bg-[#c4a45e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(196,164,94,0.3)] flex items-center gap-4 italic group">
                          [ Enter the Library ] <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </div>
              </Reveal>
           </div>

           {/* Floating Macro Detail */}
           <motion.div 
              style={{ scale: blobScale }}
              className="absolute bottom-[-10vw] right-[-5vw] w-[40vw] h-[40vw] opacity-20 pointer-events-none z-0"
           >
              <div className="w-full h-full border border-[#c4a45e]/20 rounded-full flex items-center justify-center">
                 <div className="w-[80%] h-[80%] border border-[#c4a45e]/10 rounded-full animate-spin-slow flex items-center justify-center">
                    <div className="w-[60%] h-[60%] border border-[#c4a45e]/5 rounded-full" />
                 </div>
              </div>
           </motion.div>
        </section>

        {/* 3. THE LIBRARY (HORIZONTAL SCROLL / KORR STYLE) */}
        <section id="strains" className="py-64 px-12 bg-black/40 border-y border-white/5 relative">
           <div className="max-w-7xl mx-auto mb-32 flex justify-between items-end">
              <Reveal>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c4a45e] mb-8">Strain_Archive</div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                    Bespoke <br/> <span className="text-white/5" style={{ WebkitTextStroke: "1px white" }}>Blooms.</span>
                 </h2>
              </Reveal>
              <div className="hidden lg:block text-right">
                 <div className="flex justify-end gap-4 mb-4">
                    <div className="w-32 h-1 bg-white/5" />
                    <div className="w-12 h-1 bg-[#c4a45e]" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">California // Small Batch // Gold Seal</p>
              </div>
           </div>

           <div className="flex gap-12 overflow-x-auto pb-24 no-scrollbar px-4 -mx-4 snap-x snap-mandatory">
              {STRAINS.map((strain, i) => (
                 <StrainCard key={strain.id} strain={strain} index={i} />
              ))}
           </div>
        </section>

        {/* 4. BIO-SCIENCE (HUD INTERFACE / DENSITY) */}
        <section id="science" className="py-64 px-12">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-7">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c4a45e] mb-8">Lab_Protocols</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                       Cellular <br/> <span className="opacity-10">Integrity.</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {LAB_METRICS.map((metric, i) => (
                          <div key={i} className="p-12 border border-white/5 bg-white/[0.02] hover:border-[#c4a45e]/50 transition-all group relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                {i === 0 ? <Dna className="w-6 h-6" /> : i === 1 ? <FlaskConical className="w-6 h-6" /> : i === 2 ? <ShieldCheck className="w-6 h-6" /> : <Biohazard className="w-6 h-6" />}
                             </div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#c4a45e] mb-6">{metric.label}</div>
                             <div className="text-6xl font-black italic mb-6 tracking-tighter group-hover:scale-105 transition-transform origin-left">{metric.value}</div>
                             <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">
                                <span>{metric.detail}</span>
                                <span className="text-[#c4a45e]">{metric.trend}</span>
                             </div>
                             <div className="mt-8 h-1 bg-white/5 relative overflow-hidden">
                                <motion.div 
                                   className="absolute inset-y-0 left-0 bg-[#c4a45e]"
                                   initial={{ width: 0 }}
                                   whileInView={{ width: '70%' }}
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
                    <div className="p-12 bg-[#c4a45e]/5 border border-[#c4a45e]/20 rounded-2xl relative group overflow-hidden">
                       <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c4a45e]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                       <h4 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Terpene Archiving</h4>
                       <p className="text-sm text-white/40 leading-relaxed uppercase tracking-widest font-light italic mb-12">
                          Notre bibliothèque génétique contient plus de 450 profils terpéniques uniques. Chaque lot est archivé pour garantir une traçabilité totale et une constance sensorielle absolue.
                       </p>
                       <div className="space-y-4 font-mono text-[10px]">
                          {ATELIER_LOGS.map((log, i) => (
                             <div key={i} className="flex justify-between border-b border-white/5 pb-2 group/log hover:bg-white/5 px-2 transition-colors">
                                <span className="text-white/20 group-hover/log:text-white transition-colors">[{log.time}]</span>
                                <span className="text-[#c4a45e] font-black">{log.unit}</span>
                                <span className="text-white/40 italic">{log.task}</span>
                                <span className="font-black">[{log.status}]</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 5. CULTIVATION ATELIER (EDITORIAL) */}
        <section className="py-64 px-12 bg-white text-black relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="order-2 lg:order-1">
                 <Reveal scale={0.9}>
                    <div className="relative aspect-[4/5] bg-black group overflow-hidden border-[15px] border-black/5">
                       <img 
                          src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=1200&q=80" 
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-2000"
                          alt="Atelier"
                       />
                       <div className="absolute inset-0 bg-[#c4a45e]/10 mix-blend-overlay" />
                       <div className="absolute top-12 left-12 flex flex-col gap-2">
                          <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2">Zone_01_Interior</div>
                          <div className="text-[8px] font-bold uppercase tracking-widest bg-white/90 px-4 py-1">Controlled_Environment</div>
                       </div>
                    </div>
                 </Reveal>
              </div>
              <div className="order-1 lg:order-2">
                 <Reveal>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c4a45e] mb-8">The_Maison</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic">
                       Craft <br/> <span className="opacity-20">Cured.</span>
                    </h2>
                    <p className="text-lg font-bold italic text-black/40 leading-relaxed uppercase tracking-[0.1em] mb-16">
                       Le temps est notre ingrédient le plus précieux. Notre processus de séchage lent à température contrôlée permet de préserver la structure fragile des trichomes et la complexité des arômes.
                    </p>
                    <div className="grid grid-cols-2 gap-12 border-t border-black/10 pt-12">
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20">Cure Duration</div>
                          <div className="text-4xl font-black italic">21 Days</div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="text-[10px] font-black text-black/20">Storage Env</div>
                          <div className="text-4xl font-black italic">Cryo_V2</div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* 6. FAQ (ATELIER STYLE) */}
        <section className="py-64 px-12 relative overflow-hidden bg-[#0a0a0a]">
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="text-center mb-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c4a45e] mb-8">Concierge_Support</div>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic mb-8">Atelier <span className="opacity-10">Q&A.</span></h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 italic">Acquisition // Storage // Integrity</p>
                 </div>
              </Reveal>

              <Accordion type="single" collapsible className="w-full space-y-4">
                 {[
                   { q: "What is the shelf-life of Veridian blooms?", a: "Due to our cold-cure process and nitrogen-sealed packaging, peak terpene potency is maintained for up to 12 months." },
                   { q: "Do you ship internationally?", a: "Veridian operates strictly within compliant jurisdictions. We offer discreet concierge delivery to vetted members." },
                   { q: "What is your testing protocol?", a: "Every batch undergoes a full-panel laboratory audit covering 104 parameters, including heavy metals and 64 pesticides." }
                 ].map((item, i) => (
                   <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/[0.02] px-10 rounded-sm hover:border-[#c4a45e]/30 transition-all">
                      <AccordionTrigger className="text-[12px] font-black uppercase tracking-[0.4em] py-12 no-underline italic text-left">
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
        <footer className="bg-black pt-64 pb-16 px-12 md:px-24 border-t-8 border-[#c4a45e]">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
                 <div className="lg:col-span-7">
                    <Reveal>
                       <div className="flex flex-col mb-16">
                          <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic text-[#c4a45e]">Veridian.</span>
                          <span className="text-[12px] font-bold uppercase tracking-[1em] text-white/20 ml-2">Botanical Atelier Group</span>
                       </div>
                       <p className="text-white/20 max-w-sm mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                          La maîtrise absolue de l'art botanique. Cultivé pour l'élite mondiale dans notre sanctuaire californien.
                       </p>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-white/10" />
                          <div className="flex gap-10">
                             <Globe className="w-7 h-7 text-white/20 hover:text-[#c4a45e] transition-all cursor-pointer" />
                             <Dna className="w-7 h-7 text-white/20 hover:text-[#c4a45e] transition-all cursor-pointer" />
                             <Leaf className="w-7 h-7 text-white/20 hover:text-[#c4a45e] transition-all cursor-pointer" />
                          </div>
                       </div>
                    </Reveal>
                 </div>

                 <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c4a45e] mb-16 border-b border-[#c4a45e]/20 pb-4">Library</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Veridian_Gold
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Velvet_Night
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Obsidian_Bloom
                          </li>
                       </ul>
                    </div>
                    <div className="space-y-12">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c4a45e] mb-16 border-b border-[#c4a45e]/20 pb-4">Science</h4>
                       <ul className="space-y-8 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Lab_Results
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Terpene_Archive
                          </li>
                          <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-3 group">
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#c4a45e]" /> Consultation
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic text-center">
                 <div className="flex gap-16">
                    <span>©2026 VERIDIAN BOTANICAL ATELIER.</span>
                    <span className="hidden md:inline">//</span>
                    <span>CRAFT_CURE_CERTIFIED</span>
                 </div>
                 <div className="flex gap-16 font-mono text-[#c4a45e]/30">
                    <span>TERPENE_RETAINED_98%</span>
                    <span>PH_STABLE_6.2_NOMINAL</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #050805; }
        ::-webkit-scrollbar-thumb { background: #c4a45e; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 40s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
