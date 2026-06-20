"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  RETREATS,
  LINEAGE,
  SCIENTIFIC_PILLARS,
  Reveal,
  Counter,
  StyleInjector,
} from "./shared";

export default function LuminalHome() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div>
      <StyleInjector />

      {/* ==========================================
          1. HERO (Atmospheric)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-112px)] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://picsum.photos/seed/wellness/1600/1000"
            alt="Wellness Hero"
            fill
            className="object-cover grayscale brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-[#3d7a5e] mb-8 block font-sans">
              Maximum 9 Participants · No Devices
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[1.15] pb-4 tracking-tighter mb-12 uppercase font-serif">
              Rest is <br />{" "}
              <span className="italic font-light">the work.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-black/50 leading-relaxed font-light mb-12">
              Luminal designs profound retreat experiences in the world&apos;s most
              transformative landscapes. We create the conditions for genuine
              rest through carefully calibrated stillness.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 font-sans">
              <Link href="/templates/impact-59/retreats" className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-[#3d7a5e] transition-all cursor-pointer shadow-xl text-center" style={{ textDecoration: "none" }}>
                Explore 2026 Programme
              </Link>
              <Link href="/templates/impact-59/method" className="px-12 py-5 border border-black/10 text-black text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-black hover:text-white transition-all cursor-pointer text-center" style={{ textDecoration: "none" }}>
                The Luminal Method
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-sans">
              Descend into Stillness
            </span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. RETREAT TEASERS
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Programme 2026
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-20 text-[#2a2a2a]"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Trois paysages.
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                Une seule méthode.
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RETREATS.map((retreat, i) => (
              <Reveal key={retreat.id} delay={i * 0.15}>
                <Link href="/templates/impact-59/retreats" style={{ textDecoration: "none" }}>
                  <div className="group relative overflow-hidden rounded-sm cursor-pointer bg-white/30 border border-black/5 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl">
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={retreat.img}
                        alt={retreat.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      {/* Sage green overlay on hover */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#3d7a5e]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      {/* Theme badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-[#f8f5f0]/90 text-[#2a2a2a] text-[9px] uppercase tracking-[0.35em] font-bold font-sans">
                          {retreat.theme}
                        </span>
                      </div>
                      {/* Price on hover */}
                      <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <span className="text-white text-sm font-light" style={{ fontFamily: "Lora, Georgia, serif" }}>
                          {retreat.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-semibold uppercase tracking-wide text-[#2a2a2a] mb-2"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {retreat.name}
                      </h3>
                      <p className="text-xs text-black/40 uppercase tracking-[0.3em] font-sans mb-3">
                        {retreat.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/50 font-sans">
                          {retreat.duration} · {retreat.season}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#3d7a5e] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-16">
              <Link
                href="/templates/impact-59/retreats"
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#2a2a2a] border-b border-[#2a2a2a]/20 pb-1 hover:border-[#3d7a5e] hover:text-[#3d7a5e] transition-all font-sans font-bold"
                style={{ textDecoration: "none" }}
              >
                Voir toutes les retraites
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          3. THE LUMINAL METHOD TEASER
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#2a2a2a] text-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <Reveal>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
                  Science · Contemplation · Corps
                </p>
                <h2
                  className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8 text-[#f8f5f0]"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  La Méthode
                  <br />
                  <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                    Luminale
                  </span>
                </h2>
                <p
                  className="text-[#f8f5f0]/70 text-lg leading-relaxed mb-6"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  Développée par le Dr. Clara Metz après une décennie de recherche clinique sur le burnout, la Méthode Luminale intègre les dernières découvertes en neurosciences avec des pratiques contemplatives éprouvées.
                </p>
                <p
                  className="text-[#f8f5f0]/50 text-base leading-relaxed mb-12"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  Chaque protocole est conçu pour agir simultanément sur le système nerveux, le rythme circadien et la mémoire somatique — les trois vecteurs d&apos;un repos véritable et durable.
                </p>

                {/* Scientific pillars */}
                <div className="space-y-6">
                  {SCIENTIFIC_PILLARS.map((pillar, i) => (
                    <Reveal key={pillar.title} delay={i * 0.1}>
                      <div className="flex items-start gap-4 border-t border-[#f8f5f0]/10 pt-6">
                        <div className="text-[#3d7a5e] flex-shrink-0 mt-0.5">
                          {pillar.icon}
                        </div>
                        <div>
                          <h4
                            className="text-sm font-semibold uppercase tracking-wider text-[#f8f5f0] mb-1"
                            style={{ fontFamily: "Cinzel, Georgia, serif" }}
                          >
                            {pillar.title}
                          </h4>
                          <p className="text-[#f8f5f0]/50 text-sm leading-relaxed font-sans">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={0.4}>
                  <Link
                    href="/templates/impact-59/method"
                    className="inline-flex items-center gap-3 mt-12 text-[10px] uppercase tracking-[0.4em] text-[#f8f5f0] border-b border-[#f8f5f0]/20 pb-1 hover:border-[#3d7a5e] hover:text-[#3d7a5e] transition-all font-sans font-bold"
                    style={{ textDecoration: "none" }}
                  >
                    Explorer la méthode
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Reveal>
              </Reveal>
            </div>

            {/* Right: image */}
            <Reveal delay={0.2}>
              <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop"
                  alt="La méthode Luminale — nature et méditation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/40 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. STATISTICS
          ========================================== */}
      <section className="py-28 px-6 md:px-12 bg-[#f8f5f0] border-y border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
            {[
              { value: 9, suffix: "", label: "Participants maximum\npar retraite" },
              { value: 27, suffix: "", label: "Retraites\naccompagnées" },
              { value: 94, suffix: "%", label: "Taux de retour\nsaison suivante" },
              { value: 3, suffix: "", label: "Paysages\ntransformateurs" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div
                    className="text-6xl md:text-7xl font-light text-[#2a2a2a] mb-4"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-sans leading-loose whitespace-pre-line">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-16 font-sans font-bold text-center">
              Témoignages
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                quote: "Luminal m'a rendu à moi-même après 15 ans de performance intense. Je suis rentrée différente — pas reposée, transformée.",
                name: "Caroline V.",
                role: "CEO, Paris",
              },
              {
                quote: "Rien de comparable à Sonoran. Le silence comme je ne l'avais jamais entendu. Une expérience qui redéfinit ce que signifie être présent.",
                name: "Thomas M.",
                role: "Partner, McKinsey",
              },
              {
                quote: "La méthode Nakano a changé ma relation au temps. Je travaille moins vite, et j'accomplis infiniment plus.",
                name: "Isabelle K.",
                role: "Architecte",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="flex flex-col h-full">
                  <div className="text-[#3d7a5e]/30 text-6xl leading-none mb-6 font-serif">&ldquo;</div>
                  <blockquote
                    className="text-xl md:text-2xl font-light italic text-[#2a2a2a] leading-relaxed flex-1"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    {t.quote}
                  </blockquote>
                  <div className="mt-8 pt-6 border-t border-black/10">
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2a2a2a]"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs text-black/40 uppercase tracking-[0.2em] font-sans mt-1">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. LINEAGE TEASER
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#2a2a2a]/5 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Expertise · Transmission · Soin
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-16 text-[#2a2a2a]"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Nos Guides
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {LINEAGE.map((guide, i) => (
              <Reveal key={guide.name} delay={i * 0.15}>
                <Link href="/templates/impact-59/lineage" style={{ textDecoration: "none" }}>
                  <div className="group flex items-start gap-5 p-6 border border-black/5 bg-white/50 hover:bg-white hover:border-[#3d7a5e]/20 hover:shadow-md transition-all duration-400 rounded-sm cursor-pointer">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-[#3d7a5e]/10 border border-[#3d7a5e]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3d7a5e]/20 transition-colors duration-300">
                      <span
                        className="text-sm font-semibold text-[#3d7a5e]"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {guide.avatar}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-base font-semibold uppercase tracking-wide text-[#2a2a2a] mb-1"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {guide.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#3d7a5e] font-sans mb-3">
                        {guide.role}
                      </p>
                      <p className="text-sm text-black/50 leading-relaxed font-sans">
                        {guide.bio.split(".")[0]}.
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-14">
              <Link
                href="/templates/impact-59/lineage"
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#2a2a2a] border-b border-[#2a2a2a]/20 pb-1 hover:border-[#3d7a5e] hover:text-[#3d7a5e] transition-all font-sans font-bold"
                style={{ textDecoration: "none" }}
              >
                Rencontrer nos guides
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          7. METHODOLOGY
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#2a2a2a] text-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">Approche · Méthode</p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-20 leading-tight" style={{ fontFamily: "Cinzel, Georgia, serif" }}>
              La Méthode<br /><span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>Nakano</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            {[
              { num: "I", title: "Déprogrammation", desc: "Les trois premiers jours visent à interrompre les schémas cognitifs habituels. Pas de téléphone, pas d'agenda, pas de structure imposée. La transition vers la présence exige du désordre avant la clarté." },
              { num: "II", title: "Intégration Somatique", desc: "La méthode Nakano positionne le corps comme porte d'entrée principale vers la conscience. Sessions de mouvement quotidiennes — lentes, intuitives, non-performatives — pour reconnecter pensée et sensation." },
              { num: "III", title: "Silence Structuré", desc: "Des périodes de silence total, allant de deux heures à une journée entière selon la retraite. Non pas comme privation, mais comme espace de perception. Ce que vous entendez dans le silence vous appartient." },
              { num: "IV", title: "Intégration & Retour", desc: "Le dernier jour est entièrement consacré à la transition vers le quotidien. Avec votre guide, vous construisez une 'boussole d'intégration' — trois pratiques concrètes à ancrer dans votre vie post-retraite." },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <div className="flex gap-8">
                  <div className="flex-shrink-0 w-10 h-10 border border-[#3d7a5e]/30 flex items-center justify-center">
                    <span className="text-[#3d7a5e] font-bold text-sm" style={{ fontFamily: "Cinzel, Georgia, serif" }}>{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold uppercase tracking-wide mb-3" style={{ fontFamily: "Cinzel, Georgia, serif" }}>{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="border-t border-white/10 pt-12">
              <p className="text-sm text-white/40 font-sans italic leading-relaxed max-w-2xl" style={{ fontFamily: "Lora, Georgia, serif" }}>
                "La transformation ne survient pas pendant la retraite. Elle survient dans les semaines qui suivent, lorsque vous réalisez que vous réagissez différemment à ce qui ne changeait jamais."
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#3d7a5e] mt-4 font-sans">— Dr Yuki Nakano, fondatrice de la méthode</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          8. PROCESS — CANDIDATURE
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-[#f8f5f0] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">Processus</p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-20" style={{ fontFamily: "Cinzel, Georgia, serif" }}>Comment ça fonctionne</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Candidature", desc: "Remplissez le formulaire de candidature (15 min). Aucun prérequis en méditation ou pratique contemplative — seulement une disposition sincère à ralentir." },
              { num: "02", title: "Entretien", desc: "Un échange de 30 minutes avec l'un de nos guides pour s'assurer que la retraite sélectionnée correspond à votre moment de vie. Confidentiel, sans engagement." },
              { num: "03", title: "Confirmation", desc: "Si la retraite vous convient, confirmation sous 48h. Un acompte de 30% réserve votre place. Le solde est dû 30 jours avant le départ." },
              { num: "04", title: "Préparation", desc: "Deux semaines avant la retraite, vous recevez un guide de préparation : pratiques recommandées, liste de ce qu'il faut (et ne faut pas) apporter, et une lettre personnalisée de votre guide." },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <div>
                  <div className="text-5xl font-light text-[#3d7a5e]/20 mb-6" style={{ fontFamily: "Cinzel, Georgia, serif" }}>{s.num}</div>
                  <div className="w-8 h-[1px] bg-[#3d7a5e]/30 mb-6" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-[#2a2a2a]" style={{ fontFamily: "Cinzel, Georgia, serif" }}>{s.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed font-sans">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FAQ
          ========================================== */}
      <section className="py-32 px-6 md:px-12 bg-white border-t border-black/5">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">Questions fréquentes</p>
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-20 text-[#2a2a2a]" style={{ fontFamily: "Cinzel, Georgia, serif" }}>Ce qu'on nous pose.</h2>
          </Reveal>
          <div className="space-y-0 divide-y divide-black/8">
            {[
              { q: "Dois-je avoir une expérience en méditation ?", a: "Non. La plupart de nos participants n'avaient aucune pratique contemplative avant leur première retraite Luminal. Nos guides adaptent leur accompagnement à votre point de départ. Ce qui est nécessaire, c'est une curiosité sincère — pas une expérience préalable." },
              { q: "Que se passe-t-il si je dois annuler ?", a: "Vous pouvez annuler jusqu'à 30 jours avant la retraite avec remboursement intégral (hors frais de traitement). Entre 15 et 30 jours, nous remboursons 50% ou transférons votre réservation à une date ultérieure. Aucun remboursement pour les annulations dans les 15 jours précédant le départ." },
              { q: "Les retraites sont-elles adaptées aux personnes souffrant d'anxiété ?", a: "Oui — beaucoup de nos participants viennent précisément pour cette raison. Notre approche n'est pas thérapeutique au sens clinique du terme, mais nos guides sont formés pour accompagner les états de vulnérabilité émotionnelle avec bienveillance et compétence. Si vous suivez un traitement psychiatrique, merci de nous le préciser dans votre candidature." },
              { q: "Quelle est la différence entre vos retraites et d'autres offres similaires ?", a: "La plupart des retraites de bien-être proposent un programme chargé — yoga à 6h, conférences, activités, méditations guidées. Luminal fait l'inverse : nous retirons. Moins de structure, plus d'espace. Nos retraites ne sont pas des expériences à cocher, mais des processus à traverser." },
              { q: "Y a-t-il des régimes alimentaires accommodés ?", a: "Tous nos repas sont à base de plantes, biologiques et préparés sur place. Nous accommodons toutes les intolérances alimentaires et allergies — précisez-les dans votre candidature. Aucun alcool ni caféine pendant la retraite (l'abstinence fait partie de l'expérience)." },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="py-8 group">
                  <h4 className="text-base font-semibold text-[#2a2a2a] mb-4 uppercase tracking-wide" style={{ fontFamily: "Cinzel, Georgia, serif" }}>{faq.q}</h4>
                  <p className="text-sm text-black/45 leading-relaxed font-sans">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          10. FINAL CTA
          ========================================== */}
      <section className="py-40 px-6 md:px-12 bg-[#f8f5f0] border-t border-black/5 text-center">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-8 font-sans font-bold">
              Candidatures ouvertes — Places limitées
            </p>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight mb-8 text-[#2a2a2a] leading-tight"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Rejoindre le
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                Programme 2026.
              </span>
            </h2>
            <p
              className="text-lg text-black/50 leading-relaxed mb-14 max-w-lg mx-auto"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Maximum 9 participants par retraite. Candidatures examinées individuellement. Réponse sous 48 heures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/templates/impact-59/apply"
                className="px-12 py-5 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-[#2a5e45] transition-all cursor-pointer shadow-xl font-sans"
                style={{ textDecoration: "none" }}
              >
                Candidater maintenant →
              </Link>
              <Link
                href="/templates/impact-59/retreats"
                className="px-12 py-5 border border-black/15 text-[#2a2a2a] text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-black hover:text-white transition-all cursor-pointer font-sans"
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
