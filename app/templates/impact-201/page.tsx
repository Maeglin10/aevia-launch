"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { TemplateIcon } from '@/components/TemplateIcon';

// ─── Design tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#0c0a08",
  bgAlt: "#100e0b",
  cream: "#faf8f4",
  creamDim: "rgba(250,248,244,0.55)",
  creamMuted: "rgba(250,248,244,0.25)",
  gold: "#c9a855",
  goldDim: "rgba(201,168,85,0.55)",
  goldBorder: "rgba(201,168,85,0.18)",
  amber: "#8b5e2a",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'Jost', system-ui, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Menus", "Chef", "Expériences", "Savoir-faire", "Contact"];

const MARQUEE_ITEMS = [
  "Homard bleu breton",
  "Ris de veau & morilles",
  "Saint-Jacques de Bretagne",
  "Pigeon en croûte dorée",
  "Foie gras mi-cuit maison",
  "Soufflé au Grand Marnier",
  "Truffe noire du Périgord",
  "Turbot sauvage à l'unilatérale",
];

const SEASON_MENUS: Record<
  string,
  { name: string; price: string; dishes: string[]; wine: string }[]
> = {
  Printemps: [
    {
      name: "Éveil",
      price: "95 €",
      dishes: [
        "Velouté de petits pois · menthe fraîche · huile de truffe",
        "Filet de turbot · beurre blanc au citron · asperges vertes",
        "Agneau de lait · jus au romarin · légumes printaniers",
        "Fraises Gariguette · crème mascarpone · tuile amande",
      ],
      wine: "Chablis Premier Cru 2021",
    },
    {
      name: "Jardin",
      price: "75 €",
      dishes: [
        "Tartare de daurade · yuzu · concombre",
        "Risotto d'épeautre · morilles · parmesan 36 mois",
        "Pavé de cabillaud · chorizo · purée céleri",
        "Tarte citron revisitée · meringue italienne",
      ],
      wine: "Sancerre Blanc 2022",
    },
  ],
  Été: [
    {
      name: "Solstice",
      price: "110 €",
      dishes: [
        "Gaspacho tomate · burrata · basilic grand vert",
        "Homard bleu · bisque légère · fenouil confit",
        "Pigeonneau rôti · jus au miel · polenta crémeuse",
        "Pêche blanche pochée · sorbet lavande · amandes",
      ],
      wine: "Bandol Rosé 2023",
    },
    {
      name: "Mistral",
      price: "85 €",
      dishes: [
        "Vitello tonnato · câpres · roquette sauvage",
        "Dorade royale · ratatouille confite · tapenade",
        "Magret de canard · cerises · sauce poivre vert",
        "Tarte fine abricot · crème d'amande",
      ],
      wine: "Provence Blanc 2022",
    },
  ],
  Automne: [
    {
      name: "Cueillette",
      price: "105 €",
      dishes: [
        "Velouté de châtaignes · lardons fumés · crème fouettée",
        "Saint-Jacques poêlées · potimarron · noisettes torréfiées",
        "Ris de veau · morilles · jus madère · pommes dauphines",
        "Soufflé au chocolat · glace caramel beurre salé",
      ],
      wine: "Pomerol 2018",
    },
    {
      name: "Forêt",
      price: "85 €",
      dishes: [
        "Velouté de champignons sauvages · huile de noisette",
        "Pavé de boeuf Charolais · béarnaise maison · frites",
        "Filet de sanglier · sauce grand veneur · chou rouge",
        "Tarte Tatin · crème fraîche",
      ],
      wine: "Bourgogne Rouge 2020",
    },
  ],
  Hiver: [
    {
      name: "Nuit Blanche",
      price: "130 €",
      dishes: [
        "Foie gras mi-cuit · brioche toastée · chutney figue",
        "Truffe noire du Périgord · oeuf parfait · mouillettes",
        "Filet de boeuf Wagyu · sauce Périgueux · gratin dauphinois",
        "Soufflé chaud au Grand Marnier · sorbet mandarine",
      ],
      wine: "Gevrey-Chambertin 2017",
    },
    {
      name: "Solstice d'Hiver",
      price: "95 €",
      dishes: [
        "Royale de foie gras · consommé truffe",
        "Saint-Jacques · crème de topinambour · chips de jambon",
        "Canard à l'orange · sauce bigarade · purée maison",
        "Bûche glacée · marrons · chocolat noir 72%",
      ],
      wine: "Meursault 2019",
    },
  ],
};

