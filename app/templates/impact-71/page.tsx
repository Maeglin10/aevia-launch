"use client";
// @ts-nocheck

import { motion, useScroll, useTransform } from "framer-motion";
import {useRef, useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import { Leaf, Sun, Wind, Activity, Sparkles } from "lucide-react";
import { Reveal, Counter, MagneticBtn } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ZenSpaceHome() {
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
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const triggerBooking = () => {
    window.dispatchEvent(new CustomEvent("open-zenspace-booking"));
  };

  
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
    <div className="w-full">
      {/* ==========================================
          1. HERO (Minimal Zen)
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
            src={photo(0, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80")}
            alt="Zen Hero"
            fill
            className="object-cover opacity-30 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-[#faf9f6]" />
        </motion.div>

        {/* SOFT GLOWS */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#e8e4db]/40 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-stone-100/50 backdrop-blur-md rounded-full border border-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-[#c9a84c]" />
              Silence is the Language of the Soul
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-light leading-[1.15] tracking-tighter mb-12 uppercase italic text-[#33302c] pb-6">{c?.heroHeadline ?? <>
              Find Your <br />{" "}
              <span className="text-[#c9a84c]">Stillness.</span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-stone-400 leading-relaxed font-light mb-12 italic tracking-tight">{c?.heroSubline ?? fd?.tagline ?? <>
              An architectural sanctuary in the heart of the city. We provide the
              space, the breath, and the ancient wisdom for modern evolution.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-71/practices" className="no-underline">
                <MagneticBtn className="px-12 py-5 bg-[#33302c] text-[#faf9f6] text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-[#c9a84c] transition-all cursor-pointer shadow-2xl border-none">
                  Discover Practices
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-71/contact" className="no-underline">
                <button className="px-12 py-5 border border-stone-200 bg-transparent text-stone-400 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-stone-50 transition-all cursor-pointer">
                  Our_Ethos
                </button>
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3 text-right">
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.5em]">
              GENEVA // KYOTO // LONDON
            </span>
            <div className="w-32 h-[1px] bg-[#c9a84c]/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. THE RITUAL (Process)
          ========================================== */}
      <section
        id="about"
        className="py-32 bg-[#faf9f6] border-y border-stone-200/30"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#c9a84c] mb-6 block">
                  The Zen Method
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.15] mb-12 text-[#33302c] uppercase italic pb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Breath <br />{" "}
                  <span className="text-[#c9a84c] not-italic">As Alchemy.</span>
                </>}</h2>
                <p className="text-lg text-stone-400 leading-relaxed font-light mb-16 uppercase tracking-tight italic">{c?.aboutText ?? <>
                  Nous fusionnons les asanas traditionnels avec une approche
                  neurologique contemporaine pour réinitialiser votre système
                  nerveux en 60 minutes.
                </>}</p>

                <div className="space-y-10">
                  {[
                    {
                      label: "Mindfulness Accuracy",
                      val: 100,
                      suffix: "%",
                      desc: "Every practice is led by RYT-500 certified guides with deep meditation lineage.",
                    },
                    {
                      label: "Cortisol Reduction",
                      val: 42,
                      suffix: "%",
                      desc: "Clinically proven decrease in stress markers after a single Yin session.",
                    },
                    {
                      label: "Community Members",
                      val: 840,
                      suffix: "+",
                      desc: "A curated family of conscious souls growing together in stillness.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group border-l border-[#c9a84c]/20 pl-8 hover:border-[#c9a84c] transition-all"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-stone-500">
                        {item.label}
                      </h4>
                      <div className="text-3xl font-black text-[#c9a84c] mb-2 uppercase italic tabular-nums">
                        <Counter to={item.val} suffix={item.suffix} />
                      </div>
                      <p className="text-[10px] text-stone-300 leading-relaxed font-bold uppercase tracking-widest">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-stone-200/50 bg-white p-1 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05)_0%,transparent_70%)] animate-pulse" />
                <div className="relative h-full w-full border border-stone-200/50 bg-[#faf9f6] p-8 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-stone-200/50">
                    <div className="flex items-center gap-4">
                      <Wind className="w-5 h-5 text-[#c9a84c]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a84c]">
                        Atmospheric_Purity_Log
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-[#c9a84c]/30 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        label: "Air Filtration",
                        val: "HEPA-13 Nano",
                        icon: <Wind className="w-4 h-4" />,
                      },
                      {
                        label: "Soundscape",
                        val: "432Hz Harmonic",
                        icon: <Activity className="w-4 h-4" />,
                      },
                      {
                        label: "Scent Ritual",
                        val: "Mysore Sandalwood",
                        icon: <Sparkles className="w-4 h-4" />,
                      },
                      {
                        label: "Floor System",
                        val: "Anti-Shock Oak",
                        icon: <Leaf className="w-4 h-4" />,
                      },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-white/50 border border-stone-200/30 rounded-xl hover:border-[#c9a84c]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-[#c9a84c]">{spec.icon}</div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                            {spec.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] italic">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
                        Sanctuary Capacity
                      </span>
                      <div className="text-2xl font-black text-stone-500 italic">
                        12 Mats per Session
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-[#c9a84c] uppercase">
                          Certified
                        </span>
                        <span className="text-[10px] font-black uppercase text-stone-500">
                          Yoga Alliance RYS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. PRACTICES
          ========================================== */}
      <section className="py-32 bg-[#f5f3ef] border-t border-stone-200/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#c9a84c] mb-4 block">Disciplines</span>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight text-[#33302c] uppercase italic pb-2">
                Our <span className="text-[#c9a84c]">Practices.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200/30">
            {[
              { icon: <Leaf className="w-5 h-5" />, name: "Yin Yoga", duration: "75 min", level: "All levels", desc: "Deep connective tissue release. Long holds, breath synchronization, and complete nervous system reset." },
              { icon: <Sun className="w-5 h-5" />, name: "Vinyasa Flow", duration: "60 min", level: "Intermediate", desc: "Dynamic sequences linking breath to movement. Build heat, strength, and fluid mobility in one practice." },
              { icon: <Wind className="w-5 h-5" />, name: "Breathwork", duration: "45 min", level: "All levels", desc: "Pranayama and coherence breathing protocols for immediate cortisol reduction and clarity of mind." },
              { icon: <Activity className="w-5 h-5" />, name: "Meditation", duration: "30 min", level: "All levels", desc: "Guided non-sleep deep rest sessions. Backed by neuroscience, designed for the chronically busy." },
              { icon: <Sparkles className="w-5 h-5" />, name: "Sound Bath", duration: "60 min", level: "All levels", desc: "Immersive sessions with Tibetan singing bowls tuned to 432Hz. Profound relaxation at a cellular level." },
              { icon: <Leaf className="w-5 h-5" />, name: "Yoga Nidra", duration: "45 min", level: "All levels", desc: "Conscious sleep state induction. Equal to 4 hours of rest. Our most-requested weekly session." },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.07}>
                <div className="bg-[#faf9f6] p-10 group hover:bg-white transition-colors">
                  <div className="text-[#c9a84c] mb-6">{p.icon}</div>
                  <h3 className="text-xl font-light uppercase tracking-wide text-[#33302c] mb-2 italic">{p.name}</h3>
                  <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-5">
                    <span>{p.duration}</span>
                    <span className="text-[#c9a84c]/60">·</span>
                    <span>{p.level}</span>
                  </div>
                  <p className="text-sm text-stone-400 leading-relaxed font-light italic">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. TESTIMONIALS
          ========================================== */}
      <section className="py-32 bg-[#faf9f6] border-t border-stone-200/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#c9a84c] mb-4 block">Community</span>
              <h2 className="text-5xl md:text-6xl font-light tracking-tighter text-[#33302c] uppercase italic pb-2">
                Voices from the <span className="text-[#c9a84c]">Sanctuary.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Camille R.", role: "Member since 2023", stars: 5, text: "ZenSpace changed my relationship with stress entirely. The Yin sessions are unlike anything I've experienced. Three months in, my therapist noticed the difference before I did." },
              { name: "Antoine M.", role: "Annual membership", stars: 5, text: "I was skeptical about sound baths. Two sessions in and I cancelled my insomnia prescription. The 432Hz environment here is something I can only describe as physical calm." },
              { name: "Sophie L.", role: "Corporate retreat client", stars: 5, text: "We booked ZenSpace for our leadership team after a brutal Q4. The breathwork protocol reduced measurable burnout markers by 40% in our post-retreat survey. We're booking Q2 already." },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="p-10 bg-stone-50 border border-stone-200/50 flex flex-col gap-6">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j} className="text-[#c9a84c] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-stone-500 leading-relaxed font-light italic text-sm flex-1">"{t.text}"</p>
                  <div>
                    <div className="text-[#33302c] font-medium text-sm">{t.name}</div>
                    <div className="text-[9px] uppercase tracking-widest text-stone-400 mt-1">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA BANNER TO PRACTICES / TIMETABLE
          ========================================== */}
      <section className="py-24 bg-[#faf9f6]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h3 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-[#33302c] mb-8 italic">
              Ready to begin your <span className="text-[#c9a84c]">Journey</span>?
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/templates/impact-71/practices" className="no-underline">
                <button className="px-10 py-4 bg-[#33302c] hover:bg-[#c9a84c] text-white text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer transition-all border-none">
                  View Practices
                </button>
              </Link>
              <Link href="/templates/impact-71/timetable" className="no-underline">
                <button className="px-10 py-4 border border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer transition-all">
                  Interactive Schedule
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
