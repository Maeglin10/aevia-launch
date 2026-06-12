"use client"

import { Reveal } from "../shared"
import { Award, Compass, Heart, Users, Target } from "lucide-react"
import Image from "next/image"

export default function StudioPage() {
  const crew = [
    {
      name: "Valentin Milliand",
      role: "Creative Director & Tech Lead",
      desc: "Architect of real-time web applications, specializing in shader optimization and WebGL graphics architectures.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    },
    {
      name: "Eléna Rostova",
      role: "Lead 3D Artist",
      desc: "Expert in low-poly mesh modeling, PBR baking, and texture optimization for web-native mobile environments.",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"
    },
    {
      name: "Marcus Vance",
      role: "UX & Frontend Engineer",
      desc: "Transforms standard web architectures into tactile, spatial 3D interactions with seamless browser fallback pipelines.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
    }
  ]

  const awards = [
    { title: "FWA of the Day", category: "WebGL Product Configurator", year: "2025" },
    { title: "Awwwards Site of the Month", category: "Virtual Showroom Experience", year: "2024" },
    { title: "CSS Design Awards Best UX", category: "Augmented Reality Visualizer", year: "2024" }
  ]

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <Reveal className="mb-16">
        <p className="text-[#9B5CF6] text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Studio</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">About Us</h1>
        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          We are a team of creative engineers, developers, and designers crafting premium spatial interactions for web browsers.
        </p>
      </Reveal>

      {/* Manifesto */}
      <Reveal className="mb-20">
        <div className="border-l-2 border-[#9B5CF6] pl-6 md:pl-10 max-w-3xl my-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Manifesto</h2>
          <p className="text-xl text-white/80 leading-relaxed font-light italic">
            "We believe the web is transitioning from a flat document model to a spatial canvas. Our mission is to build highly interactive, beautiful, and fluid 3D experiences that run instantly on any screen without plugins or app installations."
          </p>
        </div>
      </Reveal>

      {/* Grid of values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: <Compass className="w-6 h-6 text-[#9B5CF6]" />, title: "Precision", desc: "Every polygon is hand-tuned. Every light source is computed to optimize realism without hurting framerates." },
          { icon: <Target className="w-6 h-6 text-[#9B5CF6]" />, title: "Performance", desc: "If it doesn't load in under 3 seconds, it's not web-ready. Speed is our primary design constraint." },
          { icon: <Users className="w-6 h-6 text-[#9B5CF6]" />, title: "Collaboration", desc: "We partner closely with internal digital product squads to ensure smooth handoffs and native deployments." }
        ].map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <div className="bg-[#120B1A] border border-white/5 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#9B5CF6]/15 rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{v.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Team Crew */}
      <section className="mb-20">
        <Reveal className="mb-10">
          <h2 className="text-3xl font-bold">The Crew</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {crew.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.1}>
              <div className="bg-[#120B1A] border border-white/5 rounded-2xl overflow-hidden group">
                <div className="aspect-square relative w-full overflow-hidden bg-white/5">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div className="text-xs text-[#9B5CF6] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>{member.role}</div>
                  <p className="text-white/50 text-xs leading-relaxed">{member.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Awards */}
      <Reveal>
        <div className="bg-[#120B1A] border border-white/5 rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-[#9B5CF6]" />
            <h2 className="text-2xl font-bold">Awards & Recognition</h2>
          </div>
          <div className="divide-y divide-white/5">
            {awards.map(award => (
              <div key={award.title} className="py-4 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span className="font-semibold text-white text-base">{award.title}</span>
                  <span className="text-xs text-white/40 block mt-1">{award.category}</span>
                </div>
                <span className="text-xs text-[#9B5CF6] font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>{award.year}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
