"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Reveal, gridOverlay, monoStyle, Label } from "../shared"
import {
  Award, Compass, Heart, Users, Target, Code2,
  Triangle, Hexagon, Globe, Zap, Aperture, ArrowRight,
  CheckCircle, Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// ─── Data ─────────────────────────────────────────────────────────────────────

const crew = [
  {
    name: "Valentin Milliand",
    role: "Creative Director & Tech Lead",
    desc: "Architect of real-time web applications, specializing in shader optimization and WebGL graphics architectures. 8 years building spatial experiences for the open web.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    tags: ["Three.js", "GLSL", "WebXR"],
    linkedin: "#",
  },
  {
    name: "Eléna Rostova",
    role: "Lead 3D Artist",
    desc: "Expert in low-poly mesh modeling, PBR baking, and texture optimization for web-native mobile environments. Former Pixar lighting artist.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    tags: ["Blender", "Substance", "Unreal"],
    linkedin: "#",
  },
  {
    name: "Marcus Vance",
    role: "UX & Frontend Engineer",
    desc: "Transforms standard web architectures into tactile, spatial 3D interactions with seamless browser fallback pipelines.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    tags: ["React", "R3F", "Framer Motion"],
    linkedin: "#",
  },
  {
    name: "Nadia Chen",
    role: "AR Systems Engineer",
    desc: "WebXR specialist and ARKit expert. Has shipped AR experiences used by more than 4 million end users worldwide.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    tags: ["ARKit", "WebXR", "TensorFlow.js"],
    linkedin: "#",
  },
]

const awards = [
  { title: "FWA of the Day", category: "WebGL Product Configurator — Phantom Motors", year: "2025" },
  { title: "Awwwards Site of the Month", category: "Virtual Showroom Experience — Studio Levi", year: "2024" },
  { title: "CSS Design Awards Best UX", category: "Augmented Reality Visualizer — Luminary", year: "2024" },
  { title: "Webby Award — Best Use of Technology", category: "Multi-user AR Experience — ArcSpace", year: "2023" },
  { title: "Smashing Magazine Feature", category: "Annual WebGL Innovation Showcase", year: "2023" },
]

const techStack = [
  {
    category: "Rendering",
    icon: <Triangle className="w-5 h-5" />,
    tools: [
      { name: "Three.js", desc: "Primary WebGL rendering engine. 95% of our projects use it as the foundation.", level: 98 },
      { name: "Babylon.js", desc: "Game-engine-grade rendering for high-fidelity product visualizers.", level: 88 },
      { name: "PlayCanvas", desc: "Multi-user real-time environments at scale.", level: 80 },
    ],
  },
  {
    category: "Frameworks",
    icon: <Hexagon className="w-5 h-5" />,
    tools: [
      { name: "React Three Fiber", desc: "Declarative 3D with full React ecosystem support.", level: 96 },
      { name: "Next.js", desc: "SSR/SSG for SEO-critical 3D landing pages.", level: 92 },
      { name: "Framer Motion", desc: "Fluid UI animation layered over 3D scenes.", level: 90 },
    ],
  },
  {
    category: "GPU / Shaders",
    icon: <Code2 className="w-5 h-5" />,
    tools: [
      { name: "GLSL", desc: "Custom vertex and fragment shaders for photorealistic materials.", level: 94 },
      { name: "WebAssembly", desc: "Physics engines and compute-heavy algorithms at near-native speed.", level: 78 },
      { name: "WebGPU", desc: "Next-gen GPU API — actively used in experimental projects.", level: 65 },
    ],
  },
  {
    category: "3D Authoring",
    icon: <Aperture className="w-5 h-5" />,
    tools: [
      { name: "Blender", desc: "Open-source 3D modelling, rigging, and animation pipeline.", level: 97 },
      { name: "Unreal Engine", desc: "Cinematic pre-rendered assets and Lumen lighting bakes.", level: 82 },
      { name: "Substance 3D", desc: "PBR texture authoring and material library management.", level: 89 },
    ],
  },
  {
    category: "Spatial / AR",
    icon: <Globe className="w-5 h-5" />,
    tools: [
      { name: "WebXR API", desc: "Browser-native AR/VR without app installs.", level: 93 },
      { name: "ARKit / ARCore", desc: "Native iOS and Android augmented reality.", level: 88 },
      { name: "TensorFlow.js", desc: "Body pose and surface estimation for clothing try-on.", level: 75 },
    ],
  },
  {
    category: "Infrastructure",
    icon: <Zap className="w-5 h-5" />,
    tools: [
      { name: "Draco / KTX2", desc: "Asset compression pipelines that reduce file size by 70-80%.", level: 95 },
      { name: "WebSockets", desc: "Real-time multi-user sync for virtual environments.", level: 87 },
      { name: "WebWorkers", desc: "Zero main-thread data processing for 60 FPS guarantee.", level: 91 },
    ],
  },
]

const values = [
  {
    icon: <Compass className="w-6 h-6 text-[#9B5CF6]" />,
    title: "Precision",
    desc: "Every polygon is hand-tuned. Every light source is computed to optimise realism without hurting framerates.",
  },
  {
    icon: <Target className="w-6 h-6 text-[#9B5CF6]" />,
    title: "Performance",
    desc: "If it doesn't load in under 3 seconds, it's not web-ready. Speed is our primary design constraint.",
  },
  {
    icon: <Users className="w-6 h-6 text-[#9B5CF6]" />,
    title: "Collaboration",
    desc: "We partner closely with internal digital product squads to ensure smooth handoffs and native deployments.",
  },
  {
    icon: <Heart className="w-6 h-6 text-[#9B5CF6]" />,
    title: "Craft",
    desc: "We push every frame, every shader, and every interaction until it feels effortless. Craft is non-negotiable.",
  },
]

const timeline = [
  { year: "2016", event: "Vertex Studio founded by Valentin Milliand in Paris. First WebGL configurator shipped for a luxury watchmaker." },
  { year: "2018", event: "Expanded to a 4-person team. First WebAR project shipped. First Awwwards nomination." },
  { year: "2020", event: "Pandemic pivot: virtual showrooms for retail brands. Built architecture that now serves 10k concurrent users." },
  { year: "2022", event: "First medical AR project (Helio Medical). First Fortune 500 client. Expanded team to 8." },
  { year: "2024", event: "FWA of the Day, Awwwards Site of the Month, CSS Design Awards. 200 projects milestone." },
  { year: "2025", event: "WebGPU R&D lab launched. First generative 3D brand system delivered. Team of 12." },
]

// ─── Tech Stack Section ───────────────────────────────────────────────────────

function TechStackDeep() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section className="mb-20">
      <Reveal className="mb-10">
        <Label>Technology</Label>
        <h2 className="text-3xl md:text-4xl font-bold">Our technology stack</h2>
        <p className="text-white/45 text-sm mt-3 max-w-xl leading-relaxed">
          We pick tools with proven GPU headroom, strong community backing, and real-world production track records.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category selector */}
        <Reveal>
          <div className="flex flex-col gap-2">
            {techStack.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer flex items-center gap-3 group ${
                  activeCategory === i
                    ? "bg-[#9B5CF6]/10 border-[#9B5CF6]/40"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeCategory === i ? "bg-[#9B5CF6] text-white" : "bg-white/5 text-white/35 group-hover:bg-[#9B5CF6]/15 group-hover:text-[#9B5CF6]"
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-sm font-semibold transition-colors ${activeCategory === i ? "text-white" : "text-white/50"}`}>
                  {cat.category}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tools detail panel */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {techStack[activeCategory].tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/20 rounded-2xl p-6 transition-all group cursor-default"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-[#9B5CF6] transition-colors">{tool.name}</h4>
                    <p className="text-white/45 text-sm mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                  <span className="text-[#9B5CF6] text-sm font-bold shrink-0" style={monoStyle}>
                    {tool.level}%
                  </span>
                </div>
                {/* Skill bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tool.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Studio Timeline ──────────────────────────────────────────────────────────

function StudioTimeline() {
  return (
    <section className="mb-20">
      <Reveal className="mb-10">
        <Label>History</Label>
        <h2 className="text-3xl md:text-4xl font-bold">Our story</h2>
      </Reveal>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-[72px] top-0 bottom-0 w-px bg-white/5" />

        <div className="space-y-0">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.07}>
              <div className="flex gap-8 md:gap-14 items-start group pl-14 md:pl-24 relative pb-8">
                {/* Year marker */}
                <div className="absolute left-0 md:left-14 top-1 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-[#9B5CF6]/50 bg-[#0C0712] group-hover:border-[#9B5CF6] transition-colors shrink-0" />
                </div>
                <div className="shrink-0 w-10 md:w-0 invisible md:visible">
                  <span className="text-xs font-bold text-[#9B5CF6] absolute left-0 top-0.5 w-12 text-right" style={monoStyle}>
                    {item.year}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-[#9B5CF6] md:hidden" style={monoStyle}>{item.year}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{item.event}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={gridOverlay} />

      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <Label>Studio</Label>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">About Us</h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            We are a team of creative engineers, artists, and researchers crafting premium spatial interactions for the open web — no plugins, no apps, no friction.
          </p>
        </Reveal>

        {/* ── Manifesto ──────────────────────────────────────────────── */}
        <Reveal className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#9B5CF6]/20 bg-[#9B5CF6]/[0.04] p-10 md:p-14">
            <div className="absolute inset-0 opacity-[0.03]" style={gridOverlay} />
            <div className="relative">
              <p className="text-xs text-[#9B5CF6] uppercase tracking-widest mb-6" style={monoStyle}>Our Manifesto</p>
              <blockquote className="text-2xl md:text-3xl text-white/85 leading-relaxed font-light italic max-w-3xl">
                "We believe the web is transitioning from a flat document model to a spatial canvas. Our mission is to build highly interactive, beautiful, and fluid 3D experiences that run instantly on any screen without plugins or app installations."
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#9B5CF6] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-white/50 text-sm">Valentin Milliand, Founder</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Values ─────────────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal className="mb-10">
            <Label>Values</Label>
            <h2 className="text-3xl md:text-4xl font-bold">What we stand for</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/20 rounded-2xl p-6 flex gap-5 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-[#9B5CF6]/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#9B5CF6]/25 transition-colors">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1.5">{v.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Team ───────────────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal className="mb-10">
            <Label>Team</Label>
            <h2 className="text-3xl md:text-4xl font-bold">The crew</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crew.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/20 rounded-2xl overflow-hidden group transition-all flex flex-col md:flex-row">
                  {/* Photo */}
                  <div className="relative w-full md:w-36 h-48 md:h-auto shrink-0 overflow-hidden">
                    <Image
                      src={member.img}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    {/* Purple tint on hover */}
                    <div className="absolute inset-0 bg-[#9B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Info */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <div className="text-xs text-[#9B5CF6] mb-3" style={monoStyle}>{member.role}</div>
                      <p className="text-white/45 text-xs leading-relaxed mb-4">{member.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.tags.map(t => (
                        <span key={t} className="text-[9px] border border-white/10 text-white/40 px-2.5 py-1 rounded-full" style={monoStyle}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ─────────────────────────────────────────────── */}
        <TechStackDeep />

        {/* ── Studio Timeline ────────────────────────────────────────── */}
        <StudioTimeline />

        {/* ── Awards ─────────────────────────────────────────────────── */}
        <Reveal className="mb-20">
          <div className="bg-[#120B1A] border border-white/5 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#9B5CF6]/15 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-[#9B5CF6]" />
              </div>
              <div>
                <Label>Recognition</Label>
                <h2 className="text-2xl font-bold -mt-3">Awards & press</h2>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {awards.map(award => (
                <div key={award.title} className="py-4 flex flex-wrap justify-between items-start gap-3 group">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#9B5CF6] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white text-base block group-hover:text-[#9B5CF6] transition-colors">{award.title}</span>
                      <span className="text-xs text-white/35 mt-0.5 block">{award.category}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#9B5CF6] font-semibold shrink-0" style={monoStyle}>{award.year}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Studio CTA ─────────────────────────────────────────────── */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#9B5CF6]/25 bg-gradient-to-br from-[#9B5CF6]/10 to-transparent p-10 md:p-14">
            <div className="absolute inset-0 opacity-[0.04]" style={gridOverlay} />
            {/* Corner marks */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#9B5CF6]/30 rounded-tl-lg" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#9B5CF6]/30 rounded-br-lg" />
            <div className="relative text-center max-w-xl mx-auto">
              <Label>Join the team</Label>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">We're always looking for<br />exceptional people</h2>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Remote-first. Deep work culture. Equity for early hires. If you live and breathe 3D and the web, we want to talk.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/templates/impact-27/contact"
                  className="inline-flex items-center gap-2 bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full transition-colors text-base"
                >
                  Work with us <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/templates/impact-27/work"
                  className="inline-flex items-center gap-2 border border-white/15 hover:border-[#9B5CF6]/50 text-white hover:bg-[#9B5CF6]/10 font-semibold px-8 py-4 rounded-full transition-all text-base"
                >
                  See our work
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
