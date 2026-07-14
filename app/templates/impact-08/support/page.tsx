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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

export default function SupportPage() {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-500/40 selection:text-white min-h-dvh overflow-x-clip">
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
                className={`hover:text-white transition-colors ${item.key === "support" ? "text-blue-500 font-extrabold" : ""}`}
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
                         className={`text-xl font-black uppercase tracking-widest hover:text-blue-500 transition-colors ${item.key === "support" ? "text-blue-500" : "text-white/60"}`}
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

      <main className="pt-20 bg-white">
        <section className="py-32 px-8 md:px-24 bg-white text-black border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Support_Department</div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-8">
                Common <span className="opacity-20">Queries.</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 italic">Logistics // Maintenance // Worldwide Assistance</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4 mb-24">
              {[
                { q: "What is the typical wait time for a bespoke unit?", a: "Each Vulcan unit is hand-assembled in Modena. Production typically takes between 14 to 22 months from design freeze." },
                { q: "Do you offer international delivery?", a: "Yes. Every owner is assigned a dedicated Flying Technician and global concierge who manages white-glove transport." },
                { q: "Is the Stratos E road-legal?", a: "The Stratos E is homologated for road use in the EU, UK, and USA. Track-only variants are also available." },
                { q: "What is the maintenance cycle of a Vulcan engine?", a: "A complete diagnostic is performed every 10,000 km or annually by a certified Vulcan Flying Technician, who is dispatched to your private garage anywhere in the world." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-2 border-black/5 bg-black/[0.02] px-10 rounded-sm hover:border-black/20 transition-all">
                   <AccordionTrigger className="text-xs font-black uppercase tracking-[0.3em] py-10 no-underline italic text-left">
                      {item.q}
                   </AccordionTrigger>
                   <AccordionContent className="text-[11px] font-medium text-black/50 tracking-[0.1em] uppercase italic leading-loose pb-10">
                      {item.a}
                   </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="border-2 border-black/10 p-12 bg-black/[0.01]">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-black">The Flying Technician Program</h3>
              <p className="text-xs text-black/50 leading-relaxed uppercase italic font-medium">
                Pour assurer des performances constantes sans contraindre nos clients à transporter leurs véhicules vers notre usine en Italie, nous disposons d'une équipe de mécaniciens de course d'élite prêts à intervenir directement chez vous sous 48h.
              </p>
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
