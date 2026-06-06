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
  Zap, Activity, Microscope,
  Target, Layers, Box, Hexagon,
  Terminal, Settings, Power, Info,
  AlertTriangle, ChevronRight, ChevronLeft, ArrowRight,
  Share2, Maximize2, Download, ExternalLink,
  Archive, Hash, Wifi, BarChart3,
  Fingerprint, Scan, Brain, Server,
  ShieldCheck, ShieldAlert, Award,
  Briefcase, Wind, Thermometer,
  Flame, Battery, Radio, Gauge,
  Timer, Lightbulb, Command, Grid,
  Radar, Orbit, Atom, Satellite,
  Milestone, FlaskConical, FlaskRound,
  Ghost, Binary, Database, Search,
  Cpu, HeartPulse, Sun, Magnet,
  CircleDot, Waves, Pickaxe, Mountain,
  Gem, Rocket, Drill, PlaneTakeoff,
  CpuIcon, Network, Eye, ZapOff,
  GhostIcon, RadioReceiver,
  LayersIcon, BinaryIcon, LockIcon,
  ShoppingBag, Check, X, Mail, MapPin, Clock
} from "lucide-react"

/* ==========================================================================
   THE QUANTUM PULSE DATASET (ULTRA DENSITY)
   ========================================================================== */

const QUANTUM_ASSETS = [
  {
    id: "qua-v4-42",
    name: "Quantum-v4 Pulse",
    type: "Superconducting Processor",
    qubits: "420 Qubits",
    fidelity: "99.98%",
    coherence: "150 μs",
    desc: "Processeur quantique à haute fidélité utilisant des circuits supraconducteurs pour une puissance de calcul exponentielle.",
    status: "Computing"
  },
  {
    id: "qua-ent-08",
    name: "Entangle Link Alpha",
    type: "Distributed Quantum Router",
    qubits: "1.2k Entangled Pairs",
    fidelity: "99.4%",
    coherence: "450 μs",
    desc: "Routeur quantique permettant la distribution d'états d'enchevêtrement pour une communication post-quantique sécurisée.",
    status: "Stable Sync"
  },
  {
    id: "qua-cry-15",
    name: "Qubit Grid v5",
    type: "Topological Quantum Computer",
    qubits: "85 Logical Qubits",
    fidelity: "99.999%",
    coherence: "∞ (Error-Corrected)",
    desc: "Système quantique topologique utilisant des anyons pour une immunité naturelle contre la décohérence.",
    status: "Standby"
  }
]

const QUANTUM_METRICS = [
  { label: "Cryo Temp", value: "12 mK", trend: "Optimal" },
  { label: "Gate Error", value: "0.002%", trend: "Stable" },
  { label: "Coherence", value: "142 μs", trend: "Peak" },
  { label: "Computation", value: "LIVE", trend: "Active" }
]

const QUANTUM_LOGS = [
  { timestamp: "20:14:42", unit: "Cryo-Module-01", status: "NOMINAL", temp: "12mK" },
  { timestamp: "20:14:45", unit: "Gate-Sync-Alpha", status: "EXECUTING", algo: "Shor_v4" },
  { timestamp: "20:14:48", unit: "Quantum-Shield", status: "SECURE", noise: "0.1dB" }
]

/* ==========================================================================
   BOUTIQUE CATALOG — quantum hardware modules (e-commerce, theme-native FR)
   ========================================================================== */

const PRODUCTS = [
  {
    id: "qpu-v4",
    name: "Quantum-v4 Pulse",
    type: "Superconducting QPU",
    price: 84200,
    qubits: "420 Qubits",
    fidelity: "99.98%",
    coherence: "150 μs",
    status: "Computing",
    desc: "Processeur quantique à haute fidélité utilisant des circuits supraconducteurs pour une puissance de calcul exponentielle. Architecture refroidie à 12 mK pour une décohérence minimale.",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "qpu-ent",
    name: "Entangle Link Alpha",
    type: "Distributed Quantum Router",
    price: 51900,
    qubits: "1.2k Pairs",
    fidelity: "99.4%",
    coherence: "450 μs",
    status: "Stable Sync",
    desc: "Routeur quantique permettant la distribution d'états d'enchevêtrement sur fibre optique pour une communication post-quantique sécurisée à l'échelle métropolitaine.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "qpu-grid",
    name: "Qubit Grid v5",
    type: "Topological Quantum Computer",
    price: 128500,
    qubits: "85 Logical",
    fidelity: "99.999%",
    coherence: "∞ Error-Corrected",
    status: "Standby",
    desc: "Système quantique topologique utilisant des anyons pour une immunité naturelle contre la décohérence. La correction d'erreur native repousse les limites du calcul fault-tolerant.",
    img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "cryo-01",
    name: "Cryo Module 01",
    type: "Dilution Refrigerator",
    price: 39800,
    qubits: "Host Bay x4",
    fidelity: "12 mK",
    coherence: "Continuous",
    status: "Nominal",
    desc: "Cryostat à dilution capable d'atteindre 8 milliKelvins en charge continue. Indispensable au maintien de la cohérence des processeurs supraconducteurs.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "shield-q",
    name: "Quantum Shield Array",
    type: "Noise Isolation Layer",
    price: 22400,
    qubits: "EMI -120 dB",
    fidelity: "0.1 dB noise",
    coherence: "Passive",
    status: "Secure",
    desc: "Blindage électromagnétique multicouche conçu pour isoler les qubits du bruit thermique et radiofréquence environnant. Compatible toutes architectures Pulse.",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "gate-sync",
    name: "Gate Sync Alpha",
    type: "Microwave Pulse Generator",
    price: 17600,
    qubits: "64 Channels",
    fidelity: "ps jitter",
    coherence: "Real-time",
    status: "Executing",
    desc: "Générateur d'impulsions micro-ondes haute précision pour l'initialisation et la manipulation des états quantiques. Latence inférieure à la picoseconde.",
    img: "https://images.unsplash.com/photo-1591238372338-22d30c883e34?q=80&w=1200&auto=format&fit=crop"
  }
]

/* ==========================================================================
   BLOG — mock FR articles (quantum, theme-native)
   ========================================================================== */

