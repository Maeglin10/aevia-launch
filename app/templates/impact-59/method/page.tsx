"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import {
  SCIENTIFIC_PILLARS,
  APPLICATION_STEPS,
  Reveal,
  StyleInjector,
} from "../shared";

export default function MethodPage() {
  return (
    <div className="min-h-dvh bg-[#f8f5f0]">
      <StyleInjector />

      {/* ==========================================
          HERO
          ========================================== */}
      <section className="relative pt-24 pb-32 px-6 md:px-12 overflow-hidden bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <Reveal>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
                  Science · Contemplation · Corps
                </p>
                <h1
                  className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#f8f5f0] mb-8 leading-tight"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  La Méthode
                  <br />
                  <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                    Luminale
                  </span>
                </h1>
                <p
                  className="text-[#f8f5f0]/50 text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  Une approche fondée sur dix ans de recherche clinique en neurosciences du stress, intégrant des pratiques contemplatives de tradition Zen et somatique.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="hidden lg:block text-right">
                <p
                  className="text-[#f8f5f0]/20 text-sm leading-loose max-w-sm ml-auto"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  &ldquo;Nous n&apos;offrons pas du repos. Nous créons les conditions pour que le repos devienne possible.&rdquo;
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#3d7a5e] mt-4 font-sans font-bold">
                  — Dr. Clara Metz, Fondatrice
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Background decorative lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-[1px] h-full bg-white ml-auto" style={{ left: "60%" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
        </div>
      </section>

      {/* ==========================================
          SCIENTIFIC PILLARS — 3 tall cards
          ========================================== */}
      <section className="py-28 px-6 md:px-12 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Les trois piliers
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-20"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Fondements
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                scientifiques
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCIENTIFIC_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white border border-black/5 p-10 shadow-sm flex flex-col h-full min-h-[400px] rounded-sm"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#3d7a5e]/10 rounded-full flex items-center justify-center text-[#3d7a5e] mb-8 flex-shrink-0">
                    {pillar.icon}
                  </div>

                  {/* Number */}
                  <p
                    className="text-6xl font-light text-black/5 leading-none mb-6"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    0{i + 1}
                  </p>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold uppercase tracking-wide text-[#2a2a2a] mb-4"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {pillar.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-8 h-[2px] bg-[#3d7a5e]/30 mb-6" />

                  {/* Description */}
                  <p
                    className="text-sm text-black/50 leading-relaxed flex-1"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    {pillar.desc}
                  </p>

                  {/* Footer label */}
                  <div className="mt-8 pt-6 border-t border-black/5">
                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#3d7a5e] font-sans font-bold">
                      Pilier {i + 1} de la méthode
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          APPLICATION STEPS — numbered process
          ========================================== */}
      <section className="py-28 px-6 md:px-12 bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Le processus
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#f8f5f0] mb-20"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Comment
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                nous commençons
              </span>
            </h2>
          </Reveal>

          {/* Steps with connecting visual */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-[#f8f5f0]/10" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 relative">
              {APPLICATION_STEPS.map((step, i) => (
                <Reveal key={step.step} delay={i * 0.12}>
                  <div className="relative">
                    {/* Step number node */}
                    <div className="flex items-center gap-4 mb-6 lg:flex-col lg:items-start lg:gap-0">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-[#f8f5f0]/5 border border-[#f8f5f0]/10 flex items-center justify-center lg:mb-8">
                          <span
                            className="text-2xl font-light text-[#3d7a5e]"
                            style={{ fontFamily: "Cinzel, Georgia, serif" }}
                          >
                            {step.step}
                          </span>
                        </div>
                      </div>

                      {/* Arrow (mobile only, between steps) */}
                      {i < APPLICATION_STEPS.length - 1 && (
                        <div className="lg:hidden">
                          <ArrowRight className="w-4 h-4 text-[#f8f5f0]/20" />
                        </div>
                      )}
                    </div>

                    <h3
                      className="text-lg font-bold uppercase tracking-wide text-[#f8f5f0] mb-3"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm text-[#f8f5f0]/40 leading-relaxed"
                      style={{ fontFamily: "Lora, Georgia, serif" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.5}>
            <div className="mt-16 pt-12 border-t border-[#f8f5f0]/10 text-center">
              <Link
                href="/templates/impact-59/apply"
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-[#2a5e45] transition-colors rounded-full"
                style={{ textDecoration: "none" }}
              >
                Démarrer le processus
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          QUOTE BLOCK — Dr. Clara Metz
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#f8f5f0]">
        <div className="max-w-[1000px] mx-auto text-center">
          <Reveal>
            <Quote className="w-8 h-8 text-[#3d7a5e]/30 mx-auto mb-10" />
            <blockquote
              className="text-2xl md:text-4xl font-light italic text-[#2a2a2a] leading-relaxed mb-10"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              &ldquo;Le repos véritable n&apos;est pas l&apos;absence d&apos;activité. C&apos;est la présence totale à soi-même.&rdquo;
            </blockquote>
            <div className="w-12 h-[1px] bg-[#3d7a5e]/30 mx-auto mb-6" />
            <p
              className="text-xs uppercase tracking-[0.4em] text-[#3d7a5e] font-sans font-bold"
            >
              Dr. Clara Metz · Fondatrice & Lead Clinicienne
            </p>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          METHOD + NATURE IMAGE SPLIT
          ========================================== */}
      <section className="px-6 md:px-12 pb-28 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Image */}
            <Reveal>
              <div className="relative h-[500px] rounded-sm overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop"
                  alt="Paysage de montagne — méthode Luminale"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/30 to-transparent" />
              </div>
            </Reveal>

            {/* Text panel */}
            <Reveal delay={0.15}>
              <div className="bg-[#2a2a2a] text-[#f8f5f0] p-10 md:p-14 flex flex-col justify-between h-[500px] rounded-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
                    Pourquoi le paysage
                  </p>
                  <h3
                    className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#f8f5f0] mb-6"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    Le terrain comme
                    <br />
                    <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                      thérapeute premier
                    </span>
                  </h3>
                  <p
                    className="text-[#f8f5f0]/50 text-sm leading-relaxed mb-6"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    Les neurosciences confirment ce que les traditions contemplatives savent depuis des millénaires : l&apos;environnement physique façonne l&apos;état mental. Chaque paysage Luminal est choisi pour ses propriétés spécifiques — acoustiques, visuelles, thermiques — qui agissent directement sur le système nerveux.
                  </p>
                  <p
                    className="text-[#f8f5f0]/30 text-sm leading-relaxed"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    Le désert de Sonoran réduit la stimulation sensorielle. Les fjords islandais introduisent la clarté de la lumière nordique. Les forêts de bambou d&apos;Arashiyama induisent un état de présence particulier par leur mouvement et leur son.
                  </p>
                </div>
                <Link
                  href="/templates/impact-59/retreats"
                  className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#f8f5f0]/60 hover:text-[#3d7a5e] transition-colors font-sans font-bold mt-8"
                  style={{ textDecoration: "none" }}
                >
                  Découvrir les paysages
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
