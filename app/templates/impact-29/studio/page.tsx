"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, GitBranch, Monitor, Cpu, Wifi, Terminal, Code2 } from "lucide-react"
import { Reveal, ScrollImage, skills, services, process } from "../shared"

const setup = [
  {
    category: "Workstation",
    items: [
      { name: "MacBook Pro 16\" M3 Max", detail: "96GB RAM · 4TB SSD" },
      { name: "LG 5K UltraFine 27\"", detail: "Primary display, DCI-P3" },
      { name: "Dell U2723D 27\"", detail: "Secondary, reference color" },
      { name: "Keychron Q3 Max", detail: "Gateron Phantom Red switches" },
      { name: "Logitech MX Master 3S", detail: "Electromagnetic scroll" },
    ],
    icon: Monitor,
  },
  {
    category: "Terminal Stack",
    items: [
      { name: "Ghostty", detail: "GPU-accelerated terminal" },
      { name: "Neovim (LazyVim)", detail: "Primary editor since 2021" },
      { name: "tmux + zoxide", detail: "Session management + nav" },
      { name: "Fish shell", detail: "With pure prompt" },
      { name: "WezTerm (backup)", detail: "For pair programming" },
    ],
    icon: Terminal,
  },
  {
    category: "Infra & Cloud",
    items: [
      { name: "Hetzner Cloud", detail: "Primary compute (CAX41)" },
      { name: "Cloudflare R2 + Workers", detail: "Edge CDN and storage" },
      { name: "Neon (PostgreSQL)", detail: "Serverless Postgres" },
      { name: "Upstash Redis", detail: "Serverless caching" },
      { name: "Fly.io", detail: "Hobby deployments" },
    ],
    icon: Wifi,
  },
  {
    category: "Daily Drivers",
    items: [
      { name: "Linear", detail: "Issue tracking" },
      { name: "Raycast", detail: "App launcher + snippets" },
      { name: "Cursor", detail: "AI pair programming" },
      { name: "TablePlus", detail: "Database GUI" },
      { name: "Warp", detail: "Terminal for onboarding clients" },
    ],
    icon: Cpu,
  },
]

const philosophy = [
  {
    id: "01",
    title: "Correctness over cleverness",
    body: "A brilliant trick that three engineers can't read next quarter is a liability, not an asset. I optimize for the next engineer on the codebase — which is often me six months from now.",
  },
  {
    id: "02",
    title: "Measure before you optimize",
    body: "Intuition about performance is usually wrong. Profilers, distributed traces, and real production telemetry should drive optimization decisions, not hunches or benchmarks from 2019.",
  },
  {
    id: "03",
    title: "Small PRs, fast feedback",
    body: "A 50-line PR that ships today beats a 500-line PR that lives in review for two weeks. I keep diffs reviewable and gates automated so feedback loops stay tight.",
  },
  {
    id: "04",
    title: "The RFC is the work",
    body: "Writing a clear design doc forces you to discover the edge cases. If you can't explain a system to a peer in writing, you don't understand it well enough to build it.",
  },
  {
    id: "05",
    title: "Open source is infrastructure",
    body: "The tools I publish are maintained with the same rigor as production code: semantic versioning, changelogs, security advisories, and reproducible builds. Abandoning a popular library is an externality.",
  },
  {
    id: "06",
    title: "Boring technology wins",
    body: "PostgreSQL, Redis, and HTTP have solved most of the problems startups think require a distributed graph database. Choose the boring option, then make it fast.",
  },
]

const env = [
  {
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&crop=center",
    alt: "Code on screen",
    label: "The main workstation",
  },
  {
    img: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&h=600&fit=crop&crop=center",
    alt: "Terminal",
    label: "Terminal workspace",
  },
  {
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&crop=center",
    alt: "Server infrastructure",
    label: "Self-hosted infra rack",
  },
  {
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&crop=center",
    alt: "PCB close-up",
    label: "Custom keyboard build",
  },
  {
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
    alt: "Data center",
    label: "Hetzner FSN1 datacenter",
  },
  {
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
    alt: "Network cables",
    label: "Home lab wiring",
  },
]

