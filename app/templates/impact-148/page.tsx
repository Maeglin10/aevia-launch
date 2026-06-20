// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Activity, Cpu, Globe, Share2, Shield, ChevronRight, Layout, Box, Sparkles, Wallet } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const DROPS = [
  { id: "P-01", name: "Glitch Angel", creator: "@Xero", price: "4.2 ETH", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" },
  { id: "P-02", name: "Neo Tokyo", creator: "@Sintra", price: "12.8 ETH", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200" },
  { id: "P-03", name: "Ether Void", creator: "@Vane", price: "2.1 ETH", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200" },
]

export default function NeonPulsePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* ── GRADIENT BACKGROUND ───── */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Neon<span className="text-cyan-400">Pulse</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Drops", "Market", "Curators", "Stats"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Connect Wallet</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]">Explore Drops</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Gallery", "Creators", "Mint", "Profile"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-black uppercase tracking-tighter hover:text-cyan-400 transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative pt-40 pb-20">
        {/* ── HERO ──────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative z-10">
                <Reveal>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 rounded-full backdrop-blur-md">
                    <Sparkles className="w-4 h-4 animate-bounce" /> The Future of Digital Artifacts
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={80}>
                  <h1 className="text-7xl md:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase mb-12 italic">
                    Pulse <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400">The Void.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 italic">
                    The ultra-high-fidelity marketplace for digital artists. Own a piece of the neon future on the most secure neural mesh.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button className="px-14 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all duration-500 shadow-2xl">
                       Start Collecting
                    </button>
                    <div className="flex items-center gap-4 group cursor-pointer">
                       <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          <Wallet className="w-5 h-5" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">How it works</span>
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-cyan-400/20 blur-[100px] animate-pulse" />
                    <div className="relative w-full h-full p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden flex items-center justify-center group">
                       <motion.div 
                         animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} 
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="w-2/3 h-2/3 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center"
                       >
                          <div className="w-1/2 h-1/2 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.5)] flex items-center justify-center">
                             <Box className="w-16 h-16 text-white" />
                          </div>
                       </motion.div>
                       {/* Floating UI */}
                       <div className="absolute top-10 right-10 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl animate-bounce">
                          <div className="text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest">Current Bid</div>
                          <div className="text-2xl font-black italic">14.8 ETH</div>
                       </div>
                       <div className="absolute bottom-10 left-10 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-cyan-400" />
                             <div className="text-[10px] font-bold uppercase tracking-widest">@TheArchitect</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── DROPS ─────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
           <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 border-b border-white/5 pb-12">
                 <div className="max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400 block mb-6">Genesis Drops</span>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">The <span className="text-white/20 not-italic">Collection.</span></h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer shadow-xl"><ArrowRight className="w-6 h-6 rotate-180" /></div>
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer shadow-xl"><ArrowRight className="w-6 h-6" /></div>
                 </div>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {DROPS.map((drop, i) => (
                <Reveal key={i} delay={i * 0.15}>
                   <div className="group relative">
                      <div className="relative aspect-[3/4] mb-10 overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/10 p-4">
                         <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
                            <Image src={drop.img} alt={drop.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                               <h3 className="text-3xl font-black italic uppercase mb-2">{drop.name}</h3>
                               <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{drop.creator}</div>
                            </div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center px-6">
                         <div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">List Price</div>
                            <div className="text-xl font-black italic uppercase tracking-tighter">{drop.price}</div>
                         </div>
                         <button className="px-8 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-all">Buy Now</button>
                      </div>
                   </div>
                </Reveal>
              ))}
           </div>
        </section>

        {/* ── THE PROTOCOL ───────────── */}
        <section className="py-40 relative bg-black overflow-hidden border-y border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-purple-500 block mb-10">The Neural Protocol</span>
                       <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-16 leading-tight">Digital <br/> <span className="not-italic font-black text-white/20">Immutability.</span></h2>
                       <div className="space-y-16">
                          {[
                            { icon: Cpu, t: "Generative Logic", d: "Smart contracts that evolve with the artwork. Own more than just a JPEG." },
                            { icon: Shield, t: "Vault Storage", d: "High-bandwidth IPFS storage with multi-layered redundancy across global nodes." },
                            { icon: Share2, t: "Secondary Fluidity", d: "Instant secondary market liquidity with automated creator royalty splits." }
                          ].map((f, i) => (
                            <div key={i} className="flex gap-10 group">
                               <div className="w-20 h-20 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-400 transition-all duration-700">
                                  <f.icon className="w-8 h-8 text-cyan-400 group-hover:text-black transition-colors" />
                               </div>
                               <div>
                                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 italic italic-none">{f.t}</h4>
                                  <p className="text-white/40 leading-relaxed text-sm font-light italic">{f.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <Reveal delay={0.2}>
                    <div className="relative aspect-square rounded-[3rem] border border-white/5 bg-white/[0.02] p-16 flex items-center justify-center">
                       <div className="w-full h-full relative">
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-purple-500/20 rounded-full flex items-center justify-center"
                          >
                             <div className="absolute top-0 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7]" />
                          </motion.div>
                          <motion.div 
                            animate={{ rotate: -360 }} 
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-20 border border-cyan-500/20 rounded-full flex items-center justify-center"
                          >
                             <div className="absolute bottom-0 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#06b6d4]" />
                          </motion.div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Layout className="w-24 h-24 text-white/5 group-hover:text-white/20 transition-all" />
                          </div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── ROADMAP ───────────────── */}
        <section className="py-40 bg-[#08080a] border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="mb-20">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-purple-500 block mb-6">Protocol Evolution</span>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">The <span className="text-white/10">Roadmap.</span></h2>
                 </div>
              </Reveal>
              <div className="relative">
                 <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 opacity-20 hidden md:block" />
                 <div className="space-y-8 md:pl-24">
                    {[
                       { phase: "Phase I", title: "Genesis Drop", status: "LIVE", date: "Q1 2025", desc: "888 hand-rendered Neural Fragments minted on Ethereum mainnet. Provenance via Chainlink VRF.", icon: Box, color: "text-green-400 border-green-500/30 bg-green-500/10" },
                       { phase: "Phase II", title: "Holder Utility", status: "IN PROGRESS", date: "Q2 2025", desc: "Staking rewards, governance voting, and access to physical art editions. Token-gated community.", icon: Wallet, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
                       { phase: "Phase III", title: "Protocol Bridge", status: "UPCOMING", date: "Q3 2025", desc: "Cross-chain expansion to Solana and Base. Interoperable assets across ecosystems.", icon: Globe, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
                       { phase: "Phase IV", title: "Neural Genesis V2", status: "CONCEPT", date: "Q4 2025", desc: "Second generative series co-designed with the community. On-chain evolution based on holder behavior.", icon: Sparkles, color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
                    ].map((r, i) => (
                       <Reveal key={i} delay={i * 0.1}>
                          <div className="group border border-white/5 bg-white/[0.02] rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-start hover:border-white/15 transition-all duration-500">
                             <div className={`w-14 h-14 shrink-0 rounded-xl ${r.color} border flex items-center justify-center`}>
                                <r.icon className="w-6 h-6" />
                             </div>
                             <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                   <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{r.phase}</span>
                                   <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 text-white/40">{r.status}</span>
                                   <span className="text-[9px] font-mono text-white/20">{r.date}</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">{r.title}</h3>
                                <p className="text-sm text-white/30 font-light leading-relaxed">{r.desc}</p>
                             </div>
                          </div>
                       </Reveal>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ── COMMUNITY STATS ─────────── */}
        <section className="py-40 bg-black border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-500 block mb-4">The Network</span>
                       <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">By The <span className="text-white/10">Numbers.</span></h2>
                    </div>
                    <div className="text-sm text-white/25 font-light italic max-w-xs leading-relaxed">Live on-chain data. Verified via Dune Analytics dashboard.</div>
                 </div>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                 {[
                    { v: "888", l: "Total Supply", sub: "hand-rendered" },
                    { v: "0.24Ξ", l: "Floor Price", sub: "all-time high 1.8Ξ" },
                    { v: "4,200+", l: "Unique Holders", sub: "across wallets" },
                    { v: "98%", l: "Retention Rate", sub: "no-flip ratio" },
                 ].map((s, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                       <div className="bg-black p-10 text-center group hover:bg-white/[0.02] transition-colors duration-500">
                          <div className="text-4xl font-black italic mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">{s.v}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.l}</div>
                          <div className="text-[9px] text-white/15 tracking-wider mt-1">{s.sub}</div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="max-w-6xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[18vw] font-black uppercase tracking-tighter leading-[0.7] text-black mb-16 italic">
                    PULSE <br/> THE FUTURE.
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase tracking-[0.3em] text-xs rounded-full hover:px-24 transition-all duration-700 italic shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                       Open Collector Portal
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-black hover:text-white transition-all duration-700 italic">
                       Apply As Creator
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050505] pt-40 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-10 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Neon<span className="text-cyan-400">Pulse</span></span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "The pulse is the rhythm of decentralized creation. Own the artifact, own the future."
              </p>
              <div className="flex gap-10">
                 {["Discord", "MessageSquare", "GitHub", "Lens"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "MARKET", l: ["Curated Drops", "Secondary Hub", "Auctions", "Floor Stats"] },
             { t: "CREATORS", l: ["Apply", "Dashboard", "Mint Tool", "Royalties"] },
             { t: "ENTITY", l: ["About", "Protocol", "Security Hub", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 NEON PULSE PROTOCOL. OWN THE VOID.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-cyan-400 transition-all">SYSTEM: ONLINE</Link>
              <Link href="#" className="hover:text-cyan-400 transition-all">PULSE: STABLE</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
