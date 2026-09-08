"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { clientReviews } from "@/lib/templates/clientContent";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { Check, ChevronDown, Rocket, Shield, Zap, Globe, Cpu, BarChart, Star, ArrowRight, Quote, MapPin, Mail, Phone } from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TEMPLATE DE BASE "ESSENTIEL" (599€)
   ✓ Design sur mesure IA    ✓ 5-7 sections SEO
   ✓ Rédaction complète IA   ✓ SSL + domaine prêt
   ✓ Déploiement Vercel      ✓ Livraison 2-4h
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function LandingTheme({ session }: { session: SessionData }) {
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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    { q: `What does ${formData.businessName} specialize in?`, a: c?.aboutText || "We specialize in delivering world-class solutions tailored to your specific needs." },
    { q: "How do I get started?", a: "Simply reach out via our contact section. We'll schedule a free discovery call to understand your goals and craft the perfect strategy." },
    { q: "What makes you different from competitors?", a: `Our approach is built on three pillars: ${formData.benefits?.[0] || 'excellence'}, ${formData.benefits?.[1] || 'innovation'}, and ${formData.benefits?.[2] || 'reliability'}.` },
  ];

  return (
    <ThemeWrapper session={session}>
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO — Full-screen with animated text + CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        {/* Decorative Blurred Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[120px]" style={{ background: brand }} />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[150px] opacity-60" style={{ background: brand }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border text-[10px] font-black uppercase tracking-[0.2em] mb-12">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: brand }} />
              {formData.tagline || "Welcome"}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
              {c?.heroHeadline || `Welcome to ${formData.businessName}`}
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed">
              {c?.heroSubline || formData.mainService}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <MagneticButton
                href="#contact"
                style={{ background: brand, color: "#fff" }}
                className="px-10 py-5 rounded-full font-bold text-lg shadow-2xl"
              >
                {c?.ctaText || "Get Started"}
              </MagneticButton>
              <a href="#services" className="flex items-center gap-2 font-bold text-gray-400 hover:text-black transition-colors group">
                Discover Our Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Hero Image / Mockup */}
        <Reveal delay={0.6} y={100} className="max-w-6xl mx-auto px-6 mt-32">
          <div className="relative bg-white rounded-3xl border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex gap-2 items-center px-4 py-3 bg-gray-50 border-b">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-6 bg-gray-100 rounded-md" />
            </div>
            <img
              src={formData.heroImageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"}
              className="w-full"
              alt={`${formData.businessName} showcase`}
            />
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: SOCIAL PROOF / STATS BAR
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "500+", label: "Happy Clients" },
              { val: "98%", label: "Satisfaction" },
              { val: "24/7", label: "Support" },
              { val: formData.city || "Global", label: "Based In" },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="py-4">
                  <div className="text-3xl md:text-4xl font-black tracking-tighter mb-2">{s.val}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: SERVICES GRID — Animated cards with hover effects
          ═══════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <Reveal>
              <div className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: brand }}>Our Services</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Everything you need to succeed.
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed">
                {c?.aboutText || `${formData.businessName} delivers comprehensive solutions designed for measurable results.`}
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(c?.services || [
              { title: formData.mainService || "Core Service", description: "Our flagship offering, tailored to your exact requirements." },
              { title: "Strategy & Consulting", description: "Data-driven strategies to accelerate your growth trajectory." },
              { title: "Support & Training", description: "Ongoing support to ensure you get maximum value from our solutions." },
            ]).map((s, i) => (
              <StaggerItem key={i}>
                <div className="group p-8 rounded-[28px] border bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: brand + '15', color: brand }}
                  >
                    {i === 0 ? <Rocket className="w-6 h-6" /> : i === 1 ? <Cpu className="w-6 h-6" /> : i === 2 ? <Shield className="w-6 h-6" /> : i === 3 ? <Globe className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed flex-1">{s.description}</p>
                  <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: brand }}>
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: ABOUT / BENEFITS — Split layout
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                  className="w-full h-full object-cover"
                  alt={`About ${formData.businessName}`}
                />
                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 px-6 py-3 bg-white rounded-2xl shadow-xl border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: brand + '20', color: brand }}>
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="font-black text-sm">Top Rated</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Since Day One</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: brand }}>
                {c?.aboutTitle || "Why Choose Us"}
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10 leading-tight">
                Built on trust,<br />driven by results.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-12">
                {c?.aboutText || `At ${formData.businessName}, we believe in delivering exceptional value through innovation and dedication.`}
              </p>
              <div className="space-y-6">
                {(formData.benefits || ["Quality", "Speed", "Reliability"]).map((b, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                      style={{ background: brand + '15', color: brand }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">{b}</div>
                      <div className="text-sm text-gray-400">A core pillar of how we deliver outstanding results for every client.</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: TESTIMONIALS — Client reviews with ratings
          ═══════════════════════════════════════════════════════════════ */}
      {avisAffichables.length > 0 && (
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <Reveal>
              <div className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: brand }}>Client Stories</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">What people say about us</h2>
              <div className="w-20 h-1 mx-auto rounded-full" style={{ background: brand }} />
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(avisAffichables).map((t, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-[28px] border bg-white hover:shadow-xl transition-all h-full flex flex-col">
                  <Quote className="w-8 h-8 mb-6 opacity-10" />
                  <p className="text-lg leading-relaxed mb-8 flex-1 italic text-gray-600">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm" style={{ background: brand }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: FAQ ACCORDION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24">
            <Reveal>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Frequently Asked Questions</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Everything you need to know about {formData.businessName}.</p>
            </Reveal>
          </div>

          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`border rounded-2xl transition-all overflow-hidden ${openFaq === i ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex justify-between items-center text-left"
                  >
                    <span className="font-bold text-lg pr-4">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-6 text-gray-500 leading-relaxed"
                      >
                        {f.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: CONTACT CTA — Conversion-focused with contact info
          ═══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[40px] p-16 md:p-24 text-white text-center relative overflow-hidden" style={{ background: brand }}>
            {/* Background noise overlay */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            <div className="relative z-10">
              <Reveal>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">
                  Ready to start your project?
                </h2>
                <p className="text-xl opacity-80 max-w-2xl mx-auto mb-16 leading-relaxed">
                  {c?.heroSubline || `Contact ${formData.businessName} today and let's build something extraordinary together.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  {formData.email && (
                    <MagneticButton
                      href={`mailto:${formData.email}`}
                      className="px-10 py-5 bg-white rounded-full font-bold text-lg shadow-2xl"
                      style={{ color: brand }}
                    >
                      <Mail className="w-5 h-5 inline-block mr-2" />
                      {formData.email}
                    </MagneticButton>
                  )}
                  {formData.phone && (
                    <a
                      href={`tel:${formData.phone}`}
                      className="px-10 py-5 border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                    >
                      <Phone className="w-5 h-5 inline-block mr-2" />
                      {formData.phone}
                    </a>
                  )}
                </div>

                <div className="flex justify-center gap-8 text-sm opacity-60">
                  {formData.city && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {formData.city}
                    </span>
                  )}
                  {formData.instagram && (
                    <span>@{formData.instagram}</span>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </ThemeWrapper>
  );
}