const EXPERIENCES = [
  {
    img: "photo-1414235077428-338989a2e8c0",
    title: "Dîner en amoureux",
    sub: "2 personnes · 5 plats · accord mets-vins",
    price: "À partir de 320 €",
  },
  {
    img: "photo-1546069901-ba9599a7e63c",
    title: "Chef à domicile",
    sub: "2–12 personnes · préparation en live",
    price: "À partir de 180 €",
  },
  {
    img: "photo-1504674900247-0877df9cc836",
    title: "Brunch dominical",
    sub: "4–20 personnes · produits de saison",
    price: "À partir de 45 €/pers.",
  },
  {
    img: "photo-1551218808-94e220e084d2",
    title: "Réception privée",
    sub: "8–60 personnes · cocktail ou dîner assis",
    price: "Sur devis",
  },
];

const SAVOIR_FAIRE = [
  {
    icon: "🌱",
    title: "Produits locaux & de saison",
    desc: "Chaque menu est construit autour des meilleurs producteurs locaux — légumes bio du Val-de-Loire, poissons de la criée de Concarneau, volailles Label Rouge.",
  },
  {
    icon: "🍷",
    title: "Accords mets & vins",
    desc: "Sélection de vins naturels et biodynamiques en accord avec chaque plat. Du Champagne à l'apéritif au Sauternes sur le dessert — chaque bouteille est choisie.",
  },
  {
    icon: "👨‍🍳",
    title: "Formation étoilée",
    desc: "Formé chez Alain Passard (L'Arpège, 3★) et Anne-Sophie Pic (Maison Pic, 3★) — une technique irréprochable au service de vos papilles et de vos émotions.",
  },
  {
    icon: "🤍",
    title: "Service blanc-gant",
    desc: "Serveur(s) inclus dans toutes les formules groupe — mise en place de la table, service à l'assiette, débarrassage et nettoyage complets. Vous profitez.",
  },
];

const TESTIMONIALS = [
  {
    name: "Isabelle & Frédéric M.",
    role: "Dîner anniversaire",
    text: "Antoine a transformé notre salle à manger en restaurant étoilé. Le menu 5 plats était un voyage gustatif inoubliable. On ne mange plus jamais aussi bien au restaurant !",
    initials: "IF",
  },
  {
    name: "Caroline D.",
    role: "Réception 15 personnes",
    text: "La qualité des produits est exceptionnelle. Antoine est arrivé 3h avant, a tout géré seul, et nous a laissé une cuisine impeccable. Nos invités sont encore sous le charme.",
    initials: "CD",
  },
  {
    name: "Pierre B.",
    role: "Client fidèle — 12 dîners",
    text: "Je fais appel à Maison Saveur pour tous mes dîners d'affaires. La présentation est digne d'un grand restaurant, et l'accord mets-vins est toujours une révélation.",
    initials: "PB",
  },
  {
    name: "Sophie & Marc A.",
    role: "Brunch dominical",
    text: "Le brunch était d'une générosité et d'une fraîcheur incroyables. Les viennoiseries et le granola maison... on en parle encore 2 mois plus tard.",
    initials: "SA",
  },
  {
    name: "Thomas L.",
    role: "Chef à domicile",
    text: "Voir Antoine travailler en direct dans ma cuisine, expliquer ses techniques, partager ses sources... c'était presque aussi bon que de manger !",
    initials: "TL",
  },
];

const FORM_FIELDS = [
  { placeholder: "Votre prénom & nom", type: "text" },
  { placeholder: "Adresse email", type: "email" },
  { placeholder: "Numéro de téléphone", type: "tel" },
  { placeholder: "Date souhaitée", type: "date" },
];

// ─── Reusable components ─────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "template-fonts-201";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

