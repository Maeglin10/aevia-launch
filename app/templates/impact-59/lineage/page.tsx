"use client";

import React from "react";
import Image from "next/image";
import { LINEAGE, Reveal } from "../shared";

export default function LineagePage() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] pb-24">
      {/* ==========================================
          4. THE LINEAGE (Team)
          ========================================== */}
      <section className="py-24 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3d7a5e] mb-6 block font-sans">
              The Custodians
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic font-serif">
              The Lineage.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {LINEAGE.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-10 shadow-2xl border-4 border-white group-hover:border-[#3d7a5e] transition-colors">
                    <div className="absolute inset-0 bg-[#3d7a5e] flex items-center justify-center text-4xl font-bold text-white uppercase italic font-serif">
                      {member.avatar}
                    </div>
                    <Image
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 2000000}?q=80&w=400&auto=format&fit=crop`}
                      alt={member.name}
                      fill
                      className="object-cover mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <h4 className="text-2xl font-bold uppercase tracking-tight mb-2 font-serif text-black">
                    {member.name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3d7a5e] mb-6 block font-sans">
                    {member.role}
                  </span>
                  <p className="text-sm text-black/50 leading-relaxed font-light italic max-w-xs mx-auto">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
