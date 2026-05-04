"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { 
  ArrowUpRight, 
  Menu, 
  X, 
  Layers, 
  ShieldCheck,
  Plus,
  Play,
  ArrowRight,
  ChevronDown,
  Monitor,
  LayoutGrid,
  Zap,
  Camera,
  Maximize2,
  Minimize2,
  Box,
  Eye,
  Settings,
  Sparkles,
  Command,
  Activity,
  Image as ImageIcon
} from "lucide-react";
import "../premium.css";

// ─── DATA ──────────────────────────────────────────────────────────────────

const FRAME_MANIFESTS = [
  { 
    id: "FRM_01",
    title: "KINETIC_VOID", 
    category: "Motion Study",
    velocity: "v9.4_FPS",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80",
    desc: "A high-fidelity minimalist study of motion volumes within the spatial environment. Zero-latency visual synthesis."
  },
  { 
    id: "FRM_02",
    title: "NEURAL_SHUTTER", 
    category: "Generative Lens",
    velocity: "v3.1_EXPOSURE",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
    desc: "Planetary-scale distributed frames orchestrated through neural weight synthesis. High-fidelity visual routing."
  },
  { 
    id: "FRM_03",
    title: "VOID_CAPTURE", 
    category: "Spectral Frame",
    velocity: "v9.0_STARK",
    img: "https://images.unsplash.com/photo-1547005327-834182f8e05a?w=1200&q=80",
    desc: "A zero-latency capture engine built for the real-time synthesis of non-standard spatial artifacts through radical shutter injection."
  }
];

const METRICS = [
  { label: "Stability", val: "99.9%", desc: "Absolute architectural synchronization across all distributed frame edge nodes." },
  { label: "Bandwidth", val: "12 EB/s", desc: "Sustainable visual delivery through our dedicated high-fidelity frame backbone." },
  { label: "Reliability", val: "IMMUNE", desc: "Zero-leak frame logic verified through continuous adversarial stress-testing." }
];

