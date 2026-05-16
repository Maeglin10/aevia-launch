"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Droplets,
  Wind,
  Sun,
  CheckCircle,
} from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("aura-fonts")) return;
    const style = document.createElement("style");
    style.id = "aura-fonts";
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const rituals = [
  {
    id: "restore",
    label: "Restore",
    icon: <Droplets className="w-5 h-5" />,
    title: "Deep Restore Ritual",
    duration: "3h",
    price: "380€",
    description: "A full-body immersion in botanical hydration. Seaweed wrap, hot stone massage, and a signature facial tailored to your skin's needs.",
    steps: ["Botanical foot bath", "Seaweed body wrap (60 min)", "Hot stone full-body (75 min)", "Signature hydra facial (45 min)"],
    tag: "Bestseller",
  },
  {
    id: "rebalance",
    label: "Rebalance",
    icon: <Wind className="w-5 h-5" />,
    title: "Inner Harmony Journey",
    duration: "2h",
    price: "260€",
    description: "Restore equilibrium through breath, movement, and mindful touch. Combines pranayama, craniosacral therapy, and forest oil diffusion.",
    steps: ["Guided pranayama (20 min)", "Craniosacral session (60 min)", "Chakra oil diffusion (20 min)", "Herbal tea ceremony (20 min)"],
    tag: "New",
  },
  {
    id: "renew",
    label: "Renew",
    icon: <Sun className="w-5 h-5" />,
    title: "Radiance Renewal",
    duration: "2h30",
    price: "310€",
    description: "Luminous skin from within. A brightening enzyme peel, vitamin C infusion, and lymphatic drainage massage for a lit-from-within glow.",
    steps: ["Enzyme peel exfoliation (30 min)", "Vitamin C infusion (45 min)", "Lymphatic drainage (45 min)", "Gua sha sculpting (30 min)"],
    tag: "Popular",
  },
  {
    id: "cocoon",
    label: "Cocoon",
    icon: <Heart className="w-5 h-5" />,
    title: "Cocoon Escape",
    duration: "4h",
    price: "490€",
    description: "Our most indulgent offering. Full-day sanctuary access, private pool suite, four-hand massage, and a curated botanical lunch.",
    steps: ["Private pool & sauna (90 min)", "Four-hand synchronised massage (75 min)", "Gold leaf facial (60 min)", "Botanical wellness lunch"],
    tag: "Signature",
  },
];

const amenities = [
  { icon: <Droplets className="w-6 h-6" />, label: "Thermal Pools", desc: "Three mineral pools at 32°, 37° and 40°" },
  { icon: <Wind className="w-6 h-6" />, label: "Steam Grotto", desc: "Himalayan salt-infused steam room" },
  { icon: <Leaf className="w-6 h-6" />, label: "Botanical Garden", desc: "Private herb garden & quiet meadow" },
  { icon: <Sun className="w-6 h-6" />, label: "Infrared Sauna", desc: "Full-spectrum therapeutic heat" },
  { icon: <Sparkles className="w-6 h-6" />, label: "Ice Fountain", desc: "Invigorating contrast therapy" },
  { icon: <Heart className="w-6 h-6" />, label: "Meditation Loft", desc: "Soundproofed Tibetan singing bowls" },
];

const testimonials = [
  {
    name: "Isabelle M.",
    role: "Photographe",
    text: "J'arrive chez Aura dans un état de tension extrême et je repars comme une nouvelle personne. Chaque détail — les huiles, la lumière, le silence — est pensé pour vous libérer.",
    rating: 5,
    ritual: "Deep Restore Ritual",
  },
  {
    name: "Thomas L.",
    role: "Directeur artistique",
    text: "Le rituel Cocoon Escape est dans une autre dimension. Le massage à quatre mains est une expérience quasi mystique. Je réserve chaque trimestre.",
    rating: 5,
    ritual: "Cocoon Escape",
  },
  {
    name: "Camille R.",
    role: "Médecin",
    text: "Rare de trouver un spa qui allie rigueur scientifique et véritable savoir-faire sensoriel. Les soins sont efficaces, les thérapeutes exceptionnels.",
    rating: 5,
    ritual: "Radiance Renewal",
  },
];

const botanicals = [
  { name: "Centella Asiatica", origin: "Sri Lanka", benefit: "Régénération cellulaire", icon: "🌿" },
  { name: "Huile de Marula", origin: "Afrique du Sud", benefit: "Hydratation profonde", icon: "🌰" },
  { name: "Extrait de Lotus Bleu", origin: "Inde", benefit: "Apaisement & éclat", icon: "🪷" },
  { name: "Romarin Côtier", origin: "Méditerranée", benefit: "Circulation & détox", icon: "🌱" },
];

