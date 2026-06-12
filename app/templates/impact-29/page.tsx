"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Terminal, GitBranch, ExternalLink, ChevronRight, Code2 } from "lucide-react"
import { Reveal, ScrollImage, projects, skills, timeline } from "./shared"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [activeProject, setActiveProject] = useState(0)

  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
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
            <Link href="/templates/impact-29/work" className="bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm px-6 py-3 hover:bg-[#00E5C4] transition-colors flex items-center gap-2 cursor-pointer border border-[#00F5D4]">
              view work() <ArrowRight className="w-4 h-4" />
            </Link>
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
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>selected_projects</div>
                <h2 className="font-bold text-3xl md:text-4xl">Featured Open Source</h2>
              </div>
              <Link href="/templates/impact-29/work" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                View all projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
                  <Link href="/templates/impact-29/work" className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
                    <ExternalLink className="w-4 h-4" /> Quick setup instructions
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-b border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>tech_stack</div>
                <h2 className="font-bold text-3xl md:text-4xl">Skills & Systems</h2>
              </div>
              <Link href="/templates/impact-29/skills" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                Launch Shell Simulator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>career_timeline</div>
                <h2 className="font-bold text-3xl md:text-4xl">Experience</h2>
              </div>
              <Link href="/templates/impact-29/timeline" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                View Full Architecture Impact <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
                <Link href="/templates/impact-29/timeline" className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm py-4 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <Code2 className="w-4 h-4" /> Project Impact Summary
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
