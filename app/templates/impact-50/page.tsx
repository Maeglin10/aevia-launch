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

      {/* ── INTEGRATIONS ──────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
        <Reveal>
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              <Share2 className="w-4 h-4" /> Ecosystem
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] pb-4">
              Plug Into<br /><span className="text-white/10">Everything.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "OpenAI", cat: "LLM Bridge", color: "bg-green-500/10 border-green-500/20 text-green-400" },
            { name: "Anthropic", cat: "Reasoning Layer", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
            { name: "AWS Bedrock", cat: "Cloud Inference", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
            { name: "LangChain", cat: "Orchestration", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
            { name: "Pinecone", cat: "Vector DB", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
            { name: "Kafka", cat: "Event Streaming", color: "bg-red-500/10 border-red-500/20 text-red-400" },
            { name: "Kubernetes", cat: "Orchestration", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
            { name: "Grafana", cat: "Observability", color: "bg-white/5 border-white/10 text-white/40" },
          ].map((intg, i) => (
            <Reveal key={intg.name} delay={i * 0.06}>
              <div className={`p-8 rounded-2xl border ${intg.color} group hover:scale-105 transition-transform duration-300`}>
                <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">{intg.cat}</div>
                <div className="text-xl font-black uppercase tracking-tighter">{intg.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-12 p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="text-sm font-black uppercase tracking-wide mb-2">Custom Integrations</div>
              <p className="text-sm text-white/30 font-light italic max-w-md">NeuralMesh supports any REST, GraphQL, or WebSocket endpoint via our integration SDK. Average setup time: 12 minutes.</p>
            </div>
            <div className="text-4xl font-black text-cyan-400 italic shrink-0">240+<span className="text-sm font-bold text-white/20 ml-2">native connectors</span></div>
          </div>
        </Reveal>
      </section>

      {/* ── USE CASES ─────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
        <Reveal>
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              <Zap className="w-4 h-4" /> Applications
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] pb-4">
              Built For<br /><span className="text-white/10">Everyone.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([
            {
              sector: "Enterprise AI",
              headline: "Unify your intelligence layer across every model and provider.",
              kpis: ["12× faster inference routing", "99.99% SLA guaranteed", "SOC 2 Type II certified"],
              icon: Brain,
              iconBg: "bg-cyan-500/10 border-cyan-500/20",
              iconColor: "text-cyan-400",
              labelColor: "text-cyan-400",
              dotColor: "bg-cyan-400",
              hoverBorder: "hover:border-cyan-500/30",
            },
            {
              sector: "Research Labs",
              headline: "Run massive parallel experiments across decentralized GPU clusters.",
              kpis: ["Petabyte-scale data mesh", "1,000+ concurrent agents", "Zero lock-in API"],
              icon: Activity,
              iconBg: "bg-blue-500/10 border-blue-500/20",
              iconColor: "text-blue-400",
              labelColor: "text-blue-400",
              dotColor: "bg-blue-400",
              hoverBorder: "hover:border-blue-500/30",
            },
            {
              sector: "FinTech & Trading",
              headline: "Sub-millisecond decision pipelines with full audit trail.",
              kpis: ["0.8ms median latency", "zk-proof audit log", "FIX protocol bridge"],
              icon: Globe,
              iconBg: "bg-green-500/10 border-green-500/20",
              iconColor: "text-green-400",
              labelColor: "text-green-400",
              dotColor: "bg-green-400",
              hoverBorder: "hover:border-green-500/30",
            },
          ] as const).map((uc, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`group p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] ${uc.hoverBorder} transition-all duration-500 flex flex-col h-full`}>
                <div className={`w-12 h-12 rounded-xl ${uc.iconBg} border flex items-center justify-center mb-8`}>
                  <uc.icon className={`w-6 h-6 ${uc.iconColor}`} />
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-[0.3em] ${uc.labelColor} mb-4`}>{uc.sector}</div>
                <h3 className="text-xl font-bold uppercase tracking-tight leading-tight mb-6">{uc.headline}</h3>
                <ul className="space-y-3 mt-auto">
                  {uc.kpis.map(k => (
                    <li key={k} className="flex items-center gap-3 text-xs text-white/40">
                      <span className={`w-1 h-1 rounded-full ${uc.dotColor} shrink-0`} />{k}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
        <Reveal>
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              <Shield className="w-4 h-4" /> Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] pb-4">
              Simple<br /><span className="text-white/10">Pricing.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tier: "Seed", price: "$0", unit: "/ month", cap: "Up to 10M tokens/mo", desc: "Perfect for prototypes and indie builders.", features: ["10M tokens/month", "1 mesh node", "Standard latency", "Community support"], highlight: false },
            { tier: "Growth", price: "$299", unit: "/ month", cap: "Up to 500M tokens/mo", desc: "For scaling products that need performance guarantees.", features: ["500M tokens/month", "20 mesh nodes", "Priority latency SLA", "Dedicated Slack support", "Custom integrations"], highlight: true },
            { tier: "Enterprise", price: "Custom", unit: "", cap: "Unlimited", desc: "Full-stack deployment with compliance, security, and SLAs.", features: ["Unlimited tokens", "Dedicated cluster", "0.8ms p99 latency", "SOC 2 + HIPAA", "24/7 engineering support"], highlight: false },
          ].map((plan, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`flex flex-col h-full p-10 rounded-[2rem] border transition-all duration-500 ${plan.highlight ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/[0.02] text-white border-white/5"}`}>
                <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${plan.highlight ? "text-black/60" : "text-cyan-400"}`}>{plan.cap}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{plan.tier}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-black italic ${plan.highlight ? "text-black" : "text-white"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-black/40" : "text-white/20"}`}>{plan.unit}</span>
                </div>
                <p className={`text-sm leading-relaxed mb-8 ${plan.highlight ? "text-black/60" : "text-white/30"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-3 text-xs ${plan.highlight ? "text-black/70" : "text-white/40"}`}>
                      <Zap className={`w-3 h-3 shrink-0 ${plan.highlight ? "text-black" : "text-cyan-400"}`} />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/templates/impact-50/contact"
                  className={`block text-center py-4 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 ${plan.highlight ? "bg-black text-white hover:bg-white hover:text-black" : "bg-white/5 text-white hover:bg-cyan-500 hover:text-black border border-white/10"}`}
                >
                  {plan.tier === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            </Reveal>
          ))}
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
