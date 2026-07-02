"use client";

import React from "react";
import { Mail, Clock, MapPin, Sparkles } from "lucide-react";
import { Reveal } from "../shared";

export default function ContactPage() {
  return (
    <section className="py-20 bg-[#050005] min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="border-b border-white/5 pb-10 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Network Nodes</span>
            <h2 className="text-6xl md:text-[8vw] font-light uppercase tracking-tighter text-white leading-none italic">
              Global <span className="font-bold not-italic">Nodes.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <Reveal>
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#ff00ff] mb-6 italic">Active Coordinations</h3>
              <p className="text-white/40 leading-relaxed italic font-light mb-8">
                For administrative inquiries, VIP booking coordination, or media license requests.
              </p>
              <div className="space-y-8">
                <div className="flex gap-6 items-center pl-6 border-l border-white/5 hover:border-[#ff00ff] transition-all">
                  <Mail className="w-5 h-5 text-[#ff00ff] flex-shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">Secure Routing Address</div>
                    <div className="text-sm font-bold text-white/70 mt-1">valentinmilliand@aevia.services</div>
                  </div>
                </div>
                <div className="flex gap-6 items-center pl-6 border-l border-white/5 hover:border-[#ff00ff] transition-all">
                  <Clock className="w-5 h-5 text-[#ff00ff] flex-shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">Node Availability</div>
                    <div className="text-sm font-bold text-white/70 mt-1">21:00 UTC - 06:00 UTC // 7 DAYS</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-10">
            <Reveal>
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#ff00ff] mb-6 italic">Physical Gateways</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { city: "Berlin Node", coord: "Lat: 52.520 // Lon: 13.404" },
                  { city: "Ibiza Retreat", coord: "Lat: 38.906 // Lon: 1.420" },
                  { city: "Tokyo Node", coord: "Lat: 35.676 // Lon: 139.650" },
                  { city: "Miami Penthouse", coord: "Lat: 25.761 // Lon: -80.191" },
                ].map((node, i) => (
                  <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-[#ff00ff]/30 transition-all text-left">
                    <MapPin className="w-5 h-5 text-[#ff00ff] mb-4" />
                    <div className="text-sm font-bold text-white uppercase">{node.city}</div>
                    <div className="text-[9px] font-bold text-white/30 mt-2">{node.coord}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
