"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Cloud, Cpu, Zap, Database, Lock, BarChart3, ChevronDown, CheckCircle, GitBranch, Globe, BookOpen, FileText, Tag, Clock, Users, Shield, Terminal, Code, Layers, Server, Eye, TrendingUp, Sparkles, ExternalLink } from "lucide-react";

type ActivePage = "home" | "modeles" | "pricing" | "docs" | "blog" | "login" | "legal";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("nb-fonts")) return;
    const s = document.createElement("style");
    s.id = "nb-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const features = [
  { icon: <Cloud className="w-6 h-6" />, title: "Cloud Inference", desc: "Exécutez n'importe quel modèle en millisecondes sur notre infrastructure distribuée dans 12 régions.", color: "#06B6D4" },
  { icon: <Cpu className="w-6 h-6" />, title: "GPU à la demande", desc: "A100, H100, L40S. Scalez de 0 à 1 000 GPU en 90 secondes avec auto-scaling intelligent.", color: "#8B5CF6" },
  { icon: <Zap className="w-6 h-6" />, title: "Latence < 100ms", desc: "Edge computing mondial. Vos modèles tournent au plus proche de vos utilisateurs finaux.", color: "#F59E0B" },
  { icon: <Database className="w-6 h-6" />, title: "Vector DB intégré", desc: "Base vectorielle haute performance incluse. Indexation, recherche sémantique, clustering.", color: "#10B981" },
  { icon: <Lock className="w-6 h-6" />, title: "Déploiement privé", desc: "VPC dédié, encryption at rest + in transit, conformité RGPD, HIPAA, SOC2 Type II.", color: "#EF4444" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Observabilité IA", desc: "Monitoring des coûts d'inférence, traces LLM, drift detection et alertes automatiques.", color: "#3B82F6" },
];

const models = [
  { name: "LLaMA 3.1 405B", type: "LLM", latency: "90ms", cost: "0.70$ / 1M tokens", badge: "Recommandé" },
  { name: "Mistral Large 2", type: "LLM", latency: "65ms", cost: "0.45$ / 1M tokens", badge: "Populaire" },
  { name: "GPT-4o", type: "Multimodal", latency: "120ms", cost: "1.20$ / 1M tokens", badge: "OpenAI" },
  { name: "SDXL Turbo", type: "Image", latency: "30ms", cost: "0.01$ / image", badge: "Diffusion" },
  { name: "Whisper Large v3", type: "Audio", latency: "RT×0.15", cost: "0.006$ / min", badge: "STT" },
];

const pipeline = [
  { step: "API Call", code: "POST /v1/inference\nAuthorization: Bearer {token}\nContent-Type: application/json", desc: "Un endpoint universel pour tous vos modèles" },
  { step: "Routage", code: "model_router.select(\n  task='llm',\n  latency='low',\n  cost='optimize'\n)", desc: "Routage automatique vers le GPU optimal" },
  { step: "Inférence", code: "# GPU H100 — EU-West-1\nlatency: 88ms\ntokens: 1240\ncost: $0.0008", desc: "Exécution sur infrastructure bare-metal" },
  { step: "Réponse", code: '{\n  "completion": "...",\n  "usage": {...},\n  "latency_ms": 88\n}', desc: "Résultat structuré avec métriques" },
];

const faqs = [
  { q: "Quelle est la différence avec Azure OpenAI ou Bedrock ?", a: "Nimbus est model-agnostic : vous pouvez swapper des modèles open-source et propriétaires via une seule API. Pas de vendor lock-in, coûts jusqu'à 80% inférieurs." },
  { q: "Comment fonctionne la facturation ?", a: "Pay-as-you-go par token / image / seconde d'audio. Aucun engagement minimum. Volume discounts automatiques dès 10M tokens/mois." },
  { q: "Peut-on déployer nos propres modèles fine-tunés ?", a: "Oui. Upload via CLI ou S3-compatible API. Format GGUF, SafeTensors, ONNX. Votre modèle est privé et isolé dans votre namespace." },
  { q: "Quelle est la SLA uptime ?", a: "99.99% sur les endpoints production avec failover multi-région automatique. Compensations crédit si violation SLA." },
];

/* ─── Nav item → page mapping ─── */
const navMap: Record<string, ActivePage> = {
  "Modèles": "modeles",
  "Pricing": "pricing",
  "Docs": "docs",
  "Status": "home",
  "Blog": "blog",
};

