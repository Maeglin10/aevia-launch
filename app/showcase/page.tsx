"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
import { useLang } from "@/lib/LangContext";
import { AeviaHeader } from "@/components/AeviaHeader";

// ── Translations ───────────────────────────────────────────────────────────────
const T = {
  fr: {
    badge: "200+ templates",
    title: "Quel type de site ?",
    sub: "Choisissez votre catégorie — on a le thème parfait pour vous.",
    seeAll: "Voir tous les thèmes",
    spotlight: "Coup de projecteur",
    spotlightSub: "Nos meilleurs templates du moment.",
    cta: "Créer mon site",
  },
  en: {
    badge: "200+ templates",
    title: "What type of site?",
    sub: "Choose your category — we have the perfect theme for you.",
    seeAll: "Browse all themes",
    spotlight: "Spotlight",
    spotlightSub: "Our best templates right now.",
    cta: "Build my site",
  },
  es: {
    badge: "200+ plantillas",
    title: "¿Qué tipo de sitio?",
    sub: "Elige tu categoría — tenemos el tema perfecto para ti.",
    seeAll: "Ver todos los temas",
    spotlight: "Destacados",
    spotlightSub: "Nuestras mejores plantillas ahora mismo.",
    cta: "Crear mi sitio",
  },
  de: {
    badge: "200+ Templates",
    title: "Welche Art von Website?",
    sub: "Wähle deine Kategorie — wir haben das perfekte Theme für dich.",
    seeAll: "Alle Themes ansehen",
    spotlight: "Spotlight",
    spotlightSub: "Unsere besten Templates gerade jetzt.",
    cta: "Meine Website erstellen",
  },
  pt: {
    badge: "200+ templates",
    title: "Que tipo de site?",
    sub: "Escolha a sua categoria — temos o tema perfeito para você.",
    seeAll: "Ver todos os temas",
    spotlight: "Destaques",
    spotlightSub: "Nossos melhores templates agora.",
    cta: "Criar meu site",
  },
};

// ── Type categories ────────────────────────────────────────────────────────────
const TYPE_CATS = [
  {
    label: { fr: "Luxe & Premium", en: "Luxury & Premium", es: "Lujo & Premium", de: "Luxus & Premium", pt: "Luxo & Premium" },
    cat: "Luxury",
    color: "#C9A86C",
    bg: "from-[#C9A86C]/15 to-[#C9A86C]/5",
    border: "border-[#C9A86C]/25",
    hoverBorder: "hover:border-[#C9A86C]/60",
    desc: { fr: "Bijouterie, hôtellerie, mode, gastronomie", en: "Jewellery, hotels, fashion, fine dining", es: "Joyería, hoteles, moda, gastronomía", de: "Schmuck, Hotels, Mode, Gastronomie", pt: "Joalheria, hotéis, moda, gastronomia" },
    thumbId: "impact-03",
    count: 24,
  },
  {
    label: { fr: "Tech & SaaS", en: "Tech & SaaS", es: "Tech & SaaS", de: "Tech & SaaS", pt: "Tech & SaaS" },
    cat: "Tech",
    color: "#3B82F6",
    bg: "from-[#3B82F6]/15 to-[#3B82F6]/5",
    border: "border-[#3B82F6]/25",
    hoverBorder: "hover:border-[#3B82F6]/60",
    desc: { fr: "SaaS, apps, startups, outils pro", en: "SaaS, apps, startups, dev tools", es: "SaaS, apps, startups, herramientas", de: "SaaS, Apps, Startups, Dev-Tools", pt: "SaaS, apps, startups, ferramentas" },
    thumbId: "impact-05",
    count: 18,
  },
  {
    label: { fr: "Créatif & Agence", en: "Creative & Agency", es: "Creativo & Agencia", de: "Kreativ & Agentur", pt: "Criativo & Agência" },
    cat: "Creative",
    color: "#A855F7",
    bg: "from-[#A855F7]/15 to-[#A855F7]/5",
    border: "border-[#A855F7]/25",
    hoverBorder: "hover:border-[#A855F7]/60",
    desc: { fr: "Portfolios, studios, agences créatives", en: "Portfolios, studios, creative agencies", es: "Portfolios, estudios, agencias", de: "Portfolios, Studios, Kreativagenturen", pt: "Portfólios, estúdios, agências" },
    thumbId: "impact-02",
    count: 22,
  },
  {
    label: { fr: "Food & Restaurant", en: "Food & Restaurant", es: "Comida & Restaurante", de: "Food & Restaurant", pt: "Food & Restaurante" },
    cat: "Food & Drink",
    color: "#FB923C",
    bg: "from-[#FB923C]/15 to-[#FB923C]/5",
    border: "border-[#FB923C]/25",
    hoverBorder: "hover:border-[#FB923C]/60",
    desc: { fr: "Restaurants, cafés, boulangeries, vins", en: "Restaurants, cafés, bakeries, wine bars", es: "Restaurantes, cafés, panaderías, vinos", de: "Restaurants, Cafés, Bäckereien, Weine", pt: "Restaurantes, cafés, padarias, vinhos" },
    thumbId: "impact-04",
    count: 12,
  },
  {
    label: { fr: "Santé & Bien-être", en: "Health & Wellness", es: "Salud & Bienestar", de: "Gesundheit & Wellness", pt: "Saúde & Bem-estar" },
    cat: "Health",
    color: "#14B8A6",
    bg: "from-[#14B8A6]/15 to-[#14B8A6]/5",
    border: "border-[#14B8A6]/25",
    hoverBorder: "hover:border-[#14B8A6]/60",
    desc: { fr: "Cliniques, spas, yoga, fitness", en: "Clinics, spas, yoga, fitness", es: "Clínicas, spas, yoga, fitness", de: "Kliniken, Spas, Yoga, Fitness", pt: "Clínicas, spas, yoga, fitness" },
    thumbId: "impact-10",
    count: 10,
  },
  {
    label: { fr: "Corporate & Services", en: "Corporate & Services", es: "Corporativo & Servicios", de: "Corporate & Services", pt: "Corporativo & Serviços" },
    cat: "Corporate",
    color: "#0EA5E9",
    bg: "from-[#0EA5E9]/15 to-[#0EA5E9]/5",
    border: "border-[#0EA5E9]/25",
    hoverBorder: "hover:border-[#0EA5E9]/60",
    desc: { fr: "Entreprises, cabinets, B2B, finance", en: "Companies, agencies, B2B, finance", es: "Empresas, despachos, B2B, finanzas", de: "Unternehmen, Kanzleien, B2B, Finanzen", pt: "Empresas, escritórios, B2B, finanças" },
    thumbId: "impact-01",
    count: 16,
  },
  {
    label: { fr: "E-Commerce", en: "E-Commerce", es: "E-Commerce", de: "E-Commerce", pt: "E-Commerce" },
    cat: "E-Commerce",
    color: "#EC4899",
    bg: "from-[#EC4899]/15 to-[#EC4899]/5",
    border: "border-[#EC4899]/25",
    hoverBorder: "hover:border-[#EC4899]/60",
    desc: { fr: "Boutiques, mode, bijoux, beauté", en: "Stores, fashion, jewellery, beauty", es: "Tiendas, moda, joyería, belleza", de: "Shops, Mode, Schmuck, Beauty", pt: "Lojas, moda, joalheria, beleza" },
    thumbId: "impact-20",
    count: 8,
  },
  {
    label: { fr: "Minimal & Éditorial", en: "Minimal & Editorial", es: "Minimal & Editorial", de: "Minimal & Editorial", pt: "Minimal & Editorial" },
    cat: "Minimal",
    color: "#71717A",
    bg: "from-white/8 to-white/3",
    border: "border-white/12",
    hoverBorder: "hover:border-white/30",
    desc: { fr: "Portfolios épurés, blogs, presse", en: "Clean portfolios, blogs, press", es: "Portfolios limpios, blogs, prensa", de: "Minimalistische Portfolios, Blogs, Presse", pt: "Portfólios limpos, blogs, imprensa" },
    thumbId: "impact-12",
    count: 14,
  },
];

