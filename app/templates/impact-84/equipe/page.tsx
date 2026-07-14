"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, ArrowRight } from "lucide-react";
import { SPECIALISTS, NURSES, Reveal } from "../shared";

export default function EquipePage() {
  const basePath = "/templates/impact-84";

  return (
    <div className="min-h-dvh bg-[#0C0C0A] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;équipe médicale</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Nos <em>spécialistes</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Trois médecins spécialistes, deux infirmières coordinatrices et une équipe administrative dédiée. Une structure pensée pour offrir une prise en charge médicale de haut niveau dans un cadre confidentiel.
          </p>
        </Reveal>

        {/* Médecins */}
        <div className="space-y-px bg-[#2A2520] mb-20 border border-[#2A2520]">
          {SPECIALISTS.map((spec, i) => (
            <Reveal key={spec.name} delay={i * 0.08}>
              <div className="bg-[#0C0C0A] grid md:grid-cols-5 gap-0 border-b border-[#2A2520] last:border-b-0">
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden min-h-[300px]">
                  <Image src={spec.image} alt={spec.name} fill loading="lazy"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="md:col-span-3 p-10 md:p-14 flex flex-col justify-center">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A86C] mb-3">{spec.spec}</p>
                  <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{spec.name}</h2>
                  <p className="text-[#8A8278] text-xs mb-2">{spec.shortBio}</p>
                  <p className="text-[#5A5248] text-sm leading-relaxed mb-6">{spec.fullBio}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {spec.certifications.map(c => (
                      <span key={c} className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#C9A86C]" />{c}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-[#C9A86C] flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    {spec.experience}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Infirmières coordinatrices */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Équipe soignante</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Infirmières <em>coordinatrices</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-[#2A2520] mb-20 border border-[#2A2520]">
          {NURSES.map((n, i) => (
            <Reveal key={n.name} delay={i * 0.08}>
              <div className="bg-[#0C0C0A] flex gap-6 p-8 h-full">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={n.image} alt={n.name} fill loading="lazy" className="object-cover grayscale" />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{n.name}</h3>
                  <p className="text-[#C9A86C] text-xs uppercase tracking-wider mb-3">{n.role}</p>
                  <p className="text-[#5A5248] text-sm leading-relaxed">{n.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Certifications */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Accréditations & certifications</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-[#2A2520] mb-14 border border-[#2A2520]">
          {[
            { label: "Qualiopi", desc: "Certification qualité des actions de formation — Ministère du Travail" },
            { label: "COFRAC", desc: "Comité Français d'Accréditation — laboratoire d'analyses cliniques" },
            { label: "AMEC", desc: "Association de Médecine Esthétique Certifiée — membres actifs" },
          ].map((cert, i) => (
            <Reveal key={cert.label} delay={i * 0.07}>
              <div className="bg-[#0C0C0A] p-8 text-center h-full">
                <Award className="w-8 h-8 text-[#C9A86C] mx-auto mb-4" />
                <h3 className="text-lg font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{cert.label}</h3>
                <p className="text-xs text-[#5A5248] leading-relaxed">{cert.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center">
            <Link href={`${basePath}/rdv`}>
              <button type="button"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                Prendre rendez-vous <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
