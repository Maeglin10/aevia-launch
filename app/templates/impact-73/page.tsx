// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Radio,
  Eye,
  Zap,
  Users,
  DollarSign,
  Server,
  Star,
  Check,
  ArrowRight,
  Play,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Reveal, MagneticBtn, Counter, STREAMS, CREATORS } from "./shared";

const TIERS = [
  {
    name: "Basic",
    price: "Gratuit",
    priceNum: 0,
    highlight: false,
    features: [
      "720p jusqu'à 30 FPS",
      "1 Go de stockage VOD",
      "Monétisation basique",
      "Chat en direct",
      "Analytics de base",
    ],
    cta: "Démarrer gratuitement",
  },
  {
    name: "Pro",
    price: "9,99€",
    priceNum: 9.99,
    highlight: true,
    features: [
      "4K 60 FPS sans compression",
      "100 Go de stockage VOD",
      "Monétisation avancée + tips",
      "Chat + modération IA",
      "Analytics temps réel",
      "Badge Créateur vérifié",
    ],
    cta: "Passer en Pro",
  },
  {
    name: "Ultra",
    price: "19,99€",
    priceNum: 19.99,
    highlight: false,
    features: [
      "8K HDR 120 FPS",
      "Stockage illimité",
      "Revenus prioritaires (paiement J+1)",
      "Multi-stream 4 plateformes",
      "Manager dédié",
      "API accès complet",
      "Dashboard revenus avancé",
    ],
    cta: "Devenir Ultra",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "En 6 mois sur Glitch Unit, j'ai quadruplé mes revenus. La qualité 4K attire des audiences que les autres plateformes n'ont pas. C'est la seule plateforme qui me respecte.",
    name: "AURA_VOID",
    role: "Créateur musical — 1,2M abonnés",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&q=80",
    earnings: "+340% revenus",
  },
  {
    quote:
      "Le paiement direct J+1 a changé ma vie. Plus d'attente de 30 jours. Plus d'intermédiaires. Je stream, je gagne, point final.",
    name: "GLITCH_ONE",
    role: "Gamer professionnel — 2,4M abonnés",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    earnings: "28,1K viewers en pic",
  },
  {
    quote:
      "La qualité de l'image est incomparable. Mes cours de yoga en 4K ont converti 3x plus d'abonnés premium. Glitch Unit comprend les créateurs de contenu wellness.",
    name: "MAYA_ZEN",
    role: "Coach Wellness — 850K abonnés",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80",
    earnings: "x3 conversions premium",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Crée ton canal",
    desc: "Configure ta chaîne en moins de 5 minutes. Personnalise ton profil, ton branding et tes options de monétisation dès le départ.",
    icon: <Server className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "Go live",
    desc: "Lance ton stream avec notre encodeur ultra-low latency. Compatible OBS, StreamElements et toutes les solutions pro du marché.",
    icon: <Radio className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Encaisse",
    desc: "Abonnements, tips, publicités algorithmiques : tes revenus arrivent directement sur ton compte sous 24h. Pas d'intermédiaire.",
    icon: <DollarSign className="w-5 h-5" />,
  },
];

const TOP_CREATORS = [
  {
    name: "AURA_VOID",
    specialty: "Musique & Production",
    followers: "1,2M",
    earnings: "12 400€ / mois",
    badge: "TOP EARNER",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    badgeColor: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  },
  {
    name: "GLITCH_ONE",
    specialty: "Gaming compétitif",
    followers: "2,4M",
    earnings: "31 200€ / mois",
    badge: "#1 GAMING",
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&q=80",
    badgeColor: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  },
  {
    name: "MAYA_ZEN",
    specialty: "Wellness & Méditation",
    followers: "850K",
    earnings: "8 700€ / mois",
    badge: "RISING STAR",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  },
];

