"use client";

import React from "react";
import Image from "next/image";
import { Map, Leaf, Droplets, CheckCircle2, Award, Grape } from "lucide-react";
import { Reveal } from "../shared";

export default function TerroirPage() {
  return (
    <div className="min-h-dvh bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&fit=crop"
          alt="Vignoble de Margaux"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans font-bold">Médoc · Bordeaux</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none pb-2">Le Terroir</h1>
          </Reveal>
        </div>
      </section>

      {/* Géologie */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=800&q=80&fit=crop"
                  alt="Sol de graves garonnaises"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Map className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Géologie</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6 leading-snug pb-1">Les Graves de Margaux</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  Notre vignoble repose sur les graves garonnaises du quaternaire, dépôts alluviaux anciens apportés par la Garonne. Ces cailloux ronds, réchauffés le jour et restitués la nuit, créent un micro-climat unique. Le sous-sol argilo-calcaire offre une réserve hydrique parfaite.
                </p>
                <div className="space-y-4">
                  {[
                    "Graves garonnaises du quaternaire",
                    "Sous-sol argilo-calcaire profond",
                    "Excellent drainage naturel",
                    "Micro-climat tempéré et lumineux"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C4A265] shrink-0" />
                      <span className="text-sm text-zinc-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Viticulture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal delay={0.1} className="order-2 lg:order-1">
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Viticulture</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6 leading-snug pb-1">La Vigne Raisonnée</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  Nous pratiquons la lutte raisonnée depuis 1998, avec une conversion progressive vers la biodynamie. Les vendanges sont intégralement manuelles. Le rendement volontairement limité à 35 hectolitres par hectare concentre l'expression du terroir dans chaque grain de raisin.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">35</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">hl/ha maximum</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">100%</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Vendanges manuelles</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">45</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Hectares de vignes</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">HVE 3</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Certification</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="order-1 lg:order-2">
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop"
                    alt="Vendanges manuelles"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Vinification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop"
                  alt="Chai de vinification"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Vinification</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6 leading-snug pb-1">L'Art de la Transformation</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  La vinification s'effectue en cuves inox thermorégulées permettant un contrôle précis des températures de fermentation. L'élevage de 18 à 24 mois en barriques françaises neuves à 60% suit la méthode de l'œnologue-conseil Denis Dubourdieu, privilégiant l'expression du fruit.
                </p>
                <div className="space-y-4">
                  {[
                    "Cuves inox thermorégulées — fermentation à 28°C",
                    "Élevage 18–24 mois en barriques françaises",
                    "60% bois neuf — Tronçais, chauffe moyenne",
                    "Méthode Dubourdieu — respect du fruit",
                    "Soutirage à la bougie, collage au blanc d'œuf"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C4A265] shrink-0" />
                      <span className="text-sm text-zinc-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Équipe */}
          <Reveal>
            <div className="bg-[#2D1B0E] text-white p-12 md:p-16">
              <div className="text-center mb-12">
                <div className="h-px w-12 bg-[#C4A265] mx-auto mb-6" />
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">L'Équipe Technique</h2>
                <h3 className="text-3xl font-serif leading-snug pb-1">Les Gardiens du Style</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto font-sans">
                <div className="bg-white/5 p-8 text-center">
                  <div className="w-16 h-16 bg-[#C4A265]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-[#C4A265]" />
                  </div>
                  <div className="text-lg font-serif text-[#C4A265] mb-1">Jean-Pierre Launay</div>
                  <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Maître de Chai</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    30 ans au service du domaine. Gardien de la mémoire des millésimes, il conduit chaque élevage avec une précision horlogère.
                  </p>
                </div>
                <div className="bg-white/5 p-8 text-center">
                  <div className="w-16 h-16 bg-[#C4A265]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grape className="w-8 h-8 text-[#C4A265]" />
                  </div>
                  <div className="text-lg font-serif text-[#C4A265] mb-1">Méthode Dubourdieu</div>
                  <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Conseil Œnologique</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    L'héritage de la méthode Denis Dubourdieu guide nos choix vinificatoires : respect absolu du raisin, révélation du terroir.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
