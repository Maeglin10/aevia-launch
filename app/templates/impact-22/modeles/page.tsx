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

export default function NimbusAIModelesPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page] = useState<ActivePage>("modeles");

  const goTo = (p: ActivePage) => {
    window.location.href = p === "home" ? "/templates/impact-22" : `/templates/impact-22/${p}`;
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

      

      {/* ============================== MODÈLES PAGE ============================== */}
      <div>
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
