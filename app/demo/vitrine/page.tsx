"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Tag,
  ArrowRight,
} from "lucide-react";

// ─── Theme tokens (Antigravity-ready: change vars here to re-skin entirely) ──
const CSS_VARS = `
  :root {
    --brand-primary: #2563eb;
    --brand-secondary: #7c3aed;
    --brand-gradient: linear-gradient(135deg, #2563eb, #7c3aed);
    --bg-primary: #080810;
    --text-primary: #ffffff;
    --text-muted: #71717a;
  }
`;

// ─── Animation presets ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const services = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Comptabilité",
    description:
      "Tenue comptable, bilan annuel, comptes de résultat. Nous gérons vos obligations avec précision et ponctualité.",
    features: ["Tenue de comptabilité", "Bilan annuel", "Déclarations TVA"],
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(37,99,235,0.15)",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Fiscalité",
    description:
      "Optimisation fiscale, déclarations IR/IS, contrôle fiscal. Nous défendons vos intérêts face à l'administration.",
    features: [
      "Déclarations fiscales",
      "Optimisation IR/IS",
      "Assistance contrôle fiscal",
    ],
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Conseil de gestion",
    description:
      "Pilotage de performance, tableaux de bord, prévisions financières. Nous éclairons vos décisions stratégiques.",
    features: ["Tableaux de bord", "Budget prévisionnel", "Analyse financière"],
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "rgba(124,58,237,0.15)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Social & Paie",
    description:
      "Gestion de la paie, contrats de travail, conseil RH. Vos obligations sociales entre de bonnes mains.",
    features: ["Bulletins de paie", "Déclarations sociales", "Conseil RH"],
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
];

const stats = [
  { value: 20, suffix: "+", label: "Années d'expérience", icon: <Award className="w-5 h-5" /> },
  { value: 350, suffix: "+", label: "Clients accompagnés", icon: <Users className="w-5 h-5" /> },
  { value: 98, suffix: "%", label: "Taux de satisfaction", icon: <CheckCircle2 className="w-5 h-5" /> },
  { value: 12, suffix: "", label: "Experts dédiés", icon: <BookOpen className="w-5 h-5" /> },
];

const team = [
  {
    name: "Sophie Marchand",
    role: "Expert-Comptable associée",
    bio: "20 ans d'expérience en audit et conseil aux PME.",
  },
  {
    name: "Thomas Renard",
    role: "Directeur fiscal",
    bio: "Spécialiste en optimisation IR/IS et restructuration.",
  },
  {
    name: "Isabelle Vidal",
    role: "Responsable paie & social",
    bio: "Experte en droit social et gestion des ressources humaines.",
  },
  {
    name: "Julien Fabre",
    role: "Chargé de mission gestion",
    bio: "Passionné par la data finance et les tableaux de bord.",
  },
];

const testimonials = [
  {
    quote:
      "Lumière Conseil m'a permis de passer de 0 à 800K€ de CA en 3 ans en me déchargeant de toute la gestion administrative. Une équipe exceptionnelle.",
    name: "Marie S.",
    role: "Fondatrice, Studio Atelier (Lyon)",
    initials: "MS",
  },
  {
    quote:
      "Réactivité, disponibilité et expertise — trois mots qui résument parfaitement l'équipe. Je recommande sans hésitation à tous les entrepreneurs.",
    name: "Pierre D.",
    role: "CEO, TechCraft SAS (Paris)",
    initials: "PD",
  },
  {
    quote:
      "Depuis que Lumière Conseil gère notre comptabilité, j'ai récupéré 10h par semaine pour me concentrer sur ce que j'aime vraiment : mon métier.",
    name: "Laure B.",
    role: "Directrice, Cabinet Thérapie Pro (Bordeaux)",
    initials: "LB",
  },
];

