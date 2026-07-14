"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, Users, ChevronDown, ArrowRight } from "lucide-react";
import { RETREATS, Reveal, StyleInjector } from "../shared";

export default function RetreatsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const themeColors: Record<string, string> = {
    Stillness: "#8b7355",
    Clarity:   "#4a7fa0",
    Presence:  "#3d7a5e",
  };

  return (
    <div className="min-h-dvh bg-[#f8f5f0]">
      <StyleInjector />

      {/* ==========================================
          HEADER
          ========================================== */}
      <section className="pt-24 pb-20 px-6 md:px-12 border-b border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Programme 2026 · Trois destinations
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-8"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Retraites
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                2026
              </span>
            </h1>
            <p
              className="max-w-2xl text-lg text-black/50 leading-relaxed"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Trois paysages soigneusement sélectionnés pour leur capacité à induire des états de présence profonde. Chaque retraite est conçue autour d&apos;un thème central qui oriente l&apos;ensemble du protocole.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          RETREAT CARDS (horizontal, large format)
          ========================================== */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {RETREATS.map((retreat, i) => (
            <Reveal key={retreat.id} delay={i * 0.1}>
              <div className="bg-white/60 border border-black/5 rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-400">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Image — 40% */}
                  <div className="lg:col-span-2 relative h-72 lg:h-auto min-h-[360px] overflow-hidden">
                    <Image
                      src={retreat.img}
                      alt={retreat.name}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
                    {/* Theme badge */}
                    <div className="absolute top-6 left-6">
                      <span
                        className="px-4 py-1.5 text-white text-[9px] uppercase tracking-[0.35em] font-bold font-sans"
                        style={{ backgroundColor: themeColors[retreat.theme] || "#3d7a5e" }}
                      >
                        {retreat.theme}
                      </span>
                    </div>
                    {/* Price */}
                    <div className="absolute bottom-6 left-6">
                      <span
                        className="text-3xl font-light text-white/90"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {retreat.price}
                      </span>
                    </div>
                  </div>

                  {/* Content — 60% */}
                  <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Title & location */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2
                            className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#2a2a2a] mb-2"
                            style={{ fontFamily: "Cinzel, Georgia, serif" }}
                          >
                            {retreat.name}
                          </h2>
                          <div className="flex items-center gap-2 text-black/40">
                            <MapPin className="w-3 h-3 text-[#3d7a5e]" />
                            <span className="text-[11px] uppercase tracking-[0.25em] font-sans">
                              {retreat.location}
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-[#3d7a5e] font-sans font-bold border border-[#3d7a5e]/30 px-3 py-1.5 hidden md:block">
                          2026
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-black/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#3d7a5e]" />
                          <span className="text-xs text-black/50 font-sans uppercase tracking-[0.2em]">
                            {retreat.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#3d7a5e]" />
                          <span className="text-xs text-black/50 font-sans uppercase tracking-[0.2em]">
                            {retreat.season}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#3d7a5e]" />
                          <span className="text-xs text-black/50 font-sans uppercase tracking-[0.2em]">
                            Max 9 participants
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-[#2a2a2a]/70 text-base leading-relaxed mb-8"
                        style={{ fontFamily: "Lora, Georgia, serif" }}
                      >
                        {retreat.desc}
                      </p>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {retreat.details.map(([label, value]) => (
                          <div key={label} className="border-l-2 border-[#3d7a5e]/20 pl-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-sans mb-1">
                              {label}
                            </p>
                            <p
                              className="text-sm text-[#2a2a2a] font-medium"
                              style={{ fontFamily: "Lora, Georgia, serif" }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Expandable more info */}
                      <button
                        onClick={() => setExpanded(expanded === retreat.id ? null : retreat.id)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-[#3d7a5e] transition-colors font-sans font-bold mb-4 bg-transparent border-none cursor-pointer"
                      >
                        {expanded === retreat.id ? "Masquer les détails" : "En savoir plus"}
                        <motion.div animate={{ rotate: expanded === retreat.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expanded === retreat.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-black/5 pt-6 mb-6">
                              <h4
                                className="text-sm font-semibold uppercase tracking-wider text-[#2a2a2a] mb-4"
                                style={{ fontFamily: "Cinzel, Georgia, serif" }}
                              >
                                Une journée type
                              </h4>
                              <p
                                className="text-sm text-black/50 leading-relaxed mb-4"
                                style={{ fontFamily: "Lora, Georgia, serif" }}
                              >
                                Chaque journée suit un rythme naturel sans horloge ni écran. Les matins sont consacrés aux pratiques corporelles dans le paysage. Les après-midis offrent un espace de silence non structuré. Les soirées réunissent le groupe autour d&apos;un feu ou d&apos;un repas partagé.
                              </p>
                              <p
                                className="text-sm text-black/50 leading-relaxed"
                                style={{ fontFamily: "Lora, Georgia, serif" }}
                              >
                                Le prix comprend : l&apos;hébergement luxe en chambre privée, tous les repas biodynamiques, les transferts depuis l&apos;aéroport le plus proche, l&apos;ensemble des sessions encadrées, et le protocole pré-départ de 21 jours.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <Link
                        href="/templates/impact-59/apply"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.35em] font-bold font-sans hover:bg-[#2a5e45] transition-colors rounded-full"
                        style={{ textDecoration: "none" }}
                      >
                        Candidater pour cette retraite
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        href="/templates/impact-59/method"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-black/10 text-[#2a2a2a] text-[10px] uppercase tracking-[0.35em] font-bold font-sans hover:bg-black hover:text-white transition-colors rounded-full"
                        style={{ textDecoration: "none" }}
                      >
                        La méthode
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          CLOSING NOTE — What's included
          ========================================== */}
      <section className="py-20 px-6 md:px-12 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="bg-[#2a2a2a] text-[#f8f5f0] p-10 md:p-16 rounded-sm">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-8 font-sans font-bold">
                Toutes nos retraites incluent
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    label: "Transferts privés",
                    desc: "Depuis l’aéroport le plus proche, aller-retour inclus.",
                  },
                  {
                    label: "Hébergement de luxe",
                    desc: "Chambres privées dans des propriétés d’exception.",
                  },
                  {
                    label: "Cuisine biodynamique",
                    desc: "Tous les repas préparés avec des ingrédients locaux de saison.",
                  },
                  {
                    label: "Protocole pré-départ",
                    desc: "21 jours d’accompagnement avant votre arrivée.",
                  },
                ].map((item, i) => (
                  <Reveal key={item.label} delay={i * 0.1}>
                    <div className="border-t border-[#f8f5f0]/10 pt-6">
                      <span className="text-[#3d7a5e] text-lg block mb-3">✦</span>
                      <h4
                        className="text-sm font-semibold uppercase tracking-wide text-[#f8f5f0] mb-2"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {item.label}
                      </h4>
                      <p
                        className="text-xs text-[#f8f5f0]/40 leading-relaxed"
                        style={{ fontFamily: "Lora, Georgia, serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          RETREAT COMPARISON TABLE
          ========================================== */}
      <section className="py-20 px-6 md:px-12 bg-white/60 border-y border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-8 font-sans font-bold">
              Comparatif rapide
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-4 pr-8 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold w-1/4">
                      Retraite
                    </th>
                    <th className="text-left py-4 pr-8 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold">
                      Paysage
                    </th>
                    <th className="text-left py-4 pr-8 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold">
                      Durée
                    </th>
                    <th className="text-left py-4 pr-8 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold">
                      Saison
                    </th>
                    <th className="text-left py-4 pr-8 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold">
                      Thème
                    </th>
                    <th className="text-left py-4 text-[9px] uppercase tracking-[0.35em] text-black/30 font-bold">
                      Tarif
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RETREATS.map((retreat, i) => (
                    <tr
                      key={retreat.id}
                      className="border-b border-black/5 hover:bg-[#3d7a5e]/3 transition-colors"
                    >
                      <td
                        className="py-5 pr-8 font-semibold text-[#2a2a2a] text-sm uppercase tracking-wide"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {retreat.name}
                      </td>
                      <td className="py-5 pr-8 text-black/50 text-xs">{retreat.location}</td>
                      <td className="py-5 pr-8 text-black/50 text-xs">{retreat.duration}</td>
                      <td className="py-5 pr-8 text-black/50 text-xs">{retreat.season}</td>
                      <td className="py-5 pr-8">
                        <span className="px-3 py-1 bg-[#3d7a5e]/10 text-[#3d7a5e] text-[9px] uppercase tracking-[0.25em] font-bold font-sans rounded-full">
                          {retreat.theme}
                        </span>
                      </td>
                      <td
                        className="py-5 text-[#2a2a2a] font-medium text-sm"
                        style={{ fontFamily: "Lora, Georgia, serif" }}
                      >
                        {retreat.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          FAQ SECTION
          ========================================== */}
      <section className="py-20 px-6 md:px-12 bg-[#f8f5f0]">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Questions fréquentes
            </p>
            <h3
              className="text-3xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-12"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Ce que vous voulez savoir
            </h3>
          </Reveal>
          <div className="space-y-0">
            {[
              {
                q: "Les appareils numériques sont-ils autorisés ?",
                a: "Non. Les appareils sont déposés à l'arrivée et rendus au départ. Cette remise constitue le premier acte transformateur de la retraite.",
              },
              {
                q: "Y a-t-il des contraintes physiques particulières ?",
                a: "Nos retraites ne demandent pas de condition physique spéciale. Les pratiques de marche et les séquences somatiques sont accessibles à tous les niveaux. Toute condition médicale est évaluée lors de l'appel de sélection.",
              },
              {
                q: "Peut-on venir en couple ou entre amis ?",
                a: "Chaque participant est sélectionné individuellement pour la cohérence du groupe. Les demandes pour deux personnes du même réseau sont examinées mais ne sont pas garanties dans la même session.",
              },
              {
                q: "Qu'est-ce qui est inclus dans le tarif affiché ?",
                a: "Le tarif couvre l'hébergement en chambre privée, tous les repas biodynamiques, les transferts aéroport aller-retour, l'ensemble des sessions encadrées et le protocole pré-départ de 21 jours. Les vols internationaux sont à la charge du participant.",
              },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border-b border-black/5 py-6">
                  <p
                    className="text-sm font-semibold text-[#2a2a2a] mb-3"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {faq.q}
                  </p>
                  <p
                    className="text-sm text-black/50 leading-relaxed"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          BOTTOM CTA STRIP
          ========================================== */}
      <section className="py-24 px-6 md:px-12 text-center bg-[#f8f5f0] border-t border-black/5">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <p
              className="text-2xl md:text-3xl font-light italic text-[#2a2a2a]/60 mb-10"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Chaque candidature est lue et examinée individuellement.
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-black/30 font-sans mb-10">
              Réponse garantie sous 48 heures · Places limitées à 9 par retraite
            </p>
            <Link
              href="/templates/impact-59/apply"
              className="inline-flex items-center gap-3 px-14 py-5 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-[#2a5e45] transition-colors rounded-full shadow-lg"
              style={{ textDecoration: "none" }}
            >
              Soumettre ma candidature →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
