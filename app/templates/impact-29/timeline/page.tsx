"use client"

import { Reveal, timeline } from "../shared"
import { Check } from "lucide-react"

export default function TimelinePage() {
  return (
    <div className="pt-32 min-h-screen px-6 pb-24 max-w-6xl mx-auto">
      <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
        <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/cat career_impact.md</span>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">EXPERIENCE_JOURNAL</h1>
      </div>

      <div className="relative border-l border-[#00F5D4]/20 pl-8 space-y-12">
        {timeline.map((item, idx) => (
          <div key={item.co} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[2.75rem] top-1.5 w-4 h-4 border-2 border-[#00F5D4] bg-[#0A0E1A] rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#00F5D4] rounded-full" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-none self-start font-mono">
                {item.year}
              </span>
              <h2 className="text-2xl font-bold text-white leading-none">
                {item.role} <span className="text-[#475569] text-base font-normal">@ {item.co}</span>
              </h2>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-3xl">
              {item.desc}
            </p>

            <div className="border border-[#00F5D4]/10 bg-[#0D1323] p-5 max-w-3xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block mb-3 font-mono">ARCHITECTURAL IMPACTS:</span>
              <ul className="space-y-3">
                {item.impact.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#E2E8F0] leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
