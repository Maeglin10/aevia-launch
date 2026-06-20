"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useEffect } from "react"
import Image from "next/image"

export function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-29-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-29-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');`
    document.head.appendChild(style)
  }, [])
}

export function ScrollImage({ src, alt, width, height, className = "", dir = 1, yRange = 50 }: {
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

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

export const projects = [
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

export const skills = [
  { cat: "Languages", items: ["TypeScript", "Rust", "Go", "Python", "SQL"] },
  { cat: "Frontend", items: ["React 19", "Next.js 15", "Framer Motion", "Radix UI", "Tailwind"] },
  { cat: "Backend", items: ["Node.js", "Axum", "Gin", "tRPC", "GraphQL"] },
  { cat: "Infra", items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "Cloudflare"] },
]

export const stats = [
  { value: "12+", label: "years of experience", detail: "since 2014" },
  { value: "3.4k", label: "GitHub stars", detail: "across 6 repos" },
  { value: "99.99%", label: "uptime SLA", detail: "last 24 months" },
  { value: "140ms", label: "latency cut", detail: "p99.9 at Stripe" },
  { value: "4", label: "FAANG companies", detail: "Stripe · Vercel · Linear · Algolia" },
  { value: "45%", label: "payload reduction", detail: "CRDT compaction pipeline" },
]

export const services = [
  {
    id: "01",
    name: "Staff Engineering",
    short: "Leadership at the technical frontier",
    body: "I embed as a principal or staff engineer on product teams — owning critical infrastructure, driving RFCs, and unblocking roadblocks at the systems level. I've led teams at Stripe and Vercel on problems where the cost of failure is measured in eight figures.",
    tags: ["Architecture", "IC Leadership", "RFCs", "Tech Debt"],
    rate: "€1,200 / day",
  },
  {
    id: "02",
    name: "Performance Audits",
    short: "Find the milliseconds your users feel",
    body: "A focused 2-week engagement: profiling, distributed tracing, bottleneck identification, and a prioritized fix roadmap. Deliverable is a written report + working patches. Previous clients saw p99 reductions between 30 and 60 percent.",
    tags: ["Profiling", "Tracing", "PostgreSQL", "Rust sidecars"],
    rate: "€8,000 flat",
  },
  {
    id: "03",
    name: "Open Source Advisory",
    short: "Sustainable OSS strategy for your company",
    body: "Project governance, contributor onboarding pipelines, license audits, and roadmap sequencing. I help engineering-led companies extract compounding value from open source without burning their maintainers.",
    tags: ["Governance", "Licensing", "Community", "Roadmap"],
    rate: "€800 / day",
  },
  {
    id: "04",
    name: "Technical Due Diligence",
    short: "Know what you're acquiring",
    body: "Pre-acquisition or pre-investment deep dives: codebase quality, security posture, scalability ceiling, key-person risk, and hidden liabilities. Written report in 5 business days, suitable for board presentation.",
    tags: ["Security", "Scalability", "Risk", "M&A"],
    rate: "Custom",
  },
]

export const process = [
  {
    step: "00",
    name: "git clone — Discovery",
    desc: "30-minute async brief via Loom or written document. I read your tech stack, understand the constraint space, and flag anything that changes scope.",
  },
  {
    step: "01",
    name: "npm install — Alignment",
    desc: "Shared document with goals, success criteria, and weekly cadence. No surprise pivots. If the problem shifts mid-engagement, we re-scope in writing.",
  },
  {
    step: "02",
    name: "cargo build — Execution",
    desc: "I work in short cycles with visible output. Each week ends with a Loom walkthrough of what shipped, what didn't, and why.",
  },
  {
    step: "03",
    name: "✓ Released — Handoff",
    desc: "Clean handoff: documented architecture decisions, runbooks, and a post-engagement Q&A window (2 weeks). No orphaned code.",
  },
]

export const testimonials = [
  {
    name: "Léa Fontaine",
    role: "CTO, Finary",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    quote: "Raphaël rewrote our transaction reconciliation service in four weeks. P99 dropped from 900ms to 120ms. The codebase he left behind is the cleanest we have — and that's saying something.",
  },
  {
    name: "Yohan Mbeki",
    role: "VP Engineering, Alan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    quote: "His performance audit found three systemic query patterns we'd missed for two years. The fix was deployed in one sprint. Worth ten times the fee.",
  },
  {
    name: "Sara Molina",
    role: "Engineering Lead, Pennylane",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    quote: "Detailed, precise, communicates tradeoffs instead of opinions. He delivered a 25-page architecture RFC on our data layer that we shipped almost verbatim. Rare.",
  },
  {
    name: "Thomas Kühn",
    role: "Principal Engineer, Datadog",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    quote: "Open source advisory from someone who's actually shipped and maintained large OSS projects. Not just theory. Would work with him again immediately.",
  },
]

export const clients = [
  { name: "Stripe", logo: "STRIPE" },
  { name: "Vercel", logo: "VERCEL" },
  { name: "Linear", logo: "LINEAR" },
  { name: "Algolia", logo: "ALGOLIA" },
  { name: "Finary", logo: "FINARY" },
  { name: "Datadog", logo: "DATADOG" },
  { name: "Alan", logo: "ALAN" },
  { name: "Pennylane", logo: "PENNYLANE" },
]

export const allProjects = [
  {
    name: "noctua.dev",
    category: "Open Source",
    year: "2024",
    desc: "Real-time collaborative code editor. WebSockets, Monaco Editor, Y.js CRDT.",
    stack: ["Next.js", "Rust", "WebSockets", "PostgreSQL"],
    stars: "2.1k",
    forks: "210",
    installation: "npm install -g @noctua/core\nnoctua dev --port 4000",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
  {
    name: "argos-cli",
    category: "Developer Tools",
    year: "2024",
    desc: "Terminal-based API testing framework with snapshot diffs and CI/CD integration.",
    stack: ["Node.js", "TypeScript", "Jest"],
    stars: "847",
    forks: "94",
    installation: "npm install -g argos-cli\nargos test ./api/specs --diff",
    img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
  {
    name: "vaultkey",
    category: "Security",
    year: "2023",
    desc: "Zero-knowledge password manager. AES-256-GCM, argon2id key derivation, WASM crypto.",
    stack: ["Rust", "WASM", "React", "SQLite"],
    stars: "3.4k",
    forks: "482",
    installation: "cargo install vaultkey-cli\nvaultkey init --vault ~/.vk",
    img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
  {
    name: "axon-query",
    category: "Infrastructure",
    year: "2023",
    desc: "Postgres query planner extension written in Rust — automatic index recommendations via execution trace analysis.",
    stack: ["Rust", "C", "PostgreSQL"],
    stars: "1.2k",
    forks: "131",
    installation: "cargo install axon-query\naxon analyze --dsn $DATABASE_URL",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
  {
    name: "sigline",
    category: "Observability",
    year: "2022",
    desc: "Distributed tracing CLI that reconstructs call graphs from raw OTLP spans across multiple services.",
    stack: ["Go", "gRPC", "OTLP"],
    stars: "590",
    forks: "67",
    installation: "go install github.com/glitchdev/sigline@latest",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
  {
    name: "krate",
    category: "Build Systems",
    year: "2022",
    desc: "Incremental build cache layer for Cargo workspaces. Cuts CI times by 40-70% via content-addressed artifacts.",
    stack: ["Rust", "S3", "Docker"],
    stars: "764",
    forks: "88",
    installation: "cargo install krate\nkrate cache --remote s3://my-bucket",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&crop=center",
    href: "https://github.com",
  },
]

export const timeline = [
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
