"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import { motion, useScroll, useTransform } from "framer-motion";
import {useState, useRef, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Heart, Search, Droplets, Zap, Flower2, Quote, Check, Star } from "lucide-react";
import {
  Counter,
  MagneticBtn,
  PROTOCOLS,
  REVIEWS,
  Reveal,
  SERVICES,
  rafraichirPartage,
} from "./shared";
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { title: "Consultation", desc: "Cartographie du visage et identification du type de peau.", icon: <Search className="w-5 h-5" /> },
                    { title: "Preparation", desc: "Deep thermal cleansing using ozonated steam.", icon: <Droplets className="w-5 h-5" /> },
                    { title: "Infusion", desc: "Active serum delivery through micro-current technology.", icon: <Zap className="w-5 h-5" /> },
                    { title: "Regeneration", desc: "Masque botanique pressé à froid, pour une récupération immédiate.", icon: <Flower2 className="w-5 h-5" /> }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;


// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { label: "Clients_Fidèles", val: 1200, suffix: "+" },
            { label: "Soin_Signature", val: 14, suffix: "" },
            { label: "Expertise_Années", val: 12, suffix: "+" },
            { label: "Certification", val: 100, suffix: "%" }
];
let STATS_INLINE = STATS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function AtelierBeautePage() {
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  sessionData = session;
  memoriserSession(sessionData);
  rafraichirPartage();
  c = session?.generatedContent;


  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      title: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );

  STATS_INLINE = resolveList(

    clientStats(session)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      val: Number(String(s.value ?? "").replace(/[^\d.]/g, "")) || 0, suffix: String(s.value ?? "").replace(/[\d.\s]/g, ""),

      label: s.label,

    })),

    STATS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleBook = () => {
    window.dispatchEvent(new Event("open-atelier-booking"));
  };

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div className="premium-theme min-h-dvh bg-[#faf9f6] text-[#1a1814] font-sans selection:bg-[var(--brand,#c9b7a1)] selection:text-white overflow-x-hidden">
      {/* ==========================================
          1. HERO (Cinematic Beauty)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1600&q=80"))}
            alt="Beauty Hero"
            fill
            className="object-cover brightness-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-[#faf9f6]/40" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl md:text-9xl lg:text-[11rem] font-light leading-[1.15] pb-4 tracking-tighter mb-12 break-words">{<>{clientHeroLine(sessionData, 0, 2, 10) ?? "The Art of"}<br />{" "}
              <span className="italic font-normal text-[var(--brand,#c9b7a1)]">{clientHeroLine(sessionData, 1, 2, 10) ?? "Precision."}</span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-[#1a1814]/40 leading-relaxed font-light mb-12 italic">{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
              Un sanctuaire dédié à la beauté structurelle. Onglerie, regard et
              rituels visage conçus comme des œuvres d'art.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn
                onClick={handleBook}
                className="px-12 py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-[var(--brand,#c9b7a1)] transition-all cursor-pointer shadow-2xl"
              >
                Réserver un Soin
              </MagneticBtn>
              <Link
                href="/templates/impact-66/services"
                className="px-12 py-5 border border-[#1a1814]/10 text-[#1a1814] text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-white transition-all cursor-pointer text-center"
                style={{ textDecoration: "none" }}
              >
                Découvrir la Carte
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3">
            <span className="text-[10px] font-bold text-[#1a1814]/20 uppercase tracking-[0.5em]">
              {clientCity(sessionData) ?? "PARIS"} VIII // ATELIER PRIVÉ
            </span>
            <div className="w-24 h-[1px] bg-[var(--brand,#c9b7a1)]/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. SERVICES (Minimalist Boutique)
          ========================================== */}
      <section
        className="py-32 bg-[#faf9f6] border-y border-[#1a1814]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1a1814]/40 mb-6 block">
                La Carte des Soins
              </span>
              <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
                La <br />{" "}
                <span className="italic text-[var(--brand,#c9b7a1)]">sélection signature.</span>
              </>}</h2>
            </Reveal>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/30 leading-relaxed italic text-right">{c?.aboutText ?? <>
              Chaque prestation est une immersion dans le détail. Nous utilisons
              exclusivement des produits bio-actifs et des techniques de pointe.
            </>}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  onClick={handleBook}
                  className="group cursor-pointer bg-white p-2 rounded-2xl shadow-sm border border-[#1a1814]/5 hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-[#1a1814]/40 hover:text-red-500 transition-colors shadow-sm">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand,#c9b7a1)] font-black mb-2">
                      {item.tag}
                    </div>
                    <h3 className="text-xl font-light tracking-tight mb-2 group-hover:text-[#1a1814]/60 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#1a1814]">
                        {item.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/20 italic group-hover:text-[#1a1814] transition-colors">
                        Réserver →
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. RITUALS (Protocol Deep Dive)
          ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--brand,#c9b7a1)] mb-6 block">
                  Le Protocole Visage
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.15] pb-4 mb-12 uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                  Cellular <br /> <span className="italic">Infusion.</span>
                </>)}</h2>
                <p className="text-lg text-[#1a1814]/40 leading-relaxed font-light mb-16 italic max-w-lg">
                  Une approche scientifique du soin. Nous combinons la sagesse
                  botanique aux technologies de micro-courants pour une
                  régénération profonde.
                </p>

                <div className="space-y-8">
                  {PRESTATIONS_INLINE.map((item, i) => (
                    <div
                      key={i}
                      className="group flex gap-8 items-start border-l border-black/[0.05] pl-8 hover:border-[var(--brand,#c9b7a1)] transition-all"
                    >
                      <div className="text-[var(--brand,#c9b7a1)] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-[#1a1814] mb-2">
                          0{i + 1}. {item.title}
                        </h4>
                        <p className="text-[11px] text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest italic">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-square md:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80"))}
                  alt="Beauty Protocol"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[var(--brand,#c9b7a1)]/10 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 flex gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                    90 MIN RITUAL
                  </div>
                  <div
                    onClick={handleBook}
                    className="px-6 py-3 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest shadow-xl cursor-pointer"
                  >
                    Bio-Active Plus
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. PHILOSOPHIE (Artisan Profile)
          ========================================== */}
      <section
        className="py-32 bg-[#faf9f6] border-y border-[#1a1814]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal className="max-w-2xl mx-auto mb-24">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#1a1814]/30 mb-6 block">
              Notre Philosophie
            </span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase italic mb-8">{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
              Less but <span className="text-[var(--brand,#c9b7a1)]">Better.</span>
            </>)}</h2>
            <p className="text-[#1a1814]/40 italic font-medium leading-relaxed">
              Nous croyons en une beauté qui ne s'impose pas. Une esthétique
              naturelle, raffinée et durable.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-center">
            <Reveal className="text-left">
              <div className="mb-10 p-10 bg-white border border-black/5 rounded-2xl shadow-sm">
                <Quote className="w-8 h-8 text-[var(--brand,#c9b7a1)] mb-6" />
                <p className="text-xl font-light italic leading-relaxed text-[#1a1814]/60 mb-10">
                  "Chaque ongle, chaque cil est une structure. Nous ne faisons
                  pas que de l'esthétique, nous faisons de l'architecture."
                </p>
                <div className="flex items-center gap-6">
                  <Avatar className="w-16 h-16 border-2 border-[var(--brand,#c9b7a1)]/20">
                    <AvatarImage src={photo(2, (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"))} />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">
                      Sophie Laurent
                    </h4>
                    <span className="text-[10px] font-bold text-[var(--brand,#c9b7a1)] uppercase tracking-widest">
                      Fondatrice & Head Artisan
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={photo(3, (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop"))}
                alt="Atelier Detail"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </Reveal>

            <div className="text-left space-y-12">
              {[
                {
                  t: "Exclusivité",
                  d: "Seulement 6 rdv par jour pour une attention totale.",
                },
                { t: "Ethique", d: "Produits 100 % végans, sans test animal." },
                {
                  t: "Précision",
                  d: "Techniques japonaises et russes certifiées.",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-6 group">
                    <div className="w-10 h-10 rounded-full border border-[var(--brand,#c9b7a1)]/30 flex items-center justify-center text-[var(--brand,#c9b7a1)] group-hover:bg-[var(--brand,#c9b7a1)] group-hover:text-white transition-all">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-[#1a1814] mb-2">
                        {item.t}
                      </h4>
                      <p className="text-[11px] text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest italic">
                        {item.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. REVIEWS (Editorial Testimonials)
          ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center p-12 bg-[#faf9f6] rounded-3xl border border-black/[0.03] group hover:border-[var(--brand,#c9b7a1)]/20 transition-all">
                <div className="flex justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[var(--brand,#c9b7a1)] text-[var(--brand,#c9b7a1)]"
                    />
                  ))}
                </div>
                <p className="text-lg font-light italic leading-relaxed text-[#1a1814]/50 mb-10">
                  "{r.text}"
                </p>
                <div className="pt-8 border-t border-black/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">
                    {r.author}
                  </h4>
                  <span className="text-[10px] font-bold text-[var(--brand,#c9b7a1)] uppercase tracking-widest">
                    {r.role}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          6. STATS (Counter)
          ========================================== */}
      <section className="py-24 bg-[#1a1814] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {STATS_INLINE.map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-light text-[var(--brand,#c9b7a1)] mb-4 italic tabular-nums">
                <Counter to={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          7. FAQ (Accordion)
          ========================================== */}
      <section className="py-32 bg-[#faf9f6]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-[1.15] pb-4 uppercase italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
              Intel_Buffer
            </>)}</h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Quels produits utilisez-vous ?",
                a: "Nous travaillons exclusivement avec Biologique Recherche et notre propre gamme d'huiles artisanales pressées à froid.",
              },
              {
                q: "Comment se déroule une première séance ?",
                a: "Chaque nouveau client bénéficie d'une consultation de 15 minutes pour analyser la morphologie et les besoins spécifiques.",
              },
              {
                q: "Quelle est votre politique d'annulation ?",
                a: "Toute annulation doit être effectuée 24h à l'avance. Passé ce délai, 50% de la prestation sera facturée.",
              },
              {
                q: "Proposez-vous des cartes cadeaux ?",
                a: "Oui, nos cartes sont disponibles à l'Atelier ou en version digitale, valables sur tous nos rituels.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-black/[0.05]"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[var(--brand,#c9b7a1)] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "Atelier Beaute"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
