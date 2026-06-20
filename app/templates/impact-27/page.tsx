"use client"

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, Play, Zap, Box, Layers, Globe, Cpu,
  ChevronRight, ChevronLeft, Check, Star, Code2, Aperture, Triangle, Hexagon
} from "lucide-react"
import { Reveal, projects, gridOverlay, monoStyle, Label } from "./shared"

// ─── Data ────────────────────────────────────────────────────────────────────

const homeServices = [
  { icon: <Box className="w-6 h-6" />, title: "3D Product Visualization", desc: "Photorealistic 3D models for e-commerce, marketing, and configurators. Real-time or pre-rendered." },
  { icon: <Layers className="w-6 h-6" />, title: "Augmented Reality", desc: "WebAR and native AR experiences. Try-before-you-buy, spatial computing, and brand activations." },
  { icon: <Globe className="w-6 h-6" />, title: "Virtual Worlds", desc: "Immersive 3D environments for events, showrooms, and metaverse platforms." },
  { icon: <Cpu className="w-6 h-6" />, title: "Real-time Rendering", desc: "GPU-accelerated real-time 3D for interactive product configurators and live experiences." },
]

const workFilters = ["All", "3D", "AR", "Real-time", "Branding"]

const filterMap: Record<string, string> = {
  "3D": "3D",
  "AR": "AR",
  "Real-time": "Real-time",
  "Branding": "Branding",
}

const testimonials = [
  {
    quote: "Vertex turned our static product catalogue into a living, interactive 3D experience. Conversion rate jumped 340% in the first quarter.",
    author: "Marc Duval",
    role: "Head of Digital, Phantom Motors",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote: "The WebAR campaign they delivered was flawless on every device. Our 48-hour launch saw 2.1 million sessions. Truly unprecedented results.",
    author: "Sophia Nakamura",
    role: "VP Marketing, ArcSpace",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote: "Working with Vertex was like having a GPU wizard on the team. They optimised our 3D assets to 78% smaller with zero visual loss. Remarkable.",
    author: "Lucas Brandt",
    role: "CTO, Studio Levi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
  },
]

const techStack = [
  { name: "Three.js", role: "WebGL Rendering", icon: <Triangle className="w-5 h-5" />, color: "#9B5CF6" },
  { name: "React Three Fiber", role: "Declarative 3D", icon: <Hexagon className="w-5 h-5" />, color: "#7C3AED" },
  { name: "WebGL / GLSL", role: "GPU Programming", icon: <Code2 className="w-5 h-5" />, color: "#6D28D9" },
  { name: "Blender", role: "3D Authoring", icon: <Aperture className="w-5 h-5" />, color: "#9B5CF6" },
  { name: "Unreal Engine", role: "Real-time CG", icon: <Zap className="w-5 h-5" />, color: "#7C3AED" },
  { name: "WebXR / ARKit", role: "Spatial Computing", icon: <Globe className="w-5 h-5" />, color: "#6D28D9" },
]

const pricing = [
  {
    tier: "Discovery",
    price: "$4,800",
    period: "one-time",
    badge: null,
    desc: "Perfect for brands exploring 3D for the first time. Two-day intensive audit and prototype.",
    features: [
      "Brand & asset audit",
      "1 interactive 3D prototype",
      "Technical feasibility report",
      "Performance benchmark",
      "48h turnaround",
    ],
    cta: "Book Discovery Sprint",
    highlight: false,
  },
  {
    tier: "Studio",
    price: "$18,000",
    period: "per project",
    badge: "Most popular",
    desc: "Full-cycle 3D or AR production. From concept to production-ready web integration.",
    features: [
      "Everything in Discovery",
      "Up to 4 deliverables",
      "Unlimited revisions",
      "WebAR or configurator build",
      "Platform integration",
      "3 months post-launch support",
    ],
    cta: "Start Studio Project",
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "retainer available",
    badge: null,
    desc: "Dedicated team embed for brands with ongoing 3D or spatial computing needs.",
    features: [
      "Dedicated Vertex team",
      "Unlimited deliverables",
      "SLA with 99.9% uptime",
      "Custom shader R&D",
      "On-site workshops",
      "Priority escalation",
    ],
    cta: "Talk to us",
    highlight: false,
  },
]

// ─── Stats Ticker ─────────────────────────────────────────────────────────────

