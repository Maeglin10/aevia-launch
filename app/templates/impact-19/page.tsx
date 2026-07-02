"use client";
// @ts-nocheck

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

type ActivePage = "home" | "theses" | "portefeuille" | "equipe" | "blog" | "contact" | "legal";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SummitCapitalPage() {
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
  const [page, setPage] = useState<ActivePage>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const goTo = (p: ActivePage) => {
    setPage(p);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const filtered = activeFilter === "Tous" ? portfolio : portfolio.filter(p => p.sector === activeFilter);

  
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
    <div className="min-h-screen bg-[#09090B] text-white overflow-x-clip flex flex-col" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#09090B]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div onClick={() => goTo("home")} className="text-[#C9A86C] tracking-widest cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}>{fd?.businessName ?? "Summit Capital"}</div>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-sm font-medium">
            {[
              { name: "Thèses", key: "theses" },
              { name: "Portefeuille", key: "portefeuille" },
              { name: "Équipe", key: "equipe" },
              { name: "Actualités", key: "blog" },
              { name: "Contact", key: "contact" }
            ].map(item => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }}
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${page === item.key ? "text-[#C9A86C] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <button onClick={() => goTo("contact")} className="hidden md:inline-flex border border-[#C9A86C]/40 text-[#C9A86C] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer">
            Nous contacter
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#09090B] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fd?.businessName ?? "Summit Capital"}</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {[
              { name: "Accueil", key: "home" },
              { name: "Thèses", key: "theses" },
              { name: "Portefeuille", key: "portefeuille" },
              { name: "Équipe", key: "equipe" },
              { name: "Actualités", key: "blog" },
              { name: "Contact", key: "contact" },
              { name: "Mentions Légales", key: "legal" }
            ].map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <a
                  href={`#${item.key}`}
                  className={`block text-white text-3xl mb-6 cursor-pointer ${page === item.key ? "text-[#C9A86C] font-bold" : ""}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  onClick={(e) => { e.preventDefault(); goTo(item.key as any); }}
                >
                  {item.name}
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        {page === "home" && (
          <>
            {/* Hero */}
            <section id="hero" ref={heroRef} className="relative h-screen overflow-hidden flex items-center">
              <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
                <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85" alt={fd?.businessName ?? "Summit Capital"} fill className="object-cover opacity-30" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#09090B]/80 to-[#09090B]" />
              </motion.div>
              <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity }}>
                <Reveal>
                  <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-6">Venture Capital — Paris · Berlin · Dubai</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-white text-6xl md:text-8xl leading-none mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{c?.heroHeadline ?? <>
                    Financer les<br /><em>champions</em> de<br />demain
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-white/60 text-xl max-w-lg leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                    500M€ sous gestion. 47 participations actives. Un seul objectif : accompagner les entrepreneurs qui redéfinissent des marchés entiers.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex gap-4">
                    <button onClick={() => goTo("portefeuille")} className="bg-[#C9A86C] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer flex items-center gap-2">
                      Voir le portefeuille <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => goTo("contact")} className="border border-white/15 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
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

            {/* Investment theses Preview */}
            <section className="py-24 px-6 bg-[#0F0F11]">
              <div className="max-w-6xl mx-auto">
                <Reveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                      <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Thèses d'investissement</p>
                      <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Ce que nous finançons</h2>
                    </div>
                    <button onClick={() => goTo("theses")} className="mt-4 md:mt-0 text-[#C9A86C] font-semibold flex items-center gap-2 hover:underline cursor-pointer">
                      Nos critères <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Reveal>
                <div className="grid md:grid-cols-2 gap-5">
                  {theses.slice(0, 2).map((t, i) => (
                    <Reveal key={t.title} delay={i * 0.1}>
                      <div onClick={() => goTo("theses")} className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-[#C9A86C]/10 rounded-xl flex items-center justify-center text-[#C9A86C] mb-5 group-hover:bg-[#C9A86C] group-hover:text-black transition-colors">{t.icon}</div>
                        <h3 className="text-white text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{t.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "theses" && <ThesesPage />}
        {page === "portefeuille" && <PortefeuillePage activeFilter={activeFilter} setActiveFilter={setActiveFilter} filtered={filtered} />}
        {page === "equipe" && <EquipePage />}
        {page === "blog" && <BlogPage />}
        {page === "contact" && <ContactPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-[#09090B] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20">
          <div onClick={() => goTo("home")} className="text-[#C9A86C] text-lg cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fd?.businessName ?? "Summit Capital"}</div>
          <div className="flex gap-8">
            <a href="/templates/impact-19" onClick={(e) => { e.preventDefault(); goTo("portefeuille"); }} className="hover:text-[#C9A86C] transition-colors">Portefeuille</a>
            <a href="/templates/impact-19" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C9A86C] transition-colors">Mentions légales</a>
            <a href="/templates/impact-19" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C9A86C] transition-colors">Confidentialité</a>
          </div>
          <span>© 2026 Summit Capital. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (SUMMIT CAPITAL GOLD & DARK STYLE)
   ========================================================================= */

function ThesesPage() {
  return (
    <section id="realisations" className="py-20 px-6 bg-[#0F0F11] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block">Manifeste</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Thèses d'investissement</h1>
          <p className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed">
            Nous investissons dès le stade Seed / Série A dans des projets technologiques à fort impact avec un ticket moyen allant de 2M€ à 15M€.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {theses.map((t, i) => (
            <div key={t.title} className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-[#C9A86C]/10 rounded-xl flex items-center justify-center text-[#C9A86C] mb-6">{t.icon}</div>
              <h3 className="text-white text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{t.desc}</p>
              <ul className="text-xs text-white/40 space-y-2 border-t border-white/5 pt-4">
                <li>• Horizon de sortie : 5 à 8 ans</li>
                <li>• Rôle : Lead ou co-lead investisseur</li>
                <li>• Support opérationnel : Recrutement clé, expansion US/Moyen-Orient</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortefeuillePage({ activeFilter, setActiveFilter, filtered }: { activeFilter: string; setActiveFilter: (f: string) => void; filtered: typeof portfolio }) {
  return (
    <section className="py-20 px-6 bg-[#09090B] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block">Partenaires</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Notre Portefeuille</h1>
          <p className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed mb-10">
            Découvrez les scale-ups et licornes que nous accompagnons activement sur les marchés européens et internationaux.
          </p>

          <div className="flex gap-2 flex-wrap justify-center mt-8">
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`px-4 py-2 text-xs transition-all cursor-pointer rounded-lg border font-medium ${activeFilter === s ? "bg-[#C9A86C] text-black border-[#C9A86C]" : "border-white/10 text-white/40 hover:border-[#C9A86C]/40"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((co, i) => (
              <motion.div
                key={co.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#141416] border border-white/5 rounded-2xl p-6 hover:border-[#C9A86C]/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#C9A86C]/10 rounded-xl flex items-center justify-center text-[#C9A86C] text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{co.name.charAt(0)}</div>
                  <span className="text-[#C9A86C] text-xs border border-[#C9A86C]/20 px-2.5 py-1 rounded-full">{co.round}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{co.name}</h3>
                <p className="text-white/30 text-xs mb-4">{co.sector} · {co.year}</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-white/60 text-sm">Financement : {co.amount}</span>
                  <span className="text-emerald-400 text-sm font-semibold">{co.growth} (Growth)</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function EquipePage() {
  return (
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
  );
}

function BlogPage() {
  const notes = [
    { title: "L'essor des infrastructures d'IA souveraines en Europe", desc: "Analyse trimestrielle du fonds sur la souveraineté technologique et les nouvelles architectures LLM locales.", date: "6 juin 2026" },
    { title: "Comment réussir son expansion commerciale aux USA", desc: "Conseils pratiques de notre pôle opérations pour les startups européennes en Série A.", date: "24 mai 2026" },
    { title: "Summit Capital IV : 500M€ pour la Deep Tech", desc: "Annonce officielle du bouclage de notre quatrième fonds d'investissement à focus IA et infrastructure.", date: "10 mai 2026" }
  ];

  return (
    <section className="py-20 px-6 bg-[#09090B] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block">Actualités</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Notes de Recherche</h1>
          <p className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed">
            Nos réflexions sur le capital-risque, l'analyse sectorielle profonde et la macroéconomie des scale-ups.
          </p>
        </div>

        <div className="space-y-6">
          {notes.map((n, idx) => (
            <div key={idx} className="bg-[#141416] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-all cursor-pointer">
              <span className="text-xs text-[#C9A86C] font-mono">{n.date}</span>
              <h3 className="text-white text-2xl font-light mt-2 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{n.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="py-20 px-6 bg-[#0F0F11] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block">Pitch deck</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Proposer mon projet</h1>
          <p className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed">
            Nous lisons tous les dossiers soumis sous 72h. Partagez votre deck d'investissement avec notre équipe opérationnelle.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6 bg-[#141416] border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Bureaux</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Building2 className="w-4 h-4 text-[#C9A86C] shrink-0" />
                <span>Paris (Showroom), Berlin, Dubaï</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="w-4 h-4 text-[#C9A86C] shrink-0" />
                <span>{fd?.email ?? "pitch@summit-capital.vc"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="w-4 h-4 text-[#C9A86C] shrink-0" />
                <span>+33 1 49 00 00 00</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#141416] p-8 rounded-2xl border border-white/10 flex flex-col gap-4">
            <input type="text" placeholder="Nom de la startup" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30" />
            <input type="email" placeholder="Email fondateur" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30" />
            <select className="bg-[#1E1E22] border border-white/10 text-white/60 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C9A86C]/50 cursor-pointer">
              <option>Stade de financement</option>
              <option>Pre-seed</option>
              <option>Seed</option>
              <option>Série A</option>
              <option>Série B+</option>
            </select>
            <textarea rows={4} placeholder="Décrivez votre projet en quelques phrases (problématique, technologie clé, clients cibles...)" className="bg-[#1E1E22] border border-white/10 text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C9A86C]/50 placeholder-white/30 resize-none" />
            <button className="bg-[#C9A86C] text-black font-semibold px-6 py-4 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer text-sm flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Soumettre mon Pitch Deck
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <section id="contact" className="py-20 px-6 bg-[#09090B] border-t border-white/5 font-mono text-xs text-white/40">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[#C9A86C] text-[10px] uppercase tracking-widest mb-3 block font-bold">Sécurité financière</span>
          <h1 className="text-4xl md:text-5xl font-light uppercase text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mentions Légales</h1>
        </div>

        <div className="border border-[#C9A86C]/20 bg-[#141416] p-8 rounded-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="text-[#C9A86C] text-[10px] font-bold uppercase mb-2">ÉDITEUR</div>
            <p className="leading-relaxed font-sans text-sm text-white/75">
              <strong>Aevia WS — Valentin Milliand</strong><br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Email : valentinmilliand@aevia.services<br />
              Adresse : Communiquée sur demande
            </p>
          </div>

          <div className="border-b border-white/5 pb-4">
            <div className="text-[#C9A86C] text-[10px] font-bold uppercase mb-2">HÉBERGEUR</div>
            <p className="leading-relaxed font-sans text-sm text-white/75">
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA
            </p>
          </div>

          <div>
            <div className="text-[#C9A86C] text-[10px] font-bold uppercase mb-2">AGRÉMENTS FINANCIERS</div>
            <p className="leading-relaxed font-sans text-xs text-white/40">
              Summit Capital est une marque détenue par Aevia WS. Ce site présente des informations indicatives et ne constitue pas une offre publique d'investissement, un conseil en gestion de patrimoine ou une sollicitation financière réglementée.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
