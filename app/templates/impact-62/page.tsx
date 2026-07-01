// @ts-nocheck
"use client";

import React, {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Reveal, MagneticBtn, Counter, MENUS, WINE_PAIRINGS, ARTISANS } from "./shared";

// ── Testimonials data ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Chaque bouchée racontait une histoire que je n'aurais jamais imaginé pouvoir goûter. Le pigeon en deux services restera gravé dans ma mémoire pour des années.",
    author: "Camille D.",
    initials: "CD",
    role: "Cliente fidèle depuis 2019",
  },
  {
    quote:
      "Anatol Voss possède ce don rare de transformer la braise en poésie. Le menu dégustation est une œuvre d'art totale — du premier amuse-bouche au soufflé final.",
    author: "Édouard M.",
    initials: "EM",
    role: "Critique gastronomique",
  },
  {
    quote:
      "Une table privée pour notre anniversaire de mariage. Le service, le silence, les lumières, les saveurs — tout était orchestré avec une précision absolue. Satori, c'est le luxe dans sa forme la plus sincère.",
    author: "Isabelle & Thomas R.",
    initials: "IR",
    role: "Tables privées",
  },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SatoriHomePage() {
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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  
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
    <div className="bg-[#0f0d0b] text-[#f5efe0]">
      {/* ── HERO ──────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full h-[85svh] flex flex-col justify-end overflow-hidden pb-32"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80"
            alt="Fine Dining Hero"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-light leading-[1.15] pb-4 tracking-tighter mb-12 uppercase text-white">{c?.heroHeadline ?? <>
              Surrender <br />{" "}
              <span className="italic font-normal text-[#b8860b]">
                to fire.
              </span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-[#f5efe0]/40 leading-relaxed font-light mb-12 italic">{c?.heroSubline ?? fd?.tagline ?? <>
              Chef Anatol Voss transforms memory, season, and flame into a
              dining experience that transcends cuisine.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-62/contact" style={{ textDecoration: "none" }}>
                <MagneticBtn
                  className="px-12 py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all cursor-pointer shadow-2xl border-none"
                >
                  Secure a Table
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-62/menu" className="px-12 py-5 border border-[#f5efe0]/10 text-[#f5efe0] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#f5efe0] hover:text-black transition-all cursor-pointer text-center" style={{ textDecoration: "none" }}>
                The Tasting Menu
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3">
            <span className="text-[9px] font-bold text-[#f5efe0]/20 uppercase tracking-[0.5em]">
              Paris // Geneva // Tokyo
            </span>
            <div className="w-24 h-[1px] bg-[#b8860b]/30" />
          </div>
        </motion.div>
      </section>

      {/* ── 1. MARQUEE TICKER ─────────────────────────────────────────────── */}
      <section className="py-4 border-y border-[#f5efe0]/10 bg-[#0f0d0b] overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(2)].map((_, rep) =>
            ["ÉTOILÉ MICHELIN", "CHEF ANATOL VOSS", "PARIS", "SAISON 2024", "FEU", "MÉMOIRE", "SATORI", "RÉSERVATIONS OUVERTES"].map((item, i) => (
              <span
                key={`${rep}-${i}`}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f5efe0]/20"
              >
                {item}
              </span>
            ))
          )}
        </motion.div>
      </section>

      {/* ── 2. LE MENU ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
              La Carte
            </span>
            <h2 className="text-5xl md:text-7xl font-light mt-4 tracking-tight uppercase">
              Le Menu
              <br />
              <span className="italic text-[#f5efe0]/40">Dégustation</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-[#f5efe0]/10">
          {MENUS.map((menu, colIdx) => (
            <div key={menu.id} className="bg-[#1a1612] p-8 md:p-10">
              <Reveal delay={colIdx * 0.1}>
                <div className="mb-8 pb-6 border-b border-[#f5efe0]/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
                    {String(colIdx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-light mt-2 uppercase tracking-widest">
                    {menu.category}
                  </h3>
                </div>

                <div className="flex flex-col gap-8">
                  {menu.items.map((item, itemIdx) => (
                    <div key={itemIdx}>
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <span className="text-sm font-medium tracking-wide uppercase">
                          {item.name}
                        </span>
                        <span className="text-[#b8860b] text-sm font-light shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#f5efe0]/40 leading-relaxed italic">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-8 text-[10px] text-[#f5efe0]/20 uppercase tracking-[0.4em] text-center">
            Menu dégustation complet disponible sur réservation · Allergènes sur demande
          </p>
        </Reveal>
      </section>

      {/* ── 3. CAVE À VINS ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 bg-[#0a0907]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
                  Sommellerie
                </span>
                <h2 className="text-5xl md:text-7xl font-light mt-4 tracking-tight uppercase">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Cave
                  <br />
                  <span className="italic text-[#f5efe0]/40">à Vins</span>
                </>}</h2>
              </div>
              <p className="max-w-sm text-sm text-[#f5efe0]/40 leading-relaxed font-light italic">{c?.aboutText ?? <>
                Notre sommelière Lucie Arnaud sélectionne pour chaque accord
                des flacons qui prolongent et subliment les émotions de
                l'assiette.
              </>}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WINE_PAIRINGS.map((pairing, idx) => (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="group relative bg-[#1a1612] border border-[#f5efe0]/10 p-8 hover:border-[#b8860b]/50 transition-all duration-500 cursor-default">
                  <div className="absolute top-0 left-0 w-0 h-[1px] bg-[#b8860b] group-hover:w-full transition-all duration-700" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
                    Accord {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-light mt-3 mb-2 tracking-wide">
                    {pairing.title}
                  </h3>
                  <p className="text-xs text-[#f5efe0]/40 italic mb-8">
                    {pairing.focus}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-3xl font-light text-[#b8860b]">
                        {pairing.wines}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.4em] text-[#f5efe0]/30">
                        références
                      </span>
                    </div>
                    <span className="text-lg font-light text-[#f5efe0]/60">
                      {pairing.price}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#b8860b]/0 group-hover:bg-[#b8860b]/30 transition-all duration-700" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. STATS COUNTER BAR ──────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-y border-[#f5efe0]/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          {[
            { value: 12, suffix: "", label: "ans d'étoile Michelin" },
            { value: 3, suffix: "", label: "tables privées exclusives" },
            { value: 280, suffix: "", label: "références de vins" },
            { value: 8, suffix: "", label: "fournisseurs artisans" },
          ].map((stat, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="text-center md:text-left">
                <span className="block text-6xl md:text-7xl font-light text-[#b8860b] leading-none mb-3 tabular-nums">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#f5efe0]/30 leading-relaxed">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 5. LES ARTISANS ───────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
              Terroir & Confiance
            </span>
            <h2 className="text-5xl md:text-7xl font-light mt-4 tracking-tight uppercase">
              Les
              <br />
              <span className="italic text-[#f5efe0]/40">Artisans</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan, idx) => {
            const artisanImages = [
              "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
              "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80",
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
            ];
            return (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="group">
                  <div className="relative h-56 overflow-hidden mb-6 bg-[#1a1612]">
                    <Image
                      src={artisanImages[idx]}
                      alt={artisan.name}
                      fill
                      className="object-cover brightness-[0.45] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-[9px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
                      {artisan.loc}
                    </span>
                  </div>

                  <div className="border-t border-[#f5efe0]/10 pt-6">
                    <h3 className="text-lg font-light uppercase tracking-wide mb-1">
                      {artisan.name}
                    </h3>
                    <p className="text-xs text-[#f5efe0]/40 italic">
                      {artisan.specialty}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-16 pt-12 border-t border-[#f5efe0]/10">
            <p className="text-sm text-[#f5efe0]/30 leading-relaxed max-w-2xl italic font-light">
              Chaque partenariat repose sur des années de confiance mutuelle, de visites sur
              site et d'exigence partagée. Chez Satori, la provenance n'est pas un argument
              marketing — c'est le fondement de chaque assiette.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── 6. TÉMOIGNAGES ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 bg-[#0a0907]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b]">
                Ils ont vécu Satori
              </span>
              <h2 className="text-5xl md:text-7xl font-light mt-4 tracking-tight uppercase">
                Ce qu'ils
                <br />
                <span className="italic text-[#f5efe0]/40">Ont Ressenti</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="bg-[#1a1612] border border-[#f5efe0]/10 p-8 flex flex-col justify-between h-full min-h-[260px]">
                  <div>
                    <span className="block text-4xl text-[#b8860b]/30 font-serif leading-none mb-4">
                      "
                    </span>
                    <p className="text-sm text-[#f5efe0]/60 leading-relaxed italic font-light">
                      {t.quote}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#f5efe0]/10">
                    <div className="w-9 h-9 rounded-full bg-[#b8860b]/20 border border-[#b8860b]/30 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#b8860b] tracking-wide">
                        {t.initials}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-widest">
                        {t.author}
                      </span>
                      <span className="block text-[10px] text-[#f5efe0]/30 italic mt-0.5">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA FINAL ──────────────────────────────────────────────────── */}
      <section className="relative py-40 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
            alt="Table Satori"
            fill
            className="object-cover brightness-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0d0b] via-transparent to-[#0f0d0b]" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <Reveal>
            <span className="block text-[10px] font-bold uppercase tracking-[0.6em] text-[#b8860b] mb-6">
              Réservations
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter uppercase mb-6">
              Votre Table
              <br />
              <span className="italic text-[#f5efe0]/50">Vous Attend</span>
            </h2>
            <p className="max-w-md mx-auto text-sm text-[#f5efe0]/40 leading-relaxed italic font-light mb-14">
              Chaque soirée chez Satori est unique. Les places sont limitées
              afin de garantir une attention totale à chaque convive.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/templates/impact-62/contact" style={{ textDecoration: "none" }}>
                <MagneticBtn className="px-14 py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all cursor-pointer shadow-2xl border-none">
                  Réserver une table
                </MagneticBtn>
              </Link>
              <a
                href={`tel:${fd?.phone ?? "+33142000000"}`}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f5efe0]/30 hover:text-[#f5efe0] transition-colors"
                style={{ textDecoration: "none" }}
              >
                +33 1 42 00 00 00
              </a>
            </div>

            <div className="mt-20 flex justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-[1px] h-12 bg-[#b8860b]/30" />
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#f5efe0]/20">
                  Ouvert du mardi au samedi · Service 19h30 – 22h00
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
