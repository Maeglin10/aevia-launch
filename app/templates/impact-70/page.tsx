"use client";
// @ts-nocheck

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music, Sparkles, Disc, Heart, MapPin, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, EVENTS, ParallaxImg } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function VelvetHomePage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const router = useRouter();

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div className="bg-[#050005] text-[#d1d1d1] font-sans">
      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={photo(0, "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2400")}
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
              <h1 className="text-8xl md:text-[14vw] font-light tracking-tighter leading-[1.15] text-white mb-16 uppercase italic pb-6">{c?.heroHeadline ?? <>
                Ethereal <br /> <span className="font-bold not-italic">Rhythm.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">{c?.heroSubline ?? fd?.tagline ?? <>
                  Where the light fades and the soul awakens. An immersive sanctuary for the world's most discerning nocturnal explorers.
                </>}</p>
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

        {/* ── SECTION 1 : PROCHAINS ÉVÉNEMENTS ───────────── */}
        <section className="py-40 bg-[#050005]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter mb-24 text-white italic">
                Prochains<br />
                <span className="font-bold not-italic opacity-10">Événements.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EVENTS.map((ev) => (
                <div key={ev.id} className="relative aspect-[3/4] overflow-hidden group cursor-pointer">
                  <Image
                    src={ev.img}
                    alt={ev.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050005] via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ff00ff] mb-2">{ev.cat}</div>
                    <div className="text-2xl font-bold text-white uppercase tracking-wider">{ev.name}</div>
                  </div>
                  <div className="absolute top-6 right-6 text-[10px] font-bold text-white/20 tracking-[0.3em]">{ev.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2 : MARQUEE ────────────────────────── */}
        <section className="py-12 bg-[#0d000d] border-y border-white/5 overflow-hidden">
          <div className="flex whitespace-nowrap">
            <motion.div
              className="flex gap-12 items-center text-[#ff00ff] text-sm font-bold uppercase tracking-[0.4em] shrink-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            >
              {Array.from({ length: 2 }).map((_, rep) => (
                <React.Fragment key={rep}>
                  {[
                    "RÉSERVATIONS PRIVÉES",
                    "BERLIN",
                    "IBIZA",
                    "TOKYO",
                    "MIAMI",
                    "MEMBERS ONLY",
                    "NOCTURNE",
                    "VIP LOUNGE",
                    "VELVET",
                  ].map((word, i) => (
                    <React.Fragment key={`${rep}-${i}`}>
                      <span>{word}</span>
                      <span className="text-white/10">·</span>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 3 : STATS ──────────────────────────── */}
        <section className="py-32 bg-[#050005]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {[
                { value: "4", label: "Villes" },
                { value: "12K+", label: "Membres" },
                { value: "1K+", label: "Événements" },
                { value: "10", label: "Ans" },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center py-16 border border-white/5 group hover:border-[#ff00ff]/20 transition-colors duration-500">
                    <div className="text-6xl md:text-8xl font-bold text-[#ff00ff] leading-none mb-4 group-hover:opacity-80 transition-opacity">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">
                      {stat.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 : ADHÉSION ───────────────────────── */}
        <section className="py-40 bg-[#050005]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter mb-6 text-white italic">
                Adhésion.
              </h2>
              <p className="text-white/30 text-lg font-light italic mb-24 max-w-xl">
                Trois niveaux. Une seule exigence : l'excellence.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Noir */}
              <Reveal delay={0}>
                <div className="bg-[#0d000d] border border-white/10 p-10 flex flex-col gap-8 hover:border-white/20 transition-colors duration-500">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 mb-3">Niveau</div>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider italic">Noir</h3>
                  </div>
                  <div className="text-4xl font-light text-white/30 italic">Entrée libre</div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <p className="text-white/40 leading-relaxed text-sm font-light">
                    Accès aux événements publics, newsletter exclusive, priorité liste d'attente.
                  </p>
                  <button
                    onClick={() => router.push("/templates/impact-70/members")}
                    className="mt-auto px-8 py-4 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] rounded-full hover:text-white hover:border-white/30 transition-all cursor-pointer bg-transparent"
                  >
                    Rejoindre
                  </button>
                </div>
              </Reveal>

              {/* Violet — featured */}
              <Reveal delay={0.1}>
                <div className="bg-[#0d000d] border border-[#ff00ff]/40 p-10 flex flex-col gap-8 relative hover:border-[#ff00ff]/70 transition-colors duration-500 shadow-2xl shadow-[#ff00ff]/10">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#ff00ff] mb-3">Recommandé</div>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider italic">{c?.aboutTitle ?? fd?.businessName ?? <>Violet</>}</h3>
                  </div>
                  <div className="text-4xl font-light text-white italic">€180<span className="text-lg text-white/30">/mois</span></div>
                  <div className="w-8 h-[1px] bg-[#ff00ff]/30" />
                  <p className="text-white/50 leading-relaxed text-sm font-light">{c?.aboutText ?? <>
                    Réservations prioritaires, accès lounge VIP, 2 invités par soir, événements membres.
                  </>}</p>
                  <button
                    onClick={() => router.push("/templates/impact-70/members")}
                    className="mt-auto px-8 py-4 bg-[#ff00ff] text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all duration-500 cursor-pointer border-none"
                  >
                    Rejoindre
                  </button>
                </div>
              </Reveal>

              {/* Obsidien */}
              <Reveal delay={0.2}>
                <div className="bg-[#0d000d] border border-white/10 p-10 flex flex-col gap-8 hover:border-[#4b0082]/50 transition-colors duration-500">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 mb-3">Prestige</div>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider italic">Obsidien</h3>
                  </div>
                  <div className="text-4xl font-light text-white italic">€480<span className="text-lg text-white/30">/mois</span></div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <p className="text-white/40 leading-relaxed text-sm font-light">
                    Accès permanent, table attitrée, conciergerie 24/7, événements privés exclusifs.
                  </p>
                  <button
                    onClick={() => router.push("/templates/impact-70/members")}
                    className="mt-auto px-8 py-4 border border-[#4b0082]/50 text-white/60 font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-[#4b0082]/20 hover:text-white transition-all cursor-pointer bg-transparent"
                  >
                    Rejoindre
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SECTION 5 : ARTISTES ───────────────────────── */}
        <section className="py-40 bg-[#050005]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter mb-24 text-white italic">
                Artistes.
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "ABYSS",
                  genre: "Berlin Techno",
                  gradient: "from-[#0d000d] via-[#1a0030] to-[#050005]",
                  accent: brand ?? '#ff00ff',
                },
                {
                  name: "SOLÈNE K.",
                  genre: "French Touch",
                  gradient: "from-[#0d000d] via-[#2b0057] to-[#050005]",
                  accent: "#cc00cc",
                },
                {
                  name: "VOID.EXE",
                  genre: "Industrial Electronic",
                  gradient: "from-[#050005] via-[#0d000d] to-[#1a0030]",
                  accent: "#8800aa",
                },
                {
                  name: "LUMIÈRE NOIRE",
                  genre: "Ambient / Ceremonial",
                  gradient: "from-[#050005] via-[#200038] to-[#0d000d]",
                  accent: "#4b0082",
                },
              ].map((artist, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div
                      className={`aspect-square bg-gradient-to-br ${artist.gradient} border border-white/5 group-hover:border-[#ff00ff]/20 transition-all duration-700 flex items-end p-6 relative overflow-hidden`}
                    >
                      {/* Abstract circle decoration */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-700 blur-xl"
                        style={{ backgroundColor: artist.accent }}
                      />
                      <div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40"
                        style={{ backgroundColor: artist.accent }}
                      />
                      <div className="relative z-10">
                        <div
                          className="text-[9px] font-bold tracking-[0.4em] uppercase mb-2 opacity-60"
                          style={{ color: artist.accent }}
                        >
                          {artist.genre}
                        </div>
                        <div className="text-lg font-bold text-white uppercase tracking-wider leading-tight">
                          {artist.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 : TÉMOIGNAGES ────────────────────── */}
        <section className="py-40 bg-[#050005]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter mb-24 text-white italic">
                Ils parlent<br />
                <span className="font-bold not-italic opacity-10">de Velvet.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Une expérience sonore et sensorielle sans équivalent. Velvet transcende la simple nuit.",
                  author: "M.R.",
                  role: "Membre depuis 2021",
                  dark: false,
                },
                {
                  quote: "L'intimité, la sécurité, le son. Ici, rien n'est laissé au hasard.",
                  author: "C.L.",
                  role: "Membre VIP",
                  dark: true,
                },
                {
                  quote: "Chaque soir est une performance artistique. Je n'ai trouvé nulle part ailleurs cela.",
                  author: "A.B.",
                  role: "Membre Obsidien",
                  dark: false,
                },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div
                    className={`p-10 border flex flex-col gap-8 h-full ${
                      t.dark
                        ? "bg-[#ff00ff]/5 border-[#ff00ff]/20"
                        : "bg-[#0d000d] border-white/5"
                    }`}
                  >
                    <div className="text-[#ff00ff] text-4xl font-serif leading-none opacity-60">&ldquo;</div>
                    <p className="text-white/60 leading-relaxed font-light italic text-lg flex-1">
                      {t.quote}
                    </p>
                    <div>
                      <div className="text-white font-bold text-sm uppercase tracking-widest">{t.author}</div>
                      <div className="text-white/20 text-[11px] uppercase tracking-[0.3em] mt-1">{t.role}</div>
                    </div>
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
