"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { clientReviews } from "@/lib/templates/clientContent";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { CheckCircle2, ArrowRight, X, Maximize2, Shield, Users, Clock, Award, HelpCircle, Activity, TrendingUp, Quote, Search, Mail, Globe, Phone, Zap, Calendar } from "lucide-react";

const GALLERY = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c89e12bf9a42?w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
];

export function VitrineTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  /*
    Jamais de faux avis nominatifs. Le repli codé en dur (« Claire M., Food
    Critic »…) s'affichait dès que la génération ne fournissait pas de
    testimonials — ce qui est désormais TOUJOURS le cas, la clé ayant été
    retirée du schéma LLM. On n'affiche que les avis réellement saisis par le
    client ; sinon la section disparaît.
  */
  const avisAffichables = (clientReviews(session) ?? []).map((r) => ({
    name: r.author ?? "",
    role: r.source ?? "",
    text: r.text ?? "",
    rating: r.rating ?? 5,
  }));
  const brand = formData.brandColor || "#7c3aed";
  
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <ThemeWrapper session={session} dark={false}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-50 border text-[10px] font-bold uppercase tracking-widest mb-8">
              Professional Expertise
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              {c?.heroHeadline}
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mb-12 leading-relaxed">
              {c?.heroSubline}
            </p>
            <div className="flex gap-4">
              <MagneticButton
                href="#services"
                style={{ background: brand, color: "#fff" }}
                className="px-8 py-4 rounded-lg font-bold text-sm shadow-xl"
              >
                {c?.ctaText}
              </MagneticButton>
            </div>
          </Reveal>
          
          <Reveal delay={0.2} className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img src={formData.heroImageUrl || GALLERY[0]} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl hidden md:block">
              <div className="text-3xl font-black mb-1" style={{ color: brand }}>15+</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">Years of Experience</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-gray-50 mt-32 border-y">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: <Users />, val: "1.2k", label: "Happy Clients" },
            { icon: <Award />, val: "25+", label: "Industry Awards" },
            { icon: <Shield />, val: "100%", label: "Satisfaction" },
            { icon: <Clock />, val: "24/7", label: "Expert Support" },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 0.1} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white shadow-sm" style={{ color: brand }}>{m.icon}</div>
              <div className="text-3xl font-black mb-1">{m.val}</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">{m.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Our Core Services</h2>
              <div className="w-16 h-1 bg-gray-200 mx-auto mb-8" />
              <p className="text-lg text-gray-500 italic leading-relaxed">
                Tailored solutions designed to meet the unique needs of your professional environment.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {c?.services.map((s, i) => (
              <StaggerItem key={i}>
                <div className="group h-full p-10 bg-white border border-gray-100 rounded-3xl hover:border-transparent hover:shadow-2xl transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 bg-gray-50 group-hover:bg-opacity-100 transition-colors" style={{ color: brand }}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-8">{s.description}</p>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all" style={{ color: brand }}>
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* About & Values */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl rotate-2">
              <img src={GALLERY[5]} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">Dedicated to Excellence in {formData.businessType}.</h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-12">
              {c?.aboutText}
            </p>
            <div className="space-y-6">
              {formData.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: brand, color: '#fff' }}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm uppercase tracking-wide">{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">In Action</h2>
              <p className="text-gray-400 mt-4 uppercase text-xs font-bold tracking-widest">A visual glimpse into our standards</p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {GALLERY.map((img, i) => (
              <StaggerItem key={i}>
                <div 
                  onClick={() => setSelectedImg(img)}
                  className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-10"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white"><X className="w-8 h-8" /></button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImg} 
              className="max-w-full max-h-full object-contain shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials Section */}
      {avisAffichables.length > 0 && (
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Trusted by Professionals</h2>
            <div className="w-16 h-1 mx-auto" style={{ background: brand }} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(avisAffichables).map((t, i) => (
              <StaggerItem key={i}>
                <div className="p-8 bg-white border rounded-3xl hover:shadow-xl transition-all h-full flex flex-col">
                  <p className="text-lg italic text-gray-600 leading-relaxed mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* ═══ SECTION 8: THE PROCESS ═══ */}
      <section className="py-32 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <Reveal>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 leading-[0.85] italic">Our Proven <br/>Methodology.</h2>
              <div className="space-y-12">
                 {[
                   { step: "01", title: "Discovery & Analysis", desc: "We begin by deconstructing your requirements to understand the core objectives." },
                   { step: "02", title: "Strategy & Design", desc: "Constructing a tailored roadmap and visual framework that aligns with your vision." },
                   { step: "03", title: "Implementation", desc: "Executing the strategy with high-precision craft and attention to detail." },
                 ].map((p, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="text-2xl font-black italic text-gray-200 group-hover:text-black transition-colors">{p.step}</div>
                      <div>
                         <h3 className="text-lg font-black uppercase tracking-tight text-black mb-2">{p.title}</h3>
                         <p className="text-sm text-gray-400 max-w-sm leading-tight italic">{p.desc}</p>
                      </div>
                   </div>
                ))}
              </div>
           </Reveal>
           <Reveal delay={0.2} className="relative aspect-square border border-gray-100 p-4 bg-gray-50 rounded-[40px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" className="w-full h-full object-cover grayscale opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Activity className="w-16 h-16 text-black/5 animate-pulse" />
              </div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 9: RECOGNITION ═══ */}
      <section className="py-32 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { year: "2026", award: "Industry Excellence", rank: "Gold Medal" },
                { year: "2025", award: "Client Choice", rank: "Top Rated" },
                { year: "2024", award: "Innovation Award", rank: "Winner" },
                { year: "2023", award: "Quality Seal", rank: "Certified" },
              ].map((a, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="p-10 border border-gray-100 bg-white hover:border-black transition-all group rounded-2xl">
                      <div className="text-xs font-bold text-gray-300 mb-4">{a.year}</div>
                      <h3 className="text-lg font-bold uppercase tracking-tight text-black mb-2">{a.award}</h3>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors">{a.rank}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 10: FAQ ═══ */}
      <section className="py-32 bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
           <Reveal className="text-center mb-24">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">General Inquiries</h2>
           </Reveal>
           <div className="space-y-4">
              {[
                { q: "How do we get started?", a: "Simply schedule a consultation call. We'll discuss your goals and provide a preliminary roadmap within 48 hours." },
                { q: "What is the typical project duration?", a: "Timeline varies based on scope, but most professional vitrine projects are completed within 4 to 8 weeks." },
                { q: "Do you offer post-launch support?", a: "Yes, we provide tiered maintenance plans to ensure your digital presence remains optimal and secure." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="p-10 border border-gray-100 hover:bg-gray-50 transition-all group cursor-pointer rounded-[2rem]">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-sm font-black uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">{f.q}</span>
                         <HelpCircle className="w-5 h-5 text-gray-200 group-hover:text-black transition-colors" />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed italic group-hover:text-gray-600 transition-colors">{f.a}</p>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 bg-zinc-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic">Ready to Partner With Us?</h2>
            <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto">
              Schedule a consultation today to see how {formData.businessName} can transform your vision into reality.
            </p>
            <MagneticButton
              style={{ background: brand, color: "#fff" }}
              className="px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl"
            >
              Start Consultation
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </ThemeWrapper>
  );
}
