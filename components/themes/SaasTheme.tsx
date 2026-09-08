"use client";

import { motion } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { clientReviews } from "@/lib/templates/clientContent";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { Code2, Zap, Shield, BarChart2, Globe, Database, Award, ShieldCheck, HelpCircle, Activity } from "lucide-react";

export function SaasTheme({ session }: { session: SessionData }) {
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

  return (
    <ThemeWrapper session={session} dark={true}>
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle, ${brand} 0%, transparent 70%)` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
              Developer First Platform
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter text-white">
              {c?.heroHeadline}
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed">
              {c?.heroSubline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                style={{ background: brand, color: "#fff" }}
                className="px-10 py-4 rounded-xl font-bold text-lg shadow-2xl"
              >
                {c?.ctaText}
              </MagneticButton>
              <button className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-zinc-400 font-bold">
                Read Documentation
              </button>
            </div>
          </Reveal>
        </div>

        {/* Dashboard Mockup */}
        <Reveal delay={0.4} className="max-w-6xl mx-auto px-6 mt-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
          <motion.div 
            whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
            className="rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden transition-all duration-700"
          >
            <div className="h-10 bg-zinc-950 flex items-center gap-2 px-6 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80" className="w-full opacity-80" alt="SaaS Dashboard" />
          </motion.div>
        </Reveal>
      </section>

      {/* Metrics Section */}
      <section className="py-24 border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { val: "99.9%", label: "System Uptime" },
            { val: "10M+", label: "API Requests" },
            { val: "<20ms", label: "Latency" },
            { val: "500+", label: "Integrations" },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{m.val}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{m.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Terminal Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tighter">Scale with our powerful CLI.</h2>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed italic">
              {c?.aboutText}
            </p>
            <div className="space-y-6">
              {formData.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-300">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-zinc-800" style={{ color: brand }}>
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-sm">{b}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="bg-zinc-950 rounded-2xl border border-white/10 p-8 font-mono text-sm leading-relaxed overflow-hidden shadow-2xl">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
              </div>
              <div className="text-emerald-400">$ npx aevia-cli init my-project</div>
              <div className="text-zinc-500 mt-2">? Enter project name: (my-project)</div>
              <div className="text-zinc-500 mt-1">? Select template: (saas-premium)</div>
              <div className="text-zinc-300 mt-4">✔ Cloning project repository...</div>
              <div className="text-zinc-300 mt-1">✔ Installing dependencies...</div>
              <div className="text-zinc-300 mt-1">✔ Optimizing assets for production...</div>
              <div className="text-white mt-4 font-bold">🚀 Project ready at http://localhost:3000</div>
              <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-40 h-40" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Reveal className="mb-24">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Native Integrations</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Connect your existing tech stack in seconds.</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Globe />, name: "GitHub" },
              { icon: <Globe />, name: "Globe" },
              { icon: <Globe />, name: "Globe" },
              { icon: <Database />, name: "PostgreSQL" },
            ].map((int, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-3xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-colors group cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-zinc-800 text-white group-hover:scale-110 transition-transform">
                    {int.icon}
                  </div>
                  <div className="text-white font-bold text-sm uppercase tracking-widest">{int.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {avisAffichables.length > 0 && (
      <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Loved by Developers</h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(avisAffichables).map((t, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-2xl border border-white/5 bg-zinc-900/50 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}</div>
                  <p className="text-zinc-400 leading-relaxed mb-8 flex-1 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.role}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* Pricing */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal className="mb-20">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Simple Pricing</h2>
            <p className="text-zinc-500">Start free. Scale as you grow.</p>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "Free", features: ["1,000 API calls", "Community support", "Basic analytics"] },
              { name: "Pro", price: "$49/mo", features: ["Unlimited API calls", "Priority support", "Advanced analytics", "Custom domain"], popular: true },
              { name: "Enterprise", price: "Custom", features: ["Dedicated infra", "SLA guarantee", "SSO & SAML", "24/7 support"] },
            ].map((plan, i) => (
              <StaggerItem key={i}>
                <div className={`p-10 rounded-2xl border h-full flex flex-col text-left ${plan.popular ? 'border-2 bg-zinc-900 relative' : 'border-white/5'}`} style={plan.popular ? { borderColor: brand } : {}}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white" style={{ background: brand }}>Popular</div>}
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">{plan.name}</div>
                  <div className="text-3xl font-black text-white mb-8">{plan.price}</div>
                  <ul className="space-y-3 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${plan.popular ? 'text-white' : 'border border-white/10 text-zinc-400 hover:bg-white/5'}`} style={plan.popular ? { background: brand } : {}}>
                    Get Started
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-black italic tracking-tighter text-white uppercase">NEXUS</div>
             <div className="text-2xl font-black italic tracking-tighter text-white uppercase">ORACLE</div>
             <div className="text-2xl font-black italic tracking-tighter text-white uppercase">PRISME</div>
             <div className="text-2xl font-black italic tracking-tighter text-white uppercase">AETHER</div>
             <div className="text-2xl font-black italic tracking-tighter text-white uppercase">ZENITH</div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight italic">Enterprise-Grade <br/>Security.</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-8">
             {[
               { icon: <ShieldCheck />, title: "SOC2 Type II", desc: "Certified security standards." },
               { icon: <Award />, title: "ISO 27001", desc: "Global information safety." },
               { icon: <Activity />, title: "99.9% SLA", desc: "Guaranteed system uptime." },
               { icon: <Shield />, title: "GDPR Ready", desc: "Full data privacy compliance." },
             ].map((s, i) => (
               <Reveal key={i} delay={i * 0.1}>
                 <div className="p-8 bg-zinc-900 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 text-white group-hover:scale-110 transition-transform" style={{ color: brand }}>{s.icon}</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-2">{s.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Frequently Asked<br/>Questions.</h2>
          </Reveal>
          <div className="space-y-6">
             {[
               { q: "Is there a limit on API calls?", a: "Limits vary by plan. Our Pro plan offers unlimited calls, while the Starter plan is capped at 10,000 per month." },
               { q: "How do you handle data security?", a: "All data is encrypted at rest and in transit. We undergo regular third-party audits to ensure compliance with the highest standards." },
               { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel or downgrade your plan at any time from your dashboard. No long-term contracts required." },
             ].map((f, i) => (
               <Reveal key={i} delay={i * 0.1}>
                 <div className="p-10 border border-white/5 hover:bg-zinc-900 transition-all group cursor-pointer rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-sm font-black uppercase tracking-widest text-white">{f.q}</span>
                       <HelpCircle className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-zinc-500 leading-relaxed italic group-hover:text-zinc-300 transition-colors">{f.a}</p>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-40 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter uppercase italic">Ready to Scale?</h2>
            <MagneticButton
              style={{ background: brand, color: "#fff" }}
              className="px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              Get Started Now
            </MagneticButton>
            <div className="mt-12 text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">No Credit Card Required</div>
          </Reveal>
        </div>
      </section>
    </ThemeWrapper>
  );
}