const faqs = [
  {
    question: "Comment se déroule le premier rendez-vous ?",
    answer:
      "Le premier entretien est gratuit et sans engagement. Nous prenons le temps de comprendre votre activité, vos besoins et vos objectifs. À l'issue de ce rendez-vous, nous vous remettons une proposition tarifaire personnalisée sous 48h.",
  },
  {
    question: "Quels types d'entreprises accompagnez-vous ?",
    answer:
      "Nous accompagnons des structures de toutes tailles : artisans, professions libérales, TPE, PME et ETI. Nos clients opèrent dans des secteurs variés — commerce, services, tech, BTP, santé — ce qui nous permet d'apporter une expertise sectorielle réelle.",
  },
  {
    question: "Comment accéder à mes documents comptables ?",
    answer:
      "Tous vos documents sont disponibles 24h/24 sur notre portail client sécurisé. Bilans, liasses fiscales, bulletins de paie, déclarations TVA — tout est classé, horodaté et accessible depuis votre ordinateur ou mobile.",
  },
  {
    question: "Quels sont vos délais de réponse ?",
    answer:
      "Nous nous engageons à répondre à toute demande sous 24h ouvrées. En cas d'urgence (contrôle fiscal, délai impératif), un interlocuteur est joignable directement par téléphone.",
  },
  {
    question: "Proposez-vous des missions ponctuelles ?",
    answer:
      "Oui. En plus de nos missions récurrentes, nous intervenons ponctuellement pour des opérations spécifiques : création d'entreprise, cession, levée de fonds, restructuration, audit d'acquisition ou conseil de gestion ad hoc.",
  },
  {
    question: "Comment sont fixés vos honoraires ?",
    answer:
      "Nos honoraires sont forfaitaires, fixés en amont et révisés annuellement. Aucune surprise en cours de mission. Nous facturons au temps passé uniquement pour les missions ponctuelles, avec devis préalable systématique.",
  },
];

const blogPosts = [
  {
    category: "Fiscalité",
    date: "14 avril 2025",
    title: "Loi de finances 2025 : ce qui change pour les TPE",
    excerpt:
      "Nouveau barème IS, réforme de la cotisation foncière, crédit d'impôt innovation — découvrez les impacts concrets pour votre entreprise.",
    categoryColor: "bg-blue-500/15 text-blue-300 ring-blue-500/20",
  },
  {
    category: "Gestion",
    date: "2 mars 2025",
    title: "5 indicateurs financiers que tout dirigeant doit suivre",
    excerpt:
      "Trésorerie prévisionnelle, BFR, EBE… Voici les tableaux de bord indispensables pour piloter votre entreprise avec sérénité.",
    categoryColor: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  },
  {
    category: "Social",
    date: "18 février 2025",
    title: "Télétravail : obligations de l'employeur en 2025",
    excerpt:
      "Accord collectif, prise en charge des frais, accidents du travail à domicile — le point complet sur vos responsabilités employeur.",
    categoryColor: "bg-violet-500/15 text-violet-300 ring-violet-500/20",
  },
];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Le cabinet", href: "#about" },
  { label: "Notre équipe", href: "#equipe" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "FAQ", href: "#faq" },
  { label: "Actualités", href: "#actualites" },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

// ─── Stat card with animated counter ─────────────────────────────────────────
function StatCard({ stat }: { stat: (typeof stats)[0]; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(stat.value, 1500, isInView);
  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="text-center"
    >
      <div className="inline-flex p-2 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-3">
        {stat.icon}
      </div>
      <p className="text-4xl font-extrabold text-white mb-1 tabular-nums">
        {count}
        {stat.suffix}
      </p>
      <p className="text-sm text-zinc-500">{stat.label}</p>
    </motion.div>
  );
}

// ─── 3D tilt service card ─────────────────────────────────────────────────────
function ServiceCard({
  service,
}: {
  service: (typeof services)[0];
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: -dy * 8, y: dx * 8 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`rounded-2xl border ${service.border} ${service.bg} p-6 cursor-pointer`}
    >
      <div className={`${service.accent} mb-4`}>{service.icon}</div>
      <h3 className="text-lg font-bold mb-2 text-white">{service.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
        {service.description}
      </p>
      <div className="space-y-1.5">
        {service.features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${service.accent}`} />
            {f}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── FAQ Accordion item ────────────────────────────────────────────────────────
function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="border border-white/8 rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Testimonials carousel ────────────────────────────────────────────────────
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/40 p-8 md:p-10 min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              {/* [ZONE_IMAGE: TESTIMONIAL_AVATAR — 48x48px circular portrait] */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                <div className="text-center">
                  <p className="text-xs font-bold text-zinc-400">
                    {testimonials[current].initials}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {testimonials[current].name}
                </p>
                <p className="text-xs text-zinc-500">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-5">
        <button
          onClick={prev}
          className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          aria-label="Témoignage précédent"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current
                  ? "w-6 h-2 bg-[var(--brand-primary)]"
                  : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`Témoignage ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          aria-label="Témoignage suivant"
        >
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}

// ─── Mobile menu ───────────────────────────────────────────────────────────────
function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0c0c18] border-l border-white/8 flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-gradient)" }}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-bold text-white">Lumière Conseil</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <motion.nav
              className="flex flex-col gap-1"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="px-4 py-3 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>

            <div className="mt-auto pt-6 border-t border-white/8">
              <a
                href="#contact"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "var(--brand-gradient)" }}
              >
                <Phone className="w-3.5 h-3.5" />
                Prendre RDV
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hero word reveal ─────────────────────────────────────────────────────────
const heroWords = ["Votre", "expert", "comptable", "de", "confiance"];