export default function StudioPage() {
  return (
    <div className="pt-28 min-h-dvh">

      {/* Header */}
      <section className="py-20 px-6 border-b border-[#00F5D4]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(0,245,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[#00F5D4] text-xs mb-3"><span className="text-[#475569]">// </span>about_the_studio</div>
            <h1 className="font-bold leading-[1.05] mb-6" style={{ fontSize: "clamp(36px, 7vw, 80px)" }}>
              The Studio
            </h1>
            <p className="text-[#94A3B8] text-lg leading-relaxed max-w-2xl">
              A document about how I work — the tools, the philosophy, and the physical setup. Because the environment shapes the output.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>engineering_beliefs</div>
            <h2 className="font-bold text-3xl md:text-4xl">Philosophy</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#00F5D4]/10">
            {philosophy.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <div className="bg-[#0A0E1A] p-8 hover:bg-[#0D1323] transition-colors h-full">
                  <div className="text-[#475569] text-xs font-bold mb-5">{p.id}</div>
                  <h3 className="font-bold text-base mb-4 text-[#E2E8F0]">{p.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>hardware_software</div>
            <h2 className="font-bold text-3xl md:text-4xl">The Setup</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {setup.map((cat, i) => (
              <Reveal key={cat.category} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/15 p-8 hover:border-[#00F5D4]/30 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <cat.icon className="w-4 h-4 text-[#00F5D4]" />
                    <div className="text-[#00F5D4] text-xs font-bold uppercase tracking-widest">{cat.category}</div>
                  </div>
                  <ul className="space-y-4">
                    {cat.items.map((item) => (
                      <li key={item.name} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-[#E2E8F0] font-medium">{item.name}</span>
                        <span className="text-xs text-[#475569] text-right shrink-0">{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills deep-dive */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>tech_proficiency</div>
            <h2 className="font-bold text-3xl md:text-4xl">Skills & Systems</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((s, i) => (
              <Reveal key={s.cat} delay={i * 0.1}>
                <div className="border border-[#00F5D4]/10 p-6 hover:border-[#00F5D4]/30 transition-colors h-full">
                  <div className="text-[#00F5D4] text-xs mb-4 uppercase tracking-widest">{s.cat}</div>
                  <ul className="space-y-2">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <div className="w-1 h-1 bg-[#00F5D4] rounded-full shrink-0" />
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

      {/* Photo Grid */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>the_environment</div>
            <h2 className="font-bold text-3xl md:text-4xl">Work Environment</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {env.map((e, i) => (
              <Reveal key={e.alt} delay={i * 0.06}>
                <div className="group relative overflow-hidden border border-[#00F5D4]/15 hover:border-[#00F5D4]/40 transition-colors">
                  <ScrollImage
                    src={e.img}
                    alt={e.alt}
                    width={800}
                    height={600}
                    className="w-full aspect-video"
                    dir={i % 2 === 0 ? 1 : -1}
                    yRange={30}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-[#E2E8F0]">{e.label}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>what_i_offer</div>
                <h2 className="font-bold text-3xl md:text-4xl">Engagement Types</h2>
              </div>
              <Link href="/templates/impact-29/contact" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1 cursor-pointer">
                Start a conversation <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc, i) => (
              <Reveal key={svc.id} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/15 p-6 hover:border-[#00F5D4]/30 transition-colors h-full flex flex-col">
                  <div className="text-[#475569] text-xs mb-4">{svc.id}</div>
                  <h3 className="font-bold text-sm mb-2">{svc.name}</h3>
                  <div className="text-[#475569] text-xs mb-4 flex-1">{svc.short}</div>
                  <div className="text-[#00F5D4] text-xs font-bold">{svc.rate}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>engagement_flow</div>
            <h2 className="font-bold text-3xl md:text-4xl">How an Engagement Works</h2>
          </Reveal>
          <div className="space-y-px">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/10 p-8 hover:bg-[#0A0E1A] transition-colors flex gap-8 items-start">
                  <div className="text-[#00F5D4] font-bold text-sm shrink-0 w-8">{step.step}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-2">{step.name}</h3>
                    <p className="text-[#94A3B8] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="text-[#00F5D4] text-xs mb-4"><span className="text-[#475569]">// </span>lets_work_together</div>
            <h2 className="font-bold text-3xl md:text-5xl mb-6">Want to know more?</h2>
            <p className="text-[#94A3B8] mb-10 leading-relaxed">
              I keep a short FAQ and current availability on the contact page. Takes 2 minutes to read.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/templates/impact-29/contact"
                className="bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm px-8 py-4 hover:bg-[#00E5C4] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Contact & FAQ <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates/impact-29/work"
                className="border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-8 py-4 hover:bg-[#00F5D4]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4" /> See the projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
