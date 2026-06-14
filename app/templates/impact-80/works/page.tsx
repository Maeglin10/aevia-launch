"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { PROJECTS, Reveal, ParallaxImg } from "../shared";

export default function WorksPage() {
  return (
    <section className="py-24 bg-[#fcfcfc] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="flex flex-col mb-20 pb-16 border-b border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6">
              Archive of Form
            </span>
            <h1 className="text-5xl md:text-8xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic pb-4">
              Silent <br />{" "}
              <span className="not-italic font-bold opacity-10">Spaces.</span>
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {PROJECTS.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group cursor-pointer">
                <div className="aspect-video relative mb-12 overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02]">
                  <ParallaxImg src={item.img} alt={item.name} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-1000" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-black/20 mb-2 italic">
                      Location: {item.loc}
                    </div>
                    <h3 className="text-3xl font-bold uppercase tracking-tighter text-black italic group-hover:translate-x-2 transition-transform duration-700">
                      {item.name}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
