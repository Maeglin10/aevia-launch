"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Award, ArrowRight } from "lucide-react";
import { TESTIMONIALS, Reveal } from "../shared";

export default function ResultatsPage() {
  const basePath = "/templates/impact-84";

  return (
    <div className="min-h-dvh bg-[#0C0C0A] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nos résultats</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Excellence <em>mesurée</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Chez Cypher Clinic, chaque résultat est documenté, photographié et mesuré objectivement. Nos statistiques sont issues du suivi de 2 400 patients sur 12 ans.
          </p>
        </Reveal>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-px bg-[#2A2520] mb-20 border border-[#2A2520]">
          {[
            ["98%", "Satisfaction", "Mesurée sur 2 400+ patients"],
            ["2 400+", "Patients", "Suivis depuis 2012"],
            ["12 ans", "Expertise", "D'excellence médicale"],
            ["6", "Technologies", "Protocoles propriétaires"],
          ].map(([val, label, sub], i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="bg-[#0C0C0A] p-10 text-center h-full">
                <div className="text-4xl font-light text-[#C9A86C] mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{val}</div>
                <div className="text-sm text-[#8A8278] mb-1">{label}</div>
                <div className="text-[10px] text-[#3A3028] uppercase tracking-widest">{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Clinic environment photos */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;environnement de soin</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Un cadre <em>médical d&apos;exception</em>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#2A2520] mb-20 border border-[#2A2520]">
          {[
            { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&fit=crop", alt: "Salle de traitement" },
            { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&fit=crop", alt: "Équipement médical" },
            { src: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800&q=80&fit=crop", alt: "Consultation" },
            { src: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&fit=crop", alt: "Technologie laser" },
            { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&fit=crop", alt: "Espace d'accueil" },
            { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&fit=crop", alt: "Salle de repos" },
          ].map((img, i) => (
            <Reveal key={img.src} delay={i * 0.05}>
              <div className="relative aspect-[4/3] overflow-hidden group">
                <Image src={img.src} alt={img.alt} fill loading="lazy" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#0C0C0A]/20 group-hover:bg-transparent transition-all duration-500" />
                <div className="absolute bottom-3 left-3 text-xs text-[#F0EBE0]/60 group-hover:text-[#F0EBE0] transition-colors duration-300">{img.alt}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Testimonials */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Paroles de patients</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Des résultats qui <em>parlent</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2520] mb-20 border border-[#2A2520]">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="bg-[#0C0C0A] p-8 flex flex-col h-full border border-[#2A2520]/50">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#C9A86C] text-[#C9A86C]" />
                  ))}
                </div>
                <p className="text-[#6A6058] leading-relaxed mb-6 italic flex-1" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "15px" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-[#1A1715] pt-4">
                  <div className="text-sm text-[#C9A86C]">{t.name} · {t.age}</div>
                  <div className="text-[10px] text-[#3A3028] mt-0.5 uppercase tracking-wide">{t.protocol}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Presse */}
        <Reveal>
          <div className="border border-[#2A2520] p-10 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-6">Presse & médias</p>
            <p className="text-2xl font-light text-[#8A8278] mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Vu dans <em>Elle</em>, <em>Marie Claire</em>, <em>Le Figaro Madame</em>
            </p>
            <p className="text-xs text-[#3A3028] max-w-md mx-auto leading-relaxed">
              Cypher Clinic est régulièrement cité dans la presse spécialisée et les magazines féminins de référence pour son approche scientifique de la médecine esthétique.
            </p>
          </div>
        </Reveal>

        <div className="text-center mt-14">
          <Link href={`${basePath}/rdv`}>
            <button type="button"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
