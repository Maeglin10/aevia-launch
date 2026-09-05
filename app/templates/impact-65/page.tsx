"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Activity, Shield, ChevronRight, Gauge } from "lucide-react";
import { Reveal, GridBackground } from "./shared";
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientCertifications,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { step: "01", title: "Fiber Selection", desc: "T1100G & M60J ultra-high-modulus carbon fiber sourced from TORAY. We reject batches with tensile strength variance above 0.3% — 94% of commercial fiber does not meet this threshold." },
              { step: "02", title: "Resin Engineering", desc: "Custom epoxy-bismaleimide hybrid matrix engineered in-house for thermal resistance to 320°C while maintaining 4.2 GPa interlaminar shear strength." },
              { step: "03", title: "Lay-up Architecture", desc: "Computational ply-stack optimization driven by finite element analysis. Each component has a unique lay-up sequence — no two programs are identical." },
              { step: "04", title: "Autoclave Cure", desc: "4-bar/180°C pressurized cure cycle in our 7-meter autoclave. Dimensional tolerance: ±0.05mm across any axis. NDT inspection by phased-array ultrasound on 100% of parts." }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;


// Les avis, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const AVIS_INLINE_SOURCE = [
  { quote: "We replaced our entire observability stack with Carbon in a weekend. The performance gain was immediate — and our infra bill dropped 40%.", name: "T. Nakamura", title: "CTO · Helix Labs" },
              { quote: "I've been in edge computing for a decade. Carbon's routing intelligence is the first thing I've seen that actually works at 6ms global P99.", name: "A. Osei", title: "Principal Eng · Meridian" },
              { quote: "The DX is phenomenal. I shipped a distributed service in Go in under 2 hours. Zero config, zero yak shaving. Just works.", name: "P. Leclerc", title: "Senior SWE · Phantom IO" }
];
let AVIS_INLINE = AVIS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function CarbonLabPage() {
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  sessionData = session;
  memoriserSession(sessionData);
  c = session?.generatedContent;


  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      title: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );

  AVIS_INLINE = resolveList(

    clientReviews(session)?.map((r: any, i: number) => ({

      ...AVIS_INLINE_SOURCE[i % AVIS_INLINE_SOURCE.length],

      quote: r.text, name: r.author, title: "", })),

    AVIS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div className="bg-[#050505] text-[#888] font-sans overflow-x-hidden">
      {/* ── HERO ──────────────────── */}
      <section className="relative min-h-[calc(100vh-112px)] flex items-center justify-center overflow-hidden py-12">
        <GridBackground />
        <div className="absolute inset-0">
          <Image
            src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2400"))}
            alt="High Performance Car"
            fill
            className="object-cover opacity-10 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
            <div>
              <Reveal delay={0.1} y={100}>
                <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[1.15] pb-4 uppercase mb-16 italic text-white">{<>{clientHeroLine(sessionData, 0, 2, 6) ?? "Beyond"}<br /> <span className="text-white/10 not-italic italic">{clientHeroLine(sessionData, 1, 2, 6) ?? "Steel."}</span>
                </>}</h1>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-12 items-center">
                  <p className="text-xl text-white/30 font-light max-w-sm leading-relaxed uppercase italic">{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
                    Uncompromising structural engineering. We deliver the highest strength-to-weight ratio in the industry.
                  </>}</p>
                  <div className="h-px w-20 bg-[var(--brand,#0070f3)] hidden sm:block" />
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex flex-col gap-2">
                    <span>Tensile: 4500 MPa</span>
                    <span>Density: 1.6 g/cm³</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.5} y={0}>
              <div className="relative aspect-square md:aspect-video bg-white/5 border border-white/10 overflow-hidden group">
                <Image
                  src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200"))}
                  alt="Racing Detail"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand,#0070f3)]/20 to-transparent mix-blend-overlay" />
                <div className="absolute bottom-10 left-10 p-8 bg-black/80 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-4 text-[var(--brand,#0070f3)] mb-4 animate-pulse">
                    <Gauge className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Real-time Stress Audit</span>
                  </div>
                  <div className="text-4xl font-black italic text-white mb-2 tracking-tighter">98.4% NOMINAL</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">Vibration Damping Active</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── METRICS ────────────────── */}
      <section className="py-24 bg-[var(--brand,#0070f3)] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-20">
          {[
            { v: "5X", l: "STRONGER THAN STEEL" },
            { v: "2X", l: "STIFFNESS RATIO" },
            { v: "-60%", l: "WEIGHT REDUCTION" },
            { v: "0.1mm", l: "PRECISION TOLERANCE" },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center md:text-left">
                <div className="text-6xl font-black tracking-tighter italic mb-4">{m.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">{m.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── APPLICATIONS ───────────── */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#0070f3)] block mb-6">Sector Integration</span>
                <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter text-white leading-[1.15] pb-4 italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                  Hard <br /> <span className="font-light not-italic opacity-10">Logic.</span>
                </>)}</h2>
              </div>
              <Link
                href="/templates/impact-65/research"
                className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[var(--brand,#0070f3)] transition-colors group italic"
              >
                Full Tech Stack <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, t: "Aerospace", d: "Thermal-resistant composite structures for next-gen orbital flight and satellite chassis." },
              { icon: Activity, t: "Automotive", d: "High-rigidity monocoques and aerodynamic components for top-tier racing and hypercars." },
              { icon: Shield, t: "Defense", d: "Ballistic-grade carbon weaves optimized for maximum energy absorption and structural integrity." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-16 bg-white/[0.02] border border-white/5 group hover:bg-[var(--brand,#0070f3)] hover:text-white transition-all duration-700">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-white group-hover:text-black transition-all duration-700 -skew-x-12">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">{item.t}</h3>
                  <p className="opacity-40 leading-relaxed text-sm font-light mb-12 italic group-hover:opacity-100 transition-opacity">{item.d}</p>
                  <Link href="/templates/impact-65/research" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all">
                    Examine Case <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ─────────────── */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#0070f3)] block mb-8">Materials Science</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.1] pb-4 italic">{c?.aboutTitle ?? fd?.businessName ?? <>
                La <br /><span className="text-white/10 font-light not-italic">formule.</span>
              </>}</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-white/30 text-xl font-light italic leading-relaxed">{c?.aboutText ?? <>
                Every CarbonLab composite begins in our tensile simulation lab, where we model 900+ stress scenarios before a single fiber is laid. The result: materials that outperform steel at one-fifth the weight.
              </>}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {PRESTATIONS_INLINE.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="p-12 bg-[#050505] hover:bg-[var(--brand,#0070f3)]/5 transition-all duration-700 border border-transparent hover:border-[var(--brand,#0070f3)]/20">
                  <span className="text-[var(--brand,#0070f3)]/30 text-sm font-black uppercase tracking-widest italic block mb-6">{s.step}</span>
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight italic mb-6">{s.title}</h3>
                  <p className="text-white/25 text-sm font-light italic leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ────────────────── */}
      <section className="py-24 bg-[#070707] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 block mb-20 text-center italic">
              Engineering Partners
            </span>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-30">
            {/* LISTE_LIBELLES */ (clientList(sessionData, "bloc.liste1") ?? clientCertifications(sessionData) ?? (clientName(sessionData) ? [] : ["Dallara", "Rolls-Royce Defence", "Airbus Urban Air", "Formula 1", "SpaceX Starshield"])).map((c, i) => (
              <Reveal key={c} delay={i * 0.07}>
                <div className="text-center text-sm font-black uppercase tracking-widest text-white/60 italic hover:text-[var(--brand,#0070f3)] hover:opacity-100 transition-all duration-500 cursor-default">{c}</div>
              </Reveal>
            ))}
          </div>
          <div className="mt-24 border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { v: "2,800+", l: "Parts manufactured in 2024" },
              { v: "7", l: "Racing championships served" },
              { v: "3", l: "Space mission structural programs" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-5xl font-black text-[var(--brand,#0070f3)] italic tracking-tighter mb-4">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────── */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#0070f3)]/60 mb-6">Trusted by builders</p>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-20">{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              WHAT THEY<br /><span className="text-white/10">BUILD.</span>
            </>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {AVIS_INLINE.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#050505] p-12 flex flex-col gap-6 hover:bg-[var(--brand,#0070f3)]/5 transition-all duration-700 border border-transparent hover:border-[var(--brand,#0070f3)]/20">
                  <div className="flex gap-1">{[...Array(5)].map((_, s) => <span key={s} className="text-[var(--brand,#0070f3)] text-xs">★</span>)}</div>
                  <p className="text-white/40 leading-relaxed flex-1 italic">{t.quote}</p>
                  <div className="border-t border-white/5 pt-6">
                    <div className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</div>
                    <div className="text-[10px] text-[var(--brand,#0070f3)]/50 mt-1">{t.title}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ──────────── */}
      <section className="py-32 bg-[#070707] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#0070f3)]/60 mb-6">Case studies</p>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-20">{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
              IN THE<br /><span className="text-white/10">WILD.</span>
            </>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { tag: "FINTECH", title: "0→$2B transactions routed in 90 days", result: "22ms avg latency · 99.999% uptime", icon: "01" },
              { tag: "HEALTH TECH", title: "HIPAA-compliant edge deployments across 12 hospitals", result: "Zero PHI exposure incidents · SOC2 in 3 weeks", icon: "02" },
              { tag: "E-COMMERCE", title: "Black Friday: 400k concurrent sessions, zero downtime", result: "Revenue preserved: $18M · Infra cost: $0 extra", icon: "03" },
            ].map((cs) => (
              <Reveal key={cs.icon}>
                <div className="p-12 bg-[#050505] hover:bg-[var(--brand,#0070f3)] hover:text-white transition-all duration-700 border border-transparent hover:border-[var(--brand,#0070f3)] group">
                  <div className="text-[10px] font-mono text-[var(--brand,#0070f3)] group-hover:text-white/60 uppercase tracking-widest mb-4">{cs.tag} // {cs.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-4 leading-snug">{cs.title}</h3>
                  <p className="text-xs text-white/30 group-hover:text-white/60 leading-relaxed font-mono">{cs.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────── */}
      <section className="py-60 bg-white text-black text-center relative overflow-hidden">
        <GridBackground />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Reveal>
            <h2 className="text-8xl md:text-[15vw] font-black uppercase tracking-tighter leading-[1.15] pb-4 mb-16 italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>
              Build <br /> <span className="font-light not-italic opacity-20 text-black">Fast.</span>
            </>)}</h2>
            <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
              Transform your structural requirements into high-performance assets. We are currently accepting R&D partnerships for Q3 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <Link
                href="/templates/impact-65/contact"
                className="px-24 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-28 transition-all duration-700 italic -skew-x-12 inline-block"
              >
                Request Lab Audit
              </Link>
              <Link
                href="/templates/impact-65/materials"
                className="px-24 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic -skew-x-12 inline-block"
              >
                View Materials
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "Carbon Lab"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
