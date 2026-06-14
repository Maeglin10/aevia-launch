"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURES, Reveal } from "../shared";

export default function MagazinePage() {
  const basePath = "/templates/impact-81";

  return (
    <section className="py-24 bg-[#0A0A08] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Dans ce numéro</p>
          <h1 className="text-4xl md:text-6xl font-light mb-14" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            À lire ce mois-ci
          </h1>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 mb-28">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] mb-5">
                  <Image src={f.image} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-[#0A0A08]/30" />
                  <div className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-[#C9A86C]">{f.issue}</div>
                </div>
                <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{f.title}</h3>
                <p className="text-sm text-[#6A6058] leading-relaxed mb-4">{f.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Featured interview */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" alt="Interview" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08]/60 to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-6">Portrait du mois</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                &ldquo;La mode est<br />un langage politique<br /><em>avant tout&rdquo;</em>
              </h2>
              <p className="text-[#A0988A] leading-relaxed mb-4">
                Hanna Kovacs, 34 ans, est la directrice artistique qui a bousculé les codes de la haute couture en moins de trois saisons. Nous l&apos;avons rencontrée dans son atelier du Marais, entre deux fittings.
              </p>
              <p className="text-[#A0988A] leading-relaxed mb-10">
                Elle parle de corps comme d&apos;arguments, de tissu comme de manifeste. Sa collection Automne 2025 interroge les liens entre silhouette et pouvoir avec une radicalité rare pour une jeune maison.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