const team = [
  { name: "Amélie Fontaine", role: "Directrice Wellness", years: 14, specialty: "Massage Ayurvédique" },
  { name: "Nour El-Kadi", role: "Experte Soin Visage", years: 9, specialty: "Peeling & Gua Sha" },
  { name: "Pierre Lecomte", role: "Thérapeute Holistique", years: 11, specialty: "Craniosacral & Breath" },
];

export default function AuraWellnessPage() {
  useFonts();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRitual, setActiveRitual] = useState("restore");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const amenitiesRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const { scrollYProgress: amenitiesScroll } = useScroll({ target: amenitiesRef, offset: ["start end", "end start"] });
  const amenitiesX = useTransform(amenitiesScroll, [0, 1], ["0%", "-8%"]);

  const currentRitual = rituals.find((r) => r.id === activeRitual)!;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F3EE]" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#7C9E87] origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F6F3EE]/90 backdrop-blur-md border border-[#D8D0C4] rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#7C9E87]" />
            <span className="text-[#2C2820] tracking-widest text-sm uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              Aura Wellness
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[#2C2820]/70 text-sm tracking-wide">
            {["Rituels", "Espace", "L'équipe", "Botanique", "Réserver"].map((item) => (
              <Link key={item} href="#" className="hover:text-[#7C9E87] transition-colors duration-200 cursor-pointer">
                {item}
              </Link>
            ))}
          </div>
          <button
            className="hidden md:inline-flex items-center gap-2 bg-[#7C9E87] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer"
          >
            Réserver
          </button>
          <button
            className="md:hidden text-[#2C2820] cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#F6F3EE] flex flex-col p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#2C2820] tracking-widest text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Aura Wellness
              </span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer">
                <X className="w-6 h-6 text-[#2C2820]" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {["Rituels", "Espace", "L'équipe", "Botanique", "Réserver"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href="#"
                    className="text-[#2C2820] text-3xl cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=85"
            alt="Aura Wellness sanctuary"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C2820]/40 via-transparent to-[#F6F3EE]/60" />
        </motion.div>
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white text-xs tracking-widest uppercase mb-8">
              <Leaf className="w-3 h-3" />
              Sanctuary — Bordeaux
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="text-white text-6xl md:text-8xl leading-none mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              Retrouver<br />
              <em>l'essentiel</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/80 text-lg max-w-lg mb-10 leading-relaxed">
              Un sanctuaire de soins botaniques et de rituels ancestraux pour celles et ceux qui cherchent à s'ancrer, se restaurer, s'éveiller.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer">
                Découvrir les rituels
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                Visiter l'espace
              </button>
            </div>
          </Reveal>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="w-px h-12 bg-white/50 mx-auto"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </section>

      {/* Intro Statement */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <Reveal>
          <p
            className="text-[#2C2820] text-3xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            "Le soin n'est pas un luxe.<br />C'est <em>un acte de retour à soi.</em>"
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[#6B5E52] text-base max-w-2xl mx-auto leading-relaxed">
            Fondé en 2014, Aura Wellness propose des soins conçus à partir d'ingrédients botaniques traçables, administrés par des thérapeutes formés aux traditions ayurvédiques, taoïstes et méditerranéennes.
          </p>
        </Reveal>
      </section>

      {/* Rituals */}
      <section className="py-20 px-6 bg-[#EDE9E2]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Soins & Rituels</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Choisissez votre voyage
              </h2>
            </div>
          </Reveal>
          <div className="flex gap-3 mb-10 flex-wrap">
            {rituals.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRitual(r.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
                  activeRitual === r.id
                    ? "bg-[#7C9E87] text-white border-[#7C9E87]"
                    : "bg-white text-[#2C2820]/70 border-[#D8D0C4] hover:border-[#7C9E87] hover:text-[#7C9E87]"
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRitual}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-[#D8D0C4]"
            >
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs bg-[#7C9E87]/10 text-[#7C9E87] px-3 py-1 rounded-full border border-[#7C9E87]/20">
                    {currentRitual.tag}
                  </span>
                  <span className="text-[#6B5E52] text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {currentRitual.duration}
                  </span>
                </div>
                <h3
                  className="text-[#2C2820] text-3xl mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  {currentRitual.title}
                </h3>
                <p className="text-[#6B5E52] leading-relaxed mb-8 text-sm">
                  {currentRitual.description}
                </p>
                <div className="space-y-3 mb-8">
                  {currentRitual.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#2C2820]/80">
                      <CheckCircle className="w-4 h-4 text-[#7C9E87] shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[#2C2820] text-4xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {currentRitual.price}
                  </span>
                  <button className="flex items-center gap-2 bg-[#2C2820] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#3D3830] transition-colors duration-200 cursor-pointer">
                    Réserver <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative min-h-[320px]">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
                  alt={currentRitual.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Amenities */}
      <section ref={amenitiesRef} className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">L'Espace</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Un sanctuaire complet
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 border border-[#D8D0C4] hover:border-[#7C9E87] transition-colors duration-200 group cursor-pointer">
                  <div className="w-10 h-10 bg-[#7C9E87]/10 rounded-xl flex items-center justify-center text-[#7C9E87] mb-4 group-hover:bg-[#7C9E87] group-hover:text-white transition-colors duration-200">
                    {a.icon}
                  </div>
                  <h3 className="text-[#2C2820] font-medium text-sm mb-1">{a.label}</h3>
                  <p className="text-[#6B5E52] text-xs leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <motion.div
          className="max-w-6xl mx-auto mt-10 rounded-3xl overflow-hidden relative h-64 md:h-96"
          style={{ x: amenitiesX }}
        >
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"
            alt="Aura Wellness thermal pools"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2820]/30 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-xs tracking-widest uppercase mb-1">Bordeaux, France</p>
            <p
              className="text-white text-2xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              2 000 m² d'espace dédié
            </p>
          </div>
        </motion.div>
      </section>

      {/* Botanicals */}
      <section className="py-24 px-6 bg-[#2C2820]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Formules Botaniques</p>
              <h2
                className="text-white text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Des actifs d'exception
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {botanicals.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                  <div className="text-3xl mb-4">{b.icon}</div>
                  <h3
                    className="text-white text-lg mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {b.name}
                  </h3>
                  <p className="text-[#7C9E87] text-xs mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.origin}
                  </p>
                  <p className="text-white/60 text-sm">{b.benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
              <Leaf className="w-8 h-8 text-[#7C9E87] shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Traçabilité 100% garantie</p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Chaque ingrédient utilisé chez Aura est sourcé directement auprès d'exploitations certifiées biologiques et équitables. Nos formules sont testées dermatologiquement et ne contiennent aucun perturbateur endocrinien.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-[#EDE9E2]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Notre Équipe</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Des thérapeutes d'exception
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D0C4] group cursor-pointer">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${["1559599101-f09722fb4948", "1573496359142-b8d87734a5a2", "1507003211169-0a1dd7228f2d"][i]}?w=600&q=80`}
                      alt={t.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-[#2C2820] text-xl mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {t.name}
                    </h3>
                    <p className="text-[#7C9E87] text-xs tracking-wide uppercase mb-3">{t.role}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6B5E52]">
                      <span>{t.years} ans d'expérience</span>
                      <span className="text-[#D8D0C4]">·</span>
                      <span>{t.specialty}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#7C9E87]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-12">Témoignages</p>
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-white" />
                ))}
              </div>
              <p
                className="text-white text-2xl md:text-3xl leading-relaxed mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              >
                "{testimonials[activeTestimonial].text}"
              </p>
              <p className="text-white font-medium text-sm">{testimonials[activeTestimonial].name}</p>
              <p className="text-white/60 text-xs mt-1">{testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].ritual}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeTestimonial ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#2C2820] rounded-3xl p-10 md:p-16 text-center">
              <Leaf className="w-8 h-8 text-[#7C9E87] mx-auto mb-6" />
              <h2
                className="text-white text-4xl md:text-5xl mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Votre rituel vous attend
              </h2>
              <p className="text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
                Réservez en ligne en quelques secondes. Nos conseillers sont disponibles pour vous guider vers le rituel qui vous correspond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer">
                  Réserver en ligne
                </button>
                <button className="border border-white/20 text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> +33 5 56 00 00 00
                </button>
              </div>
              <p className="text-white/30 text-xs mt-8">Annulation gratuite jusqu'à 48h avant votre réservation</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EDE9E2] border-t border-[#D8D0C4] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4 text-[#7C9E87]" />
              <span
                className="text-[#2C2820] text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Aura Wellness
              </span>
            </div>
            <p className="text-[#6B5E52] text-sm leading-relaxed mb-4">
              Sanctuary de soins botaniques & rituels holistiques. Bordeaux, France.
            </p>
            <div className="space-y-1 text-xs text-[#6B5E52]">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> 12 Allée des Jardins, 33000 Bordeaux</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> +33 5 56 00 00 00</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> contact@aurawellness.fr</div>
            </div>
          </div>
          {[
            { title: "Rituels", links: ["Deep Restore", "Inner Harmony", "Radiance Renewal", "Cocoon Escape", "Soins sur mesure"] },
            { title: "L'Espace", links: ["Pools thermales", "Steam Grotto", "Sauna infrarouge", "Jardin botanique", "Loft méditation"] },
            { title: "Informations", links: ["Réserver", "Cadeaux & bons", "Abonnements", "Groupes & séminaires", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[#2C2820] text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-[#6B5E52] text-sm hover:text-[#7C9E87] transition-colors duration-200 cursor-pointer">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#D8D0C4] mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B5E52]">
          <span>© 2026 Aura Wellness. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#7C9E87] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="#" className="hover:text-[#7C9E87] transition-colors cursor-pointer">Politique de confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
