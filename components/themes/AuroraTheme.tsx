"use client";

import { motion } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { Sparkles, ArrowRight, Zap, Globe, Layers, Shield, Cpu, Database, Network, Award, HelpCircle, Star, Quote, Phone, Mail } from "lucide-react";

export function AuroraTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  const brand = formData.brandColor || "#7c3aed";

  return (
    <ThemeWrapper session={session} dark={true}>
      {/* Aurora Animated Background */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-30 blur-[150px]"
          style={{ background: `radial-gradient(circle, ${brand} 0%, transparent 70%)` }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full opacity-20 blur-[150px]"
          style={{ background: `radial-gradient(circle, #f43f5e 0%, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden z-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-white/40">
              <Sparkles className="w-4 h-4 text-amber-400" /> New Frontier // 2026
            </div>
            <h1 className="text-6xl md:text-[9vw] font-black mb-12 leading-[0.85] tracking-tighter text-white uppercase italic">
              {c?.heroHeadline}
            </h1>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-20 leading-relaxed font-light italic">
              {c?.heroSubline}
            </p>
            <div className="flex justify-center gap-8">
              <MagneticButton
                style={{ background: brand, color: "#fff" }}
                className="px-12 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_80px_rgba(124,58,237,0.4)]"
              >
                Enter Experience
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services in Glass Cards */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[<Zap />, <Globe />, <Shield />].map((icon, i) => {
              const svc = c?.services?.[i];
              return (
                <StaggerItem key={i}>
                  <div className="group h-full p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] hover:bg-white/10 transition-all duration-500 text-center">
                    <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-10 bg-white/5 group-hover:bg-white group-hover:text-black transition-all" style={{ color: brand }}>
                      {icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase text-white mb-6 tracking-tight italic">{svc?.title ?? "—"}</h3>
                    <p className="text-white/30 text-sm leading-relaxed">{svc?.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* About Section */}
      <section className="py-40 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent p-1 border border-white/10 rounded-[80px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80" className="w-full h-full object-cover rounded-[79px] grayscale opacity-60" />
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 leading-[0.9] italic text-white">{c?.aboutTitle ?? formData.businessName}</h2>
            <p className="text-xl text-white/30 leading-relaxed italic mb-16">
              {c?.aboutText}
            </p>
            <div className="space-y-6">
              {formData.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                  <div className="text-2xl font-black text-white/20 italic group-hover:text-white transition-colors">0{i+1}</div>
                  <div className="text-lg font-black uppercase tracking-tight text-white/60">{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5: QUANTUM METRICS ═══ */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
             { val: "10ms", label: "Latency" },
             { val: "99.9%", label: "Uptime" },
             { val: "256-bit", label: "Encryption" },
             { val: "50k+", label: "Nodes" },
           ].map((s, i) => (
             <Reveal key={i} delay={i * 0.1}>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">{s.val}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-white/20">{s.label}</div>
             </Reveal>
           ))}
        </div>
      </section>

      {/* ═══ SECTION 6: FEATURE GRID ═══ */}
      <section className="py-40 relative z-10 bg-white/5 backdrop-blur-3xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
           <Reveal className="mb-24 text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">Advanced Capabilities</h2>
           </Reveal>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Cpu />, title: "Neural Processing", desc: "Edge computing infrastructure powered by adaptive neural networks." },
                { icon: <Database />, title: "Immutable Storage", desc: "Decentralized data persistence with absolute cryptographic integrity." },
                { icon: <Network />, title: "Hyper-Mesh", desc: "Self-healing network topology that scales infinitely across the globe." },
                { icon: <Layers />, title: "Multi-Cloud Layer", desc: "Seamless orchestration across hybrid and multi-cloud environments." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[40px] hover:bg-white/[0.05] transition-all group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 bg-white/5 text-white group-hover:scale-110 transition-transform" style={{ color: brand }}>{f.icon}</div>
                      <h3 className="text-2xl font-black uppercase text-white mb-4 italic tracking-tight">{f.title}</h3>
                      <p className="text-white/30 text-sm leading-relaxed">{f.desc}</p>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 7: TESTIMONIALS ═══ */}
      <section className="py-40 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <Reveal>
              <Quote className="w-16 h-16 mx-auto mb-16 text-white/5" />
              <p className="text-3xl md:text-5xl font-black italic text-white leading-tight mb-20 uppercase tracking-tighter">
                 &quot;{c?.testimonials?.[0]?.text ?? ""}&quot;
              </p>
              <div className="flex flex-col items-center">
                 <div className="font-black uppercase tracking-[0.4em] text-xs text-white/40 italic">— {c?.testimonials?.[0]?.name ?? ""} // {c?.testimonials?.[0]?.role ?? ""}</div>
              </div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8: ECOSYSTEM ═══ */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <Reveal className="mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The Ecosystem</span>
           </Reveal>
           <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">VULKAN</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">SOLARIS</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">AETHER</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">HELIX</div>
           </div>
        </div>
      </section>

      {/* ═══ SECTION 9: FAQ ═══ */}
      <section className="py-40 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
           <Reveal className="text-center mb-24">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white">Technical Protocols</h2>
           </Reveal>
           <div className="space-y-4">
              {[
                { q: "How does the mesh handle node failure?", a: "The Hyper-Mesh protocol uses gossip-based state propagation to re-route traffic in real-time with zero packet loss." },
                { q: "Is quantum-resistant encryption standard?", a: "Yes, every node in the Aurora ecosystem utilizes Kyber/Dilithium based hybrid encryption as its core security layer." },
                { q: "What is the onboarding timeline?", a: "Our automated deployment pipeline allows for full integration within 48 hours for standard enterprise architectures." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="p-10 border border-white/5 hover:bg-white/5 transition-all group cursor-pointer rounded-[2rem]">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-sm font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{f.q}</span>
                         <HelpCircle className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-sm text-white/20 leading-relaxed italic group-hover:text-white/40 transition-colors">{f.a}</p>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 10: PARTNER NODES ═══ */}
      <section className="py-24 relative z-10 bg-white/5 backdrop-blur-3xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-10 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">NVIDIA</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">AMAZON_WEB</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">GOOGLE_CLOUD</div>
              <div className="text-2xl font-black italic tracking-tighter text-white uppercase">MICROSOFT</div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter text-white leading-none mb-16 italic">Evolve With Us<span style={{ color: brand }}>.</span></h2>
            <MagneticButton
              style={{ background: brand, color: "#fff" }}
              className="px-16 py-8 rounded-full font-black uppercase tracking-[0.4em] text-xs shadow-2xl"
            >
              Start The Journey
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </ThemeWrapper>
  );
}
