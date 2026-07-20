"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, Users, TrendingUp, Award } from "lucide-react"
import { Reveal } from "./shared"


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function BlueprintPage() {
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

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"])

  
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
    <div className="min-h-dvh bg-[#F7F5F2]">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-dvh overflow-hidden flex items-center">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={photo(0, "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1600&q=85")}
            alt={fd?.businessName ?? "Blueprint Developments"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1612]/90 via-[#1A1612]/60 to-[#1A1612]/10" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 w-full">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86C] mb-8">Promoteur immobilier — Fondé en 1989</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-normal text-[#F7F5F2] leading-[1.15] mb-8 max-w-3xl font-serif" style={{ fontFamily: "'Libre Baskerville', serif" }}>{c?.heroHeadline ?? <>
              Construire<br /><em>l&apos;excellence</em><br />durable
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#C8B89A] text-lg max-w-lg mb-12 leading-relaxed font-light">{c?.heroSubline ?? fd?.tagline ?? <>
              Depuis 35 ans, Blueprint réalise des programmes immobiliers d&apos;exception. Résidentiel haut de gamme, bureaux premium, opérations mixtes — nous concevons des lieux qui durent.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/templates/impact-82/programmes" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C9A86C] text-[#1A1612] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                Nos programmes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/templates/impact-82/investisseurs" className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#C9A86C]/50 text-[#F7F5F2] font-light text-sm tracking-wide uppercase hover:border-[#C9A86C] transition-colors cursor-pointer">
                Espace investisseurs
              </Link>
            </div>
          </Reveal>
          
          <div className="mt-20 pt-10 border-t border-[#3A3020] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ["35 ans", "D'expérience"],
              ["4 200+", "Logements livrés"],
              ["2,4 Md€", "Volume réalisé"],
              ["A+", "Notation ESG"]
            ].map(([val, label]) => (
              <Reveal key={label} delay={0.05}>
                <div>
                  <div className="text-[#C9A86C] text-2xl font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{val}</div>
                  <div className="text-xs text-[#8A7860] uppercase tracking-wide">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick ADN overview */}
      <section className="py-24 bg-[#1A1612] text-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Notre ADN</p>
              <h2 className="text-4xl md:text-5xl font-normal leading-tight font-serif" style={{ fontFamily: "'Libre Baskerville', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                35 ans de<br /><em>savoir-faire</em><br />institutionnel
              </>}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#8A7860] leading-relaxed mb-6 font-light">{c?.aboutText ?? <>
                Blueprint a été fondé en 1989 par Édouard Marchand avec une conviction : le développement immobilier de qualité ne se résume pas à construire des murs. Il s&apos;agit de créer des lieux de vie durables et harmonieux.
              </>}</p>
              <Link href="/templates/impact-82/entreprise" className="text-sm text-[#C9A86C] flex items-center gap-2 hover:gap-4 transition-all">
                En savoir plus sur notre entreprise <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-[#3A3020]">
            {[
              { Icon: Building, title: "Architecture durable", desc: "Certifications HQE, BREEAM et E+C- sur tous nos programmes depuis 2018." },
              { Icon: Users, title: "Engagement humain", desc: "Concertation systématique avec riverains et collectivités avant chaque projet." },
              { Icon: TrendingUp, title: "Performance financière", desc: "18 ans de rendement continu pour nos partenaires institutionnels." },
              { Icon: Award, title: "Excellence reconnue", desc: "Prix de l'Immobilier Durable 2023, Trophée Constructeur 2022." }
            ].map((p, i) => {
              const Icon = p.Icon
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="bg-[#1A1612] p-8 h-full group hover:bg-[#231E14] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#C9A86C] mb-6" />
                    <h3 className="text-lg font-normal mb-3 font-serif" style={{ fontFamily: "'Libre Baskerville', serif" }}>{p.title}</h3>
                    <p className="text-sm text-[#6A6058] leading-relaxed font-light">{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="py-24 bg-[#F7F5F2] border-t border-[#2A2820]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86C] mb-4">Programmes en cours</p>
                <h2 className="text-4xl font-normal leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Nos réalisations<br /><em>à la livraison</em>
                </h2>
              </div>
              <Link href="/templates/impact-82/programmes" className="text-sm text-[#C9A86C] flex items-center gap-2 hover:gap-4 transition-all hidden md:flex">
                Tous les programmes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Résidence Ithaque", loc: "Paris 16e", type: "Résidentiel premium", units: "28 appartements", delivery: "T2 2026", price: "À partir de 1,4 M€", img: photo(1, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85"), badge: "Commercialisation" },
              { name: "Le Domaine de Chambord", loc: "Neuilly-sur-Seine", type: "Résidentiel de prestige", units: "42 appartements", delivery: "T4 2026", price: "À partir de 920 k€", img: photo(2, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85"), badge: "Pré-vente" },
              { name: "Horizon Business Center", loc: "La Défense", type: "Bureaux class A", units: "8 500 m² de bureaux", delivery: "T1 2027", price: "Sur demande", img: photo(3, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85"), badge: "Investisseurs" },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden mb-6">
                    <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612]/60 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#C9A86C] text-[#1A1612] text-[9px] uppercase tracking-widest font-medium">{p.badge}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#C9A86C] uppercase tracking-widest mb-2">{p.loc} · {p.type}</p>
                    <h3 className="text-xl font-normal mb-3 group-hover:text-[#C9A86C] transition-colors" style={{ fontFamily: "'Libre Baskerville', serif" }}>{p.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#8A7860] mb-4">
                      <span>{p.units}</span>
                      <span>Livraison {p.delivery}</span>
                    </div>
                    <p className="font-medium text-[#1A1612] text-sm">{p.price}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="py-24 bg-[#1A1612] text-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86C] mb-4">Direction</p>
            <h2 className="text-4xl font-normal mb-16" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              L'équipe Blueprint
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Édouard Marchand", role: "Président Fondateur", bio: "35 ans d'immobilier. Fondateur de Blueprint en 1989, il a piloté plus de 2,4 Md€ de réalisations.", img: photo(4, "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80") },
              { name: "Claire Fontaine", role: "DGA — Développement", bio: "15 ans dans le foncier grand Paris. En charge de l'acquisition et du montage de tous les programmes.", img: photo(5, "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80") },
              { name: "Thomas Renard", role: "Directeur Financier", bio: "Ex-Goldman Sachs Real Estate. Pilote la relation investisseurs et la structuration des fonds.", img: photo(6, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80") },
              { name: "Sophie Leroux", role: "Directrice Commerciale", bio: "Spécialiste résidentiel de prestige. A lancé 18 programmes depuis 2015, avec un taux de vente VEFA de 94%.", img: photo(7, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80") },
            ].map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                    <Image src={m.img} alt={m.name} fill className="object-cover" />
                  </div>
                  <p className="text-xs tracking-widest text-[#C9A86C] uppercase mb-2">{m.role}</p>
                  <h3 className="font-normal text-lg mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{m.name}</h3>
                  <p className="text-xs text-[#6A6058] leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────── */}
      <section className="py-32 bg-[#F7F5F2] border-t border-[#2A2820]/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#C9A86C] mb-6">Résultats clients</p>
            <h2 className="text-4xl md:text-6xl font-light text-[#1A1612] mb-20 leading-snug" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Ils ont <em>transformé</em> leur corps.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2A2820]/10">
            {[
              { quote: "En 4 mois avec Blueprint, j'ai perdu 14 kg et retrouvé une énergie que je n'avais plus depuis mes 30 ans. L'approche est scientifique, humaine, et elle marche.", name: "Arnaud M.", stats: "−14 kg · 4 mois" },
              { quote: "J'ai essayé 3 coaches avant Blueprint. La différence, c'est la méthode : chaque entraînement a un pourquoi, chaque repas aussi. Je ne fais plus du sport — je construis.", name: "Sarah K.", stats: "−8% BF · 6 mois" },
              { quote: "J'avais 62 ans et une prothèse de hanche. Blueprint a adapté chaque exercice. Aujourd'hui je cours 5 km. Mon médecin n'en revient pas.", name: "Claude B.", stats: "5km · 70 ans" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white p-12 flex flex-col gap-6 h-full">
                  <div className="text-4xl text-[#C9A86C]/20 font-serif leading-none">&ldquo;</div>
                  <p className="text-[#4A3F35] text-sm leading-relaxed italic flex-1">{t.quote}</p>
                  <div className="border-t border-[#2A2820]/10 pt-6 flex items-center justify-between">
                    <div className="text-sm font-bold text-[#1A1612]">{t.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#C9A86C] font-bold">{t.stats}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COACHS ────────────────── */}
      <section className="py-32 bg-[#1A1612] text-[#F7F5F2]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#C9A86C] mb-6">L&apos;équipe</p>
            <h2 className="text-4xl md:text-6xl font-light mb-20 leading-snug" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Vos <em>coachs.</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#3A3020]">
            {[
              { name: "Marc Delcourt", role: "Prépa physique", exp: "12 ans", initials: "MD" },
              { name: "Léa Fontaine", role: "Nutrition & lifestyle", exp: "8 ans", initials: "LF" },
              { name: "Samuel Osei", role: "Force & mobilité", exp: "10 ans", initials: "SO" },
              { name: "Aiko Tanaka", role: "Récupération & mental", exp: "7 ans", initials: "AT" },
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div className="bg-[#1A1612] p-10 flex flex-col gap-5 hover:bg-[#231E14] transition-colors">
                  <div className="w-12 h-12 bg-[#3A3020] flex items-center justify-center">
                    <span className="text-[#C9A86C] text-sm font-bold">{c.initials}</span>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#C9A86C]/50 mb-1">{c.exp} d&apos;exp.</div>
                    <div className="text-[#F7F5F2] font-medium" style={{ fontFamily: "'Libre Baskerville', serif" }}>{c.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#8A8278] mt-0.5">{c.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-[#F0EBE0] text-[#1A1612]">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-normal mb-6 font-serif" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Prêt à concevoir <em>votre projet</em> ?
            </h2>
            <p className="text-[#6B5A40] max-w-xl mx-auto mb-10 leading-relaxed font-light">
              Que vous soyez investisseur, collectivité ou à la recherche de votre future résidence d&apos;exception, nos équipes vous accompagnent à chaque étape.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/templates/impact-82/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A1612] text-[#F7F5F2] font-medium text-sm tracking-wide uppercase hover:bg-[#C9A86C] hover:text-[#1A1612] transition-colors cursor-pointer">
                Nous contacter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/templates/impact-82/programmes" className="inline-flex items-center gap-3 px-8 py-4 border border-[#1A1612]/30 text-[#1A1612] font-light text-sm tracking-wide uppercase hover:border-[#1A1612] transition-colors cursor-pointer">
                Découvrir nos programmes
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
