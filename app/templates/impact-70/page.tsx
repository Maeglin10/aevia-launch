"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music, Sparkles, Disc, Heart, MapPin, Play } from "lucide-react";
import { Reveal } from "./shared";

export default function VelvetHomePage() {
  const router = useRouter();

  return (
    <div className="bg-[#050005] text-[#d1d1d1] font-sans">
      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2400"
              alt="Club Atmosphere"
              fill
              className="object-cover opacity-20 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050005] via-transparent to-[#050005]/80" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-12 opacity-30">
                <div className="w-16 h-[1px] bg-[#ff00ff]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">The Pulse of Nocturnal Elegance</span>
                <div className="w-16 h-[1px] bg-[#ff00ff]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-8xl md:text-[14vw] font-light tracking-tighter leading-[1.15] text-white mb-16 uppercase italic pb-6">
                Ethereal <br /> <span className="font-bold not-italic">Rhythm.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                  Where the light fades and the soul awakens. An immersive sanctuary for the world's most discerning nocturnal explorers.
                </p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button
                    onClick={() => router.push("/templates/impact-70/experience")}
                    className="px-16 py-6 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700 shadow-2xl shadow-[#ff00ff]/20 cursor-pointer border-none"
                  >
                    Discover The Scene
                  </button>
                  <button
                    onClick={() => router.push("/templates/impact-70/experience")}
                    className="px-16 py-6 border border-white/10 bg-transparent text-white/45 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center gap-4 rounded-full cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" /> Witness The Night
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>BERLIN / IBIZA / TOKYO / MIAMI</span>
            <div className="flex gap-6">
              <Music className="w-4 h-4 text-[#ff00ff] animate-pulse" />
              <Sparkles className="w-4 h-4 text-[#4b0082]" />
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-[#050005] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {[
                { icon: Disc, t: "Sonic Mastery", d: "Curated auditory journeys by world-class DJs and underground sound architects." },
                { icon: Heart, t: "Elite Circles", d: "Private VIP lounges and concierge services for an uncompromised experience." },
                { icon: MapPin, t: "Hidden Stages", d: "Exclusive pop-up events in the world's most evocative architectural spaces." }
              ].map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group cursor-pointer" onClick={() => router.push("/templates/impact-70/experience")}>
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-[#ff00ff]/20 group-hover:border-[#ff00ff]/30 transition-all duration-700">
                      <p.icon className="w-6 h-6 text-white/20 group-hover:text-[#ff00ff]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest italic text-white">{p.t}</h3>
                    <p className="text-white/20 leading-relaxed font-light text-sm italic">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
          {/* Abstract Circle Gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-[#ff00ff]/20 to-[#4b0082]/20 blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <div className="w-20 h-20 mx-auto mb-20 rounded-full bg-black flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic pb-6">
                Enter The <br /> <span className="font-bold not-italic opacity-10 italic">Eternal.</span>
              </h2>
              <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                Membership is by invitation only. Apply for consideration and gain access to the world's most guarded nocturnal experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <button
                  onClick={() => router.push("/templates/impact-70/members")}
                  className="px-20 py-8 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:px-24 transition-all duration-700 italic shadow-2xl cursor-pointer border-none"
                >
                  Apply For Membership
                </button>
                <button
                  onClick={() => router.push("/templates/impact-70/members")}
                  className="px-20 py-8 border border-black/10 bg-transparent text-black/45 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:text-black transition-all italic cursor-pointer"
                >
                  View Membership Tiers
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
