"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../shared";

export default function MaisonsPage() {
  const maisons = [
    "Maison Leroux",
    "Atelier Vidal",
    "Studio Beaumont",
    "Collectif Nuit",
    "Maison du Fil",
    "Atelier Blanc",
    "La Forge",
    "Studio Diaphane",
  ];

  return (
    <section className="py-24 bg-[#0E0E0C] min-h-dvh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Répertoire</p>
          <h1 className="text-4xl md:text-5xl font-light mb-14" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Les maisons <em>partenaires</em>
          </h1>
        </Reveal>
        <div className="space-y-0 border-t border-[#2A2A20]">
          {maisons.map((maison, i) => (
            <Reveal key={maison} delay={i * 0.04}>
              <div className="py-6 border-b border-[#2A2A20] flex items-center justify-between group cursor-pointer hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#3A3028]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-light group-hover:text-[#C9A86C] transition-colors duration-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{maison}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C9A86C] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