const footerLinkMap: Record<string, ActivePage> = {
  "Modèles": "modeles",
  "GPU Cloud": "modeles",
  "Vector DB": "modeles",
  "API Reference": "docs",
  "Documentation": "docs",
  "Quickstart": "docs",
  "Blog": "blog",
  "Changelog": "blog",
  "Confidentialité": "legal",
  "CGU": "legal",
  "DPA RGPD": "legal",
  "Status": "home",
};


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function NimbusAIPage() {
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

  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    window.location.href = p === "home" ? "/templates/impact-22" : `/templates/impact-22/${p}`;
  };

  const { scrollYProgress } = useScroll();

  
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
    <div className="min-h-dvh bg-[#060B16]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#060B16]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div>
                <span className="text-white font-bold text-lg">{fd?.businessName ?? "NimbusAI"}</span>
              </>
            )}
          </button>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            {["Modèles", "Pricing", "Docs", "Status", "Blog"].map(item => (
              <button key={item} onClick={() => goTo(navMap[item])} className="hover:text-white transition-colors cursor-pointer">{item}</button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => goTo("login")} className="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors cursor-pointer bg-transparent border-none">Se connecter</button>
            <button onClick={() => goTo("pricing")} className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-medium">Démarrer</button>
          </div>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#060B16] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span className="text-white font-bold text-xl">{fd?.businessName ?? "NimbusAI"}</span>
              )}
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Modèles", "Pricing", "Docs", "Status", "Blog"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <button onClick={() => goTo(navMap[item])} className="block text-white text-2xl font-bold mb-6 cursor-pointer">{item}</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================== HOME ============================== */}
      <div>
          {/* Hero */}
          <section id="hero" className="relative min-h-dvh flex items-center pt-32 pb-20 px-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/8 rounded-full blur-3xl" />
            </div>
            <div className="max-w-6xl mx-auto w-full relative z-10 text-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
                  <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse" /> Cloud AI Infrastructure — 12 régions mondiales
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6">{c?.heroHeadline ?? <>
                  L&apos;infrastructure IA<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">pour les builders sérieux</span>
                </>}</h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
                  Inférence GPU à la demande, models-as-a-service, vector DB intégrée. Scalez de 0 à production en 5 minutes.
                </>}</p>
              </Reveal>
              <Reveal delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => goTo("pricing")} className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2">
                  Commencer gratuitement <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => goTo("docs")} className="border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <GitBranch className="w-4 h-4" /> Voir la documentation
                </button>
              </Reveal>
              <Reveal delay={0.4} className="mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                  {[["< 100ms", "Latence P99"], ["99.99%", "SLA uptime"], ["80%", "vs AWS Bedrock"]].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-white font-bold text-2xl">{n}</p>
                      <p className="text-gray-500 text-xs mt-1">{l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* Features */}
          <section className="py-24 px-6 bg-[#070D1A]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#06B6D4] text-sm font-semibold mb-3">Infrastructure</p>
                <h2 className="text-white text-4xl font-bold">Tout ce qu&apos;il vous faut</h2>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.07}>
                    <div className="bg-[#0D1525] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                      <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Models */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#06B6D4] text-sm font-semibold mb-3">Catalogue modèles</p>
                <h2 className="text-white text-4xl font-bold">Les meilleurs modèles du marché</h2>
              </Reveal>
              <div className="space-y-3">
                {models.map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.06}>
                    <div className="bg-[#0D1525] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-[#06B6D4]/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-[#06B6D4]" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">{m.name}</h3>
                          <p className="text-gray-500 text-xs">{m.type}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">{m.latency}</p>
                          <p className="text-gray-600 text-xs">Latence P50</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">{m.cost}</p>
                          <p className="text-gray-600 text-xs">Tarif</p>
                        </div>
                        <span className="text-[#06B6D4] text-xs border border-[#06B6D4]/20 px-2.5 py-1 rounded-full">{m.badge}</span>
                      </div>
                      <button onClick={() => goTo("modeles")} className="text-xs text-gray-500 group-hover:text-[#06B6D4] transition-colors cursor-pointer ml-4">Utiliser →</button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Pipeline */}
          <section className="py-24 px-6 bg-[#070D1A]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#06B6D4] text-sm font-semibold mb-3">Intégration</p>
                <h2 className="text-white text-4xl font-bold">5 minutes pour aller en prod</h2>
              </Reveal>
              <div className="grid md:grid-cols-4 gap-4">
                {pipeline.map((step, i) => (
                  <Reveal key={step.step} delay={i * 0.1}>
                    <div className="bg-[#0D1525] border border-white/5 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 bg-[#06B6D4] rounded-full text-black text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="text-white text-sm font-semibold">{step.step}</span>
                      </div>
                      <div className="bg-[#060B16] rounded-xl p-3 mb-4 font-mono text-[10px] text-[#06B6D4] whitespace-pre-line">{step.code}</div>
                      <p className="text-gray-500 text-xs">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
              <Reveal className="text-center mb-12">
                <h2 className="text-white text-4xl font-bold">Questions fréquentes</h2>
              </Reveal>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="bg-[#0D1525] border border-white/5 rounded-2xl cursor-pointer overflow-hidden" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <div className="flex items-center justify-between p-5">
                        <p className="text-white font-medium text-sm">{faq.q}</p>
                        <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-4" />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 px-6 bg-[#070D1A]">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <div className="relative bg-gradient-to-br from-[#06B6D4]/10 to-[#8B5CF6]/10 border border-[#06B6D4]/20 rounded-3xl p-10 md:p-16">
                  <Cloud className="w-10 h-10 text-[#06B6D4] mx-auto mb-6 opacity-60" />
                  <h2 className="text-white text-4xl font-bold mb-4">Prêt à scaler votre IA ?</h2>
                  <p className="text-gray-400 max-w-lg mx-auto mb-10">$50 de crédits offerts pour démarrer. Aucune carte de crédit requise.</p>
                  <button onClick={() => goTo("pricing")} className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-lg">
                    Créer un compte gratuit →
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      

      

      

      

      

      

      {/* ============================== FOOTER (always visible) ============================== */}
      <footer className="bg-[#060B16] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div><span className="text-white font-bold">{fd?.businessName ?? "NimbusAI"}</span></div>
            <p className="text-gray-500 text-sm">Cloud AI infrastructure pour les équipes qui construisent les produits de demain.</p>
          </div>
          {[
            { title: "Produit", links: ["Modèles", "GPU Cloud", "Vector DB", "API Reference"] },
            { title: "Ressources", links: ["Documentation", "Quickstart", "Blog", "Changelog"] },
            { title: "Légal", links: ["Confidentialité", "CGU", "DPA RGPD", "Status"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <button onClick={() => goTo(footerLinkMap[l] ?? "home")} className="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600">
          <span>© 2026 NimbusAI. All rights reserved.</span>
          <span><Globe className="w-3 h-3 inline mr-1" />Cloud AI · 12 regions</span>
        </div>
      </footer>
    </div>
  );
}
