"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Wind, Anchor, Navigation, Users, Calendar, ChevronRight, Award, MapPin, Phone, Mail } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("az-fonts")) return;
    const s = document.createElement("style");
    s.id = "az-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const courses = [
  { name: "Permis Côtier", duration: "5 jours", level: "Débutant", price: "490€", spots: 6, icon: <Anchor className="w-5 h-5" /> },
  { name: "Côtier Confirmé", duration: "7 jours", level: "Intermédiaire", price: "690€", spots: 4, icon: <Navigation className="w-5 h-5" /> },
  { name: "Hauturier", duration: "12 jours", level: "Avancé", price: "1 190€", spots: 3, icon: <Wind className="w-5 h-5" /> },
  { name: "Croisière Méditerranée", duration: "10 jours", level: "Tous niveaux", price: "890€", spots: 8, icon: <MapPin className="w-5 h-5" /> },
];

const instructors = [
  { name: "Capt. Marc Leblanc", license: "Capitaine 200", experience: "22 ans", specialty: "Hauturier & Régates" },
  { name: "Sophie Navarro", license: "Monitrice FFVL", experience: "14 ans", specialty: "Initiation & Côtier" },
  { name: "Pierre Dumont", license: "Chef de bord offshore", experience: "18 ans", specialty: "Navigation hauturière" },
];

const testimonials = [
  { name: "Antoine M.", text: "Le meilleur investissement de ma vie. En 7 jours j'ai obtenu mon côtier et surtout la confiance en mer. Équipe extraordinaire.", course: "Côtier Confirmé" },
  { name: "Lisa R.", text: "Atmosphère incroyable, instructeurs passionnés. J'ai découvert une passion que je n'aurais jamais imaginée. Merci Azimut!", course: "Permis Côtier" },
  { name: "François D.", text: "Formation hauturière de très haute qualité. Théorie solide, pratique intensive. Je suis maintenant autonome pour traverser la Méditerranée.", course: "Hauturier" },
];

const sessions = [
  { date: "12–19 Juin", course: "Permis Côtier", spots: 2, status: "Presque complet" },
  { date: "24 Juin – 1er Juil.", course: "Côtier Confirmé", spots: 4, status: "Disponible" },
  { date: "10–21 Juillet", course: "Hauturier", spots: 1, status: "Dernière place" },
  { date: "1–11 Août", course: "Croisière Méditerranée", spots: 6, status: "Disponible" },
];

