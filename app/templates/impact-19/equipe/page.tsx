"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, TrendingUp, BarChart3, Globe, Users, ChevronRight, Building2, DollarSign, Award, Mail, Phone, Calendar, Send } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("sc-fonts")) return;
    const s = document.createElement("style");
    s.id = "sc-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Barlow:wght@400;500;600&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const portfolio = [
  { name: "Nexira Health", sector: "HealthTech", round: "Série B", amount: "28M€", year: "2025", growth: "+340%" },
  { name: "FinXpert AI", sector: "FinTech", round: "Série A", amount: "12M€", year: "2024", growth: "+180%" },
  { name: "GreenLoop", sector: "CleanTech", round: "Seed", amount: "4.5M€", year: "2024", growth: "+290%" },
  { name: "CloudMesh", sector: "Infrastructure", round: "Série C", amount: "67M€", year: "2023", growth: "+420%" },
  { name: "Meridian EdTech", sector: "EdTech", round: "Série A", amount: "18M€", year: "2025", growth: "+210%" },
  { name: "Securis Labs", sector: "CyberSec", round: "Série B", amount: "35M€", year: "2023", growth: "+380%" },
];

const theses = [
  { icon: <TrendingUp className="w-5 h-5" />, title: "Deep Tech & IA", desc: "Fondateurs techniques, propriété intellectuelle défendable, marché adressable > 5Md€." },
  { icon: <Globe className="w-5 h-5" />, title: "B2B Enterprise", desc: "SaaS à ventes complexes, contrats pluriannuels, expansion internationale dès le Seed." },
  { icon: <Building2 className="w-5 h-5" />, title: "Infrastructure critique", desc: "Couche d'infrastructure dans des marchés réglementés : fintech, santé, énergie, défense." },
  { icon: <Users className="w-5 h-5" />, title: "Marketplaces verticales", desc: "Effet réseau asymétrique dans des secteurs fragmentés. Take rate > 15%." },
];

const team = [
  { name: "Édouard Merlin", role: "Managing Partner", background: "Ex-Partner Sequoia Europe · fondateur de 3 startups (2 exits)" },
  { name: "Isabelle Vance", role: "General Partner", background: "Ex-CFO Goldman Sachs Europe · Advisory Board OpenAI France" },
  { name: "Marc Rousseau", role: "Partner — Opérations", background: "Ex-COO Doctolib · advisor 12 scale-ups Series B+" },
];

const sectors = ["Tous", "HealthTech", "FinTech", "CleanTech", "Infrastructure", "EdTech", "CyberSec"];

const milestones = [
  { year: "2014", label: "Fondation", value: "Premier fonds — 45M€" },
  { year: "2017", label: "Fonds II", value: "120M€ levés — 18 participations" },
  { year: "2020", label: "Fonds III", value: "280M€ — 3 licornes portefeuille" },
  { year: "2024", label: "Fonds IV", value: "500M€ — focus IA & infrastructure" },
];

export default function Page() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  
  const { scrollYProgress } = useScroll();
  const filtered = activeFilter === "Tous" ? portfolio : portfolio.filter(p => p.sector === activeFilter);

  return (
    <div className="min-h-dvh bg-[#09090B] text-white overflow-x-clip flex flex-col" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#09090B]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-19" className="text-[#C9A86C] tracking-widest cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}>
            Summit Capital
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-sm font-medium">
            {[
              { name: "Thèses", key: "theses" },
              { name: "Portefeuille", key: "portefeuille" },
              { name: "Équipe", key: "equipe" },
              { name: "Actualités", key: "blog" },
              { name: "Contact", key: "contact" }
            ].map(item => (
              <Link
                key={item.key}
                href={`/templates/impact-19/${item.key}`}
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${"equipe" === item.key ? "text-[#C9A86C] font-bold" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/templates/impact-19/contact" className="hidden md:inline-flex border border-[#C9A86C]/40 text-[#C9A86C] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer">
            Nous contacter
          </Link>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#09090B] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Summit Capital</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {[
              { name: "Accueil", key: "" },
              { name: "Thèses", key: "theses" },
              { name: "Portefeuille", key: "portefeuille" },
              { name: "Équipe", key: "equipe" },
              { name: "Actualités", key: "blog" },
              { name: "Contact", key: "contact" },
              { name: "Mentions Légales", key: "legal" }
            ].map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link
                  href={`/templates/impact-19/${item.key}`}
                  className={`block text-white text-3xl mb-6 cursor-pointer ${"equipe" === item.key ? "text-[#C9A86C] font-bold" : ""}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32">
        
        <section id="services" className="py-20 px-6 bg-[#0F0F11] border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block">Gouvernance</span>
              <h1 className="text-5xl md:text-7xl font-light mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>L'Équipe</h1>
              <p className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed">
                Des investisseurs expérimentés et anciens entrepreneurs au service de la croissance de votre startup.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((t, i) => (
                <div key={t.name} className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-[#C9A86C] rounded-2xl mb-6 flex items-center justify-center text-black text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name.charAt(0)}</div>
                    <h3 className="text-white text-2xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h3>
                    <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">{t.role}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{t.background}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-20 border-t border-white/10 pt-16">
              <h2 className="text-3xl font-light text-white mb-12 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>10 ans d'histoire</h2>
              <div className="relative border-l border-[#C9A86C]/20 pl-10 space-y-10 max-w-xl mx-auto">
                {milestones.map((m, i) => (
                  <div key={m.year} className="relative">
                    <div className="absolute -left-[2.875rem] w-3 h-3 rounded-full bg-[#C9A86C] border-2 border-[#09090B] top-1" />
                    <span className="text-[#C9A86C] text-xs tracking-widest uppercase">{m.year} · {m.label}</span>
                    <p className="text-white text-lg mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
  
      </main>

      {/* Footer */}
      <footer className="bg-[#09090B] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20">
          <Link href="/templates/impact-19" className="text-[#C9A86C] text-lg cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Summit Capital</Link>
          <div className="flex gap-8">
            <Link href="/templates/impact-19/portefeuille" className="hover:text-[#C9A86C] transition-colors">Portefeuille</Link>
            <Link href="/templates/impact-19/legal" className="hover:text-[#C9A86C] transition-colors">Mentions légales</Link>
            <Link href="/templates/impact-19/confidentialite" className="hover:text-[#C9A86C] transition-colors">Confidentialité</Link>
          </div>
          <span>© 2026 Summit Capital. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
