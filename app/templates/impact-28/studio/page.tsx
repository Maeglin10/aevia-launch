"use client"

import Image from "next/image"
import { Reveal, team } from "../shared"

export default function StudioPage() {
  return (
    <div className="pt-32 min-h-screen px-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-black pb-8 mb-12">
        <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Our Convictions</div>
        <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ATELIER & MANIFESTO
        </h1>
      </div>

      {/* Tenets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            t: "HONEST MATERIALS",
            desc: "We work with raw concrete, steel, and industrial glass. We refuse to hide the integrity of materials behind plasterboard or paint."
          },
          {
            t: "STRUCTURAL TRUTH",
            desc: "The columns, slabs, and shear walls that hold the building up are the architecture itself. Form follows structure."
          },
          {
            t: "MONOLITHIC GEOMETRY",
            desc: "Mass, weight, and light create spatial meaning. We build block-like forms that capture the shifting paths of natural light."
          },
          {
            t: "ENDURING PURPOSE",
            desc: "A structure should survive generations. We build with permanent textures that require zero maintenance and age gracefully."
          }
        ].map((tenet, i) => (
          <div key={tenet.t} className="border-4 border-black p-6 bg-white">
            <span className="font-mono text-xs text-gray-400 block mb-4">TENET_0{i + 1}</span>
            <h3 className="font-black text-xl uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{tenet.t}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{tenet.desc}</p>
          </div>
        ))}
      </div>

      {/* Philosophy & Timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <h2 className="font-black text-4xl uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            FOUNDED IN PARIS, 2008.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Atelier Brunel was founded by Viktor Brunel in Paris with a simple commitment: to return architecture to its raw, structural roots. Rejecting the glass-and-plasterboard standards of commercial offices, the studio pioneered raw concrete formulations suited for both residential and institutional buildings.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, the office comprises 24 architects, engineers, and material scientists, working from three ateliers in Paris, Lyon, and Marseille. We maintain our own aggregate testing facility to ensure concrete composition complies with structural and thermal requirements.
          </p>
        </div>

        <div className="lg:col-span-7 border-l-4 border-black pl-8 lg:pl-12 space-y-8">
          <h3 className="font-black text-3xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            STUDIO TIMELINE
          </h3>

          <div className="space-y-6">
            {[
              { y: "2008", t: "Atelier Founded", d: "Viktor Brunel establishes the office in the 10th Arrondissement of Paris." },
              { y: "2013", t: "First Major Public Commission", d: "Awarded contract for the Lyon Industrial Heritage Silos refurbishment." },
              { y: "2017", t: "National Brutalist Award", d: "Winner of the Grand Prix d'Architecture for the Concrete Chapel in Marseille." },
              { y: "2021", t: "Research Laboratory", d: "Launches the 'Material Truth' research program investigating zero-carbon structural concrete." },
              { y: "2024", t: "140+ Built Projects", d: "Celebrating 16 years of honest structures and expansion to public masterplanning." }
            ].map((step) => (
              <div key={step.y} className="relative">
                <div className="absolute -left-[45px] top-1.5 w-[22px] h-[22px] border-4 border-black bg-white rounded-none animate-pulse" />
                <span className="font-black text-xl text-black block leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.y}</span>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{step.t}</h4>
                <p className="text-gray-500 text-xs leading-relaxed max-w-md">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Team bios */}
      <div className="border-t-4 border-black pt-12">
        <h3 className="font-black text-4xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ATELIER PARTNERS & DIRECTORS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="border-4 border-black p-4 bg-white">
              <div className="aspect-square relative w-full mb-4 overflow-hidden border-2 border-black">
                <Image 
                  src={m.img} 
                  alt={m.name}
                  fill
                  className="object-cover grayscale"
                />
              </div>
              <h4 className="font-black text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.name}</h4>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{m.role}</span>
              <p className="text-gray-500 text-xs leading-relaxed mt-3 border-t border-black/10 pt-3">
                Over 10 years of experience managing complex concrete structures and structural detailing.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
