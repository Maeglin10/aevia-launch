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
  UtensilsCrossed,
  Eye,
  Maximize2,
  Minimize2,
  Box,
  Settings,
  Sparkles,
  Command,
  Activity,
  Ruler,
  Wind,
  Droplets
} from "lucide-react";
import "../premium.css";

// ─── DATA ──────────────────────────────────────────────────────────────────

const DISH_MANIFESTS = [
  { 
    id: "DSH_01",
    title: "ZEN_BROTH", 
    category: "Structural Study",
    temperature: "v9.4_HOT",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    desc: "A singular exploration of absolute clarity within liquid volumes. High-fidelity flavor synthesis."
  },
  { 
    id: "DSH_02",
    title: "NEURAL_SASHIMI", 
    category: "Tactile Interface",
    temperature: "v3.1_COLD",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80",
    desc: "Planetary-scale distributed textures orchestrated through neural weight synthesis. Zero-latency culinary objects."
  },
  { 
    id: "DSH_03",
    title: "VOID_TEMPURA", 
    category: "Functional Core",
    temperature: "v9.0_EXPERIMENTAL",
    img: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=1200&q=80",
    desc: "A zero-latency texture engine built for the real-time synthesis of non-standard culinary artifacts through radical heat injection."
  }
];

const METRICS = [
  { label: "Purity", val: "99.9%", desc: "Absolute architectural synchronization across all distributed culinary edge nodes." },
  { label: "Throughput", val: "12 EB/s", desc: "Sustainable flavor delivery through our dedicated high-fidelity kitchen backbone." },
  { label: "Reliability", val: "IMMUNE", desc: "Zero-leak culinary logic verified through continuous adversarial stress-testing." }
];

