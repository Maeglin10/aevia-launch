"use client";

import { motion, useScroll, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Film, ChevronRight, Clapperboard, Sparkles, MonitorPlay, PenLine } from "lucide-react";

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

export default function Impact23ServicesPage() {
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
