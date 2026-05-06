"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Menu, ArrowRight, Sparkles, Layers, Box, Cpu, ArrowUpRight, Copy, Check, Hexagon, Fingerprint } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    status: "MAINNET LIVE",
    title: "AURA NETWORK",
    desc: "The iridescent layer for decentralized social graphs. Aura brings vaporwave aesthetics to Web3 utility, creating a frictionless identity protocol."
  },
  features: [
    { id: "01", title: "Soulbound NFTs", icon: <Fingerprint className="w-6 h-6" />, desc: "Non-transferable identity tokens representing your aesthetic and social reputation across the metaverse." },
    { id: "02", title: "Zero-Knowledge", icon: <Hexagon className="w-6 h-6" />, desc: "Prove your identity and verify your community roles without revealing your wallet address or balance." },
    { id: "03", title: "Cross-Chain", icon: <Layers className="w-6 h-6" />, desc: "Aura operates natively across Ethereum, Solana, and Polygon using LayerZero messaging." }
  ],
  tokenomics: {
    supply: "1,000,000,000 $AURA",
    contract: "0x8a...3f9c",
    allocation: [
      { label: "Community Treasury", percent: 45, color: "#ff71ce" },
      { label: "Core Contributors", percent: 20, color: "#01cdfe" },
      { label: "Liquidity Pool", percent: 15, color: "#05ffa1" },
      { label: "Ecosystem Grants", percent: 15, color: "#b967ff" },
      { label: "Advisors", percent: 5, color: "#fffb96" }
    ]
  },
  roadmap: [
    { phase: "Phase 1: Synthesis", status: "Completed", items: ["Protocol Whitepaper", "Seed Round Closed", "Testnet Alpha", "Community Genesis"] },
    { phase: "Phase 2: Resonance", status: "Current", items: ["Mainnet Beta Launch", "Aura ID Minting", "Cross-chain Bridge", "DEX Listing"] },
    { phase: "Phase 3: Ascension", status: "Upcoming", items: ["DAO Governance", "Staking Rewards V2", "Social Graph API", "Tier 1 CEX"] },
    { phase: "Phase 4: Nirvana", status: "2027", items: ["Mobile App SDK", "Zero-Knowledge Rollup", "Ecosystem Fund", "Global Hackathon"] }
  ],
  backers: [
    "a16z crypto", "Paradigm", "Sequoia Capital", "Framework", "Variant", "Multicoin"
  ],
  faq: [
    { q: "What is an Aura ID?", a: "An Aura ID is a soulbound NFT that aggregates your on-chain history, social connections, and community reputation into a single, beautifully rendered iridescent orb." },
    { q: "How do I participate in the Airdrop?", a: "To be eligible, you must hold an active Aura ID and have participated in the Testnet Alpha or engaged in our Discord community before the snapshot date." },
    { q: "Is the contract audited?", a: "Yes, the Aura smart contracts have been thoroughly audited by Trail of Bits and Certik. All audit reports are available on our Github." },
    { q: "What are the utility cases for $AURA?", a: "$AURA is used for governance, staking for protocol revenue share, and paying for premium API access to the Aura Social Graph." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function AuraInteractivePage() {
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const copyContract = () => {
    navigator.clipboard.writeText(MANIFEST.tokenomics.contract)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#1a0b2e] text-[#fcfaf7] font-sans min-h-screen selection:bg-[#ff71ce] selection:text-white overflow-x-hidden relative">
      
      {/* ─── VAPORWAVE IRIDESCENT BACKGROUND ───────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#1a0b2e]">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#ff71ce]/40 blur-[120px] mix-blend-screen animate-[pulse_8s_infinite]" />
          <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#01cdfe]/30 blur-[150px] mix-blend-screen animate-[pulse_10s_infinite_reverse]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#05ffa1]/20 blur-[100px] mix-blend-screen" />
        </motion.div>
        {/* Retro Grid */}
        <div 
          className="absolute bottom-0 w-full h-[50vh] opacity-30"
          style={{
            backgroundImage: "linear-gradient(#ff71ce 1px, transparent 1px), linear-gradient(90deg, #ff71ce 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(2)"
          }}
        />
        {/* VHS Overlay effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1a0b2e]/60 backdrop-blur-xl border-b border-white/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff71ce] to-[#01cdfe] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-widest uppercase italic">AURA</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest">
            {["Protocol", "Tokenomics", "Roadmap", "DAO"].map((link) => (
              <Link key={link} href="#" className="hover:text-[#ff71ce] transition-colors relative group">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden md:flex items-center justify-center px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all rounded-full text-xs font-bold uppercase tracking-widest">
              Launch App
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1a0b2e]/90 backdrop-blur-xl border-l border-white/10 p-12 text-white">
                <div className="flex flex-col gap-8 mt-20">
                  {["Protocol", "Tokenomics", "Roadmap", "DAO", "Launch App"].map((link) => (
                    <Link key={link} href="#" className="text-3xl font-black uppercase italic hover:text-[#01cdfe] transition-colors">
                      {link}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-20 pb-32">
          <div className="max-w-[1400px] mx-auto px-6 w-full text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                <div className="w-2 h-2 rounded-full bg-[#05ffa1] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#05ffa1]">{MANIFEST.hero.status}</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter italic leading-none mb-8 drop-shadow-[0_0_30px_rgba(255,113,206,0.5)]">
                {MANIFEST.hero.title}
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/80 leading-relaxed font-medium mb-12">
                {MANIFEST.hero.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-[#ff71ce] to-[#01cdfe] text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(1,205,254,0.4)]">
                  Mint Aura ID
                </button>
                <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                  Read Docs
                </button>
              </div>
            </Reveal>
            
            {/* Massive floating 3D orb placeholder */}
            <Reveal delay={0.4}>
              <div className="mt-24 relative w-64 h-64 md:w-96 md:h-96 mx-auto animate-[bounce_6s_infinite]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff71ce] via-[#b967ff] to-[#01cdfe] blur-[10px] shadow-[0_0_100px_rgba(255,113,206,0.8)] border border-white/40" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-white/40 to-transparent backdrop-blur-sm" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── BACKERS MARQUEE ───────────────────────────────────────────── */}
        <section className="py-8 bg-white/5 backdrop-blur-md border-y border-white/10 overflow-hidden">
          <div className="flex items-center gap-16 whitespace-nowrap overflow-hidden">
            <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="flex gap-16 items-center">
              {[...MANIFEST.backers, ...MANIFEST.backers, ...MANIFEST.backers].map((backer, i) => (
                <div key={i} className="text-xl md:text-3xl font-black uppercase italic tracking-widest text-white/30 mix-blend-overlay">
                  {backer}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────────────── */}
        <section className="py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight italic mb-20 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Protocol Architecture
              </h2>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.features.map((feat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <GlassCard className="group hover:-translate-y-2 transition-transform duration-500">
                    <div className="text-[100px] font-black italic text-white/5 absolute top-4 right-4 pointer-events-none">{feat.id}</div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff71ce]/20 to-[#01cdfe]/20 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-widest mb-4">{feat.title}</h3>
                    <p className="text-white/70 leading-relaxed font-medium">{feat.desc}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TOKENOMICS ────────────────────────────────────────────────── */}
        <section className="py-32 relative">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Reveal>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight italic mb-8">
                    Tokenomics
                  </h2>
                  <p className="text-white/70 text-lg mb-12">
                    $AURA is the native governance and utility token of the protocol, designed for long-term sustainability and community ownership.
                  </p>
                  
                  <div className="space-y-6 mb-12">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Total Supply</div>
                      <div className="text-3xl font-black text-[#05ffa1]">{MANIFEST.tokenomics.supply}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Contract Address</div>
                      <button onClick={copyContract} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="font-mono text-[#01cdfe]">{MANIFEST.tokenomics.contract}</span>
                        {copied ? <Check className="w-4 h-4 text-[#05ffa1]" /> : <Copy className="w-4 h-4 text-white/50" />}
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <div>
                <Reveal delay={0.2}>
                  <GlassCard>
                    <h3 className="text-xl font-black uppercase tracking-widest mb-8">Allocation Distribution</h3>
                    <div className="space-y-6">
                      {MANIFEST.tokenomics.allocation.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-2">
                            <span>{item.label}</span>
                            <span style={{ color: item.color }}>{item.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} whileInView={{ width: `${item.percent}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full rounded-full" style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ROADMAP ───────────────────────────────────────────────────── */}
        <section className="py-32">
          <div className="max-w-[1000px] mx-auto px-6">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight italic mb-20 text-center">
                Protocol Roadmap
              </h2>
            </Reveal>
            
            <div className="space-y-8">
              {MANIFEST.roadmap.map((phase, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-8 rounded-3xl border ${phase.status === 'Current' ? 'border-[#ff71ce] bg-[#ff71ce]/10 shadow-[0_0_30px_rgba(255,113,206,0.2)]' : 'border-white/10 bg-white/5'} backdrop-blur-md`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                      <h3 className="text-2xl font-black uppercase italic tracking-widest">{phase.phase}</h3>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        phase.status === 'Completed' ? 'border-[#05ffa1] text-[#05ffa1] bg-[#05ffa1]/10' :
                        phase.status === 'Current' ? 'border-[#ff71ce] text-[#ff71ce] bg-[#ff71ce]/10' :
                        'border-white/30 text-white/50 bg-white/5'
                      }`}>
                        {phase.status}
                      </div>
                    </div>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm font-bold text-white/80">
                          <Check className={`w-4 h-4 ${phase.status === 'Completed' ? 'text-[#05ffa1]' : 'text-white/30'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-32">
          <div className="max-w-[800px] mx-auto px-6">
            <Reveal>
              <h2 className="text-4xl font-black uppercase italic tracking-widest mb-16 text-center">Transmission Queries</h2>
            </Reveal>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {MANIFEST.faq.map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <AccordionItem value={`item-${i}`} className="border border-white/10 bg-white/5 backdrop-blur-md px-6 rounded-2xl">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-6 hover:text-[#01cdfe] hover:no-underline text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 leading-relaxed pb-6 font-medium">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
        <section className="py-40 relative border-t border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] to-[#ff71ce]/20 pointer-events-none" />
          <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                Enter The Grid
              </h2>
              <p className="text-xl text-white/80 mb-12 font-medium">
                Claim your Aura ID and start building your decentralized identity today.
              </p>
              <button className="px-12 py-6 rounded-full bg-white text-[#1a0b2e] text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                Connect Wallet
              </button>
            </Reveal>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a0b2e] pt-20 pb-12 px-6 border-t border-white/10 relative z-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#ff71ce]" />
            <span className="text-2xl font-black tracking-widest uppercase italic text-white">AURA</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-white/50">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
            <Link href="#" className="hover:text-white transition-colors">Github</Link>
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto text-center mt-16 text-[10px] font-bold uppercase tracking-widest text-white/30">
          © 2026 Aura Network. Vaporwave is forever.
        </div>
      </footer>
    </div>
  )
}
