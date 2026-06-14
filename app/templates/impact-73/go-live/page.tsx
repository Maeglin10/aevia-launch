// @ts-nocheck
"use client";

import { useState } from "react";
import { Radio, Shield, Terminal, Zap, Check } from "lucide-react";
import { Reveal } from "../shared";

export default function GoLivePage() {
  const [streamConfigured, setStreamConfigured] = useState(false);

  return (
    <div className="py-20 bg-[#08080c] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Instructions Col */}
          <div className="lg:col-span-5 space-y-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-500 mb-6 block">
                Broadcast Node
              </span>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-[1.15] mb-6">
                Broadcasting <br /> <span className="text-rose-500">Protocol.</span>
              </h3>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest leading-relaxed italic mb-10">
                Setup your RTMP or SRT stream credentials to broadcast globally in sub-second latency.
              </p>
            </Reveal>

            <div className="space-y-6 text-xs text-white/40 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <Zap className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white mb-1">Ultra-Low Latency</h4>
                  <p className="text-[9px] font-normal leading-normal lowercase tracking-normal">
                    SRT protocol deployment yields sub-80ms glass-to-glass latency globally.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <Shield className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white mb-1">Encrypted Ingest</h4>
                  <p className="text-[9px] font-normal leading-normal lowercase tracking-normal">
                    Secure handshake utilizing DTLS encryption keys prevents stream hijacking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Col */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-2xl p-8 md:p-12 shadow-sm">
            <Reveal>
              {!streamConfigured ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStreamConfigured(true);
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Stream Title</label>
                    <input
                      type="text"
                      required
                      placeholder="My Epic Stream // Coding chill beats"
                      className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Category / Tags</label>
                    <select className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white/60">
                      <option>Gaming</option>
                      <option>Tech & Coding</option>
                      <option>Music & Chill</option>
                      <option>Creative & Art</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Ingest Server Node</label>
                    <select className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white/60">
                      <option>Europe West (Paris) - RTMP</option>
                      <option>US East (Virginia) - SRT</option>
                      <option>Asia East (Tokyo) - SRT</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer"
                  >
                    GENERATE_INGEST_KEYS
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-rose-600/10 border border-rose-500/20 rounded-lg flex items-center justify-center text-rose-500">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black uppercase text-white">Ingest Keys Active</h4>
                  <div className="p-4 bg-black border border-white/5 rounded-lg font-mono text-xs text-white/60 space-y-4">
                    <div>
                      <span className="text-white/30 block text-[9px] uppercase tracking-widest mb-1">Server URL</span>
                      srt://ingest.streamhub.aevia.io:4242
                    </div>
                    <div>
                      <span className="text-white/30 block text-[9px] uppercase tracking-widest mb-1">Stream Key</span>
                      sh_live_8k_ff0192ea389bc72a01d
                    </div>
                  </div>
                  <button
                    onClick={() => setStreamConfigured(false)}
                    className="w-full py-4 border border-white/10 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    RESET_CREDENTIALS
                  </button>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
