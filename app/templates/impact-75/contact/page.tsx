// @ts-nocheck
"use client";

import { useState } from "react";
import { Send, Terminal, Key } from "lucide-react";
import { Reveal, GridBackground } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="py-20 bg-white text-black text-center relative overflow-hidden min-h-[80vh] flex items-center justify-center">
      <GridBackground />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12">
        UPLINK UPLINK UPLINK UPLINK UPLINK
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full text-left">
        <Reveal>
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-600 block mb-4 italic">
              LAUNCH PROFILE REQUEST
            </span>
            <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter leading-[1.15] mb-6 italic pb-4">
              Initiate <br />{" "}
              <span className="font-light not-italic opacity-20 text-black">
                Mission.
              </span>
            </h2>
            <p className="text-lg text-black/50 font-light leading-relaxed italic max-w-xl">
              Transform your situational awareness with high-fidelity orbital
              data. Request custom constellation parameters below.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-[#f5f7fa] border border-black/5 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <h3 className="text-3xl font-black uppercase text-black italic">
                  Uplink established
                </h3>
                <p className="text-sm text-black/50 italic leading-relaxed max-w-md mx-auto">
                  Your mission profile request has been received. Our launch ops team will contact you via secure terminal channels.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                      Organization
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black/5 border border-black/10 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-cyan-500 text-black transition-all uppercase tracking-widest"
                      placeholder="e.g. AEVIA ORBITAL"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                      Operator Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-black/5 border border-black/10 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-cyan-500 text-black transition-all uppercase tracking-widest"
                      placeholder="e.g. contact@aevia.io"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                    Orbit Type
                  </label>
                  <select className="w-full bg-[#f0f2f5] border border-black/10 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-cyan-500 text-black transition-all uppercase tracking-widest">
                    <option value="leo">Low Earth Orbit // LEO</option>
                    <option value="meo">Medium Earth Orbit // MEO</option>
                    <option value="geo">Geostationary // Custom Nodes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                    Mission Payload Parameters
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-black/5 border border-black/10 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-cyan-500 text-black transition-all uppercase tracking-widest"
                    placeholder="Specify target areas, required latency limits, spectral bands, etc..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-cyan-500 hover:text-black transition-all duration-700 italic shadow-2xl flex items-center justify-center gap-3"
                >
                  Transmit Launch Profile <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
