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
