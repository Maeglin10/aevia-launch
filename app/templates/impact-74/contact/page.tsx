// @ts-nocheck
"use client";

import { useState } from "react";
import { ShieldCheck, Send, Terminal, Key } from "lucide-react";
import { Reveal, MagneticBtn } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="py-20 bg-[#05060a]">
      <div className="max-w-[1000px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-emerald-500 mb-6 block">
            SECURE CHANNEL // ONBOARDING
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            Initiate_Audit.
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto uppercase tracking-widest leading-relaxed mt-4">
            Encrypt your inquiry through our defensive gateway. A security officer will contact you on a verified channel.
          </p>
        </Reveal>

        <Reveal>
          <div className="bg-[#0a0c14] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none">
              <Key className="w-48 h-48" />
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-600/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white tracking-wide">
                  Transmission Secure
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Payload encrypted and queued for neural classification. Estimated response latency: &lt; 350ms.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-8 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Entity_Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. AEVIA LABS"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-emerald-600 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Secure_Endpoint (Email)
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. contact@aevia.io"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-emerald-600 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Infrastructure_Tier
                  </label>
                  <select className="w-full bg-[#05060a] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-emerald-600 text-white transition-all uppercase tracking-widest">
                    <option value="standard">Standard // $1,400</option>
                    <option value="institutional">Institutional // $8,500</option>
                    <option value="sovereign">Sovereign // Custom Briefing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Encrypted_Payload (Message)
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your perimeter assets and key security challenges..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-emerald-600 text-white transition-all uppercase tracking-widest"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5" /> PGP_KEY_ACTIVE
                  </div>
                  <MagneticBtn
                    type="submit"
                    className="px-10 py-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3"
                  >
                    Transmit_Payload <Send className="w-3.5 h-3.5" />
                  </MagneticBtn>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
