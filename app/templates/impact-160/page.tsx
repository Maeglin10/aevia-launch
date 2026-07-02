"use client";
// @ts-nocheck

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
  Server, Cpu, Database, Activity, 
  ShieldCheck, Globe, Zap, HardDrive, 
  Terminal, Lock, Key, Eye, 
  Activity as ActivityIcon, Settings, Power, 
  Info, AlertTriangle, ChevronRight, 
  ArrowRight, Share2, Maximize2, 
  Download, ExternalLink, Archive, 
  Hash, Wifi, BarChart3, Microscope, 
  Fingerprint, Scan, Brain, Layers, 
  Frame, Box, Target, Orbit, 
  Atom, Satellite, Milestone, Gauge, 
  Timer, Cloud, Signal, Search,
  Navigation, Code, Command, Grid
} from "lucide-react"

/* ==========================================================================
   THE MONOLITH DATASET (ULTRA DENSITY)
   ========================================================================== */

const DATA_CENTERS = [
  {
    id: "node-arctic-01",
    name: "Frost-Byte Bunker",
    location: "Svalbard, Norway",
    capacity: "420 PB",
    latency: "18ms",
    cooling: "Passive Arctic Air",
    status: "Nominal"
  },
  {
    id: "node-sea-04",
    name: "Abyssal Grid",
    location: "North Atlantic Shelf",
    capacity: "1.2 EB",
    latency: "24ms",
    cooling: "Deep Water Siphon",
    status: "Optimal"
  },
  {
    id: "node-desert-09",
    name: "Solar Flare Array",
    location: "Sahara, Morocco",
    capacity: "850 PB",
    latency: "32ms",
    cooling: "Liquid Nitrogen Loop",
    status: "Syncing"
  }
]

const SYSTEM_METRICS = [
  { label: "Global Throughput", value: "4.2 Tbps", trend: "Stable" },
  { label: "Storage Fill", value: "68.4%", trend: "Expanding" },
  { label: "Request Velocity", value: "1.2M req/s", trend: "High" },
  { label: "Security Handshake", value: "Verified", trend: "Secure" }
]

const REDUNDANCY_LOGS = [
  { timestamp: "12:04:42", shard: "S-142", node: "EU-WEST", status: "SYNCED" },
  { timestamp: "12:04:45", shard: "S-143", node: "US-EAST", status: "REPLICATING" },
  { timestamp: "12:04:48", shard: "S-144", node: "AS-SOUTH", status: "VERIFIED" }
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

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[size:96px_96px]" />
    </div>
  )
}

