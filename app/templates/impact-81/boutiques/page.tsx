"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { BOUTIQUES, Reveal } from "../shared";

export default function BoutiquesPage() {
  return (
    <section className="py-24 bg-[#0A0A08] min-h-dvh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nos boutiques</p>
            <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Nous retrouver<br /><em>en boutique</em>
            </h1>
            <p className="text-[#A0988A] leading-relaxed">
              Retrouvez tous nos numéros, nos objets éditoriaux et nos collaborations exclusives dans nos boutiques à travers le monde.
            </p>
          </Reveal>
          <div className="space-y-0 border-t border-[#2A2A20]">
            {BOUTIQUES.map((b, i) => (
              <Reveal key={b.city} delay={i * 0.08}>
                <div className="py-8 border-b border-[#2A2A20] group cursor-pointer hover:pl-4 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-light mb-2 group-hover:text-[#C9A86C] transition-colors duration-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{b.city}</h3>
                      <p className="text-sm text-[#6A6058] mb-1">{b.address}</p>
                      <p className="text-xs text-[#3A3028]">{b.hours}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C9A86C] opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
