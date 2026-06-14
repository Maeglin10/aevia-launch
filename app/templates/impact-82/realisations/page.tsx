"use client"

import React from "react"
import Image from "next/image"
import { MapPin, CheckCircle } from "lucide-react"
import { PROJECTS, Reveal } from "../shared"

export default function RealisationsPage() {
  // Get completed projects from common PROJECTS (progress === 100)
  const sharedCompleted = PROJECTS.filter(p => p.progress === 100)

  // Extra past signature projects for display
  const pastProjects = [
    ...sharedCompleted,
    {
      name: "Hôtel Particulier Victor Hugo",
      type: "Résidentiel d'exception",
      location: "Paris 16e",
      size: "1 200 m²",
      status: "Livré 2023",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
    },
    {
      name: "Technopole Lyon-Nord",
      type: "Bureaux & Laboratoires",
      location: "Lyon",
      size: "12 500 m²",
      status: "Livré 2022",
      image: "https://images.unsplash.com/photo-1504297366397-6f685459b9f9?w=800&q=80"
    },
    {
      name: "Les Terrasses de l'Océan",
      type: "Résidentiel de luxe",
      location: "Biarritz",
      size: "15 appartements",
      status: "Livré 2021",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
    }
  ]

  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Patrimoine & Réalisations</p>
            <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Nos références <em>passées</em>
            </h1>
            <p className="text-[#6B5A40] text-lg max-w-2xl mt-6 font-light leading-relaxed">
              Une sélection de nos projets immobiliers livrés. De la réhabilitation de prestige francilienne aux complexes tertiaires certifiés de province, découvrez notre empreinte durable.
            </p>
          </Reveal>
        </div>

        {/* Grid of completed projects */}
        <div className="grid md:grid-cols-2 gap-8">
          {pastProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.1}>
              <div className="group bg-white border border-[#E0D8CC] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#1A1612]/20 group-hover:bg-[#1A1612]/10 transition-all duration-500" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="flex items-center gap-1.5 bg-[#1A1612] text-[#F7F5F2] text-[10px] tracking-widest uppercase px-3 py-1 font-medium shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C9A86C]" />
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#C9A86C] font-medium mb-4">{project.type}</p>
                  <div className="flex flex-wrap gap-y-2 gap-x-6 pt-4 border-t border-[#F0EBE0] text-sm text-[#6B5A40]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C9A86C]" />
                      {project.location}
                    </span>
                    <span>·</span>
                    <span>Surface : {project.size}</span>
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
