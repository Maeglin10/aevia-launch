"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
  animate,
} from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Monitor,
  Palette,
  Code2,
  Layers,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────── */
const T = {
  bg: "#0a0a0a",
  text: "#f0f0f0",
  muted: "#666666",
  dimmed: "#333333",
  accent: "#0066ff",
  accentDim: "rgba(0,102,255,0.15)",
  accentBorder: "rgba(0,102,255,0.3)",
  border: "rgba(240,240,240,0.06)",
  surface: "rgba(240,240,240,0.03)",
  surfaceHover: "rgba(240,240,240,0.06)",
  overlay: "rgba(10,10,10,0.85)",
};

const FONT_HEADING = "'Syne', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <Monitor size={28} />,
    title: "Web Design",
    desc: "Bespoke interfaces crafted with pixel-perfect precision and strategic UX thinking that converts visitors into customers.",
    tag: "UI/UX",
  },
  {
    icon: <Code2 size={28} />,
    title: "Development",
    desc: "High-performance applications built on modern stacks with seamless integrations and bulletproof reliability.",
    tag: "Engineering",
  },
  {
    icon: <Palette size={28} />,
    title: "Branding",
    desc: "Distinctive visual identities that resonate deeply with your target audience and stand apart from competitors.",
    tag: "Identity",
  },
  {
    icon: <Layers size={28} />,
    title: "Strategy",
    desc: "Data-driven growth strategies that compound over time, converting visitors into loyal brand advocates.",
    tag: "Growth",
  },
  {
    icon: <Monitor size={28} />,
    title: "Motion Design",
    desc: "Cinematic animations and micro-interactions that elevate perception and make every touchpoint memorable.",
    tag: "Animation",
  },
  {
    icon: <Code2 size={28} />,
    title: "Performance",
    desc: "Core Web Vitals optimization, CDN architecture, and infrastructure tuning for sub-second load times globally.",
    tag: "Speed",
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "Aether Labs",
    category: "Web Ecosystem",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Noir Studio",
    category: "Brand Identity",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Prisme Finance",
    category: "Fintech App",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Lumina Health",
    category: "Healthcare Portal",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Onyx Records",
    category: "E-commerce",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Solaris AI",
    category: "SaaS Platform",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1200&auto=format&fit=crop",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    desc: "We immerse ourselves in your business, your users, and your competitive landscape. Deep research drives every decision we make.",
    detail:
      "Stakeholder interviews, user research, competitor analysis, technical audit.",
  },
  {
    number: "02",
    title: "Design",
    desc: "From wireframes to high-fidelity prototypes, we craft interfaces that are both beautiful and functionally precise.",
    detail: "UX architecture, visual design, design systems, interactive prototypes.",
  },
  {
    number: "03",
    title: "Build",
    desc: "Our engineers translate designs into production-grade code. Clean, performant, and built to scale under real-world load.",
    detail: "Next.js, React, Node.js, Prisma, PostgreSQL, Redis, CI/CD pipelines.",
  },
  {
    number: "04",
    title: "Launch",
    desc: "Rigorous QA, performance audits, and a staged rollout ensure a flawless launch that makes the right first impression.",
    detail: "Load testing, Lighthouse audits, staging environments, go-live support.",
  },
];

const STATS_DATA = [
  { target: 147, suffix: "+", label: "Clients Worldwide" },
  { target: 312, suffix: "+", label: "Projects Delivered" },
  { target: 8, suffix: "", label: "Years of Craft" },
  { target: 98, suffix: "%", label: "Client Satisfaction" },
];

/* ─────────────────────────────────────────────────────────────
   MULTI-PAGE NAVIGATION (additive — see notes below)
   ───────────────────────────────────────────────────────────── */
// PATTERN: a single `page` React-state drives in-page navigation. The original
// single-page content is rendered VERBATIM under page === "home" (design is
// untouched). Every other key renders a theme-native sub-page built from the
// SAME `T` design tokens, fonts (Syne + Inter) and section/card styling as the
// home page. Vitrine (creative agency) — no cart/CGV; "Réalisations" maps to the
// existing Work/portfolio section + a fuller grid and a case-detail view.
type AgencyPage =
  | "home"
  | "services"
  | "work"
  | "blog"
  | "about"
  | "contact"
  | "mentions"
  | "privacy";

const NAV_PAGES: { key: AgencyPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "services", label: "Services" },
  { key: "work", label: "Réalisations" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
];

/* ── Detailed services (Services sub-page — FR, reuses ServiceCard styling) ── */
const SERVICE_DETAILS = [
  {
    icon: <Monitor size={28} />,
    tag: "UI/UX",
    title: "Web Design",
    desc: "Des interfaces sur-mesure pensées au pixel près, guidées par une réflexion UX stratégique qui transforme vos visiteurs en clients.",
    points: [
      "Audit UX et recherche utilisateur",
      "Wireframes & prototypes interactifs",
      "Design systems & composants réutilisables",
      "Interfaces responsive et accessibles",
    ],
  },
  {
    icon: <Code2 size={28} />,
    tag: "Engineering",
    title: "Développement",
    desc: "Des applications performantes bâties sur des stacks modernes, avec des intégrations fluides et une fiabilité à toute épreuve.",
    points: [
      "Next.js, React, Node.js, TypeScript",
      "Sites vitrines & applications sur-mesure",
      "Intégrations API et back-office",
      "CI/CD, tests et mise en production",
    ],
  },
  {
    icon: <Palette size={28} />,
    tag: "Identity",
    title: "Branding",
    desc: "Des identités visuelles distinctives qui résonnent profondément avec votre audience et vous démarquent de la concurrence.",
    points: [
      "Logo & charte graphique",
      "Direction artistique",
      "Déclinaisons print & digital",
      "Guidelines de marque",
    ],
  },
  {
    icon: <Layers size={28} />,
    tag: "Growth",
    title: "Stratégie",
    desc: "Des stratégies de croissance pilotées par la donnée, qui se composent dans le temps et fidélisent durablement votre audience.",
    points: [
      "Stratégie de contenu & SEO",
      "Optimisation des tunnels de conversion",
      "Analytics & tableaux de bord",
      "Roadmap produit",
    ],
  },
  {
    icon: <Monitor size={28} />,
    tag: "Animation",
    title: "Motion Design",
    desc: "Des animations cinématiques et micro-interactions qui subliment la perception et rendent chaque point de contact mémorable.",
    points: [
      "Animations d'interface (Framer Motion)",
      "Micro-interactions & transitions",
      "Habillage de marque animé",
      "Prototypes de mouvement",
    ],
  },
  {
    icon: <Code2 size={28} />,
    tag: "Speed",
    title: "Performance",
    desc: "Optimisation des Core Web Vitals, architecture CDN et réglage d'infrastructure pour des temps de chargement sous la seconde.",
    points: [
      "Audit Lighthouse & Core Web Vitals",
      "Optimisation des images & du bundle",
      "Architecture CDN & edge",
      "Monitoring de performance",
    ],
  },
];

