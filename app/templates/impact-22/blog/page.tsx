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

export default function NimbusAIBlogPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page] = useState<ActivePage>("blog");

  const goTo = (p: ActivePage) => {
    window.location.href = p === "home" ? "/templates/impact-22" : `/templates/impact-22/${p}`;
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-dvh bg-[#060B16]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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

      

      

      

      

      {/* ============================== BLOG PAGE ============================== */}
      <div>
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
