"use client";

import React, { useState } from "react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", model: "Chronos 01", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0a0c10] text-[#a0a0a0] min-h-screen pb-24">
      <section className="py-20 max-w-[800px] mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9a96e] mb-6 block">
            Acquisition Registry
          </span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 mb-16 italic text-white">
            Request <br />
            <span className="font-bold not-italic opacity-30">Allocation.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border border-white/5 bg-white/[0.01] p-10 md:p-16">
            {submitted ? (
              <div className="text-center py-20 space-y-6">
                <div className="w-16 h-16 border-2 border-[#c9a96e] mx-auto flex items-center justify-center text-[#c9a96e] font-black text-xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white italic">
                  Inquiry Registered
                </h3>
                <p className="text-sm font-light text-white/40 leading-relaxed italic max-w-sm mx-auto">
                  Your interest in Zenith Watch has been logged. An Atelier representative will contact you via secure channels.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">
                      YOUR FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white text-sm font-light focus:outline-none focus:border-[#c9a96e] transition-all"
                      placeholder="e.g. Jean Dupont"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white text-sm font-light focus:outline-none focus:border-[#c9a96e] transition-all"
                      placeholder="e.g. jean@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">
                    TIMEPIECE OF INTEREST
                  </label>
                  <select
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    className="w-full bg-black border border-white/10 px-6 py-4 text-white text-sm font-light focus:outline-none focus:border-[#c9a96e] transition-all"
                  >
                    <option value="Chronos 01">The Chronos 01 — Rose Gold Edition</option>
                    <option value="Deep Sea Master">Deep Sea Master — Titanium / Ceramic</option>
                    <option value="Lunar Phase">Lunar Phase — Platinum / Leather</option>
                    <option value="Other">Bespoke Custom Commission</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block">
                    QUALIFICATION NOTES
                  </label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white text-sm font-light focus:outline-none focus:border-[#c9a96e] transition-all"
                    placeholder="Describe any custom engravings or sizing requirements."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#c9a96e] transition-all duration-700"
                >
                  Submit Registry Request
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
