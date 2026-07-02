"use client";
// @ts-nocheck

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Settings, Shield, Clock } from "lucide-react";
import { Reveal, ParallaxImg, MODELS } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ZenithWatchPage() {
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
    <div className="bg-[#0a0c10] text-[#a0a0a0]">
      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2400"
              alt="Watch Macro"
              fill
              className="object-cover opacity-20 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                <div className="w-16 h-[1px] bg-[#c9a96e]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">
                  The Architecture of Time
                </span>
                <div className="w-16 h-[1px] bg-[#c9a96e]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-8xl md:text-[10rem] font-light tracking-tighter leading-[1.1] pb-6 text-white mb-16 uppercase italic">{c?.heroHeadline ?? <>
                Silent <br /> <span className="font-bold not-italic">Caliber.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">{c?.heroSubline ?? fd?.tagline ?? <>
                  Crafting high-fidelity movements that beat with the rhythm of tradition and the precision of tomorrow.
                </>}</p>
                <div className="flex flex-wrap justify-center gap-12">
                  <Link
                    href="/templates/impact-60/collections"
                    className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-700 italic shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                    style={{ textDecoration: "none" }}
                  >
                    Explore Collections
                  </Link>
                  <Link
                    href="/templates/impact-60/movement"
                    className="px-16 py-6 bg-[#c9a96e] text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all flex items-center gap-4"
                    style={{ textDecoration: "none" }}
                  >
                    <Play className="w-3 h-3 fill-current" /> Witness the Movement
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>GENEVA / ZURICH / TOKYO / NEW YORK</span>
            <div className="flex gap-6 items-center">
              <Clock className="w-4 h-4 text-[#c9a96e] animate-spin-slow" />
              <span>EST. 1892</span>
            </div>
          </div>
        </section>

        {/* ── THE MOVEMENT ──────────── */}
        <section className="py-60 bg-[#0a0c10] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <div className="relative aspect-square p-2 bg-white/[0.02] border border-white/5 group overflow-hidden">
                  <ParallaxImg
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200"
                    alt="Watch Gears"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-12">
                    Mechanical Integrity
                  </span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-[1.15] pb-4 mb-16 italic">{c?.aboutTitle ?? fd?.businessName ?? <>
                    Absolute <br />{" "}
                    <span className="not-italic font-bold opacity-30 text-white">
                      Precision.
                    </span>
                  </>}</h2>
                  <p className="text-2xl font-light text-white/40 leading-relaxed mb-20 italic">{c?.aboutText ?? <>
                    Every Zenith timepiece is powered by our proprietary Caliber-9 series movement, featuring 242 hand-polished components and a 72-hour power reserve.
                  </>}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {[
                      {
                        icon: Settings,
                        t: "HAND-POLISHED",
                        d: "Each gear is finished with artisan precision under 20x magnification.",
                      },
                      {
                        icon: Shield,
                        t: "LUNAR STABILITY",
                        d: "Regulated in 6 positions to ensure a variance of less than 1s/day.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="group">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#c9a96e] group-hover:text-black transition-all">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white italic">
                          {item.t}
                        </h4>
                        <p className="text-sm font-light leading-relaxed text-white/20 italic">
                          {item.d}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── COLLECTIONS ────────────── */}
        <section className="py-60 bg-black">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-6">
                    Active Portfolio
                  </span>
                  <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-[1.15] pb-4 italic">
                    The{" "}
                    <span className="font-light not-italic opacity-10 text-white">
                      Holdings.
                    </span>
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {MODELS.map((item, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <Link href="/templates/impact-60/collections" className="group cursor-pointer block" style={{ textDecoration: "none" }}>
                    <div className="aspect-[4/5] relative mb-12 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5 p-2 bg-white/[0.02]">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-all duration-[3000ms]"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                      <div className="absolute bottom-10 left-10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-2 italic">
                          Ref: 0{i + 1} — ZENITH
                        </div>
                        <h3 className="text-4xl font-bold uppercase tracking-widest text-white leading-tight">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-sm font-light text-white/30 uppercase tracking-[0.2em]">
                        {item.cat || "Luxury Edition"}
                      </span>
                      <span className="text-xl font-bold text-white tracking-tighter italic">
                        {item.price}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section className="py-40 bg-[#0a0c10] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-6">Connoisseurs</span>
                  <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic text-white leading-none">In Their <span className="font-light not-italic opacity-10">Hands.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {[
                { quote: "The Chronos 01 is the only watch I've worn every day for four years. It has aged the way all great things do — with more character, not less.", name: "K. Lindqvist", origin: "Stockholm · Collector" },
                { quote: "I compared it directly against Lange and Patek at my usual dealer. Zenith's movement finishing at this price point is simply audacious.", name: "H. Fournier", origin: "Paris · Horologist" },
                { quote: "My Lunar Phase arrived with a personal letter from the atelier chief. That kind of craft and attention doesn't exist anymore. Except here.", name: "T. Okafor", origin: "Lagos · Collector" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="bg-[#0a0c10] p-14 flex flex-col gap-8 group hover:bg-black transition-colors">
                    <div className="text-6xl text-[#c9a96e]/10 font-serif leading-none">&ldquo;</div>
                    <p className="text-white/40 font-light leading-relaxed italic flex-1 text-lg">{t.quote}</p>
                    <div className="border-t border-white/5 pt-8">
                      <div className="text-sm font-bold text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-[10px] text-[#c9a96e] font-mono tracking-widest mt-2">{t.origin}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ATELIER ───────────────── */}
        <section className="py-40 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-8">The Workshop</span>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-none mb-12">Made By <br /><span className="font-light not-italic opacity-20">Hand.</span></h2>
                <div className="space-y-8">
                  {[
                    { icon: Settings, t: "Hand-Finished Movement", d: "Every calibre is assembled and regulated by a single watchmaker. Tolerances held to 0.004mm." },
                    { icon: Shield, t: "200-Hour Testing", d: "Each piece undergoes pressure, temperature, and magnetic resistance testing before certification." },
                    { icon: Play, t: "Open Caseback Viewing", d: "Every client receives a private atelier session to observe their piece during final assembly." },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 shrink-0 border border-[#c9a96e]/20 flex items-center justify-center group-hover:bg-[#c9a96e] group-hover:border-[#c9a96e] transition-all duration-700">
                        <f.icon className="w-5 h-5 text-[#c9a96e]/60 group-hover:text-black transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black italic uppercase mb-2">{f.t}</h4>
                        <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-14 grid grid-cols-3 gap-px bg-white/5">
                  {[{ v: "1/24", l: "Units" }, { v: "2,400h", l: "Assembly" }, { v: "47yr", l: "Crafting" }].map(s => (
                    <div key={s.l} className="bg-black p-8 text-center">
                      <div className="text-2xl font-black italic text-[#c9a96e]">{s.v}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-[2000ms] border border-white/5">
                  <ParallaxImg src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=1200" alt="Atelier" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#fafafa] text-black text-center px-6 border-t border-black/5 relative overflow-hidden">
          {/* Technical Schematic Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Clock className="w-[800px] h-[800px] animate-spin-slow" />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Reveal>
              <div className="w-16 h-16 border-2 border-black mx-auto mb-20 flex items-center justify-center font-black text-black text-2xl uppercase">
                Z
              </div>
              <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-[1.1] pb-6 mb-16 italic">
                OWN THE <br />{" "}
                <span className="font-light not-italic opacity-20 text-black">
                  ETERNAL.
                </span>
              </h2>
              <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                Limited production runs. Each piece is individually numbered and accompanied by a digital certificate of authenticity on the Zenith mesh.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <Link
                  href="/templates/impact-60/contact"
                  className="px-20 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl text-center"
                  style={{ textDecoration: "none" }}
                >
                  Request Allocation
                </Link>
                <Link
                  href="/templates/impact-60/contact"
                  className="px-20 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic text-center"
                  style={{ textDecoration: "none" }}
                >
                  View Registry
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