function BrutalistBlock({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
  return (
    <div className="p-12 border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:bg-white/[0.05] transition-all cursor-crosshair relative overflow-hidden">
       <div className="absolute top-0 right-0 p-2 text-white/5 group-hover:text-white/10 transition-colors">
          <Icon className="w-24 h-24" />
       </div>
       <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4 block italic">{title}</span>
          <div className="text-4xl font-black tracking-tighter uppercase italic text-white group-hover:translate-x-2 transition-transform">
             {value}
          </div>
       </div>
       <div className="relative z-10 mt-12 flex items-center gap-4 text-[8px] font-bold text-white/10 uppercase tracking-widest italic">
          <Activity className="w-3 h-3 text-cyan-400" /> System_Nominal_Check_Passed
       </div>
    </div>
  )
}

/* ==========================================
   THE MONOLITH - MAIN INTERFACE
   ========================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function MonolithPremium() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [activeNode, setActiveNode] = useState(0)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Brutalist Scroll Effects
  const monolithScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5])
  const monolithRotate = useTransform(scrollYProgress, [0, 1], [0, 45])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textX = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div ref={containerRef} className="bg-[#050505] text-[#e0e2e5] font-mono selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
      
      {/* GLOBAL HUD OVERLAY */}
      <HUD_Overlay isTerminalOpen={isTerminalOpen} />

      <main>
        {/* ==========================================
            1. BRUTALIST IGNITION (HERO)
            ========================================== */}
        <section id="hero" className="relative h-screen flex flex-col justify-center items-center px-8 md:px-24 overflow-hidden pt-20">
          <GridBackground />
          
          <motion.div style={{ scale: monolithScale, rotate: monolithRotate, opacity: heroOpacity }} className="absolute z-0 pointer-events-none">
             <div className="w-[60vw] h-[80vh] bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute top-1/4 left-0 w-full h-px bg-white/5" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
                <div className="absolute top-3/4 left-0 w-full h-px bg-white/5" />
             </div>
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl">
             <Reveal>
                <div className="inline-flex items-center gap-4 px-6 py-2 border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mb-12 italic">
                   <Signal className="w-3 h-3" /> Infra_Status: Solid_State // All_Nodes_Linked
                </div>
                <motion.h1 style={{ x: textX }} className="text-7xl md:text-[16vw] font-black tracking-tighter uppercase mb-16 leading-[0.75] italic mix-blend-difference">{c?.heroHeadline ?? <>
                   The <br/> <span className="text-white/5 italic">Monolith.</span>
                </>}</motion.h1>
                <div className="grid md:grid-cols-3 gap-12 md:gap-24 text-left max-w-6xl mx-auto border-t border-white/5 pt-16">
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Core Directive</h3>
                      <p className="text-[11px] text-white/20 leading-loose uppercase tracking-[0.4em] font-bold italic">{c?.heroSubline ?? fd?.tagline ?? <>
                         Architecture brutale pour une infrastructure de données immuable. Nous forgeons le stockage de l'éternité numérique.
                      </>}</p>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-6xl font-black tracking-tighter italic text-white/40 leading-none mb-2">99.9%</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Uptime Protocol</span>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-6xl font-black tracking-tighter italic text-white/40 leading-none mb-2">∞_TB</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Expandable Storage</span>
                   </div>
                </div>
             </Reveal>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
             <div className="flex gap-12">
                <button className="px-12 py-6 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/80 transition-all shadow-2xl flex items-center gap-4 italic">
                   <Target className="w-4 h-4" /> Provision Node
                </button>
                <button 
                  onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                  className="px-12 py-6 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-4 italic"
                >
                   <Terminal className="w-4 h-4" /> Access Console
                </button>
             </div>
             <div className="text-right hidden md:block">
                <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10 italic">Scroll_Depth_To_Explore_Sub_Infrastructure</span>
             </div>
          </div>
        </section>

        {/* ==========================================
            2. INFRASTRUCTURE MATRIX (BRUTALIST GRID)
            ========================================== */}
        <section className="py-60 bg-[#080808] relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-24">
              <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-12">
                 <Reveal>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 block mb-6 italic underline underline-offset-8 decoration-white/10">Global // Server // Farm</span>
                    <h2 className="text-6xl md:text-[10vw] font-black uppercase tracking-tighter italic leading-none text-white">Registry.</h2>
                 </Reveal>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-4 italic">Registry // Infrastructure_Audit</span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Le Poids de l'Information</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
                 {DATA_CENTERS.map((node, i) => (
                   <Reveal key={node.id} delay={i * 0.1}>
                      <div className="bg-[#050505] p-20 flex flex-col h-full hover:bg-white/[0.02] transition-all group cursor-crosshair border-white/5 border-r last:border-r-0">
                         <div className="flex justify-between items-start mb-16">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                               <Server className="w-8 h-8" />
                            </div>
                            <span className="px-4 py-2 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">{node.status}</span>
                         </div>
                         
                         <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 italic text-white group-hover:translate-x-4 transition-transform">{node.name}</h3>
                         <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-12">{node.location}</div>
                         
                         <div className="space-y-8 mb-20 border-l border-white/10 pl-8">
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Capacity</span>
                               <span className="text-white group-hover:text-cyan-400 transition-colors">{node.capacity}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Latency</span>
                               <span className="text-white group-hover:text-cyan-400 transition-colors">{node.latency}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Cooling</span>
                               <span className="text-white group-hover:text-cyan-400 transition-colors">{node.cooling}</span>
                            </div>
                         </div>

                         <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Ref: {node.id}</span>
                            <button className="text-[10px] font-black uppercase text-white/40 flex items-center gap-4 group-hover:text-white transition-all">
                               Node_Audit <ChevronRight className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. THROUGHPUT MONITOR (INTERACTIVE DATA)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-40 items-center">
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 block mb-12 italic underline underline-offset-8 decoration-white/10">Throughput // Analysis</span>
                       <h2 className="text-7xl md:text-[9vw] font-light italic leading-none text-white mb-16 uppercase tracking-tighter">{c?.aboutTitle ?? fd?.businessName ?? <>
                          The <br/> <span className="not-italic font-black text-white/5 italic">Global_Stream.</span>
                       </>}</h2>
                       <p className="text-2xl font-light text-white/20 leading-relaxed mb-24 italic uppercase tracking-[0.2em] max-w-xl">{c?.aboutText ?? <>
                          Surveillance du flux de données en temps réel. Nos architectures de routage optimisent chaque paquet pour garantir une intégrité absolue, même sous charge extrême.
                       </>}</p>
                       <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 mb-24 shadow-2xl">
                          {SYSTEM_METRICS.map((metric, i) => (
                            <div key={i} className="p-16 bg-[#0a0a0c] group hover:bg-white/[0.02] transition-all border-r border-b last:border-r-0 border-white/5">
                               <div className="text-[10px] font-black uppercase text-white/20 mb-6 tracking-[0.4em]">{metric.label}</div>
                               <div className="text-5xl font-black text-white italic mb-6 tracking-tighter group-hover:translate-x-2 transition-transform">{metric.value}</div>
                               <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 italic">
                                  <Activity className="w-4 h-4 text-cyan-400" /> {metric.trend}
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 
                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-[#0a0a0c] border border-white/10 p-20 flex flex-col justify-between relative group overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-80 bg-white opacity-[0.02] blur-[150px] rounded-full group-hover:opacity-[0.05] transition-opacity" />
                          
                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">System_ID // MONO-SYNC-v14</span>
                                <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em]">Traffic_Heat_Map</span>
                             </div>
                             <Wifi className="w-6 h-6 text-white/20" />
                          </div>
                          
                          {/* NETWORK VISUALIZER (SVG) */}
                          <div className="relative z-10 flex flex-col items-center justify-center h-full">
                             <div className="w-48 h-48 border border-white/5 rounded-full flex items-center justify-center relative">
                                <motion.div 
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 border-t-2 border-white/20 rounded-full" 
                                />
                                <motion.div 
                                  animate={{ rotate: -360 }}
                                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-4 border-b-2 border-white/10 rounded-full" 
                                />
                                <Database className="w-16 h-16 text-white/10" />
                             </div>
                             <div className="mt-16 text-center space-y-6">
                                <div className="text-4xl font-black italic tracking-tighter text-white/40">TRAFFIC_NOMINAL</div>
                                <span className="text-[11px] font-bold text-white/10 uppercase tracking-[0.6em] block">Auth_Node: ZÜRICH_CENTRAL_01</span>
                             </div>
                          </div>

                          <div className="relative z-10 flex gap-6">
                             <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                <motion.div 
                                   animate={{ x: ["-100%", "100%"] }} 
                                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-white/20"
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
            4. REDUNDANCY PROTOCOLS (BRUTALIST STORY)
            ========================================== */}
        <section id="contact" className="py-60 bg-[#050505] relative overflow-hidden border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-40 items-center">
                 <div className="relative aspect-[3/4] overflow-hidden group border border-white/5 shadow-2xl">
                    <Image 
                       src="https://images.unsplash.com/photo-1558494949-ef010968d264?q=80&w=1200&auto=format&fit=crop" 
                       alt="Server Room Corridor" 
                       fill 
                       className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-white/5 mix-blend-color group-hover:opacity-0 transition-opacity" />
                    <div className="absolute inset-0 p-20 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                       <div className="text-white">
                          <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 mb-8 block italic underline underline-offset-8 decoration-white/10">Global // Redundancy // Unit</span>
                          <h4 className="text-6xl font-black tracking-tighter uppercase italic mb-12 mix-blend-difference">Structural <br/> Safety.</h4>
                          <button className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/20 pb-4 hover:border-white transition-all group">
                             Redundancy Protocols <ExternalLink className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <Reveal>
                       <div className="mb-24 text-left">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mb-8 block italic">Chapitre III // Reliability</span>
                          <h2 className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase text-white italic leading-none">Hard_State.</h2>
                       </div>
                       <p className="text-2xl font-light text-white/20 leading-relaxed italic mb-20 uppercase tracking-[0.2em]">
                          La redondance n'est pas un luxe, c'est une fondation. Chaque fragment de donnée est répliqué instantanément à travers plusieurs fuseaux horaires pour une résilience absolue.
                       </p>
                       <div className="space-y-20">
                          {[
                            { t: "Global Sharding", d: "Fragmentation intelligente des données à travers 128 nœuds géographiques indépendants." },
                            { t: "Zero-Knowledge", d: "Cryptage asymétrique de bout en bout garantissant que seul le propriétaire peut déchiffrer les données." },
                            { t: "Hot-Swap Backup", d: "Remplacement instantané des nœuds défaillants sans aucune interruption de service." }
                          ].map((step, i) => (
                            <div key={i} className="group flex gap-12 border-b border-white/5 pb-16 hover:border-white/20 transition-all cursor-default">
                               <div className="text-6xl font-black text-white/5 group-hover:text-white/20 transition-colors italic leading-none">0{i+1}</div>
                               <div>
                                  <h5 className="text-3xl font-black uppercase tracking-tight text-white mb-6 italic group-hover:translate-x-2 transition-transform">{step.t}</h5>
                                  <p className="text-[12px] text-white/20 uppercase tracking-[0.3em] font-bold leading-loose italic">{step.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* MEGA FOOTER */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-24 relative z-50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-6 mb-16">
                    <div className="w-16 h-16 bg-white flex items-center justify-center">
                      <Grid className="w-10 h-10 text-black" />
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter italic">THE<span className="text-white/20">MONOLITH.</span></span>
                 </div>
                 <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mb-20 italic">
                    "L'information est le seul monument qui ne s'effondre jamais." — Archive Monolith V.14
                 </p>
                 <div className="flex gap-16">
                    {["InfraLog", "NodeRegistry", "GitHub", "X_Protocol"].map(s => (
                      <Link key={s} href={ s === "LinkedIn" || s === "Linkedin" ? "https://linkedin.com" : s === "Contact" || s === "contact" ? "#contact" : `#${s.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors italic underline underline-offset-8 decoration-white/5">{s}</Link>
                    ))}
                 </div>
              </div>

              {[
                { t: "INFRASTRUCTURE", l: ["Bare Metal", "Arctic Nodes", "Abyssal Grid", "Solar Arrays"] },
                { t: "SERVICES", l: ["Data Sharding", "Quantum Crypt", "API Gateway", "SLA 99.9%"] },
                { t: "CONSOLE", l: ["Node Status", "Global Traffic", "Usage Audit", "Support"] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                  <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic">{col.t}</h4>
                  <ul className="flex flex-col gap-8">
                    {col.l.map(link => (
                      <li key={link} className="text-[11px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-[0.4em] italic">{link}</li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-16 flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">
              <span>© 2026 THE MONOLITH GLOBAL INFRASTRUCTURE AG. // ALL_RIGHTS_RESERVED</span>
              <div className="flex gap-16">
                 <span>STATUS: IMMUTABLE</span>
                 <span>LATENCY: 12ms (AVG)</span>
                 <span>v14.4.0-STABLE</span>
              </div>
           </div>
        </footer>
      </main>

      {/* CONSOLE OVERLAY (SIMULATED) */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-2xl w-full border border-white/10 p-16 relative bg-[#0a0a0c] shadow-2xl">
                <button onClick={() => setIsTerminalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                   <X className="w-10 h-10" />
                </button>
                <div className="flex flex-col gap-16">
                   <div className="flex items-center gap-6">
                      <Terminal className="w-10 h-10 text-white" />
                      <div>
                         <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Console_Auth</h2>
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">System_ID: MONO-CON-v14</span>
                      </div>
                   </div>
                   <div className="bg-white/5 p-8 font-mono text-[11px] leading-relaxed text-white/60 uppercase tracking-[0.2em] border border-white/5">
                      <div className="text-white mb-2 underline underline-offset-4 decoration-white/20 font-black">Boot Sequence:</div>
                      <div>{">"} Initializing Shard Handshake... [OK]</div>
                      <div>{">"} Syncing Global Node Registry... [OK]</div>
                      <div>{">"} Verified Auth_Token: *********-42 [OK]</div>
                      <div className="mt-6 flex items-center gap-4 animate-pulse">
                         <span className="w-2 h-4 bg-white" />
                         <span>Waiting for operator input...</span>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic italic">Operator_Action_Required</div>
                      <div className="flex gap-6">
                         <button className="flex-1 py-6 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/80 transition-all italic">Provision_Node</button>
                         <button className="flex-1 py-6 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all italic">Flush_Cache</button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ==========================================
   TECHNICAL SUB-COMPONENTS
   ========================================== */

function HUD_Overlay({ isTerminalOpen }: { isTerminalOpen: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
       {/* Corner Brackets */}
       <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-white/10" />
       <div className="absolute top-12 right-12 w-20 h-20 border-t-2 border-r-2 border-white/10" />
       <div className="absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 border-white/10" />
       <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-white/10" />

       {/* Top Status Bar */}
       <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-20 bg-black/60 backdrop-blur-2xl px-12 py-4 border border-white/10 rounded-none">
          <div className="flex items-center gap-6 text-white">
             <div className="w-3 h-3 bg-white animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">System_Link: IMMUTABLE // Shards: SYNCED</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-6 text-white/20">
             <Wifi className="w-4 h-4" /> 
             <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Global_Grid: SECURE</span>
          </div>
       </div>

       {/* Right Rotation Info */}
       <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden lg:block">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/5 italic">Unauthorized_Access_To_The_Core_Registry_Is_Strictly_Monitored_By_Global_Information_Security_Council</span>
       </div>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
