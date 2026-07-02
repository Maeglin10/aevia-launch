"use client";
// @ts-nocheck

import { Activity, Globe, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../shared";

export default function IntelligencePage() {
  return (
    <div className="py-20 bg-[#050810]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-32 max-w-4xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-500 block mb-10 italic">
              Intelligence Engine
            </span>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
              Universal <br />{" "}
              <span className="not-italic font-light opacity-10">Analysis.</span>
            </h2>
            <p className="text-xl text-white/30 italic font-light leading-relaxed">
              Our proprietary AI models process petabytes of multi-spectral imagery
              every hour to detect sub-metric changes in infrastructure, maritime
              traffic, and environmental health.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {[
            {
              icon: Activity,
              t: "Real-time Delta",
              d: "Detecting changes in terrain and infrastructure with 99.9% accuracy.",
            },
            {
              icon: Globe,
              t: "Maritime Flow",
              d: "Global vessel tracking with predictive route analysis and port optimization.",
            },
            {
              icon: Shield,
              t: "Asset Integrity",
              d: "High-frequency monitoring for industrial hubs and remote energy assets.",
            },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-16 bg-[#050810] group hover:bg-cyan-500 transition-all duration-700 cursor-crosshair">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-black group-hover:border-black transition-all duration-700 shadow-xl">
                  <item.icon className="w-7 h-7 text-cyan-500" />
                </div>
                <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-black">
                  {item.t}
                </h3>
                <p className="text-white/20 text-sm font-light italic leading-relaxed mb-12 group-hover:text-black/60 transition-colors">
                  {item.d}
                </p>
                <Link
                  href="/templates/impact-75/contact"
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-black"
                >
                  Examine Protocol <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
