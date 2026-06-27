"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Zap, Activity, Target, Layers, Box, Hexagon, ArrowUpRight,
  Terminal, Settings, Power, Info, 
  AlertTriangle, ChevronRight, ArrowRight, 
  Share2, Maximize2, Download, ExternalLink, 
  Archive, Hash, BarChart3, Fingerprint, Scan, 
  Briefcase, Wind, Timer, Lightbulb, Command, Grid, 
  Radar, Orbit, Atom, Search, Cpu, Wrench, Hammer, 
  Cog, Hand, Accessibility, Bot, Sparkles, Infinity , 
  Code2, Cloud, HardDrive, Key, MousePointer2, 
  Globe, Layout, Smartphone, PenTool, Camera, 
  Music, Film, Palette, MessageSquare, Send,
  Gauge, Disc, Waves, ShieldCheck, Thermometer, 
  Flame, Battery, Radio, Signal, Milestone, 
  FlaskConical, Microscope, Ghost, Binary, Database,
  Rocket, PlaneTakeoff, Compass, Map, RadioIcon,
  CircleDot, Waves as WaveIcon, Pickaxe, Mountain, Gem,
  Drill, Telescope, MilestoneIcon, Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const FLEET = [
  {
    id: "vul-ty-01",
    name: "Tyrant GT",
    class: "Grand Tourer",
    power: "1200 HP",
    torque: "1400 Nm",
    topSpeed: "385 km/h",
    accel: "2.1s",
    desc: "L'apogée du Grand Tourisme. Un moteur V12 bi-turbo couplé à un système hybride de récupération d'énergie issu de la Formule 1.",
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1600&q=80",
    color: "#3b82f6"
  },
  {
    id: "vul-ap-08",
    name: "Apex EVO",
    class: "Track Focused",
    power: "980 HP",
    torque: "1100 Nm",
    topSpeed: "340 km/h",
    accel: "1.9s",
    desc: "Conçue pour la piste. Une carrosserie entièrement en carbone pré-imprégné avec un appui aérodynamique actif de 800kg à 250km/h.",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80",
    color: "#ef4444"
  },
  {
    id: "vul-st-15",
    name: "Stratos E",
    class: "Electric Hypercar",
    power: "2000 HP",
    torque: "2500 Nm",
    topSpeed: "410 km/h",
    accel: "1.7s",
    desc: "Le futur électrique. Quatre moteurs indépendants pilotés par une IA de vectorisation de couple en temps réel.",
    img: "https://images.unsplash.com/photo-1611605645802-c21be743c321?w=1600&q=80",
    color: "#10b981"
  }
]

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

function HUD_Telemetry() {
  return (
    <div className="fixed top-24 right-12 z-40 hidden xl:flex flex-col gap-8 items-end pointer-events-none">
       <div className="flex flex-col items-end border-r-2 border-blue-500/30 pr-6 py-2">
          <div className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-2">Vulcan_System_V4.2</div>
          <div className="text-2xl font-mono text-white tracking-tighter">44.12.08</div>
          <div className="text-[8px] font-bold text-white/30 uppercase mt-1">Modena // Italy</div>
       </div>
       <div className="space-y-4">
          {[1, 0.8, 1.2, 0.6].map((h, i) => (
             <div key={i} className="flex gap-1 items-end h-12">
                <motion.div 
                  className="w-1 bg-blue-500/40"
                  animate={{ height: ["20%", "80%", "40%"] }}
                  transition={{ duration: 2, repeat: 999999 , delay: i * 0.2 }}
                />
             </div>
          ))}
       </div>
    </div>
  )
}

