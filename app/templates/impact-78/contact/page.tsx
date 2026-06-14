// @ts-nocheck
"use client";

import { useState } from "react";
import { Send, Terminal } from "lucide-react";
import { Reveal, MagneticBtn } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="py-20 bg-[#0c0a09]">
      <div className="max-w-[1000px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-orange-500 mb-6 block">
            LAB CHANNEL // ROASTERY ORDERS
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            Shop_Beans.
          </h2>
          <p className="text-sm text-[#e7e5e4]/40 max-w-md mx-auto uppercase tracking-widest leading-relaxed mt-4">
            Order single origin micro-lots or request wholesale partnerships with our roasting lab.
          </p>
        </Reveal>

        <Reveal>
          <div className="bg-white/[0.01] border border-white/5 rounded-none p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <h3 className="text-2xl font-black uppercase text-white tracking-wide">
                  Order Registered
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Your request has been received. Our roasting master will reach back to confirm your order and shipping details.
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
                      Contact Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Valentin Milliand"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-orange-500 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Contact Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. contact@aevia.io"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-orange-500 text-white transition-all uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Sourcing Micro-lot Selection
                  </label>
                  <select className="w-full bg-[#0c0a09] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-orange-500 text-white transition-all uppercase tracking-widest">
                    <option value="void-brew">VOID_BREW // Ethiopia, Yirgacheffe</option>
                    <option value="solar-flare">SOLAR_FLARE // Colombia, Huila</option>
                    <option value="lunar-roast">LUNAR_ROAST // Sumatra, Mandheling</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Order details or Wholesale Request
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Specify bag quantities, grind preferences (whole bean, espresso, filter), or details about your business for wholesale pricing..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-orange-500 text-white transition-all uppercase tracking-widest"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5" /> SECURE_UPLINK_0x78
                  </div>
                  <MagneticBtn
                    type="submit"
                    className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3"
                  >
                    Place Roastery Request <Send className="w-3.5 h-3.5" />
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
