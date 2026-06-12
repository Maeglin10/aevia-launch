"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, Zap, Box, Layers, Globe, Cpu, ChevronRight } from "lucide-react"
import { Reveal, projects } from "./shared"

const homeServices = [
  { icon: <Box className="w-6 h-6" />, title: "3D Product Visualization", desc: "Photorealistic 3D models for e-commerce, marketing, and configurators. Real-time or pre-rendered." },
  { icon: <Layers className="w-6 h-6" />, title: "Augmented Reality", desc: "WebAR and native AR experiences. Try-before-you-buy, spatial computing, and brand activations." },
  { icon: <Globe className="w-6 h-6" />, title: "Virtual Worlds", desc: "Immersive 3D environments for events, showrooms, and metaverse platforms." },
  { icon: <Cpu className="w-6 h-6" />, title: "Real-time Rendering", desc: "GPU-accelerated real-time 3D for interactive product configurators and live experiences." },
]

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const [activeProject, setActiveProject] = useState<number | null>(null)

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9B5CF6]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#6D28D9]/15 rounded-full blur-3xl" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(155,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(155,92,246,0.5) 1px, transparent 1px)`,
              backgroundSize: "80px 80px"
            }}
          />
        </div>
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-[#9B5CF6]/40 text-[#9B5CF6] text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            style={{ fontFamily: "'Space Mono', monospace" }}
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
                <div className="text-3xl font-bold text-[#9B5CF6]" style={{ fontFamily: "'Space Mono', monospace" }}>{val}</div>
                <div className="text-sm text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Selected Work Preview */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Selected Work</p>
              <h2 className="text-4xl md:text-5xl font-bold">Recent projects</h2>
            </div>
            <Link href="/templates/impact-27/work" className="text-sm font-semibold text-[#9B5CF6] hover:text-white transition-colors flex items-center gap-1.5">
              View full work <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 2).map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <div
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  onMouseEnter={() => setActiveProject(i)}
                  onMouseLeave={() => setActiveProject(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0712] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>{p.type}</div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                      <motion.div
                        animate={{ x: activeProject === i ? 0 : -10, opacity: activeProject === i ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-5 h-5 text-[#9B5CF6]" />
                      </motion.div>
                    </div>
                    <div className="text-white/40 text-sm mt-1">{p.client}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services summary */}
      <section className="py-24 px-6 bg-white/[0.02] border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Services</p>
              <h2 className="text-4xl md:text-5xl font-bold">What we do</h2>
            </div>
            <Link href="/templates/impact-27/services" className="text-sm font-semibold text-[#9B5CF6] hover:text-white transition-colors flex items-center gap-1.5">
              Read service details <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeServices.slice(0, 2).map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#9B5CF6]/30 hover:bg-[#9B5CF6]/5 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-[#9B5CF6]/15 text-[#9B5CF6] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#9B5CF6]/25 transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Process</p>
            <h2 className="text-4xl font-bold">How we work</h2>
          </Reveal>
          <div className="space-y-0">
            {[
              { n: "01", title: "Discovery", desc: "We audit your brand assets and technical constraints. Two-day sprint to define deliverables and timelines." },
              { n: "02", title: "3D Production", desc: "Our artists build geometry, texturing, and lighting setups. Weekly previews with unlimited revisions." },
              { n: "03", title: "AR/RT Integration", desc: "We integrate into your platform — WebAR, native app, configurator, or metaverse environment." },
              { n: "04", title: "Launch & Optimize", desc: "We monitor performance metrics and optimize load times, rendering quality, and UX post-launch." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="flex items-start gap-8 border-t border-white/10 py-8 hover:border-[#9B5CF6]/20 transition-colors group cursor-default">
                  <div className="text-white/20 text-2xl font-bold min-w-12 group-hover:text-[#9B5CF6] transition-colors" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {step.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xl">{step.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#9B5CF6] transition-colors mt-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients + testimonial */}
      <section className="py-24 px-6 bg-white/[0.02] border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Trusted by</p>
            <div className="flex flex-wrap justify-center gap-8 text-white/30 font-semibold text-lg">
              {["Phantom Motors", "ArcSpace", "Luminary", "Valo Corp", "Studio Levi", "Forma"].map(c => (
                <span key={c} className="hover:text-white/60 transition-colors cursor-default">{c}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-3xl mx-auto">
              <p className="text-xl text-white/70 leading-relaxed mb-6 italic">
                "Vertex turned our static product catalogue into a living, interactive 3D experience. Conversion rate jumped 340% in the first quarter."
              </p>
              <div className="font-semibold">Marc Duval</div>
              <div className="text-white/40 text-sm">Head of Digital, Phantom Motors</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#9B5CF6]/5 border border-[#9B5CF6]/20 rounded-3xl p-12 md:p-16">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-[#9B5CF6]" />
                <span className="text-[#9B5CF6] text-xs tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>New project</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to go spatial?</h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl">
                Tell us about your project. We'll get back to you within 24 hours with a scope and timeline.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Your name" className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#9B5CF6]/50" />
                <input type="email" placeholder="your@company.com" className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#9B5CF6]/50" />
              </div>
              <textarea
                placeholder="Tell us about your project — what do you need, what's your timeline?"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#9B5CF6]/50 resize-none mb-6"
              />
              <button className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 cursor-pointer border-none text-base">
                Send message <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
