"use client";

import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Reveal, ParallaxImg } from "./shared";

export default function SymmetryStudioPage() {
  const basePath = "/templates/impact-80";

  return (
    <main>
      {/* ── HERO ──────────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative z-10">
            <Reveal>
              <div className="flex items-center gap-8 mb-12 opacity-20">
                <div className="w-16 h-[1px] bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black italic">
                  Form Follows Light
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[1.15] text-[#1a1a1a] mb-16 uppercase pb-4">
                Pure <br />{" "}
                <span className="font-bold italic opacity-10">Volume.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-16">
                <p className="text-2xl text-black/40 font-light max-w-lg leading-relaxed italic">
                  Architectural interventions that harmonize human ritual with the
                  absolute geometry of nature.
                </p>
                <div className="flex flex-wrap gap-12">
                  <Link href={`${basePath}/works`}>
                    <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl">
                      Examine Portals
                    </button>
                  </Link>
                  <Link href={`${basePath}/identity`}>
                    <button className="px-16 py-6 border border-black/10 text-black/30 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-4">
                      <Compass className="w-4 h-4" /> View Map Of Silence
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5} y={0}>
            <div className="relative aspect-[4/5] bg-black/5 overflow-hidden group">
              <ParallaxImg
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                alt="Architectural Minimal"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
          <span>STRUCTURE / LIGHT / MATERIALITY / VOID</span>
          <span>EST. 2012</span>
        </div>
      </section>
    </main>
  );
}