/* ── Fuller portfolio for the Réalisations sub-page (reuses WorkCard styling) ── */
const WORK_DETAILS = [
  {
    id: 1,
    title: "Aether Labs",
    category: "Web Ecosystem",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Refonte complète de l'écosystème web d'un laboratoire de R&D : design system, site institutionnel et portail client.",
    role: "Design, Développement, Branding",
    result: "+180 % de leads qualifiés en six mois.",
  },
  {
    id: 2,
    title: "Noir Studio",
    category: "Brand Identity",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Création de l'identité visuelle d'un studio de production : logo, charte, déclinaisons print et digitales.",
    role: "Branding, Direction artistique",
    result: "Une marque reconnaissable, primée au Brand Awards 2025.",
  },
  {
    id: 3,
    title: "Prisme Finance",
    category: "Fintech App",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Conception et développement d'une application fintech mobile-first, du wireframe au lancement.",
    role: "UI/UX, Développement",
    result: "Note de 4,8/5 sur les stores dès le premier mois.",
  },
  {
    id: 4,
    title: "Lumina Health",
    category: "Healthcare Portal",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Portail patient sécurisé et accessible (WCAG 2.2 AA) pour un acteur de la santé.",
    role: "UX, Accessibilité, Développement",
    result: "Conformité RGAA et réduction de 40 % des appels au support.",
  },
  {
    id: 5,
    title: "Onyx Records",
    category: "E-commerce",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Boutique en ligne d'un label musical indépendant, immersive et performante.",
    role: "Design, Développement, Motion",
    result: "Taux de conversion multiplié par 2,3.",
  },
  {
    id: 6,
    title: "Solaris AI",
    category: "SaaS Platform",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1200&auto=format&fit=crop",
    summary:
      "Plateforme SaaS d'intelligence artificielle : marketing site, app et design system.",
    role: "Design system, Développement",
    result: "Onboarding accéléré et churn divisé par deux.",
  },
];

/* ── Blog mock articles (FR — web / design / marketing insights) ── */
const BLOG_POSTS = [
  {
    slug: "core-web-vitals",
    title: "Core Web Vitals : pourquoi la performance est devenue un argument de vente",
    date: "4 juin 2026",
    category: "Performance",
    excerpt:
      "Au-delà du référencement, la vitesse de chargement façonne directement la perception de votre marque et votre taux de conversion.",
    body: [
      "Les Core Web Vitals — LCP, INP et CLS — ne sont plus de simples métriques techniques. Ils mesurent l'expérience réelle vécue par vos visiteurs et conditionnent à la fois votre référencement et votre crédibilité de marque.",
      "Le LCP (Largest Contentful Paint) traduit le temps perçu avant que la page ne soit utile. Sous 2,5 secondes, l'utilisateur a le sentiment d'un site rapide ; au-delà de 4 secondes, le taux de rebond explose. L'optimisation passe par le préchargement des ressources critiques, le redimensionnement des images et un CDN bien configuré.",
      "L'INP (Interaction to Next Paint) mesure la réactivité aux interactions. Un bouton qui répond instantanément inspire confiance ; une latence de quelques centaines de millisecondes suffit à donner une impression de site « cassé ». La clé : alléger le JavaScript exécuté au moment de l'interaction.",
      "Notre conviction : la performance n'est pas un sujet d'ingénieurs, c'est un sujet de direction. Un site rapide convertit mieux, se positionne mieux et renvoie l'image d'une marque sérieuse. Nous l'intégrons dès la phase de design.",
    ],
  },
  {
    slug: "design-system",
    title: "Design system : l'investissement qui accélère toutes vos sorties",
    date: "22 mai 2026",
    category: "Design",
    excerpt:
      "Un design system bien pensé n'est pas un luxe d'agence : c'est l'outil qui aligne design et développement et divise vos délais.",
    body: [
      "Un design system est une bibliothèque vivante de composants, de tokens et de règles qui garantit la cohérence visuelle d'un produit. Mais sa vraie valeur est ailleurs : il transforme la manière dont design et développement collaborent.",
      "Sans système, chaque nouvelle page se réinvente : couleurs approximatives, espacements incohérents, composants dupliqués. Avec un système, designers et développeurs parlent le même langage — un « bouton primaire » désigne exactement la même chose des deux côtés.",
      "Les tokens de design (couleurs, typographies, espacements) sont le socle. Centralisés, ils permettent de faire évoluer toute une marque depuis une seule source de vérité, sans repasser sur des centaines d'écrans.",
      "Le retour sur investissement se mesure dans le temps : les premières semaines sont plus lentes, mais chaque sortie suivante est plus rapide, plus cohérente et moins sujette aux bugs. C'est l'effet composé du design.",
    ],
  },
  {
    slug: "tunnel-conversion",
    title: "Tunnel de conversion : cinq frictions qui vous coûtent des clients",
    date: "9 mai 2026",
    category: "Marketing",
    excerpt:
      "La plupart des sites ne perdent pas leurs visiteurs par manque de trafic, mais par excès de friction. Revue des points de fuite les plus courants.",
    body: [
      "Un tunnel de conversion est le parcours qui mène un visiteur de la découverte à l'action souhaitée — achat, prise de contact, inscription. Chaque étape superflue est une porte de sortie potentielle.",
      "Première friction : un appel à l'action ambigu. Un visiteur doit comprendre en une seconde ce qu'on attend de lui. Multiplier les boutons concurrents dilue l'attention et fait chuter les conversions.",
      "Deuxième friction : les formulaires trop longs. Chaque champ supplémentaire réduit le taux de complétion. Ne demandez que l'essentiel ; le reste se collecte plus tard.",
      "Troisième friction : l'absence de réassurance. Témoignages, logos clients, garanties et indicateurs de sécurité lèvent les freins à l'action au moment décisif. La confiance se construit visuellement, à l'endroit exact de l'hésitation.",
    ],
  },
  {
    slug: "motion-design",
    title: "Motion design : quand l'animation sert l'expérience (et quand elle la dessert)",
    date: "24 avril 2026",
    category: "Design",
    excerpt:
      "Bien dosée, l'animation guide le regard et fluidifie l'expérience. Mal utilisée, elle ralentit et agace. Où se situe la juste mesure ?",
    body: [
      "Le motion design regroupe l'ensemble des animations d'interface : transitions de page, micro-interactions, effets au survol. Son rôle n'est pas décoratif : il est fonctionnel.",
      "Une bonne animation a un but : confirmer une action, orienter l'attention, expliquer une transition spatiale. Lorsqu'un panneau glisse depuis la droite, l'utilisateur comprend instinctivement où il pourra le retrouver.",
      "À l'inverse, l'animation gratuite nuit. Une transition trop longue donne une impression de lenteur ; un effet trop appuyé distrait du contenu. La règle d'or : la plupart des animations d'interface devraient durer entre 150 et 400 millisecondes.",
      "Nous concevons le mouvement comme un langage discret. L'utilisateur ne doit pas remarquer l'animation : il doit simplement trouver l'expérience fluide, naturelle et agréable.",
    ],
  },
];

