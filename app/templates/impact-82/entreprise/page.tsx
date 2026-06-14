"use client"

import React from "react"
import Image from "next/image"
import { Building, Award, CheckCircle, Leaf, ShieldAlert } from "lucide-react"
import { TEAM, Reveal } from "../shared"

export default function EntreprisePage() {
  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section 1: History & Introduction */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Notre Histoire</p>
            <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#1A1612] leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Bâtir avec <em>ambition</em><br />et intégrité
            </h1>
            <p className="text-[#6B5A40] text-lg mt-6 font-light leading-relaxed">
              Fondé en 1989, Blueprint Developments s&apos;est imposé comme un acteur de référence de la promotion immobilière haut de gamme et institutionnelle en France. Notre force réside dans la maîtrise de l&apos;ensemble de la chaîne de valeur.
            </p>
            <p className="text-[#6B5A40] text-base mt-4 font-light leading-relaxed">
              De la recherche foncière à la livraison des programmes, nous associons rigueur technique, équilibre financier et audace architecturale pour livrer des immeubles à haute valeur d&apos;usage.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden shadow-lg border border-[#E0D8CC]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Blueprint office"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Section 2: BREEAM/HQE & Sustainability */}
        <div className="bg-[#1A1612] text-[#F7F5F2] p-8 md:p-16 mb-28 border border-[#3A3020]">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <Reveal>
              <div className="flex items-center gap-3 text-[#C9A86C] mb-4">
                <Leaf className="w-5 h-5" />
                <span className="text-xs tracking-[0.25em] uppercase font-semibold">Engagement Écologique</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-normal font-serif text-white mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Certifications <em>BREEAM & HQE</em>
              </h2>
              <p className="text-[#8A7860] font-light leading-relaxed mb-6">
                Parce que l&apos;immobilier d&apos;aujourd&apos;hui façonne le monde de demain, 100% de nos développements tertiaires et résidentiels intègrent les exigences environnementales les plus strictes.
              </p>
              <div className="space-y-4">
                {[
                  "Double Certification BREEAM (Excellent ou Very Good) et HQE (Très Performant) systématique.",
                  "Conformité avec les normes E+C- (Énergie positive & Réduction carbone) anticipant la réglementation.",
                  "Valorisation de la biodiversité urbaine via des toits végétalisés et des îlots de fraîcheur.",
                  "Emploi prioritaire de matériaux biosourcés et locaux à faible empreinte carbone."
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#C8B89A] font-light">
                    <CheckCircle className="w-4 h-4 text-[#C9A86C] mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-[#231E14] p-8 border border-[#3A3020]">
                <h3 className="text-xl font-normal font-serif text-[#C9A86C] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Notre Bilan ESG</h3>
                <div className="space-y-6 pt-4">
                  <div>
                    <div className="text-4xl font-light text-white mb-1 font-serif">A+</div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Notation globale extra-financière</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light text-white mb-1 font-serif">-30%</div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Émissions CO₂ par m² moyen (vs standard)</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light text-white mb-1 font-serif">100%</div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Projets certifiés durables depuis 2018</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Section 3: Leadership Team */}
        <div>
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Gouvernance</p>
              <h2 className="text-3xl md:text-4xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Notre <em>équipe dirigeante</em>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="group bg-white border border-[#E0D8CC] p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-[#F0EBE0]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C9A86C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#C9A86C] font-medium mb-1">{member.title}</p>
                  <p className="text-xs text-[#8A7860]">{member.exp}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
