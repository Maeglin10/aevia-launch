"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Grape, Play, CheckCircle2, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { STATS, FEATURES, TESTIMONIALS, FAQS, Reveal } from "./shared";

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ChateauVestigeHome() {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  
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
    <div ref={containerRef}>
      {/* ─── HERO PARALLAX ─── */}
      <section className="relative h-[calc(100vh-96px)] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        <motion.div style={{ y: heroY, opacity: opacityHero }} className="absolute inset-0 z-0">
          <Image
            src={photo(0, "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=2000&q=80&fit=crop")}
            alt="Vignoble de Margaux au lever du soleil"
            fill
            className="object-cover brightness-50"
            priority
          />
        </motion.div>

        <motion.div style={{ y: textY }} className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white mt-10">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Grand Cru Classé en 1855</span>
              <div className="h-px w-12 bg-[#C4A265]" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light tracking-tighter mb-8 leading-[1.1] pb-3 drop-shadow-xl">{c?.heroHeadline ?? <>
              L'Âme de <br /> <span className="italic">Margaux.</span>
            </>}</h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl font-sans font-light tracking-wide max-w-2xl mx-auto mb-12 text-zinc-200">{c?.heroSubline ?? fd?.tagline ?? <>
              Une terre de graves, des vignes centenaires et le temps pour seul allié. L'expression la plus pure d'un grand terroir.
            </>}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-sans">
              <Link
                href="/templates/impact-56/vins"
                className="w-full sm:w-auto px-10 py-4 bg-[#2D1B0E] text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#2D1B0E] transition-colors duration-300 cursor-pointer text-center"
                style={{ textDecoration: "none" }}
              >
                Découvrir nos Vins
              </Link>
              <Link
                href="/templates/impact-56/visite"
                className="w-full sm:w-auto px-10 py-4 border border-white/30 bg-black/20 backdrop-blur-md text-white font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-3"
                style={{ textDecoration: "none" }}
              >
                <Play className="w-4 h-4" /> Visiter le Château
              </Link>
            </div>
          </Reveal>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-20 border-b border-[#2D1B0E]/10 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-4 divide-x-0 md:divide-x divide-[#2D1B0E]/10">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl lg:text-5xl font-serif text-[#2D1B0E] mb-3 leading-none pb-1">
                    {stat.value}<span className="text-zinc-400 font-sans text-2xl">{stat.suffix}</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500 font-sans font-bold">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES (TABS) ─── */}
      <section className="py-32 relative bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">Le Domaine</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#2D1B0E] mb-6 leading-normal pb-2">{c?.aboutTitle ?? fd?.businessName ?? <>L'Art du Grand Vin</>}</h3>
              <p className="text-zinc-600 font-sans max-w-2xl mx-auto text-lg leading-relaxed">{c?.aboutText ?? <>
                De la vigne à la bouteille, chaque étape est guidée par l'exigence absolue et le respect d'une nature généreuse.
              </>}</p>
            </Reveal>
          </div>

          <Tabs defaultValue="terroir" className="w-full flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <TabsList className="flex flex-col h-auto bg-transparent gap-4 items-stretch font-sans">
                {FEATURES.map((feature) => (
                  <TabsTrigger
                    key={feature.id}
                    value={feature.id}
                    className="justify-start px-8 py-6 text-left data-[state=active]:bg-[#2D1B0E] data-[state=active]:text-white text-zinc-500 hover:text-[#2D1B0E] transition-all duration-300 cursor-pointer rounded-none border border-transparent data-[state=active]:shadow-xl"
                  >
                    <div className="flex items-center gap-6">
                      <div className="opacity-70">{feature.icon}</div>
                      <span className="text-sm font-bold uppercase tracking-widest">{feature.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {FEATURES.map((feature) => (
                  <TabsContent key={feature.id} value={feature.id} className="mt-0 outline-none">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white border border-[#2D1B0E]/5 overflow-hidden shadow-2xl"
                    >
                      <div className="aspect-[16/9] relative w-full overflow-hidden">
                        <Image src={feature.image} alt={feature.title} fill className="object-cover hover:scale-105 transition-transform duration-1000" />
                      </div>
                      <div className="p-10 md:p-14">
                        <h4 className="text-3xl font-serif text-[#2D1B0E] mb-6 leading-snug pb-1">{feature.title}</h4>
                        <p className="text-zinc-600 font-sans leading-relaxed mb-10 text-lg">{feature.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-sans">
                          {feature.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#C4A265]" />
                              <span className="text-sm text-zinc-700 font-medium">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 bg-[#2D1B0E] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Grape className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4 font-sans">La Critique</h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight pb-2">Ils en parlent</h3>
            </div>
          </Reveal>

          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {TESTIMONIALS.map((testi, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2 pl-6">
                  <Reveal delay={i * 0.1}>
                    <Card className="bg-[#3D1C22] border-none shadow-xl h-full font-sans">
                      <CardContent className="p-10 flex flex-col h-full justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#C4A265] text-[#2D1B0E] font-bold px-4 py-2 text-xl font-serif rounded-bl-xl">
                          {testi.score}
                        </div>
                        <div>
                          <div className="flex gap-1 mb-8 mt-2">
                            {[...Array(testi.rating)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-[#C4A265] text-[#C4A265]" />
                            ))}
                          </div>
                          <p className="text-white/90 text-xl leading-relaxed font-serif italic mb-10">
                            "{testi.content}"
                          </p>
                        </div>
                        <div className="flex items-center gap-5 pt-6 border-t border-white/10 mt-auto">
                          <Avatar className="w-14 h-14 border-2 border-[#C4A265]">
                            <AvatarImage src={testi.avatar} />
                            <AvatarFallback>CV</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-bold text-sm tracking-wider uppercase">{testi.name}</div>
                            <div className="text-[#C4A265] text-xs uppercase tracking-widest mt-1">{testi.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-6 mt-16">
              <CarouselPrevious className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2D1B0E] w-12 h-12 transition-colors" />
              <CarouselNext className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2D1B0E] w-12 h-12 transition-colors" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4 font-sans">Service</h2>
              <h3 className="text-4xl font-serif text-[#2D1B0E] leading-tight pb-2">Questions Fréquentes</h3>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full font-sans">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-zinc-300">
                  <AccordionTrigger className="text-left text-[#2D1B0E] hover:text-[#C4A265] hover:no-underline font-bold text-lg py-6 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 leading-relaxed pb-6 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 px-6 relative z-10 bg-white">
        <Reveal>
          <div className="max-w-6xl mx-auto bg-[#2D1B0E] text-white p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000 mix-blend-luminosity"
              style={{ backgroundImage: `url(${photo(1, "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80")})` }}
            />
            <div className="relative z-10 font-sans">
              <div className="w-16 h-px bg-[#C4A265] mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-snug pb-2">Vivez l'expérience Vestige</h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Une dégustation privée, une visite de nos chais ou une réservation pour notre prochain millésime. Entrez dans le cercle intime du Château.
              </p>
              <Link
                href="/templates/impact-56/visite"
                className="px-12 py-5 bg-[#C4A265] text-[#2D1B0E] font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 cursor-pointer inline-block text-center"
                style={{ textDecoration: "none" }}
              >
                Réserver une Visite
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
