"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Terminal, GitBranch, ExternalLink, ChevronRight, Code2, Check, Cpu, RefreshCw, Layers, Shield } from "lucide-react"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-29-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-29-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function ScrollImage({ src, alt, width, height, className = "", dir = 1, yRange = 50 }: {
  src: string; alt: string; width: number; height: number; className?: string; dir?: number; yRange?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-5 * dir, 5 * dir])
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.0, 1.1])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ rotate, y, scale }}>
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

type ActivePage = "home" | "work" | "skills" | "timeline" | "legal"

const projects = [
  {
    name: "noctua.dev",
    desc: "Real-time collaborative code editor. WebSockets, Monaco Editor, Y.js CRDT.",
    stack: ["Next.js", "Rust", "WebSockets", "PostgreSQL"],
    stars: "2.1k",
    forks: "210",
    installation: "npm install -g @noctua/core\nnoctua dev --port 4000",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&crop=center",
  },
  {
    name: "argos-cli",
    desc: "Terminal-based API testing framework with snapshot diffs and CI/CD integration.",
    stack: ["Node.js", "TypeScript", "Jest"],
    stars: "847",
    forks: "94",
    installation: "npm install -g argos-cli\nargos test ./api/specs --diff",
    img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=500&fit=crop&crop=center",
  },
  {
    name: "vaultkey",
    desc: "Zero-knowledge password manager. AES-256-GCM, argon2id key derivation, WASM crypto.",
    stack: ["Rust", "WASM", "React", "SQLite"],
    stars: "3.4k",
    forks: "482",
    installation: "cargo install vaultkey-cli\nvaultkey init --vault ~/.vk",
    img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=500&fit=crop&crop=center",
  },
]

const skills = [
  { cat: "Languages", items: ["TypeScript", "Rust", "Go", "Python", "SQL"] },
  { cat: "Frontend", items: ["React 19", "Next.js 15", "Framer Motion", "Radix UI", "Tailwind"] },
  { cat: "Backend", items: ["Node.js", "Axum", "Gin", "tRPC", "GraphQL"] },
  { cat: "Infra", items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "Cloudflare"] },
]

const timeline = [
  { 
    year: "2024", 
    role: "Staff Engineer", 
    co: "Stripe", 
    desc: "Led infrastructure reliability for payment processing at scale.",
    impact: [
      "Designed real-time idempotency layer handling 25k requests/sec",
      "Reduced processing tail latency (p99.9) by 140ms using Rust sidecars",
      "Mentored a core team of 8 senior and principal engineers"
    ]
  },
  { 
    year: "2023", 
    role: "Senior Frontend", 
    co: "Vercel", 
    desc: "Core contributor to Next.js App Router and Turbopack.",
    impact: [
      "Optimized hot module replacement speeds for Turbopack in Next.js 14",
      "Refactored asynchronous boundary routing handlers for SSR stability",
      "Drafted primary architecturalRFCs for layout transition lifecycle hooks"
    ]
  },
  { 
    year: "2021", 
    role: "Founding Engineer", 
    co: "Linear", 
    desc: "Built the real-time sync engine from scratch (Yjs + CRDTs).",
    impact: [
      "Authored localized IndexedDB sync cache layer supporting offline operations",
      "Designed transaction compaction pipeline reducing network payload weights by 45%",
      "Maintained 99.99% socket message delivery rate over custom WebSockets client"
    ]
  },
  { 
    year: "2019", 
    role: "Backend Engineer", 
    co: "Algolia", 
    desc: "Search indexing pipeline and distributed query routing.",
    impact: [
      "Rewrote index distribution clusters in C++/Go, improving query times by 20%",
      "Engineered automated shard failover protocol for European search clusters",
      "Developed telemetry parsing tools used to detect search anomaly patterns"
    ]
  },
]

