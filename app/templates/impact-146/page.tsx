"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Wallet, ArrowRight, Menu, Shield, Zap, Globe, Lock, BarChart3, TrendingUp, ChevronRight, ArrowUpRight, Layers } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const ASSETS = [
  { name: "Bitcoin", symbol: "BTC", price: "$67,842", change: "+3.2%", color: "#f7931a", alloc: "42%" },
  { name: "Ethereum", symbol: "ETH", price: "$3,891", change: "+5.1%", color: "#627eea", alloc: "28%" },
  { name: "Solana", symbol: "SOL", price: "$142.30", change: "+8.7%", color: "#9945ff", alloc: "15%" },
  { name: "Avalanche", symbol: "AVAX", price: "$38.50", change: "+2.4%", color: "#e84142", alloc: "15%" },
]

const FEATURES = [
  { icon: Shield, title: "Military-Grade Security", desc: "Multi-sig vaults, hardware key support, and biometric authentication. Your keys, your crypto." },
  { icon: Zap, title: "Instant Swaps", desc: "Cross-chain swaps in under 3 seconds via aggregated DEX liquidity. Zero slippage guarantee." },
  { icon: BarChart3, title: "Portfolio Analytics", desc: "Real-time P&L tracking, tax-loss harvesting alerts, and automated DCA strategies." },
  { icon: Globe, title: "Multi-Chain Native", desc: "One wallet for 12+ chains. Ethereum, Solana, Cosmos, and more — all in one place." },
  { icon: Lock, title: "Self-Custody", desc: "Non-custodial by design. We never touch your private keys. Period." },
  { icon: Layers, title: "DeFi Dashboard", desc: "Track yields, manage liquidity positions, and claim rewards across 50+ protocols." },
]

const PLANS = [
  { name: "Free", price: "$0", features: ["5 Wallets", "Basic Analytics", "Manual Swaps", "Community Support"] },
  { name: "Pro", price: "$14.99", features: ["Unlimited Wallets", "AI Portfolio Insights", "Priority Swaps", "Tax Reports", "24/7 Support"], popular: true },
  { name: "Institutional", price: "Custom", features: ["Multi-user Access", "API Access", "Compliance Tools", "Dedicated Manager", "SLA 99.99%"] },
]

export default function VelosFinTechPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050a0f] text-white font-sans min-h-screen selection:bg-cyan-400 selection:text-black overflow-x-hidden">

      {/* ── NAVBAR ──────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#050a0f]/90 backdrop-blur-xl border-b border-cyan-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Velos</span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Features", "Security", "Pricing", "Docs"].map(l => (
              <Link key={l} href="#" className="hover:text-cyan-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Log In</button>
            <button className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity">Download App</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050a0f] border-cyan-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Features", "Security", "Pricing", "Download"].map(l => (
                    <Link key={l} href="#" className="text-2xl font-light uppercase tracking-widest hover:text-cyan-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────── */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/8 blur-[200px] rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/8 blur-[200px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 w-full text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                <Shield className="w-3 h-3" /> Self-Custody · Multi-Chain · DeFi-Native
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                Your Crypto.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500">Your Control.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-white/40 font-light max-w-lg mx-auto leading-relaxed mb-10">
                The self-custody wallet built for serious crypto users. Multi-chain, DeFi-native, military-grade security.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-teal-500 text-black font-bold rounded-full hover:opacity-90 transition-opacity">
                  Download Wallet
                </button>
                <button className="px-10 py-4 border border-white/10 text-white/60 font-bold rounded-full hover:border-cyan-500/50 transition-all flex items-center gap-2">
                  View Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>

            {/* Portfolio Dashboard Mock */}
            <Reveal delay={0.4} y={30}>
              <div className="mt-20 p-6 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Portfolio Value</div>
                    <div className="text-3xl font-black">$142,847.92</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">24h Change</div>
                    <div className="text-xl font-bold text-emerald-400">+$4,231.50 (+3.05%)</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ASSETS.map((a, i) => (
                    <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black" style={{ background: a.color }}>{a.symbol.charAt(0)}</div>
                        <span className="text-xs font-bold text-white/60">{a.symbol}</span>
                        <span className="ml-auto text-[10px] font-bold text-white/20">{a.alloc}</span>
                      </div>
                      <div className="text-lg font-bold mb-1">{a.price}</div>
                      <div className="text-xs font-bold text-emerald-400">{a.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FEATURES ──────── */}
        <section className="py-32 bg-[#080e14]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400 block mb-4">Platform</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Power Users.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all duration-500 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:from-cyan-500 group-hover:to-teal-500 group-hover:border-transparent transition-all duration-500">
                      <f.icon className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────── */}
        <section className="py-32 bg-[#050a0f]">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400 block mb-4">Pricing</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Choose Your <span className="text-cyan-400">Plan.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-8 rounded-2xl border h-full flex flex-col ${p.popular ? "bg-gradient-to-b from-cyan-500/10 to-teal-500/5 border-cyan-500/30 relative" : "bg-white/[0.02] border-white/5"}`}>
                    {p.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-teal-500 text-[10px] font-bold uppercase tracking-widest text-black rounded-full">Most Popular</div>}
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <div className="text-4xl font-black mb-6">{p.price}<span className="text-lg text-white/30 font-normal">{p.price !== "Custom" ? "/mo" : ""}</span></div>
                    <ul className="space-y-3 flex-1 mb-8">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 font-bold rounded-full transition-all duration-500 ${p.popular ? "bg-gradient-to-r from-cyan-400 to-teal-500 text-black hover:opacity-90" : "bg-white/5 text-white hover:bg-white/10"}`}>
                      {p.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-teal-600/10" />
          <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                Take Control of<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Your Crypto.</span>
              </h2>
              <p className="text-lg text-white/40 font-light max-w-md mx-auto mb-10">
                Download Velos today and experience the future of self-custody.
              </p>
              <button className="px-12 py-5 bg-gradient-to-r from-cyan-400 to-teal-500 text-black font-bold rounded-full hover:opacity-90 transition-opacity">
                Download Free
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────── */}
      <footer className="bg-[#030508] pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center"><Wallet className="w-4 h-4 text-white" /></div>
              <span className="font-black tracking-tight">Velos</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Self-custody crypto wallet for power users.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "Security", "Pricing", "Roadmap"] },
            { title: "Resources", links: ["Docs", "API", "Blog", "Status"] },
            { title: "Legal", links: ["Privacy", "Terms", "Compliance", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 VELOS FINANCE.</span>
          <span>YOUR KEYS. YOUR CRYPTO.</span>
        </div>
      </footer>
    </div>
  )
}