function HeroTitle() {
  return (
    <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
      {heroWords.map((word, i) => {
        const isGradient = word === "comptable";
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 + i * 0.09,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block mr-[0.28em] ${
              isGradient
                ? "text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]"
                : "text-white"
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}

// ─── Parallax blob ─────────────────────────────────────────────────────────────
function ParallaxBlobs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3000], [0, -300 * 0.3]);
  const y2 = useTransform(scrollY, [0, 3000], [0, 300 * 0.3]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* [ZONE_THEME: blob 1 color — matches --brand-primary at 7% opacity] */}
      <motion.div
        style={{ y: y1, background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
        className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full blur-[150px]"
      />
      {/* [ZONE_THEME: blob 2 color — matches --brand-secondary at 7% opacity] */}
      <motion.div
        style={{ y: y2, background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
        className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
      />
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────
export default function VitrineDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Scroll-active nav
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Visual validation layer: required fields get a red border + helper text.
  const validateContact = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Le nom complet est requis";
    if (!formData.email.trim()) errs.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = "Email invalide";
    if (!formData.subject) errs.subject = "Veuillez choisir un sujet";
    if (!formData.message.trim()) errs.message = "Le message est requis";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setFormErrors({});
  };

  return (
    <>
      {/* Inject CSS custom properties */}
      <style>{CSS_VARS}</style>

      <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
        <ParallaxBlobs />

        {/* ── Mobile menu overlay ───────────────────────────────────────── */}
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/6 backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)" }}>
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--brand-gradient)" }}
              >
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Lumière Conseil</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Expertise comptable</p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    activeSection === link.href.replace("#", "")
                      ? "text-white font-medium"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "var(--brand-gradient)" }}
              >
                <Phone className="w-3.5 h-3.5" />
                Prendre RDV
              </a>
              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section id="about" className="relative pt-20 pb-24 px-6 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-6"
                  style={{ background: "rgba(37,99,235,0.1)", color: "#93c5fd" }}
                >
                  <Award className="w-3 h-3" />
                  Cabinet Expert-Comptable certifié OEC
                </motion.div>

                <HeroTitle />

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg"
                >
                  Depuis 20 ans, Lumière Conseil accompagne les PME, artisans et professions libérales dans leur développement. Comptabilité, fiscalité, conseil de gestion — nous gérons tout pour que vous vous concentriez sur votre métier.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                    style={{ background: "var(--brand-gradient)", boxShadow: "0 8px 30px rgba(37,99,235,0.25)" }}
                  >
                    Prendre rendez-vous
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-zinc-700 text-zinc-300 font-semibold hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    Nos services
                  </a>
                </motion.div>
              </div>

              {/* Right — Hero image zone */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="hidden lg:block"
              >
                {/* [ZONE_IMAGE: HERO_PHOTO — 600x500px, person at desk in modern office, warm lighting] */}
                <div className="relative h-[380px] rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/8 flex items-center justify-center">
                  <div className="text-center text-zinc-600">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs opacity-60">Photo principale — 600×500px</p>
                    <p className="text-xs opacity-40 mt-1">Personne au bureau, bureau moderne</p>
                  </div>
                  {/* Decorative overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/60 via-transparent to-transparent pointer-events-none" />
                  {/* Floating dashboard card */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-4 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-zinc-300">Tableau de bord client</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
                        En direct
                      </span>
                    </div>
                    {[
                      { label: "CA YTD", value: "284 700 €", badge: "+12.4%", color: "text-emerald-400" },
                      { label: "Résultat net", value: "47 200 €", badge: "+8.1%", color: "text-emerald-400" },
                      { label: "TVA à déclarer", value: "3 850 €", badge: "Éch. 15/04", color: "text-amber-400" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between border-t border-white/5 pt-2">
                        <p className="text-xs text-zinc-500">{row.label}</p>
                        <div className="text-right">
                          <p className="text-xs font-bold text-white">{row.value}</p>
                          <p className={`text-[10px] ${row.color}`}>{row.badge}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-y border-white/5">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section id="services" className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(124,58,237,0.1)", color: "#c4b5fd" }}>
                Nos services
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Un accompagnement complet
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                Nous prenons en charge toutes vos obligations pour vous permettre
                de vous concentrer sur votre activité.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {services.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Why us ───────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-zinc-900/20">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7" }}>
                  Pourquoi nous choisir
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-5">
                  La confiance, ça se construit sur la durée
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Depuis 2005, nous avons accompagné des centaines d&apos;entrepreneurs à
                  chaque étape de leur développement. Notre approche : être un
                  partenaire, pas juste un prestataire.
                </p>
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {[
                    "Interlocuteur unique dédié à votre dossier",
                    "Réponse garantie sous 24h ouvrées",
                    "Accès permanent à vos documents en ligne",
                    "Conseil proactif tout au long de l'année",
                    "Tarifs transparents, sans surprise",
                  ].map((point) => (
                    <motion.div
                      key={point}
                      variants={staggerItem}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-zinc-300 text-sm">{point}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Testimonial snippet (single card, right side) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-white/8 bg-zinc-900/40 p-8"
              >
                <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-widest">
                  Témoignage client
                </p>
                <blockquote className="text-xl font-medium text-white leading-relaxed mb-6">
                  &ldquo;Lumière Conseil m&apos;a permis de passer de 0 à 800K€ de CA en 3
                  ans en me déchargeant de toute la gestion administrative. Une
                  équipe exceptionnelle.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  {/* [ZONE_IMAGE: TESTIMONIAL_AVATAR_FEATURED — 48x48px circular portrait, warm] */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    MS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Marie S.</p>
                    <p className="text-xs text-zinc-500">Fondatrice, Studio Atelier (Lyon)</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section id="equipe" className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(37,99,235,0.1)", color: "#93c5fd" }}>
                Notre équipe
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Des experts à votre service
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                Une équipe pluridisciplinaire unie autour d&apos;une seule mission : votre réussite.
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={staggerItem}
                  className="rounded-2xl border border-white/8 bg-zinc-900/40 p-6 text-center hover:border-white/15 transition-colors"
                >
                  {/* [ZONE_IMAGE: TEAM_PHOTO — 200x200px portrait, professional headshot, neutral background] */}
                  <div className="relative h-28 w-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-zinc-800/70 border border-white/8 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 text-zinc-600 opacity-50" />
                      <p className="text-[10px] text-zinc-600 opacity-60">Photo</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5">{member.name}</p>
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--brand-primary)" }}>
                    {member.role}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Testimonials carousel ─────────────────────────────────────── */}
        <section id="temoignages" className="py-20 px-6 bg-zinc-900/20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(245,158,11,0.1)", color: "#fcd34d" }}>
                Témoignages
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Ce que disent nos clients
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                98% de nos clients nous recommandent. Voici pourquoi.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <TestimonialsCarousel />
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 px-6">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(124,58,237,0.1)", color: "#c4b5fd" }}>
                FAQ
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Questions fréquentes
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                Tout ce que vous devez savoir avant de nous contacter.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {faqs.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Blog / Actualités ─────────────────────────────────────────── */}
        <section id="actualites" className="py-20 px-6 bg-zinc-900/20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="flex items-end justify-between mb-12 gap-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7" }}>
                  Actualités
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">
                  Nos derniers articles
                </h2>
                <p className="text-zinc-400 text-lg">
                  Veille fiscale, conseils de gestion, actualités sociales.
                </p>
              </div>
              <a
                href="#"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold shrink-0"
                style={{ color: "var(--brand-primary)" }}
              >
                Tous les articles
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {blogPosts.map((post) => (
                <motion.article
                  key={post.title}
                  variants={staggerItem}
                  className="rounded-2xl border border-white/8 bg-zinc-900/40 overflow-hidden hover:border-white/15 transition-colors group cursor-pointer"
                >
                  {/* [ZONE_IMAGE: BLOG_COVER — 600x340px, editorial illustration or photo matching article theme] */}
                  <div className="relative h-44 bg-zinc-800/50 border-b border-white/6 flex items-center justify-center">
                    <div className="text-center text-zinc-600">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                      <p className="text-xs opacity-50">Cover — 600×340px</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent" />
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ring-1 ${post.categoryColor}`}>
                        <Tag className="w-2.5 h-2.5" />
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-zinc-200 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Lire la suite
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section id="contact" className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 text-xs font-semibold mb-5" style={{ background: "rgba(37,99,235,0.1)", color: "#93c5fd" }}>
                Contact
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Prenez rendez-vous
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                Premier entretien gratuit et sans engagement. Répondons ensemble à
                vos questions.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact info */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
                className="space-y-5"
              >
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                  Nos coordonnées
                </p>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Phone className="w-4 h-4" />,
                      primary: "04 72 00 00 00",
                      secondary: "Lun–Ven, 9h–18h",
                    },
                    {
                      icon: <Mail className="w-4 h-4" />,
                      primary: "contact@lumiere-conseil.fr",
                      secondary: "Réponse sous 24h",
                    },
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      primary: "12 rue de la République",
                      secondary: "69001 Lyon, France",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span style={{ color: "var(--brand-primary)" }} className="mt-0.5 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-sm text-white font-medium">{item.primary}</p>
                        <p className="text-xs text-zinc-500">{item.secondary}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/8 space-y-2">
                  <p className="text-xs text-zinc-500">Premier RDV gratuit · Sans engagement</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-zinc-400">Réponse garantie sous 24h</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-zinc-400">Données protégées · Conformité RGPD</p>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={2}
                className="lg:col-span-2"
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="h-full rounded-2xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center p-8 text-center min-h-[360px]"
                    >
                      <div>
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <p className="text-white font-bold text-lg mb-1">Message envoyé !</p>
                        <p className="text-zinc-400 text-sm">
                          Nous vous répondrons sous 24h ouvrées.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="rounded-2xl border border-white/8 bg-zinc-900/50 p-6 space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-base font-medium text-zinc-400 mb-1.5 block">
                            Nom complet <span className="text-red-400" aria-hidden="true">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Marie Dupont"
                            className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border text-white text-base placeholder:text-zinc-600 focus:outline-none transition-colors ${
                              formErrors.name
                                ? "border-red-500 focus:border-red-500"
                                : "border-white/8 focus:border-blue-500/50"
                            }`}
                          />
                          {formErrors.name && (
                            <p className="text-red-400 text-base mt-1.5" role="alert">{formErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-base font-medium text-zinc-400 mb-1.5 block">
                            Email <span className="text-red-400" aria-hidden="true">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="marie@entreprise.fr"
                            className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border text-white text-base placeholder:text-zinc-600 focus:outline-none transition-colors ${
                              formErrors.email
                                ? "border-red-500 focus:border-red-500"
                                : "border-white/8 focus:border-blue-500/50"
                            }`}
                          />
                          {formErrors.email && (
                            <p className="text-red-400 text-base mt-1.5" role="alert">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-base font-medium text-zinc-400 mb-1.5 block">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="06 00 00 00 00"
                            className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-white/8 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-base font-medium text-zinc-400 mb-1.5 block">
                            Sujet <span className="text-red-400" aria-hidden="true">*</span>
                          </label>
                          <select
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border text-white text-base focus:outline-none transition-colors appearance-none ${
                              formErrors.subject
                                ? "border-red-500 focus:border-red-500"
                                : "border-white/8 focus:border-blue-500/50"
                            }`}
                          >
                            <option value="" className="bg-zinc-900">Choisir...</option>
                            <option value="compta" className="bg-zinc-900">Comptabilité</option>
                            <option value="fiscal" className="bg-zinc-900">Fiscalité</option>
                            <option value="conseil" className="bg-zinc-900">Conseil de gestion</option>
                            <option value="social" className="bg-zinc-900">Social & Paie</option>
                            <option value="autre" className="bg-zinc-900">Autre</option>
                          </select>
                          {formErrors.subject && (
                            <p className="text-red-400 text-base mt-1.5" role="alert">{formErrors.subject}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-base font-medium text-zinc-400 mb-1.5 block">
                          Message <span className="text-red-400" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          placeholder="Décrivez votre situation et vos besoins..."
                          className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border text-white text-base placeholder:text-zinc-600 focus:outline-none transition-colors resize-none ${
                            formErrors.message
                              ? "border-red-500 focus:border-red-500"
                              : "border-white/8 focus:border-blue-500/50"
                          }`}
                        />
                        {formErrors.message && (
                          <p className="text-red-400 text-base mt-1.5" role="alert">{formErrors.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                        style={{ background: "var(--brand-gradient)", boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}
                      >
                        Envoyer ma demande
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <p className="text-center text-xs text-zinc-600">
                        Données protégées · Conformité RGPD
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid sm:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Lumière Conseil</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">
                    Expert-Comptable inscrit à l&apos;OEC
                  </p>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                    12 rue de la République<br />
                    69001 Lyon, France
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="sm:text-center">
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Navigation</p>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <a href={link.href} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div className="sm:text-right">
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Légal</p>
                <div className="space-y-2">
                  {["Politique de confidentialité", "Mentions légales", "CGU"].map((link) => (
                    <div key={link}>
                      <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-zinc-700">© 2025 Lumière Conseil — Tous droits réservés</p>
              <p className="text-xs text-zinc-700">
                Propulsé par{" "}
                <span className="text-zinc-500 font-medium">AeviaLaunch</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
