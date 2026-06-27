"use client";

import { motion, useScroll, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Film, Clock, Award } from "lucide-react";

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

const filmsCatalogue = [
  {
    title: "Les Heures Perdues",
    type: "Long-métrage",
    year: "2025",
    duration: "1h 47min",
    src: "https://picsum.photos/seed/cinema/600/800",
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

export default function Impact23FilmsPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const navItems = [
    { label: "Films", target: "/templates/impact-23/films" },
    { label: "Services", target: "/templates/impact-23/services" },
    { label: "À propos", target: "/templates/impact-23/about" },
    { label: "Presse", target: "/templates/impact-23/press" },
    { label: "Contact", target: "/templates/impact-23/contact" },
  ];

  return (
    <div className="min-h-screen bg-[#100D08]" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A05A] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#100D08]/90 backdrop-blur-md border border-[#C9A05A]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-23" className="flex items-center gap-2 text-[#C9A05A] cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
            <Film className="w-4 h-4" /> Studio Pelikan
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {navItems.map(item => (
              <Link key={item.label} href={item.target} className="hover:text-[#C9A05A] transition-colors cursor-pointer">{item.label}</Link>
            ))}
          </div>
          <Link href="/templates/impact-23/contact" className="hidden md:inline-flex border border-[#C9A05A]/30 text-[#C9A05A] text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-[#C9A05A] hover:text-black transition-all cursor-pointer">
            Travailler avec nous
          </Link>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#100D08] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <Link href="/templates/impact-23" className="text-[#C9A05A] text-xl cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Studio Pelikan</Link>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {navItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={item.target} className="block text-white text-3xl mb-6 cursor-pointer text-left" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "block" }}>
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
                <Link href="/templates/impact-23/contact" className="inline-block bg-[#C9A05A] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B89049] transition-colors cursor-pointer">
                  Nous contacter
                </Link>
              </Reveal>
            </div>
          </section>
        </div>

      <footer className="bg-[#090704] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <Link href="/templates/impact-23" className="text-[#C9A05A] text-lg cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Studio Pelikan · Paris</Link>
          <div className="flex gap-8">
            <Link href="/templates/impact-23/films" className="hover:text-[#C9A05A] transition-colors cursor-pointer">Films</Link>
            <Link href="/templates/impact-23/legal" className="hover:text-[#C9A05A] transition-colors cursor-pointer">Mentions légales</Link>
          </div>
          <span>© 2026 Studio Pelikan. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
