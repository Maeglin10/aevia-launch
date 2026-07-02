"use client";
// @ts-nocheck

import { useState } from "react";
import { Mail, Globe, MapPin, Check } from "lucide-react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="py-20 bg-[#08080c] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Col */}
          <div className="lg:col-span-5 space-y-12 text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-500 mb-6 block">
                Connect
              </span>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-[1.15] mb-6">
                Terminal <br /> <span className="text-rose-500">Contact.</span>
              </h3>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest leading-relaxed italic mb-10">
                Reach out for enterprise CDNs, custom partnerships, or creator inquiries.
              </p>
            </Reveal>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <Mail className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white/60 mb-1">Direct Message</h4>
                  <a href="mailto:valentinmilliand@aevia.services" className="text-white hover:text-rose-500 transition-colors">valentinmilliand@aevia.services</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <MapPin className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white/60 mb-1">HQ Address</h4>
                  <span className="text-white">Bourg-en-Bresse, France</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <Globe className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white/60 mb-1">Global Servers</h4>
                  <span className="text-white">San Francisco // Tokyo // Berlin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Col */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-2xl p-8 md:p-12 shadow-sm">
            <Reveal>
              {!formSubmitted ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">First Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Last Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Message</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full bg-[#08080c] border border-white/5 rounded-lg px-4 py-3 text-xs outline-none focus:border-rose-500 transition-all text-white resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer"
                  >
                    SEND_MESSAGE
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-rose-600/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black uppercase text-white">Transmission Successful</h4>
                  <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed italic">
                    Your transmission has been securely routed to valentinmilliand@aevia.services. Our communications department will review it.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