export default function Impact29() {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const [page, setPage] = useState<ActivePage>("home")

  // Interactive Terminal State
  const [termInput, setTermInput] = useState("")
  const [termLogs, setTermLogs] = useState<{ type: "input" | "output", text: string }[]>([
    { type: "output", text: "glitch.dev Shell v1.0.0" },
    { type: "output", text: "Type 'help' to view available commands." },
  ])

  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

  const goTo = (p: ActivePage) => {
    setPage(p)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  // Handle Terminal submit
  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termInput.trim()) return

    const input = termInput.trim().toLowerCase()
    const newLogs = [...termLogs, { type: "input" as const, text: `$ ${termInput}` }]

    let response: string[] = []

    switch (input) {
      case "help":
        response = [
          "Available commands:",
          "  info         - Display personal credentials",
          "  skills       - List core technical stack",
          "  experience   - Output career highlights",
          "  neofetch     - Display ASCII logo & system stats",
          "  clear        - Reset terminal window"
        ]
        break
      case "info":
        response = [
          "Credentials:",
          "  NAME: Raphaël Genet",
          "  ROLE: Staff Engineer & Open Source Advocate",
          "  LOC:  Paris, France",
          "  AVAIL: Q3 2026 contracts"
        ]
        break
      case "skills":
        response = [
          "Technical Capabilities:",
          "  LANGUAGES : TypeScript, Rust, Go, Python, C++",
          "  FRONTEND  : React 19, Next.js, Framer Motion, Radix UI",
          "  BACKEND   : Axum, Node.js, Gin, tRPC, WebSockets",
          "  INFRA     : K8s, Docker, PostgreSQL, Redis, Cloudflare"
        ]
        break
      case "experience":
        response = [
          "Career History Summary:",
          "  2024 - Staff Engineer @ Stripe",
          "  2023 - Senior Frontend Developer @ Vercel",
          "  2021 - Founding Engineer @ Linear",
          "  2019 - Backend Engineer @ Algolia"
        ]
        break
      case "neofetch":
        response = [
          "   ____ _ _ _       glitch@dev-machine",
          "  / ___| (_) |_ ___ _ _    ------------------",
          " | |  _| | | __/ __| '_ \\   OS: NixOS unstable x86_64",
          " | |_| | | | |_\\__ \\ | | |  Kernel: 6.9.3-nix",
          "  \\____|_|_|\\__|___/_| |_|  Shell: zsh 5.9",
          "                            CPU: Apple M3 Max Virtualized",
          "                            Memory: 64 GB / 128 GB"
        ]
        break
      case "clear":
        setTermLogs([])
        setTermInput("")
        return
      default:
        response = [`Error: command not found: '${termInput}'. Type 'help' for options.`]
    }

    setTermLogs([...newLogs, ...response.map(text => ({ type: "output" as const, text }))])
    setTermInput("")
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0E1A] text-[#E2E8F0] select-none selection:bg-[#00F5D4] selection:text-[#0A0E1A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-[#00F5D4] origin-left z-50" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div onClick={() => goTo("home")} className="flex items-center gap-3 cursor-pointer">
            <Terminal className="w-5 h-5 text-[#00F5D4]" />
            <span className="font-bold text-[#00F5D4]">glitch</span>
            <span className="text-[#475569]">.dev</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#475569]">
            <button onClick={() => goTo("work")} className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${page === 'work' ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>work
            </button>
            <button onClick={() => goTo("skills")} className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${page === 'skills' ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>skills
            </button>
            <button onClick={() => goTo("timeline")} className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${page === 'timeline' ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>timeline
            </button>
            <button onClick={() => {
              if (page !== "home") goTo("home")
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }} className="hover:text-[#00F5D4] transition-colors cursor-pointer">
              <span className="text-[#00F5D4]">// </span>contact
            </button>
          </div>
          <button 
            onClick={() => {
              if (page !== "home") goTo("home")
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }}
            className="hidden md:flex items-center gap-2 border border-[#00F5D4]/40 text-[#00F5D4] text-xs px-4 py-2 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer"
          >
            hire me <ArrowRight className="w-3 h-3" />
          </button>
          <button className="md:hidden text-[#00F5D4] cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <Terminal className="w-5 h-5" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-[#00F5D4]/10 bg-[#0A0E1A] px-6 py-4 flex flex-col gap-3 text-sm"
            >
              <button onClick={() => goTo("work")} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>work
              </button>
              <button onClick={() => goTo("skills")} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>skills
              </button>
              <button onClick={() => goTo("timeline")} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>timeline
              </button>
              <button onClick={() => {
                setMenuOpen(false)
                if (page !== "home") goTo("home")
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>contact
              </button>
              <button onClick={() => goTo("legal")} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>legal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HOME PAGE */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
        {/* Hero */}
        <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#00F5D4]/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(rgba(0,245,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }} />
          </div>
          <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-[#00F5D4] text-xs mb-4">
              <span className="text-[#475569]">$ </span>whoami
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-bold leading-[1.1] mb-6"
              style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
            >
              // Raphaël Genet
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-2 mb-10 text-[#475569] text-base md:text-lg"
            >
              <div><span className="text-[#00F5D4]">const </span>role = <span className="text-emerald-400">"Staff Engineer & Open Source"</span></div>
              <div><span className="text-[#00F5D4]">const </span>location = <span className="text-emerald-400">"Paris, France"</span></div>
              <div><span className="text-[#00F5D4]">const </span>available = <span className="text-emerald-400">"Q3 2026 contracts"</span></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <button onClick={() => goTo("work")} className="bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm px-6 py-3 hover:bg-[#00E5C4] transition-colors flex items-center gap-2 cursor-pointer border border-[#00F5D4]">
                view work() <ArrowRight className="w-4 h-4" />
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-6 py-3 hover:bg-[#00F5D4]/10 transition-colors flex items-center gap-2 cursor-pointer">
                <GitBranch className="w-4 h-4" /> github/glitchdev
              </a>
            </motion.div>

            {/* Terminal widget */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="bg-[#0D1323] border border-[#00F5D4]/20 rounded-lg overflow-hidden max-w-2xl"
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0F1729] border-b border-[#00F5D4]/10">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs text-[#475569] ml-2">glitch.dev — terminal</span>
              </div>
              <div className="p-4 text-sm space-y-2">
                {[
                  { p: "$ ", t: "git clone https://github.com/glitchdev/vaultkey", c: "text-[#00F5D4]" },
                  { p: "✓ ", t: "Cloned in 0.8s", c: "text-emerald-400" },
                  { p: "$ ", t: "cd vaultkey && cargo build --release", c: "text-[#00F5D4]" },
                  { p: "  ", t: "Compiling vaultkey v2.1.0 (target/release)", c: "text-[#475569]" },
                  { p: "✓ ", t: "Built in 4.2s (3.4k stars on GitHub)", c: "text-emerald-400" },
                ].map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.2 }} className="flex">
                    <span className={`${line.c} mr-2 shrink-0`}>{line.p}</span>
                    <span className="text-[#94A3B8]">{line.t}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Selected Work Section */}
        <section id="work" className="py-24 px-6 border-t border-[#00F5D4]/10">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>selected_projects</div>
                  <h2 className="font-bold text-3xl md:text-4xl">Featured Open Source</h2>
                </div>
                <button onClick={() => goTo("work")} className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                  View all projects <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
            <div className="flex gap-2 mb-8 flex-wrap">
              {projects.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setActiveProject(i)}
                  className={`px-4 py-2 text-sm font-semibold transition-all cursor-pointer border ${
                    activeProject === i
                      ? "bg-[#00F5D4] text-[#0A0E1A] border-[#00F5D4]"
                      : "border-[#00F5D4]/20 text-[#475569] hover:border-[#00F5D4]/50 hover:text-[#E2E8F0]"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <ScrollImage
                  src={projects[activeProject].img}
                  alt={projects[activeProject].name}
                  width={800}
                  height={500}
                  className="w-full aspect-video border border-[#00F5D4]/20"
                  dir={activeProject % 2 === 0 ? 1 : -1}
                />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-[#00F5D4]">{projects[activeProject].name}</h3>
                    <div className="text-yellow-400 text-sm">★ {projects[activeProject].stars}</div>
                  </div>
                  <p className="text-[#94A3B8] mb-6 leading-relaxed">{projects[activeProject].desc}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {projects[activeProject].stack.map(s => (
                      <span key={s} className="border border-[#00F5D4]/20 text-[#00F5D4] text-xs px-3 py-1.5">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#00F5D4] hover:opacity-70 transition-opacity cursor-pointer">
                      <GitBranch className="w-4 h-4" /> View source
                    </a>
                    <button onClick={() => goTo("work")} className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> Quick setup instructions
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="skills" className="py-24 px-6 bg-[#0D1323] border-t border-b border-[#00F5D4]/10">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>tech_stack</div>
                  <h2 className="font-bold text-3xl md:text-4xl">Skills & Systems</h2>
                </div>
                <button onClick={() => goTo("skills")} className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                  Launch Shell Simulator <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((s, i) => (
                <Reveal key={s.cat} delay={i * 0.1}>
                  <div className="border border-[#00F5D4]/10 p-6 hover:border-[#00F5D4]/30 transition-colors">
                    <div className="text-[#00F5D4] text-xs mb-4 uppercase tracking-widest">{s.cat}</div>
                    <ul className="space-y-2">
                      {s.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                          <ChevronRight className="w-3 h-3 text-[#00F5D4] shrink-0" />
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

        {/* Environment Gallery */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-12">
              <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>the_setup</div>
              <h2 className="font-bold text-3xl">Work Environment</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScrollImage src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=center" alt="Code" width={600} height={400} className="w-full aspect-video" dir={-1} yRange={40} />
              <ScrollImage src="https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=600&h=400&fit=crop&crop=center" alt="Terminal" width={600} height={400} className="w-full aspect-video mt-8" dir={1} yRange={40} />
              <ScrollImage src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center" alt="Monitor" width={600} height={400} className="w-full aspect-video" dir={-1} yRange={40} />
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="timeline" className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>career_timeline</div>
                  <h2 className="font-bold text-3xl md:text-4xl">Experience</h2>
                </div>
                <button onClick={() => goTo("timeline")} className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                  View Full Architecture Impact <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
            <div className="relative border-l border-[#00F5D4]/20 pl-8 space-y-10">
              {timeline.slice(0, 3).map((t, i) => (
                <Reveal key={t.year} delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[2.6rem] w-3 h-3 border-2 border-[#00F5D4] bg-[#0D1323] rounded-full" />
                    <div className="text-[#00F5D4] text-xs mb-2">{t.year}</div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{t.role}</h3>
                      <span className="text-[#475569] text-sm">@ {t.co}</span>
                    </div>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-32 px-6 border-t border-[#00F5D4]/10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <div className="text-[#00F5D4] text-xs mb-4"><span className="text-[#475569]">// </span>get_in_touch</div>
              <h2 className="font-bold text-4xl md:text-5xl mb-6">Let's build something great.</h2>
              <p className="text-[#94A3B8] text-lg mb-10 leading-relaxed">
                Available for staff/principal engineering contracts, technical advisory, and open source. Based in Paris, remote-first.
              </p>
              <div className="space-y-4">
                <a href="mailto:hello@aevia.ws" className="block w-full bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm py-4 hover:bg-[#00E5C4] transition-colors cursor-pointer text-center">
                  hello@aevia.ws →
                </a>
                <div className="grid grid-cols-2 gap-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm py-4 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <GitBranch className="w-4 h-4" /> GitHub
                  </a>
                  <button onClick={() => goTo("timeline")} className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm py-4 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Code2 className="w-4 h-4" /> Project Impact Summary
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* WORK REGISTER PAGE */}
      <AnimatePresence>
        {page === "work" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24 max-w-6xl mx-auto"
          >
            <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
              <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/git-log</span>
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">PROJECT_CATALOGUE</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Projects Grid */}
              <div className="lg:col-span-7 space-y-6">
                {projects.map((p) => (
                  <div key={p.name} className="border border-[#00F5D4]/20 bg-[#0D1323] p-6 hover:border-[#00F5D4]/60 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-[#00F5D4]">{p.name}</h3>
                      <div className="flex gap-4 text-xs font-semibold text-[#475569]">
                        <span>★ {p.stars} stars</span>
                        <span>⑂ {p.forks} forks</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
                      {p.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.stack.map((s) => (
                        <span key={s} className="border border-[#00F5D4]/10 text-xs text-[#00F5D4] px-2 py-0.5">{s}</span>
                      ))}
                    </div>

                    {/* Quick Install Guide */}
                    <div className="border-t border-[#00F5D4]/10 pt-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#475569] block mb-2">CLI INSTALLATION:</span>
                      <pre className="bg-[#0A0E1A] border border-[#00F5D4]/10 text-xs p-3 text-[#E2E8F0] overflow-x-auto whitespace-pre font-mono">
                        {p.installation}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar metrics & guidelines */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border border-[#00F5D4]/20 bg-[#0D1323] p-6 relative">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] text-[#475569] font-mono">LIVE_STAT</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#00F5D4] mb-4">// System Overview</h3>
                  <div className="space-y-4 text-xs font-mono text-[#94A3B8]">
                    <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                      <span>TOTAL OPEN SOURCE STARS</span>
                      <span className="text-white font-bold">6.3k+</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                      <span>PRIMARY DEV STACK</span>
                      <span className="text-white font-bold">Rust / TS / Go</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                      <span>COMMITS IN 2026</span>
                      <span className="text-white font-bold">1,842</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LICENSE TYPES</span>
                      <span className="text-white font-bold">MIT / Apache 2.0</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00F5D4]/10 p-6 text-xs text-[#475569] leading-relaxed">
                  All repositories listed are kept fully open source and are hosted on public mirrors. Bug reports, RFC submissions, and package contributions are always welcome.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKILLS INTERACTIVE SHELL PAGE */}
      <AnimatePresence>
        {page === "skills" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24 max-w-6xl mx-auto"
          >
            <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
              <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/neofetch</span>
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">SKILLS_RESOURCES</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Unix Terminal Shell Emulator */}
              <div className="lg:col-span-7">
                <div className="border border-[#00F5D4]/20 rounded-lg overflow-hidden bg-[#0D1323] flex flex-col h-[500px]">
                  {/* Title Bar */}
                  <div className="bg-[#0F1729] border-b border-[#00F5D4]/10 px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      <span className="text-xs text-[#475569] ml-2">glitch-shell-v1.0.0</span>
                    </div>
                    <button 
                      onClick={() => setTermLogs([{ type: "output", text: "glitch.dev Shell v1.0.0" }, { type: "output", text: "Type 'help' to view available commands." }])}
                      className="text-[#475569] hover:text-[#00F5D4] text-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> reset
                    </button>
                  </div>

                  {/* Shell Output Logs */}
                  <div className="p-4 flex-1 overflow-y-auto space-y-2 text-sm font-mono scrollbar-thin select-text">
                    {termLogs.map((log, idx) => (
                      <div key={idx} className={log.type === "input" ? "text-[#00F5D4]" : "text-[#94A3B8] whitespace-pre-wrap"}>
                        {log.text}
                      </div>
                    ))}
                  </div>

                  {/* Shell Form Input */}
                  <form onSubmit={handleTermSubmit} className="border-t border-[#00F5D4]/10 bg-[#0A0E1A] px-4 py-3 flex items-center shrink-0">
                    <span className="text-[#00F5D4] font-mono mr-2">$</span>
                    <input 
                      type="text" 
                      value={termInput}
                      onChange={(e) => setTermInput(e.target.value)}
                      placeholder="Type a command e.g. neofetch, info, skills..."
                      className="bg-transparent border-none text-[#E2E8F0] font-mono text-sm focus:outline-none focus:ring-0 w-full"
                    />
                  </form>
                </div>
              </div>

              {/* Right: Traditional Skill Matrix & Meters */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-bold text-xl text-[#00F5D4]">// Stacks & Proficiency</h3>
                
                {[
                  { title: "Languages (Rust, TypeScript, Go)", pct: 90, bar: "█████████░" },
                  { title: "Frontend Frameworks (Next.js, React)", pct: 85, bar: "████████░░" },
                  { title: "Distributed Systems (Axum, Gin, tRPC)", pct: 80, bar: "████████░░" },
                  { title: "Infrastructure (Docker, K8s, Cloudflare)", pct: 75, bar: "███████░░░" },
                ].map((sk) => (
                  <div key={sk.title} className="border border-[#00F5D4]/10 p-4 bg-[#0D1323]">
                    <div className="flex justify-between text-xs font-bold text-white mb-2">
                      <span>{sk.title}</span>
                      <span className="text-[#00F5D4]">{sk.pct}%</span>
                    </div>
                    <div className="font-mono text-[#00F5D4] tracking-widest text-sm">
                      {sk.bar}
                    </div>
                  </div>
                ))}

                <div className="border border-[#00F5D4]/10 p-6 text-xs text-[#475569] leading-relaxed">
                  Our development approach prioritizes memory safety, low resource utilization, and clean API endpoints. We specialize in migratable distributed system setups.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAREER TIMELINE DETAIL PAGE */}
      <AnimatePresence>
        {page === "timeline" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24 max-w-6xl mx-auto"
          >
            <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
              <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/cat career_impact.md</span>
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">EXPERIENCE_JOURNAL</h1>
            </div>

            <div className="relative border-l border-[#00F5D4]/20 pl-8 space-y-12">
              {timeline.map((item, idx) => (
                <div key={item.co} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[2.75rem] top-1.5 w-4 h-4 border-2 border-[#00F5D4] bg-[#0A0E1A] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#00F5D4] rounded-full" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-none self-start font-mono">
                      {item.year}
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-none">
                      {item.role} <span className="text-[#475569] text-base font-normal">@ {item.co}</span>
                    </h2>
                  </div>

                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-3xl">
                    {item.desc}
                  </p>

                  <div className="border border-[#00F5D4]/10 bg-[#0D1323] p-5 max-w-3xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block mb-3 font-mono">ARCHITECTURAL IMPACTS:</span>
                    <ul className="space-y-3">
                      {item.impact.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#E2E8F0] leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEGAL PAGE */}
      <AnimatePresence>
        {page === "legal" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24 max-w-3xl mx-auto"
          >
            <div className="border border-[#00F5D4]/20 bg-[#0D1323] p-8 md:p-12">
              <h1 className="text-3xl md:text-5xl font-bold text-[#00F5D4] mb-8 uppercase tracking-tight">
                // LEGAL_NOTICE
              </h1>

              <div className="space-y-8 text-sm leading-relaxed text-[#94A3B8] font-mono">
                <section className="border-b border-[#00F5D4]/10 pb-6">
                  <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">01. WEBSITE PUBLISHER</h2>
                  <p className="text-white font-semibold">Aevia WS — Valentin Milliand</p>
                  <p>SIREN: 852 546 225</p>
                  <p>RCS: Bourg-en-Bresse</p>
                  <p>Email: <a href="mailto:contact@aevia.ws" className="underline hover:text-white transition-colors">contact@aevia.ws</a></p>
                  <p className="mt-2 text-xs text-[#475569]">Physical address is withheld in accordance with French telecommunications laws and is transmissible on request.</p>
                </section>

                <section className="border-b border-[#00F5D4]/10 pb-6">
                  <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">02. HOSTING PROVIDER</h2>
                  <p className="text-white font-semibold">Vercel Inc.</p>
                  <p>Address: 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
                  <p>Website: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">vercel.com</a></p>
                </section>

                <section className="border-b border-[#00F5D4]/10 pb-6">
                  <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">03. INTELLECTUAL RIGHTS</h2>
                  <p>
                    All modules, ASCII illustrations, source references, and content models displayed on this website are protected under international intellectual property codes. Any reproduction or reuse without publisher agreement will be subject to infringement claims.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">04. COOKIE STATEMENT</h2>
                  <p>
                    This website uses no cookies, trackers, or marketing script components. System inputs are kept in browser memory and discarded on reload. For further details, email contact@aevia.ws.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#00F5D4]/10 py-10 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div onClick={() => goTo("home")} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
            <Terminal className="w-4 h-4 text-[#00F5D4]" />
            <span className="text-[#00F5D4]">glitch</span><span className="text-[#475569]">.dev</span>
          </div>
          <div className="flex gap-6 text-xs text-[#475569]">
            <button onClick={() => goTo("work")} className="hover:text-[#00F5D4] transition-colors cursor-pointer">Work</button>
            <button onClick={() => goTo("skills")} className="hover:text-[#00F5D4] transition-colors cursor-pointer">Skills</button>
            <button onClick={() => goTo("timeline")} className="hover:text-[#00F5D4] transition-colors cursor-pointer">Experience</button>
            <button onClick={() => goTo("legal")} className="hover:text-[#00F5D4] transition-colors cursor-pointer">Legal Notice</button>
          </div>
          <div className="text-[#475569] text-xs">© 2026 Raphaël Genet · Paris, France</div>
        </div>
      </footer>
    </div>
  )
}
