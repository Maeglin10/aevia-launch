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

export default function NimbusAIDocsPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page] = useState<ActivePage>("docs");

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

      

      

      

      {/* ============================== DOCS PAGE ============================== */}
      <div>
          <section id="about" className="pt-32 pb-16 px-6">
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
