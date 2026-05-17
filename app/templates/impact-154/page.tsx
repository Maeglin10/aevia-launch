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
  History, Landmark, Award, Star, 
  ArrowRight, Menu, X, Plus, 
  Maximize2, Share2, Download, ExternalLink, 
  Archive, Search, Clock, Hash, 
  Layers, Frame, Eye, Lock, Crosshair,
  ShieldCheck, MapPin, ChevronRight, Play,
  BookOpen, PenTool, Radio, Activity,
  Database, Microscope, Fingerprint, Scan,
  Palette, Camera, Shield, FileText,
  UserCheck, Globe2, AlertCircle
} from "lucide-react"

/* ==========================================================================
   IVORY ARCHIVE DATASET (ULTRA DENSITY)
   ========================================================================== */

const COLLECTIONS = [
  {
    id: "art-01",
    title: "The Renaissance Veil",
    period: "15th Century",
    status: "Private_Vault",
    location: "Zurich Node",
    desc: "Une étude rare attribuée au cercle de Vinci, conservée dans des conditions atmosphériques contrôlées.",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc067985c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "art-02",
    title: "Celestial Marbles",
    period: "Classical Era",
    status: "In_Exhibition",
    location: "Paris Annex",
    desc: "Sculptures hellénistiques retrouvées lors de l'expédition de 1924 en mer Égée.",
    image: "https://picsum.photos/seed/gallery/1200/750"
  },
  {
    id: "art-03",
    title: "Gilded Manuscripts",
    period: "Medieval",
    status: "Restoration",
    location: "London Lab",
    desc: "Enluminures byzantines sur parchemin de soie, en cours de stabilisation pigmentaire.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200&auto=format&fit=crop"
  }
]

const PROVENANCE_LOGS = [
  { year: "1892", event: "Acquired by the von Hardenburg family, Vienna." },
  { year: "1946", event: "Recovered from the Salt Mines of Altaussee." },
  { year: "1978", event: "Private auction, Sotheby’s Geneva, Record Sale." },
  { year: "2024", event: "Secured by The Ivory Archive for conservation." }
]

const LAB_METRICS = [
  { label: "Humidity", value: "42.5%", status: "Nominal" },
  { label: "UV Exposure", value: "0.01 lux", status: "Optimal" },
  { label: "CO2 Levels", value: "350 ppm", status: "Secure" },
  { label: "Surface Temp", value: "18.2°C", status: "Stable" }
]

/* ==========================================================================
   ADVANCED ANIMATION COMPONENTS
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

function SectionTitle({ subtitle, title, alignment = "center" }: { subtitle: string, title: string, alignment?: "center" | "left" }) {
  return (
    <div className={`mb-32 ${alignment === "center" ? "text-center" : "text-left"}`}>
       <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#b4925e] mb-8 block italic underline underline-offset-8">
             {subtitle}
          </span>
          <h2 className="text-6xl md:text-[8vw] font-light italic leading-none tracking-tighter uppercase text-[#fdfcfb]" style={{ fontFamily: "serif" }}>
             {title}
          </h2>
       </Reveal>
    </div>
  )
}

/* ==========================================================================
   THE IVORY ARCHIVE - MAIN APPLICATION
   ========================================================================== */

