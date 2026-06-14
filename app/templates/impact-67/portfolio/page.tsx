"use client";

import React from "react";
import { Globe, Radio, ArrowUpRight } from "lucide-react";
import { ASSETS, Reveal } from "../shared";

export default function PortfolioPage() {
  const handleRequestScan = () => {
    window.dispatchEvent(new Event("open-vision-scan"));
  };

  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <Globe className="w-full h-full text-rose-600" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-600 mb-6 block">
              Asset Registry
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">
              Global Nodes.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ASSETS.map((asset, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-rose-600/40 transition-all rounded-none group text-left">
                <div className="flex justify-between items-start mb-10">
                  <h3 className="text-xl font-black uppercase tracking-widest text-rose-600 italic">
                    {asset.city}
                  </h3>
                  <Radio className="w-4 h-4 text-white/10 group-hover:text-rose-600 transition-colors" />
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                  {asset.name}
                </h4>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-10">
                  <span className="text-white/40">{asset.status}</span>
                  <span className="text-white italic">{asset.price}</span>
                </div>
                <button
                  onClick={handleRequestScan}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  REQUEST_SCAN <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