const CAPABILITIES = [
  { icon: Camera, title: "Optic Forge", desc: "Engineering visual volumes through a lens of mathematical and structural purity." },
  { icon: Eye, title: "Kinetic Logic", desc: "Scaling motion interactions through distributed frame orchestration and logic synthesis." },
  { icon: Activity, title: "Pulse Sync", desc: "Synchronizing system spikes with real-time biological demand cycles for absolute sync." },
  { icon: Box, title: "Archival Shell", desc: "Leveraging heavy archival data fabrication for ultra-high fidelity visual protection." }
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Reveal({ children, className = "", delay = 0, y = 30 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── MAIN SPA ────────────────────────────────────────────────────────────────

export default function KineticLensSPA() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFrm, setActiveFrm] = useState(0);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.05]);

  return (
    <div className="min-h-screen bg-[#050508] text-[#eee] font-mono selection:bg-[#eee] selection:text-black">
      
      {/* ── KINETIC OVERLAY ── */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 z-[0] opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── NAVIGATION ── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-10 mix-blend-difference"
      >
        <div className="flex items-center gap-4">
          <Camera className="w-10 h-10 text-white" />
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">KINETIC<span className="text-white/30">//</span>LENS</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
          {["Manifest", "Reserve", "Logic", "Portal"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">/{item}</a>
          ))}
        </div>

        <button 
          onClick={() => setMenuOpen(true)}
          className="px-6 py-2 border border-white/20 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all text-white"
        >
          [INIT_CAPTURE]
        </button>
      </motion.nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[60] bg-[#050508] text-[#eee] p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-12">
              <span className="text-xl font-black uppercase tracking-tighter italic">KINETIC//LENS</span>
              <button onClick={() => setMenuOpen(false)} className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-10">
              {["KINETIC_MANIFEST", "CAPTURE_ARCHIVE", "LOGIC_SHELL", "CORE_TOPOLOGY", "SECURE_AUTH"].map((item, i) => (
                <motion.a 
                  key={item}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  href="#"
                  className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter hover:text-white/40 transition-all leading-none"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.5em] border-t border-white/10 pt-12 text-white/30">
              <span>CAPTURE_v9.4_STABLE</span>
              <span>GLOBAL_SYNC // ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&q=80" 
            alt="Hero Kinetic" 
            fill 
            className="object-cover grayscale brightness-50 contrast-125 opacity-20" 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <Reveal>
             <div className="flex items-center justify-center gap-4 mb-12">
               <span className="w-12 h-[1px] bg-white/20" />
               <span className="text-[10px] font-bold uppercase tracking-[1.5em] text-white/40">Technical_Photography_Laboratory</span>
               <span className="w-12 h-[1px] bg-white/20" />
             </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-8xl md:text-[16rem] font-black tracking-tighter leading-[0.75] uppercase italic text-white mb-20">
              RAW <br/> <span className="not-italic text-white/10">KINETIC.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-16 border-t border-white/10 pt-20">
              <p className="text-white/40 text-xl leading-relaxed font-light uppercase tracking-[0.2em] italic leading-loose text-center">
                Engineering the ultimate visual artifacts through distributed shutter orchestration. High-fidelity systems built for absolute structural precision and optic clarity.
              </p>
              <div className="flex gap-8">
                <button className="px-16 py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-black hover:text-white transition-all">
                  Manifest_Access
                </button>
                <button className="px-16 py-6 border border-white/20 text-white font-black uppercase text-xs tracking-[0.4em] hover:bg-white/5 transition-colors">
                  Atelier_Dossier
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
          <div className="flex flex-col gap-2">
            <span>KINETIC_v9_SYNC</span>
            <div className="w-48 h-[1px] bg-white/10" />
          </div>
          <div className="flex items-center gap-4 italic tracking-widest">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> OPTIC_STATUS: NOMINAL
          </div>
        </div>
      </section>

      {/* ── METRICS GRID ── */}
      <section className="py-40 bg-[#0a0a0d]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {METRICS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="bg-[#050508] p-24 group hover:bg-white/5 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-12 block group-hover:text-white/60">{s.label}</span>
                <h3 className="text-7xl font-black italic text-white mb-8 group-hover:text-white transition-colors">{s.val}</h3>
                <p className="text-xs text-white/30 font-light tracking-widest uppercase italic leading-loose">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FRAME SHOWCASE ── */}
      <section className="py-40 bg-black relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <Reveal className="mb-32">
             <div className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-white/10 pb-12">
               <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-white">
                 Frame <br/> <span className="text-white/20 not-italic">Archive.</span>
               </h2>
               <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-4 block italic">Manifest_Sequence_v9</span>
                  <div className="flex gap-4">
                    {FRAME_MANIFESTS.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveFrm(i)}
                        className={`w-16 h-1 transition-all ${activeFrm === i ? "bg-white w-32" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
               </div>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-8 relative aspect-video rounded-sm overflow-hidden border border-white/5 group bg-[#080808]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFrm}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0"
                >
                  <Image src={FRAME_MANIFESTS[activeFrm].img} alt={FRAME_MANIFESTS[activeFrm].title} fill className="object-cover grayscale contrast-125 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-12 left-12 flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">CORE_VELOCITY</span>
                 <span className="text-xl font-black text-white italic">{FRAME_MANIFESTS[activeFrm].velocity}</span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
               <motion.div
                  key={activeFrm}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
               >
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{FRAME_MANIFESTS[activeFrm].id} // FRM_DATA</span>
                 <h3 className="text-6xl font-black italic uppercase text-white tracking-tighter">{FRAME_MANIFESTS[activeFrm].title}</h3>
                 <div className="space-y-6 border-y border-white/10 py-12">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Category</span>
                       <span className="text-sm font-black text-white uppercase tracking-widest">{FRAME_MANIFESTS[activeFrm].category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Frame_Status</span>
                       <span className="text-sm font-black text-white uppercase tracking-widest italic">STABLE_OPTIC</span>
                    </div>
                 </div>
                 <p className="text-white/30 text-lg font-light italic leading-loose uppercase tracking-wide">
                   {FRAME_MANIFESTS[activeFrm].desc}
                 </p>
                 <button className="flex items-center gap-6 group">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-white">Access_Terminal</span>
                    <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white transition-all">
                       <ArrowUpRight className="w-6 h-6 text-white group-hover:text-black" />
                    </div>
                 </button>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-40 bg-[#050508] border-y border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <Reveal className="mb-32 text-center">
             <span className="text-[10px] font-bold uppercase tracking-[1em] text-white/40 mb-8 block italic">Operational Scope</span>
             <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-white">
                Technical <br/> <span className="text-white/20 not-italic">Expertise.</span>
             </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CAPABILITIES.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="bg-[#08080b] border border-white/5 p-12 hover:border-white/20 transition-all group">
                 <item.icon className="w-12 h-12 text-white/20 group-hover:text-white transition-colors mb-8" />
                 <h3 className="text-2xl font-black italic uppercase text-white mb-6">{item.title}</h3>
                 <p className="text-xs text-white/30 font-light tracking-widest uppercase italic leading-loose">
                   {item.desc}
                 </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPTIC INTERFACE ── */}
      <section className="py-40 bg-black overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
             <div className="relative aspect-square bg-[#08080b] border border-white/10 p-12 flex flex-col justify-between overflow-hidden group">
                <div className="absolute top-0 right-0 p-12">
                   <Command className="w-16 h-16 text-white/5 group-hover:text-white/10 transition-colors" />
                </div>
                <div className="grid grid-cols-4 gap-4 flex-1">
                   {Array(16).fill(null).map((_, i) => (
                     <motion.div 
                        key={i}
                        whileHover={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="border border-white/5 bg-white/5"
                     />
                   ))}
                </div>
                <div className="space-y-8 relative z-10 pt-12">
                   <h3 className="text-5xl font-black italic uppercase text-white">Optic <br/> <span className="text-white/20 not-italic">Synthesis.</span></h3>
                   <p className="text-white/30 text-lg leading-relaxed mb-12 font-light uppercase tracking-wide italic leading-loose">
                     A unified shell environment for the high-fidelity orchestration of planetary-scale visual enclaves. Built for those who monitor the systems.
                   </p>
                </div>
             </div>
          </Reveal>
          <div className="space-y-24">
             <Reveal delay={0.2}>
                <span className="text-[10px] font-bold uppercase tracking-[1em] text-white/40 mb-8 block italic">Protocol_Sequence</span>
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-white">Visual <br/> <span className="text-white/20 not-italic">Manifesto.</span></h2>
             </Reveal>
             <div className="space-y-12">
                {[
                  { n: "01", t: "Optic Synapse", d: "Connecting disparate visual nodes into a unified reactive environment." },
                  { n: "02", t: "Entropy Zero", d: "Aggressive reduction of system noise for absolute structural clarity." },
                  { n: "03", t: "Fidelity Push", d: "Delivering high-fidelity visual outputs across all edge nodes." }
                ].map((step, i) => (
                  <Reveal key={step.n} delay={i * 0.1 + 0.3} className="flex gap-12 group border-l border-white/10 pl-8 hover:border-white transition-colors">
                    <span className="text-4xl font-black italic text-white/10 group-hover:text-white transition-colors">{step.n}</span>
                    <div>
                      <h4 className="text-xl font-black uppercase italic text-white mb-2">{step.t}</h4>
                      <p className="text-xs text-white/40 font-light tracking-widest uppercase italic leading-loose">{step.d}</p>
                    </div>
                  </Reveal>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* ── CTA / ACCESS ── */}
      <section className="py-40 bg-[#050508] relative">
         <div className="max-w-[1600px] mx-auto px-8 md:px-16">
            <div className="bg-white text-black p-24 lg:p-40 relative overflow-hidden flex flex-col items-center text-center group">
               <div className="absolute inset-0 opacity-10 grayscale brightness-50 group-hover:opacity-20 transition-opacity">
                  <Image src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&q=80" alt="CTA Kinetic" fill className="object-cover" />
               </div>
               <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[1em] text-black/50 mb-12 block italic">Authorization_Required</span>
                  <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter leading-[0.8] uppercase mb-16">
                     Initiate <br/> <span className="text-black/30 not-italic">The Frame.</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-12 relative z-10">
                     <button className="px-20 py-8 bg-black text-white font-black uppercase text-sm tracking-[0.5em] hover:italic transition-all">
                        Request_Access
                     </button>
                     <button className="px-20 py-8 border border-black/20 text-black font-black uppercase text-sm tracking-[0.5em] hover:bg-black/5 transition-all">
                        Atelier_Dossier
                     </button>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black pt-40 pb-20 px-8 md:px-16 border-t border-white/10">
         <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
            <div className="lg:col-span-6">
               <div className="flex items-center gap-4 mb-12">
                 <Camera className="w-10 h-10 text-white" />
                 <span className="text-3xl font-black tracking-tighter uppercase italic text-white">KINETIC<span className="text-white/30">//</span>LENS</span>
               </div>
               <p className="text-white/40 text-sm font-light leading-relaxed uppercase tracking-[0.3em] mb-12 italic max-w-md">
                 Securing the future of visual objects through high-fidelity orchestration and radical visual clarity.
               </p>
               <div className="flex gap-12">
                 {["GITHUB", "TWITTER", "DISCORD", "LINKEDIN"].map(s => (
                   <a key={s} href="#" className="text-[10px] font-bold hover:text-white text-white/30 transition-colors tracking-[0.5em]">[{s}]</a>
                 ))}
               </div>
            </div>
            
            <div className="lg:col-span-2">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 mb-12">Systems</h4>
               <ul className="space-y-6 text-xs font-bold uppercase tracking-[0.4em]">
                 {["Archives", "Telemetry", "Shell", "Journal"].map(item => (
                   <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                 ))}
               </ul>
            </div>

            <div className="lg:col-span-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 mb-12">Support Inquiry</h4>
               <p className="text-sm text-white/40 font-light mb-12 italic uppercase tracking-[0.2em] leading-loose">
                 For high-priority enclaves, visual integrations, or architectural consultations, contact our core command center.
               </p>
               <a href="mailto:ops@kinetic-lens.io" className="text-3xl font-black italic hover:text-white transition-colors block border-b border-white/10 pb-8 uppercase tracking-tighter">
                  ops@kinetic-lens.io
               </a>
            </div>
         </div>

         <div className="max-w-[1600px] mx-auto flex flex-col md:row items-center justify-between gap-12 text-[9px] font-bold uppercase tracking-[0.8em] text-white/20 border-t border-white/5 pt-20">
            <p>© 2024 KINETIC LENS SYSTEMS. ALL RIGHTS RESERVED. GLOBAL // SYNC.</p>
            <div className="flex gap-16">
               <a href="#" className="hover:text-white transition-colors">[Visual_Vault]</a>
               <a href="#" className="hover:text-white transition-colors">[Terms_of_Service]</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