/* ── Team & values for the À propos sub-page ── */
const TEAM = [
  {
    name: "Léa Fontaine",
    role: "Directrice de création",
    focus: "Direction artistique, Branding",
    bio: "Léa pilote la vision créative du studio. Quinze ans d'expérience entre Paris et Londres, au service de marques qui veulent marquer les esprits.",
  },
  {
    name: "Thomas Reyes",
    role: "Lead Développeur",
    focus: "Architecture, Performance",
    bio: "Thomas traduit le design en code propre, rapide et durable. Spécialiste Next.js et des architectures qui tiennent la charge en production.",
  },
  {
    name: "Camille Aubry",
    role: "Stratège produit",
    focus: "UX, Conversion, Growth",
    bio: "Camille relie la créativité aux résultats. Recherche utilisateur, optimisation des conversions et stratégie de croissance pilotée par la donnée.",
  },
];

const VALUES = [
  {
    icon: <Palette size={24} />,
    title: "Le détail",
    text: "Chaque pixel est intentionnel. Nous croyons que l'excellence se loge dans les détails que personne ne remarque consciemment.",
  },
  {
    icon: <Code2 size={24} />,
    title: "La rigueur",
    text: "Du design au code, nous anticipons les cas limites et bâtissons pour durer. Un beau site qui casse n'est qu'une promesse trahie.",
  },
  {
    icon: <Layers size={24} />,
    title: "L'impact",
    text: "Le beau qui ne convertit pas n'est que décoration. Nous mesurons notre réussite à l'aune des résultats de nos clients.",
  },
];

/* ─────────────────────────────────────────────────────────────
   GOOGLE FONTS INJECTION
   ───────────────────────────────────────────────────────────── */
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────
   CLIP-PATH HEADING REVEAL (IntersectionObserver)
   ───────────────────────────────────────────────────────────── */
