"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, TrendingUp, BarChart3, Globe, Users, ChevronRight, Building2, DollarSign, Award, Mail, Phone } from "lucide-react";

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

export default function SummitCapitalPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const filtered = activeFilter === "Tous" ? portfolio : portfolio.filter(p => p.sector === activeFilter);

  return (
    <div className="min-h-screen bg-[#09090B]" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#09090B]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#C9A86C] tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}>
            Summit Capital
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-sm font-medium">
            {["Thèses", "Portefeuille", "Équipe", "Actualités", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex border border-[#C9A86C]/40 text-[#C9A86C] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer">
            Nous contacter
          </button>
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
            {["Thèses", "Portefeuille", "Équipe", "Actualités", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center">
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85" alt="Summit Capital" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#09090B]/80 to-[#09090B]" />
        </motion.div>
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity }}>
          <Reveal>
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-6">Venture Capital — Paris · Berlin · Dubai</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-white text-6xl md:text-8xl leading-none mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Financer les<br /><em>champions</em> de<br />demain
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/60 text-xl max-w-lg leading-relaxed mb-10">
              500M€ sous gestion. 47 participations actives. Un seul objectif : accompagner les entrepreneurs qui redéfinissent des marchés entiers.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex gap-4">
              <button className="bg-[#C9A86C] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer flex items-center gap-2">
                Voir le portefeuille <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white/15 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                Pitcher notre équipe
              </button>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#C9A86C]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[["500M€", "Sous gestion"], ["47", "Participations actives"], ["3", "Licornes portefeuille"], ["8.4×", "Multiple moyen (exits)"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-black text-3xl font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{n}</p>
              <p className="text-black/50 text-xs uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment theses */}
      <section className="py-24 px-6 bg-[#0F0F11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Thèses d'investissement</p>
              <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Ce que nous finançons</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {theses.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1}>
                <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-[#C9A86C]/10 rounded-xl flex items-center justify-center text-[#C9A86C] mb-5 group-hover:bg-[#C9A86C] group-hover:text-black transition-colors">{t.icon}</div>
                  <h3 className="text-white text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Portefeuille</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Nos participations</h2>
              </div>
              <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
                {sectors.map(s => (
                  <button key={s} onClick={() => setActiveFilter(s)} className={`px-3 py-1.5 text-xs transition-all cursor-pointer rounded-lg border ${activeFilter === s ? "bg-[#C9A86C] text-black border-[#C9A86C]" : "border-white/10 text-white/40 hover:border-[#C9A86C]/40"}`}>{s}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((co, i) => (
                <motion.div key={co.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Reveal delay={i * 0.07}>
                    <div className="bg-[#141416] border border-white/5 rounded-2xl p-6 hover:border-[#C9A86C]/20 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#C9A86C]/10 rounded-xl flex items-center justify-center text-[#C9A86C] text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{co.name.charAt(0)}</div>
                        <span className="text-[#C9A86C] text-xs border border-[#C9A86C]/20 px-2.5 py-1 rounded-full">{co.round}</span>
                      </div>
                      <h3 className="text-white font-semibold mb-1">{co.name}</h3>
                      <p className="text-white/30 text-xs mb-4">{co.sector} · {co.year}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">{co.amount}</span>
                        <span className="text-emerald-400 text-sm font-semibold">{co.growth}</span>
                      </div>
                    </div>
                  </Reveal>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-[#0F0F11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">L'équipe</p>
              <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Nos partners</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-[#C9A86C] rounded-2xl mb-6 flex items-center justify-center text-black text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name.charAt(0)}</div>
                  <h3 className="text-white text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h3>
                  <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">{t.role}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{t.background}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Histoire</p>
            <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>10 ans d'impact</h2>
          </Reveal>
          <div className="relative border-l border-[#C9A86C]/20 pl-10 space-y-10">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-[2.875rem] w-3 h-3 rounded-full bg-[#C9A86C] border-2 border-[#09090B] top-1" />
                  <span className="text-[#C9A86C] text-xs tracking-widest uppercase">{m.year} · {m.label}</span>
                  <p className="text-white text-lg mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{m.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-[#0F0F11]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#141416] border border-[#C9A86C]/15 rounded-3xl p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">Pitcher Summit Capital</p>
                  <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Vous avez un projet ambitieux ?</h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">Nous rencontrons 500+ startups par an et investissons dans 5 à 8 nouvelles participations. Taux de réponse : 100% en 72h.</p>
                  <div className="space-y-3">
                    {[{ icon: <Mail className="w-4 h-4" />, v: "pitch@summit-capital.vc" }, { icon: <Phone className="w-4 h-4" />, v: "+33 1 49 00 00 00" }, { icon: <Building2 className="w-4 h-4" />, v: "16 Rue de la Paix, 75002 Paris" }].map(c => (
                      <div key={c.v} className="flex items-center gap-3 text-white/50 text-sm">
                        <span className="text-[#C9A86C]">{c.icon}</span>{c.v}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <input type="text" placeholder="Nom de la startup" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30" />
                  <input type="email" placeholder="Email fondateur" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30" />
                  <select className="bg-[#1E1E22] border border-white/10 text-white/60 text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A86C]/50 cursor-pointer">
                    <option>Stade de financement</option>
                    <option>Pre-seed</option>
                    <option>Seed</option>
                    <option>Série A</option>
                    <option>Série B+</option>
                  </select>
                  <textarea rows={3} placeholder="Décrivez votre projet en 3 lignes" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30 resize-none" />
                  <button className="bg-[#C9A86C] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer text-sm">
                    Envoyer le pitch deck
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#09090B] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20">
          <span className="text-[#C9A86C] text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Summit Capital</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Portefeuille</Link>
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Confidentialité</Link>
          </div>
          <span>© 2026 Summit Capital. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
