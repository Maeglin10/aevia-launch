"use client"

import Image from "next/image"
import Link from "next/link"
import { Reveal, ScrollImage, team, awards, pressItems } from "../shared"
import { ArrowRight } from "lucide-react"

export default function StudioPage() {
  return (
    <div className="min-h-screen">

    {/* ─── STUDIO HERO ──────────────────────────────────────────────────────── */}
    <div className="pt-[72px] relative overflow-hidden min-h-[55vh] flex items-end bg-black">
      <ScrollImage
        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&h=700&fit=crop&crop=center"
        alt="Brutco Atelier"
        width={1400}
        height={700}
        className="absolute inset-0 w-full h-full opacity-30"
        dir={-1}
        yRange={40}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
        <Reveal>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-6">The Firm</div>
          <h1
            className="font-black leading-[0.85] text-white uppercase"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(48px, 9vw, 120px)",
              letterSpacing: "-0.02em",
            }}
          >
            ATELIER &<br />MANIFESTO
          </h1>
        </Reveal>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">

      {/* Tenets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            t: "HONEST MATERIALS",
            desc: "We work with raw concrete, steel, and industrial glass. We refuse to hide the integrity of materials behind plasterboard or paint."
          },
          {
            t: "STRUCTURAL TRUTH",
            desc: "The columns, slabs, and shear walls that hold the building up are the architecture itself. Form follows structure."
          },
          {
            t: "MONOLITHIC GEOMETRY",
            desc: "Mass, weight, and light create spatial meaning. We build block-like forms that capture the shifting paths of natural light."
          },
          {
            t: "ENDURING PURPOSE",
            desc: "A structure should survive generations. We build with permanent textures that require zero maintenance and age gracefully."
          }
        ].map((tenet, i) => (
          <div key={tenet.t} className="border-4 border-black p-6 bg-white">
            <span className="font-mono text-xs text-gray-400 block mb-4">TENET_0{i + 1}</span>
            <h3 className="font-black text-xl uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{tenet.t}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{tenet.desc}</p>
          </div>
        ))}
      </div>

      {/* Philosophy & Timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <h2 className="font-black text-4xl uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            FOUNDED IN PARIS, 2008.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Atelier Brunel was founded by Viktor Brunel in Paris with a simple commitment: to return architecture to its raw, structural roots. Rejecting the glass-and-plasterboard standards of commercial offices, the studio pioneered raw concrete formulations suited for both residential and institutional buildings.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, the office comprises 24 architects, engineers, and material scientists, working from three ateliers in Paris, Lyon, and Marseille. We maintain our own aggregate testing facility to ensure concrete composition complies with structural and thermal requirements.
          </p>
        </div>

        <div className="lg:col-span-7 border-l-4 border-black pl-8 lg:pl-12 space-y-8">
          <h3 className="font-black text-3xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            STUDIO TIMELINE
          </h3>

          <div className="space-y-6">
            {[
              { y: "2008", t: "Atelier Founded", d: "Viktor Brunel establishes the office in the 10th Arrondissement of Paris." },
              { y: "2013", t: "First Major Public Commission", d: "Awarded contract for the Lyon Industrial Heritage Silos refurbishment." },
              { y: "2017", t: "National Brutalist Award", d: "Winner of the Grand Prix d'Architecture for the Concrete Chapel in Marseille." },
              { y: "2021", t: "Research Laboratory", d: "Launches the 'Material Truth' research program investigating zero-carbon structural concrete." },
              { y: "2024", t: "140+ Built Projects", d: "Celebrating 16 years of honest structures and expansion to public masterplanning." }
            ].map((step) => (
              <div key={step.y} className="relative">
                <div className="absolute -left-[45px] top-1.5 w-[22px] h-[22px] border-4 border-black bg-white rounded-none animate-pulse" />
                <span className="font-black text-xl text-black block leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.y}</span>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{step.t}</h4>
                <p className="text-gray-500 text-xs leading-relaxed max-w-md">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Team bios */}
      <div className="border-t-4 border-black pt-12 mb-24">
        <Reveal>
          <h3 className="font-black text-4xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            ATELIER PARTNERS & DIRECTORS
          </h3>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07} className="group">
              <div className="border-4 border-black p-4 bg-white h-full flex flex-col">
                <div className="aspect-square relative w-full mb-4 overflow-hidden border-2 border-black">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-black text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.name}</h4>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{m.role}</span>
                <p className="text-gray-500 text-xs leading-relaxed mt-3 border-t border-black/10 pt-3 flex-1">
                  Over 10 years of experience managing complex concrete structures and structural detailing for public and private clients.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ─── AWARDS ────────────────────────────────────────────────────────── */}
      <div className="mb-24">
        <Reveal className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-3">Recognition</div>
              <h2 className="font-black text-4xl md:text-6xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                AWARDS
              </h2>
            </div>
            <div className="text-right hidden md:block">
              <div className="font-black text-5xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>8</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">National prizes</div>
            </div>
          </div>
        </Reveal>

        <div className="space-y-0">
          {awards.map((a, i) => (
            <Reveal key={`${a.year}-${a.award}`} delay={i * 0.05}>
              <div className="border-t-4 border-black group hover:bg-gray-50 transition-colors">
                <div className="py-6 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-black text-lg text-gray-300" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{a.year}</span>
                  </div>
                  <div className="col-span-10 md:col-span-5">
                    <h4 className="font-black text-base md:text-lg uppercase leading-tight group-hover:translate-x-1 transition-transform" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {a.award}
                    </h4>
                  </div>
                  <div className="col-span-6 md:col-span-3 hidden md:block">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{a.cat}</span>
                  </div>
                  <div className="col-span-6 md:col-span-3 hidden md:block">
                    <span className="text-xs font-semibold text-gray-500">{a.project}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="border-t-4 border-black" />
        </div>
      </div>

      {/* ─── PRESS ─────────────────────────────────────────────────────────── */}
      <div className="mb-24">
        <Reveal className="mb-12">
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-3">Press & Media</div>
          <h2 className="font-black text-4xl md:text-6xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            IN THE PRESS
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pressItems.map((item, i) => (
            <Reveal key={item.pub} delay={i * 0.08}>
              <div className="border-4 border-black p-8 group hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-black text-2xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.pub}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/40">{item.year}</span>
                </div>
                <p className="text-gray-600 group-hover:text-white/70 text-base font-medium leading-relaxed italic">{item.quote}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ─── RESEARCH LAB CTA ──────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="relative overflow-hidden border-4 border-black bg-black text-white p-12 md:p-16">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <Reveal className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-4">Research Program</div>
                <h3
                  className="font-black text-4xl md:text-5xl uppercase leading-[0.9] mb-6"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  MATERIAL TRUTH LAB
                </h3>
                <p className="text-white/50 leading-relaxed text-base">
                  Since 2021, our in-house research unit has tested over 140 concrete formulations, investigating the intersection of structural performance, thermal mass, and carbon footprint. We share our findings with the field.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Formulations tested", val: "140+" },
                  { label: "Carbon reduction vs. standard", val: "–31%" },
                  { label: "Published research papers", val: "6" },
                  { label: "Partner universities", val: "3" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                    <span className="font-black text-xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA */}
      <Reveal className="text-center py-8">
        <Link
          href="/templates/impact-28/contact"
          className="inline-flex items-center gap-2 bg-black text-white font-black text-sm uppercase tracking-widest px-10 py-5 hover:bg-gray-900 transition-colors cursor-pointer"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Work with us <ArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>

    </div>
    </div>
  )
}
