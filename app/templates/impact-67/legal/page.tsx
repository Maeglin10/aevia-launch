"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <section className="py-20 bg-[#050505] min-h-[70vh]">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="border-b border-white/5 pb-10 mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-6 block">
              Information Network
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase italic">
              Regulatory <br /> <span className="text-rose-600">Mentions.</span>
            </h2>
          </div>

          <div className="space-y-12 text-white/60 leading-relaxed text-sm font-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600">01 // Publisher</div>
              <div className="md:col-span-2">
                <p className="font-bold text-white uppercase mb-2">Valentin Milliand</p>
                <p>Propriétaire du service Aevia WS.</p>
                <p className="mt-2 text-white/40 italic">Adresse physique communiquée sur simple demande à contact@aevia.io.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600">02 // Registration</div>
              <div className="md:col-span-2 space-y-2">
                <p><span className="font-bold text-white">SIREN :</span> 852 546 225</p>
                <p><span className="font-bold text-white">RCS :</span> Bourg-en-Bresse</p>
                <p><span className="font-bold text-white">Régime :</span> Micro-entrepreneur (TVA non applicable, art. 293 B du CGI).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600">03 // Hosting</div>
              <div className="md:col-span-2">
                <p className="font-bold text-white uppercase mb-2">Google Firebase App Hosting</p>
                <p>Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600">04 // Contact</div>
              <div className="md:col-span-2">
                <p className="mb-2">Pour toute question ou réclamation relative au site :</p>
                <p className="font-bold text-white">contact@aevia.io</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
