"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { PROJECTS, Reveal } from "../shared"

export default function ProgrammesPage() {
  const activeProjects = PROJECTS.filter(project => project.progress < 100)

  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Programmes en cours</p>
            <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Nos <em>développements</em>
            </h1>
            <p className="text-[#6B5A40] text-lg max-w-2xl mt-6 font-light leading-relaxed">
              Découvrez nos projets immobiliers actuellement en phase de développement ou de construction. Chacun d&apos;eux incarne nos standards d&apos;excellence architecturale et de durabilité environnementale.
            </p>
          </Reveal>
        </div>

        {/* Grid of Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.08}>
              <div className="group flex flex-col h-full bg-white border border-[#E0D8CC] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#1A1612]/30 group-hover:bg-[#1A1612]/15 transition-all duration-500" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#C9A86C] text-[#1A1612] text-[10px] tracking-widest uppercase px-3 py-1 font-medium shadow-sm">
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-normal mb-1 font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {project.name}
                  </h3>
                  <p className="text-sm text-[#C9A86C] font-medium mb-3">{project.type}</p>
                  <p className="text-sm text-[#6B5A40] flex items-center gap-1.5 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A86C] flex-shrink-0" />
                    {project.location} · {project.size}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mt-auto pt-4 border-t border-[#F0EBE0]">
                    <div className="flex justify-between text-xs text-[#8A7860] mb-2 font-medium">
                      <span>Avancement</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E0D8CC] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#C9A86C] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
