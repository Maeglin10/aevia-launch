"use client"

import React from "react"
import {
  clientCity,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
import Image from "next/image"
import { MapPin, CheckCircle } from "lucide-react"
import { PROJECTS, Reveal } from "../shared"

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function RealisationsPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  // Get completed projects from common PROJECTS (progress === 100)
  const sharedCompleted = PROJECTS.filter(p => p.progress === 100)

  // Extra past signature projects for display
  const pastProjects = [
    ...sharedCompleted,
    {
      name: "Hôtel Particulier Victor Hugo",
      type: "Résidentiel d'exception",
      location: (clientCity(sessionData) ?? "Paris"),
      size: "1 200 m²",
      status: "Livré 2023",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
    },
    {
      name: "Technopole " + (clientCity(sessionData) ?? "Lyon") + "-Nord",
      type: "Bureaux & Laboratoires",
      location: (clientCity(sessionData) ?? "Lyon"),
      size: "12 500 m²",
      status: "Livré 2022",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
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
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-dvh">
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