const CAPABILITIES = [
  { icon: Ruler, title: "Culinary Forge", desc: "Engineering dish volumes through a lens of mathematical and structural purity." },
  { icon: Eye, title: "Zen Logic", desc: "Scaling flavor interactions through distributed culinary orchestration and logic synthesis." },
  { icon: Activity, title: "Pulse Sync", desc: "Synchronizing appetite spikes with real-time biological demand cycles for absolute sync." },
  { icon: Box, title: "Archival Shell", desc: "Leveraging heavy archival data fabrication for ultra-high fidelity culinary protection." }
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

export default function ZenKitchenSPA() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDsh, setActiveDsh] = useState(0);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.05]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111] font-mono selection:bg-[#111] selection:text-white">
      
      {/* ── ZEN OVERLAY ── */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 z-[0] opacity-[0.05] pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* ── NAVIGATION ── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-10 mix-blend-difference"
      >
        <div className="flex items-center gap-4">
          <UtensilsCrossed className="w-10 h-10 text-white" />
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">ZEN<span className="text-white/30">//</span>KITCHEN</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
          {["Manifest", "Reserve", "Atelier", "Portal"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">/{item}</a>
          ))}
        </div>

        <button 
          onClick={() => setMenuOpen(true)}
          className="px-6 py-2 border border-white/20 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all text-white"
        >
          [INIT_RESERVATION]
        </button>
      </motion.nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[60] bg-[#fcfcfc] text-black p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center border-b border-black/5 pb-12">
              <span className="text-xl font-black uppercase tracking-tighter italic">ZEN//KITCHEN</span>
              <button onClick={() => setMenuOpen(false)} className="w-12 h-12 flex items-center justify-center border border-black/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-12 text-center md:text-left">
              {["DISH_MANIFEST", "RESERVE_ARCHIVE", "CULINARY_FORGE", "ASSET_ENCLAVE", "SECURE_AUTH"].map((item, i) => (
                <motion.a 
                  key={item}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  href="#"
                  className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter hover:text-black/40 transition-all leading-none"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.5em] border-t border-black/5 pt-12 text-black/30">
              <span>CULINARY_PRACTICE</span>
              <span>EST. 2018 // KYOTO</span>
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
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80" 
            alt="Hero Culinary" 
            fill 
            className="object-cover grayscale brightness-50 contrast-125 opacity-30" 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fcfcfc]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[2.5em] text-black/40 mb-12 block italic">Culinary Endurance</span>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-8xl md:text-[18rem] font-black tracking-tighter leading-[0.75] uppercase italic text-black mb-20">
              RAW <br/> <span className="not-italic text-black/10">ZEN.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-16 border-t border-black/10 pt-20">
              <p className="text-black/40 text-xl leading-relaxed font-light uppercase tracking-[0.3em] italic leading-loose text-center">
                Engineering the ultimate culinary archives through distributed flavor orchestration. High-fidelity systems built for absolute structural precision and narrative clarity.
              </p>
              <div className="flex gap-8">
                <button className="px-16 py-6 bg-black text-white font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                  Manifest_Access
                </button>
                <button className="px-16 py-6 border border-black/20 text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-black/5 transition-colors">
                  Atelier_Dossier
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">
          <div className="flex flex-col gap-2">
            <span>KYOTO // ATELIER</span>
            <div className="w-48 h-[1px] bg-black/10" />
          </div>
          <div className="flex items-center gap-4 italic uppercase tracking-widest">
             <span className="animate-pulse">●</span> CULINARY_STATUS: NOMINAL
          </div>
        </div>
      </section>

      {/* ── METRICS GRID ── */}
      <section className="py-40 bg-[#fcfcfc]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
            {METRICS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="bg-white p-24 group hover:bg-black/5 transition-all duration-700">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-12 block group-hover:text-black/60">{s.label}</span>
                <h3 className="text-7xl font-black italic text-black mb-8 group-hover:text-black transition-colors">{s.val}</h3>
                <p className="text-xs text-black/30 font-light tracking-widest uppercase italic leading-loose group-hover:text-black/60">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DISH SHOWCASE ── */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <Reveal className="mb-32">
             <div className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-black/10 pb-12">
               <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-black">
                 Dish <br/> <span className="text-black/20 not-italic">Archive.</span>
               </h2>
               <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-4 block italic">Manifest_Sequence_2024</span>
                  <div className="flex gap-4">
                    {DISH_MANIFESTS.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveDsh(i)}
                        className={`w-16 h-1 transition-all ${activeDsh === i ? "bg-black w-32" : "bg-black/10"}`}
                      />
                    ))}
                  </div>
               </div>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-8 relative aspect-video rounded-sm overflow-hidden border border-black/5 group bg-[#ddd]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDsh}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0"
                >
                  <Image src={DISH_MANIFESTS[activeDsh].img} alt={DISH_MANIFESTS[activeDsh].title} fill className="object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-[2s]" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-12 left-12 flex flex-col gap-4">
                 <span className="text-[10px] font-black uppercase tracking-widest bg-black/80 backdrop-blur-md text-white px-6 py-2 border border-white/5">{DISH_MANIFESTS[activeDsh].temperature} // ADVISORY</span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
               <motion.div
                  key={activeDsh}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
               >
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/60">{DISH_MANIFESTS[activeDsh].id} // ASSET</span>
                 <h3 className="text-6xl md:text-8xl font-black italic uppercase text-black tracking-tighter">{DISH_MANIFESTS[activeDsh].title}</h3>
                 <div className="space-y-6 border-y border-black/10 py-12">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Category</span>
                       <span className="text-sm font-black text-black uppercase tracking-widest">{DISH_MANIFESTS[activeDsh].category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Dish_Status</span>
                       <span className="text-sm font-black text-black uppercase tracking-widest italic">Stable_Optical</span>
                    </div>
                 </div>
                 <p className="text-black/30 text-lg font-light italic leading-loose uppercase tracking-wide">
                   {DISH_MANIFESTS[activeDsh].desc}
                 </p>
                 <button className="flex items-center gap-6 group">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-black">Request_Manifest</span>
                    <div className="w-16 h-16 border border-black/10 rounded-full flex items-center justify-center group-hover:bg-black transition-all">
                       <ArrowUpRight className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                    </div>
                 </button>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-40 bg-[#fcfcfc] border-y border-black/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <Reveal className="mb-32 text-center">
             <span className="text-[10px] font-bold uppercase tracking-[1em] text-black/40 mb-8 block italic">Operational Scope</span>
             <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-black">
                Technical <br/> <span className="text-black/20 not-italic">Expertise.</span>
             </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
            {CAPABILITIES.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="bg-white p-12 group hover:bg-black/5 transition-all duration-700">
                 <item.icon className="w-12 h-12 text-black/20 group-hover:text-black transition-colors mb-8" />
                 <h3 className="text-2xl font-black italic uppercase text-black mb-6">{item.title}</h3>
                 <p className="text-xs text-black/40 group-hover:text-black font-light tracking-widest uppercase italic leading-loose transition-colors">
                   {item.desc}
                 </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER / LABORATORY ── */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
             <div className="relative aspect-square bg-[#fcfcfc] border border-black/5 p-20 flex flex-col justify-center group overflow-hidden">
                <div className="absolute top-0 right-0 p-12">
                   <Box className="w-16 h-16 text-black/5 group-hover:text-black/10 transition-colors" />
                </div>
                <Sparkles className="w-16 h-16 text-black mb-12" />
                <h3 className="text-5xl font-black italic uppercase text-black mb-8">Culinary <br/> <span className="text-black/20 not-italic">Atelier.</span></h3>
                <p className="text-black/40 text-lg leading-relaxed mb-12 font-light uppercase tracking-wide italic leading-loose">
                  Our Kyoto atelier leverages heavy archival culinary fabrication and distributed flavor orchestration for the production of non-standard gastronomic artifacts. We push the tectonic limits of spatial dining.
                </p>
                <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-black/30">
                   <span>[01] FLAVOR_BOND</span>
                   <span>[02] TACTILE_SYNTHESIS</span>
                </div>
             </div>
          </Reveal>
          <div className="space-y-24">
             <Reveal delay={0.2}>
                <span className="text-[10px] font-bold uppercase tracking-[1em] text-black/40 mb-8 block italic">Curation_Sequence</span>
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-black">Culinary <br/> <span className="text-black/20 not-italic">Manifesto.</span></h2>
             </Reveal>
             <div className="space-y-12">
                {[
                  { n: "01", t: "Sectional Audit", d: "Rigorous cutting of complex culinary volumes to reveal interior structural potential." },
                  { n: "02", t: "Flavor Stress", d: "Simulation of high-fidelity visual performance under extreme archival loads." },
                  { n: "03", t: "Archive Aging", d: "Analyzing the interaction of archival culinary models with digital weathering." }
                ].map((step, i) => (
                  <Reveal key={step.n} delay={i * 0.1 + 0.3} className="flex gap-12 group border-l border-black/10 pl-8 hover:border-black transition-colors">
                    <span className="text-4xl font-black italic text-black/10 group-hover:text-black transition-colors">{step.n}</span>
                    <div>
                      <h4 className="text-xl font-black uppercase italic text-white mb-2">{step.t}</h4>
                      <p className="text-xs text-black/40 font-light tracking-widest uppercase italic leading-loose">{step.d}</p>
                    </div>
                  </Reveal>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* ── CTA / INQUIRY ── */}
      <section className="py-40 bg-[#fcfcfc] relative">
         <div className="max-w-[1600px] mx-auto px-8 md:px-16">
            <div className="bg-black text-white p-24 lg:p-40 relative overflow-hidden flex flex-col items-center text-center group">
               <div className="absolute inset-0 opacity-10 grayscale brightness-110 group-hover:opacity-20 transition-opacity">
                  <Image src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80" alt="CTA Culinary" fill className="object-cover" />
               </div>
               <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[1em] text-white/50 mb-12 block italic">Allocation Initiation</span>
                  <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter leading-[0.8] uppercase mb-16">
                     Own <br/> <span className="text-white/30 not-italic">The Void.</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-12 relative z-10">
                     <button className="px-20 py-8 bg-white text-black font-black uppercase text-sm tracking-[0.5em] hover:italic transition-all">
                        Request_Allocation
                     </button>
                     <button className="px-20 py-8 border border-white/20 text-white font-black uppercase text-sm tracking-[0.5em] hover:bg-white/5 transition-all">
                        Atelier_Dossier
                     </button>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-40 pb-20 px-8 md:px-16 border-t border-black/10">
         <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
            <div className="lg:col-span-6">
               <div className="flex items-center gap-4 mb-12">
                 <UtensilsCrossed className="w-10 h-10 text-black" />
                 <span className="text-3xl font-black tracking-tighter uppercase italic text-black">ZEN<span className="text-black/30">//</span>KITCHEN</span>
               </div>
               <p className="text-black/40 text-sm font-light leading-relaxed uppercase tracking-[0.3em] mb-12 italic max-w-md">
                 Securing the future of culinary objects through high-fidelity orchestration and radical visual clarity.
               </p>
               <div className="flex gap-12">
                 {["TERMINAL", "CULINARY", "FORGE", "ALPHA"].map(s => (
                   <a key={s} href="#" className="text-[10px] font-bold hover:text-black text-black/30 transition-colors tracking-[0.5em]">[{s}]</a>
                 ))}
               </div>
            </div>
            
            <div className="lg:col-span-2">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40 mb-12">Systems</h4>
               <ul className="space-y-6 text-xs font-bold uppercase tracking-[0.4em]">
                 {["Archives", "Telemetry", "Shell", "Journal"].map(item => (
                   <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
                 ))}
               </ul>
            </div>

            <div className="lg:col-span-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40 mb-12">Partner Inquiry</h4>
               <p className="text-sm text-black/40 font-light mb-12 italic uppercase tracking-[0.2em] leading-loose">
                 For new commissions, culinary studies, or distribution enclaves, contact our primary command center in Kyoto.
               </p>
               <a href="mailto:ops@zen-kitchen.jp" className="text-3xl font-black italic hover:text-black transition-colors block border-b border-black/10 pb-8 uppercase tracking-tighter">
                  ops@zen-kitchen.jp
               </a>
            </div>
         </div>

         <div className="max-w-[1600px] mx-auto flex flex-col md:row items-center justify-between gap-12 text-[9px] font-bold uppercase tracking-[0.8em] text-black/20 border-t border-black/5 pt-20">
            <p>© 2024 ZEN KITCHEN ATELIER AG. ALL RIGHTS RESERVED. KYOTO // GLOBAL.</p>
            <div className="flex gap-16">
               <a href="#" className="hover:text-black transition-colors">[Culinary_Vault]</a>
               <a href="#" className="hover:text-white transition-colors">[Terms_of_Service]</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
