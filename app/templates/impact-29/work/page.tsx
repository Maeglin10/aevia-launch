"use client"

import { Reveal, projects } from "../shared"
import { GitBranch } from "lucide-react"

export default function WorkPage() {
  return (
    <div className="pt-32 min-h-dvh px-6 pb-24 max-w-6xl mx-auto">
      <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
        <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/git-log</span>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">PROJECT_CATALOGUE</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects Grid */}
        <div className="lg:col-span-7 space-y-6">
          {projects.map((p) => (
            <div key={p.name} className="border border-[#00F5D4]/20 bg-[#0D1323] p-6 hover:border-[#00F5D4]/60 transition-colors">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-2xl font-bold text-[#00F5D4]">{p.name}</h3>
                <div className="flex gap-4 text-xs font-semibold text-[#475569]">
                  <span>★ {p.stars} stars</span>
                  <span>⑂ {p.forks} forks</span>
                </div>
              </div>
              
              <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
                {p.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {p.stack.map((s) => (
                  <span key={s} className="border border-[#00F5D4]/10 text-xs text-[#00F5D4] px-2 py-0.5">{s}</span>
                ))}
              </div>

              {/* Quick Install Guide */}
              <div className="border-t border-[#00F5D4]/10 pt-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#475569] block mb-2">CLI INSTALLATION:</span>
                <pre className="bg-[#0A0E1A] border border-[#00F5D4]/10 text-xs p-3 text-[#E2E8F0] overflow-x-auto whitespace-pre font-mono">
                  {p.installation}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar metrics & guidelines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#00F5D4]/20 bg-[#0D1323] p-6 relative">
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] text-[#475569] font-mono">LIVE_STAT</span>
            </div>
            <h3 className="font-bold text-lg text-[#00F5D4] mb-4">// System Overview</h3>
            <div className="space-y-4 text-xs font-mono text-[#94A3B8]">
              <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                <span>TOTAL OPEN SOURCE STARS</span>
                <span className="text-white font-bold">6.3k+</span>
              </div>
              <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                <span>PRIMARY DEV STACK</span>
                <span className="text-white font-bold">Rust / TS / Go</span>
              </div>
              <div className="flex justify-between border-b border-[#00F5D4]/5 pb-2">
                <span>COMMITS IN 2026</span>
                <span className="text-white font-bold">1,842</span>
              </div>
              <div className="flex justify-between">
                <span>LICENSE TYPES</span>
                <span className="text-white font-bold">MIT / Apache 2.0</span>
              </div>
            </div>
          </div>

          <div className="border border-[#00F5D4]/10 p-6 text-xs text-[#475569] leading-relaxed">
            All repositories listed are kept fully open source and are hosted on public mirrors. Bug reports, RFC submissions, and package contributions are always welcome.
          </div>
        </div>
      </div>
    </div>
  )
}
