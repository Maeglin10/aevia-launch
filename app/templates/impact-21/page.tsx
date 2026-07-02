"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, Layers, Cpu, Package, Eye, ChevronRight, Globe, Award, Users, Mail, Clock, Send, Calendar, CheckCircle, Star, Lightbulb, Target, Heart, Palette, Ruler, Cog, BookOpen } from "lucide-react";

type ActivePage = "home" | "travaux" | "expertises" | "studio" | "contact" | "legal";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("fs-fonts")) return;
    const s = document.createElement("style");
    s.id = "fs-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const projects = [
  { name: "Capsule Pro", category: "Packaging", client: "L'Oréal", year: "2025", angle: "-3deg", color: "#F97316", src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80" },
  { name: "Archeus Chair", category: "Furniture", client: "Cassina", year: "2025", angle: "2deg", color: "#6366F1", src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "HaloKit", category: "Consumer Electronics", client: "Sony Design", year: "2024", angle: "-2deg", color: "#0EA5E9", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { name: "Bloom Series", category: "Tableware", client: "Seletti", year: "2024", angle: "4deg", color: "#10B981", src: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600&q=80" },
  { name: "Kinetic Lamp", category: "Lighting", client: "Foscarini", year: "2023", angle: "-1deg", color: "#F59E0B", src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
];

const disciplines = [
  { icon: <Package className="w-5 h-5" />, title: "Packaging & Branding", desc: "Identités visuelles et packaging qui s'imposent en linéaire et survivent sur les feeds Instagram." },
  { icon: <Layers className="w-5 h-5" />, title: "Mobilier & Objets", desc: "De l'esquisse 3D à la pièce finale. Prototypage rapide, édition limitée ou production en série." },
  { icon: <Cpu className="w-5 h-5" />, title: "Product Design Tech", desc: "Appareils connectés, interfaces physiques et expériences produit qui fusionnent hardware et software." },
  { icon: <Eye className="w-5 h-5" />, title: "Design de Concept", desc: "Explorations futures pour des marques en mutation. Design fiction, tendances et veille prospective." },
];

const clients = ["L'Oréal", "Sony", "Cassina", "Seletti", "Foscarini", "Hermès Design", "Renault", "Swatch Group"];

const process = [
  { n: "01", title: "Brief & Recherche", desc: "Immersion dans votre marché, analyse des usages, benchmark concurrentiel et identification des leviers d'innovation." },
  { n: "02", title: "Concept & Direction", desc: "3 pistes de direction créative avec mood boards, palettes matière et maquettes volumétriques." },
  { n: "03", title: "Design & Prototypage", desc: "Rendu 3D photoréaliste, puis prototype physique pour valider l'ergonomie et la production." },
  { n: "04", title: "Production & Lancement", desc: "Suivi des fournisseurs, contrôle qualité, photographie produit et assets marketing pour le lancement." },
];

/* ── Extended data for sub-pages ── */

const projectDetails = [
  {
    name: "Capsule Pro",
    category: "Packaging",
    client: "L'Oréal",
    year: "2025",
    color: "#F97316",
    src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
    description: "Une gamme de flacons rechargeables en aluminium recyclé pour la ligne premium L'Oréal Professionnel. Le système de capsules magnétiques simplifie le rechargement tout en maintenant l'élégance du packaging.",
    materials: "Aluminium recyclé 100%, ABS biosourcé, aimants néodyme",
    processUsed: "Conception CAO → Impression 3D métal → Moulage série",
    ergonomics: "Prise en main optimisée pour une main mouillée, mécanisme d'ouverture à une seule main. Tests utilisateurs avec 120 professionnels de la coiffure.",
  },
  {
    name: "Archeus Chair",
    category: "Furniture",
    client: "Cassina",
    year: "2025",
    color: "#6366F1",
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    description: "Fauteuil d'accueil pour les espaces hôteliers haut de gamme. Structure en frêne massif et assise en cuir pleine fleur. L'Archeus revisite les codes du design mid-century avec une approche contemporaine.",
    materials: "Frêne massif FSC, cuir pleine fleur tannage végétal, mousse HR recyclée",
    processUsed: "Esquisse → Modélisation 3D → Prototype 1:1 → Essais fatigue",
    ergonomics: "Angle d'assise de 12° pour un confort prolongé, accoudoirs sculptés ergonomiquement. Conforme aux normes européennes EN 1022 et EN 1728.",
  },
  {
    name: "HaloKit",
    category: "Consumer Electronics",
    client: "Sony Design",
    year: "2024",
    color: "#0EA5E9",
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Écouteurs sans fil à réduction de bruit active avec étui de charge en céramique. Le HaloKit combine performance audio et minimalisme esthétique pour le marché premium.",
    materials: "Céramique zircone, silicone médical, drivers titane 10mm",
    processUsed: "Design industriel → Prototype fonctionnel → Tests acoustiques → Certification",
    ergonomics: "Trois tailles d'embouts, poids de 4,8g par écouteur, autonomie 32h avec l'étui. Test de confort sur 200 utilisateurs pendant 8 heures consécutives.",
  },
  {
    name: "Bloom Series",
    category: "Tableware",
    client: "Seletti",
    year: "2024",
    color: "#10B981",
    src: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600&q=80",
    description: "Collection de vaisselle en porcelaine inspirée des formes organiques des plantes succulentes. Chaque pièce est unique grâce à un procédé d'émaillage semi-aléatoire développé en interne.",
    materials: "Porcelaine de Limoges, émail réactif sans plomb, pigments naturels",
    processUsed: "Sculpture digitale → Impression 3D céramique → Émaillage artisanal",
    ergonomics: "Bords arrondis anti-ébréchure, base anti-dérapante, compatible lave-vaisselle et micro-ondes. Empilable pour un rangement optimal.",
  },
  {
    name: "Kinetic Lamp",
    category: "Lighting",
    client: "Foscarini",
    year: "2023",
    color: "#F59E0B",
    src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    description: "Luminaire cinétique dont l'abat-jour en lames d'aluminium réagit à la lumière naturelle pour créer des jeux d'ombres évolutifs tout au long de la journée.",
    materials: "Aluminium anodisé, moteur pas-à-pas silencieux, LED dimmable 2700K-5000K",
    processUsed: "Design paramétrique → Simulation lumière → Prototype mécanique → Production",
    ergonomics: "Contrôle via application et geste, rotation silencieuse < 20 dB, consommation 12W. Capteur crépusculaire intégré pour une adaptation automatique.",
  },
];

const timeline = [
  { year: "2014", title: "Fondation", desc: "Création de Forme Studio à Paris par deux designers industriels passionnés par le design durable." },
  { year: "2016", title: "Premier prix", desc: "Red Dot Design Award pour le projet « Aéro » — ventilateur sans pale en bambou." },
  { year: "2017", title: "Expansion", desc: "Ouverture de l'atelier de prototypage dans le 11ᵉ arrondissement, équipé d'imprimantes 3D industrielles." },
  { year: "2019", title: "International", desc: "Premiers projets export avec Cassina (Italie) et Sony Design (Japon). Équipe de 6 designers." },
  { year: "2021", title: "Engagement durable", desc: "Certification B Corp. 100% des matériaux sourcés de manière responsable." },
  { year: "2023", title: "50 produits lancés", desc: "Cap symbolique franchi avec le lancement de la Kinetic Lamp pour Foscarini." },
  { year: "2025", title: "Nouveau chapitre", desc: "Déménagement dans un studio de 400m² avec showroom ouvert au public." },
];

const awards = [
  { name: "Red Dot Design Award", count: 5, years: "2016, 2018, 2020, 2022, 2024" },
  { name: "iF Design Award", count: 4, years: "2017, 2019, 2021, 2023" },
  { name: "A' Design Award Gold", count: 3, years: "2018, 2020, 2024" },
  { name: "French Design Award", count: 4, years: "2016, 2019, 2022, 2025" },
  { name: "Good Design Award", count: 2, years: "2021, 2023" },
];

const pricingTiers = [
  {
    name: "Essentiel",
    price: "3 500 €",
    desc: "Idéal pour un premier projet ou un packaging simple.",
    features: ["Brief & recherche initiale", "2 pistes créatives", "1 rendu 3D final", "Fichiers de production", "1 cycle de révision"],
  },
  {
    name: "Studio",
    price: "9 000 €",
    desc: "Pour des projets complets nécessitant prototypage.",
    features: ["Brief approfondi & benchmark", "3 pistes créatives", "Rendus 3D photoréalistes", "Prototype physique 1:1", "Suivi de production", "3 cycles de révision"],
    popular: true,
  },
  {
    name: "Sur mesure",
    price: "Sur devis",
    desc: "Collections, programmes multi-produits, consulting.",
    features: ["Audit design complet", "Direction artistique", "Prototypage illimité", "Suivi fournisseurs", "Assets marketing", "Support 12 mois"],
  },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function FormeStudioPage() {
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
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
    setMobileOpen(false);
  };

  const navMap: Record<string, ActivePage> = {
    Travaux: "travaux",
    Expertises: "expertises",
    Process: "home",
    Studio: "studio",
    Contact: "contact",
  };

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#F97316] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-[#F97316] rounded-lg" />
            <span className="text-gray-900 font-bold text-lg tracking-tight">{fd?.businessName ?? "Forme Studio"}</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm font-medium">
            {Object.entries(navMap).map(([label, target]) => (
              <button key={label} onClick={() => goTo(target)} className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 font-medium text-sm text-gray-500">
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => goTo("contact")} className="hidden md:inline-flex bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer font-medium">
            Nouveau projet
          </button>
          <button className="md:hidden text-gray-900 cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-white flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-gray-900 font-bold text-xl">{fd?.businessName ?? "Forme Studio"}</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6" /></button>
            </div>
            {Object.entries(navMap).map(([label, target], i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <button onClick={() => goTo(target)} className="block text-gray-900 text-2xl font-bold mb-6 cursor-pointer bg-transparent border-none p-0 text-left">{label}</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================== HOME ============================== */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
          {/* Hero */}
          <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-16 px-6 overflow-hidden bg-[#F8F4F0]">
            <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
              <div className="absolute top-20 right-0 w-1/2 h-full opacity-20">
                <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" alt="bg" fill className="object-cover" priority />
              </div>
            </motion.div>
            <div className="max-w-6xl mx-auto w-full relative z-10">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
                  Studio de design produit · Paris
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-gray-900 text-6xl md:text-8xl font-bold leading-none mb-8">{c?.heroHeadline ?? <>
                  Design<br />
                  <em className="font-light text-[#F97316]">qui dure.</em>
                </>}</h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-500 text-xl max-w-lg leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                  Packaging, mobilier, objets tech. Forme Studio crée des produits qui se distinguent, se vendent, et résistent au temps.
                </>}</p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => goTo("travaux")} className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center gap-2">
                    Voir les projets <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => goTo("studio")} className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-[#F97316] hover:text-[#F97316] transition-colors cursor-pointer">
                    En savoir plus
                  </button>
                </div>
              </Reveal>
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-sm">
                {[["50+", "Produits lancés"], ["12 ans", "D'expérience"], ["18", "Récompenses design"]].map(([n, l]) => (
                  <Reveal key={l}>
                    <div>
                      <p className="text-gray-900 text-2xl font-bold">{n}</p>
                      <p className="text-gray-400 text-xs mt-1">{l}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Projects — diagonal hover stack */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <Reveal className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[#F97316] text-sm font-semibold mb-3">Travaux récents</p>
                  <h2 className="text-gray-900 text-4xl font-bold">Projets sélectionnés</h2>
                </div>
                <button onClick={() => goTo("travaux")} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors cursor-pointer flex items-center gap-1 bg-transparent border-none p-0">
                  Tout voir <ChevronRight className="w-4 h-4" />
                </button>
              </Reveal>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.08}>
                    <motion.div
                      className="relative overflow-hidden rounded-2xl cursor-pointer"
                      initial={{ height: 80 }}
                      whileHover={{ height: 280 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}
                    >
                      <div className="flex items-center justify-between px-8 py-6">
                        <div className="flex items-center gap-6">
                          <span className="text-gray-300 text-sm font-bold">0{i + 1}</span>
                          <div>
                            <h3 className="text-gray-900 font-bold text-lg">{p.name}</h3>
                            <p className="text-gray-400 text-sm">{p.category} · {p.client}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-300 text-sm">{p.year}</span>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: p.color }}>
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-52 overflow-hidden">
                        <Image src={p.src} alt={p.name} fill className="object-cover object-top opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Disciplines */}
          <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#F97316] text-sm font-semibold mb-3">Expertises</p>
                <h2 className="text-gray-900 text-4xl font-bold">Ce que nous faisons</h2>
              </Reveal>
              <div className="grid md:grid-cols-2 gap-5">
                {disciplines.map((d, i) => (
                  <Reveal key={d.title} delay={i * 0.1}>
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#F97316]/20 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-5 group-hover:bg-[#F97316] group-hover:text-white transition-colors">{d.icon}</div>
                      <h3 className="text-gray-900 font-bold text-lg mb-3">{d.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-24 px-6 bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#F97316] text-sm font-semibold mb-3">Notre méthode</p>
                <h2 className="text-white text-4xl font-bold">Du brief au lancement</h2>
              </Reveal>
              <div className="grid md:grid-cols-4 gap-6">
                {process.map((step, i) => (
                  <Reveal key={step.n} delay={i * 0.1}>
                    <div className="relative">
                      <div className="text-5xl font-black text-white/5 mb-4 leading-none">{step.n}</div>
                      <h3 className="text-white font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Clients */}
          <section className="py-16 px-6 border-y border-gray-100">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-8"><p className="text-gray-400 text-sm">Ils nous ont fait confiance</p></Reveal>
              <div className="flex flex-wrap justify-center gap-8">
                {clients.map((c, i) => <Reveal key={c} delay={i * 0.04}><span className="text-gray-300 text-sm font-medium hover:text-[#F97316] transition-colors cursor-pointer">{c}</span></Reveal>)}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-24 px-6 bg-[#F8F4F0]">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <p className="text-[#F97316] text-sm font-semibold mb-4">Travaillons ensemble</p>
                <h2 className="text-gray-900 text-5xl font-bold mb-4">Vous avez un projet ?</h2>
                <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">On est curieux. Parlez-nous de votre produit, de vos contraintes et de vos ambitions.</p>
                <button onClick={() => goTo("contact")} className="bg-gray-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer text-lg flex items-center gap-2 mx-auto">
                  <Mail className="w-5 h-5" />{fd?.email ?? "hello@formedstudio.fr"}</button>
              </Reveal>
            </div>
          </section>
      </div>

      {/* ============================== TRAVAUX ============================== */}
      <div style={{ display: page === "travaux" ? "block" : "none" }}>
          <section id="realisations" className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                  Portfolio complet
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
                  Nos <em className="font-light text-[#F97316]">travaux</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">{c?.aboutText ?? <>
                  Chaque projet est une collaboration étroite avec nos clients. Du brief initial au lancement commercial, nous concevons des produits qui marquent leur catégorie.
                </>}</p>
              </Reveal>
            </div>
          </section>

          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto space-y-16">
              {projectDetails.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1}>
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden" style={{ border: `1px solid ${p.color}20` }}>
                      <Image src={p.src} alt={p.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{p.category}</span>
                        <h3 className="text-white text-3xl font-bold mt-1">{p.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{p.client}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{p.year}</span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>{p.category}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{p.description}</p>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                            <Cog className="w-4 h-4" /> Matériaux
                          </div>
                          <p className="text-gray-500 text-sm">{p.materials}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                            <Ruler className="w-4 h-4" /> Process
                          </div>
                          <p className="text-gray-500 text-sm">{p.processUsed}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                            <Users className="w-4 h-4" /> Ergonomie
                          </div>
                          <p className="text-gray-500 text-sm">{p.ergonomics}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-20 px-6 bg-gray-900">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <h2 className="text-white text-4xl font-bold mb-4">Votre produit pourrait être ici</h2>
                <p className="text-gray-400 text-lg mb-8">Rejoignez les marques qui nous ont fait confiance pour donner forme à leurs idées.</p>
                <button onClick={() => goTo("contact")} className="bg-[#F97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316]/90 transition-colors cursor-pointer flex items-center gap-2 mx-auto">
                  Lancer un projet <ArrowRight className="w-4 h-4" />
                </button>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== EXPERTISES ============================== */}
      <div style={{ display: page === "expertises" ? "block" : "none" }}>
          <section id="services" className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                  Nos savoir-faire
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
                  Nos <em className="font-light text-[#F97316]">expertises</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
                  Quatre disciplines complémentaires pour couvrir l'ensemble du spectre du design produit. Chaque expertise s'enrichit des autres.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Discipline deep dives */}
          <section id="about" className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto space-y-20">
              {/* Packaging & Branding */}
              <Reveal>
                <div className="grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                      <Package className="w-7 h-7" />
                    </div>
                    <h2 className="text-gray-900 text-3xl font-bold mb-4">Packaging & Branding</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      Nous concevons des packagings qui capturent l'essence de votre marque. Du concept au fichier de production, chaque détail est pensé pour maximiser l'impact en rayon et sur les réseaux sociaux.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      Notre approche combine analyse sémiotique, étude des tendances matières et prototypage rapide pour valider les concepts avant l'investissement en outillage.
                    </p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Identité visuelle", desc: "Logo, charte graphique, direction artistique pour packagings primaires et secondaires." },
                      { title: "Modélisation 3D", desc: "Rendus photoréalistes pour validation client et présentation en comité de direction." },
                      { title: "Production", desc: "Fichiers d'exécution, suivi d'impression et contrôle qualité jusqu'à la livraison." },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Mobilier & Objets */}
              <Reveal>
                <div className="grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                      <Layers className="w-7 h-7" />
                    </div>
                    <h2 className="text-gray-900 text-3xl font-bold mb-4">Mobilier & Objets</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      Des pièces qui traversent les années. Notre studio conçoit du mobilier et des objets du quotidien alliant fonctionnalité, esthétique et durabilité des matériaux.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      Nous travaillons avec des artisans et des industriels pour garantir la qualité de fabrication, que ce soit en édition limitée ou en grande série.
                    </p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Esquisse & CAO", desc: "Du croquis à la modélisation surfacique. Chaque courbe est définie avec précision." },
                      { title: "Prototypage", desc: "Impression 3D, usinage CNC, maquettes d'aspect et prototypes fonctionnels." },
                      { title: "Édition & Série", desc: "Dossiers techniques complets pour la mise en production industrielle." },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Product Design Tech */}
              <Reveal>
                <div className="grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <h2 className="text-gray-900 text-3xl font-bold mb-4">Product Design Tech</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      À la croisée du hardware et du software, nous concevons des produits connectés qui offrent une expérience utilisateur cohérente du physique au digital.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      Notre équipe pluridisciplinaire intègre les contraintes électroniques dès la phase de design pour éviter les compromis en aval.
                    </p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "UX Produit", desc: "Cartographie des usages, scénarios d'interaction et tests utilisateurs en conditions réelles." },
                      { title: "Design industriel", desc: "Boîtiers, interfaces physiques, CMF (couleur, matière, finition) optimisés." },
                      { title: "Intégration", desc: "Collaboration étroite avec les équipes hardware et firmware pour un résultat sans compromis." },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Design de Concept */}
              <Reveal>
                <div className="grid md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                      <Eye className="w-7 h-7" />
                    </div>
                    <h2 className="text-gray-900 text-3xl font-bold mb-4">Design de Concept</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      Anticiper les usages de demain pour les marques visionnaires. Nos projets de design fiction permettent d'explorer des territoires créatifs inédits et de prendre de l'avance sur la concurrence.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      Nous organisons des workshops de prospective immersifs pour aligner votre équipe autour d'une vision design commune.
                    </p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Design Fiction", desc: "Scénarios prospectifs, prototypes provocateurs et récits de marque pour les 5 prochaines années." },
                      { title: "Veille & Tendances", desc: "Rapports trimestriels sur les innovations matériaux, technologiques et sociétales." },
                      { title: "Workshops créatifs", desc: "Sessions de co-création de 2 jours avec vos équipes produit, marketing et R&D." },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Workshop CTA */}
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mx-auto mb-6">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-4xl font-bold mb-4">Workshops de co-design</h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
                  Deux jours d'immersion créative avec notre équipe. Idéation, prototypage rapide et feuille de route design pour votre prochain lancement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => goTo("contact")} className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center gap-2 mx-auto sm:mx-0">
                    Réserver un workshop <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== STUDIO ============================== */}
      <div style={{ display: page === "studio" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                  Qui nous sommes
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
                  Le <em className="font-light text-[#F97316]">studio</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
                  Fondé en 2014, Forme Studio est un collectif de designers industriels, ingénieurs et artisans qui croient que le beau objet est aussi l'objet utile.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Manifesto */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-start">
                <Reveal>
                  <div>
                    <p className="text-[#F97316] text-sm font-semibold mb-3">Notre manifeste</p>
                    <h2 className="text-gray-900 text-4xl font-bold mb-8">Le design qui dure est un acte de responsabilité</h2>
                    <div className="space-y-6 text-gray-500 leading-relaxed">
                      <p>
                        Nous refusons l'obsolescence programmée et le design cosmétique. Chaque ligne que nous traçons, chaque matériau que nous choisissons, est pensé pour créer un objet qui accompagnera son utilisateur pendant des années.
                      </p>
                      <p>
                        Notre philosophie repose sur trois piliers : la justesse formelle, l'intégrité des matériaux et la pertinence d'usage. Un produit bien conçu n'a pas besoin d'être redessiné chaque saison.
                      </p>
                      <p>
                        Nous croyons que le design industriel a le pouvoir de transformer les habitudes de consommation. En créant des objets désirables ET durables, nous prouvons que ces deux qualités ne sont pas antinomiques.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="space-y-6">
                    {[
                      { icon: <Heart className="w-5 h-5" />, title: "Design responsable", desc: "100% de nos matériaux sont sourcés de manière éthique. Certification B Corp depuis 2021." },
                      { icon: <Target className="w-5 h-5" />, title: "Précision & Justesse", desc: "Chaque projet passe par au minimum 3 itérations de prototypage avant validation finale." },
                      { icon: <Star className="w-5 h-5" />, title: "Excellence artisanale", desc: "Partenariats avec les meilleurs artisans et fabricants européens depuis plus de 10 ans." },
                      { icon: <Globe className="w-5 h-5" />, title: "Rayonnement international", desc: "Des projets pour des clients dans 12 pays, avec une sensibilité culturelle adaptée." },
                    ].map((v, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shrink-0">{v.icon}</div>
                        <div>
                          <h4 className="text-gray-900 font-bold mb-1">{v.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-16 text-center">
                <p className="text-[#F97316] text-sm font-semibold mb-3">Notre parcours</p>
                <h2 className="text-gray-900 text-4xl font-bold">Une décennie de design</h2>
              </Reveal>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={i * 0.1}>
                    <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                        <div className={`bg-white rounded-2xl p-6 border border-gray-100 inline-block max-w-sm ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                          <p className="text-[#F97316] font-bold text-lg mb-1">{t.year}</p>
                          <h4 className="text-gray-900 font-bold mb-2">{t.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F97316] border-4 border-white shadow-sm z-10 mt-2" />
                      <div className="flex-1 md:hidden pl-10">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                          <p className="text-[#F97316] font-bold text-lg mb-1">{t.year}</p>
                          <h4 className="text-gray-900 font-bold mb-2">{t.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Awards */}
          <section id="tarifs" className="py-24 px-6 bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#F97316] text-sm font-semibold mb-3">Reconnaissance</p>
                <h2 className="text-white text-4xl font-bold">18 prix internationaux</h2>
              </Reveal>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
                {awards.map((a, i) => (
                  <Reveal key={a.name} delay={i * 0.08}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#F97316]/40 transition-colors">
                      <Award className="w-8 h-8 text-[#F97316] mx-auto mb-4" />
                      <h4 className="text-white font-bold text-sm mb-1">{a.name}</h4>
                      <p className="text-[#F97316] text-2xl font-bold mb-2">{a.count}×</p>
                      <p className="text-gray-500 text-xs">{a.years}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Sustainable approach */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mx-auto mb-6">
                  <Globe className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-4xl font-bold mb-6">Design durable</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                  Depuis 2021, Forme Studio est certifié B Corp. Nous avons réduit de 40% l'empreinte carbone de nos processus de prototypage en adoptant des matériaux biosourcés et des filières de recyclage locales. Chaque projet intègre une analyse de cycle de vie dès la phase de concept.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                  {[["100%", "Matériaux tracés"], ["–40%", "Empreinte carbone"], ["0", "Matériaux vierges"]].map(([n, l]) => (
                    <div key={l}>
                      <p className="text-[#F97316] text-3xl font-bold">{n}</p>
                      <p className="text-gray-400 text-xs mt-1">{l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ============================== CONTACT ============================== */}
      <div style={{ display: page === "contact" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                  Travaillons ensemble
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
                  Nouveau <em className="font-light text-[#F97316]">projet</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
                  Parlez-nous de votre produit, de vos contraintes et de vos ambitions. On vous répond sous 48h.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Contact form */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-12">
                <div className="md:col-span-3">
                  <Reveal>
                    <h2 className="text-gray-900 text-2xl font-bold mb-8">Décrivez votre projet</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-600 text-sm font-medium mb-2 block">Nom complet</label>
                          <input type="text" placeholder="Jean Dupont" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm font-medium mb-2 block">Entreprise</label>
                          <input type="text" placeholder="Acme Corp" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm font-medium mb-2 block">Email</label>
                        <input type="email" placeholder="jean@acme.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm font-medium mb-2 block">Type de projet</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white">
                          <option>Packaging & Branding</option>
                          <option>Mobilier & Objets</option>
                          <option>Product Design Tech</option>
                          <option>Design de Concept</option>
                          <option>Workshop de co-design</option>
                          <option>Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm font-medium mb-2 block">Budget indicatif</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white">
                          <option>Moins de 5 000 €</option>
                          <option>5 000 € – 10 000 €</option>
                          <option>10 000 € – 25 000 €</option>
                          <option>Plus de 25 000 €</option>
                          <option>À définir</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm font-medium mb-2 block">Décrivez votre projet</label>
                        <textarea rows={5} placeholder="Racontez-nous votre idée, le contexte, les contraintes…" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors resize-none" />
                      </div>
                      <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Envoyer la demande
                      </button>
                    </form>
                  </Reveal>
                </div>
                <div className="md:col-span-2">
                  <Reveal delay={0.2}>
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <Mail className="w-5 h-5 text-[#F97316]" />
                          <h4 className="text-gray-900 font-bold">Email</h4>
                        </div>
                        <p className="text-gray-500 text-sm">{fd?.email ?? "hello@formedstudio.fr"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="w-5 h-5 text-[#F97316]" />
                          <h4 className="text-gray-900 font-bold">Délai de réponse</h4>
                        </div>
                        <p className="text-gray-500 text-sm">Sous 48 heures ouvrées</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <Globe className="w-5 h-5 text-[#F97316]" />
                          <h4 className="text-gray-900 font-bold">Studio</h4>
                        </div>
                        <p className="text-gray-500 text-sm">42 rue Oberkampf<br />75011 Paris, France</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-[#F97316]" />
                          <h4 className="text-gray-900 font-bold">Workshops</h4>
                        </div>
                        <p className="text-gray-500 text-sm">Sessions de 2 jours, sur rendez-vous. Prochaine session disponible : juillet 2026.</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing tiers */}
          <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#F97316] text-sm font-semibold mb-3">Tarification indicative</p>
                <h2 className="text-gray-900 text-4xl font-bold mb-4">Nos formules</h2>
                <p className="text-gray-500 max-w-lg mx-auto">Chaque projet est unique. Ces tarifs sont indicatifs et servent de base à la discussion.</p>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-6">
                {pricingTiers.map((tier, i) => (
                  <Reveal key={tier.name} delay={i * 0.1}>
                    <div className={`bg-white rounded-2xl p-8 border ${tier.popular ? "border-[#F97316] shadow-lg relative" : "border-gray-100"} flex flex-col h-full`}>
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs font-bold px-4 py-1 rounded-full">
                          Le plus choisi
                        </div>
                      )}
                      <h3 className="text-gray-900 text-xl font-bold mb-2">{tier.name}</h3>
                      <p className="text-[#F97316] text-3xl font-bold mb-2">{tier.price}</p>
                      <p className="text-gray-500 text-sm mb-6">{tier.desc}</p>
                      <ul className="space-y-3 flex-1">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-gray-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full mt-8 py-3 rounded-xl font-bold transition-colors cursor-pointer ${tier.popular ? "bg-[#F97316] text-white hover:bg-[#F97316]/90" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}>
                        Choisir cette formule
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </div>

      {/* ============================== LEGAL ============================== */}
      <div style={{ display: page === "legal" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <h1 className="text-gray-900 text-4xl md:text-5xl font-bold leading-none mb-6">Mentions légales</h1>
              </Reveal>
            </div>
          </section>

          <section id="contact" className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto prose prose-gray">
              <Reveal>
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-gray-900 text-lg font-bold mb-4">Éditeur du site</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Aevia WS — Valentin Milliand, entrepreneur individuel.<br />
                      SIREN : 852 546 225 — RCS Bourg-en-Bresse.<br />
                      Contact : <span className="text-[#F97316]">{fd?.email ?? "contact@aevia.ws"}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-gray-900 text-lg font-bold mb-4">Hébergement</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-gray-900 text-lg font-bold mb-4">Propriété intellectuelle</h3>
                    <p className="text-gray-600 leading-relaxed">
                      L'ensemble des contenus (textes, images, code, design) est protégé. Toute reproduction non autorisée est interdite.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-gray-900 text-lg font-bold mb-4">Données personnelles</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Aucune donnée personnelle n'est collectée sans consentement explicite. Conformité RGPD.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* Footer — always visible */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"><div className="w-5 h-5 bg-[#F97316] rounded" /><span className="text-white font-bold">{fd?.businessName ?? "Forme Studio"}</span></button>
          <div className="flex gap-8">
            <button onClick={() => goTo("legal")} className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-gray-500">Politique de conf.</button>
            <button onClick={() => goTo("legal")} className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-gray-500">Mentions légales</button>
          </div>
          <span>© 2026 Forme Studio. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
