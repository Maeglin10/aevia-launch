// @ts-nocheck
"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, Star, Play, ChevronRight, Menu, X, ArrowRight, Clock, Award, BarChart2, Globe, CheckCircle } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("edu-fonts")) return;
    const s = document.createElement("style");
    s.id = "edu-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`;
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
  { title: "Data Science & IA", level: "Intermédiaire", duration: "48h", students: "12 400", rating: 4.9, price: "199€", tag: "Populaire", color: "#7C3AED" },
  { title: "UX Design System", level: "Débutant", duration: "32h", students: "8 200", rating: 4.8, price: "149€", tag: "Nouveau", color: "#0EA5E9" },
  { title: "Full-Stack React/Node", level: "Avancé", duration: "64h", students: "9 800", rating: 4.9, price: "249€", tag: "Bestseller", color: "#10B981" },
  { title: "Marketing Digital", level: "Débutant", duration: "24h", students: "15 600", rating: 4.7, price: "99€", tag: "Certifiant", color: "#F59E0B" },
];

const categories = ["Tous", "Tech", "Design", "Business", "Données", "Créativité"];

const features = [
  { icon: <BookOpen className="w-6 h-6" />, title: "500+ cours", desc: "Bibliothèque complète mise à jour chaque semaine" },
  { icon: <Users className="w-6 h-6" />, title: "1:1 Mentoring", desc: "Accès illimité à des mentors experts de l'industrie" },
  { icon: <Award className="w-6 h-6" />, title: "Certifications", desc: "Diplômes reconnus par 200+ entreprises partenaires" },
  { icon: <Globe className="w-6 h-6" />, title: "Communauté", desc: "Réseau de 250 000 apprenants dans 40 pays" },
];

const instructors = [
  { name: "Dr. Lucas Martin", specialty: "Data Science & ML", courses: 12, students: "42k", rating: 4.9 },
  { name: "Emma Chartier", specialty: "UX/UI Design", courses: 8, students: "28k", rating: 4.8 },
  { name: "Théo Bernardin", specialty: "Développement Web", courses: 15, students: "61k", rating: 4.9 },
];

const plans = [
  { name: "Starter", price: "29", period: "mois", features: ["50 cours inclus", "Projets pratiques", "Forum communauté", "Certificat de suivi"], cta: "Commencer", highlight: false },
  { name: "Pro", price: "79", period: "mois", features: ["Tous les cours", "Mentoring mensuel", "Projets guidés", "Certificats officiels", "Support prioritaire"], cta: "Essai 7 jours gratuit", highlight: true },
  { name: "Équipe", price: "199", period: "mois", features: ["10 sièges inclus", "Dashboard équipe", "Rapports de progression", "Onboarding dédié", "Formateur attitré"], cta: "Contacter l'équipe", highlight: false },
];

export default function EduPathPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#7C3AED] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">EduPath</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm font-medium">
            {["Cours", "Mentoring", "Certifications", "Entreprises", "Tarifs"].map(item => (
              <Link key={item} href="/templates/impact-11" className="hover:text-[#7C3AED] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Se connecter</button>
            <button className="bg-[#7C3AED] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6D28D9] transition-colors cursor-pointer font-medium">Commencer</button>
          </div>
          <button className="md:hidden text-gray-900 cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-white flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-gray-900 font-bold text-xl">EduPath</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6" /></button>
            </div>
            {["Cours", "Mentoring", "Certifications", "Entreprises", "Tarifs"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="/templates/impact-11" className="block text-gray-900 text-2xl font-semibold mb-6 cursor-pointer" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF] pt-32 pb-24 px-6">
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#0EA5E9]/8 rounded-full blur-3xl" />
        </motion.div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
                <Star className="w-3 h-3 fill-[#7C3AED]" /> Plateforme #1 en France · 250k apprenants
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-tight mb-6">
                Apprenez les<br />
                <span className="text-[#7C3AED]">compétences</span><br />
                de demain
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-xl">
                Des cours en ligne créés par des experts, des certifications reconnues, et un mentoring personnalisé pour accélérer votre carrière.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors cursor-pointer flex items-center gap-2">
                  Commencer gratuitement <ArrowRight className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-3 text-gray-700 px-6 py-4 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
                  </div>
                  Voir la démo
                </button>
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-md">
            {[["250k+", "Apprenants actifs"], ["500+", "Cours disponibles"], ["92%", "Taux d'emploi"]].map(([n, l]) => (
              <Reveal key={l}>
                <div className="text-center">
                  <p className="text-gray-900 text-2xl font-bold">{n}</p>
                  <p className="text-gray-400 text-xs mt-1">{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#7C3AED] text-sm font-semibold mb-3">Pourquoi EduPath</p>
            <h2 className="text-gray-900 text-4xl md:text-5xl font-bold">Tout ce dont vous avez besoin</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 hover:bg-[#7C3AED]/5 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center text-[#7C3AED] mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">{f.icon}</div>
                  <h3 className="text-gray-900 font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-[#7C3AED] text-sm font-semibold mb-3">Catalogue</p>
              <h2 className="text-gray-900 text-4xl font-bold">Cours populaires</h2>
            </div>
            <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeCategory === cat ? "bg-[#7C3AED] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#7C3AED]"}`}>{cat}</button>
              ))}
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="h-40 relative overflow-hidden" style={{ background: `${c.color}15` }}>
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ background: c.color }}>{c.tag}</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color }}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-sm">{c.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{c.rating}</span>
                      </div>
                      <span className="text-gray-900 font-bold text-sm">{c.price}</span>
                    </div>
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
          <Reveal className="mb-12">
            <p className="text-[#7C3AED] text-sm font-semibold mb-3">Formateurs</p>
            <h2 className="text-gray-900 text-4xl font-bold">Apprenez des meilleurs</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {instructors.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#0EA5E9] rounded-2xl mb-4 flex items-center justify-center text-white text-xl font-bold">
                    {inst.name.charAt(0)}
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-1">{inst.name}</h3>
                  <p className="text-[#7C3AED] text-sm mb-4">{inst.specialty}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{inst.courses} cours</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{inst.students} élèves</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{inst.rating}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#F5F3FF] to-white">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#7C3AED] text-sm font-semibold mb-3">Tarifs</p>
            <h2 className="text-gray-900 text-4xl font-bold">Investissez dans votre carrière</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 ${plan.highlight ? "bg-[#7C3AED] text-white scale-105 shadow-2xl" : "bg-white border border-gray-200"}`}>
                  <h3 className={`font-bold text-xl mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.price}€</span>
                    <span className={`text-sm /${plan.highlight ? "text-white/70" : "text-gray-400"}`}>/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#7C3AED]"}`} />
                        <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${plan.highlight ? "bg-white text-[#7C3AED] hover:bg-gray-100" : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"}`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
              <span className="text-white font-bold text-lg">EduPath</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">La plateforme d'apprentissage en ligne pour les professionnels ambitieux.</p>
          </div>
          {[
            { title: "Formation", links: ["Catalogue", "Certifications", "Mentoring", "Entreprises"] },
            { title: "Ressources", links: ["Blog", "Webinaires", "Communauté", "API"] },
            { title: "Légal", links: ["Conditions", "Confidentialité", "Cookies", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><Link href="/templates/impact-11" className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500">
          <span>© 2026 EduPath. Tous droits réservés.</span>
          <span>Fait avec amour à Paris</span>
        </div>
      </footer>
    </div>
  );
}