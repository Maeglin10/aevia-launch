"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Quote, ChevronDown } from "lucide-react";
import { LINEAGE, Reveal, StyleInjector } from "../shared";

const GUIDE_EXTENDED = [
  {
    background: "Neurosciences cliniques",
    formation: "Université de Heidelberg · Stanford Center on Longevity",
    pratique: "Protocoles de récupération burnout pour hauts performeurs",
    quote:
      "La surperformance chronique crée une dette neuro-végétative que ni les vacances ni le sommeil ne suffisent à rembourser. Il faut autre chose.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    bio_extended:
      "Formée à l'Université de Heidelberg et au Stanford Center on Longevity, le Dr. Metz a fondé Luminal après avoir identifié l'écart béant entre les traitements cliniques du burnout et les besoins réels des hauts performeurs. Sa méthode intègre les neurosciences contemporaines avec une approche profondément humaine. Elle a accompagné plus de 400 dirigeants et professionnels de haut niveau au cours de la dernière décennie, et publie régulièrement dans des revues de neuropsychologie appliquée.",
  },
  {
    background: "Tradition Zen Rinzai",
    formation: "Temple Myōshin-ji, Kyoto · 30 ans de pratique monastique",
    pratique: "Marche contemplative · Séquences de présence silencieuse",
    quote:
      "Le silence n'est pas l'absence de son. C'est l'espace dans lequel chaque chose peut enfin s'entendre elle-même.",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop",
    bio_extended:
      "Né à Kyoto, Maître Nakano a été ordonné moine à l'âge de 17 ans au temple Myōshin-ji. Après 30 ans de pratique rigoureuse dans la tradition Rinzai, il transmet aujourd'hui l'essence des séquences de marche contemplative et des pratiques de présence silencieuse qui constituent le cœur des retraites Luminal. Sa pédagogie est fondée sur la transmission directe — sans concept, sans effort, par simple présence partagée.",
  },
  {
    background: "Thérapie somatique",
    formation: "Institut Hakomi · Somatic Experiencing Trauma Institute",
    pratique: "Régulation du système nerveux autonome · Libération traumatique",
    quote:
      "Le corps sait déjà comment guérir. Notre travail est de créer les conditions pour qu'il s'en souvienne.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    bio_extended:
      "Formée à l'Institut Hakomi et au Somatic Experiencing Trauma Institute, Elena Rossi travaille depuis 15 ans avec des entrepreneurs, des athlètes et des dirigeants sur la régulation du système nerveux autonome. Ses sessions individuelles sont au cœur de chaque retraite Luminal. Avant de rejoindre Luminal, Elena a travaillé avec des équipes de soins intensifs hospitaliers pour développer des protocoles de prévention du burnout soignant.",
  },
];