function ClipRevealHeading({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          clipPath: revealed
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
          transition: `clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          transform: revealed ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FADE-UP REVEAL (generic)
   ───────────────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD (case study card)
   ───────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / (rect.width / 2);
      const relY = (e.clientY - centerY) / (rect.height / 2);
      rotateY.set(relX * 10);
      rotateX.set(-relY * 10);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        perspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────────────────────── */
function Counter({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, count]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: "clamp(3rem, 6vw, 5rem)",
          lineHeight: 1,
          color: T.text,
          letterSpacing: "-0.02em",
        }}
      >
        {displayValue}
        <span style={{ color: T.accent }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: T.muted,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV LINK
   ───────────────────────────────────────────────────────────── */
function NavLink({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: FONT_BODY,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: active || hovered ? T.text : T.muted,
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "4px 0",
        transition: "color 0.25s ease",
      }}
    >
      {label}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 1,
          width: active || hovered ? "100%" : 0,
          background: T.accent,
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function ImpactAgencyTemplate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState<AgencyPage>("home");
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  /* ── Page navigation (additive) ── */
  const goTo = useCallback((p: AgencyPage) => {
    setMenuOpen(false);
    setBlogSlug(null);
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* ── Hero parallax ── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 900], [0, 270]); // 0.3x
  const heroTextY = useTransform(scrollY, [0, 900], [0, 0]);  // 1x (natural)
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  /* ── Scroll progress bar ── */
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* ── Process sticky section ── */
  const processContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: processContainerRef,
    offset: ["start start", "end end"],
  });
  const activeStep = useTransform(processProgress, [0, 1], [0, 3.99]);

  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const unsubscribe = activeStep.on("change", (v) => {
      setCurrentStep(Math.min(3, Math.floor(v)));
    });
    return unsubscribe;
  }, [activeStep]);

  // Smooth-scroll to a home section. If we're on another page, switch to home
  // first, then scroll once the section is mounted.
  const scrollTo = useCallback(
    (id: string) => {
      setMenuOpen(false);
      if (page !== "home") {
        setBlogSlug(null);
        setPage("home");
        if (typeof window !== "undefined") {
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            )
          );
        }
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    [page]
  );

  /* ─────────────────────────────────── */
  return (
    <div
      ref={pageRef}
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: FONT_BODY,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <FontLoader />

      {/* ── Scroll progress bar ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: progressWidth,
          height: 2,
          background: T.accent,
          zIndex: 200,
          transformOrigin: "left",
        }}
      />

      {/* ══════════════════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          padding: "28px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Frosted backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.7)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
          }}
        />

        {/* Logo */}
        <button
          onClick={() => goTo("home")}
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.02em",
            color: T.text,
            textDecoration: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          IMPACT<span style={{ color: T.accent }}>.</span>
        </button>

        {/* Desktop nav */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
          className="nav-desktop"
        >
          {NAV_PAGES.map((item) => (
            <NavLink
              key={item.key}
              label={item.label}
              active={page === item.key}
              onClick={() => goTo(item.key)}
            />
          ))}
          <button
            onClick={() => goTo("contact")}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: T.text,
              background: T.accent,
              border: "none",
              borderRadius: 100,
              padding: "10px 24px",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            Let&apos;s Talk
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: "relative",
            zIndex: 1,
            background: "none",
            border: "none",
            color: T.text,
            cursor: "pointer",
            display: "none",
          }}
          className="nav-mobile-toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(10,10,10,0.96)",
              backdropFilter: "blur(32px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            {NAV_PAGES.map((item, i) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => goTo(item.key)}
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: page === item.key ? T.accent : T.text,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ HOME (original single-page content — unchanged) ══════════ */}
      {page === "home" && (
        <>
      {/* ══════════════════════════════════════════════════
          HERO — scroll-parallax background + text reveal
          ══════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "110vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Parallax background layer — moves at 0.3x scroll speed */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-20%",
            y: heroBgY,
            zIndex: 0,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"
            alt="Hero background"
            fill
            priority
            style={{ objectFit: "cover", opacity: 0.06 }}
          />
        </motion.div>

        {/* Electric blue radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(0,102,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(240,240,240,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,240,0.4) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            pointerEvents: "none",
          }}
        />

        {/* Foreground text — moves at natural 1x (stays in place) */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            y: heroTextY,
            opacity: heroOpacity,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 20px",
              borderRadius: 100,
              border: `1px solid ${T.accentBorder}`,
              background: T.accentDim,
              marginBottom: 40,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.accent,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: T.accent,
              }}
            >
              Premium Digital Agency
            </span>
          </motion.div>

          {/* Headline — slides up from bottom on load */}
          <div style={{ overflow: "hidden", marginBottom: 12 }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.55,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(3.6rem, 9vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                margin: 0,
                color: T.text,
              }}
            >
              We build the
            </motion.h1>
          </div>

          <div style={{ overflow: "hidden", marginBottom: 32 }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.72,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(3.6rem, 9vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                margin: 0,
                color: T.accent,
              }}
            >
              internet&apos;s best.
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.9 }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              lineHeight: 1.7,
              color: T.muted,
              maxWidth: 600,
              margin: "0 auto 56px",
            }}
          >
            Full-service creative studio crafting immersive digital experiences,
            brand identities, and high-performance products for ambitious brands.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              onClick={() => scrollTo("work")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                background: T.text,
                color: T.bg,
                border: "none",
                borderRadius: 100,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.accent;
                e.currentTarget.style.color = T.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.text;
                e.currentTarget.style.color = T.bg;
              }}
            >
              View Work <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("services")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                background: "transparent",
                color: T.text,
                border: `1px solid ${T.border}`,
                borderRadius: 100,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                cursor: "pointer",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.accent;
                e.currentTarget.style.color = T.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.text;
              }}
            >
              Our Services
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: T.dimmed,
              fontWeight: 600,
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronDown size={16} color={T.dimmed} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT
          ══════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: "140px 48px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <FadeUp>
          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              We don&apos;t just
              <br />
              <span style={{ color: T.accent }}>build websites.</span>
              <br />
              We build empires.
            </h2>
          </ClipRevealHeading>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: T.muted,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Founded in 2018, IMPACT studio is a collective of designers,
              engineers, and strategists obsessed with excellence. We partner
              with ambitious brands — from seed-stage startups to Fortune 500
              companies — delivering work that consistently outperforms.
            </p>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: T.dimmed,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Every pixel is intentional. Every interaction is engineered.
              Every line of code is written to last. We combine aesthetic
              excellence with measurable business impact because beautiful
              work that doesn&apos;t convert is just decoration.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 12,
              }}
            >
              {["Strategic Thinking", "Pixel Perfection", "Clean Code", "Fast Delivery"].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: T.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        color: T.text,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES — 3D tilt cards with scroll stagger
          ══════════════════════════════════════════════════ */}
      <section
        id="services"
        style={{
          padding: "120px 48px",
          background: "rgba(240,240,240,0.015)",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ marginBottom: 72 }}>
            <FadeUp>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: T.accent,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                What we do
              </span>
            </FadeUp>
            <ClipRevealHeading>
              <h2
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  margin: 0,
                  color: T.text,
                }}
              >
                Services built
                <br />
                <span style={{ color: T.dimmed }}>for impact.</span>
              </h2>
            </ClipRevealHeading>
          </div>

          {/* 3D cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {SERVICES.map((service, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <TiltCard>
                  <ServiceCard service={service} />
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROCESS — sticky scroll sequence
          ══════════════════════════════════════════════════ */}
      <section
        id="process"
        style={{
          padding: "120px 0 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px",
            marginBottom: 72,
          }}
        >
          <FadeUp>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: T.accent,
                display: "block",
                marginBottom: 20,
              }}
            >
              How we work
            </span>
          </FadeUp>
          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
                color: T.text,
              }}
            >
              Our process,
              <br />
              <span style={{ color: T.dimmed }}>step by step.</span>
            </h2>
          </ClipRevealHeading>
        </div>

        {/* Sticky scroll container — 400vh so user scrolls through 4 steps */}
        <div
          ref={processContainerRef}
          style={{ position: "relative", height: "400vh" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                width: "100%",
                padding: "0 48px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 80,
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              {/* Step indicators */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStepIndicator
                    key={i}
                    step={step}
                    index={i}
                    active={currentStep === i}
                    past={currentStep > i}
                  />
                ))}
              </div>

              {/* Step detail — animated panel */}
              <div style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      padding: 48,
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 24,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Blue accent corner */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        background: T.accent,
                        borderRadius: "24px 0 0 24px",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: "5rem",
                        color: T.accentDim,
                        lineHeight: 1,
                        marginBottom: 16,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {PROCESS_STEPS[currentStep].number}
                    </div>
                    <h3
                      style={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: "2rem",
                        letterSpacing: "-0.02em",
                        margin: "0 0 20px",
                        color: T.text,
                      }}
                    >
                      {PROCESS_STEPS[currentStep].title}
                    </h3>
                    <p
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "1.05rem",
                        lineHeight: 1.72,
                        color: T.muted,
                        margin: "0 0 24px",
                        fontWeight: 300,
                      }}
                    >
                      {PROCESS_STEPS[currentStep].desc}
                    </p>
                    <div
                      style={{
                        padding: "14px 18px",
                        background: T.accentDim,
                        border: `1px solid ${T.accentBorder}`,
                        borderRadius: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: "0.78rem",
                          color: T.accent,
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {PROCESS_STEPS[currentStep].detail}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — animated counters
          ══════════════════════════════════════════════════ */}
      <section
        id="stats"
        style={{
          padding: "140px 48px",
          borderTop: `1px solid ${T.border}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
            textAlign: "center",
          }}
        >
          {STATS_DATA.map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <Counter
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
              />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WORK GRID — 3D tilt image cards
          ══════════════════════════════════════════════════ */}
      <section
        id="work"
        style={{
          padding: "120px 48px",
          borderTop: `1px solid ${T.border}`,
          background: "rgba(240,240,240,0.015)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
              gap: 24,
            }}
          >
            <div>
              <FadeUp>
                <span
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    color: T.accent,
                    display: "block",
                    marginBottom: 20,
                  }}
                >
                  Selected work
                </span>
              </FadeUp>
              <ClipRevealHeading>
                <h2
                  style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.95,
                    margin: 0,
                    color: T.text,
                  }}
                >
                  Recent
                  <br />
                  <span style={{ color: T.dimmed }}>projects.</span>
                </h2>
              </ClipRevealHeading>
            </div>
            <FadeUp>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: T.accent,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                All Projects <ArrowRight size={14} />
              </button>
            </FadeUp>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {PROJECTS.map((project, i) => (
              <FadeUp key={project.id} delay={i * 0.07}>
                <TiltCard>
                  <WorkCard project={project} />
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          padding: "140px 48px",
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: T.accent,
                display: "block",
                marginBottom: 28,
              }}
            >
              Get in touch
            </span>
          </FadeUp>

          <ClipRevealHeading>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                margin: "0 0 32px",
                color: T.text,
              }}
            >
              Ready to build
              <br />
              something great?
            </h2>
          </ClipRevealHeading>

          <FadeUp delay={0.15}>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: T.muted,
                fontWeight: 300,
                maxWidth: 560,
                margin: "0 auto 56px",
              }}
            >
              We work with a select number of clients each quarter. If you have
              a project in mind, let&apos;s talk before spots fill.
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 80,
              }}
            >
              <a
                href="mailto:hello@impact.studio"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  background: T.accent,
                  color: T.text,
                  border: "none",
                  borderRadius: 100,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Mail size={16} /> hello@impact.studio
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  background: "transparent",
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  borderRadius: 100,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = T.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = T.border)
                }
              >
                Schedule a Call
              </a>
            </div>
          </FadeUp>

          {/* Contact info row */}
          <FadeUp delay={0.3}>
            <div
              style={{
                display: "flex",
                gap: 48,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: <Mail size={14} />, value: "hello@impact.studio" },
                { icon: <Phone size={14} />, value: "+33 1 42 86 00 00" },
                { icon: <MapPin size={14} />, value: "Paris, France" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: T.dimmed,
                    fontFamily: FONT_BODY,
                    fontSize: "0.82rem",
                    fontWeight: 400,
                  }}
                >
                  {item.icon}
                  {item.value}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
        </>
      )}

      {/* ══════════ EXTRA PAGES (theme-native — built from T tokens) ══════════ */}
      {page === "services" && <ServicesPage goTo={goTo} />}
      {page === "work" && <WorkPage goTo={goTo} />}
      {page === "blog" && (
        <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />
      )}
      {page === "about" && <AboutPage goTo={goTo} />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: "48px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            color: T.text,
          }}
        >
          IMPACT<span style={{ color: T.accent }}>.</span>
        </span>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.75rem",
            color: T.dimmed,
            fontWeight: 400,
          }}
        >
          &copy; 2026 IMPACT Studio. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Mentions légales", page: "mentions" as AgencyPage },
            { label: "Confidentialité", page: "privacy" as AgencyPage },
            { label: "Contact", page: "contact" as AgencyPage },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => goTo(item.page)}
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.75rem",
                color: T.dimmed,
                textDecoration: "none",
                transition: "color 0.2s ease",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.dimmed)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </footer>

      {/* ── Responsive overrides via style tag ── */}
      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (max-width: 768px) {
          section[id="about"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          section[id="stats"] > div {
            grid-template-columns: 1fr 1fr !important;
          }
          section[id="services"] > div > div:last-child,
          section[id="work"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          section[id="process"] > div:last-child > div > div > div {
            grid-template-columns: 1fr !important;
          }
          .subpage-grid-3 { grid-template-columns: 1fr !important; }
          .subpage-grid-2 { grid-template-columns: 1fr !important; }
          .subpage-contact { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SERVICE CARD (extracted — used inside TiltCard)
   ───────────────────────────────────────────────────────────── */
function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[0];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "40px 36px",
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.accentBorder : T.border}`,
        borderRadius: 20,
        cursor: "pointer",
        transition:
          "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        boxShadow: hovered
          ? "0 32px 80px rgba(0,102,255,0.08)"
          : "none",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient shimmer on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${T.accent}, transparent)`
            : "transparent",
          transition: "background 0.4s ease",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: hovered ? T.accent : T.accentDim,
            border: `1px solid ${hovered ? T.accent : T.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.text,
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          {service.icon}
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.62rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: T.dimmed,
            border: `1px solid ${T.border}`,
            borderRadius: 100,
            padding: "4px 12px",
          }}
        >
          {service.tag}
        </span>
      </div>
      <h3
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-0.02em",
          margin: "0 0 14px",
          color: hovered ? T.accent : T.text,
          transition: "color 0.3s ease",
        }}
      >
        {service.title}
      </h3>
      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: T.muted,
          margin: "0 0 24px",
          fontWeight: 300,
        }}
      >
        {service.desc}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_BODY,
          fontSize: "0.78rem",
          fontWeight: 600,
          color: T.accent,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        Learn more <ArrowUpRight size={14} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WORK CARD (extracted — used inside TiltCard)
   ───────────────────────────────────────────────────────────── */
function WorkCard({ project }: { project: (typeof PROJECTS)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", borderRadius: 20, overflow: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: T.dimmed,
          overflow: "hidden",
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          style={{
            objectFit: "cover",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.68rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: T.accent,
              background: T.accentDim,
              border: `1px solid ${T.accentBorder}`,
              padding: "6px 14px",
              borderRadius: 100,
            }}
          >
            {project.category}
          </span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={16} color={T.bg} />
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "20px 4px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.02em",
              margin: "0 0 4px",
              color: hovered ? T.accent : T.text,
              transition: "color 0.3s ease",
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.78rem",
              color: T.muted,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {project.category}
          </p>
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.75rem",
            color: T.dimmed,
            fontWeight: 400,
          }}
        >
          {project.year}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROCESS STEP INDICATOR
   ───────────────────────────────────────────────────────────── */
function ProcessStepIndicator({
  step,
  index,
  active,
  past,
}: {
  step: (typeof PROCESS_STEPS)[0];
  index: number;
  active: boolean;
  past: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "24px 0",
        borderBottom: `1px solid ${T.border}`,
        transition: "opacity 0.4s ease",
        opacity: past ? 0.35 : 1,
      }}
    >
      {/* Step number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: active ? T.accent : past ? T.dimmed : "transparent",
            border: `2px solid ${active ? T.accent : past ? T.dimmed : T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.4s ease, border-color 0.4s ease",
            flexShrink: 0,
          }}
        >
          {past ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.5 7L6 10.5L11.5 3.5"
                stroke={T.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "0.7rem",
                color: active ? T.text : T.muted,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "-0.02em",
            color: active ? T.text : T.muted,
            transition: "color 0.4s ease",
          }}
        >
          {step.title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.8rem",
            color: T.dimmed,
            marginTop: 2,
            maxWidth: 340,
            fontWeight: 300,
            lineHeight: 1.5,
            display: active ? "block" : "none",
          }}
        >
          {step.desc}
        </div>
      </div>

      {active && (
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight size={20} color={T.accent} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-PAGES (additive — theme-native, reuse T tokens + fonts + cards)
   ═══════════════════════════════════════════════════════════════ */

/* ── Shared sub-page hero (matches home's eyebrow + clip-reveal heading) ── */
function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        padding: "180px 48px 80px",
        borderBottom: `1px solid ${T.border}`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,102,255,0.10) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "linear-gradient(rgba(240,240,240,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,240,0.4) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.68rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: T.accent,
              display: "block",
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </span>
        </FadeUp>
        <ClipRevealHeading>
          <h1
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 6vw, 6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              margin: 0,
              color: T.text,
            }}
          >
            {title}
            {accent && (
              <>
                {" "}
                <span style={{ color: T.accent }}>{accent}</span>
              </>
            )}
          </h1>
        </ClipRevealHeading>
        {subtitle && (
          <FadeUp delay={0.15}>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                lineHeight: 1.7,
                color: T.muted,
                maxWidth: 620,
                margin: "32px 0 0",
              }}
            >
              {subtitle}
            </p>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