function TextReveal({
  children,
  delay = 0,
  style: externalStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function MagneticButton({
  children,
  style: externalStyle,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    },
    [x, y]
  );
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return (
    <motion.button
      ref={ref}
      style={{ ...externalStyle, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({
  children,
  style: externalStyle,
  accentRgb,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentRgb?: string;
}) {
  const [spotlight, setSpotlight] = useState({
    x: 50,
    y: 50,
    active: false,
  });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setSpotlight({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        active: true,
      });
    },
    []
  );
  const handleMouseLeave = useCallback(
    () => setSpotlight((s) => ({ ...s, active: false })),
    []
  );
  const rgb = accentRgb || "201,168,85";
  const base = externalStyle?.background || C.card;
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(${rgb},0.13) 0%, ${base} 60%)`
          : base,
        transition: "background 0.12s ease",
      }}
    >
      {children}
    </div>
  );
}

function MarqueeStrip({
  items,
  bg,
  color,
}: {
  items: string[];
  bg: string;
  color: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        background: bg,
        paddingTop: 18,
        paddingBottom: 18,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color,
              fontFamily: C.fontSans,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: color,
                opacity: 0.4,
                display: "inline-block",
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: C.gold,
        scaleX,
        transformOrigin: "0%",
        zIndex: 9999,
      }}
    />
  );
}

// ─── TestimonialCard extracted to avoid hook-in-map ───────────────────────────
function TestimonialCard({
  t,
  index,
  active,
  onSelect,
}: {
  t: (typeof TESTIMONIALS)[0];
  index: number;
  active: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      onClick={() => onSelect(index)}
      style={{
        cursor: "pointer",
        padding: "32px 28px",
        border: `1px solid ${active ? C.gold : C.border}`,
        borderRadius: 16,
        background: active ? "rgba(201,168,85,0.05)" : C.card,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active && (
        <motion.div
          layoutId="testimonial-accent"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: C.gold,
          }}
        />
      )}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[0, 1, 2, 3, 4].map((s) => (
          <span key={s} style={{ fontSize: 12, color: C.gold }}>
            ★
          </span>
        ))}
      </div>
      <p
        style={{
          fontFamily: C.font,
          fontSize: 16,
          fontStyle: "italic",
          color: C.creamDim,
          lineHeight: 1.8,
          marginBottom: 24,
        }}
      >
        &ldquo;{t.text}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(201,168,85,0.12)",
            border: `1px solid ${C.goldBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            color: C.gold,
            fontFamily: C.fontSans,
            flexShrink: 0,
          }}
        >
          {t.initials}
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.cream,
              fontFamily: C.fontSans,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.creamMuted,
              fontFamily: C.fontSans,
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ExperienceCard extracted ─────────────────────────────────────────────────
function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", borderRadius: 16, cursor: "pointer" }}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
        <motion.img
          src={`https://images.unsplash.com/${exp.img}?q=80&w=700&auto=format&fit=crop`}
          alt={exp.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12,10,8,0.95) 0%, rgba(12,10,8,0.3) 50%, transparent 100%)",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(201,168,85,0.15) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "28px 24px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              fontFamily: C.font,
              color: C.cream,
              marginBottom: 6,
            }}
          >
            {exp.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.creamDim,
              fontFamily: C.fontSans,
              marginBottom: 12,
              letterSpacing: "0.04em",
            }}
          >
            {exp.sub}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.gold,
              fontFamily: C.fontSans,
              fontWeight: 500,
            }}
          >
            {exp.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact201Page() {
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
  if (brand) {
    C = { ...C, gold: brand };
  }

  useFonts();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState("Automne");
  const [activeMenuIdx, setActiveMenuIdx] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const seasons = Object.keys(SEASON_MENUS);
  const currentMenus = SEASON_MENUS[activeSeason] ?? [];

  
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
    <div
      style={{
        overflowX: "hidden",
        background: C.bg,
        color: C.cream,
        fontFamily: C.fontSans,
      }}
    >
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <ScrollProgressBar />

      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          backdropFilter: "blur(20px)",
          background: "rgba(12,10,8,0.88)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 40px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: `1px solid ${C.gold}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 14 }}>✦</span>
                </div>
                <span
                  style={{
                    fontFamily: C.font,
                    fontSize: 20,
                    fontWeight: 400,
                    color: C.cream,
                    letterSpacing: "0.08em",
                  }}
                >{fd?.businessName ?? "Maison Saveur"}</span>
              </>
            )}
          </button>

          {/* Desktop links */}
          <div
            className="sky-desktop-nav"
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase().replace("é", "e"))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: C.creamDim,
                  fontFamily: C.fontSans,
                  transition: "color 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.creamDim)
                }
              >
                {link}
              </button>
            ))}
            <MagneticButton
              onClick={() => scrollTo("contact")}
              style={{
                padding: "11px 28px",
                background: C.gold,
                color: C.bg,
                border: "none",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: C.fontSans,
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase" as const,
              }}
            >
              Réserver
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.cream,
              padding: 4,
            }}
            aria-label="Menu"
            className="mobile-menu-btn"
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: menuOpen ? C.gold : C.cream,
                marginBottom: 5,
                transition: "all 0.3s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <div
              style={{
                width: 24,
                height: 2,
                background: C.cream,
                marginBottom: 5,
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            />
            <div
              style={{
                width: 24,
                height: 2,
                background: menuOpen ? C.gold : C.cream,
                transition: "all 0.3s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
        <style>{`@media (max-width: 900px){.sky-desktop-nav{display:none !important}.mobile-menu-btn{display:flex !important}}`}</style>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "rgba(12,10,8,0.98)",
                borderTop: `1px solid ${C.border}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "32px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {NAV_LINKS.map((link) => (
                  <button
                    key={link}
                    onClick={() =>
                      scrollTo(link.toLowerCase().replace("é", "e"))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 22,
                      fontFamily: C.font,
                      fontStyle: "italic",
                      color: C.cream,
                      textAlign: "left",
                      padding: 0,
                    }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100dvh",
          minHeight: 700,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Parallax image */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-20% 0 -20%",
            y: heroY,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400&auto=format&fit=crop"
            alt="Gastronomie"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, rgba(12,10,8,0.92) 40%, rgba(12,10,8,0.5) 100%)",
            }}
          />
        </motion.div>

        {/* Decorative gold line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "absolute",
            left: "10vw",
            top: "15%",
            bottom: "15%",
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
            transformOrigin: "top",
          }}
        />

        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "0 calc(10vw + 28px)",
            maxWidth: 720,
            opacity: heroOpacity,
          }}
        >
          <TextReveal delay={0.1}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: C.gold,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase" as const,
                  color: C.gold,
                  fontFamily: C.fontSans,
                }}
              >
                Chef privé · Formation étoilée
              </span>
            </div>
          </TextReveal>

          <TextReveal delay={0.2}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(48px, 7vw, 96px)",
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: C.cream,
                marginBottom: 8,
              }}
            >{c?.heroHeadline ?? <>
              La grande cuisine
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.3}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(48px, 7vw, 96px)",
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                fontStyle: "italic" as const,
                color: C.gold,
                marginBottom: 40,
              }}
            >
              dans votre maison.
            </h1>
          </TextReveal>

          <TextReveal delay={0.4}>
            <p
              style={{
                fontSize: 17,
                color: C.creamDim,
                lineHeight: 1.8,
                marginBottom: 48,
                maxWidth: 500,
                fontWeight: 300,
              }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Antoine Lefèvre, formé chez Alain Passard et Anne-Sophie Pic,
              compose pour vous des menus d&apos;exception à domicile —
              produits locaux, technique irréprochable, émotions garanties.
            </>}</p>
          </TextReveal>

          <TextReveal delay={0.5}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              <MagneticButton
                onClick={() => scrollTo("contact")}
                style={{
                  padding: "18px 44px",
                  background: C.gold,
                  color: C.bg,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: C.fontSans,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  textTransform: "uppercase" as const,
                }}
              >
                Réserver une prestation
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("menus")}
                style={{
                  padding: "18px 44px",
                  background: "transparent",
                  color: C.cream,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: C.fontSans,
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                }}
              >
                Voir les menus
              </MagneticButton>
            </div>
          </TextReveal>
        </motion.div>

        {/* Floating stats card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          style={{
            position: "absolute",
            right: 60,
            bottom: 100,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 16,
            padding: "28px 32px",
            zIndex: 10,
          }}
        >
          {[
            { val: "850+", label: "Repas créés" },
            { val: "4.9/5", label: "Note clients" },
            { val: "3★", label: "Formation" },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 300,
                  color: C.gold,
                  fontFamily: C.font,
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.creamMuted,
                  fontFamily: C.fontSans,
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: C.creamMuted,
              fontFamily: C.fontSans,
              textTransform: "uppercase" as const,
            }}
          >
            Découvrir
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: C.goldDim }}
          />
        </motion.div>
      </section>

      {/* ─── MARQUEE ─────────────────────────────────────────────────────── */}
      <MarqueeStrip
        items={MARQUEE_ITEMS}
        bg={C.gold}
        color={C.bg}
      />

      {/* ─── CHEF / ABOUT ─────────────────────────────────────────────────── */}
      <section className="imx-mobstack"
        id="chef"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "120px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0, 0, 1] }}
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop"
              alt="Chef Antoine Lefèvre"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(12,10,8,0.6) 0%, transparent 50%)",
              }}
            />
          </div>
          {/* Floating credential */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              position: "absolute",
              bottom: -24,
              right: -24,
              background: C.bgAlt,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 12,
              padding: "20px 24px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                color: C.gold,
                fontFamily: C.fontSans,
                textTransform: "uppercase" as const,
                marginBottom: 8,
              }}
            >
              Formation
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.cream,
                fontFamily: C.fontSans,
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              L&apos;Arpège ★★★
              <br />
              Maison Pic ★★★
            </div>
          </motion.div>
        </motion.div>

        {/* Text side */}
        <div>
          <TextReveal delay={0.1}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 24,
              }}
            >
              <div style={{ width: 32, height: 1, background: C.gold }} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase" as const,
                  color: C.gold,
                  fontFamily: C.fontSans,
                }}
              >
                Le chef
              </span>
            </div>
          </TextReveal>
          <TextReveal delay={0.2}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 4vw, 58px)",
                fontWeight: 300,
                lineHeight: 1.15,
                color: C.cream,
                marginBottom: 28,
              }}
            >{c?.aboutTitle ?? fd?.businessName ?? <>
              Antoine Lefèvre,
              <br />
              <em style={{ color: C.gold }}>chef étoilé à domicile.</em>
            </>}</h2>
          </TextReveal>
          <TextReveal delay={0.3}>
            <p
              style={{
                fontSize: 16,
                color: C.creamDim,
                lineHeight: 1.9,
                marginBottom: 20,
                fontWeight: 300,
              }}
            >{c?.aboutText ?? <>
              Après dix ans en brigade — chez Alain Passard à L&apos;Arpège
              puis Anne-Sophie Pic à Valence — Antoine a choisi d&apos;apporter
              la gastronomie là où elle crée les plus beaux souvenirs : chez
              vous.
            </>}</p>
          </TextReveal>
          <TextReveal delay={0.35}>
            <p
              style={{
                fontSize: 16,
                color: C.creamDim,
                lineHeight: 1.9,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              Chaque prestation est une création singulière. Les produits sont
              sourcés chez ses producteurs partenaires, les accords mets-vins
              sélectionnés avec soin, et chaque assiette est le reflet
              d&apos;une exigence absolue.
            </p>
          </TextReveal>
          <TextReveal delay={0.4}>
            <div className="imx-mobstack"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 40,
              }}
            >
              {[
                { val: "12 ans", label: "En cuisine professionnelle" },
                { val: "850+", label: "Repas d&apos;exception créés" },
                { val: "100%", label: "Produits sourcés localement" },
                { val: "4.9/5", label: "Satisfaction clients" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "20px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 28,
                      fontWeight: 300,
                      color: C.gold,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.creamMuted,
                      fontFamily: C.fontSans,
                    }}
                    dangerouslySetInnerHTML={{ __html: s.label }}
                  />
                </div>
              ))}
            </div>
          </TextReveal>
          <TextReveal delay={0.5}>
            <MagneticButton
              onClick={() => scrollTo("contact")}
              style={{
                padding: "16px 40px",
                background: "transparent",
                color: C.gold,
                border: `1px solid ${C.gold}`,
                borderRadius: 4,
                fontSize: 12,
                fontFamily: C.fontSans,
                fontWeight: 600,
                letterSpacing: "0.12em",
                cursor: "pointer",
                textTransform: "uppercase" as const,
              }}
            >
              Prendre contact avec Antoine
            </MagneticButton>
          </TextReveal>
        </div>
      </section>

      {/* ─── MENUS (Season tabs + AnimatePresence) ────────────────────────── */}
      <section
        id="menus"
        style={{
          background: C.bgAlt,
          padding: "120px 60px",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <TextReveal>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div style={{ width: 32, height: 1, background: C.gold }} />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase" as const,
                    color: C.gold,
                    fontFamily: C.fontSans,
                  }}
                >
                  Carte saisonnière
                </span>
              </div>
            </div>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.cream,
                marginBottom: 48,
                lineHeight: 1.1,
              }}
            >
              Des menus qui racontent{" "}
              <em style={{ color: C.gold }}>chaque saison.</em>
            </h2>
          </TextReveal>

          {/* Season tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 56,
              flexWrap: "wrap" as const,
            }}
          >
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => {
                  setActiveSeason(season);
                  setActiveMenuIdx(0);
                }}
                style={{
                  padding: "10px 28px",
                  borderRadius: 50,
                  border: `1px solid ${
                    activeSeason === season ? C.gold : C.border
                  }`,
                  background:
                    activeSeason === season
                      ? "rgba(201,168,85,0.12)"
                      : "transparent",
                  color: activeSeason === season ? C.gold : C.creamMuted,
                  fontSize: 13,
                  fontFamily: C.fontSans,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.06em",
                }}
              >
                {season}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSeason}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
            >
              {/* Sub menu selector */}
              <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
                {currentMenus.map((m, i) => (
                  <button
                    key={m.name}
                    onClick={() => setActiveMenuIdx(i)}
                    style={{
                      padding: "8px 20px",
                      border: `1px solid ${
                        activeMenuIdx === i ? C.goldDim : C.border
                      }`,
                      borderRadius: 4,
                      background:
                        activeMenuIdx === i
                          ? "rgba(201,168,85,0.06)"
                          : "transparent",
                      color:
                        activeMenuIdx === i ? C.cream : C.creamMuted,
                      fontSize: 13,
                      fontFamily: C.fontSans,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Menu {m.name}
                  </button>
                ))}
              </div>

              {currentMenus[activeMenuIdx] && (
                <div className="imx-mobstack"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 48,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  {/* Dishes */}
                  <div style={{ padding: "56px 52px" }}>
                    <div
                      style={{
                        fontFamily: C.font,
                        fontSize: 36,
                        fontWeight: 300,
                        fontStyle: "italic",
                        color: C.cream,
                        marginBottom: 8,
                      }}
                    >
                      {currentMenus[activeMenuIdx].name}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontFamily: C.font,
                        color: C.gold,
                        fontWeight: 300,
                        marginBottom: 40,
                      }}
                    >
                      {currentMenus[activeMenuIdx].price}{" "}
                      <span
                        style={{
                          fontSize: 13,
                          color: C.creamMuted,
                          fontFamily: C.fontSans,
                          fontWeight: 400,
                        }}
                      >
                        par personne
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      {currentMenus[activeMenuIdx].dishes.map((dish, di) => (
                        <motion.div
                          key={di}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: di * 0.08, duration: 0.4 }}
                          style={{
                            display: "flex",
                            gap: 16,
                            alignItems: "flex-start",
                            paddingBottom: 20,
                            borderBottom:
                              di < currentMenus[activeMenuIdx].dishes.length - 1
                                ? `1px solid ${C.border}`
                                : "none",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: C.font,
                              fontSize: 22,
                              color: C.gold,
                              opacity: 0.4,
                              lineHeight: 1,
                              flexShrink: 0,
                              minWidth: 20,
                            }}
                          >
                            {di + 1}
                          </span>
                          <span
                            style={{
                              fontFamily: C.font,
                              fontSize: 17,
                              fontStyle: "italic",
                              color: C.creamDim,
                              lineHeight: 1.6,
                            }}
                          >
                            {dish}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Info + image */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderLeft: `1px solid ${C.border}`,
                      padding: "56px 48px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          color: C.gold,
                          fontFamily: C.fontSans,
                          textTransform: "uppercase" as const,
                          marginBottom: 12,
                        }}
                      >
                        Accord mets & vins suggéré
                      </div>
                      <div
                        style={{
                          fontFamily: C.font,
                          fontSize: 20,
                          fontStyle: "italic",
                          color: C.cream,
                          marginBottom: 40,
                        }}
                      >
                        {currentMenus[activeMenuIdx].wine}
                      </div>
                      <div
                        style={{
                          padding: "20px 24px",
                          border: `1px solid ${C.goldBorder}`,
                          borderRadius: 12,
                          marginBottom: 40,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: C.creamMuted,
                            fontFamily: C.fontSans,
                            letterSpacing: "0.1em",
                            marginBottom: 8,
                          }}
                        >
                          Inclus dans le menu
                        </div>
                        {[
                          "Ingrédients premium sourcés",
                          "Préparation & cuisson sur place",
                          "Service à table inclus",
                          "Nettoyage cuisine complet",
                        ].map((feat) => (
                          <div
                            key={feat}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              color: C.creamDim,
                              fontFamily: C.fontSans,
                              marginBottom: 6,
                            }}
                          >
                            <span style={{ color: C.gold, fontSize: 10 }}>
                              ✦
                            </span>
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                    <MagneticButton
                      onClick={() => scrollTo("contact")}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: C.gold,
                        color: C.bg,
                        border: "none",
                        borderRadius: 8,
                        fontSize: 13,
                        fontFamily: C.fontSans,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      Réserver ce menu
                    </MagneticButton>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── EXPERIENCES ──────────────────────────────────────────────────── */}
      <section
        id="experiences"
        style={{ padding: "120px 60px", maxWidth: 1280, margin: "0 auto" }}
      >
        <TextReveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 32, height: 1, background: C.gold }} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                color: C.gold,
                fontFamily: C.fontSans,
              }}
            >
              Formules
            </span>
          </div>
        </TextReveal>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            flexWrap: "wrap" as const,
            gap: 20,
          }}
        >
          <TextReveal>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.cream,
                lineHeight: 1.1,
              }}
            >
              Une occasion,
              <br />
              <em style={{ color: C.gold }}>une expérience unique.</em>
            </h2>
          </TextReveal>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.title} exp={exp} index={i} />
          ))}
        </div>
      </section>

      {/* ─── SAVOIR-FAIRE (SpotlightCards) ────────────────────────────────── */}
      <section
        id="savoir-faire"
        style={{
          background: C.bgAlt,
          padding: "120px 60px",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="imx-mobstack"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
              marginBottom: 80,
            }}
          >
            <div>
              <TextReveal>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ width: 32, height: 1, background: C.gold }} />
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase" as const,
                      color: C.gold,
                      fontFamily: C.fontSans,
                    }}
                  >
                    Savoir-faire
                  </span>
                </div>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    fontWeight: 300,
                    color: C.cream,
                    lineHeight: 1.1,
                  }}
                >
                  Ce qui rend chaque repas{" "}
                  <em style={{ color: C.gold }}>unique.</em>
                </h2>
              </TextReveal>
            </div>
            <TextReveal delay={0.2}>
              <p
                style={{
                  fontSize: 17,
                  color: C.creamDim,
                  lineHeight: 1.9,
                  fontWeight: 300,
                }}
              >
                Chez Maison Saveur, rien n&apos;est laissé au hasard. Du choix
                des producteurs à la mise en place finale, chaque détail est
                pensé pour que vous et vos convives viviez un moment
                d&apos;exception.
              </p>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {SAVOIR_FAIRE.map((sf, i) => (
              <motion.div
                key={sf.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <SpotlightCard
                  accentRgb="201,168,85"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: "36px 28px",
                    height: "100%",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 24,
                      lineHeight: 1,
                    }}
                  >
                    <TemplateIcon emoji={sf.icon} size={32} color={C.gold} />
                  </div>
                  <h3
                    style={{
                      fontFamily: C.font,
                      fontSize: 22,
                      fontWeight: 400,
                      color: C.cream,
                      marginBottom: 16,
                      lineHeight: 1.3,
                    }}
                  >
                    {sf.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.creamDim,
                      fontFamily: C.fontSans,
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {sf.desc}
                  </p>
                  <div
                    style={{
                      marginTop: 28,
                      width: 32,
                      height: 1,
                      background: C.goldBorder,
                    }}
                  />
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        id="avis"
        style={{ padding: "120px 60px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
            flexWrap: "wrap" as const,
            gap: 24,
          }}
        >
          <div>
            <TextReveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div style={{ width: 32, height: 1, background: C.gold }} />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase" as const,
                    color: C.gold,
                    fontFamily: C.fontSans,
                  }}
                >
                  Témoignages
                </span>
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 300,
                  color: C.cream,
                  lineHeight: 1.1,
                }}
              >
                Ils ont dîné{" "}
                <em style={{ color: C.gold }}>avec Antoine.</em>
              </h2>
            </TextReveal>
          </div>
          <TextReveal delay={0.2}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 24px",
                border: `1px solid ${C.border}`,
                borderRadius: 50,
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <span key={s} style={{ fontSize: 14, color: C.gold }}>
                    ★
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: C.creamDim,
                  fontFamily: C.fontSans,
                }}
              >
                4.9 · 140 avis Google
              </span>
            </div>
          </TextReveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 20,
            marginBottom: 16,
          }}
        >
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              index={i}
              active={activeTestimonial === i}
              onSelect={setActiveTestimonial}
            />
          ))}
        </div>
        <div className="imx-mobstack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
            maxWidth: 760,
          }}
        >
          {TESTIMONIALS.slice(3).map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              index={i + 3}
              active={activeTestimonial === i + 3}
              onSelect={setActiveTestimonial}
            />
          ))}
        </div>
      </section>

      {/* ─── CONTACT / BOOKING ───────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          padding: "120px 60px",
        }}
      >
        <div className="imx-mobstack"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 100,
          }}
        >
          {/* Left */}
          <div>
            <TextReveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div style={{ width: 32, height: 1, background: C.gold }} />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase" as const,
                    color: C.gold,
                    fontFamily: C.fontSans,
                  }}
                >
                  Réservation
                </span>
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 300,
                  color: C.cream,
                  lineHeight: 1.1,
                  marginBottom: 32,
                }}
              >
                Votre prochain repas sera{" "}
                <em style={{ color: C.gold }}>inoubliable.</em>
              </h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p
                style={{
                  fontSize: 16,
                  color: C.creamDim,
                  lineHeight: 1.9,
                  marginBottom: 48,
                  fontWeight: 300,
                }}
              >
                Devis gratuit sous 24h. Disponible 7j/7 en Île-de-France et
                sur destination. Réponse personnalisée garantie.
              </p>
            </TextReveal>
            <TextReveal delay={0.3}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {[
                  { icon: "📍", label: "Zone d&apos;intervention", val: "Paris & Île-de-France · Sur demande ailleurs" },
                  { icon: "🕐", label: "Délai de réservation", val: "3 jours minimum · 3–4 semaines pour grandes occasions" },
                  { icon: "📞", label: "Contact direct", val: "+33 6 XX XX XX XX" },
                  { icon: "✦", label: "Devis", val: "Gratuit · Réponse sous 24h · Sans engagement" },
                ].map((info) => (
                  <div
                    key={info.label}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      padding: "16px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      <TemplateIcon emoji={info.icon} size={18} color={C.gold} />
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: C.creamMuted,
                          fontFamily: C.fontSans,
                          textTransform: "uppercase" as const,
                          marginBottom: 4,
                        }}
                        dangerouslySetInnerHTML={{ __html: info.label }}
                      />
                      <div
                        style={{
                          fontSize: 14,
                          color: C.cream,
                          fontFamily: C.fontSans,
                          fontWeight: 500,
                        }}
                        dangerouslySetInnerHTML={{ __html: info.val }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TextReveal>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0, 1] }}
          >
            <div
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "48px",
                background: C.card,
              }}
            >
              <h3
                style={{
                  fontFamily: C.font,
                  fontSize: 28,
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: C.cream,
                  marginBottom: 32,
                }}
              >
                Demander un devis
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {FORM_FIELDS.map((field) => (
                  <input
                    key={field.placeholder}
                    type={field.type}
                    placeholder={field.placeholder}
                    style={{
                      padding: "16px 20px",
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      color: C.cream,
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.2s",
                      width: "100%",
                      boxSizing: "border-box" as const,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = C.gold)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = C.border)
                    }
                  />
                ))}
                <select
                  style={{
                    padding: "16px 20px",
                    background: C.bgAlt,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.creamDim,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box" as const,
                    cursor: "pointer",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = C.gold)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
                >
                  <option value="">Type de prestation</option>
                  <option>Dîner en amoureux</option>
                  <option>Réception privée</option>
                  <option>Brunch dominical</option>
                  <option>Chef à domicile</option>
                  <option>Événement professionnel</option>
                </select>
                <textarea
                  placeholder="Nombre de convives, occasion, régimes alimentaires à prendre en compte..."
                  rows={4}
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.cream,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "none" as const,
                    width: "100%",
                    boxSizing: "border-box" as const,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = C.gold)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
                />
                <MagneticButton
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: C.gold,
                    color: C.bg,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: C.fontSans,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Envoyer ma demande
                </MagneticButton>
                <p
                  style={{
                    fontSize: 12,
                    color: C.creamMuted,
                    textAlign: "center",
                    fontFamily: C.fontSans,
                  }}
                >
                  Devis gratuit · Réponse sous 24h · Sans engagement
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#060402",
          padding: "64px 60px 32px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 60,
              marginBottom: 64,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `1px solid ${C.gold}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  ✦
                </div>
                <span
                  style={{
                    fontFamily: C.font,
                    fontSize: 18,
                    color: C.cream,
                    letterSpacing: "0.08em",
                  }}
                >{fd?.businessName ?? "Maison Saveur"}</span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: C.creamMuted,
                  fontFamily: C.fontSans,
                  lineHeight: 1.9,
                  maxWidth: 280,
                  fontWeight: 300,
                }}
              >
                Chef Antoine Lefèvre — Prestation culinaire à domicile. Paris
                & Île-de-France. Disponible sur destination.
              </p>
              <div
                style={{
                  marginTop: 24,
                  fontSize: 12,
                  color: "rgba(250,248,244,0.2)",
                  fontFamily: C.fontSans,
                }}
              >
                SIRET 842 571 234 00018
              </div>
            </div>
            {[
              {
                title: "Services",
                links: [
                  "Dîner en amoureux",
                  "Réception privée",
                  "Brunch dominical",
                  "Chef à domicile",
                ],
              },
              {
                title: "Menus",
                links: [
                  "Menu Printemps",
                  "Menu Été",
                  "Menu Automne",
                  "Menu Hiver",
                ],
              },
              {
                title: "Contact",
                links: [
                  "Demander un devis",
                  "Disponibilités",
                  "Zone d'intervention",
                  "Mentions légales",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase" as const,
                    color: C.gold,
                    fontFamily: C.fontSans,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}
                >
                  {col.title}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href={
                          l === "Mentions légales" || l === "Politique de confidentialité" || l === "CGV" || l === "Demander un devis" || l === "Disponibilités" || l === "Zone d'intervention"
                            ? "#contact"
                            : col.title === "Menus"
                            ? "#menus"
                            : l === "Chef à domicile"
                            ? "#chef"
                            : "#experiences"
                        }
                        style={{
                          fontSize: 13,
                          color: C.creamMuted,
                          textDecoration: "none",
                          fontFamily: C.fontSans,
                          transition: "color 0.2s",
                          fontWeight: 300,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = C.cream)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = C.creamMuted)
                        }
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap" as const,
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "rgba(250,248,244,0.2)",
                fontFamily: C.fontSans,
              }}
            >
              © 2025 Maison Saveur — Chef Antoine Lefèvre
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map(
                (l) => (
                  <a
                    key={l}
                    href="#contact"
                    style={{
                      fontSize: 12,
                      color: "rgba(250,248,244,0.2)",
                      textDecoration: "none",
                      fontFamily: C.fontSans,
                    }}
                  >
                    {l}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
