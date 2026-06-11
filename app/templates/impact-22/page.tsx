"use client";

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

export default function NimbusAIPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
    setMobileOpen(false);
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#060B16]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#060B16]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">NimbusAI</span>
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
              <span className="text-white font-bold text-xl">NimbusAI</span>
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
      <div style={{ display: page === "home" ? "block" : "none" }}>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
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
                <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6">
                  L&apos;infrastructure IA<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">pour les builders sérieux</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                  Inférence GPU à la demande, models-as-a-service, vector DB intégrée. Scalez de 0 à production en 5 minutes.
                </p>
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
                <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
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

      {/* ============================== MODÈLES PAGE ============================== */}
      <div style={{ display: page === "modeles" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                  <Cpu className="w-3 h-3" /> Catalogue modèles
                </div>
                <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Tous les modèles,<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">une seule API</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
                  Open-source et propriétaires. Chaque modèle est optimisé pour notre infrastructure bare-metal avec quantization automatique et batching intelligent.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Detailed model cards */}
          <section className="pb-16 px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {[
                { name: "LLaMA 3.1 405B", provider: "Meta", type: "LLM — Text generation", params: "405B", ctx: "128K tokens", latencyP50: "90ms", latencyP99: "145ms", throughput: "85 tok/s", cost: "0.70$", costUnit: "/ 1M tokens", badge: "Recommandé", color: "#06B6D4", desc: "Le modèle open-source le plus puissant. Idéal pour le raisonnement complexe, la génération de code, et les tâches multilingues. Fine-tuning disponible via LoRA.", useCases: ["Chatbots enterprise", "Code generation", "Analyse documentaire", "RAG pipelines"] },
                { name: "Mistral Large 2", provider: "Mistral AI", type: "LLM — Text generation", params: "123B", ctx: "64K tokens", latencyP50: "65ms", latencyP99: "110ms", throughput: "120 tok/s", cost: "0.45$", costUnit: "/ 1M tokens", badge: "Populaire", color: "#8B5CF6", desc: "Excellent rapport qualité/prix. Le choix par défaut pour la majorité des workloads production. Support natif du français et des langues européennes.", useCases: ["Support client", "Résumé automatique", "Classification", "Extraction d'entités"] },
                { name: "GPT-4o", provider: "OpenAI", type: "Multimodal — Text + Vision + Audio", params: "N/A", ctx: "128K tokens", latencyP50: "120ms", latencyP99: "220ms", throughput: "60 tok/s", cost: "1.20$", costUnit: "/ 1M tokens", badge: "OpenAI", color: "#10B981", desc: "Le modèle multimodal de référence. Analyse d'images, transcription audio et génération de texte dans un seul appel API. Routé via notre proxy optimisé.", useCases: ["Analyse d'images", "Multimodal apps", "Creative writing", "Complex reasoning"] },
                { name: "SDXL Turbo", provider: "Stability AI", type: "Image — Text-to-Image", params: "3.5B", ctx: "77 tokens (prompt)", latencyP50: "30ms", latencyP99: "55ms", throughput: "33 img/s", cost: "0.01$", costUnit: "/ image", badge: "Diffusion", color: "#F59E0B", desc: "Génération d'images en temps réel. Architecture distillée pour une latence ultra-basse. Résolutions jusqu'à 1024×1024. ControlNet et LoRA supportés.", useCases: ["Génération de visuels", "Product mockups", "Art génératif", "Prototypage UI"] },
                { name: "Whisper Large v3", provider: "OpenAI", type: "Audio — Speech-to-Text", params: "1.5B", ctx: "30 min audio", latencyP50: "RT×0.15", latencyP99: "RT×0.25", throughput: "6.7× realtime", cost: "0.006$", costUnit: "/ minute", badge: "STT", color: "#EF4444", desc: "Transcription multilingue de qualité humaine. 99 langues supportées. Détection automatique de la langue. Timestamps au niveau mot disponibles.", useCases: ["Transcription calls", "Sous-titrage", "Voice search", "Accessibility"] },
              ].map((m, i) => (
                <Reveal key={m.name} delay={i * 0.08}>
                  <div className="bg-[#0D1525] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15`, color: m.color }}>
                            <Cpu className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{m.name}</h3>
                            <p className="text-gray-500 text-xs">{m.provider} · {m.type}</p>
                          </div>
                          <span className="text-xs border px-2.5 py-1 rounded-full ml-2" style={{ color: m.color, borderColor: `${m.color}33` }}>{m.badge}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{m.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {m.useCases.map(uc => (
                            <span key={uc} className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full">{uc}</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:min-w-[320px]">
                        {[
                          ["Paramètres", m.params],
                          ["Contexte", m.ctx],
                          ["Latence P50", m.latencyP50],
                          ["Latence P99", m.latencyP99],
                          ["Throughput", m.throughput],
                          ["Tarif", `${m.cost} ${m.costUnit}`],
                        ].map(([label, val]) => (
                          <div key={label} className="bg-[#060B16] rounded-xl p-3 text-center">
                            <p className="text-white text-sm font-semibold">{val}</p>
                            <p className="text-gray-600 text-[10px] mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section className="py-16 px-6 bg-[#070D1A]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-10">
                <h2 className="text-white text-3xl font-bold">Comparaison rapide</h2>
                <p className="text-gray-500 text-sm mt-2">Toutes les métriques sont mesurées sur notre infrastructure EU-West-1.</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Modèle", "Type", "Latence P50", "Latence P99", "Throughput", "Coût / 1M tokens", "Contexte"].map(h => (
                          <th key={h} className="text-left text-gray-400 font-medium py-4 px-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["LLaMA 3.1 405B", "LLM", "90ms", "145ms", "85 tok/s", "0.70$", "128K"],
                        ["Mistral Large 2", "LLM", "65ms", "110ms", "120 tok/s", "0.45$", "64K"],
                        ["GPT-4o", "Multimodal", "120ms", "220ms", "60 tok/s", "1.20$", "128K"],
                        ["SDXL Turbo", "Image", "30ms", "55ms", "33 img/s", "0.01$ / img", "—"],
                        ["Whisper Large v3", "Audio", "RT×0.15", "RT×0.25", "6.7× RT", "0.006$ / min", "30 min"],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-3.5 px-3 whitespace-nowrap ${j === 0 ? "text-white font-medium" : "text-gray-400"}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <h2 className="text-white text-3xl font-bold mb-4">Besoin d&apos;un modèle custom ?</h2>
                <p className="text-gray-400 mb-8">Uploadez vos modèles fine-tunés via CLI. Formats GGUF, SafeTensors, ONNX supportés.</p>
                <button onClick={() => goTo("docs")} className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                  Lire la documentation →
                </button>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== PRICING PAGE ============================== */}
      <div style={{ display: page === "pricing" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                  <Tag className="w-3 h-3" /> Tarification transparente
                </div>
                <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Pay-as-you-go.<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">Scale sans limites.</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
                  Aucun engagement minimum. Volume discounts automatiques. $50 de crédits offerts au démarrage.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Tiers */}
          <section className="pb-20 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Starter",
                  price: "Gratuit",
                  priceNote: "$50 de crédits inclus",
                  color: "#06B6D4",
                  popular: false,
                  features: ["5 modèles open-source", "GPU A100 partagé", "100K tokens / jour", "Latence standard", "Support communautaire", "1 endpoint", "Dashboard basique"],
                  cta: "Commencer gratuitement",
                },
                {
                  name: "Pro",
                  price: "À l'usage",
                  priceNote: "à partir de 0.45$ / 1M tokens",
                  color: "#8B5CF6",
                  popular: true,
                  features: ["Tous les modèles", "GPU A100 / H100 dédiés", "Tokens illimités", "Latence optimisée (< 100ms)", "Support prioritaire 24/7", "Endpoints illimités", "Observabilité complète", "Auto-scaling intelligent", "Volume discounts auto"],
                  cta: "Démarrer en Pro",
                },
                {
                  name: "Enterprise",
                  price: "Sur mesure",
                  priceNote: "contactez notre équipe",
                  color: "#10B981",
                  popular: false,
                  features: ["Modèles custom & fine-tuning", "GPU H100 bare-metal dédiés", "SLA 99.99% garanti", "VPC privé & isolation", "Conformité RGPD, HIPAA, SOC2", "Support dédié + TAM", "On-premise disponible", "Audit logs & SSO/SAML", "Contrat personnalisé"],
                  cta: "Contacter les ventes",
                },
              ].map((tier, i) => (
                <Reveal key={tier.name} delay={i * 0.1}>
                  <div className={`relative bg-[#0D1525] border rounded-2xl p-8 flex flex-col h-full ${tier.popular ? "border-[#8B5CF6]/40" : "border-white/5"}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white text-xs font-bold px-4 py-1 rounded-full">
                        Le plus populaire
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-xl mb-1">{tier.name}</h3>
                      <p className="text-3xl font-bold mt-2" style={{ color: tier.color }}>{tier.price}</p>
                      <p className="text-gray-500 text-xs mt-1">{tier.priceNote}</p>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tier.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 ${tier.popular ? "bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white" : "border border-white/10 text-white hover:bg-white/5"}`}>
                      {tier.cta}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* GPU Pricing table */}
          <section className="py-20 px-6 bg-[#070D1A]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-10">
                <h2 className="text-white text-3xl font-bold">Tarifs GPU à la demande</h2>
                <p className="text-gray-500 text-sm mt-2">Facturation à la seconde. Pas de minimum. Auto-scale de 0 à 1 000 GPU.</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["GPU", "VRAM", "À la demande", "Réservé 1 mois", "Réservé 12 mois", "Cas d'usage"].map(h => (
                          <th key={h} className="text-left text-gray-400 font-medium py-4 px-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["NVIDIA A100 40GB", "40 GB", "2.10$ / h", "1.60$ / h", "1.10$ / h", "Fine-tuning, inférence batch"],
                        ["NVIDIA A100 80GB", "80 GB", "3.20$ / h", "2.40$ / h", "1.70$ / h", "LLM large, multi-modal"],
                        ["NVIDIA H100 SXM", "80 GB", "4.50$ / h", "3.40$ / h", "2.30$ / h", "Training, inférence haute perf."],
                        ["NVIDIA L40S", "48 GB", "1.80$ / h", "1.35$ / h", "0.95$ / h", "Inférence images, vidéo"],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-3.5 px-3 whitespace-nowrap ${j === 0 ? "text-white font-medium" : "text-gray-400"}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Volume discounts */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <Reveal className="text-center mb-12">
                <h2 className="text-white text-3xl font-bold">Volume discounts automatiques</h2>
                <p className="text-gray-500 text-sm mt-2">Plus vous consommez, moins vous payez. Appliqué automatiquement.</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["< 10M", "tokens/mois", "0%", "Tarif standard"],
                    ["10M — 100M", "tokens/mois", "-15%", "Auto appliqué"],
                    ["100M — 1B", "tokens/mois", "-30%", "Auto appliqué"],
                    ["> 1B", "tokens/mois", "-50%", "Contrat custom"],
                  ].map(([range, unit, discount, note]) => (
                    <div key={range} className="bg-[#0D1525] border border-white/5 rounded-2xl p-5 text-center">
                      <p className="text-white font-bold text-sm">{range}</p>
                      <p className="text-gray-600 text-xs mb-3">{unit}</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">{discount}</p>
                      <p className="text-gray-500 text-xs mt-1">{note}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== DOCS PAGE ============================== */}
      <div style={{ display: page === "docs" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                  <BookOpen className="w-3 h-3" /> Documentation développeur
                </div>
                <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Quick Start<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">Guide</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
                  De zéro à votre première inférence en 5 minutes. Bearer auth, endpoints REST, webhooks HMAC.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Step 1: Installation */}
          <section className="pb-16 px-6">
            <div className="max-w-4xl mx-auto space-y-10">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-[#06B6D4] rounded-full text-black text-sm font-bold flex items-center justify-center">1</span>
                  <h2 className="text-white text-2xl font-bold">Installation</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">Installez le SDK NimbusAI via votre package manager préféré.</p>
                <div className="bg-[#0D1525] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                    <Terminal className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-xs font-medium">Terminal</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <p className="text-gray-500 mb-1"># npm</p>
                    <p className="text-[#06B6D4] mb-3">npm install @nimbusai/sdk</p>
                    <p className="text-gray-500 mb-1"># pip</p>
                    <p className="text-[#06B6D4] mb-3">pip install nimbusai</p>
                    <p className="text-gray-500 mb-1"># curl (sans SDK)</p>
                    <p className="text-[#06B6D4]">curl -X POST https://api.nimbus.ai/v1/inference \</p>
                    <p className="text-[#06B6D4] pl-4">-H &quot;Authorization: Bearer $NIMBUS_API_KEY&quot; \</p>
                    <p className="text-[#06B6D4] pl-4">-H &quot;Content-Type: application/json&quot;</p>
                  </div>
                </div>
              </Reveal>

              {/* Step 2: Auth */}
              <Reveal delay={0.1}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-[#8B5CF6] rounded-full text-white text-sm font-bold flex items-center justify-center">2</span>
                  <h2 className="text-white text-2xl font-bold">Authentification Bearer</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Chaque requête doit inclure un header <code className="text-[#06B6D4] bg-[#06B6D4]/10 px-1.5 py-0.5 rounded text-xs">Authorization: Bearer</code>. Créez votre clé API depuis le dashboard.
                </p>
                <div className="bg-[#0D1525] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-xs font-medium">Python</span>
                  </div>
                  <div className="p-4 font-mono text-sm text-[#06B6D4] whitespace-pre-line">{`from nimbusai import NimbusClient

client = NimbusClient(
    api_key="nb_sk_...",  # ou env NIMBUS_API_KEY
    region="eu-west-1"
)

response = client.inference(
    model="mistral-large-2",
    messages=[
        {"role": "system", "content": "Tu es un assistant utile."},
        {"role": "user", "content": "Explique le RAG en 3 phrases."}
    ],
    max_tokens=500,
    temperature=0.7
)

print(response.completion)
print(f"Latence: {response.latency_ms}ms")
print(f"Coût: ${"$"}{response.cost}")`}</div>
                </div>
              </Reveal>

              {/* Step 3: Inference endpoints */}
              <Reveal delay={0.15}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-[#10B981] rounded-full text-white text-sm font-bold flex items-center justify-center">3</span>
                  <h2 className="text-white text-2xl font-bold">Endpoints d&apos;inférence</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">API REST compatible OpenAI. Migrez en changeant juste le base URL.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { method: "POST", path: "/v1/inference", desc: "Inférence synchrone. Retourne la complétion complète." },
                    { method: "POST", path: "/v1/inference/stream", desc: "Streaming SSE. Tokens envoyés en temps réel." },
                    { method: "POST", path: "/v1/embeddings", desc: "Calcul d'embeddings pour search & RAG." },
                    { method: "POST", path: "/v1/images/generate", desc: "Génération d'images (SDXL, DALL-E)." },
                    { method: "POST", path: "/v1/audio/transcribe", desc: "Transcription audio (Whisper)." },
                    { method: "GET", path: "/v1/models", desc: "Liste des modèles disponibles & métriques." },
                  ].map(ep => (
                    <div key={ep.path} className="bg-[#0D1525] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-0.5 rounded">{ep.method}</span>
                        <span className="text-white text-sm font-mono">{ep.path}</span>
                      </div>
                      <p className="text-gray-500 text-xs">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Step 4: Webhooks HMAC */}
              <Reveal delay={0.2}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-[#F59E0B] rounded-full text-black text-sm font-bold flex items-center justify-center">4</span>
                  <h2 className="text-white text-2xl font-bold">Webhooks HMAC</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Recevez des notifications asynchrones pour les jobs longs (batch, fine-tuning). Chaque payload est signé avec HMAC-SHA256.
                </p>
                <div className="bg-[#0D1525] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-xs font-medium">Node.js — Vérification signature</span>
                  </div>
                  <div className="p-4 font-mono text-sm text-[#06B6D4] whitespace-pre-line">{`import crypto from "crypto";

function verifyWebhook(payload: string, signature: string) {
  const secret = process.env.NIMBUS_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express handler
app.post("/webhooks/nimbus", (req, res) => {
  const sig = req.headers["x-nimbus-signature"];
  if (!verifyWebhook(req.body, sig)) {
    return res.status(401).send("Invalid signature");
  }
  // Process event...
  res.status(200).send("OK");
});`}</div>
                </div>
              </Reveal>

              {/* Rate limits */}
              <Reveal delay={0.25}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-[#EF4444] rounded-full text-white text-sm font-bold flex items-center justify-center">5</span>
                  <h2 className="text-white text-2xl font-bold">Rate limits & erreurs</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Plan", "Requêtes / min", "Tokens / min", "Burst max"].map(h => (
                          <th key={h} className="text-left text-gray-400 font-medium py-3 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Starter", "60", "100K", "120"],
                        ["Pro", "600", "2M", "1 200"],
                        ["Enterprise", "Illimité", "Illimité", "Custom"],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-3 px-3 ${j === 0 ? "text-white font-medium" : "text-gray-400"}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 grid md:grid-cols-3 gap-3">
                  {[
                    ["429", "Rate limit atteint. Retryez avec backoff exponentiel."],
                    ["503", "GPU temporairement indisponible. Failover auto en cours."],
                    ["401", "Clé API invalide ou expirée. Vérifiez votre Bearer token."],
                  ].map(([code, msg]) => (
                    <div key={code} className="bg-[#0D1525] border border-white/5 rounded-xl p-4">
                      <span className="text-[#EF4444] font-mono font-bold text-sm">{code}</span>
                      <p className="text-gray-500 text-xs mt-1">{msg}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== BLOG PAGE ============================== */}
      <div style={{ display: page === "blog" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                  <FileText className="w-3 h-3" /> Blog & Actualités
                </div>
                <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Engineering<br />
                  <span className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">Blog</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
                  Optimisations d&apos;infrastructure, retours d&apos;expérience client, et annonces produit.
                </p>
              </Reveal>
            </div>
          </section>

          <section className="pb-24 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Comment nous avons réduit la latence P99 de 40% sur LLaMA 3.1",
                  excerpt: "En combinant PagedAttention, continuous batching et un scheduler custom écrit en Rust, nous avons atteint 145ms P99 sur le modèle 405B — un record pour du bare-metal multi-tenant.",
                  date: "5 juin 2026",
                  category: "Performance",
                  categoryColor: "#06B6D4",
                  readTime: "8 min",
                },
                {
                  title: "Drift detection en production : identifier les dégradations de modèle",
                  excerpt: "Notre système de monitoring détecte automatiquement les drifts statistiques sur les distributions de sortie. Retour sur l'architecture event-driven qui rend ça possible à l'échelle.",
                  date: "28 mai 2026",
                  category: "Observabilité",
                  categoryColor: "#8B5CF6",
                  readTime: "12 min",
                },
                {
                  title: "Case study : Doctolib réduit ses coûts d'inférence de 73%",
                  excerpt: "En migrant de Azure OpenAI vers NimbusAI avec un mix Mistral Large / LLaMA 3.1 routé intelligemment, Doctolib a divisé sa facture par 3.7 tout en améliorant la qualité des réponses.",
                  date: "15 mai 2026",
                  category: "Case Study",
                  categoryColor: "#10B981",
                  readTime: "6 min",
                },
                {
                  title: "GPU H100 vs A100 : benchmark complet pour l'inférence LLM",
                  excerpt: "Nous avons benchmarké 14 modèles sur les deux architectures. Le H100 offre un gain de 2.1x en throughput mais le A100 reste imbattable en coût/token pour les modèles < 70B.",
                  date: "3 mai 2026",
                  category: "Benchmark",
                  categoryColor: "#F59E0B",
                  readTime: "15 min",
                },
                {
                  title: "Lancement : auto-scaling prédictif basé sur les patterns de trafic",
                  excerpt: "Notre nouveau scheduler analyse vos patterns de trafic historiques et pré-provisionne les GPU avant les pics. Résultat : 0 cold start pour 94% des requêtes sur les workloads récurrents.",
                  date: "20 avril 2026",
                  category: "Produit",
                  categoryColor: "#EF4444",
                  readTime: "5 min",
                },
              ].map((post, i) => (
                <Reveal key={post.title} delay={i * 0.08}>
                  <div className="bg-[#0D1525] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all cursor-pointer group h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${post.categoryColor}15`, color: post.categoryColor }}>
                        {post.category}
                      </span>
                      <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#06B6D4] transition-colors leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <span className="text-gray-600 text-xs">{post.date}</span>
                      <span className="text-[#06B6D4] text-xs font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Lire l&apos;article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

      {/* ============================== LOGIN PAGE ============================== */}
      <div style={{ display: page === "login" ? "block" : "none" }}>
        <section className="pt-32 pb-20 px-6 min-h-[80vh] flex items-center justify-center">
          <div className="max-w-md w-full bg-[#0D1525] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#06B6D4]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-2xl font-bold">Connexion à NimbusAI</h2>
              <p className="text-gray-500 text-sm mt-2">Accédez à votre console d&apos;administration</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">Adresse Email</label>
                <input type="email" placeholder="nom@entreprise.com" className="w-full bg-[#060B16] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#06B6D4] transition-colors" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Mot de passe</label>
                  <button className="text-[#06B6D4] text-xs hover:underline cursor-pointer bg-transparent border-none">Oublié ?</button>
                </div>
                <input type="password" placeholder="••••••••••••" className="w-full bg-[#060B16] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#06B6D4] transition-colors" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2">
                Se connecter <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="bg-[#0D1525] px-3 text-xs text-gray-500 relative">Ou continuer avec</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-[#060B16] border border-white/10 rounded-xl py-2.5 hover:bg-white/5 transition-colors cursor-pointer text-sm text-white font-medium">
                <Globe className="w-4 h-4" /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#060B16] border border-white/10 rounded-xl py-2.5 hover:bg-white/5 transition-colors cursor-pointer text-sm text-white font-medium">
                <Shield className="w-4 h-4" /> SSO
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              Pas encore de compte ? <button onClick={() => goTo("pricing")} className="text-[#06B6D4] hover:underline bg-transparent border-none cursor-pointer">Démarrer gratuitement</button>
            </p>
          </div>
        </section>
      </div>

      {/* ============================== LEGAL PAGE ============================== */}
      <div style={{ display: page === "legal" ? "block" : "none" }}>
          <section className="pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                  <Shield className="w-3 h-3" /> Informations légales
                </div>
                <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-10">Mentions légales</h1>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-8">
                  {[
                    { title: "Éditeur du site", content: "Aevia WS — Valentin Milliand, entrepreneur individuel." },
                    { title: "Immatriculation", content: "SIREN : 852 546 225 — RCS Bourg-en-Bresse." },
                    { title: "Contact", content: "contact@aevia.ws" },
                    { title: "Hébergement", content: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA." },
                    { title: "Propriété intellectuelle", content: "L'ensemble des contenus (textes, images, code, design) est protégé. Toute reproduction non autorisée est interdite." },
                    { title: "Données personnelles", content: "Aucune donnée personnelle n'est collectée sans consentement explicite. Conformité RGPD." },
                  ].map((item, i) => (
                    <div key={item.title} className="bg-[#0D1525] border border-white/5 rounded-2xl p-6">
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== FOOTER (always visible) ============================== */}
      <footer className="bg-[#060B16] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div><span className="text-white font-bold">NimbusAI</span></div>
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
