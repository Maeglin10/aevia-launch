"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { SessionData } from "@/lib/sessions";
import { clientReviews } from "@/lib/templates/clientContent";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { ArrowUpRight, Monitor, Palette, Code2, Layers, Users, Zap, Mail, HelpCircle, Award, Shield } from "lucide-react";

const PROJECTS = [
  { title: "Aether Labs", cat: "Web Ecosystem", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80", span: "md:col-span-2 md:row-span-2" },
  { title: "Noir Studio", cat: "Brand Identity", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80", span: "md:col-span-1 md:row-span-1" },
  { title: "Prisme", cat: "Fintech App", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80", span: "md:col-span-1 md:row-span-2" },
  { title: "Lumina", cat: "Healthcare", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80", span: "md:col-span-1 md:row-span-1" },
];

const PROCESS = [
  { title: "Discovery", desc: "We dive deep into your business, audience, and goals to build a strategic foundation." },
  { title: "Design", desc: "Creating unique visual languages that resonate and differentiate your brand." },
  { title: "Build", desc: "Turning designs into high-performance digital products with modern technologies." },
  { title: "Launch", desc: "Seamless deployment and ongoing support to ensure long-term success." },
];

export function AgencyTheme({ session }: { session: SessionData }) {
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bannerX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <ThemeWrapper session={session} dark={true}>
      <div ref={containerRef}>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" className="w-full h-full object-cover grayscale" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
            <Reveal>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[2px] w-12 bg-white/30" />
                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white/50">Digital Craft Studio</span>
              </div>
              <h1 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter leading-[0.85] mb-16 text-white italic">
                {c?.heroHeadline}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <p className="text-2xl text-white/40 leading-relaxed font-light max-w-xl italic">
                  {c?.heroSubline}
                </p>
                <div className="flex md:justify-end">
                  <MagneticButton
                    style={{ border: `1px solid ${brand}`, color: brand }}
                    className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 group hover:bg-white hover:text-black hover:border-white transition-all"
                  >
                    <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Start Project</span>
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Scrolling Banner */}
        <div className="py-20 border-y border-white/5 bg-zinc-950 overflow-hidden whitespace-nowrap">
          <motion.div style={{ x: bannerX }} className="flex gap-20 items-center text-7xl md:text-[10vw] font-black uppercase tracking-tighter text-white opacity-[0.02] italic">
            <span>Design · Build · Launch · Strategy · Design · Build · Launch · Strategy · Design · Build · Launch · Strategy ·</span>
          </motion.div>
        </div>

        {/* Portfolio Grid */}
        <section className="py-40 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="mb-32">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 block mb-6 font-black font-mono">Selected Works // 2026</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">The Portfolio<span style={{ color: brand }}>.</span></h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:grid-flow-dense">
              {PROJECTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1} className={p.span}>
                  <div className="group relative h-full min-h-[400px] overflow-hidden cursor-pointer">
                    <img src={p.img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2 block">{p.cat}</span>
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center justify-between">
                        {p.title} <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all" />
                      </h3>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-40 border-y border-white/5 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-20">
            {[
              { val: "200+", label: "Projects Delivered" },
              { val: "98%", label: "Client Satisfaction" },
              { val: "15+", label: "Design Awards" },
              { val: "12", label: "Team Members" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1} className="text-center md:text-left">
                <div className="text-5xl md:text-7xl font-black text-white mb-4 italic tracking-tighter">{s.val}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="py-40 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 block mb-6 font-black font-mono">Our DNA // Logic</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-12 leading-none">Behind the<br/>Scenes<span style={{ color: brand }}>.</span></h2>
                <p className="text-xl text-white/40 leading-relaxed italic max-w-md">
                  {c?.aboutText}
                </p>
              </Reveal>

              <div className="space-y-20">
                {PROCESS.map((p, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex gap-10">
                      <div className="text-5xl font-black text-white/10 italic">0{i+1}</div>
                      <div>
                        <h3 className="text-2xl font-black uppercase text-white mb-6 tracking-tight">{p.title}</h3>
                        <p className="text-white/40 leading-relaxed max-w-sm">{p.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-40 bg-zinc-950 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="mb-24">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 block mb-6 font-black font-mono">Capabilities // Services</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">What We Do<span style={{ color: brand }}>.</span></h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(c?.services || [
                { title: "Web Design", description: "Crafting immersive digital experiences that captivate and convert." },
                { title: "Brand Identity", description: "Building memorable brand systems from strategy to visual execution." },
                { title: "Development", description: "High-performance code powering seamless, scalable products." },
              ]).map((s, i) => (
                <StaggerItem key={i}>
                  <div className="group p-10 border border-white/5 hover:border-white/20 transition-all h-full bg-black/30">
                    <div className="text-5xl font-black mb-8 italic tracking-tighter" style={{ color: brand }}>0{i+1}</div>
                    <h3 className="text-xl font-black uppercase text-white mb-6 tracking-tight">{s.title}</h3>
                    <p className="text-white/40 leading-relaxed">{s.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Testimonials */}
        {avisAffichables.length > 0 && (
      <section className="py-40 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="mb-24">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Client Voices<span style={{ color: brand }}>.</span></h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(avisAffichables).map((t, i) => (
                <StaggerItem key={i}>
                  <div className="p-10 border border-white/5 h-full flex flex-col">
                    <p className="text-xl italic text-white/50 leading-relaxed mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-xs text-white/30 uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

        {/* Client Logos */}
        <section className="py-24 bg-black border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="text-2xl font-black italic tracking-tighter uppercase">NEXUS</div>
               <div className="text-2xl font-black italic tracking-tighter uppercase">ORACLE</div>
               <div className="text-2xl font-black italic tracking-tighter uppercase">PRISME</div>
               <div className="text-2xl font-black italic tracking-tighter uppercase">AETHER</div>
               <div className="text-2xl font-black italic tracking-tighter uppercase">ZENITH</div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-tight italic">Industry <br/>Recognition<span style={{ color: brand }}>.</span></h2>
              </Reveal>
              <div className="space-y-12">
                 {[
                   { year: "2026", title: "Agency of the Year", org: "Digital Trends" },
                   { year: "2025", title: "Best UI/UX Design", org: "Awwwards" },
                   { year: "2024", title: "Innovation Award", org: "FWA" },
                 ].map((a, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                     <div className="flex justify-between items-end border-b border-white/10 pb-8 group hover:border-white transition-colors">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{a.year} // {a.org}</div>
                           <h3 className="text-2xl font-black uppercase text-white group-hover:translate-x-4 transition-transform">{a.title}</h3>
                        </div>
                        <Award className="w-8 h-8 text-white/10 group-hover:text-white transition-colors" />
                     </div>
                   </Reveal>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-40 bg-black">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal className="mb-24 text-center">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Common Inquiries<span style={{ color: brand }}>.</span></h2>
            </Reveal>
            <div className="space-y-8">
               {[
                 { q: "How long does a typical project take?", a: "Depending on the scope, most projects range from 8 to 16 weeks from discovery to final deployment." },
                 { q: "Do you offer post-launch support?", a: "Absolutely. We provide comprehensive maintenance packages and strategic support to ensure your product continues to evolve." },
                 { q: "Can you work with our existing team?", a: "Yes, we often integrate with internal design and engineering teams to augment capabilities and accelerate delivery." },
               ].map((f, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                   <div className="p-10 border border-white/5 hover:border-white/20 transition-all group cursor-pointer">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-sm font-black uppercase tracking-[0.2em] text-white">{f.q}</span>
                         <HelpCircle className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-white/40 leading-relaxed italic group-hover:text-white/60 transition-colors">{f.a}</p>
                   </div>
                 </Reveal>
               ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="py-60 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter text-black leading-none mb-16 italic">Let&apos;s Build<br/>Something Huge<span style={{ color: brand }}>.</span></h2>
              
              <div className="flex flex-col items-center gap-12 mt-20">
                <div className="flex gap-8">
                  <a href={`mailto:${formData.email}`} className="text-2xl font-black border-b-2 border-black pb-2 hover:opacity-50 transition-opacity uppercase tracking-tighter">
                    {formData.email}
                  </a>
                </div>
                
                <MagneticButton
                  style={{ background: brand, color: "#fff" }}
                  className="px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl"
                >
                  Start The Conversation
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </ThemeWrapper>
  );
}
