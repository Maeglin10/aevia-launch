// @ts-nocheck
"use client";

import { Globe, Terminal, Database } from "lucide-react";
import { THREATS, Reveal } from "../shared";

export default function MonitoringPage() {
  return (
    <div className="py-20 bg-[#05060a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white pb-4">
              Threat <br />{" "}
              <span className="text-emerald-500 italic">Matrix.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Global monitoring of institutional perimeters. Real-time
            visualization of attempted breaches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* THREAT LIST */}
          <div className="lg:col-span-4 space-y-4">
            {THREATS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <div className="group bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 transition-all rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${t.intensity === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-orange-500"}`}
                      />
                      <span className="text-[10px] font-black uppercase text-white">
                        {t.type}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold text-white/20 uppercase">
                      {t.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                        Source: {t.source}
                      </div>
                      <div className="text-[10px] font-black text-white uppercase italic">
                        Target: {t.target}
                      </div>
                    </div>
                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                      ID_{t.id}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* MAP VISUALIZER */}
          <div className="lg:col-span-8">
            <Reveal className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#0a0c14] p-1 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] animate-pulse" />
              <div className="relative h-full w-full border border-white/5 bg-[#05060a] p-8 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">
                      GLOBAL_ATTACK_SURFACE_MONITOR
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full" />
                  </div>
                </div>

                {/* PSEUDO MAP */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-[80%] h-[80%] border border-white/5 rounded-full relative">
                    <div className="absolute inset-0 border border-white/5 rounded-full animate-[ping_4s_linear_infinite]" />
                    <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-[ping_6s_linear_infinite]" />

                    {/* NODES */}
                    <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />
                    <div className="absolute bottom-[40%] right-[20%] w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />
                    <div className="absolute top-[60%] right-[50%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse" />

                    {/* CONNECTION LINES */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line
                        x1="30%"
                        y1="20%"
                        x2="50%"
                        y2="60%"
                        stroke="rgba(16,185,129,0.2)"
                        strokeWidth="1"
                      />
                      <line
                        x1="80%"
                        y1="60%"
                        x2="50%"
                        y2="60%"
                        stroke="rgba(239,68,68,0.2)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      Aggregate Daily Blocks
                    </span>
                    <div className="text-4xl font-black text-white italic tabular-nums">
                      4.8M EVENTS
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
