"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Instagram, Twitter } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VogueNoirePage() {
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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const basePath = "/templates/impact-81";

  
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
    <div className="bg-[#0A0A08] text-[#F0EBE0]">
      {/* Hero — asymmetric mosaic */}
      <section ref={heroRef} className="relative min-h-dvh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85" alt={fd?.businessName ?? "Vogue Noire"} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/50 to-[#0A0A08]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 min-h-dvh flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Numéro 214 · Janvier 2025</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-[1.15] mb-8 tracking-tight pb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{c?.heroHeadline ?? <>
                Corps<br /><em>Céleste</em>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#A0988A] text-lg max-w-md leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                La saison Automne / Hiver 2025 porte en elle une nouvelle grammaire du corps. Entre retenue et explosion, les maisons réinventent leur vocabulaire.
              </>}</p>
              <Link href={`${basePath}/editoriaux`} className="inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[#C9A86C] pb-1 text-[#C9A86C] hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer">
                Explorer le numéro <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
          {/* Bottom meta */}
          <div className="pb-12 flex items-center justify-between">
            <div className="flex gap-10 text-xs text-[#6A6058] tracking-wide">
              <span>Couverture : Maison Leroux</span>
              <span>Photo : E. Fontaine</span>
            </div>
            <div className="flex gap-4">
              <Link href="/templates/impact-81" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></Link>
              <Link href="/templates/impact-81" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Twitter className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED — Hero Editorial */}
      <section className="py-32 bg-[#0F0E0B] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85" alt="Editorial" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0B]/80 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#C9A86C]">Couverture · Hiver 2025</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="pt-8 lg:pt-24">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#C9A86C] block mb-6">Éditorial de couverture</span>
                <h2 className="text-4xl md:text-6xl font-light leading-[1.2] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  Le corps comme langage.<br /><em>La mode comme texte.</em>
                </>}</h2>
                <p className="text-[#A0988A] leading-relaxed mb-10 text-base">{c?.aboutText ?? <>
                  À l'occasion de la saison Hiver 2025, Vogue Noire interroge la relation entre le corps féminin et le vêtement haut de gamme. Six photographes, douze mannequins, une idée centrale : le mouvement comme signature esthétique.
                </>}</p>
                <div className="flex items-center gap-6 text-xs text-[#6A6058] mb-12">
                  <span>Par Amara Diallo</span>
                  <span className="w-4 h-[1px] bg-[#3A3028]" />
                  <span>Photographie : Léa Fontaine</span>
                  <span className="w-4 h-[1px] bg-[#3A3028]" />
                  <span>8 min de lecture</span>
                </div>
                <Link href={`${basePath}/editoriaux`} className="inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[#C9A86C]/40 pb-1 text-[#C9A86C] hover:border-[#C9A86C] transition-colors cursor-pointer">
                  Lire l'éditorial complet <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SELECTION — Rubriques */}
      <section className="py-24 bg-[#0A0A08] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#C9A86C] mb-4">Dans ce numéro</p>
                <h2 className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>La sélection Vogue Noire</h2>
              </div>
              <Link href={`${basePath}/editoriaux`} className="text-[9px] uppercase tracking-widest text-[#6A6058] hover:text-[#C9A86C] transition-colors hidden md:block cursor-pointer">
                Voir tout le numéro
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { cat: "Mode", title: "Les silhouettes de la saison", author: "Camille Renard", time: "5 min", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85" },
              { cat: "Beauté", title: "Le maquillage qui parle le plus", author: "Sasha Morel", time: "4 min", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85" },
              { cat: "Culture", title: "Derrière les coulisses du défilé", author: "Inès Kaboré", time: "6 min", img: "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&q=85" },
            ].map((art, i) => (
              <Reveal key={art.title} delay={i * 0.1}>
                <article className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden mb-6">
                    <Image src={art.img} alt={art.title} fill className="object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08]/60 to-transparent" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#C9A86C] block mb-3">{art.cat}</span>
                  <h3 className="text-xl font-light leading-snug mb-4 group-hover:text-[#C9A86C] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{art.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#6A6058]">
                    <span>{art.author}</span>
                    <span>·</span>
                    <span>{art.time}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAISONS */}
      <section className="py-24 border-t border-[#2A2820] bg-[#0F0E0B]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#C9A86C] mb-4">Haute couture</p>
            <h2 className="text-4xl font-light mb-20" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Les maisons à la une</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Maison Margiela", "Saint Laurent", "Balenciaga", "Valentino", "Givenchy"].map((m, i) => (
              <Reveal key={m} delay={i * 0.07}>
                <div className="relative aspect-[2/3] overflow-hidden group cursor-pointer">
                  <Image src={`https://images.unsplash.com/photo-155861866${6 + i}-fcd25c85cd64?w=600&q=80`} alt={m} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-[#0A0A08]/50 group-hover:bg-transparent transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A86C]">{m}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────── */}
      <section className="py-32 bg-[#0A0A08] border-t border-[#2A2820]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#C9A86C]/60 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Lectrices & Communauté</p>
            <h2 className="text-4xl md:text-6xl font-light text-[#F0EBE0] mb-20 leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Ce qu&apos;elles disent <em>de nous.</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2A2820]">
            {[
              { quote: "Vogue Noire est la seule publication qui parle de mode avec une intelligence que je reconnais. Chaque numéro m'apprend quelque chose.", name: "Amara K.", role: "Styliste · Paris" },
              { quote: "J'ai découvert trois créateurs majeurs grâce à Vogue Noire avant qu'ils ne défilent à Milan. C'est la définition d'un vrai média de mode.", name: "Lilas T.", role: "Buyer · Montréal" },
              { quote: "Le seul magazine que je garde. La photographie, les mots, le silence entre les deux — rien d'autre n'approche ce niveau d'exigence.", name: "Sonia B.", role: "Photographe · Dakar" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0A0A08] p-12 flex flex-col gap-6 hover:bg-[#0F0E0B] transition-colors">
                  <div className="text-5xl text-[#C9A86C]/10 font-serif leading-none">&ldquo;</div>
                  <p className="text-[#8A8278] text-sm leading-relaxed italic flex-1">{t.quote}</p>
                  <div className="border-t border-[#2A2820] pt-6">
                    <div className="text-[#F0EBE0] font-medium text-sm">{t.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#C9A86C]/50 mt-1">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ÉDITORIALE ────── */}
      <section className="py-32 bg-[#0F0E0B] border-t border-[#2A2820]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#C9A86C]/60 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>L&apos;équipe</p>
            <h2 className="text-4xl md:text-6xl font-light text-[#F0EBE0] mb-20 leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Derrière <em>la revue.</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2A2820]">
            {[
              { name: "Nadia Osei", role: "Rédactrice en chef", since: "fondatrice · 2018", initials: "NO" },
              { name: "Hawa Mbaye", role: "Directrice artistique", since: "depuis 2019", initials: "HM" },
              { name: "Céleste Aron", role: "Photographe principale", since: "depuis 2020", initials: "CA" },
              { name: "Inès Fontaine", role: "Éditrice mode", since: "depuis 2022", initials: "IF" },
            ].map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="bg-[#0F0E0B] p-10 flex flex-col gap-5 hover:bg-[#0A0A08] transition-colors">
                  <div className="w-12 h-12 bg-[#2A2820] flex items-center justify-center">
                    <span className="text-[#C9A86C] text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{m.initials}</span>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#C9A86C]/40 mb-1">{m.since}</div>
                    <div className="text-[#F0EBE0] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{m.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#8A8278] mt-0.5">{m.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER */}
      <section className="py-24 bg-[#C9A86C] text-[#0A0A08]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] mb-6">Abonnement · Gratuit</p>
            <h2 className="text-4xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La lettre Vogue Noire.<br /><em>Chaque lundi matin.</em>
            </h2>
            <p className="text-[#0A0A08]/60 mb-10 text-sm">Les défilés, les éditoriaux, les tendances — avant tout le monde. 40 000 lecteurs. Sans publicité.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="votre@email.com" className="flex-1 px-5 py-3 bg-[#0A0A08]/10 border border-[#0A0A08]/20 text-[#0A0A08] placeholder-[#0A0A08]/30 text-sm focus:outline-none focus:border-[#0A0A08]/50 transition-colors" />
              <button className="px-8 py-3 bg-[#0A0A08] text-[#C9A86C] text-[9px] uppercase tracking-widest font-medium hover:bg-[#0A0A08]/80 transition-colors cursor-pointer">
                S'abonner
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
