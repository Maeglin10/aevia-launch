"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, Film, Camera, ChevronRight, Award, Globe, Users, Play, Clock, Clapperboard, Sparkles, MonitorPlay, PenLine, Video, Layers, Star, MapPin, Mail } from "lucide-react";

type ActivePage = "home" | "films" | "services" | "propos" | "legal";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("sp-fonts")) return;
    const s = document.createElement("style");
    s.id = "sp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@300;400;500&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const films = [
  { title: "Les Heures Perdues", type: "Long-métrage", year: "2025", festival: "Cannes — Sélection Officielle", src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop" },
  { title: "Poussière de Lumière", type: "Court-métrage", year: "2025", festival: "Sundance — Grand Prix", src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" },
  { title: "L'Écho du Silence", type: "Documentaire", year: "2024", festival: "IDFA — Best Documentary", src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80" },
  { title: "Fragments", type: "Court-métrage", year: "2024", festival: "César — Nommé", src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80" },
  { title: "Mémoire Vive", type: "Série", year: "2023", festival: "Festival Séries Mania — Prix Spécial", src: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80" },
];

const categories = ["Tous", "Long-métrage", "Court-métrage", "Documentaire", "Série"];

const services = [
  { title: "Production de films", desc: "De l'écriture de scénario à la post-production. Un accompagnement sur mesure pour chaque projet." },
  { title: "Publicités & Brand Content", desc: "Films de marque, spots TV, content digital. Narration cinématographique au service de votre identité." },
  { title: "Documentaires", desc: "Enquêtes, portraits, films de société. La vérité racontée avec la force du cinéma." },
  { title: "Casting & Direction d'acteurs", desc: "Direction d'acteurs professionnels et non-professionnels. Réseau étendu de comédiens français et internationaux." },
];

const awards = [
  { name: "César du Meilleur Court-Métrage", year: "2024", film: "Poussière de Lumière" },
  { name: "Grand Prix — Sundance Film Festival", year: "2025", film: "Poussière de Lumière" },
  { name: "Prix Spécial — Festival Séries Mania", year: "2023", film: "Mémoire Vive" },
  { name: "Best Documentary — IDFA Amsterdam", year: "2024", film: "L'Écho du Silence" },
];

const filmsCatalogue = [
  {
    title: "Les Heures Perdues",
    type: "Long-métrage",
    year: "2025",
    duration: "1h 47min",
    src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    synopsis: "Paris, hiver 2024. Mathilde, ancienne pianiste prodige devenue accordeuse de pianos, traverse la capitale pour ses rendez-vous professionnels. Chaque instrument qu'elle accorde la ramène à un souvenir enfoui, un fragment de la vie qu'elle a abandonnée. Lorsqu'elle est appelée au Conservatoire pour un Steinway de concert, le passé la rattrape sous la forme d'Étienne, son ancien professeur, désormais atteint d'Alzheimer. Commence alors un voyage intérieur où la musique devient le seul pont entre mémoire et oubli.",
    cast: ["Léa Seydoux — Mathilde Verdier", "André Dussollier — Étienne Lacoste", "Noémie Merlant — Claire, la sœur de Mathilde", "Vincent Lindon — Paul, l'ex-mari", "Hafsia Herzi — Samira, amie et confidente"],
    crew: "Réalisé par Julien Ferraro · Scénario : Julien Ferraro & Camille Noé · Directeur de la photographie : Nicolas Bolduc · Musique originale : Alexandre Desplat · Montage : Laure Gardette",
    festivals: ["Festival de Cannes 2025 — Sélection Officielle (Un Certain Regard)", "Toronto International Film Festival 2025 — Platform", "London Film Festival 2025 — Gala Screening"],
  },
  {
    title: "Poussière de Lumière",
    type: "Court-métrage",
    year: "2025",
    duration: "22 min",
    src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    synopsis: "Dans un village du sud de la France, un vieux projectionniste prépare la dernière séance de son cinéma de plein air avant la démolition du terrain. Les bobines qu'il doit projeter se mélangent : scènes de fiction, archives familiales, souvenirs d'un amour perdu. Le film devient un acte de résistance poétique, une méditation sur la lumière qui persiste quand tout s'éteint.",
    cast: ["Jean-Pierre Darroussin — Auguste, le projectionniste", "Adèle Exarchopoulos — La jeune femme des archives", "Swann Arlaud — Le fils d'Auguste"],
    crew: "Réalisé par Clara Music-Hall · Directrice de la photographie : Céline Bozon · Montage : Albertine Lastera · Son : Brigitte Taillandier",
    festivals: ["Sundance Film Festival 2025 — Grand Prix du Court-Métrage", "César 2025 — Meilleur Court-Métrage (Nommé)", "Clermont-Ferrand 2025 — Grand Prix National", "Berlinale Shorts 2025 — Mention Spéciale du Jury"],
  },
  {
    title: "L'Écho du Silence",
    type: "Documentaire",
    year: "2024",
    duration: "1h 32min",
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
    synopsis: "Pendant trois ans, la réalisatrice a suivi des bergers transhumants dans les Alpes du Sud. Entre solitudes immenses et rituels ancestraux, le film capture la beauté radicale d'un mode de vie en voie de disparition. Sans voix off ni musique additionnelle, le documentaire fait entendre le silence comme un langage à part entière — celui des bêtes, du vent, de la montagne.",
    cast: ["Jean-Marc Barthélémy — berger, vallée du Champsaur", "Marie-Louise Autran — bergère, col de Vars", "Pierre Magnan — vétérinaire itinérant"],
    crew: "Réalisé par Sophie Letourneur · Image : Tom Harari · Son : Xavier Thibault · Production : Studio Pelikan & Les Films du Worso",
    festivals: ["IDFA Amsterdam 2024 — Best Feature-Length Documentary", "Visions du Réel, Nyon 2024 — Grand Prix", "CPH:DOX Copenhague 2024 — Sélection Officielle", "Festival du Film de Montagne de Banff 2024 — Prix du Jury"],
  },
  {
    title: "Fragments",
    type: "Court-métrage",
    year: "2024",
    duration: "18 min",
    src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80",
    synopsis: "Un restaurateur d'art du Louvre découvre, sous les couches de vernis d'un tableau du XVIIe siècle, un portrait caché qui ressemble troublement à sa fille disparue. La frontière entre l'œuvre et la réalité se brouille dans ce thriller psychologique intimiste tourné dans les couloirs déserts du musée, entre fermeture et ouverture.",
    cast: ["Denis Lavant — Michel Fauré, restaurateur", "Lyna Khoudri — Inès, la fille disparue", "Isabelle Huppert — La conservatrice en chef"],
    crew: "Réalisé par Romain Music · Directeur de la photographie : Christophe Beaucarne · Musique : Rone · Décors : Katia Wyszkop",
    festivals: ["César 2024 — Nommé Meilleur Court-Métrage", "Festival de Cannes 2024 — Quinzaine des Cinéastes", "Annecy Cinéma Espagnol & Italien 2024 — Prix Spécial"],
  },
  {
    title: "Mémoire Vive",
    type: "Série",
    year: "2023",
    duration: "6 × 52 min",
    src: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    synopsis: "Lyon, 2043. La mémoire des défunts peut désormais être téléchargée et implantée. Alma, archiviste dans une clinique de mémoire, découvre que certains souvenirs ont été falsifiés à grande échelle. Sa quête de vérité l'entraîne dans une conspiration qui remet en question la notion même d'identité. Thriller d'anticipation ancré dans un réalisme social, la série interroge notre rapport au deuil, à la vérité et à la manipulation numérique.",
    cast: ["Vicky Krieps — Alma Renoir", "Tahar Rahim — Karim Ziani, enquêteur", "Virginie Efira — Dr. Hélène Vasseur", "Pio Marmaï — Lucas, le frère d'Alma", "Aïssa Maïga — Commandante Diallo"],
    crew: "Créée par Julien Ferraro & Nina Music · Réalisée par Julien Ferraro (épisodes 1-3) et Houda Benyamina (épisodes 4-6) · Directeur de la photographie : Julien Hirsch · Musique : Gesaffelstein",
    festivals: ["Festival Séries Mania 2023 — Prix Spécial du Jury", "MIPCOM Cannes 2023 — Série Française de l'Année", "Festival de la Fiction de La Rochelle 2023 — Grand Prix"],
  },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function StudioPelikanPage() {
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
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [activeFilm, setActiveFilm] = useState(0);
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
    setMobileOpen(false);
  };

  const navItems: { label: string; target: ActivePage }[] = [
    { label: "Films", target: "films" },
    { label: "Services", target: "services" },
    { label: "À propos", target: "propos" },
    { label: "Presse", target: "propos" },
    { label: "Contact", target: "home" },
  ];

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const filtered = activeFilter === "Tous" ? films : films.filter(f => f.type === activeFilter);

  
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
    <div className="min-h-screen bg-[#100D08]" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A05A] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#100D08]/90 backdrop-blur-md border border-[#C9A05A]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 text-[#C9A05A] cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
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
                <Film className="w-4 h-4" />{fd?.businessName ?? "Studio Pelikan"}
              </>
            )}
          </button>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {navItems.map(item => (
              <button key={item.label} onClick={() => goTo(item.target)} className="hover:text-[#C9A05A] transition-colors cursor-pointer">{item.label}</button>
            ))}
          </div>
          <button onClick={() => goTo("home")} className="hidden md:inline-flex border border-[#C9A05A]/30 text-[#C9A05A] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer">
            Travailler avec nous
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#100D08] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <button onClick={() => goTo("home")} className="text-[#C9A05A] text-xl cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fd?.businessName ?? "Studio Pelikan"}</button>
              )}
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {navItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <button onClick={() => goTo(item.target)} className="block text-white text-3xl mb-6 cursor-pointer text-left" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.label}</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== HOME PAGE ====== */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
          {/* Hero */}
          <section id="hero" ref={heroRef} className="relative h-screen overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y: heroY }}>
              <Image src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop" alt={fd?.businessName ?? "Studio Pelikan"} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-[#100D08]/70 via-[#100D08]/30 to-[#100D08]/95" />
            </motion.div>
            <motion.div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6" style={{ opacity: heroOpacity }}>
              <div className="max-w-6xl mx-auto w-full">
                <Reveal>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Société de production · Paris</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-white text-7xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{c?.heroHeadline ?? <>
                    Studio<br /><em>Pelikan</em>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <p className="text-white/50 text-lg max-w-sm">{c?.heroSubline ?? fd?.tagline ?? <>Cinéma d&apos;auteur, documentaire, série. Depuis 2012, nous produisons des œuvres qui voyagent.</>}</p>
                    <button onClick={() => goTo("films")} className="shrink-0 border border-[#C9A05A]/40 text-[#C9A05A] text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer flex items-center gap-2">
                      <Play className="w-3 h-3 fill-current" /> Voir la bande démo
                    </button>
                  </div>
                </Reveal>
              </div>
            </motion.div>
          </section>

          {/* Stats */}
          <section id="tarifs" className="py-12 bg-[#C9A05A]">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
              {[["38", "Films produits"], ["12", "Prix internationaux"], ["14 pays", "Distribution"], ["2012", "Fondé à Paris"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-black text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{n}</p>
                  <p className="text-black/50 text-xs uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Films */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                <div>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Filmographie</p>
                  <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Nos productions</h2>
                </div>
                <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-xs transition-all cursor-pointer rounded-lg border ${activeFilter === cat ? "bg-[#C9A05A] text-black border-[#C9A05A]" : "border-white/10 text-white/40 hover:border-[#C9A05A]/40"}`}>{cat}</button>
                  ))}
                </div>
              </Reveal>
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filtered.map((film, i) => (
                    <motion.div key={film.title} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                      <div onClick={() => setActiveFilm(i)} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "16/9" }}>
                          <Image src={film.src} alt={film.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <span className="text-[#C9A05A] text-xs tracking-widest uppercase border border-[#C9A05A]/30 px-2.5 py-1 rounded-full">{film.type}</span>
                          </div>
                          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </button>
                        </div>
                        <h3 className="text-white mb-1 group-hover:text-[#C9A05A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>{film.title}</h3>
                        <p className="text-white/30 text-xs">{film.festival} · {film.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* Services */}
          <section className="py-24 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Expertise</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Nos services</h2>
              </Reveal>
              <div className="grid md:grid-cols-2 gap-5">
                {services.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.1}>
                    <div onClick={() => goTo("services")} className="bg-[#1A1208] border border-white/5 rounded-2xl p-8 hover:border-[#C9A05A]/20 transition-colors cursor-pointer group">
                      <h3 className="text-white text-xl mb-3 group-hover:text-[#C9A05A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                      <div className="flex items-center gap-1 text-[#C9A05A] text-xs mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        En savoir plus <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Awards */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Distinctions</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Palmarès</h2>
              </Reveal>
              <div className="space-y-0">
                {awards.map((a, i) => (
                  <Reveal key={a.name} delay={i * 0.08}>
                    <div className="flex items-center justify-between py-6 border-b border-white/10 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <Award className="w-4 h-4 text-[#C9A05A] shrink-0" />
                        <div>
                          <p className="text-white text-sm group-hover:text-[#C9A05A] transition-colors">{a.name}</p>
                          <p className="text-white/30 text-xs italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{a.film}</p>
                        </div>
                      </div>
                      <span className="text-white/30 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{a.year}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-24 px-6 bg-[#150F09]">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Parlons de votre projet</p>
                <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{c?.aboutTitle ?? fd?.businessName ?? <>Travaillons ensemble</>}</h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">{c?.aboutText ?? <>
                  Nous recevons chaque projet avec la même attention. Qu&apos;il s&apos;agisse d&apos;un premier court-métrage ou d&apos;une coproduction internationale.
                </>}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                    Nous écrire
                  </button>
                  <button className="border border-white/15 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2">
                    <Globe className="w-4 h-4" />{fd?.email ?? "hello@studio-pelikan.fr"}</button>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ====== FILMS PAGE ====== */}
      <div style={{ display: page === "films" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Catalogue complet</p>
                <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  Nos <em>Films</em>
                </h1>
                <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                  Depuis 2012, Studio Pelikan développe, produit et accompagne des œuvres cinématographiques
                  exigeantes. Chaque film est une aventure humaine, artistique et technique unique.
                </p>
              </Reveal>
            </div>
          </section>

          <section id="equipe" className="py-8 px-6">
            <div className="max-w-6xl mx-auto space-y-24">
              {filmsCatalogue.map((film, i) => (
                <Reveal key={film.title} delay={0.1}>
                  <div className="grid lg:grid-cols-2 gap-10 items-start">
                    <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16/10" }}>
                      <Image src={film.src} alt={film.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <span className="text-[#C9A05A] text-xs tracking-widest uppercase border border-[#C9A05A]/30 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">{film.type}</span>
                        <span className="text-white/60 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {film.duration}</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="text-white/50 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{film.year}</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-white text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{film.title}</h2>
                      <p className="text-white/50 text-sm leading-relaxed mb-6">{film.synopsis}</p>

                      <div className="mb-6">
                        <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Distribution</p>
                        <div className="space-y-1.5">
                          {film.cast.map(member => (
                            <p key={member} className="text-white/40 text-sm">{member}</p>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Équipe technique</p>
                        <p className="text-white/40 text-sm leading-relaxed">{film.crew}</p>
                      </div>

                      <div>
                        <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Sélections & Distinctions</p>
                        <div className="space-y-2">
                          {film.festivals.map(fest => (
                            <div key={fest} className="flex items-center gap-2">
                              <Award className="w-3 h-3 text-[#C9A05A] shrink-0" />
                              <p className="text-white/40 text-sm">{fest}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {i < filmsCatalogue.length - 1 && (
                    <div className="border-b border-white/5 mt-20" />
                  )}
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-24 px-6 bg-[#150F09]">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Vous avez un projet ?</p>
                <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  Soumettre un scénario
                </h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
                  Nous lisons chaque scénario avec attention. Envoyez-nous votre note d&apos;intention
                  et votre traitement pour une première lecture.
                </p>
                <button onClick={() => goTo("home")} className="bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                  Nous contacter
                </button>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ====== SERVICES PAGE ====== */}
      <div style={{ display: page === "services" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Notre expertise</p>
                <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  Nos <em>Services</em>
                </h1>
                <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                  De la première idée à la diffusion internationale, nous accompagnons chaque projet avec
                  rigueur, passion et un savoir-faire acquis sur plus de trente-huit productions.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Écriture & Développement */}
          <section className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A05A]/10 flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-[#C9A05A]" />
                  </div>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase">Phase 1</p>
                </div>
                <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Écriture &amp; Développement</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Chaque film commence par une histoire. Nous accompagnons les auteurs dès la note d&apos;intention,
                  à travers les résidences d&apos;écriture, le développement dramaturgique et la construction du dossier
                  de production. Notre comité de lecture évalue chaque projet avec exigence et bienveillance.
                </p>
                <div className="space-y-3">
                  {["Consulting scénaristique et script-doctoring", "Résidences d'écriture (partenariats Moulin d'Andé, La Chartreuse)", "Montage du dossier CNC, Eurimages, aides régionales", "Recherche de coproducteurs nationaux et internationaux", "Bible de série et pilotes pour les plateformes"].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-[#C9A05A] mt-1 shrink-0" />
                      <p className="text-white/50 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80" alt="Écriture" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#150F09]/80 to-transparent" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* Réalisation & Tournage */}
          <section id="services" className="py-20 px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-2xl order-2 lg:order-1" style={{ aspectRatio: "4/3" }}>
                  <Image src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80" alt="Tournage" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D08]/80 to-transparent" />
                </div>
              </Reveal>
              <Reveal className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A05A]/10 flex items-center justify-center">
                    <Clapperboard className="w-5 h-5 text-[#C9A05A]" />
                  </div>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase">Phase 2</p>
                </div>
                <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Réalisation &amp; Tournage</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Notre équipe de production assure la logistique complète du tournage : repérages, casting,
                  direction de production, régissage. Nous travaillons avec les meilleurs techniciens français
                  et européens pour garantir une qualité d&apos;image et de son irréprochable.
                </p>
                <div className="space-y-3">
                  {["Direction de production et plan de travail", "Casting sur Paris, régions et international", "Repérages et autorisations de tournage", "Coordination avec les prestataires techniques", "Suivi quotidien et rushes dailies"].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-[#C9A05A] mt-1 shrink-0" />
                      <p className="text-white/50 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* Post-production & VFX */}
          <section className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A05A]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#C9A05A]" />
                  </div>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase">Phase 3</p>
                </div>
                <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Post-production &amp; VFX</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Montage image, montage son, mixage, étalonnage, effets visuels : chaque étape de la
                  post-production est supervisée avec la plus grande attention. Nous disposons de partenariats
                  privilégiés avec les meilleurs studios parisiens.
                </p>
                <div className="space-y-3">
                  {["Montage sur Avid Media Composer et DaVinci Resolve", "Étalonnage HDR / Dolby Vision en salle calibrée", "Mixage Dolby Atmos en auditorium certifié", "VFX et compositing (Nuke, Houdini, Unreal Engine)", "Mastering DCP pour diffusion en salle", "Sous-titrage et doublage multilingue"].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-[#C9A05A] mt-1 shrink-0" />
                      <p className="text-white/50 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80" alt="Post-production" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#150F09]/80 to-transparent" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* Spots de marque */}
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80" alt="Brand Content" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D08]/80 to-transparent" />
                </div>
              </Reveal>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A05A]/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-[#C9A05A]" />
                  </div>
                  <p className="text-[#C9A05A] text-xs tracking-widest uppercase">Sur mesure</p>
                </div>
                <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Spots de marque &amp; Brand Content</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Nous mettons notre regard cinématographique au service des marques. Films institutionnels,
                  spots publicitaires, content digital : chaque projet bénéficie de la même exigence narrative
                  et esthétique que nos productions de cinéma.
                </p>
                <div className="space-y-3">
                  {["Direction artistique et conception narrative", "Spots TV et digital (15s, 30s, 60s, formats longs)", "Films institutionnels et corporate", "Captation événementielle haut de gamme", "Stratégie de diffusion multi-plateformes"].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-[#C9A05A] mt-1 shrink-0" />
                      <p className="text-white/50 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* Équipement */}
          <section id="realisations" className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Parc technique</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Notre équipement</h2>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { cat: "Caméras", items: ["ARRI Alexa Mini LF", "RED V-Raptor XL 8K", "Sony Venice 2", "Canon EOS C500 Mark II"] },
                  { cat: "Optiques", items: ["Cooke S7/i Full Frame Primes", "ARRI Signature Primes", "Angénieux Optimo Ultra 12x", "Zeiss Supreme Prime Radiance"] },
                  { cat: "Lumière & Son", items: ["ARRI SkyPanel S360-C", "Litepanels Gemini 2x1", "Sound Devices Scorpio (32 pistes)", "Sennheiser MKH 8060 + DPA 4017"] },
                ].map((group, i) => (
                  <Reveal key={group.cat} delay={i * 0.1}>
                    <div className="bg-[#1A1208] border border-white/5 rounded-2xl p-8">
                      <h3 className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">{group.cat}</h3>
                      <div className="space-y-2">
                        {group.items.map(item => (
                          <p key={item} className="text-white/50 text-sm">{item}</p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Workflow */}
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Processus</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Notre workflow de production</h2>
              </Reveal>
              <div className="grid md:grid-cols-4 gap-5">
                {[
                  { step: "01", title: "Lecture & Évaluation", desc: "Réception du scénario, analyse dramaturgique, évaluation du potentiel artistique et commercial." },
                  { step: "02", title: "Développement", desc: "Travail d'écriture, constitution du dossier de production, recherche de financements et casting." },
                  { step: "03", title: "Production", desc: "Préparation, tournage, supervision quotidienne. Rushes et assemblage en temps réel." },
                  { step: "04", title: "Diffusion", desc: "Post-production, soumission en festivals, ventes internationales, sorties salle et plateformes." },
                ].map((phase, i) => (
                  <Reveal key={phase.step} delay={i * 0.1}>
                    <div className="text-center">
                      <p className="text-[#C9A05A] text-4xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{phase.step}</p>
                      <h3 className="text-white text-sm uppercase tracking-widest mb-3">{phase.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{phase.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Services CTA */}
          <section className="py-24 px-6 bg-[#150F09]">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Prêt à produire ?</p>
                <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Discutons de votre projet</h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
                  Que vous soyez réalisateur, auteur ou marque, nous serions ravis d&apos;étudier votre projet
                  et de vous proposer un accompagnement sur mesure.
                </p>
                <button onClick={() => goTo("home")} className="bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                  Nous contacter
                </button>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ====== À PROPOS PAGE ====== */}
      <div style={{ display: page === "propos" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Notre histoire</p>
                <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  À <em>propos</em>
                </h1>
                <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                  Studio Pelikan est une société de production cinématographique indépendante fondée en 2012
                  à Paris. Nous croyons en un cinéma exigeant, singulier et universel.
                </p>
              </Reveal>
            </div>
          </section>

          {/* Histoire */}
          <section className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-6">Fondation</p>
                <h2 className="text-white text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Depuis 2012, Paris</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-4">
                  Studio Pelikan naît en 2012 dans le 11e arrondissement de Paris, fondé par Julien Ferraro
                  et Nina Music après leurs études à La Fémis. Le nom est un hommage au Café Pelikan de Budapest,
                  lieu de rendez-vous des cinéastes de la Nouvelle Vague hongroise dans les années 60.
                </p>
                <p className="text-white/40 text-sm leading-relaxed mb-4">
                  Les premières années sont consacrées au court-métrage : six films en trois ans, dont
                  <em className="text-white/60"> Là où le jour se lève</em> (2013), sélectionné à la Quinzaine des Cinéastes,
                  et <em className="text-white/60">Nuit blanche</em> (2014), récompensé au Festival de Clermont-Ferrand.
                </p>
                <p className="text-white/40 text-sm leading-relaxed">
                  En 2017, le studio franchit le cap du long-métrage avec <em className="text-white/60">Le Dernier Matin</em>,
                  présenté à la Mostra de Venise. Depuis, chaque année apporte de nouvelles collaborations,
                  de nouveaux talents, et la confirmation d&apos;une ligne artistique forte : un cinéma d&apos;auteur
                  ancré dans le réel, ouvert sur le monde.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80" alt="Studio Pelikan Paris" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#150F09]/80 to-transparent" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* Manifeste */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-6">Manifeste artistique</p>
                <h2 className="text-white text-4xl mb-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Ce que nous défendons</h2>
              </Reveal>
              <div className="space-y-8">
                {[
                  "Nous croyons que le cinéma est un art de la lenteur. Dans un monde saturé d'images, nous choisissons la contemplation, le plan-séquence, le silence éloquent.",
                  "Nous défendons le cinéma d'auteur comme un espace de liberté absolue. Le réalisateur est au centre de chaque décision artistique. Notre rôle de producteur est de protéger cette vision.",
                  "Nous cherchons des histoires universelles enracinées dans des territoires singuliers. La langue, le paysage, la lumière d'un lieu sont des personnages à part entière.",
                  "Nous misons sur les premiers et deuxièmes films. Accompagner un cinéaste à ses débuts, c'est parier sur un regard neuf, une urgence de dire qui ne se retrouve nulle part ailleurs.",
                  "Nous pensons le cinéma comme un acte politique. Non pas militant, mais engagé dans une représentation juste et nuancée du monde tel qu'il est.",
                ].map((text, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <p className="text-white/50 text-lg leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      &laquo;&nbsp;{text}&nbsp;&raquo;
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Distribution */}
          <section className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Réseau international</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Distribution &amp; Partenaires</h2>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { region: "Europe", partners: ["Wild Bunch Distribution (France)", "Curzon Films (Royaume-Uni)", "Piffl Medien (Allemagne)", "BIM Distribuzione (Italie)", "Avalon Distribución (Espagne)"] },
                  { region: "Amériques", partners: ["A24 (États-Unis)", "Oscilloscope Laboratories (États-Unis)", "Métropole Films (Canada)", "Imovision (Brésil)", "Cinépolis Distribución (Mexique)"] },
                  { region: "Asie & Océanie", partners: ["Bitters End (Japon)", "CJ Entertainment (Corée du Sud)", "Palace Films (Australie)", "Soda Pictures (Nouvelle-Zélande)", "Edko Films (Hong Kong)"] },
                ].map((group, i) => (
                  <Reveal key={group.region} delay={i * 0.1}>
                    <div className="bg-[#1A1208] border border-white/5 rounded-2xl p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-[#C9A05A]" />
                        <h3 className="text-[#C9A05A] text-xs tracking-widest uppercase">{group.region}</h3>
                      </div>
                      <div className="space-y-2">
                        {group.partners.map(p => (
                          <p key={p} className="text-white/40 text-sm">{p}</p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Équipe */}
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">L&apos;équipe</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Les visages du studio</h2>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { name: "Julien Ferraro", role: "Fondateur & Producteur", bio: "Diplômé de La Fémis (département production, promotion 2010). Producteur de 22 films, dont 4 sélectionnés à Cannes." },
                  { name: "Nina Music", role: "Co-fondatrice & Directrice artistique", bio: "Ancienne scénariste, diplômée de La Fémis. Supervise le développement créatif de chaque projet du studio." },
                  { name: "Karim Ziani", role: "Directeur de production", bio: "15 ans d'expérience en production exécutive. Ancien directeur de production chez Why Not Productions." },
                  { name: "Élodie Marchetti", role: "Responsable ventes internationales", bio: "Passée par MK2 et Playtime, elle pilote la stratégie de distribution et les ventes festivals du catalogue." },
                  { name: "Thomas Leroux", role: "Directeur technique", bio: "Ingénieur du son de formation, il supervise l'ensemble du parc technique et des partenariats studio." },
                  { name: "Camille Noé", role: "Responsable développement", bio: "Script-doctor et lectrice. Elle accompagne les auteurs dans l'écriture et le montage des dossiers CNC." },
                  { name: "Sami Belkacem", role: "Chargé de production", bio: "Spécialiste du documentaire, il coordonne la logistique des tournages en France et à l'international." },
                  { name: "Lucie Fontaine", role: "Attachée de presse", bio: "Ancienne journaliste cinéma aux Cahiers, elle gère les relations presse et la communication du studio." },
                ].map((member, i) => (
                  <Reveal key={member.name} delay={i * 0.06}>
                    <div className="bg-[#1A1208] border border-white/5 rounded-2xl p-6 hover:border-[#C9A05A]/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#C9A05A]/10 flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-[#C9A05A]" />
                      </div>
                      <h3 className="text-white text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{member.name}</h3>
                      <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">{member.role}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Presse */}
          <section id="about" className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-3">Presse</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Ils parlent de nous</h2>
              </Reveal>
              <div className="space-y-6">
                {[
                  { quote: "Studio Pelikan incarne le meilleur du cinéma indépendant français : exigeant, sensible, universel.", source: "Les Cahiers du Cinéma", date: "Mars 2025" },
                  { quote: "Avec Poussière de Lumière, le studio confirme sa capacité à révéler de nouveaux talents tout en maintenant une qualité de production exceptionnelle.", source: "Télérama", date: "Janvier 2025" },
                  { quote: "L'Écho du Silence est un chef-d'œuvre de patience et d'écoute. Studio Pelikan prouve que le documentaire peut être aussi puissant que la fiction.", source: "Le Monde", date: "Novembre 2024" },
                  { quote: "Mémoire Vive est la série française la plus ambitieuse de la décennie. Une production qui rivalise avec les meilleures séries internationales.", source: "Première", date: "Septembre 2023" },
                ].map((press, i) => (
                  <Reveal key={press.source} delay={i * 0.08}>
                    <div className="border-l-2 border-[#C9A05A]/30 pl-6 py-2">
                      <p className="text-white/50 text-lg italic leading-relaxed mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        &laquo;&nbsp;{press.quote}&nbsp;&raquo;
                      </p>
                      <p className="text-[#C9A05A] text-xs tracking-widest uppercase">{press.source} — {press.date}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* About CTA */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Rejoignez l&apos;aventure</h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
                  Vous êtes cinéaste, auteur, technicien ou journaliste ? Nous serions ravis d&apos;échanger avec vous.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => goTo("home")} className="bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                    Nous contacter
                  </button>
                  <button onClick={() => goTo("films")} className="border border-white/15 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2 justify-center">
                    <Film className="w-4 h-4" /> Voir nos films
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* ====== LEGAL PAGE ====== */}
      <div style={{ display: page === "legal" ? "block" : "none" }}>
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Informations légales</p>
                <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  Mentions <em>légales</em>
                </h1>
              </Reveal>
            </div>
          </section>

          <section id="contact" className="py-20 px-6 bg-[#150F09]">
            <div className="max-w-4xl mx-auto space-y-12">
              {[
                { title: "Éditeur du site", content: "Aevia WS — Valentin Milliand, entrepreneur individuel.\nSIREN : 852 546 225 — RCS Bourg-en-Bresse." },
                { title: "Contact", content: "contact@aevia.ws" },
                { title: "Hébergement", content: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA." },
                { title: "Propriété intellectuelle", content: "L'ensemble des contenus (textes, images, code, design) est protégé. Toute reproduction non autorisée est interdite." },
                { title: "Données personnelles", content: "Aucune donnée personnelle n'est collectée sans consentement explicite. Conformité RGPD." },
              ].map((section, i) => (
                <Reveal key={section.title} delay={i * 0.08}>
                  <div>
                    <h2 className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">{section.title}</h2>
                    {section.content.split("\n").map((line, j) => (
                      <p key={j} className="text-white/50 text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <button onClick={() => goTo("home")} className="border border-[#C9A05A]/30 text-[#C9A05A] text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer">
                  Retour à l&apos;accueil
                </button>
              </Reveal>
            </div>
          </section>
        </div>

      {/* Footer */}
      <footer className="bg-[#090704] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <button onClick={() => goTo("home")} className="text-[#C9A05A] text-lg cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Studio Pelikan · Paris</button>
          <div className="flex gap-8">
            <button onClick={() => goTo("films")} className="hover:text-[#C9A05A] transition-colors cursor-pointer">Films</button>
            <button onClick={() => goTo("legal")} className="hover:text-[#C9A05A] transition-colors cursor-pointer">Mentions légales</button>
          </div>
          <span>© 2026 Studio Pelikan. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