const SPOTLIGHT_IDS = ["impact-01", "impact-03", "impact-05", "impact-13", "impact-15", "impact-20"];

// ── TypeCard ───────────────────────────────────────────────────────────────────
function TypeCard({ cat, index }: { cat: typeof TYPE_CATS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [thumbOk, setThumbOk] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { locale } = useLang();
  const lk = (locale as keyof typeof cat.label) in cat.label ? (locale as keyof typeof cat.label) : "en";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/themes?cat=${cat.cat}`}
        className={`group flex flex-col rounded-2xl border bg-gradient-to-br ${cat.bg} ${cat.border} ${cat.hoverBorder} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden border-b border-white/5 bg-zinc-900/50">
          {thumbOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/thumbnails/${cat.thumbId}.webp`}
              alt={cat.label[lk]}
              className={`w-full h-full object-cover object-top transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
              onError={() => setThumbOk(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${cat.color}20, transparent)` }}>
              <Sparkles className="w-10 h-10 text-white opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to top, ${cat.color}40, transparent 60%)` }} />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{ background: `${cat.color}25`, color: cat.color, border: `1px solid ${cat.color}40` }}>
            {cat.count}
          </div>
        </div>
        <div className="p-4 flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-white text-sm mb-0.5">{cat.label[lk]}</div>
            <div className="text-xs text-zinc-500 leading-relaxed">{cat.desc[lk]}</div>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
            style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
            <ArrowRight className="w-3 h-3" style={{ color: cat.color }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── SpotlightCard ──────────────────────────────────────────────────────────────
function SpotlightCard({ template, index }: { template: typeof TEMPLATES_REGISTRY[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [thumbOk, setThumbOk] = useState(true);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <Link href={`/templates/${template.id}`} className="group block">
        <div className="relative rounded-xl border border-white/6 bg-zinc-900/50 overflow-hidden hover:-translate-y-1 hover:border-white/15 transition-all duration-300">
          <div className="relative aspect-video overflow-hidden bg-zinc-900">
            {thumbOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/thumbnails/${template.id}.webp`}
                alt={template.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                onError={() => setThumbOk(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-zinc-900" />
            )}
          </div>
          <div className="p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{template.category}</div>
            <div className="text-sm font-bold text-white">{template.name}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const spotlightTemplates = SPOTLIGHT_IDS
    .map(id => TEMPLATES_REGISTRY.find(t => t.id === id))
    .filter(Boolean) as typeof TEMPLATES_REGISTRY;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <AeviaHeader />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-28">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
                {t.title}
              </h1>
              <p className="text-zinc-400 text-lg max-w-xl">{t.sub}</p>
            </div>
            <Link
              href="/themes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-violet-500/60 text-zinc-300 hover:text-white text-sm font-semibold transition-all shrink-0"
            >
              {t.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* ── 8 TypeCards ── */}
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          {TYPE_CATS.map((cat, i) => (
            <TypeCard key={cat.cat} cat={cat} index={i} />
          ))}
        </div>

        {/* ── Spotlight ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{t.spotlight}</h2>
              <p className="text-zinc-500 text-sm mt-1">{t.spotlightSub}</p>
            </div>
            <Link href="/themes" className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
              {t.seeAll} →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {spotlightTemplates.map((tpl, i) => (
              <SpotlightCard key={tpl.id} template={tpl} index={i} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-violet-600/30"
          >
            {t.cta} <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
