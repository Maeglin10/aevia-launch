// @ts-nocheck
"use client";

import { ArrowRight } from "lucide-react";
import { NODES, Reveal } from "../shared";

export default function SolutionsPage() {
  return (
    <div className="py-20 bg-[#05060a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="mb-20 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            The <span className="text-emerald-500">Solutions.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {NODES.map((node, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 transition-all rounded-2xl p-8 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <div className="text-emerald-500">{node.icon}</div>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white italic">
                    {node.title}
                  </h3>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed mb-10">
                    {node.desc}
                  </p>
                </div>
                <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 group-hover:text-white transition-colors flex items-center gap-2">
                  View_Documentation <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
