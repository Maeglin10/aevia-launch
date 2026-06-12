"use client"

import { Reveal } from "../shared"
import { Box, Layers, Globe, Cpu, ArrowRight, Shield, Rocket, Check } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const fullServices = [
    {
      icon: <Box className="w-8 h-8" />,
      title: "3D Product Visualization",
      badge: "WebGL / Three.js",
      desc: "High-fidelity real-time 3D rendering directly inside the browser. We construct lightweight meshes, optimized PBR textures, and physical lighting to showcase products from any angle.",
      deliverables: ["Interactive 3D configurators", "Optimized glTF/glb asset bundles", "Exploded views & animations", "E-commerce integration APIs"]
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Augmented Reality (WebAR)",
      badge: "ARKit / WebXR",
      desc: "No-app-install interactive augmented reality campaigns. By tapping a link, clients can place products directly in their physical space with photorealistic accuracy, spatial audio, and shadows.",
      deliverables: ["WebXR active experiences", "USDZ & GLB generation pipeline", "Quick Look iOS integrations", "Camera filters and custom overlays"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Virtual Environments",
      badge: "Real-time Meta",
      desc: "Fully interactive 3D spaces, online showrooms, virtual galleries, and architectural walkthroughs. We build immersive web worlds designed for thousands of concurrent visitors.",
      deliverables: ["Custom 3D maps & avatars", "Multi-user sync integrations", "Interactive hotspots", "High-fidelity spatial maps"]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "GPU & Shader Optimization",
      badge: "GLSL / WebAssembly",
      desc: "We push WebGL to its limits. We write custom vertex and fragment shaders in GLSL, compile heavy physics engines to WebAssembly, and optimize asset pipelines to run smoothly at 60 FPS on low-end mobile devices.",
      deliverables: ["Custom GLSL shaders", "Wasm physics simulation libraries", "LOD (Level of Detail) scripting", "GPU profile auditing & refactoring"]
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <Reveal className="mb-16">
        <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Expertise</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Services</h1>
        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          High-performance 3D components engineered for the modern web. We blend creative artistry with rigorous GPU-level optimization.
        </p>
      </Reveal>

      {/* Services detailed list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {fullServices.map((service, idx) => (
          <Reveal key={service.title} delay={idx * 0.1}>
            <div className="bg-[#120B1A] border border-white/5 hover:border-[#9B5CF6]/30 rounded-2xl p-8 h-full flex flex-col justify-between transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#9B5CF6]/15 text-[#9B5CF6] rounded-xl flex items-center justify-center group-hover:bg-[#9B5CF6]/25 transition-colors">
                    {service.icon}
                  </div>
                  <span className="text-xs border border-white/10 px-3 py-1.5 rounded-full text-white/50" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {service.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{service.desc}</p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-[#9B5CF6] mb-3 font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>Deliverables</div>
                <ul className="space-y-2 mb-6">
                  {service.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2.5 text-xs text-white/70">
                      <Check className="w-3.5 h-3.5 text-[#9B5CF6] shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Tech Stack Banner */}
      <Reveal>
        <div className="bg-gradient-to-r from-[#1E1131] to-[#120B1A] border border-[#9B5CF6]/20 rounded-3xl p-10 md:p-12 mb-20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Technology Stack</h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-xl mb-8">
            We write lightweight code with zero runtime dependencies wherever possible, using proven WebGL wrappers when helpful.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { name: "Three.js", category: "Rendering Engine" },
              { name: "GLSL / Shaders", category: "GPU Programming" },
              { name: "WebXR API", category: "Spatial Tech" },
              { name: "PlayCanvas / Babylon", category: "Game Engines" }
            ].map(tech => (
              <div key={tech.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="font-semibold text-white text-base">{tech.name}</div>
                <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Work Together CTA */}
      <Reveal className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Need custom web 3D development?</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          We offer flexible pricing structures — either flat project milestones or ongoing retainer setups. Let's scope your project.
        </p>
        <button
          onClick={() => {
            const element = document.getElementById("contact")
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
            } else {
              window.location.href = "/templates/impact-27#contact"
            }
          }}
          className="bg-[#9B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-full transition-colors inline-flex items-center gap-2 cursor-pointer border-none text-base mx-auto"
        >
          Get in touch <ArrowRight className="w-5 h-5" />
        </button>
      </Reveal>
    </div>
  )
}