export default function EngineeringPage() {
  const containerRef = useRef(null)

  const aeroSteps = [
    { title: "Active Aero Coeffs", val: "0.24 - 0.38 Cd", desc: "Ailerons adaptatifs calibrés en millisecondes pour maximiser la force d'appui en courbe tout en maintenant la traînée à son minimum sur les lignes droites." },
    { title: "Silicon Escapement Vectoring", val: "4000 Cycles/sec", desc: "Notre contrôleur central de vectorisation ajuste le couple indépendant sur chaque roue 4000 fois par seconde, éliminant tout sous-virage mécanique." },
    { title: "Dynamic Energy Recovery", val: "800V Architecture", desc: "Système de récupération cinétique au freinage réinjectant instantanément la force stockée dans des supercondensateurs de grade aéronautique." }
  ];

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-500/40 selection:text-white min-h-screen overflow-x-clip">
      <HUD_Telemetry />
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/80 backdrop-blur-md">
         <Link href="/templates/impact-08" className="flex flex-col cursor-pointer">
            <span className="text-2xl font-black tracking-[-0.05em] uppercase leading-none italic">Vulcan</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-blue-500 -mt-1 ml-1">Motor Group Modena</span>
         </Link>
         <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-white/40">
            {[
              { name: "The Fleet", key: "fleet", path: "/templates/impact-08/fleet" },
              { name: "Engineering", key: "engineering", path: "/templates/impact-08/engineering" },
              { name: "The Atelier", key: "atelier", path: "/templates/impact-08/atelier" },
              { name: "Support", key: "support", path: "/templates/impact-08/support" }
            ].map(item => (
              <Link 
                key={item.key} 
                href={item.path} 
                className={`hover:text-white transition-colors ${item.key === "engineering" ? "text-blue-500 font-extrabold" : ""}`}
              >
                [ {item.name.replace(" ", "_")} ]
              </Link>
            ))}
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Active_Node</div>
               <div className="text-[10px] font-bold">Modena_01</div>
            </div>
            
            <Sheet>
               <SheetTrigger className="md:hidden p-3 border border-white/10 rounded-full hover:border-blue-500 transition-colors">
                     <Menu className="w-5 h-5 text-white" />
                  </SheetTrigger>
               <SheetContent side="right" className="bg-[#050505] border-white/5 p-12 overflow-y-auto">
                  <div className="flex flex-col gap-8 mt-16 text-left font-mono">
                     {[
                       { name: "Home", key: "home", path: "/templates/impact-08" },
                       { name: "The Fleet", key: "fleet", path: "/templates/impact-08/fleet" },
                       { name: "Engineering", key: "engineering", path: "/templates/impact-08/engineering" },
                       { name: "The Atelier", key: "atelier", path: "/templates/impact-08/atelier" },
                       { name: "Support", key: "support", path: "/templates/impact-08/support" },
                       { name: "Legal Mentions", key: "legal", path: "/templates/impact-08/legal" }
                     ].map(item => (
                       <Link 
                         key={item.key} 
                         href={item.path} 
                         className={`text-xl font-black uppercase tracking-widest hover:text-blue-500 transition-colors ${item.key === "engineering" ? "text-blue-500" : "text-white/60"}`}
                       >
                         {item.name.replace(" ", "_")}
                       </Link>
                     ))}
                  </div>
               </SheetContent>
            </Sheet>

            <Link href="/templates/impact-08/atelier" className="p-3 border border-white/10 rounded-full hover:border-blue-500 transition-colors group inline-block">
               <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </Link>
         </div>
      </nav>

      <main className="pt-20">
        <section id="about" className="py-32 px-8 md:px-24 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Dynamics_Lab</div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
                Advanced <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Science.</span>
              </h1>
              <p className="max-w-xl mx-auto text-sm text-white/40 uppercase font-light italic leading-relaxed">
                Chez Vulcan, la physique n'est pas une limite, c'est notre matière première. Découvrez les innovations qui séparent nos unités du reste de la production mondiale.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
              {aeroSteps.map((step, i) => (
                <div key={i} className="border border-white/5 bg-[#080808] p-10 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">LOG_NODE_0{i+1}</div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">{step.title}</h3>
                    <div className="text-3xl font-mono text-[#f0f0f0] font-bold italic mb-6">{step.val}</div>
                    <p className="text-xs text-white/40 leading-relaxed uppercase italic font-medium">{step.desc}</p>
                  </div>
                  <div className="w-12 h-1 bg-blue-500 mt-8" />
                </div>
              ))}
            </div>

            <div className="border border-white/5 bg-zinc-950 p-12 flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2 aspect-video relative">
                <img src="https://images.unsplash.com/photo-1611605645802-c21be743c321?w=800&q=80" alt="Aerodynamics tunnel" className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Wind_Tunnel_Report</div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Thermal & Aerodynamic Control</h3>
                <p className="text-sm text-white/40 leading-relaxed uppercase italic font-light mb-8">
                  En optimisant les flux sous le châssis via un effet de sol venturi actif, nous avons éliminé la nécessité d'un aileron arrière massif permanent sur le Tyrant GT, préservant ses lignes sculpturales tout en garantissant une stabilité absolue à plus de 380 km/h.
                </p>
                <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                  <div><span className="text-white/20 block">AIR_RESISTANCE</span><span className="text-white font-bold">0.24 Cd</span></div>
                  <div><span className="text-white/20 block">DOWNFORCE</span><span className="text-white font-bold">850 KG</span></div>
                  <div><span className="text-white/20 block">VORTEX_FLOW</span><span className="text-green-500 font-bold">NOMINAL</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black pt-48 pb-16 px-8 md:px-24 border-t-8 border-blue-600">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-48">
               <div className="lg:col-span-7">
                  <Reveal>
                     <Link href="/templates/impact-08" className="flex flex-col mb-16 cursor-pointer inline-block">
                        <span className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.7] italic">Vulcan</span>
                        <span className="text-[12px] font-bold uppercase tracking-[0.8em] text-blue-500 ml-2">Motor Group Modena</span>
                     </Link>
                     <p className="text-white/20 max-w-md mb-20 text-sm font-light uppercase tracking-widest leading-loose italic">
                        L'excellence absolue dans la performance automobile. Conçue pour l'élite mondiale dans notre sanctuaire italien.
                     </p>
                     <div className="flex gap-8 items-center">
                        <div className="w-24 h-[1px] bg-white/10" />
                        <div className="flex gap-8">
                           <Globe className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                           <RadioIcon className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                           <Share2 className="w-6 h-6 text-white/20 hover:text-blue-500 transition-all cursor-pointer" />
                        </div>
                     </div>
                  </Reveal>
               </div>

               <div className="lg:col-span-5 grid grid-cols-2 gap-16">
                  <div className="space-y-12">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 border-b border-blue-500/20 pb-4">The_Fleet</h4>
                     <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-white/30">
                        {FLEET.map(item => (
                          <li key={item.id} className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                             <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> 
                             <Link href="/templates/impact-08/fleet">{item.name.replace(" ", "_")}</Link>
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-12">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 border-b border-blue-500/20 pb-4">Experience</h4>
                     <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-white/30">
                        <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> 
                           <Link href="/templates/impact-08/atelier">The_Atelier</Link>
                        </li>
                        <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> 
                           <Link href="/templates/impact-08/engineering">Racing_Dept</Link>
                        </li>
                        <li className="hover:text-white cursor-pointer transition-all italic flex items-center gap-2 group">
                           <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> 
                           <Link href="/templates/impact-08/support">Support_Logs</Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
               <div className="flex flex-wrap gap-8">
                  <span>©2026 VULCAN MOTOR GROUP MODENA.</span>
                  <span className="hidden md:inline">//</span>
                  <Link href="/templates/impact-08/legal" className="hover:text-blue-500 transition-colors">MENTIONS LEGALES</Link>
               </div>
               <div className="flex gap-12 font-mono">
                  <span className="text-blue-500/40">TELEMETRY_LINK_ESTABLISHED</span>
                  <span className="text-blue-500/40">LOAD_0.12%</span>
               </div>
            </div>
         </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 6px; background: #050505; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