export default function AzimutPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#0F4C6E] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0F4C6E] rounded-lg flex items-center justify-center"><Wind className="w-4 h-4 text-white" /></div>
            <span className="text-[#0F4C6E] font-bold text-lg">Azimut</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm font-medium">
            {["Formations", "Agenda", "Flotte", "Instructeurs", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#0F4C6E] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex bg-[#0F4C6E] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#0A3B56] transition-colors cursor-pointer font-medium">
            Réserver
          </button>
          <button className="md:hidden text-gray-900 cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0F4C6E] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white font-bold text-xl">Azimut</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Formations", "Agenda", "Flotte", "Instructeurs", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-2xl font-medium mb-6 cursor-pointer" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=85" alt="École de voile Azimut" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C6E]/80 via-[#0F4C6E]/40 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex items-center px-6" style={{ opacity: heroOpacity }}>
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-4 py-1.5 rounded-full mb-8">
                <Anchor className="w-3 h-3" /> École de voile — Marseille
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6">
                Apprenez à<br />naviguer avec<br />
                <span className="text-[#4AB8E8]">confiance</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-white/80 text-xl leading-relaxed max-w-xl mb-10">
                Formations certifiantes en voile côtière et hauturière. Instructeurs FFVoile, flotte moderne, Méditerranée toute l'année.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-[#0F4C6E] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  Voir les formations
                </button>
                <button className="border border-white/40 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2">
                  <Wind className="w-4 h-4" /> Prochaines sessions
                </button>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0F4C6E]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[["2 800+", "Stagiaires formés"], ["98%", "Taux de réussite"], ["12", "Voiliers en flotte"], ["15 ans", "D'expérience"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-white text-3xl font-bold mb-1">{n}</p>
              <p className="text-white/50 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#0F4C6E] text-sm font-semibold mb-3">Nos formations</p>
              <h2 className="text-gray-900 text-4xl md:text-5xl font-bold">Choisissez votre niveau</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div onClick={() => setActiveCourse(i)} className={`rounded-2xl p-6 cursor-pointer transition-all border ${i === activeCourse ? "bg-[#0F4C6E] border-[#0F4C6E] text-white" : "bg-gray-50 border-gray-100 hover:border-[#0F4C6E]/20"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${i === activeCourse ? "bg-white/20" : "bg-[#0F4C6E]/10 text-[#0F4C6E]"}`}>{c.icon}</div>
                  <h3 className={`font-bold mb-1 ${i === activeCourse ? "text-white" : "text-gray-900"}`}>{c.name}</h3>
                  <p className={`text-sm mb-4 ${i === activeCourse ? "text-white/70" : "text-gray-500"}`}>{c.level} · {c.duration}</p>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-lg ${i === activeCourse ? "text-white" : "text-[#0F4C6E]"}`}>{c.price}</span>
                    <span className={`text-xs ${i === activeCourse ? "text-white/60" : "text-gray-400"}`}>{c.spots} places</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className="py-24 px-6 bg-[#F0F4F8]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#0F4C6E] text-sm font-semibold mb-3">Calendrier 2026</p>
              <h2 className="text-gray-900 text-4xl font-bold">Prochaines sessions</h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <Reveal key={s.date} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 flex items-center justify-between border border-gray-100 hover:border-[#0F4C6E]/20 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-[#0F4C6E] mb-1 mx-auto" />
                      <p className="text-gray-900 font-medium text-sm">{s.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{s.course}</p>
                      <p className="text-gray-400 text-sm">{s.spots} place{s.spots > 1 ? "s" : ""} disponible{s.spots > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.spots <= 1 ? "bg-red-50 text-red-600" : s.spots <= 2 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}>{s.status}</span>
                    <button className="bg-[#0F4C6E] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#0A3B56] transition-colors cursor-pointer">Réserver</button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#0F4C6E] text-sm font-semibold mb-3">L'équipe</p>
              <h2 className="text-gray-900 text-4xl font-bold">Vos instructeurs</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {instructors.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0F4C6E] to-[#4AB8E8] rounded-2xl mb-4 flex items-center justify-center text-white text-xl font-bold">{inst.name.charAt(0)}</div>
                  <h3 className="text-gray-900 font-bold mb-1">{inst.name}</h3>
                  <p className="text-[#0F4C6E] text-sm font-medium mb-3">{inst.specialty}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Award className="w-3 h-3" />{inst.license}</span>
                    <span>{inst.experience}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#0F4C6E]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal><p className="text-white/40 text-xs uppercase tracking-widest mb-12">Témoignages</p></Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
              <p className="text-white text-2xl md:text-3xl font-medium leading-relaxed mb-6">"{testimonials[activeTestimonial].text}"</p>
              <p className="text-white/80 font-semibold text-sm">{testimonials[activeTestimonial].name}</p>
              <p className="text-white/40 text-xs mt-1">{testimonials[activeTestimonial].course}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`rounded-full transition-all cursor-pointer ${i === activeTestimonial ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Contact */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-gradient-to-br from-[#0F4C6E] to-[#1A7AAF] rounded-3xl p-10 md:p-16 text-center text-white">
              <Wind className="w-10 h-10 mx-auto mb-6 opacity-70" />
              <h2 className="text-4xl font-bold mb-4">Prêt à prendre le large ?</h2>
              <p className="text-white/70 max-w-md mx-auto mb-10">Réservez votre formation dès maintenant. Places limitées, saison chargée.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#0F4C6E] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">Réserver une formation</button>
                <button className="border border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"><Phone className="w-4 h-4" />04 91 00 00 00</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#0F4C6E] rounded-lg flex items-center justify-center"><Wind className="w-4 h-4 text-white" /></div><span className="text-white font-bold">Azimut</span></div>
            <p className="text-gray-400 text-sm leading-relaxed">École de voile certifiée FFVoile à Marseille depuis 2011.</p>
          </div>
          {[
            { title: "Formations", links: ["Permis côtier", "Côtier confirmé", "Hauturier", "Croisières"] },
            { title: "L'école", links: ["Notre flotte", "Nos instructeurs", "Certifications", "Blog"] },
            { title: "Contact", links: ["Marseille Marina", "04 91 00 00 00", "contact@azimut-voile.fr", "FAQ"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">{l}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex justify-between text-xs text-gray-500">
          <span>© 2026 Azimut École de Voile. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