const BLOG_POSTS = [
  {
    slug: "supraconducteurs",
    title: "Pourquoi nous refroidissons à 12 milliKelvins",
    date: "12.06.2026",
    category: "Cryogénie",
    excerpt: "À quelques millièmes de degré du zéro absolu, le bruit thermique s'efface et la cohérence quantique survit. Plongée dans nos cryostats à dilution.",
    body: [
      "Un qubit supraconducteur est un objet d'une fragilité extrême. La moindre vibration thermique suffit à détruire la superposition que nous cherchons à exploiter. C'est pourquoi nos processeurs vivent à 12 milliKelvins, soit une température plus froide que l'espace intersidéral.",
      "Pour atteindre ce régime, nous utilisons des réfrigérateurs à dilution exploitant le mélange de deux isotopes d'hélium. Le processus de refroidissement s'étale sur plusieurs étages successifs, chacun divisant la température par un facteur dix.",
      "À ce niveau de froid, le bruit de gate descend sous les 0,002 %. C'est cette discipline cryogénique qui permet à nos algorithmes de tourner suffisamment longtemps pour produire un résultat exploitable.",
    ],
  },
  {
    slug: "enchevetrement",
    title: "L'enchevêtrement, ressource du calcul de demain",
    date: "03.06.2026",
    category: "Théorie",
    excerpt: "Einstein parlait d'action fantôme à distance. Nous en avons fait une infrastructure. Comment l'intrication distribue la puissance de calcul.",
    body: [
      "Deux qubits enchevêtrés se comportent comme une entité unique, quelle que soit la distance qui les sépare. Mesurer l'un détermine instantanément l'état de l'autre. Ce phénomène, longtemps considéré comme une curiosité théorique, est aujourd'hui le cœur de notre routeur Entangle Link.",
      "En distribuant des paires intriquées entre plusieurs unités, nous construisons un maillage quantique capable de partager des états cohérents sur l'ensemble d'une métropole. C'est la première brique d'un futur internet quantique.",
      "La sécurité qui en découle est intrinsèque : toute tentative d'interception perturbe l'état enchevêtré et se trahit immédiatement. La cryptographie post-quantique repose entièrement sur cette propriété.",
    ],
  },
  {
    slug: "correction-erreur",
    title: "Correction d'erreur : vers le calcul tolérant aux pannes",
    date: "21.05.2026",
    category: "Architecture",
    excerpt: "Un qubit logique vaut mille qubits physiques. Le secret du Qubit Grid v5 et de sa cohérence quasi infinie expliqué simplement.",
    body: [
      "La décohérence est l'ennemi numéro un du calcul quantique. Plutôt que de la combattre uniquement par le froid, le Qubit Grid v5 l'absorbe grâce à un code de correction d'erreur topologique.",
      "Le principe : encoder l'information d'un qubit logique sur un réseau de qubits physiques redondants. Une erreur locale est détectée et corrigée sans jamais perturber l'information protégée. La cohérence effective devient quasi infinie.",
      "C'est cette tolérance aux pannes qui fait la différence entre une démonstration de laboratoire et une machine industrielle. Nos 85 qubits logiques exécutent des circuits profonds là où les processeurs classiques décrochent.",
    ],
  },
  {
    slug: "atelier-pulse",
    title: "Dans les coulisses de l'atelier Pulse",
    date: "09.05.2026",
    category: "Coulisses",
    excerpt: "Trois mois pour assembler un processeur. Récit de la fabrication d'une puce supraconductrice, du dépôt en salle blanche aux tests cryogéniques.",
    body: [
      "Chaque processeur Pulse naît dans une salle blanche de classe ISO 4, où la moindre poussière ruinerait des semaines de travail. Le dépôt des jonctions Josephson se fait à l'échelle du nanomètre.",
      "Vient ensuite la phase de caractérisation : chaque qubit est testé individuellement à froid, sa fréquence calibrée, son temps de cohérence mesuré. Un seul module hors tolérance et toute la puce est rejetée.",
      "Ce niveau d'exigence explique nos délais. Mais c'est le prix d'une fidélité de gate à 99,98 %. Chaque unité qui quitte l'atelier porte le numéro de série de l'ingénieur qui l'a validée.",
    ],
  },
]

/* ==========================================
   NAVIGATION CONFIG (in-page React-state nav)
   ========================================== */

type QPage = "home" | "boutique" | "blog" | "about" | "contact" | "cgv" | "mentions"

const NAV_PAGES: { key: QPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "boutique", label: "Boutique" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
  { key: "cgv", label: "CGV" },
  { key: "mentions", label: "Mentions" },
]

/* ==========================================
   TECHNICAL COMPONENTS
   ========================================== */

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

function QubitFlowVisualizer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
       <svg width="100%" height="100%" className="w-full h-full">
          {[...Array(25)].map((_, i) => (
            <motion.circle
               key={i}
               cx={Math.random() * 2000}
               cy={Math.random() * 1000}
               r={2}
               fill="#a855f7"
               animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 3, 1],
                  filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
               }}
               transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <motion.path
               key={`entangle-${i}`}
               d={`M ${Math.random() * 2000} ${Math.random() * 1000} L ${Math.random() * 2000} ${Math.random() * 1000}`}
               stroke="#a855f7"
               strokeWidth="0.5"
               fill="none"
               animate={{ d: `M ${mousePos.x + (i * 50)} ${mousePos.y} L ${Math.random() * 2000} ${Math.random() * 1000}` }}
               transition={{ type: "spring", damping: 30, stiffness: 50 }}
            />
          ))}
       </svg>
    </div>
  )
}

function QuantumPulseModel({ progress }: { progress: any }) {
  const rotate = useTransform(progress, [0, 1], [0, 360])
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.2, 1])

  return (
    <motion.div style={{ rotate, scale }} className="relative w-80 h-80 flex items-center justify-center">
       <div className="absolute inset-0 border border-purple-500/10 rounded-full animate-spin-slow shadow-[0_0_80px_rgba(168,85,247,0.05)]" />
       <Atom className="w-40 h-40 text-purple-500/10 animate-pulse" />
       <div className="absolute inset-8 border border-purple-500/5 rounded-full" />
    </motion.div>
  )
}

