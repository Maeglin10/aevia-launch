"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Building2, ChevronRight, MapPin, Mail, Phone, Award, Layers, Users, Calendar, MessageSquare, ShieldCheck } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
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

const projects = [
  { name: "La Maison du Vent", location: "Marseille", type: "Résidentiel", area: "480 m²", year: "2025", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "Pavillon Zénith", location: "Lyon", type: "Cultural", area: "2 200 m²", year: "2025", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "Ateliers Kéops", location: "Paris XIe", type: "Bureau mixte", area: "1 400 m²", year: "2024", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { name: "Villa Terracotta", location: "Nice", type: "Résidentiel", area: "320 m²", year: "2024", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { name: "Cour des Arts", location: "Bordeaux", type: "Mixte culturel", area: "3 800 m²", year: "2023", src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80" },
  { name: "Bibliothèque Nomade", location: "Nantes", type: "Public", area: "1 900 m²", year: "2023", src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
];

const filters = ["Tous", "Résidentiel", "Cultural", "Bureau mixte", "Public"];

const services = [
  { icon: <Building2 className="w-5 h-5" />, title: "Architecture résidentielle", desc: "Villas, maisons individuelles et ensembles résidentiels. Du concept à la livraison." },
  { icon: <Layers className="w-5 h-5" />, title: "Espaces culturels & publics", desc: "Musées, bibliothèques, espaces éducatifs. Architecture au service du vivre-ensemble." },
  { icon: <Users className="w-5 h-5" />, title: "Programmes mixtes", desc: "Bureaux, commerces, logements intégrés. Quartiers vivants conçus pour le long terme." },
  { icon: <Award className="w-5 h-5" />, title: "Réhabilitation & Patrimoine", desc: "Transformation de bâtiments existants. Dialogue entre mémoire architecturale et contemporain." },
];

const team = [
  { name: "Nadia Kéops", role: "Architecte Fondatrice", years: "22 ans", citation: "L'architecture n'est pas seulement esthétique, c'est l'art d'habiter le monde avec respect." },
  { name: "Luc Ferrand", role: "Associé — Construction", years: "16 ans", citation: "Chaque pierre posée doit avoir une fonction, chaque espace une raison d'être." },
  { name: "Amina Belkacem", role: "Architecte DPLG", years: "9 ans", citation: "Concevoir des lieux de rencontre fluides qui s'intègrent organiquement dans la ville." },
];

const distinctions = [
  "Prix de l'Architecture Contemporaine 2025",
  "Grand Prix Soleil de l'Habitat — Résidentiel Durable",
  "RIBA Award — Shortlist International 2024",
  "Label Inventerre — Architecture Bioclimatique",
];

type ActivePage = "home" | "projets" | "services" | "agence" | "equipe" | "contact" | "legal";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function KeopsPage() {
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
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const filtered = activeFilter === "Tous" ? projects : projects.filter(p => p.type === activeFilter);

  
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
    <div className="min-h-dvh bg-[#F5F2ED] text-[#1A1510] overflow-x-clip flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C46A3E] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F5F2ED]/92 backdrop-blur-md border border-[#C46A3E]/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
          <div onClick={() => goTo("home")} className="cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <span className="text-[#1A1510] tracking-wide text-lg font-medium" style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Kéops"}</span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8 text-[#1A1510]/60 text-sm font-medium">
            {[
              { name: "Projets", key: "projets" },
              { name: "Services", key: "services" },
              { name: "L'agence", key: "agence" },
              { name: "Équipe", key: "equipe" },
              { name: "Contact", key: "contact" }
            ].map(item => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }}
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${page === item.key ? "text-[#C46A3E] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <button onClick={() => goTo("contact")} className="hidden md:inline-flex border border-[#C46A3E] text-[#C46A3E] text-sm px-5 py-2.5 rounded-xl hover:bg-[#C46A3E] hover:text-white transition-all cursor-pointer font-medium">
            Nous contacter
          </button>
          <button className="md:hidden text-[#1A1510] cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#F5F2ED] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span className="text-[#1A1510] text-xl font-medium" style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Kéops"}</span>
              )}
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-[#1A1510]" /></button>
            </div>
            {[
              { name: "Accueil", key: "home" },
              { name: "Projets", key: "projets" },
              { name: "Services", key: "services" },
              { name: "L'agence", key: "agence" },
              { name: "Équipe", key: "equipe" },
              { name: "Contact", key: "contact" },
              { name: "Mentions Légales", key: "legal" }
            ].map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <a
                  href={`#${item.key}`}
                  className={`block text-3xl mb-6 cursor-pointer ${page === item.key ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
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
            <section id="hero" ref={heroRef} className="relative h-dvh overflow-hidden">
              <motion.div className="absolute inset-0" style={{ y: heroY }}>
                <Image src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=85" alt="Kéops Architecture" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A1510]/50 to-[#F5F2ED]/80" />
              </motion.div>
              <motion.div className="relative z-10 h-full flex items-end pb-20 px-6" style={{ opacity: heroOpacity }}>
                <div className="max-w-6xl mx-auto w-full">
                  <Reveal>
                    <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4">Agence d'architecture · Paris</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h1 className="text-white text-7xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>{c?.heroHeadline ?? <>{fd?.businessName ?? "Kéops"}</>}</h1>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <p className="text-white/70 text-lg max-w-md leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>Architecture vivante. Espaces pensés pour durer, bâtis avec intention, habités avec plaisir.</>}</p>
                      <button onClick={() => goTo("projets")} className="shrink-0 bg-[#C46A3E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#B5593A] transition-colors cursor-pointer flex items-center gap-2">
                        Voir les projets <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Reveal>
                </div>
              </motion.div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-[#C46A3E]">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
                {[["22 ans", "D'expérience"], ["140+", "Projets réalisés"], ["12", "Prix d'architecture"], ["4", "Villes d'agences"]].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-white text-3xl font-bold mb-1">{n}</p>
                    <p className="text-white/60 text-xs uppercase tracking-widest">{l}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Preview */}
            <section className="py-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <Reveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                    <div>
                      <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">Réalisations</p>
                      <h2 className="text-[#1A1510] text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Nos projets</h2>
                    </div>
                    <button onClick={() => goTo("projets")} className="mt-4 md:mt-0 text-[#C46A3E] font-medium flex items-center gap-2 hover:underline cursor-pointer">
                      Tous nos projets <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Reveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projects.slice(0, 3).map((p, i) => (
                    <Reveal key={p.name} delay={i * 0.1}>
                      <div className="group cursor-pointer" onClick={() => goTo("projets")}>
                        <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "4/3" }}>
                          <Image src={p.src} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-[#1A1510]">{p.type}</div>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-[#1A1510] font-medium mb-1">{p.name}</h3>
                            <p className="text-[#1A1510]/50 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location} · {p.area}</p>
                          </div>
                          <span className="text-[#C46A3E] text-sm">{p.year}</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Services Preview */}
            <section id="realisations" className="py-24 px-6 bg-[#F5F2ED]">
              <div className="max-w-6xl mx-auto">
                <Reveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                      <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">Expertise</p>
                      <h2 className="text-[#1A1510] text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Services</h2>
                    </div>
                    <button onClick={() => goTo("services")} className="mt-4 md:mt-0 text-[#C46A3E] font-medium flex items-center gap-2 hover:underline cursor-pointer">
                      Notre méthodologie <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Reveal>
                <div className="grid md:grid-cols-2 gap-5">
                  {services.map((s, i) => (
                    <Reveal key={s.title} delay={i * 0.08}>
                      <div onClick={() => goTo("services")} className="bg-white rounded-2xl p-8 border border-[#1A1510]/8 hover:border-[#C46A3E]/30 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-[#C46A3E]/10 rounded-xl flex items-center justify-center text-[#C46A3E] mb-5 group-hover:bg-[#C46A3E] group-hover:text-white transition-colors">{s.icon}</div>
                        <h3 className="text-[#1A1510] font-medium text-lg mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.title}</h3>
                        <p className="text-[#1A1510]/50 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "projets" && <ProjetsPage activeFilter={activeFilter} setActiveFilter={setActiveFilter} filtered={filtered} />}
        {page === "services" && <ServicesPage goTo={goTo} />}
        {page === "agence" && <AgencePage />}
        {page === "equipe" && <EquipePage />}
        {page === "contact" && <ContactPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1510] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-white text-xl mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>{fd?.businessName ?? "Kéops"}</p>
            <p className="text-white/30 text-sm leading-relaxed">Agence d'architecture fondée à Paris. Projets résidentiels, culturels et mixtes.</p>
          </div>
          {[
            { title: "Projets", links: [
              { name: "Résidentiel", key: "projets" },
              { name: "Culturel", key: "projets" },
              { name: "Bureau mixte", key: "projets" },
              { name: "Patrimoine", key: "projets" }
            ]},
            { title: "Agence", links: [
              { name: "Notre histoire", key: "agence" },
              { name: "L'équipe", key: "equipe" },
              { name: "Distinctions", key: "agence" },
              { name: "Presse", key: "agence" }
            ]},
            { title: "Contact", links: [
              { name: "Prendre rendez-vous", key: "contact" },
              { name: "Paris Showroom", key: "contact" },
              { name: "Faire une demande", key: "contact" }
            ]},
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white/40 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l.name}><a href="/templates/impact-17" onClick={(e) => { e.preventDefault(); goTo(l.key as any); }} className="text-white/30 text-sm hover:text-[#C46A3E] transition-colors cursor-pointer">{l.name}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between text-xs text-white/20 gap-4">
          <span>© 2026 Kéops Architecture. Tous droits réservés.</span>
          <div className="flex gap-6">
            <a href="/templates/impact-17" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C46A3E] transition-colors">Mentions légales</a>
            <a href="/templates/impact-17" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#C46A3E] transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (KÉOPS CRÈME & ROUILLE STYLE)
   ========================================================================= */

function ProjetsPage({ activeFilter, setActiveFilter, filtered }: { activeFilter: string; setActiveFilter: (f: string) => void; filtered: typeof projects }) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre catalogue</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Nos Réalisations</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed mb-10">
            Découvrez nos réalisations architecturales à travers la France. Chaque ouvrage répond à une étude bioclimatique minutieuse et intègre des matériaux biosourcés.
          </p>

          <div className="flex gap-2 flex-wrap justify-center mt-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer border font-medium ${activeFilter === f ? "bg-[#C46A3E] text-white border-[#C46A3E]" : "border-[#1A1510]/15 text-[#1A1510]/60 hover:border-[#C46A3E]"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "4/3" }}>
                  <Image src={p.src} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-[#1A1510]">{p.type}</div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#1A1510] font-medium mb-1">{p.name}</h3>
                    <p className="text-[#1A1510]/50 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location} · {p.area}</p>
                    <p className="text-xs text-[#C46A3E]/70 mt-1 font-mono">Matériaux : Bois local, terre crue, béton bas carbone</p>
                  </div>
                  <span className="text-[#C46A3E] text-sm font-semibold">{p.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  const steps = [
    { num: "01", title: "Diagnostic & Faisabilité", desc: "Analyse du terrain, contraintes d'urbanisme, orientation solaire et étude de sol préliminaire." },
    { num: "02", title: "Conception & Modélisation", desc: "Esquisses, plans 2D/3D détaillés et choix de matériaux durables (isolation paille, chanvre, ossature bois)." },
    { num: "03", title: "Permis de Construire", desc: "Constitution et suivi administratif rigoureux du dossier de demande auprès des municipalités." },
    { num: "04", title: "Suivi de Chantier", desc: "Coordination et pilotage des artisans labellisés RGE jusqu'à la réception des clés." }
  ];

  return (
    <section className="py-20 px-6 bg-[#F5F2ED]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre Expertise</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Services & Processus</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            De la première esquisse à la livraison définitive, nous pilotons chaque projet avec la même exigence de rigueur technique et d'élégance environnementale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((s, i) => (
            <div key={s.title} className="bg-white rounded-2xl p-8 border border-[#1A1510]/8 hover:border-[#C46A3E]/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#C46A3E]/10 rounded-xl flex items-center justify-center text-[#C46A3E] mb-6">{s.icon}</div>
                <h3 className="text-[#1A1510] font-medium text-xl mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.title}</h3>
                <p className="text-[#1A1510]/50 text-sm leading-relaxed mb-6">{s.desc}</p>
              </div>
              <button onClick={() => goTo("contact")} className="w-full py-3.5 border border-[#C46A3E]/30 hover:border-[#C46A3E] hover:bg-[#C46A3E] hover:text-white rounded-xl text-xs tracking-widest uppercase transition-all font-medium text-[#C46A3E]">
                Étudier mon projet
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1A1510]/10 pt-16">
          <h2 className="text-3xl md:text-4xl text-[#1A1510] mb-12 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>Notre méthodologie en 4 étapes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={st.num} className="bg-white/50 border border-[#1A1510]/5 rounded-2xl p-6 relative">
                <span className="text-5xl font-bold text-[#C46A3E]/15 absolute top-4 right-4">{st.num}</span>
                <h4 className="text-[#1A1510] font-medium text-lg mb-2 mt-4">{st.title}</h4>
                <p className="text-[#1A1510]/50 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgencePage() {
  return (
    <section id="tarifs" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-20">
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
            <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Kéops Agence" fill className="object-cover" />
          </div>
          <div className="lg:col-span-7">
            <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre histoire</span>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Bâtir l'avenir sur des fondations durables.</h2>
            <p className="text-[#1A1510]/70 text-lg leading-relaxed mb-4">
              Fondée en 2004 par Nadia Kéops, l'agence s'est forgé une solide réputation nationale dans la conception d'architectures bioclimatiques et d'espaces durables.
            </p>
            <p className="text-[#1A1510]/50 text-sm leading-relaxed mb-6">
              Nos projets privilégient les circuits courts pour l'approvisionnement en matériaux biosourcés : la pierre sèche du Gard, le bois Douglas du Morvan et la terre cuite de l'arrière-pays méditerranéen. En alliant savoir-faire artisanal traditionnel et technologies numériques passives, nous façonnons des édifices à haute efficacité thermique et à empreinte environnementale minimale.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 border-t border-[#1A1510]/10 pt-16">
          <div>
            <h3 className="text-3xl font-light mb-8 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Distinctions & Prix</h3>
            <div className="space-y-4">
              {distinctions.map((d, i) => (
                <div key={d} className="flex items-center gap-4 py-4 border-b border-[#1A1510]/5">
                  <Award className="w-5 h-5 text-[#C46A3E] shrink-0" />
                  <p className="text-[#1A1510] text-sm font-medium">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light mb-8 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Notre Engagement</h3>
            <p className="text-[#1A1510]/60 text-sm leading-relaxed mb-6">
              Tous nos bâtiments visent une conformité stricte RE2020 et intègrent l'analyse de cycle de vie (ACV) dès les premières étapes du design pour minimiser le carbone incorporé.
            </p>
            <div className="bg-[#F5F2ED] rounded-2xl p-6 border border-[#C46A3E]/10">
              <h4 className="text-[#1A1510] font-medium text-md mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#C46A3E]" /> Philosophie Bioclimatique</h4>
              <p className="text-[#1A1510]/50 text-xs leading-relaxed">
                Utilisation de la ventilation transversale naturelle, de la masse thermique pour le lissage des températures, et de protections solaires passives calculées selon l'azimut local.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EquipePage() {
  return (
    <section className="py-20 px-6 bg-[#F5F2ED]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre ADN</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>L'Équipe</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            Une synergie de talents complémentaires : architectes, ingénieurs thermiciens et conducteurs de chantiers animés par la même passion environnementale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((t, i) => (
            <div key={t.name} className="bg-white border border-[#1A1510]/5 rounded-2xl p-8 hover:border-[#C46A3E]/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-[#C46A3E] rounded-2xl flex items-center justify-center text-white text-2xl font-medium mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name.charAt(0)}</div>
                <h3 className="text-[#1A1510] text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name}</h3>
                <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4">{t.role}</p>
                <p className="text-[#1A1510]/50 text-xs font-mono mb-4">{t.years} d'expérience</p>
                <p className="text-[#1A1510]/60 text-sm italic leading-relaxed">"{t.citation}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Contact</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Parlons de votre projet</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            Vous avez un projet résidentiel, public ou mixte ? Remplissez ce formulaire et un de nos architectes vous recontactera sous 48 heures.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6 bg-[#F5F2ED] p-8 rounded-2xl border border-[#1A1510]/5">
            <h3 className="text-xl font-medium text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Coordonnées</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <MapPin className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>Showroom Privé, 11 Rue de la Paix, 75002 Paris</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <Mail className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>{fd?.email ?? "contact@keops-archi.fr"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <Phone className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>+33 1 42 00 00 00</span>
              </div>
            </div>
            <div className="border-t border-[#1A1510]/10 pt-4">
              <p className="text-xs text-[#1A1510]/40 font-mono">
                Horaires d'ouverture :<br />
                Lundi au Vendredi : 9h00 - 18h00<br />
                Samedi : Sur rendez-vous uniquement
              </p>
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-[#1A1510]/10 flex flex-col gap-4">
            <input type="text" placeholder="Votre nom complet" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30" />
            <input type="email" placeholder="Votre adresse email" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30" />
            <select className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510]/60 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] cursor-pointer">
              <option>Type de programme</option>
              <option>Villa & Résidentiel</option>
              <option>Espace Public / Culturel</option>
              <option>Réhabilitation & Rénovation</option>
              <option>Autre</option>
            </select>
            <textarea rows={4} placeholder="Décrivez les grandes lignes de votre projet (surface, localisation, budget estimé...)" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30 resize-none" />
            <button className="bg-[#C46A3E] text-white font-medium px-6 py-4 rounded-xl hover:bg-[#B5593A] transition-colors cursor-pointer text-sm">
              Envoyer ma demande d'étude
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <section id="contact" className="py-20 px-6 bg-white font-mono text-xs text-[#1A1510]/80">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[#C46A3E] text-[10px] uppercase tracking-widest mb-3 block font-bold">Réglementation</span>
          <h1 className="text-4xl md:text-5xl font-light uppercase text-[#1A1510] mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>Mentions Légales</h1>
        </div>

        <div className="border border-[#C46A3E]/20 bg-[#F5F2ED]/50 p-8 rounded-2xl space-y-6">
          <div className="border-b border-[#1A1510]/10 pb-4">
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">ÉDITEUR</div>
            <p className="leading-relaxed font-sans">
              <strong>Aevia WS — Valentin Milliand</strong><br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Email : valentinmilliand@aevia.services<br />
              Adresse : Communiquée sur demande
            </p>
          </div>

          <div className="border-b border-[#1A1510]/10 pb-4">
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">HÉBERGEUR</div>
            <p className="leading-relaxed font-sans">
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA
            </p>
          </div>

          <div>
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">PROPRIÉTÉ INTELLECTUELLE</div>
            <p className="leading-relaxed font-sans text-xs">
              Tous les visuels, photographies de chantiers, plans, esquisses architecturales, ainsi que le code source de ce site internet sont protégés par le droit d'auteur. Toute reproduction ou distribution non autorisée est passible de poursuites judiciaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