/* ── CTA band reused across sub-pages ── */
function SubCTA({
  goTo,
  title,
  text,
}: {
  goTo: (p: AgencyPage) => void;
  title: string;
  text: string;
}) {
  return (
    <FadeUp>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "56px clamp(32px, 6vw, 64px)",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          boxSizing: "border-box",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              color: T.text,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "1rem",
              lineHeight: 1.6,
              color: T.muted,
              margin: 0,
              fontWeight: 300,
              maxWidth: 520,
            }}
          >
            {text}
          </p>
        </div>
        <button
          onClick={() => goTo("contact")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 36px",
            background: T.accent,
            color: T.text,
            border: "none",
            borderRadius: 100,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            cursor: "pointer",
            flexShrink: 0,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Discutons-en <ArrowRight size={16} />
        </button>
      </div>
    </FadeUp>
  );
}

/* ── SERVICES sub-page (detailed offerings, reuses ServiceCard look) ── */
function ServicesPage({ goTo }: { goTo: (p: AgencyPage) => void }) {
  return (
    <div>
      <PageHero
        eyebrow="Ce que nous faisons"
        title="Des services"
        accent="taillés pour l'impact."
        subtitle="Du design à la mise en production, nous couvrons tout le spectre du digital. Chaque prestation est conçue pour servir un objectif business mesurable."
      />
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="subpage-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {SERVICE_DETAILS.map((service, i) => (
              <FadeUp key={service.title} delay={(i % 3) * 0.08}>
                <TiltCard>
                  <ServiceDetailCard service={service} />
                </TiltCard>
              </FadeUp>
            ))}
          </div>
          <div style={{ marginTop: 64 }}>
            <SubCTA
              goTo={goTo}
              title="Un projet en tête ?"
              text="Nous travaillons avec un nombre limité de clients chaque trimestre. Parlons de votre projet avant que les places ne soient prises."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceDetailCard({
  service,
}: {
  service: (typeof SERVICE_DETAILS)[0];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "40px 36px",
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.accentBorder : T.border}`,
        borderRadius: 20,
        transition:
          "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        boxShadow: hovered ? "0 32px 80px rgba(0,102,255,0.08)" : "none",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: hovered ? T.accent : T.accentDim,
            border: `1px solid ${hovered ? T.accent : T.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.text,
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          {service.icon}
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.62rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: T.dimmed,
            border: `1px solid ${T.border}`,
            borderRadius: 100,
            padding: "4px 12px",
          }}
        >
          {service.tag}
        </span>
      </div>
      <h3
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-0.02em",
          margin: "0 0 14px",
          color: hovered ? T.accent : T.text,
          transition: "color 0.3s ease",
        }}
      >
        {service.title}
      </h3>
      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: T.muted,
          margin: "0 0 24px",
          fontWeight: 300,
        }}
      >
        {service.desc}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {service.points.map((pt) => (
          <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.accent,
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.85rem",
                fontWeight: 400,
                color: T.text,
                lineHeight: 1.5,
              }}
            >
              {pt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── RÉALISATIONS sub-page (fuller grid + case-detail view) ── */
function WorkPage({ goTo }: { goTo: (p: AgencyPage) => void }) {
  const [caseId, setCaseId] = useState<number | null>(null);
  const project = caseId ? WORK_DETAILS.find((p) => p.id === caseId) : null;

  if (project) {
    return (
      <div>
        <section style={{ padding: "150px 48px 100px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <button
              onClick={() => setCaseId(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontSize: "0.78rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 40,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Toutes les
              réalisations
            </button>
            <FadeUp>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: T.accent,
                  display: "block",
                  marginBottom: 18,
                }}
              >
                {project.category} · {project.year}
              </span>
              <h1
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "clamp(2.6rem, 5vw, 5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  margin: "0 0 40px",
                  color: T.text,
                }}
              >
                {project.title}
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: `1px solid ${T.border}`,
                  marginBottom: 48,
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div
                className="subpage-grid-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 48,
                  alignItems: "start",
                }}
              >
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    color: T.muted,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {project.summary}
                </p>
                <div
                  style={{
                    padding: 28,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                  }}
                >
                  {[
                    { label: "Notre rôle", val: project.role },
                    { label: "Année", val: project.year },
                    { label: "Résultat", val: project.result },
                  ].map((item) => (
                    <div key={item.label} style={{ marginBottom: 20 }}>
                      <div
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: "0.62rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          color: T.accent,
                          marginBottom: 6,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: "0.92rem",
                          color: T.text,
                          fontWeight: 400,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <div style={{ marginTop: 72 }}>
              <SubCTA
                goTo={goTo}
                title="Un projet similaire ?"
                text="Racontez-nous votre ambition. Nous reviendrons vers vous sous 24 heures ouvrées."
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Travaux sélectionnés"
        title="Nos"
        accent="réalisations."
        subtitle="Une sélection de projets récents. Chaque collaboration vise un objectif clair et des résultats mesurables."
      />
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="subpage-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {WORK_DETAILS.map((project, i) => (
              <FadeUp key={project.id} delay={(i % 3) * 0.07}>
                <div onClick={() => setCaseId(project.id)}>
                  <TiltCard>
                    <WorkCard project={project} />
                  </TiltCard>
                </div>
              </FadeUp>
            ))}
          </div>
          <div style={{ marginTop: 64 }}>
            <SubCTA
              goTo={goTo}
              title="Prêt à rejoindre cette liste ?"
              text="Nous concevons des produits digitaux qui marquent. Parlons de votre projet."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── BLOG sub-page (index + single article) ── */
function BlogPage({
  blogSlug,
  setBlogSlug,
}: {
  blogSlug: string | null;
  setBlogSlug: (s: string | null) => void;
}) {
  const post = blogSlug ? BLOG_POSTS.find((b) => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div>
        <section style={{ padding: "150px 48px 100px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <button
              onClick={() => setBlogSlug(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontSize: "0.78rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 40,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Tous les
              articles
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: T.accent,
                  background: T.accentDim,
                  border: `1px solid ${T.accentBorder}`,
                  padding: "5px 12px",
                  borderRadius: 100,
                }}
              >
                {post.category}
              </span>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.8rem",
                  color: T.dimmed,
                }}
              >
                {post.date}
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                margin: "0 0 40px",
                color: T.text,
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                height: "clamp(200px, 36vw, 340px)",
                borderRadius: 20,
                border: `1px solid ${T.border}`,
                background:
                  "radial-gradient(ellipse 80% 80% at 30% 30%, rgba(0,102,255,0.18) 0%, transparent 70%), #0e0e0e",
                marginBottom: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={48} color={T.accent} style={{ opacity: 0.5 }} />
            </div>
            {post.body.map((paraTxt, i) => (
              <p
                key={i}
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "1.08rem",
                  lineHeight: 1.85,
                  color: T.muted,
                  marginBottom: 26,
                  fontWeight: 300,
                }}
              >
                {paraTxt}
              </p>
            ))}
            <div
              style={{
                borderTop: `1px solid ${T.border}`,
                marginTop: 32,
                paddingTop: 24,
                fontFamily: FONT_BODY,
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: T.dimmed,
              }}
            >
              Article rédigé par l&apos;équipe d&apos;IMPACT Studio. Contenu fourni à titre
              informatif.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Le journal du studio"
        title="Insights"
        accent="& réflexions."
        subtitle="Nos partis pris sur le web, le design et le marketing. Des analyses concrètes pour des décisions éclairées."
      />
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="subpage-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {BLOG_POSTS.map((p, i) => (
              <FadeUp key={p.slug} delay={(i % 3) * 0.08}>
                <BlogCard
                  post={p}
                  onClick={() => {
                    setBlogSlug(p.slug);
                    if (typeof window !== "undefined")
                      window.scrollTo({ top: 0, behavior: "auto" });
                  }}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogCard({
  post,
  onClick,
}: {
  post: (typeof BLOG_POSTS)[0];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 20,
        overflow: "hidden",
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${hovered ? T.accentBorder : T.border}`,
        transition: "background 0.35s ease, border-color 0.35s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 170,
          background:
            "radial-gradient(ellipse 80% 80% at 30% 30%, rgba(0,102,255,0.16) 0%, transparent 70%), #0e0e0e",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Layers size={32} color={T.accent} style={{ opacity: 0.45 }} />
      </div>
      <div
        style={{
          padding: "26px 28px 30px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.6rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: T.accent,
            }}
          >
            {post.category}
          </span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: "0.72rem",
              color: T.dimmed,
            }}
          >
            · {post.date}
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "1.25rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: "0 0 14px",
            color: hovered ? T.accent : T.text,
            transition: "color 0.3s ease",
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.9rem",
            lineHeight: 1.65,
            color: T.muted,
            margin: "0 0 18px",
            flex: 1,
            fontWeight: 300,
          }}
        >
          {post.excerpt}
        </p>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: "0.78rem",
            color: T.accent,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Lire l&apos;article <ArrowUpRight size={14} />
        </span>
      </div>
    </article>
  );
}

/* ── À PROPOS sub-page (story / values / team) ── */
function AboutPage({ goTo }: { goTo: (p: AgencyPage) => void }) {
  return (
    <div>
      <PageHero
        eyebrow="Le studio"
        title="Nous ne construisons pas"
        accent="que des sites."
        subtitle="IMPACT est un collectif de designers, d'ingénieurs et de stratèges obsédés par l'excellence. Depuis 2018, nous accompagnons des marques ambitieuses."
      />

      {/* Story */}
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {[
            "Fondé en 2018, IMPACT Studio est né d'une conviction simple : le digital mérite la même exigence que les marques qu'il sert. Nous réunissons design, ingénierie et stratégie sous un même toit pour livrer un travail qui surperforme, systématiquement.",
            "Notre modèle est celui d'un studio à taille humaine. Chaque projet est piloté de bout en bout par une équipe restreinte et senior — garantie de réactivité, de cohérence et d'un niveau de soin qui se voit dans le résultat final.",
            "En huit ans, nous avons accompagné plus de 147 clients à travers le monde, des start-ups en amorçage aux grands comptes, avec un taux de satisfaction de 98 %. Le beau qui ne convertit pas n'est que décoration : nous mesurons notre réussite à la vôtre.",
          ].map((paraTxt, i) => (
            <p
              key={i}
              style={{
                fontFamily: FONT_BODY,
                fontSize: "1.1rem",
                lineHeight: 1.85,
                color: T.muted,
                marginBottom: 26,
                fontWeight: 300,
              }}
            >
              {paraTxt}
            </p>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          padding: "100px 48px",
          background: "rgba(240,240,240,0.015)",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <FadeUp>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: T.accent,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                Nos valeurs
              </span>
            </FadeUp>
            <ClipRevealHeading>
              <h2
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "clamp(2.2rem, 4vw, 4rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  margin: 0,
                  color: T.text,
                }}
              >
                Ce qui nous <span style={{ color: T.dimmed }}>guide.</span>
              </h2>
            </ClipRevealHeading>
          </div>
          <div
            className="subpage-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "40px 36px",
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: T.accentDim,
                      border: `1px solid ${T.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.text,
                      marginBottom: 24,
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      fontSize: "1.35rem",
                      letterSpacing: "-0.02em",
                      margin: "0 0 14px",
                      color: T.text,
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.92rem",
                      lineHeight: 1.7,
                      color: T.muted,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {v.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <FadeUp>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: T.accent,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                L&apos;équipe
              </span>
            </FadeUp>
            <ClipRevealHeading>
              <h2
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: "clamp(2.2rem, 4vw, 4rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  margin: 0,
                  color: T.text,
                }}
              >
                Les esprits <span style={{ color: T.dimmed }}>derrière.</span>
              </h2>
            </ClipRevealHeading>
          </div>
          <div
            className="subpage-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {TEAM.map((member, i) => (
              <FadeUp key={member.name} delay={i * 0.1}>
                <div
                  style={{
                    padding: "40px 36px",
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: T.accentDim,
                      border: `1px solid ${T.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        color: T.accent,
                      }}
                    >
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      margin: "0 0 4px",
                      color: T.text,
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.8rem",
                      color: T.accent,
                      margin: "0 0 4px",
                      fontWeight: 500,
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.72rem",
                      color: T.dimmed,
                      margin: "0 0 18px",
                    }}
                  >
                    {member.focus}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      color: T.muted,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
          <div style={{ marginTop: 72 }}>
            <SubCTA
              goTo={goTo}
              title="Travaillons ensemble."
              text="Une idée, un projet, une ambition ? Nous serions ravis d'en discuter avec vous."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── CONTACT sub-page (info + form, inputs ≥16px) ── */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: T.surface,
    border: `1px solid ${T.border}`,
    color: T.text,
    fontSize: 16, // ≥16px to avoid iOS zoom on focus
    outline: "none",
    fontFamily: FONT_BODY,
    marginBottom: 18,
    borderRadius: 10,
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "0.62rem",
    color: T.accent,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 8,
    display: "block",
  };
  return (
    <div>
      <PageHero
        eyebrow="Entrons en contact"
        title="Discutons de"
        accent="votre projet."
        subtitle="Nous travaillons avec un nombre limité de clients chaque trimestre. Décrivez-nous votre ambition — nous revenons vers vous sous 24 heures ouvrées."
      />
      <section style={{ padding: "100px 48px", boxSizing: "border-box" }}>
        <div
          className="subpage-contact"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 5vw, 72px)",
          }}
        >
          {/* Info */}
          <div>
            {[
              { icon: <Mail size={18} />, label: "Email", value: "contact@aevia.io" },
              { icon: <MapPin size={18} />, label: "Studio", value: "Paris, France" },
              {
                icon: <Phone size={18} />,
                label: "Horaires",
                value: "Lun – Ven · 9h – 19h",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  marginBottom: 28,
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: T.accentDim,
                    border: `1px solid ${T.accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.accent,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.62rem",
                      color: T.accent,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color: T.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: T.muted,
                marginTop: 8,
                fontWeight: 300,
              }}
            >
              Préférez-vous un appel ? Indiquez-le dans votre message et nous vous
              proposerons un créneau.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.accentBorder}`,
                  borderRadius: 20,
                  padding: "56px 40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: T.accentDim,
                    border: `1px solid ${T.accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <ArrowRight size={22} color={T.accent} />
                </div>
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: T.text,
                    marginBottom: 12,
                  }}
                >
                  Message envoyé
                </div>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: T.muted,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  Merci. Un membre du studio vous répondra sous 24 heures ouvrées.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "40px 36px",
                }}
              >
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="votre@email.fr"
                  required
                />
                <label style={labelStyle}>Société</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Nom de votre entreprise"
                />
                <label style={labelStyle}>Type de projet</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Ex. : site vitrine, application, branding…"
                />
                <label style={labelStyle}>Message</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
                  placeholder="Décrivez brièvement votre projet."
                  required
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: T.accent,
                    color: T.text,
                    border: "none",
                    borderRadius: 100,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Envoyer la demande
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── MENTIONS LÉGALES & CONFIDENTIALITÉ ──────────────────────────────
   `mentions` content is verbatim per legal requirement. NEVER print a
   street address. */
function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const sectionTitle: React.CSSProperties = {
    fontFamily: FONT_HEADING,
    fontWeight: 800,
    fontSize: "1.4rem",
    letterSpacing: "-0.02em",
    color: T.text,
    margin: "44px 0 14px",
  };
  const para: React.CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: "1rem",
    color: T.muted,
    lineHeight: 1.8,
    marginBottom: 14,
    fontWeight: 300,
  };
  const strong: React.CSSProperties = { color: T.text, fontWeight: 600 };

  if (variant === "mentions") {
    return (
      <div>
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section style={{ padding: "80px 48px 100px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <h2 style={{ ...sectionTitle, marginTop: 0 }}>Éditeur du site</h2>
            <p style={para}>
              <span style={strong}>Aevia WS</span> — entrepreneur individuel
              (auto-entrepreneur).
            </p>
            <p style={para}>
              Directeur de la publication : <span style={strong}>Valentin Milliand</span>.
            </p>
            <p style={para}>
              SIREN : <span style={strong}>852 546 225</span> — RCS Bourg-en-Bresse.
            </p>
            <p style={para}>
              Contact : <span style={strong}>contact@aevia.io</span>
            </p>
            <p style={para}>
              Adresse du siège social communiquée sur demande à contact@aevia.io.
            </p>

            <h2 style={sectionTitle}>TVA</h2>
            <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 style={sectionTitle}>Hébergeur</h2>
            <p style={para}>
              Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            </p>

            <h2 style={sectionTitle}>Propriété intellectuelle</h2>
            <p style={para}>
              L&apos;ensemble des contenus présents sur ce site (textes, visuels, logo,
              mise en page) est protégé par le droit de la propriété intellectuelle. Toute
              reproduction, même partielle, est interdite sans autorisation préalable de
              l&apos;éditeur.
            </p>

            <h2 style={sectionTitle}>Responsabilité</h2>
            <p style={para}>
              Les informations diffusées sur ce site sont fournies à titre indicatif et ne
              sauraient engager la responsabilité de l&apos;éditeur.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Protection des données" title="Confidentialité" />
      <section style={{ padding: "80px 48px 100px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ ...para, fontStyle: "italic", color: T.dimmed }}>
            Dernière mise à jour : juin 2026.
          </p>

          <h2 style={{ ...sectionTitle, marginTop: 24 }}>Responsable du traitement</h2>
          <p style={para}>
            Le responsable du traitement des données personnelles est{" "}
            <span style={strong}>Aevia WS</span>, éditeur du site. Pour toute question,
            écrivez à <span style={strong}>contact@aevia.io</span>.
          </p>

          <h2 style={sectionTitle}>Données collectées</h2>
          <p style={para}>
            Nous collectons uniquement les données que vous nous transmettez volontairement
            via le formulaire de contact (nom, email, société et message), aux seules fins
            de répondre à votre demande.
          </p>

          <h2 style={sectionTitle}>Finalité et base légale</h2>
          <p style={para}>
            Vos données sont traitées sur la base de votre consentement et de
            l&apos;intérêt légitime du studio à répondre aux sollicitations. Elles ne font
            l&apos;objet d&apos;aucune cession à des tiers à des fins commerciales.
          </p>

          <h2 style={sectionTitle}>Durée de conservation</h2>
          <p style={para}>
            Les données issues du formulaire de contact sont conservées le temps nécessaire
            au traitement de votre demande, puis archivées ou supprimées conformément aux
            obligations légales applicables.
          </p>

          <h2 style={sectionTitle}>Vos droits</h2>
          <p style={para}>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, de portabilité et d&apos;opposition au
            traitement de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
          </p>

          <h2 style={sectionTitle}>Cookies</h2>
          <p style={para}>
            Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies
            techniques strictement nécessaires au fonctionnement du site peuvent être
            utilisés.
          </p>
        </div>
      </section>
    </div>
  );
}
