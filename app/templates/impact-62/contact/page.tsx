"use client";

import React, { useState } from "react";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { ARTISANS, Reveal } from "../shared";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", guests: "2", time: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0f0d0b] text-[#f5efe0] min-h-dvh pb-24">
      {/* ── ARTISANS PARTNERS ── */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal className="max-w-2xl mx-auto mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#b8860b] mb-6 block">
              The Terroir
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic mb-8 text-black leading-[1.15] pb-2">
              Artisan Partners.
            </h2>
            <p className="text-black/40 italic font-medium leading-relaxed">
              We source from 42 master producers, each representing a lifetime
              of dedication to a single ingredient.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {ARTISANS.map((a, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 border-l border-black/5 text-left group">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#b8860b] mb-4">
                    Location // {a.loc}
                  </div>
                  <h4 className="text-3xl font-light tracking-tighter uppercase italic mb-6 group-hover:text-[#b8860b] transition-colors text-black">
                    {a.name}
                  </h4>
                  <p className="text-black/40 text-sm font-bold uppercase tracking-widest mb-10">
                    {a.specialty}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESERVATION DIRECT FORM & LOCATIONS ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="text-left space-y-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#b8860b] block mb-6">
                Locations
              </span>
              <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter text-white leading-[1.15] pb-2">
                Atelier <br /><span className="italic text-[#b8860b]">Locations.</span>
              </h2>
            </Reveal>

            <div className="space-y-8 text-sm font-sans text-[#f5efe0]/50 leading-relaxed">
              <div className="border-l-2 border-[#b8860b]/30 pl-6 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#b8860b]" /> SATORI PARIS
                </h4>
                <p>18 Rue Troyon, 75017 Paris, France</p>
                <p>paris@satori-gastronomy.com · +33 1 42 68 90 20</p>
              </div>

              <div className="border-l-2 border-[#b8860b]/30 pl-6 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#b8860b]" /> SATORI TOKYO
                </h4>
                <p>5-chōme-2-1 Ginza, Chuo City, Tokyo 104-0061, Japan</p>
                <p>tokyo@satori-gastronomy.com · +81 3 5562 9010</p>
              </div>

              <div className="border-l-2 border-[#b8860b]/30 pl-6 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#b8860b]" /> SATORI GENEVA
                </h4>
                <p>Quai du Mont-Blanc 19, 1201 Geneva, Switzerland</p>
                <p>geneva@satori-gastronomy.com · +41 22 908 7050</p>
              </div>
            </div>
          </div>

          <div className="border border-[#b8860b]/20 bg-white/[0.01] p-10 md:p-16 text-left">
            <Reveal>
              <h3 className="text-2xl font-light uppercase tracking-tighter italic text-white mb-10">
                Direct Inquiry
              </h3>
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <span className="text-[#b8860b] text-xl font-bold block">✓ Inquiry Logged</span>
                  <p className="text-xs text-white/40 italic">
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#f5efe0]/40">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] text-white"
                        placeholder="Jean Martin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#f5efe0]/40">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] text-white"
                        placeholder="jean@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#f5efe0]/40">
                        GUESTS COUNT
                      </label>
                      <input
                        type="number"
                        required
                        value={formState.guests}
                        onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] text-white"
                        placeholder="2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#f5efe0]/40">
                        PREFERRED TIME
                      </label>
                      <input
                        type="time"
                        required
                        value={formState.time}
                        onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#f5efe0]/40">
                      SPECIAL REQUESTS
                    </label>
                    <textarea
                      value={formState.notes}
                      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] text-white h-24"
                      placeholder="Dietary specifications, seating preferences, etc."
                    />
                  </div>

                  <button type="submit" className="w-full py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer border-none">
                    Submit Reservation
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