function StatsTicker() {
  const stats = [
    { val: "200+", label: "Projects delivered" },
    { val: "40+", label: "Global clients" },
    { val: "8yrs", label: "Studio history" },
    { val: "99.8%", label: "Client satisfaction" },
    { val: "12ms", label: "Avg. frame time" },
    { val: "3×", label: "Avg. conversion uplift" },
  ]

  return (
    <section className="py-6 border-y border-white/5 relative overflow-hidden">
      {/* Subtle purple glow */}
      <div className="absolute inset-0 bg-[#9B5CF6]/[0.03]" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-x-12 gap-y-6 justify-between items-center">
          {stats.map(({ val, label }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span
                  className="text-3xl font-bold text-[#9B5CF6]"
                  style={monoStyle}
                >
                  {val}
                </span>
                <span className="text-xs text-white/40 mt-1 tracking-wider uppercase" style={monoStyle}>
                  {label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Work Grid ────────────────────────────────────────────────────────────────

function WorkGrid() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === filterMap[activeFilter])

  // Only show first 6 on homepage
  const visible = filtered.slice(0, 6)

  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Label>Selected Work</Label>
            <h2 className="text-4xl md:text-5xl font-bold">Recent projects</h2>
          </div>
          <Link
            href="/templates/impact-27/work"
            className="text-sm font-semibold text-[#9B5CF6] hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            View full portfolio <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        {/* Filter bar */}
        <Reveal className="flex flex-wrap gap-2 mb-10">
          {workFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border cursor-pointer ${
                activeFilter === f
                  ? "bg-[#9B5CF6] border-[#9B5CF6] text-white"
                  : "bg-white/5 border-white/10 text-white/55 hover:text-white hover:border-white/20"
              }`}
              style={monoStyle}
            >
              {f}
            </button>
          ))}
        </Reveal>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  href="/templates/impact-27/work"
                  className="group relative block overflow-hidden rounded-2xl bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/40 transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 bg-[#9B5CF6]/20 backdrop-blur-[2px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIdx === i ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0712] via-[#0C0712]/40 to-transparent" />
                    {/* Reveal pill on hover */}
                    <motion.div
                      className="absolute top-4 right-4 bg-[#9B5CF6] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: hoveredIdx === i ? 1 : 0, y: hoveredIdx === i ? 0 : -8 }}
                      transition={{ duration: 0.2 }}
                      style={monoStyle}
                    >
                      View case
                    </motion.div>
                  </div>
                  <div className="p-5">
                    <span className="text-[#9B5CF6] text-[10px] tracking-widest uppercase" style={monoStyle}>
                      {p.type} · {p.year}
                    </span>
                    <h3 className="text-lg font-bold mt-1 mb-2 group-hover:text-[#9B5CF6] transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">{p.client}</span>
                      <span className="text-[10px] text-[#9B5CF6]/70 font-semibold" style={monoStyle}>{p.result}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Services Deep-Dive ───────────────────────────────────────────────────────

function ServicesSection() {
  const services = [
    {
      icon: <Box className="w-7 h-7" />,
      title: "3D Product Visualization",
      badge: "WebGL / Three.js",
      desc: "Photorealistic browser-native 3D that loads in under 2 seconds. We build interactive configurators with PBR materials, custom lighting rigs, and glTF asset pipelines.",
      steps: ["Asset audit & geometry retopo", "PBR texture baking (4K)", "Real-time lighting setup", "Platform API integration"],
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: "Augmented Reality (WebAR)",
      badge: "ARKit / WebXR",
      desc: "Zero-install AR experiences accessible from a link. Products appear life-size in the user's environment with accurate shadows, ambient occlusion, and spatial audio.",
      steps: ["USDZ & GLB asset pipeline", "Quick Look iOS integration", "WebXR fallback layer", "Analytics event tracking"],
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Virtual Environments",
      badge: "Real-time Metaverse",
      desc: "Fully interactive 3D spaces — showrooms, galleries, architectural walkthroughs — supporting thousands of concurrent visitors in the browser.",
      steps: ["Scene graph architecture", "Multi-user socket sync", "LOD streaming pipeline", "Interactive hotspots & media"],
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: "GPU & Shader R&D",
      badge: "GLSL / WebAssembly",
      desc: "We push WebGL to its limits with custom GLSL shaders, WebAssembly physics engines, and asset pipelines that target 60 FPS on mid-range mobile devices.",
      steps: ["Custom vertex & fragment shaders", "Wasm physics simulation", "Level-of-Detail scripting", "GPU profile audit & refactor"],
    },
  ]

  const [active, setActive] = useState(0)

  return (
    <section className="py-24 px-6 bg-white/[0.02] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Label>Services</Label>
            <h2 className="text-4xl md:text-5xl font-bold">What we build</h2>
          </div>
          <Link
            href="/templates/impact-27/services"
            className="text-sm font-semibold text-[#9B5CF6] hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            Full service details <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service selector */}
          <Reveal>
            <div className="space-y-2">
              {services.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setActive(i)}
                  className={`w-full text-left rounded-2xl p-6 border transition-all cursor-pointer group ${
                    active === i
                      ? "bg-[#9B5CF6]/10 border-[#9B5CF6]/40"
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      active === i ? "bg-[#9B5CF6] text-white" : "bg-white/5 text-white/40 group-hover:bg-[#9B5CF6]/15 group-hover:text-[#9B5CF6]"
                    }`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base transition-colors ${active === i ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                        {s.title}
                      </h3>
                      <span className={`text-[10px] tracking-widest uppercase transition-colors ${active === i ? "text-[#9B5CF6]" : "text-white/30"}`} style={monoStyle}>
                        {s.badge}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all ${active === i ? "text-[#9B5CF6] translate-x-1" : "text-white/20"}`} />
                  </div>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Active service detail */}
          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#120B1A] border border-white/5 rounded-2xl p-8 h-full"
              >
                <div className="w-14 h-14 bg-[#9B5CF6]/15 text-[#9B5CF6] rounded-xl flex items-center justify-center mb-6">
                  {services[active].icon}
                </div>
                <div className="inline-block text-[10px] tracking-widest uppercase border border-[#9B5CF6]/30 text-[#9B5CF6] px-3 py-1.5 rounded-full mb-5" style={monoStyle}>
                  {services[active].badge}
                </div>
                <h3 className="text-2xl font-bold mb-4">{services[active].title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-8">{services[active].desc}</p>

                <div className="text-xs uppercase tracking-wider text-[#9B5CF6] mb-4 font-semibold" style={monoStyle}>
                  Process steps
                </div>
                <ol className="space-y-3">
                  {services[active].steps.map((step, si) => (
                    <li key={si} className="flex items-start gap-3 text-sm text-white/70">
                      <span
                        className="shrink-0 w-5 h-5 bg-[#9B5CF6]/15 text-[#9B5CF6] rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={monoStyle}
                      >
                        {si + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Carousel ────────────────────────────────────────────────────

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => {
    setCurrent(c => (c === 0 ? testimonials.length - 1 : c - 1))
  }, [])

  const next = useCallback(() => {
    setCurrent(c => (c === testimonials.length - 1 ? 0 : c + 1))
  }, [])

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <Label>Client stories</Label>
          <h2 className="text-4xl md:text-5xl font-bold">What clients say</h2>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 md:p-14 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#9B5CF6] text-[#9B5CF6]" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-white/85 leading-relaxed font-light italic mb-10">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#9B5CF6]/40">
                  <Image
                    src={testimonials[current].avatar}
                    alt={testimonials[current].author}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonials[current].author}</div>
                  <div className="text-white/40 text-sm">{testimonials[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-[#9B5CF6]/50 hover:bg-[#9B5CF6]/10 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === current ? "w-6 bg-[#9B5CF6]" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-[#9B5CF6]/50 hover:bg-[#9B5CF6]/10 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Tech Stack Showcase ──────────────────────────────────────────────────────

function TechStackSection() {
  return (
    <section className="py-24 px-6 bg-white/[0.02] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <Label>Technology</Label>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Built with the best</h2>
          <p className="text-white/45 text-base max-w-xl mx-auto leading-relaxed">
            We pick tools with proven GPU headroom, strong community backing, and real-world production track records.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map((tech, i) => (
            <Reveal key={tech.name} delay={i * 0.07}>
              <div className="group bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/30 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:bg-[#9B5CF6]/[0.04] cursor-default">
                <div className="w-11 h-11 bg-[#9B5CF6]/15 rounded-xl flex items-center justify-center text-[#9B5CF6] group-hover:bg-[#9B5CF6]/25 transition-colors">
                  {tech.icon}
                </div>
                <div>
                  <div className="font-semibold text-white text-base">{tech.name}</div>
                  <div className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wider" style={monoStyle}>{tech.role}</div>
                </div>
                {/* Progress bar — decorative skill indicator */}
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#9B5CF6] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <Label>Packages</Label>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent pricing</h2>
          <p className="text-white/45 text-base max-w-xl mx-auto leading-relaxed">
            Every engagement is scoped before we start. No surprise invoices.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricing.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.08}>
              <div className={`relative flex flex-col rounded-3xl border p-8 h-full transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#9B5CF6]/15 to-[#120B1A] border-[#9B5CF6]/50 shadow-[0_0_60px_-20px_rgba(155,92,246,0.4)]"
                  : "bg-[#120B1A] border-white/8 hover:border-white/15"
              }`}>
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9B5CF6] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                    style={monoStyle}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2" style={monoStyle}>{plan.tier}</p>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-[#9B5CF6]" : "text-white"}`} style={monoStyle}>
                      {plan.price}
                    </span>
                    <span className="text-white/30 text-sm mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-white/45 text-sm mt-3 leading-relaxed">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-[#9B5CF6]" : "text-white/40"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/templates/impact-27/contact"
                  className={`w-full text-center font-semibold py-3.5 rounded-full text-sm transition-all block cursor-pointer ${
                    plan.highlight
                      ? "bg-[#9B5CF6] hover:bg-[#7C3AED] text-white"
                      : "border border-white/15 hover:border-[#9B5CF6]/50 hover:bg-[#9B5CF6]/10 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Animated CTA ─────────────────────────────────────────────────────────────

function AnimatedCTA() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })
  const sectionRef = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 px-6 overflow-hidden border-t border-white/5"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-5" style={gridOverlay} />

      {/* Moving purple orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-[#9B5CF6]/20 rounded-full blur-3xl pointer-events-none"
        style={{
          left: useTransform(springX, [0, 1], ["-20%", "60%"]),
          top: useTransform(springY, [0, 1], ["-40%", "40%"]),
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-[#6D28D9]/15 rounded-full blur-3xl pointer-events-none"
        style={{
          right: useTransform(springX, [0, 1], ["60%", "-10%"]),
          bottom: useTransform(springY, [0, 1], ["60%", "-10%"]),
        }}
      />

      {/* Corner triangles — decorative */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#9B5CF6]/20 rounded-tl-xl" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#9B5CF6]/20 rounded-br-xl" />

      <div className="max-w-4xl mx-auto text-center relative">
        <Reveal>
          <div
            className="inline-flex items-center gap-2 border border-[#9B5CF6]/40 text-[#9B5CF6] text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            style={monoStyle}
          >
            <span className="w-2 h-2 bg-[#9B5CF6] rounded-full animate-pulse" />
            Currently taking new projects
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Ready to go<br />
            <span className="text-[#9B5CF6]">spatial?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Tell us about your project. We'll get back to you within 24 hours with a scope and timeline — no sales call required.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/templates/impact-27/contact"
              className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-10 py-4 rounded-full transition-colors flex items-center gap-2 text-base"
            >
              Start a project <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates/impact-27/work"
              className="border border-white/15 hover:border-[#9B5CF6]/50 text-white hover:bg-[#9B5CF6]/10 font-semibold px-10 py-4 rounded-full transition-all text-base"
            >
              See our work
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const [activeProject, setActiveProject] = useState<number | null>(null)

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9B5CF6]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#6D28D9]/15 rounded-full blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5" style={gridOverlay} />
        </div>
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-[#9B5CF6]/40 text-[#9B5CF6] text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            style={monoStyle}
          >
            <span className="w-2 h-2 bg-[#9B5CF6] rounded-full animate-pulse" />
            3D · AR · Real-time
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-[7rem] font-bold leading-[0.9] mb-8 max-w-5xl"
          >
            We build<br />
            <span className="text-[#9B5CF6]">the third</span><br />
            dimension.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed"
          >
            Vertex Studio creates 3D product visualizations, AR experiences, and real-time environments for brands that want to stand out in the spatial era.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/templates/impact-27/work" className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 text-base">
              View our work <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-base">
              <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-[#9B5CF6]/60 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Watch showreel
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 flex flex-wrap gap-12"
          >
            {[
              { val: "200+", label: "Projects delivered" },
              { val: "40+", label: "Global clients" },
              { val: "12ms", label: "Avg. render time" },
              { val: "99.8%", label: "Client satisfaction" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-[#9B5CF6]" style={monoStyle}>{val}</div>
                <div className="text-sm text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Ticker ─────────────────────────────────────────────────────── */}
      <StatsTicker />

      {/* ── Work Grid with filter ─────────────────────────────────────────── */}
      <WorkGrid />

      {/* ── Services Deep-dive ────────────────────────────────────────────── */}
      <ServicesSection />

      {/* ── Testimonials Carousel ─────────────────────────────────────────── */}
      <TestimonialsCarousel />

      {/* ── Tech Stack ────────────────────────────────────────────────────── */}
      <TechStackSection />

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── Clients bar ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white/[0.02] border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center">
            <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-6" style={monoStyle}>Trusted by</p>
            <div className="flex flex-wrap justify-center gap-8 text-white/30 font-semibold text-lg">
              {["Phantom Motors", "ArcSpace", "Luminary", "Valo Corp", "Studio Levi", "Forma", "Nexus Cloud", "Helio Medical"].map(c => (
                <span key={c} className="hover:text-white/60 transition-colors cursor-default">{c}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Animated CTA ──────────────────────────────────────────────────── */}
      <AnimatedCTA />
    </div>
  )
}
