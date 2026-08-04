"use client";
// @ts-nocheck
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Activity, Cpu, Globe, Share2, Shield, ChevronRight, Layout, Box, Sparkles, Wallet, X, Check, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientName,
  clientServices,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

const SOCIALS = [
  { l: "Discord", h: "https://discord.com" },
  { l: "Telegram", h: "https://t.me" },
  { l: "GitHub", h: "https://github.com" },
  { l: "Mirror", h: "https://mirror.xyz" },
];


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

// Demo content — real data (businessProfile) replaces this wholesale via
// resolveList when the client provided it; each field access below falls
// back with `??` so the same JSX renders either shape.
const DROPS_DEMO = [
  { id: "P-01", name: "Glitch Angel", creator: "@Xero", price: "4.2 ETH", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" },
  { id: "P-02", name: "Neo Tokyo", creator: "@Sintra", price: "12.8 ETH", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200" },
  { id: "P-03", name: "Ether Void", creator: "@Vane", price: "2.1 ETH", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200" },
]


export default function NeonPulsePage() {
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
    businessProfile?: any;
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 0;
    const _photoArrays: any[] = [DROPS_DEMO];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Real business data (resolveList) replaces demo content wholesale when
  // present — see the DEMO const above for the shape this section falls
  // back to. Field access in JSX uses `??` chains so both shapes render.
  // Note: businessProfile is a sibling of formData on SessionData, not
  // nested inside it — read from `session`, not `fd`.
  const bp = session?.businessProfile;
  const drops = resolveList(clientServices(session)?.map((r: any) => ({ name: r.title, price: r.price })), DROPS_DEMO);

  // ── Buy Now / Mint waitlist modal ──────────────────────────────────────────
  // Real wallet connection / on-chain minting is out of scope for this pass —
  // this is a reservation/waitlist form: `modalDrop` set (from a card's "Buy
  // Now") pre-fills that item; null `modalDrop` (from "Start Collecting" /
  // "Open Collector Portal") is the generic "Mint" flow with a collection
  // picker.
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDrop, setModalDrop] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", quantity: "1", dropId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openModal = (drop: any = null) => {
    setModalDrop(drop);
    setForm({ name: "", email: "", quantity: "1", dropId: drop?.id ?? drop?.name ?? "" });
    setSubmitting(false);
    setSubmitted(false);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen]);

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-[#050505] text-white font-sans min-h-dvh selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* ── GRADIENT BACKGROUND ───── */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--brand,#0891b2)]/10 blur-[120px] rounded-full" />
      </div>

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-[var(--brand,#22d3ee)] flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase italic whitespace-nowrap">{clientName({ formData: fd }) ?? "Neon"}<span className="text-[var(--brand,#22d3ee)]">Pulse</span></span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Drops", "Market", "Curators", "Stats"].map(l => (
              <Link key={l} href="#hero" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              title="Wallet connection coming soon"
              className="hidden md:inline-flex items-center gap-2 min-h-[44px] px-2 text-[10px] font-bold uppercase tracking-widest text-white/25 cursor-not-allowed"
            >
              Connect Wallet
              <span className="px-1.5 py-0.5 rounded-full border border-white/10 text-[10px] tracking-widest text-white/30">Soon</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden sm:inline-flex px-4 sm:px-8 py-3 min-h-[44px] bg-white text-black text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-full hover:bg-[var(--brand,#22d3ee)] hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
            >Explore Drops</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Gallery", "Creators", "Mint", "Profile"].map(l => (
                    <Link key={l} href="#realisations" className="text-4xl font-black uppercase tracking-tighter hover:text-[var(--brand,#22d3ee)] transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative pt-40 pb-20">
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative z-10">
                <Reveal delay={0.1} y={80}>
                  <h1 className="text-7xl md:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase mb-12 italic">{c?.heroHeadline ?? <>
                    Pulse <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-[var(--brand,#22d3ee)]">The Void.</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 italic">{c?.heroSubline ?? fd?.tagline ?? <>
                    The ultra-high-fidelity marketplace for digital artists. Own a piece of the neon future on the most secure neural mesh.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button
                      type="button"
                      onClick={() => openModal(null)}
                      className="px-14 py-6 min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all duration-500 shadow-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-[var(--brand,#22d3ee)]/20 blur-[100px] animate-pulse" />
                    <div className="relative w-full h-full p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden flex items-center justify-center group">
                       <motion.div 
                         animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} 
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="w-2/3 h-2/3 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center"
                       >
                          <div className="w-1/2 h-1/2 bg-gradient-to-br from-purple-500 to-[var(--brand,#22d3ee)] rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.5)] flex items-center justify-center">
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
                             <div className="w-8 h-8 rounded-full bg-[var(--brand,#22d3ee)]" />
                             <div className="text-[10px] font-bold uppercase tracking-widest">@TheArchitect</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── DROPS ─────────────────── */}
        <section id="contact" className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
           <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 border-b border-white/5 pb-12">
                 <div className="max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#22d3ee)] block mb-6">Genesis Drops</span>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">The <span className="text-white/20 not-italic">Collection.</span></h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer shadow-xl"><ArrowRight className="w-6 h-6 rotate-180" /></div>
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer shadow-xl"><ArrowRight className="w-6 h-6" /></div>
                 </div>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {drops.map((drop: any, i: number) => (
                <Reveal key={drop.id ?? drop.name ?? i} delay={i * 0.15}>
                   <div className="group relative">
                      <div className="relative aspect-[3/4] mb-10 overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/10 p-4">
                         <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
                            <Image src={drop.img ?? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"} alt={drop.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                               <h3 className="text-3xl font-black italic uppercase mb-2">{drop.name}</h3>
                               {drop.creator && <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#22d3ee)]">{drop.creator}</div>}
                            </div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center px-6">
                         {drop.price && (
                           <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">List Price</div>
                              <div className="text-xl font-black italic uppercase tracking-tighter">{drop.price}</div>
                           </div>
                         )}
                         <button
                           type="button"
                           onClick={() => openModal(drop)}
                           className="px-8 py-3 min-h-[44px] bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[var(--brand,#22d3ee)] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                         >Buy Now</button>
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
                               <div className="w-20 h-20 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[var(--brand,#22d3ee)] transition-all duration-700">
                                  <f.icon className="w-8 h-8 text-[var(--brand,#22d3ee)] group-hover:text-black transition-colors" />
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
                            className="absolute inset-20 border border-[var(--brand,#06b6d4)]/20 rounded-full flex items-center justify-center"
                          >
                             <div className="absolute bottom-0 w-3 h-3 bg-[var(--brand,#22d3ee)] rounded-full shadow-[0_0_15px_#06b6d4]" />
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
                 <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-[var(--brand,#06b6d4)] opacity-20 hidden md:block" />
                 <div className="space-y-8 md:pl-24">
                    {[
                       { phase: "Phase I", title: "Genesis Drop", status: "LIVE", date: "Q1 2025", desc: "888 hand-rendered Neural Fragments minted on Ethereum mainnet. Provenance via Chainlink VRF.", icon: Box, color: "text-green-400 border-green-500/30 bg-green-500/10" },
                       { phase: "Phase II", title: "Holder Utility", status: "IN PROGRESS", date: "Q2 2025", desc: "Staking rewards, governance voting, and access to physical art editions. Token-gated community.", icon: Wallet, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
                       { phase: "Phase III", title: "Protocol Bridge", status: "UPCOMING", date: "Q3 2025", desc: "Cross-chain expansion to Solana and Base. Interoperable assets across ecosystems.", icon: Globe, color: "text-[var(--brand,#22d3ee)] border-[var(--brand,#06b6d4)]/30 bg-[var(--brand,#06b6d4)]/10" },
                       { phase: "Phase IV", title: "Neural Genesis V2", status: "CONCEPT", date: "Q4 2025", desc: "Second generative series co-designed with the community. On-chain evolution based on holder behavior.", icon: Sparkles, color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
                    ].map((r, i) => (
                       <Reveal key={i} delay={i * 0.1}>
                          <div className="group border border-white/5 bg-white/[0.02] rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-start hover:border-white/15 transition-all duration-500">
                             <div className={`w-14 h-14 shrink-0 rounded-xl ${r.color} border flex items-center justify-center`}>
                                <r.icon className="w-6 h-6" />
                             </div>
                             <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{r.phase}</span>
                                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 text-white/40">{r.status}</span>
                                   <span className="text-[10px] font-mono text-white/20">{r.date}</span>
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
        <section id="realisations" className="py-40 bg-black border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#06b6d4)] block mb-4">The Network</span>
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
                          <div className="text-4xl font-black italic mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-[var(--brand,#22d3ee)] bg-clip-text text-transparent">{s.v}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.l}</div>
                          <div className="text-[10px] text-white/15 tracking-wider mt-1">{s.sub}</div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-gradient-to-tr from-purple-600 via-pink-600 to-[var(--brand,#06b6d4)] text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="max-w-6xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[18vw] font-black uppercase tracking-tighter leading-[0.7] text-black mb-16 italic">
                    PULSE <br/> THE FUTURE.
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button
                      type="button"
                      onClick={() => openModal(null)}
                      className="px-20 py-10 min-h-[44px] bg-black text-white font-black uppercase tracking-[0.3em] text-xs rounded-full hover:px-24 transition-all duration-700 italic shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                       Open Collector Portal
                    </button>
                    <button
                      type="button"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      title="Creator applications coming soon"
                      className="px-20 py-10 min-h-[44px] border-4 border-black/40 text-black/40 font-black uppercase tracking-[0.3em] text-xs rounded-full italic cursor-not-allowed"
                    >
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
              <Link href="#hero" className="flex items-center gap-3 mb-10 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-[var(--brand,#22d3ee)] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Neon<span className="text-[var(--brand,#22d3ee)]">Pulse</span></span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "The pulse is the rhythm of decentralized creation. Own the artifact, own the future."
              </p>
              <div className="flex gap-10">
                 {SOCIALS.map(s => (
                   <Link key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[var(--brand,#22d3ee)] transition-colors italic">{s.l}</Link>
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
                        <Link href="#contact">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 NEON PULSE PROTOCOL. OWN THE VOID.{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
           <div className="flex gap-12">
              <Link href="#contact" className="hover:text-[var(--brand,#22d3ee)] transition-all">SYSTEM: ONLINE</Link>
              <Link href="#contact" className="hover:text-[var(--brand,#22d3ee)] transition-all">PULSE: STABLE</Link>
           </div>
        </div>
      </footer>

      {/* ── BUY NOW / MINT WAITLIST MODAL ───────────
          UI/UX-only reservation form — no wallet connection or on-chain
          transaction. Preselects the drop when opened from a card's "Buy
          Now"; otherwise (hero "Start Collecting" / "Open Collector
          Portal") it's the generic mint waitlist with a collection picker. */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)]"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full border border-[var(--brand,#22d3ee)] flex items-center justify-center mx-auto mb-6">
                    <Check className="w-7 h-7 text-[var(--brand,#22d3ee)]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3">
                    {modalDrop ? "Reservation Received" : "You're On The List"}
                  </h3>
                  <p className="text-sm text-white/40 font-light leading-relaxed mb-8">
                    {modalDrop
                      ? `We've reserved your spot for "${modalDrop.name}". Our team will confirm availability and next steps by email within 24h.`
                      : "Thanks for joining the mint waitlist. We'll email you the mint window and gas estimate as soon as it opens."}
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 py-3 min-h-[44px] bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[var(--brand,#22d3ee)] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserveSubmit}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#22d3ee)] block mb-3">
                    {modalDrop ? "Buy Now" : "Mint Waitlist"}
                  </span>
                  <h3 id="reserve-modal-title" className="text-3xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
                    {modalDrop ? modalDrop.name : "Reserve Your Mint"}
                  </h3>

                  {!modalDrop && (
                    <div className="mb-6">
                      <label htmlFor="reserve-collection" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Collection</label>
                      <select
                        id="reserve-collection"
                        required
                        value={form.dropId}
                        onChange={(e) => setForm((f) => ({ ...f, dropId: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] cursor-pointer"
                      >
                        <option value="" disabled>Select a collection…</option>
                        {drops.map((d: any) => (
                          <option key={d.id ?? d.name} value={d.id ?? d.name}>{d.name}{d.price ? ` — ${d.price}` : ""}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="reserve-name" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Full name</label>
                    <input
                      id="reserve-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ada Lovelace"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)]"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="reserve-email" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Email</label>
                    <input
                      id="reserve-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@domain.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm text-white placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)]"
                    />
                  </div>

                  <div className="mb-8">
                    <label htmlFor="reserve-qty" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Quantity</label>
                    <select
                      id="reserve-qty"
                      value={form.quantity}
                      onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}</option>))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full min-h-[44px] px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#22d3ee)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${submitting ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--brand,#22d3ee)] cursor-pointer"}`}
                  >
                    {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>) : (modalDrop ? "Confirm Reservation" : "Join Waitlist")}
                  </button>
                  <p className="text-[10px] text-white/20 text-center mt-4 font-light">No payment required now — this only secures your spot.</p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
