"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Reveal, projects, gridOverlay, monoStyle, Label } from "../shared"
import {
  ArrowRight, Filter, X, CheckCircle, Zap, ExternalLink,
  ArrowUpRight, ChevronLeft, ChevronRight
} from "lucide-react"

// Full category list derived from projects
const CATEGORIES = ["All", "3D", "AR", "Real-time", "Branding"]

const categoryMap: Record<string, string> = {
  "3D": "3D",
  "AR": "AR",
  "Real-time": "Real-time",
  "Branding": "Branding",
}

// Extended case-study info for the modal
const caseDetails: Record<string, {
  challenge: string
  solution: string
  achievements: string[]
  platform: string
  performance: string
  stack: string
}> = {
  "VALO — Brand Identity in 3D": {
    challenge: "VALO Corp needed a brand-defining 3D experience that would differentiate them in a saturated market. Static product shots were no longer converting.",
    solution: "We built a fully interactive WebGL configurator using Three.js + custom GLSL shaders, allowing users to rotate, zoom, and switch between 12 material finishes in real-time.",
    achievements: [
      "340% increase in product page conversion rate",
      "4.8s → 1.7s load time via mesh decimation and KTX2 compression",
      "Compatible with all modern iOS and Android browsers",
      "Shopify, Salesforce, and custom headless checkout integrations",
    ],
    platform: "Web (Safari, Chrome, Firefox)",
    performance: "60 FPS on mobile",
    stack: "Three.js / GLSL / Blender",
  },
  "ArcSpace — AR Real Estate": {
    challenge: "Property buyers couldn't visualise spaces before visiting. ArcSpace needed a no-download AR solution accessible to non-technical buyers.",
    solution: "WebXR-powered room-scale AR using ARKit on iOS and ARCore on Android with intelligent fallback to gyroscope-based preview for unsupported devices.",
    achievements: [
      "2.1 million sessions in the first month post-launch",
      "Session duration increased by 6.4 minutes on average",
      "38% reduction in property visit no-shows",
      "Deployed across 4,200 listings in 8 countries",
    ],
    platform: "iOS Safari, Android Chrome",
    performance: "Sub-100ms marker detection",
    stack: "WebXR / ARKit / React Three Fiber",
  },
  "Phantom — Product Visualizer": {
    challenge: "Phantom Motors' 3D car models were 120MB+ — unacceptable for web. They needed photorealistic quality with mobile-first load performance.",
    solution: "Custom Draco compression pipeline + progressive mesh streaming. Custom GLSL shaders reproduced automotive paint flake, clearcoat, and HDR studio lighting.",
    achievements: [
      "78% reduction in 3D asset bundle size",
      "12ms average frame render time on desktop",
      "100% parity with studio photography on 4K screens",
      "FWA Site of the Day recognition",
    ],
    platform: "WebGL 2.0 (desktop + mobile)",
    performance: "12ms frame / 60 FPS locked",
    stack: "Babylon.js / WebAssembly / WebGL",
  },
  "Luminary — Virtual Fashion": {
    challenge: "Online fashion has a 35% return rate. Luminary needed a try-before-you-buy AR experience that truly reflected garment fit, texture, and drape.",
    solution: "Body pose estimation via TensorFlow.js + custom cloth simulation shaders. Garments dynamically wrap around user's body in real-time via the phone camera.",
    achievements: [
      "60% reduction in return rate in the first quarter",
      "Average user session of 8.2 minutes with the AR mirror",
      "Awarded Best UX — CSS Design Awards 2024",
      "Deployed to Luminary's iOS/Android apps and web storefront",
    ],
    platform: "iOS/Android App + Web",
    performance: "30 FPS cloth sim on mid-range phones",
    stack: "TensorFlow.js / WebGL / React Three Fiber",
  },
  "Forma — Architectural Walkthrough": {
    challenge: "Forma Studios needed a multi-user real-time architectural walkthrough accessible from any browser without downloads or plugins.",
    solution: "PlayCanvas engine with server-authoritative multi-user sync via WebSockets. LOD streaming system loads geometry as users move through the space.",
    achievements: [
      "Supports 10,000 concurrent visitors simultaneously",
      "2.4GB scene compressed to 180MB via streaming LOD",
      "Spatial audio tied to room position",
      "Used for a 72-hour global architecture exhibition",
    ],
    platform: "Browser (all modern)",
    performance: "10k concurrent users",
    stack: "PlayCanvas / WebSockets / GLSL",
  },
  "Nexus — Data Center Visualization": {
    challenge: "Nexus Cloud needed an operational dashboard that gave engineers a 3D bird's-eye view of their global infrastructure in real-time.",
    solution: "Three.js instanced mesh rendering of 50,000+ server nodes updated via WebSocket streams. Custom heat map shaders visualise load and latency.",
    achievements: [
      "50,000 server nodes rendered at 60 FPS",
      "Sub-12ms frame time on standard workstation",
      "WebWorker-based data pipeline with zero main-thread blocking",
      "Reduced MTTR by 40% through faster visual anomaly detection",
    ],
    platform: "Desktop Web (Chrome / Firefox)",
    performance: "Sub-12ms frame time",
    stack: "Three.js / WebWorkers / GLSL",
  },
  "Studio Levi — Brand Universe": {
    challenge: "Studio Levi wanted a digital home that felt as premium and experimental as their physical installations — a world, not a website.",
    solution: "A full 3D environment built in React Three Fiber with custom post-processing: bloom, depth-of-field, chromatic aberration, and film grain — all at 60 FPS.",
    achievements: [
      "Awwwards Site of the Month — January 2024",
      "FWA of the Day recognition",
      "Average session duration: 11.4 minutes",
      "Featured in Smashing Magazine's annual web design roundup",
    ],
    platform: "Desktop (immersive) + Mobile (fallback)",
    performance: "60 FPS with full post-FX",
    stack: "React Three Fiber / Blender / GLSL",
  },
  "Helio — Medical AR Training": {
    challenge: "Helio Medical needed FDA-clearable AR surgical training modules that run on standard tablets without requiring specialised hardware.",
    solution: "Precise anatomical models built in Blender with micron-level accuracy. ARKit world tracking with haptic feedback overlays. Unity WebGL for cross-platform deployment.",
    achievements: [
      "FDA 510(k) clearance achieved for training module",
      "Deployed across 14 medical training programs",
      "Reduces cadaver training sessions by 60%",
      "Supports multilingual annotations in 9 languages",
    ],
    platform: "iPad Pro / Android Tablet",
    performance: "Micron-accurate spatial tracking",
    stack: "ARKit / Unity WebGL / WASM",
  },
}

