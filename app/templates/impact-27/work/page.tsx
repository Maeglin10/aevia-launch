"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Reveal, projects } from "../shared"
import { ArrowRight, Filter, X, CheckCircle, Zap } from "lucide-react"

export default function WorkPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  const categories = ["All", "3D Branding", "Augmented Reality", "3D Configurator", "Virtual Try-On"]

  const filteredProjects = selectedFilter === "All"
    ? projects
    : projects.filter(p => p.type === selectedFilter)

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <Reveal className="mb-12">
        <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Portfolio</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Work</h1>
        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          Explore our collection of high-fidelity 3D visualization systems, immersive augmented reality deployments, and custom real-time configurators.
        </p>
      </Reveal>

      {/* Filter Tabs */}
      <Reveal className="mb-12 flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-white/40 mr-2" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border ${
              selectedFilter === cat
                ? "bg-[#9B5CF6] border-[#9B5CF6] text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <div
              onClick={() => setSelectedProject(p)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-[#9B5CF6]/30 transition-all bg-[#120B1A]"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <Image
                  src={p.img}
                  alt={p.name}
                  width={600}
                  height={375}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0712] via-transparent to-transparent opacity-90" />
              </div>
              <div className="p-6">
                <span
                  className="inline-block text-[#9B5CF6] text-xs tracking-widest uppercase mb-2"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {p.type}
                </span>
                <h3 className="text-2xl font-bold group-hover:text-[#9B5CF6] transition-colors">{p.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-white/40 text-sm">{p.client}</span>
                  <span className="text-xs text-[#9B5CF6] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
                    View details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#120B1A] border border-[#9B5CF6]/30 rounded-3xl w-full max-w-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={selectedProject.img}
                  alt={selectedProject.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B1A] to-black/30" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[#9B5CF6] text-xs tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {selectedProject.type}
                    </span>
                    <h2 className="text-3xl font-bold mt-1">{selectedProject.name}</h2>
                  </div>
                  <div className="bg-[#9B5CF6]/15 border border-[#9B5CF6]/30 rounded-xl px-4 py-2 text-right">
                    <span className="text-[10px] text-white/40 block uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>Client</span>
                    <span className="font-semibold text-sm text-[#9B5CF6]">{selectedProject.client}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-b border-white/5 py-6">
                  <div>
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>Platform</div>
                    <div className="text-sm font-semibold text-white/80">WebAR & Safari/Chrome</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>Performance</div>
                    <div className="text-sm font-semibold text-[#9B5CF6]">60 FPS Locked</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>Tech Stack</div>
                    <div className="text-sm font-semibold text-white/80">Three.js / WebGL / GLSL</div>
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-3">Project Overview</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  We engineered a completely browser-native 3D configurator designed to lower entry friction and boost user engagement. By employing custom compression algorithms and optimized shaders, the load time is kept under 2.5 seconds on mobile connections while maintaining photorealism.
                </p>

                <h4 className="text-lg font-bold mb-4">Key Achievements</h4>
                <ul className="space-y-3 mb-8">
                  {[
                    "340% increase in product page conversion rate.",
                    "Reduced 3D model asset bundle size by 78% using mesh decimation.",
                    "Compatible with all modern iOS and Android mobile web browsers.",
                    "Native integration with Shopify, Salesforce, and custom headless checkouts."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-[#9B5CF6] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="border border-white/10 hover:border-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null)
                      const element = document.getElementById("contact")
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" })
                      } else {
                        window.location.href = "/templates/impact-27#contact"
                      }
                    }}
                    className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors flex items-center gap-1.5"
                  >
                    Discuss similar project <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
