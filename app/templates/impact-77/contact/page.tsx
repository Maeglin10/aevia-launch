"use client";
// @ts-nocheck

import { useState } from "react";
import { Send, Terminal } from "lucide-react";
import { Reveal, MagneticBtn } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="py-20 bg-[#050505]">
      <div className="max-w-[1000px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-500 mb-6 block">
            CONCIERGE CHANNEL // PRIVATE VIEWING
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            Reserve_Piece.
          </h2>
          <p className="text-sm text-[#d4d4d8]/40 max-w-md mx-auto uppercase tracking-widest leading-relaxed mt-4">
            Submit your reservation request to our horology concierge desk. Each piece is serial numbered.
          </p>
        </Reveal>

        <Reveal>
          <div className="bg-white/[0.01] border border-white/5 rounded-none p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <h3 className="text-2xl font-black uppercase text-white tracking-wide">
                  Reservation Logged
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Merci, nous vous répondrons sous 24h.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Client Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Valentin Milliand"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-500 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Client Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. valentinmilliand@aevia.services"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-500 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Target Collection Unit
                  </label>
                  <select className="w-full bg-[#050505] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-500 text-white transition-all uppercase tracking-widest">
                    <option value="aether-g1">AETHER_G1 // Celestial (€14,200)</option>
                    <option value="chrono-void">CHRONO_VOID // Dark Matter (€28,500)</option>
                    <option value="lumina-royal">LUMINA_ROYAL // Ecliptic (€42,000)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Bespoke Request Details
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Specify bespoke engraving requirements, luxury presentation boxes, or personal calendar booking dates..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-500 text-white transition-all uppercase tracking-widest"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5" /> SECURE_UPLINK_0x77
                  </div>
                  <MagneticBtn
                    type="submit"
                    className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-stone-200 transition-all flex items-center gap-3"
                  >
                    Transmit Request <Send className="w-3.5 h-3.5" />
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