export default function StreamHubHome() {
  const heroRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="w-full bg-[#06080d]">
      {/* ==========================================
          1. HERO (Cyber-Entertainment)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-7rem)] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
            alt="StreamHub Hero"
            fill
            className="object-cover brightness-[0.2] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#06080d]/40 to-transparent" />
        </motion.div>

        {/* GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(229,0,76,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(229,0,76,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-600/10 rounded-md border border-rose-600/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Radio className="w-3.5 h-3.5" />
              Live: 8K HDR 120FPS Deployment Complete
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              Own The <br />{" "}
              <span className="text-rose-500 italic">Spectrum.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/30 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Ultra-low latency streaming for the modern creator. Zero
              compression. Infinite scale. Direct-to-creator monetization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-73/browse" className="no-underline">
                <MagneticBtn className="px-12 py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-rose-500 transition-all cursor-pointer shadow-2xl shadow-rose-600/20 border-none">
                  Join The Stream
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-73/contact" className="no-underline">
                <button className="px-12 py-5 border border-white/10 bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-white hover:text-black transition-all cursor-pointer">
                  Partner_Inquiry
                </button>
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block"
        >
          <div className="flex flex-col items-start gap-3">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              STREAM_HUB_OS // V8.4.2
            </span>
            <div className="w-32 h-[1px] bg-rose-500/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. LIVE COUNTER BAND
          ========================================== */}
      <section className="py-14 bg-[#0a0c12] border-y border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
            {[
              {
                icon: <Eye className="w-4 h-4" />,
                label: "En ligne maintenant",
                to: 142960,
                suffix: "",
                color: "text-rose-500",
              },
              {
                icon: <DollarSign className="w-4 h-4" />,
                label: "Versés ce mois",
                to: 2400000,
                prefix: "$",
                suffix: "",
                color: "text-emerald-400",
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: "Créateurs actifs",
                to: 38000,
                suffix: "+",
                color: "text-cyan-400",
              },
              {
                icon: <Server className="w-4 h-4" />,
                label: "Uptime garanti",
                to: 9997,
                suffix: "%",
                color: "text-yellow-400",
              },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center md:items-start md:px-10 gap-3">
                  <div className={`${stat.color} flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest`}>
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    <Counter
                      to={stat.to}
                      prefix={stat.prefix ?? ""}
                      suffix={stat.suffix}
                    />
                    {stat.to === 9997 && (
                      <span className="text-[10px] text-white/20 ml-1 font-bold normal-case tracking-normal">
                        (÷100)
                      </span>
                    )}
                  </div>
                  <div className="w-8 h-[1px] bg-rose-500/30" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURED STREAMS GRID
          ========================================== */}
      <section className="py-24 bg-[#06080d]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-3">
                  // STREAMS EN DIRECT
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                  Sur scène <br />
                  <span className="text-white/20">maintenant.</span>
                </h2>
              </div>
              <Link href="/templates/impact-73/browse" className="no-underline hidden md:block">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-rose-400 transition-colors cursor-pointer group">
                  Voir tout
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STREAMS.map((stream, i) => (
              <Reveal key={stream.id} delay={i * 0.08}>
                <div className="group relative rounded-lg overflow-hidden bg-[#0d0f17] border border-white/5 hover:border-rose-500/30 transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={stream.img}
                      alt={stream.title}
                      fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent" />
                    {/* LIVE badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 rounded text-[9px] font-black uppercase tracking-widest text-white">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    {/* Viewers */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold text-white/80">
                      <Eye className="w-2.5 h-2.5" />
                      {stream.viewers}
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-rose-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                      {stream.streamer}
                    </p>
                    <p className="text-sm font-bold text-white/80 leading-tight line-clamp-2">
                      {stream.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {stream.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/5 text-white/40 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. CREATOR TIERS / PRICING
          ========================================== */}
      <section className="py-24 bg-[#0a0c12] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-4">
                // PLANS CRÉATEURS
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Choisis ton <span className="text-rose-500">niveau.</span>
              </h2>
              <p className="mt-4 text-white/30 text-sm uppercase tracking-wide font-bold max-w-md mx-auto">
                Commence gratuitement. Évolue quand tu veux. Pas d'engagement.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col p-8 rounded-lg border transition-all duration-300 ${
                    tier.highlight
                      ? "bg-rose-600/10 border-rose-500/40 shadow-2xl shadow-rose-600/10"
                      : "bg-[#0d0f17] border-white/5 hover:border-white/10"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded">
                      PLUS POPULAIRE
                    </div>
                  )}
                  <div className="mb-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">
                      {tier.name}
                    </div>
                    <div className="text-5xl font-black text-white tracking-tighter">
                      {tier.price}
                      {tier.priceNum > 0 && (
                        <span className="text-base text-white/30 font-bold ml-1">
                          /mois
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="flex-1 space-y-3 mb-10">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check
                          className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                            tier.highlight ? "text-rose-400" : "text-white/40"
                          }`}
                        />
                        <span className="text-xs font-bold text-white/60 uppercase tracking-wide">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] rounded transition-all cursor-pointer ${
                      tier.highlight
                        ? "bg-rose-600 hover:bg-rose-500 text-white border-none"
                        : "bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. HOW IT WORKS — 3 STEPS
          ========================================== */}
      <section className="py-24 bg-[#06080d] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-20">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-4">
                // COMMENT ÇA MARCHE
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Trois étapes. <span className="text-white/20">C'est tout.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent pointer-events-none" />
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.15}>
                <div className="relative flex flex-col items-center text-center p-10 group">
                  <div className="w-16 h-16 rounded-full border border-rose-500/30 flex items-center justify-center mb-8 bg-rose-600/5 text-rose-400 group-hover:border-rose-500/60 group-hover:bg-rose-600/10 transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-rose-500/60 mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4 italic">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/30 leading-relaxed font-bold uppercase tracking-wide">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. CREATOR SPOTLIGHT
          ========================================== */}
      <section className="py-24 bg-[#0a0c12] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-4">
                // CRÉATEURS SPOTLIGHT
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Ils ont choisi <br />
                <span className="text-rose-500">Glitch Unit.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_CREATORS.map((creator, i) => (
              <Reveal key={creator.name} delay={i * 0.1}>
                <div className="group relative rounded-lg overflow-hidden bg-[#0d0f17] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={creator.img}
                      alt={creator.name}
                      fill
                      className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-[#0d0f17]/20 to-transparent" />
                    <div className={`absolute top-4 right-4 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${creator.badgeColor}`}>
                      {creator.badge}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-1">
                        {creator.specialty}
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                        {creator.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">
                          Abonnés
                        </div>
                        <div className="text-lg font-black text-white tracking-tighter">
                          {creator.followers}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">
                          Revenus
                        </div>
                        <div className="text-lg font-black text-emerald-400 tracking-tighter">
                          {creator.earnings}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. TESTIMONIALS
          ========================================== */}
      <section className="py-24 bg-[#06080d] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-4">
                // TÉMOIGNAGES
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Ils parlent. <span className="text-white/20">On écoute.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="flex flex-col justify-between h-full p-8 bg-[#0d0f17] border border-white/5 rounded-lg hover:border-white/10 transition-all">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-rose-500 text-rose-500" />
                      ))}
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed font-bold italic mb-8">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={t.img} alt={t.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white">
                        {t.name}
                      </div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wide font-bold">
                        {t.role}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                      {t.earnings}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FAQ
          ========================================== */}
      <section className="py-24 bg-[#08090f] border-t border-white/5">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-4">// FAQ</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Tes questions.<br /><span className="text-white/20">Nos réponses.</span>
              </h2>
            </div>
          </Reveal>
          <div className="divide-y divide-white/5">
            {[
              { q: "Est-ce que Glitch Unit est vraiment gratuit ?", a: "Oui — créer un compte, diffuser en HD, et rejoindre une communauté de créateurs est 100% gratuit. On se rémunère uniquement via les abonnements Tier payants (Studio et Legend) qui débloquent des outils avancés : analytics temps réel, export brut, boutique intégrée." },
              { q: "Combien puis-je gagner sur la plateforme ?", a: "Ça dépend de ton audience et de ta fréquence. Nos données montrent que les créateurs actifs (8+ streams/mois) gagnent en moyenne 2 300€/mois. Les Tier Legend avec une audience fidèle dépassent régulièrement 8 000€/mois via abonnements, tips et boutique." },
              { q: "Quelle est la qualité maximale de diffusion ?", a: "Glitch Unit prend en charge jusqu'à 8K 120FPS avec encodage AV1 hardware-accelerated. En pratique, 95% de nos créateurs streamront en 4K 60FPS — suffisant pour une expérience premium sur tous les écrans." },
              { q: "Comment fonctionne le paiement des revenus ?", a: "Les revenus sont versés chaque 7 jours sur le compte bancaire de ton choix (SEPA/SWIFT). Aucun seuil minimum de paiement. On prend 8% de commission — contre 30-50% chez les plateformes traditionnelles." },
              { q: "Puis-je diffuser simultanément sur d'autres plateformes ?", a: "Oui. On appelle ça le multi-stream. Depuis ton tableau de bord Glitch Unit, tu peux rediffuser simultanément vers Twitch, YouTube, ou toute destination RTMP. Ton audience principale reste sur Glitch, les autres canaux amplifient ta portée." },
              { q: "Qu'est-ce qui différencie Glitch Unit de Twitch ou YouTube ?", a: "Trois choses. Premièrement, l'économie : 92% des revenus te reviennent. Deuxièmement, la qualité : 8K natif sans compression agressive. Troisièmement, la communauté : on est spécialisé gaming et tech — pas un généraliste qui noie ta niche." },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="py-8 group">
                  <h4 className="text-sm font-black text-white uppercase tracking-wide mb-4 group-hover:text-rose-400 transition-colors">{faq.q}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CTA — EMAIL SIGNUP
          ========================================== */}
      <section className="py-32 bg-[#0a0c12] border-t border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-rose-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-6">
              // START STREAMING
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white italic mb-6">
              C'est gratuit.
              <br />
              <span className="text-rose-500">Lance-toi.</span>
            </h2>
            <p className="text-white/30 text-sm uppercase font-bold tracking-wide mb-12">
              Rejoins 38 000 créateurs qui ont choisi la liberté.
              <br />
              Aucune carte de crédit requise.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-bold uppercase tracking-widest">
                <Check className="w-4 h-4" />
                Merci, nous vous répondrons sous 24h.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded text-white text-sm font-bold placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded transition-all cursor-pointer border-none whitespace-nowrap"
                >
                  Démarrer
                </button>
              </form>
            )}

            <div className="mt-8 flex items-center justify-center gap-6 text-[9px] text-white/20 uppercase tracking-widest font-bold">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Sans engagement
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Paiement J+1
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                8K 120FPS
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