/* ==========================================
   SHARED PAGE HEADER (theme-native, for sub-pages)
   ========================================== */

function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="relative pt-48 pb-24 px-8 md:px-24 border-b border-white/5 overflow-hidden">
       <div className="absolute top-0 right-0 p-80 bg-purple-400 opacity-[0.03] blur-[160px] rounded-full" />
       <div className="max-w-[1600px] mx-auto relative z-10">
          <Reveal>
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500 block mb-8 italic underline underline-offset-8 decoration-purple-400/20">{eyebrow}</span>
             <h1 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter italic leading-none text-white">{title}</h1>
          </Reveal>
       </div>
    </section>
  )
}

/* ==========================================
   THE QUANTUM PULSE - MAIN INTERFACE
   ========================================== */

export default function QuantumPulsePremium() {
  const [activeAsset, setActiveAsset] = useState(0)
  const [isCoherenceStable, setIsCoherenceStable] = useState(true)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Multi-page state (in-page React-state nav)
  const [page, setPage] = useState<QPage>("home")
  const [productDetail, setProductDetail] = useState<string | null>(null)
  const [blogSlug, setBlogSlug] = useState<string | null>(null)

  // Cart (persists across pages)
  const [cartCount, setCartCount] = useState(0)
  const addToCart = () => setCartCount(c => c + 1)

  const goTo = (p: QPage) => {
    setPage(p)
    setProductDetail(null)
    setBlogSlug(null)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" })
  }

  // Pulse Scroll Effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const textX = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <div ref={containerRef} className="bg-[#04020c] text-[#e0e8ed] font-mono selection:bg-purple-500/30 selection:text-white min-h-screen overflow-x-hidden transition-colors duration-1000">

      {/* GLOBAL HUD OVERLAY (shared) */}
      <HUD_Overlay isCoherenceStable={isCoherenceStable} />

      {/* PRIMARY NAV (shared across all pages) */}
      <QuantumNav page={page} goTo={goTo} cartCount={cartCount} />

      <main>
        {/* ══════════ HOME PAGE (original single-page content, unchanged) ══════════ */}
        {page === "home" && (
        <>
        {/* ==========================================
            1. QUANTUM IGNITION (HERO)
            ========================================== */}
        <section className="relative h-screen flex flex-col justify-center items-center px-8 md:px-24 overflow-hidden pt-20">
          <QubitFlowVisualizer />
          <motion.div style={{ opacity: heroOpacity }} className="absolute z-0 pointer-events-none flex items-center justify-center">
             <QuantumPulseModel progress={scrollYProgress} />
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl">
             <Reveal>
                <div className="inline-flex items-center gap-4 px-6 py-2 border border-purple-500/30 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-12 italic">
                   <Atom className="w-4 h-4" /> Pulse_Sync: NOMINAL // Cryo: 12 mK
                </div>
                <motion.h1 style={{ x: textX }} className="text-7xl md:text-[14vw] font-black tracking-tighter uppercase mb-16 leading-[0.75] italic">
                   Quantum <br/> <span className="text-white/5 italic">Pulse.</span>
                </motion.h1>
                <p className="max-w-3xl mx-auto text-sm md:text-lg text-white/30 leading-relaxed uppercase tracking-widest font-light mb-16 italic">
                   Le futur du calcul est quantique. Nous exploitons la superposition et l'enchevêtrement pour résoudre des problèmes impossibles pour les ordinateurs classiques, ouvrant la voie à une nouvelle ère de découverte.
                </p>

                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                   <button onClick={() => goTo("boutique")} className="px-12 py-6 bg-purple-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center gap-4 italic">
                      <Zap className="w-5 h-5" /> Initialize Algorithm
                   </button>
                   <button onClick={() => goTo("boutique")} className="px-12 py-6 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-4 italic">
                      <Database className="w-5 h-5" /> Quantum Registry
                   </button>
                </div>
             </Reveal>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-12">
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
                   <div className="w-16 h-px bg-white/10" />
                   Station_ID: QUANTUM-PULSE-01
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
                   <div className="w-16 h-px bg-white/10" />
                   Status: COHERENCE_STABLE
                </div>
             </div>
             <div className="text-right flex flex-col items-end gap-4">
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-purple-500">Qubit_Superposition_Stream</span>
                <div className="flex gap-2 h-12 items-end">
                   {[...Array(16)].map((_, i) => (
                     <motion.div
                        key={i}
                        animate={{ height: ["10%", "100%", "30%", "80%", "10%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-2 bg-purple-500/20"
                     />
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* ==========================================
            2. QUANTUM REGISTRY (DENSE TECHNICAL)
            ========================================== */}
        <section className="py-60 bg-[#08041c] relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-24">
              <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-12">
                 <Reveal>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500 block mb-6 italic underline underline-offset-8 decoration-purple-400/20">Quantum // Assets</span>
                    <h2 className="text-6xl md:text-[10vw] font-black uppercase tracking-tighter italic leading-none text-white">Archives.</h2>
                 </Reveal>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 block mb-4 italic">Registry // Quantum_Audit</span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-500">L'Architecture du Calcul Subatomique</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
                 {QUANTUM_ASSETS.map((asset, i) => (
                   <Reveal key={asset.id} delay={i * 0.1}>
                      <div className="bg-[#04020c] p-20 flex flex-col h-full hover:bg-white/[0.02] transition-all group cursor-crosshair border-white/5 border-r last:border-r-0">
                         <div className="flex justify-between items-start mb-16">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-800 group-hover:text-white transition-all duration-500">
                               <BinaryIcon className="w-8 h-8" />
                            </div>
                            <span className={`px-4 py-2 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] ${asset.status === "Computing" ? "text-purple-500" : "text-white/40"}`}>{asset.status}</span>
                         </div>

                         <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 italic text-white group-hover:translate-x-4 transition-transform">{asset.name}</h3>
                         <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-12">{asset.type}</div>

                         <div className="space-y-8 mb-20 border-l border-purple-500/20 pl-8">
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Qubits</span>
                               <span className="text-white group-hover:text-purple-400 transition-colors">{asset.qubits}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Gate Fidelity</span>
                               <span className="text-white group-hover:text-purple-400 transition-colors">{asset.fidelity}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                               <span className="text-white/20">Coherence Time</span>
                               <span className="text-white group-hover:text-purple-400 transition-colors">{asset.coherence}</span>
                            </div>
                         </div>

                         <p className="text-[12px] text-white/30 leading-loose uppercase tracking-[0.2em] font-bold italic mb-16">
                            {asset.desc}
                         </p>

                         <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Ref: {asset.id}</span>
                            <button onClick={() => goTo("boutique")} className="text-[10px] font-black uppercase text-white/40 flex items-center gap-4 group-hover:text-white transition-all">
                               Technical_Specs <ChevronRight className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. COHERENCE MONITOR (INTERACTIVE DATA)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-40 items-center">
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 block mb-12 italic underline underline-offset-8 decoration-purple-500/20">Quantum // Performance</span>
                       <h2 className="text-7xl md:text-[9vw] font-light italic leading-none text-white mb-16 uppercase tracking-tighter">
                          The <br/> <span className="not-italic font-black text-white/5 italic">Qubit_Mesh.</span>
                       </h2>
                       <p className="text-2xl font-light text-white/20 leading-relaxed mb-24 italic uppercase tracking-[0.2em] max-w-xl">
                          Surveillance de la stabilité quantique en temps réel. Nos capteurs analysent la cohérence et le taux d'erreur des portes pour garantir un calcul sans décohérence prématurée.
                       </p>
                       <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 mb-24 shadow-2xl">
                          {QUANTUM_METRICS.map((metric, i) => (
                            <div key={i} className="p-16 bg-[#0a0a1c] group hover:bg-white/[0.02] transition-all border-r border-b last:border-r-0 border-white/5">
                               <div className="text-[10px] font-black uppercase text-purple-500 mb-6 tracking-[0.4em]">{metric.label}</div>
                               <div className="text-5xl font-black text-white italic mb-6 tracking-tighter group-hover:translate-x-4 transition-transform">{metric.value}</div>
                               <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 italic">
                                  <Activity className="w-4 h-4 text-purple-500" /> {metric.trend}
                               </div>
                            </div>
                          ))}
                       </div>
                       <button
                         onClick={() => setIsCoherenceStable(!isCoherenceStable)}
                         className="w-full py-8 bg-purple-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-6 italic"
                       >
                          <Settings className="w-5 h-5" /> Re-Sync Quantum Nodes
                       </button>
                    </Reveal>
                 </div>

                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-[#0a0a1c] border border-white/10 p-20 flex flex-col justify-between relative group overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-80 bg-purple-400 opacity-[0.02] blur-[150px] rounded-full group-hover:opacity-[0.05] transition-opacity" />

                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Pulse_Link // QUA-SYNC-v42</span>
                                <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em]">Quantum_Stability_Telemetry</span>
                             </div>
                             <Wifi className="w-6 h-6 text-purple-400" />
                          </div>

                          {/* PULSE VISUALIZER (SVG) */}
                          <div className="relative z-10 flex flex-col items-center justify-center h-full">
                             <div className="w-64 h-64 border border-purple-400/5 rounded-full flex items-center justify-center relative">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 border-t-2 border-purple-400/20 rounded-full"
                                />
                                <motion.div
                                  animate={{ rotate: -360 }}
                                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-8 border-b-2 border-purple-400/10 rounded-full"
                                />
                                <Atom className={`w-24 h-24 transition-colors duration-1000 ${isCoherenceStable ? "text-purple-400 animate-pulse" : "text-white/5"}`} />
                             </div>
                             <div className="mt-16 text-center space-y-6">
                                <div className={`text-4xl font-black italic tracking-tighter ${isCoherenceStable ? "text-white" : "text-white/20"}`}>
                                   {isCoherenceStable ? "COHERENCE_LOCKED" : "DECOHERENCE_ALERT"}
                                </div>
                                <span className="text-[11px] font-bold text-white/10 uppercase tracking-[0.6em] block">Auth_Node: PULSE_UNIT_01</span>
                             </div>
                          </div>

                          <div className="relative z-10 flex gap-6">
                             <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                <motion.div
                                   animate={isCoherenceStable ? { x: ["-100%", "100%"] } : {}}
                                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-purple-700"
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
            4. QUANTUM STORY (TECH STORYTELLING)
            ========================================== */}
        <section className="py-60 bg-[#04020c] relative overflow-hidden border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-8 md:px-24">
              <div className="grid lg:grid-cols-2 gap-40 items-center">
                 <div className="relative aspect-[3/4] overflow-hidden group border border-white/5 shadow-2xl">
                    <Image
                       src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
                       alt="Quantum Pulse Infrastructure"
                       fill
                       className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-color group-hover:opacity-0 transition-opacity" />
                    <div className="absolute inset-0 p-20 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                       <div className="text-white">
                          <span className="text-[11px] font-black uppercase tracking-[0.6em] text-purple-500 mb-8 block italic underline underline-offset-8 decoration-purple-500/20">Atelier // Quantum // Unit</span>
                          <h4 className="text-6xl font-black tracking-tighter uppercase italic mb-12 mix-blend-difference text-white">Qubit <br/> Fabric.</h4>
                          <button onClick={() => goTo("about")} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/20 pb-4 hover:border-purple-400 transition-all group">
                             Entanglement Protocols <ExternalLink className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <Reveal>
                       <div className="mb-24 text-left">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-8 block italic">Chapitre III // Calcul Subatomique</span>
                          <h2 className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase text-white italic leading-none">Pure_Quantum.</h2>
                       </div>
                       <p className="text-2xl font-light text-white/20 leading-relaxed italic mb-20 uppercase tracking-[0.2em]">
                          L'information est une probabilité. Nous utilisons des technologies de superposition et d'enchevêtrement pour explorer tous les chemins possibles simultanément, offrant une puissance de calcul qui redéfinit les limites de l'univers connu.
                       </p>
                       <div className="space-y-20">
                          {[
                            { t: "Cryo Cooling", d: "Refroidissement extrême des processeurs à des températures proches du zéro absolu (milliKelvins) pour minimiser le bruit thermique." },
                            { t: "Qubit Initialization", d: "Préparation des états quantiques de base via des impulsions micro-ondes haute précision pour garantir une superposition parfaite." },
                            { t: "Gate Execution", d: "Manipulation des états quantiques par des portes logiques universelles (Hadamard, CNOT) pour l'exécution d'algorithmes complexes." }
                          ].map((step, i) => (
                            <div key={i} className="group flex gap-12 border-b border-white/5 pb-16 hover:border-purple-400/20 transition-all cursor-default">
                               <div className="text-6xl font-black text-white/5 group-hover:text-purple-400/20 transition-colors italic leading-none">0{i+1}</div>
                               <div>
                                  <h5 className="text-3xl font-black uppercase tracking-tight text-white mb-6 italic group-hover:translate-x-4 transition-transform">{step.t}</h5>
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
        </>
        )}

        {/* ══════════ BOUTIQUE ══════════ */}
        {page === "boutique" && (
          <BoutiquePage
            productDetail={productDetail}
            setProductDetail={setProductDetail}
            onAddToCart={addToCart}
          />
        )}

        {/* ══════════ BLOG ══════════ */}
        {page === "blog" && (
          <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />
        )}

        {/* ══════════ À PROPOS ══════════ */}
        {page === "about" && <AboutPage goTo={goTo} />}

        {/* ══════════ CONTACT ══════════ */}
        {page === "contact" && <ContactPage />}

        {/* ══════════ CGV ══════════ */}
        {page === "cgv" && <LegalPage variant="cgv" />}

        {/* ══════════ MENTIONS LÉGALES ══════════ */}
        {page === "mentions" && <LegalPage variant="mentions" />}

        {/* MEGA FOOTER (shared) */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-24 relative z-50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-6 mb-16 cursor-pointer" onClick={() => goTo("home")}>
                    <div className="w-16 h-16 bg-purple-800 flex items-center justify-center">
                      <Atom className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter italic">QUANTUM<span className="text-white/20">PULSE.</span></span>
                 </div>
                 <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.5em] leading-loose max-w-sm mb-20 italic">
                    "L'avenir du calcul est quantique." — Archive Pulse V.42
                 </p>
                 <div className="flex flex-wrap gap-x-16 gap-y-6">
                    {NAV_PAGES.filter(n => n.key !== "home").map(n => (
                      <button key={n.key} onClick={() => goTo(n.key)} className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-purple-400 transition-colors italic underline underline-offset-8 decoration-white/5">{n.label}</button>
                    ))}
                 </div>
              </div>

              {[
                { t: "PROCESSORS", l: ["Quantum-v4 Pulse", "Qubit Grid v5", "Entangle Link Alpha", "Cryo Module 01"], to: "boutique" as QPage },
                { t: "TECHNOLOGY", l: ["Cryo Cooling", "Gate Logic", "Quantum Sync", "SLA Reports"], to: "blog" as QPage },
                { t: "ATELIER", l: ["Our Legacy", "Quantum Ethics", "Locations", "Support"], to: "about" as QPage }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                  <h4 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.6em] italic">{col.t}</h4>
                  <ul className="flex flex-col gap-8">
                    {col.l.map(link => (
                      <li key={link} onClick={() => goTo(col.to)} className="text-[11px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-[0.4em] italic">{link}</li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-16 flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">
              <span>© 2026 QUANTUM PULSE COMPUTING SYSTEMS AG. // ALL_RIGHTS_RESERVED</span>
              <div className="flex flex-wrap gap-x-16 gap-y-4 justify-center">
                 <button onClick={() => goTo("mentions")} className="hover:text-purple-400 transition-colors uppercase tracking-[0.6em]">Mentions</button>
                 <button onClick={() => goTo("cgv")} className="hover:text-purple-400 transition-colors uppercase tracking-[0.6em]">CGV</button>
                 <span>CRYO: 12 MK (AVG)</span>
                 <span>v4.12.0-STABLE</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  )
}

/* ==========================================
   PRIMARY NAV (shared)
   ========================================== */

function QuantumNav({ page, goTo, cartCount }: { page: QPage; goTo: (p: QPage) => void; cartCount: number }) {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-[90] bg-black/60 backdrop-blur-2xl border-b border-white/5">
       <div className="max-w-[1600px] mx-auto px-8 md:px-24 h-24 flex items-center justify-between gap-8">
          {/* Logo */}
          <button onClick={() => goTo("home")} className="flex items-center gap-4 shrink-0">
             <div className="w-10 h-10 bg-purple-800 flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-black uppercase tracking-tighter italic text-white hidden sm:inline">QUANTUM<span className="text-purple-500">PULSE.</span></span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
             {NAV_PAGES.map(({ key, label }) => (
               <button
                 key={key}
                 onClick={() => goTo(key)}
                 className={`text-[10px] font-black uppercase tracking-[0.3em] italic transition-colors ${page === key ? "text-purple-400 border-b border-purple-400 pb-1" : "text-white/40 hover:text-white"}`}
               >
                 {label}
               </button>
             ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-6 shrink-0">
             <button onClick={() => goTo("boutique")} className="relative flex items-center gap-3 px-5 py-3 border border-purple-500/30 bg-purple-500/5 text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 hover:bg-purple-800 hover:text-white transition-all italic">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 text-white text-[9px] font-black flex items-center justify-center rounded-full">
                     {cartCount}
                  </span>
                )}
             </button>
             {/* Mobile menu toggle */}
             <button onClick={() => setOpen(o => !o)} className="lg:hidden text-white/60 hover:text-white">
                {open ? <X className="w-6 h-6" /> : <Grid className="w-6 h-6" />}
             </button>
          </div>
       </div>

       {/* Mobile dropdown */}
       <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/5 bg-black/90 backdrop-blur-2xl"
            >
               <div className="px-8 py-8 flex flex-col gap-6">
                  {NAV_PAGES.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => { goTo(key); setOpen(false) }}
                      className={`text-left text-[12px] font-black uppercase tracking-[0.3em] italic transition-colors ${page === key ? "text-purple-400" : "text-white/40 hover:text-white"}`}
                    >
                      {label}
                    </button>
                  ))}
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </nav>
  )
}

/* ==========================================
   BOUTIQUE PAGE (grid + product detail)
   ========================================== */

function BoutiquePage({
  productDetail,
  setProductDetail,
  onAddToCart,
}: {
  productDetail: string | null
  setProductDetail: (id: string | null) => void
  onAddToCart: () => void
}) {
  const product = productDetail ? PRODUCTS.find(p => p.id === productDetail) : null

  if (product) {
    return <ProductDetail p={product} onBack={() => setProductDetail(null)} onAddToCart={onAddToCart} />
  }

  return (
    <div>
      <PageHeader eyebrow="Quantum // Hardware" title="Boutique." />
      <section className="py-40 px-8 md:px-24">
         <div className="max-w-[1600px] mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
               {PRODUCTS.map((p, i) => (
                 <ProductCard
                   key={p.id}
                   p={p}
                   i={i}
                   onOpen={() => {
                     setProductDetail(p.id)
                     if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" })
                   }}
                 />
               ))}
            </div>
         </div>
      </section>
    </div>
  )
}

function ProductCard({ p, i, onOpen }: { p: typeof PRODUCTS[0]; i: number; onOpen: () => void }) {
  return (
    <Reveal delay={(i % 3) * 0.1}>
       <div
         onClick={onOpen}
         className="bg-[#04020c] flex flex-col h-full hover:bg-white/[0.02] transition-all group cursor-pointer"
       >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden border-b border-white/5">
             <Image
               src={p.img}
               alt={p.name}
               fill
               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms]"
             />
             <div className="absolute inset-0 bg-purple-900/20 mix-blend-color group-hover:opacity-0 transition-opacity" />
             <span className={`absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] italic ${p.status === "Computing" ? "text-purple-400" : "text-white/50"}`}>{p.status}</span>
          </div>

          {/* Body */}
          <div className="p-12 flex flex-col flex-1">
             <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">{p.type}</div>
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic text-white group-hover:translate-x-2 transition-transform">{p.name}</h3>

             <div className="space-y-4 mb-10 border-l border-purple-500/20 pl-6">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                   <span className="text-white/20">Qubits</span>
                   <span className="text-white group-hover:text-purple-400 transition-colors">{p.qubits}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                   <span className="text-white/20">Fidelity</span>
                   <span className="text-white group-hover:text-purple-400 transition-colors">{p.fidelity}</span>
                </div>
             </div>

             <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                <span className="text-2xl font-black text-white italic tracking-tighter">{p.price.toLocaleString("fr-FR")} €</span>
                <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-3 group-hover:text-purple-400 transition-all italic">
                   Fiche <ChevronRight className="w-4 h-4" />
                </span>
             </div>
          </div>
       </div>
    </Reveal>
  )
}

function ProductDetail({ p, onBack, onAddToCart }: { p: typeof PRODUCTS[0]; onBack: () => void; onAddToCart: () => void }) {
  const [added, setAdded] = useState(false)
  const handleAdd = () => {
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="pt-48 pb-40 px-8 md:px-24">
       <div className="max-w-[1400px] mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-purple-400 transition-colors mb-16 italic"
          >
             <ChevronLeft className="w-4 h-4" /> Retour à la boutique
          </button>

          <div className="grid lg:grid-cols-2 gap-24 items-start">
             {/* Image */}
             <Reveal x={-30} y={0}>
                <div className="relative aspect-square overflow-hidden border border-white/10 shadow-2xl group">
                   <Image src={p.img} alt={p.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms]" />
                   <div className="absolute inset-0 bg-purple-900/15 mix-blend-color" />
                   <span className="absolute top-8 left-8 px-5 py-2 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 italic">{p.status}</span>
                </div>
             </Reveal>

             {/* Info */}
             <Reveal x={30} y={0} delay={0.1}>
                <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mb-8 italic">{p.type}</div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none mb-12">{p.name}</h1>

                <div className="text-4xl font-black text-white italic tracking-tighter mb-12">{p.price.toLocaleString("fr-FR")} €</div>

                <p className="text-[13px] text-white/30 leading-loose uppercase tracking-[0.2em] font-bold italic mb-16">
                   {p.desc}
                </p>

                <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5 mb-16 shadow-2xl">
                   {[
                     { label: "Qubits", value: p.qubits },
                     { label: "Fidelity", value: p.fidelity },
                     { label: "Coherence", value: p.coherence },
                   ].map((spec, i) => (
                     <div key={i} className="p-8 bg-[#0a0a1c]">
                        <div className="text-[9px] font-black uppercase text-purple-500 mb-4 tracking-[0.3em]">{spec.label}</div>
                        <div className="text-lg font-black text-white italic tracking-tighter">{spec.value}</div>
                     </div>
                   ))}
                </div>

                <button
                  onClick={handleAdd}
                  className={`w-full py-7 text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 italic ${added ? "bg-purple-500 text-white" : "bg-purple-800 text-white hover:bg-white hover:text-black"}`}
                >
                   {added ? (
                     <><Check className="w-5 h-5" /> Ajouté au registre</>
                   ) : (
                     <><ShoppingBag className="w-5 h-5" /> Ajouter au panier — {p.price.toLocaleString("fr-FR")} €</>
                   )}
                </button>

                <div className="flex flex-wrap gap-8 mt-10 text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                   <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-purple-500" /> Garantie cryogénique 36 mois</span>
                   <span className="flex items-center gap-3"><Server className="w-4 h-4 text-purple-500" /> Installation incluse</span>
                </div>
             </Reveal>
          </div>
       </div>
    </section>
  )
}

/* ==========================================
   BLOG PAGE (index + single article)
   ========================================== */

function BlogPage({ blogSlug, setBlogSlug }: { blogSlug: string | null; setBlogSlug: (s: string | null) => void }) {
  const post = blogSlug ? BLOG_POSTS.find(b => b.slug === blogSlug) : null

  if (post) {
    return (
      <section className="pt-48 pb-40 px-8 md:px-24">
         <div className="max-w-[860px] mx-auto">
            <button
              onClick={() => setBlogSlug(null)}
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-purple-400 transition-colors mb-16 italic"
            >
               <ChevronLeft className="w-4 h-4" /> Tous les articles
            </button>
            <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mb-8 italic">{post.category} // {post.date}</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none mb-16">{post.title}</h1>
            <div className="h-px w-full bg-white/10 mb-16" />
            {post.body.map((para, i) => (
              <p key={i} className="text-base md:text-lg text-white/40 leading-loose font-light italic mb-10">{para}</p>
            ))}
            <div className="border-t border-white/5 mt-16 pt-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
               Rédigé par l'équipe Atelier Quantum Pulse.
            </div>
         </div>
      </section>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Journal // Quantum" title="Blog." />
      <section className="py-40 px-8 md:px-24">
         <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 shadow-2xl">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 0.1}>
                 <article
                   onClick={() => {
                     setBlogSlug(post.slug)
                     if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" })
                   }}
                   className="bg-[#04020c] p-16 flex flex-col h-full hover:bg-white/[0.02] transition-all group cursor-pointer"
                 >
                    <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mb-8 italic">{post.category} // {post.date}</div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-none mb-10 group-hover:translate-x-2 transition-transform">{post.title}</h2>
                    <p className="text-[12px] text-white/30 leading-loose uppercase tracking-[0.2em] font-bold italic mb-12">{post.excerpt}</p>
                    <div className="mt-auto pt-8 border-t border-white/5">
                       <span className="text-[10px] font-black uppercase text-white/40 flex items-center gap-3 group-hover:text-purple-400 transition-all italic">
                          Lire l'article <ArrowRight className="w-4 h-4" />
                       </span>
                    </div>
                 </article>
              </Reveal>
            ))}
         </div>
      </section>
    </div>
  )
}

/* ==========================================
   ABOUT PAGE
   ========================================== */

function AboutPage({ goTo }: { goTo: (p: QPage) => void }) {
  const values = [
    { icon: <Thermometer className="w-7 h-7" />, t: "Discipline cryogénique", d: "Nos processeurs vivent à 12 milliKelvins, plus froid que l'espace intersidéral, pour préserver chaque état quantique." },
    { icon: <ShieldCheck className="w-7 h-7" />, t: "Fidélité absolue", d: "Chaque qubit est calibré et validé individuellement. Une seule tolérance dépassée et la puce entière est rejetée." },
    { icon: <Network className="w-7 h-7" />, t: "Architecture ouverte", d: "Nos modules s'intègrent à toute infrastructure Pulse. L'enchevêtrement distribué relie vos unités à l'échelle d'une métropole." },
  ]
  return (
    <div>
      <PageHeader eyebrow="Atelier // Legacy" title="À propos." />
      <section className="py-40 px-8 md:px-24">
         <div className="max-w-[860px] mx-auto">
            <Reveal>
               {[
                 "Quantum Pulse est né d'une conviction : le calcul quantique ne doit pas rester confiné aux laboratoires académiques. Nous concevons et fabriquons des processeurs supraconducteurs prêts pour l'industrie, sans compromis sur la fidélité.",
                 "Fondé par une équipe d'ingénieurs en cryogénie et en physique des matériaux, notre atelier réunit un savoir-faire rare. Du dépôt des jonctions Josephson en salle blanche à la caractérisation à froid, chaque étape est maîtrisée en interne.",
                 "Aujourd'hui, nos unités équipent des centres de recherche et des acteurs de la cybersécurité post-quantique. Notre mission reste inchangée : repousser les limites du calcul subatomique, une impulsion à la fois.",
               ].map((para, i) => (
                 <p key={i} className="text-base md:text-lg text-white/40 leading-loose font-light italic mb-10">{para}</p>
               ))}
            </Reveal>
         </div>
      </section>

      <section className="py-32 px-8 md:px-24 bg-[#08041c] border-y border-white/5">
         <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.1}>
                 <div className="bg-[#04020c] p-16 flex flex-col h-full hover:bg-white/[0.02] transition-all group">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 mb-12 group-hover:bg-purple-800 group-hover:text-white transition-all duration-500">
                       {v.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-8">{v.t}</h3>
                    <p className="text-[12px] text-white/30 leading-loose uppercase tracking-[0.2em] font-bold italic">{v.d}</p>
                 </div>
              </Reveal>
            ))}
         </div>
      </section>

      <section className="py-40 px-8 md:px-24 text-center">
         <Reveal>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none mb-12">Rejoignez<br/><span className="text-white/5">le futur.</span></h2>
            <button onClick={() => goTo("boutique")} className="px-12 py-6 bg-purple-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(168,85,247,0.2)] inline-flex items-center gap-4 italic">
               <ShoppingBag className="w-5 h-5" /> Découvrir nos modules
            </button>
         </Reveal>
      </section>
    </div>
  )
}

/* ==========================================
   CONTACT PAGE
   ========================================== */

function ContactPage() {
  const [sent, setSent] = useState(false)
  const inputClass = "w-full bg-white/5 border border-white/10 text-white px-6 py-4 text-[16px] font-bold uppercase tracking-widest italic outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/20"

  return (
    <div>
      <PageHeader eyebrow="Pulse // Link" title="Contact." />
      <section className="py-40 px-8 md:px-24">
         <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24">
            {/* Info */}
            <Reveal>
               <div className="space-y-12">
                  {[
                    { icon: <Mail className="w-6 h-6" />, label: "Email", value: "contact@aevia.io" },
                    { icon: <MapPin className="w-6 h-6" />, label: "Localisation", value: "Communiquée sur demande" },
                    { icon: <Clock className="w-6 h-6" />, label: "Horaires", value: "Lun – Ven · 09h – 18h" },
                    { icon: <Wifi className="w-6 h-6" />, label: "Statut Grid", value: "SECURE // NOMINAL" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-8 border-b border-white/5 pb-12">
                       <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shrink-0">{item.icon}</div>
                       <div>
                          <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-3 italic">{item.label}</div>
                          <div className="text-xl font-black text-white italic tracking-tight">{item.value}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.15}>
               {sent ? (
                 <div className="bg-[#0a0a1c] border border-white/10 p-20 flex flex-col items-center justify-center text-center h-full shadow-2xl">
                    <Check className="w-12 h-12 text-purple-400 mb-8" />
                    <div className="text-3xl font-black uppercase tracking-tighter italic text-white mb-6">Signal reçu</div>
                    <p className="text-[12px] text-white/30 uppercase tracking-[0.3em] font-bold italic">Notre équipe vous répond sous 24h ouvrées.</p>
                 </div>
               ) : (
                 <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="bg-[#0a0a1c] border border-white/10 p-12 md:p-16 space-y-6 shadow-2xl">
                    <div>
                       <label className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4 block italic">Nom complet</label>
                       <input className={inputClass} type="text" placeholder="Votre nom" required />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4 block italic">Email</label>
                       <input className={inputClass} type="email" placeholder="votre@email.io" required />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4 block italic">Sujet</label>
                       <input className={inputClass} type="text" placeholder="Objet du signal" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4 block italic">Message</label>
                       <textarea className={`${inputClass} min-h-[160px] resize-y`} placeholder="Comment pouvons-nous vous aider ?" required />
                    </div>
                    <button type="submit" className="w-full py-6 bg-purple-800 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-4 italic">
                       <Zap className="w-5 h-5" /> Transmettre le signal
                    </button>
                 </form>
               )}
            </Reveal>
         </div>
      </section>
    </div>
  )
}

/* ==========================================
   LEGAL PAGES (CGV + Mentions)
   ========================================== */

function LegalPage({ variant }: { variant: "cgv" | "mentions" }) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-12">
       <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-6">{title}</h2>
       <div className="text-[13px] text-white/40 leading-loose uppercase tracking-[0.15em] font-bold italic space-y-4">{children}</div>
    </div>
  )

  if (variant === "mentions") {
    return (
      <div>
        <PageHeader eyebrow="Informations // Légales" title="Mentions." />
        <section className="py-40 px-8 md:px-24">
           <div className="max-w-[860px] mx-auto">
              <Reveal>
                 <Section title="Éditeur du site">
                    <p><span className="text-white">Aevia WS</span> — entrepreneur individuel (auto-entrepreneur).</p>
                    <p>Directeur de la publication : <span className="text-white">Valentin Milliand</span>.</p>
                    <p>SIREN : <span className="text-white">852 546 225</span> — RCS Bourg-en-Bresse.</p>
                    <p>Contact : <span className="text-white">contact@aevia.io</span></p>
                    <p>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>
                 </Section>
                 <Section title="TVA">
                    <p>TVA non applicable, art. 293 B du CGI.</p>
                 </Section>
                 <Section title="Hébergeur">
                    <p>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
                 </Section>
                 <Section title="Propriété intellectuelle">
                    <p>L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable de l'éditeur.</p>
                 </Section>
                 <Section title="Données personnelles">
                    <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, écrivez à contact@aevia.io.</p>
                 </Section>
              </Reveal>
           </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Conditions // Générales" title="CGV." />
      <section className="py-40 px-8 md:px-24">
         <div className="max-w-[860px] mx-auto">
            <Reveal>
               <p className="text-[11px] text-white/20 uppercase tracking-[0.3em] font-bold italic mb-16">Dernière mise à jour : juin 2026.</p>
               <Section title="Article 1 — Objet">
                  <p>Les présentes conditions générales de vente régissent les relations contractuelles entre Quantum Pulse et tout client effectuant un achat sur le site. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
               </Section>
               <Section title="Article 2 — Prix">
                  <p>Les prix sont indiqués en euros, hors taxes pour le matériel professionnel. Quantum Pulse se réserve le droit de modifier ses prix à tout moment ; les modules sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
               </Section>
               <Section title="Article 3 — Commande">
                  <p>La commande est validée après confirmation du paiement et étude de faisabilité technique de l'installation. Un récapitulatif est adressé au client. Quantum Pulse se réserve le droit d'annuler toute commande en cas de litige de paiement ou d'incompatibilité d'infrastructure.</p>
               </Section>
               <Section title="Article 4 — Paiement">
                  <p>Le règlement s'effectue par virement bancaire sécurisé ou via un prestataire de paiement agréé. Aucune donnée bancaire n'est conservée par Quantum Pulse.</p>
               </Section>
               <Section title="Article 5 — Livraison & Installation">
                  <p>Le matériel cryogénique est livré et installé par nos ingénieurs sur le site du client. Les délais varient selon la complexité de l'infrastructure. Les risques sont transférés au client après recette de l'installation.</p>
               </Section>
               <Section title="Article 6 — Droit de rétractation">
                  <p>Conformément au Code de la consommation, le client particulier dispose d'un délai de 14 jours pour se rétracter, sous réserve que le module n'ait pas été mis en service. Les équipements professionnels sur mesure ne sont pas concernés par ce droit.</p>
               </Section>
               <Section title="Article 7 — Garanties">
                  <p>Tous les modules bénéficient d'une garantie cryogénique de 36 mois ainsi que des garanties légales de conformité et contre les vices cachés, conformément au Code de la consommation et au Code civil.</p>
               </Section>
               <Section title="Article 8 — Droit applicable">
                  <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
               </Section>
            </Reveal>
         </div>
      </section>
    </div>
  )
}

/* ==========================================
   TECHNICAL SUB-COMPONENTS
   ========================================== */

function HUD_Overlay({ isCoherenceStable }: { isCoherenceStable: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
       {/* Corner Brackets */}
       <div className={`absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 transition-colors duration-1000 ${isCoherenceStable ? "border-purple-400" : "border-white/10"}`} />
       <div className={`absolute top-12 right-12 w-20 h-20 border-t-2 border-r-2 transition-colors duration-1000 ${isCoherenceStable ? "border-purple-400" : "border-white/10"}`} />
       <div className={`absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 transition-colors duration-1000 ${isCoherenceStable ? "border-purple-400" : "border-white/10"}`} />
       <div className={`absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 transition-colors duration-1000 ${isCoherenceStable ? "border-purple-400" : "border-white/10"}`} />

       {/* Right Rotation Info */}
       <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden lg:block">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/5 italic">Unauthorized_Duplication_Of_Quantum_Patterns_Is_Strictly_Monitored_By_Global_Quantum_Alliance</span>
       </div>
    </div>
  )
}
