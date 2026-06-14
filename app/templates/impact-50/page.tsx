"use client";
import { motion } from "framer-motion";
import { Brain, Zap, Activity, Globe, Shield, MoveRight, Share2 } from "lucide-react";
import { Reveal } from "./shared";
import Link from "next/link";

export default function NeuralMeshPage() {
  return (
    <main className="pt-40 pb-20">
      {/* ── HERO ──────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">
                <Zap className="w-4 h-4" /> Cognitive Infrastructure v4.2
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.9] pb-4 uppercase mb-12">
                Sync <br /> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mind.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 italic">
                The first unified intelligence layer for decentralized neural networks. High-bandwidth cognition at the speed of thought.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.5} y={0}>
            <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]">
              <div className="bg-[#0a0f1a] rounded-[1.8rem] p-10 border border-white/5 overflow-hidden font-mono text-[10px] leading-relaxed text-cyan-400/60">
                <div className="flex justify-between mb-8 opacity-40">
                  <span>SYSTEM_BOOT</span>
                  <span>STABLE</span>
                </div>
                <div className="space-y-2 mb-8">
                  <p>&gt; initializing neural pathways...</p>
                  <p>&gt; binding mesh to global consensus...</p>
                  <p className="text-cyan-400">&gt; synchronization complete [100%]</p>
                </div>
                <div className="h-40 bg-white/5 rounded-xl border border-white/5 flex items-end gap-1 p-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-cyan-500/40"
                      animate={{ height: [`${10 + Math.random() * 40}%`, `${50 + Math.random() * 50}%`] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENTO GRID ────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tile 1: Massive */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="h-full p-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-white/10 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000">
                <Brain className="w-64 h-64" />
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-10">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-4xl font-bold uppercase tracking-tight mb-6">
                  Autonomous <br /> Intelligence.
                </h3>
                <p className="text-white/40 leading-relaxed font-light max-w-sm italic text-lg">
                  Self-correcting neural pathways that optimize in real-time based on global network feedback.
                </p>
              </div>
              <div className="mt-20">
                <Link
                  href="/templates/impact-50/about"
                  className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:gap-6 transition-all"
                >
                  Read Technical Specs <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Tile 2: Square */}
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                  0.02ms Latency
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-bold uppercase tracking-tight mb-4">
                  Global Reach.
                </h4>
                <p className="text-sm text-white/40 leading-relaxed font-light">
                  140+ nodes globally distributed for minimum latency and maximum resilience.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Tile 3: Square */}
          <Reveal delay={0.2}>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between group h-full">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-8">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-xl font-bold uppercase tracking-tight mb-2">
                Immutable.
              </h4>
              <p className="text-xs text-white/40 leading-relaxed font-light italic">
                Secured by decentralized consensus and zk-proofs.
              </p>
            </div>
          </Reveal>

          {/* Tile 4: Square */}
          <Reveal delay={0.3}>
            <div className="p-10 rounded-[2.5rem] bg-cyan-500 text-black flex flex-col justify-between group h-full">
              <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center mb-8">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h4 className="text-xl font-bold uppercase tracking-tight mb-2 italic">
                Scale Now.
              </h4>
              <p className="text-xs text-black/60 leading-relaxed font-bold">
                Unlimited throughput on any L1/L2 network.
              </p>
            </div>
          </Reveal>

          {/* Tile 5: Large Horizontal */}
          <Reveal delay={0.4} className="md:col-span-3">
            <div className="p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-center gap-12 group">
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 mb-6 block">
                  Real-time Visualization
                </div>
                <h3 className="text-3xl font-bold uppercase tracking-tight mb-6 italic">
                  The Neural Dashboard.
                </h3>
                <p className="text-white/40 leading-relaxed font-light text-sm italic mb-8">
                  Manage, monitor, and evolve your neural deployment from a single high-fidelity interface.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/templates/impact-50/about"
                    className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-300"
                  >
                    Demo Hub
                  </Link>
                  <Link
                    href="/templates/impact-50/contact"
                    className="px-6 py-2.5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all duration-300"
                  >
                    Get API Ref
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full p-4 flex gap-1 items-end">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-cyan-500/20 border border-cyan-500/30"
                      animate={{ height: [`${20 + Math.random() * 30}%`, `${60 + Math.random() * 40}%`] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tile 6: Small Vertical */}
          <Reveal delay={0.5}>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center group h-full">
              <Share2 className="w-8 h-8 text-white/20 mb-6 group-hover:text-cyan-400 transition-colors" />
              <div className="text-4xl font-black italic mb-2 tracking-tighter">84k</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                Active Mesh Nodes
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 mb-20">
        <Reveal>
          <div className="p-20 rounded-[3rem] bg-gradient-to-r from-cyan-600 to-blue-700 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic relative z-10">
              JOIN THE <br /> <span className="text-black not-italic font-black">CONSENSUS.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
              <Link
                href="/templates/impact-50/contact"
                className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic rounded-lg"
              >
                Get Developer Access
              </Link>
              <Link
                href="/templates/impact-50/contact"
                className="px-16 py-6 border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic rounded-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
