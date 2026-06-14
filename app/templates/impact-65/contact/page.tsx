"use client";

import { useState } from "react";
import { Reveal, GridBackground } from "../shared";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", project: "aerospace", spec: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-screen py-24 px-6 relative">
      <GridBackground />
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="border-b border-white/5 pb-16 mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] block mb-6">Partnership Portal</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[1.15] pb-4 text-white italic">
              Get <br /> <span className="font-light not-italic opacity-20 text-white">In Touch.</span>
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Form */}
          <Reveal>
            <div className="bg-white/[0.01] border border-white/5 p-12 rounded-lg">
              {sent ? (
                <div className="text-center py-16">
                  <span className="text-[#0070f3] text-4xl block mb-6 font-black italic">NOMINAL</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">Request Transmitted</h3>
                  <p className="text-sm font-light italic leading-relaxed opacity-60">
                    Our materials scientists and engineers will review your request and contact you within 24 hours with custom carbon fiber layout recommendations.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">YOUR NAME</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="bg-[#050505] border border-white/10 p-4 rounded text-white font-bold text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">EMAIL ADDRESS</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="bg-[#050505] border border-white/10 p-4 rounded text-white font-bold text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">PROJECT INDUSTRY</label>
                    <select
                      value={form.project}
                      onChange={e => setForm({ ...form, project: e.target.value })}
                      className="bg-[#050505] border border-white/10 p-4 rounded text-white font-bold text-sm uppercase"
                    >
                      <option value="aerospace">Aerospace & Orbital</option>
                      <option value="motorsport">Formula 1 & Motorsport</option>
                      <option value="marine">Marine & Hydrofoil</option>
                      <option value="other">Bespoke Structural</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">STRUCTURAL SPECIFICATIONS / STRESS LIMITS</label>
                    <textarea
                      rows={4}
                      value={form.spec}
                      onChange={e => setForm({ ...form, spec: e.target.value })}
                      className="bg-[#050505] border border-white/10 p-4 rounded text-white font-bold text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-white text-black hover:bg-[#0070f3] hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em] italic -skew-x-12"
                  >
                    Transmit Request
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.2}>
            <div className="space-y-16">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] mb-4">Laboratory Audits</h3>
                <p className="text-sm font-light italic leading-relaxed mb-6">
                  We invite engineering teams to tour our carbon composite research facilities. Technical evaluations can be scheduled via request.
                </p>
                <div className="text-white text-sm font-bold tracking-widest uppercase italic">
                  +33 1 44 62 87 00
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] mb-4">Location</h3>
                <p className="text-sm font-light italic leading-relaxed">
                  Headquarters & Advanced Composite Testing Labs.<br />
                  75010 Paris, France.
                </p>
                <p className="text-xs font-light italic leading-relaxed mt-4 opacity-50">
                  Adresse physique communiquée sur simple demande à contact@aevia.io.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}
