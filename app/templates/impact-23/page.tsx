"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Film, Camera, ChevronRight, Award, Globe, Users, Play } from "lucide-react";

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
  { title: "Les Heures Perdues", type: "Long-métrage", year: "2025", festival: "Cannes — Sélection Officielle", src: "https://picsum.photos/seed/cinema/600/800" },
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

export default function StudioPelikanPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [activeFilm, setActiveFilm] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const filtered = activeFilter === "Tous" ? films : films.filter(f => f.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#100D08]" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A05A] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#100D08]/90 backdrop-blur-md border border-[#C9A05A]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#C9A05A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
            <Film className="w-4 h-4" /> Studio Pelikan
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {["Films", "Services", "À propos", "Presse", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C9A05A] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex border border-[#C9A05A]/30 text-[#C9A05A] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer">
            Travailler avec nous
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#100D08] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A05A] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Studio Pelikan</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Films", "Services", "À propos", "Presse", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://picsum.photos/seed/cinema/1600/1000" alt="Studio Pelikan" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#100D08]/70 via-[#100D08]/30 to-[#100D08]/95" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6" style={{ opacity: heroOpacity }}>
          <div className="max-w-6xl mx-auto w-full">
            <Reveal>
              <p className="text-[#C9A05A] text-xs tracking-widest uppercase mb-4">Société de production · Paris</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-white text-7xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Studio<br /><em>Pelikan</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <p className="text-white/50 text-lg max-w-sm">Cinéma d'auteur, documentaire, série. Depuis 2012, nous produisons des œuvres qui voyagent.</p>
                <button className="shrink-0 border border-[#C9A05A]/40 text-[#C9A05A] text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer flex items-center gap-2">
                  <Play className="w-3 h-3 fill-current" /> Voir la bande démo
                </button>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#C9A05A]">
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
                <div className="bg-[#1A1208] border border-white/5 rounded-2xl p-8 hover:border-[#C9A05A]/20 transition-colors cursor-pointer group">
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
            <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Travaillons ensemble</h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
              Nous recevons chaque projet avec la même attention. Qu'il s'agisse d'un premier court-métrage ou d'une coproduction internationale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                Nous écrire
              </button>
              <button className="border border-white/15 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2">
                <Globe className="w-4 h-4" /> hello@studio-pelikan.fr
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090704] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <span className="text-[#C9A05A] text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Studio Pelikan · Paris</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#C9A05A] transition-colors cursor-pointer">Films</Link>
            <Link href="#" className="hover:text-[#C9A05A] transition-colors cursor-pointer">Mentions légales</Link>
          </div>
          <span>© 2026 Studio Pelikan. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