export default function LineagePage() {
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const guideImages = [
    GUIDE_EXTENDED[0].image,
    GUIDE_EXTENDED[1].image,
    GUIDE_EXTENDED[2].image,
  ];

  return (
    <div className="min-h-dvh bg-[#f8f5f0]">
      <StyleInjector />

      {/* ==========================================
          HERO
          ========================================== */}
      <section className="pt-24 pb-28 px-6 md:px-12 bg-[#f8f5f0] border-b border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Expertise · Transmission · Présence
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-8 leading-tight"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Nos
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                Guides
              </span>
            </h1>
            <p
              className="max-w-2xl text-lg text-black/50 leading-relaxed"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Trois praticiens de formation exceptionnelle, réunis autour d&apos;une conviction commune : le repos véritable est une compétence qui s&apos;enseigne, et qui se transmet de présence à présence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          GUIDE PROFILES — large format
          ========================================== */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {LINEAGE.map((guide, i) => {
            const ext = GUIDE_EXTENDED[i];
            const isExpanded = expandedGuide === i;

            return (
              <Reveal key={guide.name} delay={i * 0.1}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-sm border border-black/5 shadow-sm hover:shadow-lg transition-shadow duration-400 ${
                    i % 2 === 0 ? "" : "lg:[direction:rtl]"
                  }`}
                >
                  {/* Visual panel */}
                  <div
                    className="lg:col-span-4 relative min-h-[400px] lg:min-h-[520px] bg-[#2a2a2a] flex items-center justify-center overflow-hidden"
                    style={i % 2 !== 0 ? { direction: "ltr" } : {}}
                  >
                    <Image
                      src={guideImages[i]}
                      alt={`Paysage — ${guide.name}`}
                      fill
                      className="object-cover opacity-20 grayscale"
                    />
                    {/* Avatar circle */}
                    <div className="relative z-10 text-center">
                      <div className="w-28 h-28 rounded-full bg-[#3d7a5e]/30 border-2 border-[#3d7a5e]/50 flex items-center justify-center mx-auto mb-6">
                        <span
                          className="text-3xl font-semibold text-[#f8f5f0]"
                          style={{ fontFamily: "Cinzel, Georgia, serif" }}
                        >
                          {guide.avatar}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#3d7a5e] font-sans font-bold px-4">
                        {guide.role}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#f8f5f0]/30 font-sans mt-2 px-6">
                        {ext.background}
                      </p>
                    </div>
                  </div>

                  {/* Text content */}
                  <div
                    className="lg:col-span-8 p-10 md:p-14 bg-white/60 flex flex-col justify-start"
                    style={i % 2 !== 0 ? { direction: "ltr" } : {}}
                  >
                    {/* Index */}
                    <p
                      className="text-6xl font-light text-black/5 leading-none mb-4"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      0{i + 1}
                    </p>

                    <h2
                      className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-[#2a2a2a] mb-2"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {guide.name}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#3d7a5e] font-sans font-bold mb-6">
                      {guide.role}
                    </p>

                    {/* Formation & pratique */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="border-l-2 border-[#3d7a5e]/20 pl-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-sans mb-1">
                          Formation
                        </p>
                        <p
                          className="text-xs text-[#2a2a2a]/70 leading-relaxed"
                          style={{ fontFamily: "Lora, Georgia, serif" }}
                        >
                          {ext.formation}
                        </p>
                      </div>
                      <div className="border-l-2 border-[#3d7a5e]/20 pl-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-sans mb-1">
                          Domaine
                        </p>
                        <p
                          className="text-xs text-[#2a2a2a]/70 leading-relaxed"
                          style={{ fontFamily: "Lora, Georgia, serif" }}
                        >
                          {ext.pratique}
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-[2px] bg-[#3d7a5e]/30 mb-8" />

                    {/* Short bio */}
                    <p
                      className="text-base text-black/60 leading-loose max-w-xl mb-6"
                      style={{ fontFamily: "Lora, Georgia, serif" }}
                    >
                      {guide.bio}
                    </p>

                    {/* Expand button */}
                    <button
                      onClick={() => setExpandedGuide(isExpanded ? null : i)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#3d7a5e] hover:text-[#2a5e45] font-sans font-bold mb-4 bg-transparent border-none cursor-pointer self-start"
                    >
                      {isExpanded ? "Réduire" : "Lire la biographie complète"}
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-black/5 pt-6 mb-6">
                            <p
                              className="text-sm text-black/50 leading-relaxed mb-6"
                              style={{ fontFamily: "Lora, Georgia, serif" }}
                            >
                              {ext.bio_extended}
                            </p>

                            {/* Quote */}
                            <div className="bg-[#3d7a5e]/5 border-l-4 border-[#3d7a5e]/40 pl-6 py-4">
                              <Quote className="w-4 h-4 text-[#3d7a5e]/40 mb-3" />
                              <blockquote
                                className="text-base italic text-[#2a2a2a]/70 leading-relaxed"
                                style={{ fontFamily: "Lora, Georgia, serif" }}
                              >
                                &ldquo;{ext.quote}&rdquo;
                              </blockquote>
                              <p className="text-[9px] uppercase tracking-[0.3em] text-[#3d7a5e] font-sans font-bold mt-3">
                                — {guide.name}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          OUR PHILOSOPHY section
          ========================================== */}
      <section className="py-28 px-6 md:px-12 bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Ce qui nous unit
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#f8f5f0] mb-16"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Notre
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                Philosophie
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "La transmission comme art",
                body: "Chez Luminal, nous croyons que la qualité d'une expérience de transformation dépend entièrement de la qualité de présence du guide. Chacun de nos praticiens a reçu une formation de décennies auprès de maîtres reconnus dans leur discipline.",
              },
              {
                title: "L'héritage comme responsabilité",
                body: "Nos guides portent des lignées vivantes — scientifique, contemplative, somatique. Ils ne transmettent pas des techniques mais une manière d'être. Cela exige intégrité, cohérence, et un engagement de vie envers la pratique personnelle.",
              },
              {
                title: "Le groupe comme catalyseur",
                body: "Limiter chaque retraite à neuf participants n'est pas une contrainte logistique — c'est une décision philosophique. La résonance entre humains en état de présence authentique est elle-même un vecteur de transformation que nos guides orchestrent avec soin.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.15}>
                <div className="border-t border-[#f8f5f0]/10 pt-8">
                  <h3
                    className="text-base font-semibold uppercase tracking-wide text-[#f8f5f0] mb-4"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#f8f5f0]/40 leading-relaxed"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          GUIDE QUOTE STRIP
          ========================================== */}
      <section className="py-24 px-6 md:px-12 bg-[#f8f5f0] border-t border-black/5">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {LINEAGE.map((guide, i) => (
                <div key={guide.name} className="text-center">
                  {/* Avatar small */}
                  <div className="w-12 h-12 rounded-full bg-[#3d7a5e]/10 border border-[#3d7a5e]/20 flex items-center justify-center mx-auto mb-6">
                    <span
                      className="text-xs font-semibold text-[#3d7a5e]"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {guide.avatar}
                    </span>
                  </div>
                  <blockquote
                    className="text-sm italic text-black/50 leading-relaxed mb-4"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    &ldquo;{GUIDE_EXTENDED[i].quote}&rdquo;
                  </blockquote>
                  <p
                    className="text-[9px] uppercase tracking-[0.3em] text-[#3d7a5e] font-sans font-bold"
                  >
                    {guide.name}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          CTA
          ========================================== */}
      <section className="py-24 px-6 md:px-12 text-center bg-[#f8f5f0] border-t border-black/5">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <p
              className="text-2xl md:text-3xl font-light italic text-[#2a2a2a]/60 mb-10"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Rencontrez nos guides lors d&apos;un appel d&apos;exploration de 45 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/templates/impact-59/apply"
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-[#2a5e45] transition-colors rounded-full shadow-lg"
                style={{ textDecoration: "none" }}
              >
                Candidater maintenant
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/templates/impact-59/retreats"
                className="inline-flex items-center gap-3 px-12 py-5 border border-black/10 text-[#2a2a2a] text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-black hover:text-white transition-colors rounded-full"
                style={{ textDecoration: "none" }}
              >
                Voir les retraites
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
