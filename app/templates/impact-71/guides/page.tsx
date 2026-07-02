"use client";
// @ts-nocheck

import Image from "next/image";
import { TEACHERS, Reveal } from "../shared";

export default function GuidesPage() {
  return (
    <div className="py-20 bg-[#faf9f6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block">
            Lineage Keepers
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic text-[#33302c] leading-[1.15] pb-4">
            Your <span className="text-[#c9a84c]">Guides.</span>
          </h2>
          <p className="max-w-md mx-auto text-sm text-stone-400 font-bold uppercase tracking-widest italic mt-4">
            Meet the experienced practitioners guiding your evolution.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {TEACHERS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group text-center bg-white border border-stone-200/50 rounded-3xl p-6 shadow-sm">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-8 border border-stone-100">
                  <Image
                    src={t.img}
                    alt={t.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
                </div>
                <h4 className="text-2xl font-light tracking-tight text-[#33302c] uppercase italic mb-2">
                  {t.name}
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-4">
                  {t.specialty}
                </p>
                <div className="w-12 h-[1px] bg-stone-200 mx-auto mb-4" />
                <p className="text-[11px] text-stone-400 uppercase tracking-widest font-normal leading-relaxed italic">
                  Dedicated to sharing traditional, breath-centered yoga with anatomical safety. Over 1,000 hours of training in Mysore and Rishikesh.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
