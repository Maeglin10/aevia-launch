"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Award,
  Play,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  C,
  CATEGORIES,
  COURSES,
  SKILL_PATHS,
  MARQUEE_ITEMS,
  COMPANY_LOGOS,
  Reveal,
  StarRating,
  MarqueeStrip,
} from "./shared";

export default function Impact49Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePath, setActivePath] = useState("sp1");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const activePlan =
    SKILL_PATHS.find((p) => p.id === activePath) ?? SKILL_PATHS[0];

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory
      ? course.category === activeCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="text-[#1E1B4B]">
      {/* =====================================================================
          2. HERO — PARALLAX + BIG SEARCH BAR
          ===================================================================== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-16"
      >
        {/* Parallax background blobs */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#6366F1]/10 blur-[100px]" />
          <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#818CF8]/15 blur-[80px]" />
          <div className="absolute bottom-[-5%] left-[30%] w-[500px] h-[500px] rounded-full bg-[#10B981]/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366F110_1px,transparent_1px),linear-gradient(to_bottom,#6366F110_1px,transparent_1px)] bg-[size:40px_40px]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E0E7FF] shadow-sm mb-8">
              <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
              <span className="text-xs font-semibold text-[#6366F1]">
                +2 000 nouveaux cours cette année
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Apprenez ce que{" "}
              <span className="relative inline-block">
                <span className="text-[#6366F1]">vous voulez</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#6366F1]/30 rounded-full origin-left"
                />
              </span>
              <br />
              quand vous voulez.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-[#4B5563] mb-10 max-w-2xl mx-auto leading-relaxed">
              Plus de 3 200 cours conçus par des experts pour accélérer votre carrière,
              changer de métier ou maîtriser une nouvelle compétence.
            </p>
          </Reveal>

          {/* Search bar */}
          <Reveal delay={0.3}>
            <div className="max-w-xl mx-auto mb-16 relative">
              <div className="relative bg-white p-2 rounded-2xl border border-[#E0E7FF] shadow-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-[#9CA3AF] ml-3" />
                <input
                  type="text"
                  placeholder="Que voulez-vous apprendre aujourd'hui ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#1E1B4B] placeholder-[#9CA3AF] py-3.5 px-2"
                />
                <button className="px-6 py-3.5 rounded-xl bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#4F46E5] transition-colors whitespace-nowrap">
                  Rechercher
                </button>
              </div>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* =====================================================================
          3. MARQUEE STRIP
          ===================================================================== */}
      <section className="py-8 bg-white border-y border-[#E0E7FF] overflow-hidden">
        <MarqueeStrip items={MARQUEE_ITEMS} />
      </section>

      {/* =====================================================================
          4. CATEGORIES
          ===================================================================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
              Thématiques
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
              Explorez nos catégories phares
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 0.05}>
              <div
                onClick={() =>
                  setActiveCategory(activeCategory === cat.label ? null : cat.label)
                }
                style={{
                  borderColor: activeCategory === cat.label ? cat.color : "#E5E7EB",
                  backgroundColor:
                    activeCategory === cat.label
                      ? `${cat.color}08`
                      : "rgba(255,255,255,0.6)",
                }}
                className="p-6 rounded-2xl border bg-white/60 hover:bg-white transition-all cursor-pointer group shadow-sm flex flex-col justify-between aspect-[1.1/1]"
              >
                <div
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform"
                >
                  {cat.label[0]}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E1B4B] group-hover:text-[#6366F1] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {cat.count} formations
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =====================================================================
          5. COURSES LIST
          ===================================================================== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
                  Catalogue
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
                  Les cours les plus demandés
                </h2>
              </div>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="mt-4 md:mt-0 text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                >
                  Réinitialiser le filtre ({activeCategory})
                </button>
              )}
            </div>
          </Reveal>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-[#F9FAFB] rounded-3xl border border-[#F3F4F6]">
              <p className="text-lg font-medium text-[#4B5563]">
                Aucun cours ne correspond à vos critères.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredCourses.map((course, i) => (
                <Reveal key={course.id} delay={i * 0.1}>
                  <div className="bg-[#F9FAFB] rounded-3xl overflow-hidden border border-[#F3F4F6] group hover:border-[#6366F1]/20 hover:shadow-[0_10px_30px_rgba(99,102,241,0.04)] transition-all flex flex-col h-full">
                    {/* Course card image preview */}
                    <div className="aspect-[1.8/1] bg-[#EEF2FF] relative overflow-hidden flex items-center justify-center text-[#6366F1]/30">
                      <BookOpen className="w-12 h-12" />
                      {course.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-wider">
                          {course.badge}
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider block mb-3"
                          style={{ color: course.categoryColor }}
                        >
                          {course.category}
                        </span>
                        <h3 className="font-extrabold text-lg leading-snug mb-3 text-[#1E1B4B] group-hover:text-[#6366F1] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#6B7280] mb-4">
                          Par {course.instructor}
                        </p>
                        <div className="mb-6">
                          <StarRating rating={course.rating} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-[#4B5563] mb-6">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#818CF8]" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#818CF8]" />
                            {course.students} étudiants
                          </span>
                        </div>
                        <div className="border-t border-[#EEF2FF] pt-5 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1E1B4B]">
                              {course.price}
                            </span>
                            <span className="text-sm text-[#9CA3AF] line-through">
                              {course.originalPrice}
                            </span>
                          </div>
                          <Link
                            href="/templates/impact-49/contact"
                            className="px-4 py-2.5 rounded-xl bg-[#6366F1] text-white text-xs font-bold hover:bg-[#4F46E5] transition-colors"
                          >
                            Acheter
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          6. SKILL PATHS
          ===================================================================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <Reveal>
            <div className="sticky top-24">
              <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
                Parcours
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] mb-6">
                Parcours guidés de A à Z
              </h2>
              <p className="text-[#4B5563] leading-relaxed mb-8 font-medium">
                Ne vous perdez plus dans l'apprentissage. Suivez des parcours
                structurés par étape pour maîtriser un métier complet.
              </p>
              <div className="flex flex-col gap-3">
                {SKILL_PATHS.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setActivePath(path.id)}
                    style={{
                      backgroundColor: activePath === path.id ? "white" : "transparent",
                      borderColor: activePath === path.id ? "#E0E7FF" : "transparent",
                    }}
                    className="p-4 rounded-xl border flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#1E1B4B]">
                        {path.title}
                      </div>
                      <div className="text-xs text-[#6B7280]">{path.subtitle}</div>
                    </div>
                    <ChevronRight
                      style={{ color: path.color }}
                      className={`w-5 h-5 transition-transform ${
                        activePath === path.id ? "translate-x-1" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-2">
            <Reveal key={activePath}>
              <div className="p-12 rounded-[2.5rem] bg-white border border-[#E0E7FF] shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    style={{
                      backgroundColor: `${activePlan.color}15`,
                      color: activePlan.color,
                    }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                  >
                    {activePlan.title[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#1E1B4B]">
                      {activePlan.title}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      Niveau: {activePlan.level} · {activePlan.students} étudiants
                    </p>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-6">
                    Au programme de ce parcours
                  </h4>
                  <div className="relative border-l-2 border-[#E0E7FF] ml-3 pl-8 space-y-8">
                    {activePlan.steps.map((step, idx) => (
                      <div key={step} className="relative">
                        <div
                          style={{ backgroundColor: activePlan.color }}
                          className="absolute left-[-41px] top-0.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold text-white"
                        >
                          {idx + 1}
                        </div>
                        <h5 className="font-bold text-base text-[#1E1B4B] mb-1">
                          {step}
                        </h5>
                        <p className="text-xs text-[#6B7280]">
                          Projets pratiques et évaluations incluses.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#EEF2FF] pt-8 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">
                      Accès complet inclus dans l'abonnement
                    </div>
                    <div className="font-bold text-lg text-[#1E1B4B]">
                      À partir de 29€/mois
                    </div>
                  </div>
                  <Link
                    href="/templates/impact-49/pricing"
                    className="px-6 py-3.5 rounded-xl bg-[#10B981] text-white text-sm font-bold hover:bg-[#059669] transition-colors"
                  >
                    Démarrer le parcours
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. TESTIMONIALS (success stories)
          ===================================================================== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] mb-6">
                Ils ont changé de vie grâce à Skillbridge
              </h2>
            </div>
          </Reveal>

          {/* Testimonial slider / grid snippet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Maxime Dubois",
                before: "Caissier",
                after: "Développeur Frontend @ Deezer",
                salary: "+87% salaire",
                quote:
                  "En 9 mois avec le parcours Frontend de Skillbridge, j'ai décroché un poste que je n'aurais jamais cru possible. La qualité des cours est incomparable.",
                initials: "MD",
              },
              {
                name: "Camille Renard",
                before: "Assistante RH",
                after: "UX Designer @ SNCF Connect",
                salary: "+65% salaire",
                quote:
                  "J'avais peur que la reconversion soit trop longue. Avec Skillbridge, j'ai eu mon premier job en UX 6 mois après avoir commencé. Le parcours est structuré parfaitement.",
                initials: "CR",
              },
            ].map((testi, idx) => (
              <Reveal key={testi.name} delay={idx * 0.1}>
                <div className="p-10 rounded-[2.5rem] bg-[#F9FAFB] border border-[#F3F4F6] flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 text-[#6366F1] font-bold text-sm flex items-center justify-center">
                        {testi.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1E1B4B]">
                          {testi.name}
                        </h4>
                        <div className="text-xs text-[#6B7280]">
                          Avant : {testi.before} · Après : {testi.after}
                        </div>
                      </div>
                    </div>
                    <p className="text-base text-[#4B5563] italic leading-relaxed font-medium mb-6">
                      "{testi.quote}"
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] text-xs font-bold w-fit">
                    <TrendingUp className="w-4 h-4" />
                    {testi.salary}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. ENTERPRISE / TEAM TRAINING
          ===================================================================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="p-12 md:p-20 rounded-[3rem] bg-white border border-[#E0E7FF] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#6366F1]/5 blur-[80px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-4">
                  Pour les équipes
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] mb-6">
                  Formez votre équipe avec Skillbridge Business
                </h3>
                <p className="text-[#6B7280] leading-relaxed mb-8">
                  Offrez à vos collaborateurs l'accès illimité à notre catalogue pour
                  développer leurs compétences et réduire leur turnover.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/templates/impact-49/contact"
                    className="px-7 py-3.5 rounded-xl bg-[#1E1B4B] text-white text-sm font-semibold hover:bg-[#312E81] transition-colors"
                  >
                    Voir la démo
                  </Link>
                  <Link
                    href="/templates/impact-49/contact"
                    className="px-7 py-3.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#1E1B4B] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"
                  >
                    Contacter les ventes
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      value: "200+",
                      label: "Entreprises clientes",
                      color: "#6366F1",
                    },
                    { value: "89%", label: "Taux de rétention", color: "#10B981" },
                    { value: "4.2×", label: "ROI moyen", color: "#F59E0B" },
                    { value: "-34%", label: "Turnover constaté", color: "#EF4444" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] text-center"
                    >
                      <div
                        className="text-2xl font-extrabold mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-[#6B7280]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4 text-center">
                    Ils nous font confiance
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {COMPANY_LOGOS.slice(0, 4).map((logo) => (
                      <div
                        key={logo}
                        className="aspect-[2/1] bg-[#F9FAFB] rounded-xl flex items-center justify-center border border-[#F3F4F6]"
                      >
                        <span className="text-xs font-bold text-[#9CA3AF]">
                          {logo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
