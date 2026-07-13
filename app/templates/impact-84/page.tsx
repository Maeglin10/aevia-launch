"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function CypherClinicPage() {
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
  const basePath = "/templates/impact-84";

  
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
    <div className="bg-[#0C0C0A] text-[#F0EBE0]">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden flex items-center">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=85&fit=crop" alt={fd?.businessName ?? "Cypher Clinic"} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/95 via-[#0C0C0A]/70 to-[#0C0C0A]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 w-full flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#C9A86C]" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#C9A86C]">Clinique d&apos;excellence médicale</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-light text-[#F0EBE0] leading-[1.2] mb-8 max-w-3xl pb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{c?.heroHeadline ?? <>
              L&apos;art de la médecine<br />esthétique de <em>précision</em>
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8A8278] text-lg max-w-xl mb-12 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
              Une harmonie mesurée entre rigueur scientifique et vision artistique du visage. Nos protocoles de pointe respectent votre morphologie naturelle pour des résultats invisibles et durables.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href={`${basePath}/protocoles`} className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A86C] text-[#0C0C0A] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                Découvrir nos protocoles <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`${basePath}/rdv`} className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] font-light text-sm tracking-wide uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all cursor-pointer">
                Demander un rendez-vous
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROTOCOLES */}
      <section className="py-24 bg-[#0F0E0C] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A86C] mb-6">Nos Expertises</p>
            <h2 className="text-4xl md:text-5xl font-light mb-20 max-w-xl leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Des protocoles conçus<br />pour <em>votre morphologie</em>.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Médecine faciale", desc: "Injection de toxine botulique, acide hyaluronique, techniques de volumisation et repositionnement sans acte chirurgical. Résultats naturels garantis.", duration: "45 min", recovery: "0 jour" },
              { num: "02", title: "Lasers & Lumières", desc: "Traitements photodynamiques, lasers fractionnels CO₂, épilation définitive et rajeunissement cutané par technologie IPL de dernière génération.", duration: "60 min", recovery: "1–2 jours" },
              { num: "03", title: "Corps & Silhouette", desc: "Cryolipolyse, radiofréquence multipôlaire, HIFU corporel et drainage lymphatique instrumental pour un remodelage non-invasif durable.", duration: "90 min", recovery: "0 jour" },
              { num: "04", title: "Soin du visage médical", desc: "Peelings chimiques de profondeur modulable, mésothérapie, HydraFacial MD et protocols anti-âge sur mesure selon diagnostic cutané.", duration: "60 min", recovery: "0–3 jours" },
              { num: "05", title: "Médecine régénérative", desc: "PRP autologue, injections de polynucléotides, exosomes et bio-stimulateurs de collagène pour une régénération cellulaire profonde.", duration: "45 min", recovery: "2 jours" },
              { num: "06", title: "Programmes Sur-Mesure", desc: "Après bilan photo-morphologique complet par notre équipe médicale, nous élaborons un protocole global sur 3 à 6 mois adapté à vos objectifs spécifiques.", duration: "Sur devis", recovery: "Variable" },
            ].map((p, i) => (
              <Reveal key={p.num} delay={i * 0.08}>
                <div className="p-8 border border-[#2A2820] hover:border-[#C9A86C]/30 transition-all duration-500 group">
                  <div className="text-[#C9A86C]/20 text-5xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.num}</div>
                  <h3 className="font-medium text-[#F0EBE0] text-lg mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.title}</h3>
                  <p className="text-[#6A6258] text-sm leading-relaxed mb-6">{p.desc}</p>
                  <div className="flex gap-6 text-[9px] text-[#C9A86C]/60 uppercase tracking-widest border-t border-[#2A2820] pt-4">
                    <span>Durée : {p.duration}</span>
                    <span>|</span>
                    <span>Récupération : {p.recovery}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHIE */}
      <section className="py-24 bg-[#0C0C0A] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=85" alt="Clinique Cypher" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#0C0C0A]/20" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A86C] mb-8">Notre philosophie</p>
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  La beauté<br />comme <em>science.</em>
                </>}</h2>
                <p className="text-[#8A8278] leading-relaxed mb-6 text-base">{c?.aboutText ?? <>
                  Chez Cypher Clinic, nous rejetons l'idée de beauté standardisée. Chaque visage est un code unique que nous lisons avec précision avant d'intervenir. Notre protocole d'analyse morphologique en 14 points est réalisé par un médecin qualifié — jamais une esthéticienne.
                </>}</p>
                <p className="text-[#8A8278] leading-relaxed mb-10 text-base">
                  Nos médecins sont formés dans les instituts de référence mondiale (Académie de médecine esthétique de Paris, IDRM Lausanne). Chaque acte est documenté photographiquement avant et après pour un suivi rigoureux de votre évolution.
                </p>
                <div className="grid grid-cols-3 gap-6 border-t border-[#2A2820] pt-10">
                  {[{ v: "+2400", l: "Patients traités" }, { v: "14", l: "Points d'analyse" }, { v: "9 ans", l: "D'expertise" }].map((s, i) => (
                    <div key={i}>
                      <div className="text-2xl font-light text-[#C9A86C] mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.v}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[#6A6258]">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES */}
      <section className="py-24 bg-[#0F0E0C] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A86C] mb-6">Patients</p>
            <h2 className="text-3xl font-light mb-16" style={{ fontFamily: "'Bodoni Moda', serif" }}>Ce qu'ils ont vécu.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sophia T.", protocol: "Médecine faciale", text: "Pour la première fois depuis des années, je me regarde dans le miroir avec plaisir. Le Dr Nakamura a compris exactement ce que je voulais — pas plus, pas moins. Le résultat est d'une discrétion absolue." },
              { name: "Claire B.", protocol: "Laser CO₂ fractionnel", text: "Après 2 séances, mes cicatrices d'acné ont pratiquement disparu. L'équipe m'a accompagnée avec une vraie attention médicale, pas commerciale. Cypher Clinic est la meilleure décision que j'ai prise pour ma peau." },
              { name: "Marc D.", protocol: "Programme sur-mesure", text: "Je m'attendais à des résultats modestes. Ce que j'ai obtenu en 4 mois dépasse tout ce que j'aurais pu imaginer. Le protocole était vraiment pensé pour mon visage spécifiquement — j'ai senti la différence." },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="p-8 border border-[#2A2820]">
                  <p className="text-[#8A8278] text-sm leading-relaxed mb-8 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-[#2A2820] pt-6">
                    <p className="text-[#F0EBE0] font-medium text-sm">{t.name}</p>
                    <p className="text-[9px] uppercase tracking-widest text-[#C9A86C] mt-1">{t.protocol}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉDECINS */}
      <section className="py-24 bg-[#0C0C0A] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A86C] mb-6">Notre équipe</p>
            <h2 className="text-3xl font-light mb-16" style={{ fontFamily: "'Bodoni Moda', serif" }}>Les médecins.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Kenji Nakamura", spec: "Médecine esthétique faciale", exp: "14 ans", bio: "Formé à l'Académie de médecine esthétique de Paris. Spécialiste des techniques d'injection ultra-précises et de la morphologie faciale.", badge: "Certifié AME" },
              { name: "Dr. Sophie Bellamy", spec: "Laser & Régénération cutanée", exp: "9 ans", bio: "Docteure en dermatologie, IDRM Lausanne. Experte des protocoles laser CO₂ et PRP pour les cicatrices et le vieillissement cutané.", badge: "Dermatologie" },
              { name: "Dr. Malik Osei", spec: "Corps & Médecine anti-âge", exp: "11 ans", bio: "Médecin du sport reconverti en esthétique corporelle. Approche globale alliant nutrition, hormonal et intervention pour des résultats durables.", badge: "Anti-âge" },
            ].map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <div className="p-8 border border-[#2A2820] flex flex-col gap-4">
                  <div className="w-14 h-14 bg-[#2A2820] flex items-center justify-center">
                    <span className="text-[#C9A86C] font-light text-xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>{m.name.split(" ").filter(n => !n.startsWith("Dr")).map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A86C] mb-1">{m.badge} · {m.exp}</p>
                    <h3 className="text-[#F0EBE0] font-medium" style={{ fontFamily: "'Bodoni Moda', serif" }}>{m.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#6A6258] mt-0.5">{m.spec}</p>
                  </div>
                  <p className="text-[#8A8278] text-sm leading-relaxed border-t border-[#2A2820] pt-4">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RDV CTA */}
      <section className="py-24 bg-[#C9A86C]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#0C0C0A]/60 mb-6">Premier rendez-vous</p>
            <h2 className="text-4xl font-light text-[#0C0C0A] mb-8 leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Commençons par<br /><em>vous écouter.</em>
            </h2>
            <p className="text-[#0C0C0A]/60 mb-10 max-w-md mx-auto leading-relaxed text-sm">
              Votre première consultation avec l'un de nos médecins est dédiée à l'écoute et au diagnostic. Aucun acte n'est réalisé lors de cette séance.
            </p>
            <Link href={`${basePath}/rdv`} className="inline-flex items-center gap-4 px-10 py-5 bg-[#0C0C0A] text-[#C9A86C] text-[10px] uppercase tracking-widest hover:gap-8 transition-all cursor-pointer">
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
