"use client";
// @ts-nocheck

import { motion } from "framer-motion";
import { Radio, Shield, Globe, Terminal } from "lucide-react";
import { Reveal, GridBackground } from "../shared";

export default function ConstellationPage() {
  return (
    <div className="py-20 bg-[#050810]">
      <GridBackground />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <Reveal className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-500 block mb-10 italic">
            Orbital Assets
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
            Constellation <br />{" "}
            <span className="not-italic font-light opacity-10">Network.</span>
          </h1>
          <p className="text-xl text-white/30 italic font-light leading-relaxed">
            Real-time tracking of LEO, MEO and geostationary sensory payloads.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {[
            {
              orbit: "LEO // Orbit_01",
              sats: "842 Active",
              latency: "8-12ms",
              desc: "Low Earth Orbit constellation for high-density multi-spectral imaging and immediate updates.",
            },
            {
              orbit: "MEO // Orbit_02",
              sats: "320 Active",
              latency: "25-35ms",
              desc: "Medium Earth Orbit assets offering wide-area continuous coverage and high bandwidth relays.",
            },
            {
              orbit: "GEO // Custom Nodes",
              sats: "80 Active",
              latency: "220ms",
              desc: "Dedicated geostationary command centers for continuous observation of key industrial hubs.",
            },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-cyan-500/10">
                  <Radio className="w-24 h-24 animate-pulse" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="text-xs font-black text-cyan-500 tracking-widest uppercase italic border-b border-white/5 pb-4">
                    {item.orbit}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mb-1">
                        Active Payloads
                      </span>
                      <span className="text-lg font-black text-white italic">
                        {item.sats}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mb-1">
                        Ping Latency
                      </span>
                      <span className="text-lg font-black text-white italic">
                        {item.latency}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* MAP PLACEHOLDER */}
        <Reveal>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#0a0c14] p-1 group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] animate-pulse" />
            <div className="relative h-full w-full border border-white/5 bg-[#050810] p-12 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-cyan-500 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                    REALTIME_CONSTELLATION_PASSAGE_MAP
                  </span>
                </div>
                <span className="text-[9px] font-bold text-cyan-500/40">
                  SECURE UPLINK 01 // SAT_READY
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center relative my-10">
                <div className="w-[60%] h-[60%] border border-cyan-500/10 rounded-full relative">
                  <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]" />
                  <div className="absolute bottom-[30%] right-[10%] w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,1)] animate-ping" />
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span>Passage Node Tracker</span>
                <span>Active Sector: North Atlantic</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