export default function IvoryArchivePremium() {
  const [activeReport, setActiveReport] = useState(0)
  const [vaultOpen, setVaultOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax & Depth Effects
  const galleryX = useTransform(scrollYProgress, [0, 1], [0, -500])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  return (
    <div ref={containerRef} className="bg-[#0c0c0e] text-[#fdfcfb] font-sans selection:bg-[#b4925e] selection:text-black min-h-screen overflow-x-hidden">
      
      {/* GLOBAL HUD & NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full h-24 z-[100] px-8 md:px-20 flex items-center justify-between border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl">
         <Link href="/" className="flex flex-col group">
            <span className="text-3xl font-light tracking-[0.2em] uppercase text-white flex items-center gap-4">
               <Landmark className="w-8 h-8 text-[#b4925e]" />
               IVORY<span className="text-[#b4925e] font-black italic">.ARCHIVE</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.6em] text-white/20 uppercase italic">Elite Art Conservation & Private Registry</span>
         </Link>

         <div className="hidden lg:flex items-center gap-12">
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
               <Link href="#" className="hover:text-white transition-colors">Curated</Link>
               <Link href="#" className="hover:text-white transition-colors">The Lab</Link>
               <Link href="#" className="hover:text-white transition-colors">Provenance</Link>
               <Link href="#" className="hover:text-white transition-colors">Registry</Link>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button 
              onClick={() => setVaultOpen(true)}
              className="flex items-center gap-3 px-8 py-3 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
            >
               <Lock className="w-4 h-4" /> Collector Vault
            </button>
         </div>

         <button className="lg:hidden w-10 h-10 flex items-center justify-center border border-white/10">
            <Menu className="w-6 h-6" />
         </button>
      </nav>

      <main>
        {/* ==========================================
            1. THE PROLOGUE (HERO)
            ========================================== */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
             <Image 
                src="https://picsum.photos/seed/gallery/2400/1500" 
                alt="Classical Sculpture in Museum" 
                fill 
                className="object-cover opacity-20 grayscale"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-[#0c0c0e]" />
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl px-8">
             <Reveal>
                <div className="inline-flex items-center gap-4 px-4 py-1 border border-[#b4925e]/30 bg-[#b4925e]/5 text-[10px] font-bold uppercase tracking-[0.5em] text-[#b4925e] mb-12 italic">
                   Status // High_Security_Node: Zurich
                </div>
                <h1 className="text-7xl md:text-[14vw] font-light italic leading-[0.75] tracking-tighter uppercase mb-16" style={{ fontFamily: "serif" }}>
                   Heritage <br/> <span className="not-italic font-black text-white/5 italic">Eternalized.</span>
                </h1>
                <div className="grid md:grid-cols-3 gap-12 md:gap-24 text-left max-w-5xl mx-auto border-t border-white/10 pt-16">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#b4925e]">The Mandate</h3>
                      <p className="text-[11px] text-white/30 leading-loose uppercase tracking-widest font-bold italic">
                         Nous assurons la pérennité des chefs-d'œuvre mondiaux à travers une expertise scientifique et une conservation de haute sphère.
                      </p>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">1.4B</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Aggregate Vault Value (USD)</span>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">42</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Centuries of Provance</span>
                   </div>
                </div>
             </Reveal>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Explore_The_Repository</span>
             <div className="h-20 w-px bg-gradient-to-b from-[#b4925e] to-transparent" />
          </div>
        </section>

        {/* ==========================================
            2. THE GALLERY (Z-INDEX DEPTH)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre I // Curated Selection" title="The Repository." />
              
              <div className="grid md:grid-cols-3 gap-16 relative">
                 {COLLECTIONS.map((art, i) => (
                   <Reveal key={art.id} delay={i * 0.1} y={80}>
                      <div className="group relative bg-[#0c0c0e] border border-white/5 p-12 hover:border-[#b4925e]/30 transition-all duration-700 cursor-pointer">
                         <div className="relative aspect-[3/4] mb-12 overflow-hidden shadow-2xl">
                            <Image 
                               src={art.image} 
                               alt={art.title} 
                               fill 
                               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                            <div className="absolute top-6 left-6">
                               <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{art.period}</span>
                            </div>
                         </div>
                         
                         <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[#b4925e] transition-colors mb-6" style={{ fontFamily: "serif" }}>{art.title}</h3>
                         <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-widest mb-12">
                            <span>ID: {art.id}</span>
                            <span className="text-[#b4925e]">{art.status}</span>
                         </div>
                         <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic mb-12">
                            {art.desc}
                         </p>
                         <div className="flex justify-between items-center border-t border-white/5 pt-8">
                            <div className="flex items-center gap-3">
                               <MapPin className="w-3 h-3 text-[#b4925e]" />
                               <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{art.location}</span>
                            </div>
                            <button className="text-[9px] font-black uppercase tracking-widest text-[#b4925e] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                               Expertise Report <ChevronRight className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. CONSERVATION LAB (TECHNICAL DENSITY)
            ========================================== */}
        <section className="py-60 bg-[#0c0c0e] relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <SectionTitle subtitle="Chapitre II // The Science" title="Conservation Lab." alignment="left" />
                       <p className="text-xl font-light text-white/40 leading-relaxed italic mb-16 uppercase tracking-widest">
                          La préservation du patrimoine mondial exige une rigueur scientifique sans compromis. Notre laboratoire utilise l'imagerie multi-spectrale et la stabilisation atomique pour contrer les effets du temps.
                       </p>
                       <div className="grid grid-cols-2 gap-8 mb-20">
                          {LAB_METRICS.map((metric, i) => (
                            <div key={i} className="p-8 bg-black border border-white/5 hover:border-[#b4925e]/30 transition-all">
                               <div className="text-[8px] font-black uppercase text-[#b4925e] mb-2 tracking-[0.3em]">{metric.label}</div>
                               <div className="text-3xl font-light text-white mb-4 italic">{metric.value}</div>
                               <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-white/20 italic">
                                  <Activity className="w-3 h-3" /> {metric.status}
                               </div>
                            </div>
                          ))}
                       </div>
                       <button className="w-full py-6 border-2 border-[#b4925e] text-[#b4925e] text-[10px] font-black uppercase tracking-widest hover:bg-[#b4925e] hover:text-black transition-all shadow-2xl">
                          Request Lab Analysis Log
                       </button>
                    </Reveal>
                 </div>
                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-black border border-white/10 p-12 flex flex-col justify-between relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-40 bg-[#b4925e] opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.1] transition-opacity" />
                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">System_ID // ARCH-V4</span>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Multi-Spectral_Scan</span>
                             </div>
                             <Microscope className="w-5 h-5 text-[#b4925e]" />
                          </div>
                          
                          <div className="flex flex-col gap-12 relative z-10">
                             <div className="flex items-center justify-center gap-8">
                                <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center text-[#b4925e] shadow-[0_0_30px_rgba(180,146,94,0.1)]">
                                   <Palette className="w-12 h-12" />
                                </div>
                             </div>
                             <div className="text-center">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block mb-4 italic">Scan_Efficiency</span>
                                <div className="text-4xl font-black italic text-[#b4925e]">99.98% // SECURE</div>
                             </div>
                          </div>

                          <div className="flex gap-4 relative z-10">
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                   animate={{ x: ["-100%", "100%"] }} 
                                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-[#b4925e]"
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
            4. PROVENANCE TIMELINE (STORYTELLING)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="relative aspect-[4/5] overflow-hidden group">
                    <Image 
                       src="https://images.unsplash.com/photo-1510850473394-d236d1e3d0cd?q=80&w=1200&auto=format&fit=crop" 
                       alt="Art Restorer Working" 
                       fill 
                       className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all" />
                    <div className="absolute inset-0 p-16 flex flex-col justify-end">
                       <div className="text-white">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#b4925e] mb-4 block italic underline underline-offset-8">Featured Provenance // Case-09</span>
                          <h4 className="text-5xl font-light tracking-tighter uppercase italic mb-8" style={{ fontFamily: "serif" }}>The Royal <br/> Archive Trace.</h4>
                          <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border-b border-[#b4925e] pb-2">
                             Full Chronology <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <Reveal>
                       <SectionTitle subtitle="Chapitre III // Provenance" title="Chain of Custody." alignment="left" />
                       <div className="space-y-12">
                          {PROVENANCE_LOGS.map((log, i) => (
                            <div key={i} className="group border-l border-white/5 pl-12 hover:border-[#b4925e] transition-all cursor-default">
                               <div className="flex justify-between items-center mb-4">
                                  <span className="text-[10px] font-black text-[#b4925e] uppercase tracking-widest">{log.year}</span>
                                  <History className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                               </div>
                               <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold leading-relaxed">{log.event}</p>
                            </div>
                          ))}
                       </div>
                       <div className="mt-20 pt-10 border-t border-white/5">
                          <p className="text-xs text-white/20 italic font-light leading-relaxed">
                             Toute pièce enregistrée auprès de The Ivory Archive bénéficie d'une authentification certifiée sur protocole blockchain privé, garantissant l'intégrité de son histoire.
                          </p>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            5. THE REGISTRY (PRIVATE ACCESS)
            ========================================== */}
        <section className="py-60 bg-white text-black relative">
           <div className="max-w-[1200px] mx-auto px-8 md:px-20 text-center">
              <Reveal>
                 <SectionTitle subtitle="Acquisitions // Privilège" title="Registry Application." />
                 <p className="max-w-2xl mx-auto text-xl font-light text-black/40 leading-relaxed italic mb-20 uppercase tracking-widest">
                    L'accès à notre registre privé et aux opportunités d'acquisition est réservé aux institutions muséales et aux collectionneurs certifiés.
                 </p>
                 
                 <form className="max-w-xl mx-auto space-y-12" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Surname</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Sterling" />
                       </div>
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Entity</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Private Institution" />
                       </div>
                    </div>
                    <div className="border-b border-black/10 py-4 text-left">
                       <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Digital Signature</label>
                       <input type="email" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="alistair@sterling.ch" />
                    </div>
                    <button className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#b4925e] transition-all shadow-2xl">
                       Request Acquisition Handshake
                    </button>
                 </form>
              </Reveal>
           </div>
        </section>

        {/* MEGA FOOTER */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-20 relative z-50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-[#b4925e] flex items-center justify-center rounded-sm">
                       <Landmark className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-3xl font-light tracking-[0.2em] uppercase">IVORY<span className="text-[#b4925e] font-black">.ARCHIVE</span></span>
                 </div>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-16 italic">
                    "La conservation est l'art de faire taire le temps pour laisser parler l'histoire." — Archive Ivory V.4
                 </p>
                 <div className="flex gap-12">
                    {["Camera", "ArtsNet", "UNESCO_Partner", "LinkedIn"].map(s => (
                       <Link key={s} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#b4925e] transition-colors italic">{s}</Link>
                    ))}
                 </div>
              </div>

              {[
                { t: "REPOSITORY", l: ["Renaissance", "Classical", "Medieval", "Contemporary"] },
                { t: "SERVICES", l: ["Conservation Lab", "Expertise", "Provenance", "Acquisition"] },
                { t: "NODES", l: ["Zurich Hub", "London Lab", "Paris Annex", "Tokyo Node"] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                   <h4 className="text-[10px] font-black text-[#b4925e] uppercase tracking-[0.5em] italic">{col.t}</h4>
                   <ul className="flex flex-col gap-6">
                      {col.l.map(link => (
                         <li key={link} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic">{link}</li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
              <span>© 2026 THE IVORY ARCHIVE FOUNDATION. // ALL_RIGHTS_RESERVED</span>
              <div className="flex gap-12">
                 <span>SECURITY: LVL_9</span>
                 <span>LATENCY: 14ms</span>
                 <span>v4.2.18</span>
              </div>
           </div>
        </footer>
      </main>

      {/* COLLECTOR VAULT OVERLAY (SIMULATED) */}
      <AnimatePresence>
        {vaultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-md w-full border border-[#b4925e]/30 p-12 relative bg-[#0c0c0e]">
                <button onClick={() => setVaultOpen(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                </button>
                <div className="flex flex-col items-center gap-12">
                   <div className="w-20 h-20 bg-[#b4925e]/10 flex items-center justify-center rounded-full">
                      <Fingerprint className="w-10 h-10 text-[#b4925e]" />
                   </div>
                   <div className="text-center">
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Collector_Handshake</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 leading-relaxed">
                         Veuillez scanner votre identité biométrique ou entrer votre clé d'accréditation privée pour accéder au catalogue d'acquisition confidentiel.
                      </p>
                   </div>
                   <div className="w-full space-y-4">
                      <input 
                         type="text" 
                         placeholder="IDENT_ACCESS_KEY"
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] outline-none focus:border-[#b4925e] text-white"
                      />
                      <button className="w-full py-4 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest">
                         Authenticate Access
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