// ─── Project Modal ────────────────────────────────────────────────────────────

function ProjectModal({
  project,
  onClose,
}: {
  project: typeof projects[0]
  onClose: () => void
}) {
  const details = caseDetails[project.name]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#120B1A] border border-[#9B5CF6]/30 rounded-3xl w-full max-w-3xl overflow-hidden max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full">
          <Image src={project.imgHigh} alt={project.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B1A] to-black/30" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Type badge */}
          <div className="absolute bottom-4 left-4">
            <span
              className="bg-[#9B5CF6] text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={monoStyle}
            >
              {project.type}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold mt-1 leading-tight">{project.name}</h2>
              <p className="text-white/40 text-sm mt-1">{project.client} · {project.year}</p>
            </div>
            <div className="bg-[#9B5CF6]/10 border border-[#9B5CF6]/25 rounded-xl px-4 py-3">
              <span className="text-[10px] text-white/40 block uppercase tracking-wider" style={monoStyle}>Impact</span>
              <span className="font-semibold text-sm text-[#9B5CF6]">{project.result}</span>
            </div>
          </div>

          {/* Metrics row */}
          {details && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 border-t border-b border-white/5 py-6">
              {[
                { label: "Platform", value: details.platform },
                { label: "Performance", value: details.performance },
                { label: "Tech Stack", value: details.stack },
              ].map(m => (
                <div key={m.label}>
                  <div className="text-xs text-white/35 mb-1 uppercase tracking-wider" style={monoStyle}>{m.label}</div>
                  <div className="text-sm font-semibold text-white/85">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map(t => (
              <span key={t} className="text-xs border border-white/10 text-white/50 px-3 py-1 rounded-full" style={monoStyle}>
                {t}
              </span>
            ))}
          </div>

          {details && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#9B5CF6] mb-3" style={monoStyle}>Challenge</h4>
                  <p className="text-white/55 text-sm leading-relaxed">{details.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#9B5CF6] mb-3" style={monoStyle}>Solution</h4>
                  <p className="text-white/55 text-sm leading-relaxed">{details.solution}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold uppercase tracking-wider text-[#9B5CF6] mb-4" style={monoStyle}>Key results</h4>
              <ul className="space-y-3 mb-8">
                {details.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-[#9B5CF6] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={onClose}
              className="border border-white/10 hover:border-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href="/templates/impact-27/contact"
              onClick={onClose}
              className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors flex items-center gap-1.5"
            >
              Discuss a similar project <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  delay,
  onClick,
}: {
  project: typeof projects[0]
  delay: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal delay={delay}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-[#9B5CF6]/40 transition-all bg-[#120B1A]"
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden relative">
          <Image
            src={project.img}
            alt={project.name}
            width={600}
            height={375}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark gradient base */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0712] via-[#0C0712]/30 to-transparent opacity-90" />

          {/* Purple hover overlay */}
          <motion.div
            className="absolute inset-0 bg-[#9B5CF6]/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Tech tags on hover */}
          <motion.div
            className="absolute top-4 left-4 flex gap-1.5 flex-wrap"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            {project.tech.slice(0, 2).map(t => (
              <span
                key={t}
                className="bg-black/60 backdrop-blur-sm text-white/80 text-[9px] font-semibold px-2.5 py-1 rounded-full border border-white/10"
                style={monoStyle}
              >
                {t}
              </span>
            ))}
          </motion.div>

          {/* View arrow on hover */}
          <motion.div
            className="absolute top-4 right-4 w-9 h-9 bg-[#9B5CF6] rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#9B5CF6] text-[10px] tracking-widest uppercase" style={monoStyle}>
              {project.type}
            </span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-white/30 text-[10px]" style={monoStyle}>{project.year}</span>
          </div>
          <h3 className="text-xl font-bold group-hover:text-[#9B5CF6] transition-colors leading-snug mb-3">
            {project.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-sm">{project.client}</span>
            <span
              className="text-[10px] text-[#9B5CF6]/70 font-semibold group-hover:text-[#9B5CF6] transition-colors flex items-center gap-1"
              style={monoStyle}
            >
              {project.result} <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [page, setPage] = useState(0)

  const filteredProjects = selectedFilter === "All"
    ? projects
    : projects.filter(p => p.category === categoryMap[selectedFilter])

  const PER_PAGE = 6
  const totalPages = Math.ceil(filteredProjects.length / PER_PAGE)
  const visible = filteredProjects.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const handleFilterChange = useCallback((f: string) => {
    setSelectedFilter(f)
    setPage(0)
  }, [])

  return (
    <div className="relative min-h-dvh">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={gridOverlay} />

      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Reveal className="mb-12">
          <Label>Portfolio</Label>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Our Work</h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Eight years of spatial computing. From product configurators to medical AR — every project ships at 60 FPS.
          </p>
        </Reveal>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <Reveal delay={0.05} className="flex flex-wrap gap-10 mb-16 pb-16 border-b border-white/5">
          {[
            { val: "200+", label: "Projects shipped" },
            { val: "40+", label: "Global clients" },
            { val: "8yrs", label: "Studio history" },
            { val: "3×", label: "Avg. conversion lift" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-[#9B5CF6]" style={monoStyle}>{val}</div>
              <div className="text-xs text-white/35 mt-1 uppercase tracking-wider" style={monoStyle}>{label}</div>
            </div>
          ))}
        </Reveal>

        {/* ── Filter Bar ─────────────────────────────────────────────── */}
        <Reveal className="mb-10 flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-white/30 mr-1 shrink-0" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
                selectedFilter === cat
                  ? "bg-[#9B5CF6] border-[#9B5CF6] text-white"
                  : "bg-white/5 border-white/10 text-white/55 hover:text-white hover:border-white/20"
              }`}
              style={monoStyle}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 opacity-50">
                  ({projects.filter(p => p.category === categoryMap[cat]).length})
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/25" style={monoStyle}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          </span>
        </Reveal>

        {/* ── Projects Grid ───────────────────────────────────────────── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProjectCard
                  project={p}
                  delay={0}
                  onClick={() => setSelectedProject(p)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Pagination ──────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <Reveal className="flex items-center justify-center gap-3 mb-16">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#9B5CF6]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  i === page
                    ? "bg-[#9B5CF6] text-white"
                    : "border border-white/10 text-white/40 hover:border-[#9B5CF6]/30 hover:text-white"
                }`}
                style={monoStyle}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#9B5CF6]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </Reveal>
        )}

        {/* ── CTA strip ───────────────────────────────────────────────── */}
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-[#9B5CF6]/25 bg-[#9B5CF6]/5 p-10 md:p-14 text-center"
          >
            {/* Grid inside CTA */}
            <div className="absolute inset-0 opacity-[0.04]" style={gridOverlay} />
            <div className="relative">
              <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={monoStyle}>Next project</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Want results like these?</h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                Every project in this portfolio started with a 20-minute discovery call. Tell us what you're building.
              </p>
              <Link
                href="/templates/impact-27/contact"
                className="inline-flex items-center gap-2 bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full transition-colors text-base"
              >
                Start a conversation <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
